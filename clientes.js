
                                         // CLIENTES

// Função para mostrar o formulário de cliente e gerar o código automaticamente para novos cadastros
function showClientForm(formType) {
    hideAllForms();
    const codeElement = document.getElementById('client-code');
    if (formType === 'add') {
        codeElement.value = "C" + (clients.length + 1);
        document.getElementById('add-client-form').style.display = 'flex';
    }
}


  // Função para salvar um novo cliente ou editar um existente
 function saveClient() {
    const code = document.getElementById('client-code').value;
    const name = document.getElementById('client-name').value;
    const contact = document.getElementById('client-contact').value || "";
    const size = document.getElementById('client-size').value || "";
    const observation = document.getElementById('client-obs').value || "";

    if (!name) {
        alert("Nome do cliente é obrigatório!");
        return;
    }

    const existingClientIndex = clients.findIndex(c => c.code === code);
    if (existingClientIndex !== -1) {
        clients[existingClientIndex] = { code, name, contact, size, observation };
        alert("Cliente atualizado com sucesso!");
    } else {
        clients.push({ code, name, contact, size, observation });
        alert("Cliente salvo com sucesso!");
    }

    localStorage.setItem('clients', JSON.stringify(clients));
    hideAllForms();
    showClientList();
}

// Função para mostrar a listagem de clientes
function showClientList() {
    hideAllForms();
    const clientListSection = document.getElementById('client-list-section');
    const clientList = document.getElementById('client-list');
    clientList.innerHTML = "";

    if (clients.length === 0) {
        clientList.innerHTML = "<p>Nenhum cliente cadastrado.</p>";
    } else {
        clients.forEach((client) => {
            const clientItem = document.createElement('div');
            clientItem.innerHTML = `
                <h4>${client.name} (Código: ${client.code})</h4>
                <p><strong>Telefone:</strong> ${client.contact}</p>
                <p><strong>Tamanho Preferido:</strong> ${client.size}</p>
                <p><strong>Observação:</strong> ${client.observation}</p>
                <button onclick="editClient('${client.code}')">Editar</button>
                <button onclick="deleteClient('${client.code}')">Excluir</button>
            `;
            clientList.appendChild(clientItem);
        });
    }
    clientListSection.style.display = 'flex';
}

// Função para excluir um cliente pelo código
function deleteClient(clientCode) {
    clients = clients.filter(client => client.code !== clientCode);
    localStorage.setItem('clients', JSON.stringify(clients));
    alert("Cliente excluído com sucesso!");
    showClientList();
}

// Função para carregar os dados do cliente no formulário de edição
function editClient(clientCode) {
    const client = clients.find(c => c.code === clientCode);
    if (!client) {
        alert("Cliente não encontrado!");
        return;
    }

    document.getElementById('client-code').value = client.code;
    document.getElementById('client-name').value = client.name;
    document.getElementById('client-contact').value = client.contact;
    document.getElementById('client-size').value = client.size;
    document.getElementById('client-obs').value = client.observation;

    hideAllForms();
    document.getElementById('add-client-form').style.display = 'flex';
}

// Função para carregar e exibir fornecedores na lista de seleção do formulário de produtos
function loadSuppliers() {
    const supplierSelect = document.getElementById('product-supplier');
    supplierSelect.innerHTML = ''; // Limpa o campo de seleção

    if (fornecedores.length === 0) {
        // Caso não haja fornecedores cadastrados, exibe uma opção padrão
        supplierSelect.innerHTML = '<option value="">Nenhum fornecedor cadastrado</option>';
    } else {
        // Adiciona uma opção vazia inicial
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "Selecione um Fornecedor";
        supplierSelect.appendChild(defaultOption);

        // Adiciona cada fornecedor ao campo de seleção
        fornecedores.forEach(fornecedor => {
            const option = document.createElement('option');
            option.value = fornecedor.code; // Define o código do fornecedor como valor
            option.textContent = fornecedor.name; // Exibe o nome no dropdown
            supplierSelect.appendChild(option);
        });
    }
}
