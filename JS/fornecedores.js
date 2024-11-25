
                                // FORNCEDORES

// Função para mostrar o formulário de fornecedor, seja para adicionar ou editar
function showFornecedorForm(action, fornecedorCode = null) {
    hideAllForms();
    document.getElementById('add-fornecedor-form').style.display = 'flex';
    const title = document.getElementById('fornecedor-form-title');
    
    if (action === 'add') {
        title.textContent = "Incluir Novo Fornecedor";
        document.getElementById('fornecedor-code').value = "F" + (fornecedores.length + 1);
        document.getElementById('fornecedor-name').value = '';
        document.getElementById('fornecedor-cnpj').value = '';
        document.getElementById('fornecedor-url').value = '';
        document.getElementById('fornecedor-image').value = '';
        document.getElementById('fornecedor-contact1').value = '';
        document.getElementById('fornecedor-contact2').value = '';
        document.getElementById('fornecedor-contact3').value = '';
        document.getElementById('fornecedor-observation').value = '';
    } else if (action === 'edit') {
        title.textContent = "Editar Fornecedor";
        const fornecedor = fornecedores.find(f => f.code === fornecedorCode);
        if (fornecedor) {
            document.getElementById('fornecedor-code').value = fornecedor.code;
            document.getElementById('fornecedor-name').value = fornecedor.name;
            document.getElementById('fornecedor-cnpj').value = fornecedor.cnpj;
            document.getElementById('fornecedor-url').value = fornecedor.url;
            document.getElementById('fornecedor-contact1').value = fornecedor.contact1;
            document.getElementById('fornecedor-contact2').value = fornecedor.contact2;
            document.getElementById('fornecedor-contact3').value = fornecedor.contact3;
            document.getElementById('fornecedor-observation').value = fornecedor.observation;
        }
    }
}

// Função para salvar fornecedor (novo ou atualizado)
function saveFornecedor() {
    const code = document.getElementById('fornecedor-code').value;
    const name = document.getElementById('fornecedor-name').value;
    const cnpj = document.getElementById('fornecedor-cnpj').value;
    const url = document.getElementById('fornecedor-url').value;
    const contact1 = document.getElementById('fornecedor-contact1').value;
    const contact2 = document.getElementById('fornecedor-contact2').value;
    const contact3 = document.getElementById('fornecedor-contact3').value;
    const observation = document.getElementById('fornecedor-observation').value;

    if (!name) {
        alert("O nome do fornecedor é obrigatório.");
        return;
    }

    const existingIndex = fornecedores.findIndex(f => f.code === code);
    if (existingIndex !== -1) {
        // Atualizar fornecedor existente
        fornecedores[existingIndex] = { code, name, cnpj, url, contact1, contact2, contact3, observation };
        alert("Fornecedor atualizado com sucesso!");
    } else {
        // Adicionar novo fornecedor
        fornecedores.push({ code, name, cnpj, url, contact1, contact2, contact3, observation });
        alert("Fornecedor cadastrado com sucesso!");
    }

    localStorage.setItem('fornecedores', JSON.stringify(fornecedores));
    hideAllForms();
    showFornecedorList();
}

// Função para mostrar a lista de fornecedores com opções de editar e excluir
function showFornecedorList() {
    hideAllForms();
    const fornecedorList = document.getElementById('fornecedor-list');
    fornecedorList.innerHTML = "";

    if (fornecedores.length === 0) {
        fornecedorList.innerHTML = "<p>Nenhum fornecedor cadastrado.</p>";
    } else {
        fornecedores.forEach(fornecedor => {
            const fornecedorItem = document.createElement('div');
            fornecedorItem.classList.add('fornecedor-item');
            
            fornecedorItem.innerHTML = `
                <h4>${fornecedor.name} (Código: ${fornecedor.code})</h4>
                <p><strong>CNPJ:</strong> ${fornecedor.cnpj}</p>
                <p><strong>URL:</strong> <a href="${fornecedor.url}" target="_blank">${fornecedor.url}</a></p>
                <p><strong>Telefone 1:</strong> ${fornecedor.contact1}</p>
                <p><strong>Telefone 2:</strong> ${fornecedor.contact2}</p>
                <p><strong>Telefone 3:</strong> ${fornecedor.contact3}</p>
                <p><strong>Observação:</strong> ${fornecedor.observation}</p>
                <button onclick="showFornecedorForm('edit', '${fornecedor.code}')">Editar</button>
                <button onclick="deleteFornecedor('${fornecedor.code}')">Excluir</button>
            `;
            fornecedorList.appendChild(fornecedorItem);
        });
    }

    document.getElementById('fornecedor-list-section').style.display = 'flex';
}

// Função para excluir um fornecedor pelo código
function deleteFornecedor(fornecedorCode) {
    fornecedores = fornecedores.filter(f => f.code !== fornecedorCode);
    localStorage.setItem('fornecedores', JSON.stringify(fornecedores));
    alert("Fornecedor excluído com sucesso!");
    showFornecedorList();
}

// Função para mostrar uma sub-seção específica dentro da seção de estoque
function showStockSubSection(subSectionId) {
    // Oculta todas as sub-seções primeiro
    document.querySelectorAll('.sub-section').forEach(section => {
        section.style.display = 'none';
    });

    // Exibe apenas a sub-seção selecionada
    document.getElementById(subSectionId).style.display = 'block';
}

function validateCNPJ(input) {
    // Remove qualquer caractere que não seja número
    input.value = input.value.replace(/\D/g, '');

    // Limita a entrada a 14 caracteres, caso o maxlength não funcione em todos os navegadores
    if (input.value.length > 14) {
        input.value = input.value.slice(0, 14);
    }
}

function applyCNPJMask(input) {
    // Remove qualquer caractere que não seja número
    let value = input.value.replace(/\D/g, '');

    // Limita a entrada a 14 dígitos (apenas números, sem os símbolos da máscara)
    if (value.length > 14) {
        value = value.slice(0, 14);
    }

    // Aplica a máscara de CNPJ: 00.000.000/0000-00
    if (value.length <= 2) {
        input.value = value;
    } else if (value.length <= 5) {
        input.value = `${value.slice(0, 2)}.${value.slice(2)}`;
    } else if (value.length <= 8) {
        input.value = `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5)}`;
    } else if (value.length <= 12) {
        input.value = `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5, 8)}/${value.slice(8)}`;
    } else {
        input.value = `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5, 8)}/${value.slice(8, 12)}-${value.slice(12)}`;
    }
}
