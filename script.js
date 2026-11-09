class Usuario {
    constructor(nome, email, senha, papel) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
        this.papel = papel;
    }
}

class Cliente extends Usuario {
    constructor(nome, email, senha) {
        super(nome, email, senha, 'cliente');
    }
}

class Barbeiro extends Usuario {
    constructor(nome, email, senha, codigoAcesso) {
        super(nome, email, senha, 'barbeiro');
        this.codigoAcesso = codigoAcesso;
    }
}

class UsuarioRepository {
    constructor() {
        this.usuarios = [];
    }

    cadastrarUsuario(dados) {
        if (!dados.nome || !dados.email || !dados.senha || !dados.papel) {
            throw new Error("Erro: Todos os campos obrigatórios devem ser preenchidos.");
        }

        const emailExiste = this.usuarios.some(u => u.email === dados.email);
        if (emailExiste) {
            throw new Error("Erro: Este e-mail já está cadastrado no sistema.");
        }

        let novoUsuario;

        if (dados.papel === 'barbeiro') {
            const codigoMestreBarbearia = "BARBEARIA123";
            
            if (!dados.codigoAcesso) {
                throw new Error("Erro: O código de acesso da barbearia é obrigatório para barbeiros.");
            }
            if (dados.codigoAcesso !== codigoMestreBarbearia) {
                throw new Error("Erro: Código de acesso da barbearia incorreto.");
            }

            novoUsuario = new Barbeiro(dados.nome, dados.email, dados.senha, dados.codigoAcesso);
        } else if (dados.papel === 'cliente') {
            novoUsuario = new Cliente(dados.nome, dados.email, dados.senha);
        } else {
            throw new Error("Erro: Papel de usuário inválido.");
        }

        this.usuarios.push(novoUsuario);
        
        return {
            sucesso: true,
            mensagem: `Usuário ${dados.nome} cadastrado com sucesso!`,
            usuario: novoUsuario
        };
    }

    listar() {
        return this.usuarios;
    }
}

const repo = new UsuarioRepository();

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formCadastro');
    const tipoSelect = document.getElementById('Tipo'); // Aqui aponta para o ID 'Tipo' do seu HTML
    const campoCodigo = document.getElementById('campoCodigo');
    const mensagemDiv = document.getElementById('mensagem');

    if (tipoSelect) {
        tipoSelect.addEventListener('change', () => {
            if (tipoSelect.value === 'barbeiro') {
                campoCodigo.style.display = 'block';
            } else {
                campoCodigo.style.display = 'none';
                document.getElementById('codigoAcesso').value = '';
            }
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const dados = {
                nome: document.getElementById('nome').value,
                email: document.getElementById('email').value,
                senha: document.getElementById('senha').value,
                papel: tipoSelect ? tipoSelect.value : 'cliente',
                codigoAcesso: document.getElementById('codigoAcesso').value
            };

            try {
                const resultado = repo.cadastrarUsuario(dados);
                mensagemDiv.style.color = 'green';
                mensagemDiv.textContent = resultado.mensagem;
                form.reset();
                campoCodigo.style.display = 'none';
                console.log("Lista atual de usuários:", repo.listar());
            } catch (erro) {
                mensagemDiv.style.color = 'red';
                mensagemDiv.textContent = erro.message;
            }
        });
    }
});