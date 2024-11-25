console.log("JavaScript carregado corretamente.");

let products = [];
let vendedores = [];
let clients = [];
let currentVariations = [];  // Para novas variações em produtos
let editVariations = [];     // Para variações ao editar um produto
let sales = [];  // Array para armazenar as vendas
let fornecedores = [];
let estoquePrincipal = [];
let bigPack1 = [];
let bigPack2 = [];



function login() {
    const username = document.getElementById('username').value.toLowerCase();
    const password = document.getElementById('password').value;

    if (username === "" && password === "") { // Substitua pelas credenciais corretas
        // Salva o estado de login
        sessionStorage.setItem("isLoggedIn", "true");

        // Esconde a tela de login e exibe o menu principal
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('menu-section').style.display = 'flex';
    } else {
        document.getElementById('login-message').textContent = 'Usuário ou senha incorretos';
    }
}
// Função para deslogar
function logout() {
    // Remove o estado de login
    sessionStorage.removeItem("isLoggedIn");

    // Exibe a tela de login e esconde o menu
    document.getElementById('menu-section').style.display = 'none';
    document.getElementById('login-section').style.display = 'flex';
}


// Função de navegação "Voltar" para retornar ao painel de controle
function goBack() {
    hideAllForms();
    document.getElementById('menu-section').style.display = 'flex'; // Exibir menu principal
}

// Função para exibir seções
function showSection(sectionId) {
    hideAllForms();
    const section = document.getElementById(`${sectionId}-section`);
    if (section) section.style.display = 'flex';
    else console.error(`Seção '${sectionId}-section' não encontrada.`);
}

// Ocultar todas as seções
function hideAllForms() {
    document.querySelectorAll('.form-section, .section').forEach(section => section.style.display = 'none');
}


