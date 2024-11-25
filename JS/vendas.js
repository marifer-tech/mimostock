
                                 // VENDAS


                                 
// Função para mostrar o formulário de acordo com a opção escolhida
function showVendaForm(formType) {
    document.getElementById('realizar-venda-form').style.display = 'none';
    document.getElementById('pesquisar-venda-form').style.display = 'none';
    document.getElementById('relatorio-venda-form').style.display = 'none';

    if (formType === 'realizar') {
        loadSaleOptions();
        document.getElementById('realizar-venda-form').style.display = 'block';
    } else if (formType === 'pesquisar') {
        document.getElementById('pesquisar-venda-form').style.display = 'block';
    } else if (formType === 'relatorio') {
        document.getElementById('relatorio-venda-form').style.display = 'block';
    }
}

// Função para carregar clientes e produtos nas listas de seleção
function loadSaleOptions() {
    const clientSelect = document.getElementById('sale-client');
    const productSelect = document.getElementById('sale-product');
    
    clientSelect.innerHTML = "";
    productSelect.innerHTML = "";

    // Popula clientes
    clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.code;
        option.textContent = `${client.name} (Código: ${client.code})`;
        clientSelect.appendChild(option);
    });

    // Popula produtos
    inventory.forEach(product => {
        const option = document.createElement('option');
        option.value = product.code;
        option.textContent = `${product.name} (Estoque: ${product.quantity})`;
        productSelect.appendChild(option);
    });
}

// Função para processar a venda
function processSale() {
    const clientCode = document.getElementById('sale-client').value;
    const productCode = document.getElementById('sale-product').value;
    const quantity = parseInt(document.getElementById('sale-quantity').value);
    const vendedor = document.getElementById('sale-vendedor').value;

    if (!clientCode || !productCode || isNaN(quantity) || quantity <= 0 || !vendedor) {
        document.getElementById('sale-message').textContent = "Preencha todos os campos corretamente.";
        return;
    }

    const product = inventory.find(p => p.code === productCode);
    if (product.quantity < quantity) {
        document.getElementById('sale-message').textContent = "Quantidade insuficiente em estoque.";
        return;
    }

    product.quantity -= quantity;
    localStorage.setItem('inventory', JSON.stringify(inventory));  // Atualiza o inventário no localStorage

    const sale = {
        clientCode,
        productCode,
        quantity,
        vendedor,
        date: new Date().toLocaleString(),
    };
    sales.push(sale);
    localStorage.setItem('sales', JSON.stringify(sales));

    document.getElementById('sale-message').textContent = "Venda realizada com sucesso!";
    document.getElementById('sale-quantity').value = "";
    document.getElementById('sale-vendedor').value = "";
    loadSaleOptions();
}

// Função para pesquisar vendas com base nos filtros
function searchSales() {
    const date = document.getElementById('search-date').value;
    const client = document.getElementById('search-client').value.toLowerCase();
    const product = document.getElementById('search-product').value.toLowerCase();
    const vendedor = document.getElementById('search-vendedor').value.toLowerCase();

    const results = sales.filter(sale => {
        const matchesDate = !date || new Date(sale.date).toLocaleDateString() === new Date(date).toLocaleDateString();
        const matchesClient = !client || sale.clientCode.toLowerCase().includes(client);
        const matchesProduct = !product || sale.productCode.toLowerCase().includes(product);
        const matchesVendedor = !vendedor || sale.vendedor.toLowerCase().includes(vendedor);
        return matchesDate && matchesClient && matchesProduct && matchesVendedor;
    });

    document.getElementById('search-results').innerHTML = results.length
        ? results.map(sale => `<p>Venda de ${sale.quantity} unidade(s) do produto ${sale.productCode} para o cliente ${sale.clientCode} em ${sale.date} por ${sale.vendedor}</p>`).join("")
        : "Nenhuma venda encontrada.";
}

// Função para gerar um relatório de vendas com base nos filtros
function generateReport() {
    const startDate = new Date(document.getElementById('report-start-date').value);
    const endDate = new Date(document.getElementById('report-end-date').value);
    const client = document.getElementById('report-client').value.toLowerCase();
    const product = document.getElementById('report-product').value.toLowerCase();
    const vendedor = document.getElementById('report-vendedor').value.toLowerCase();

    const results = sales.filter(sale => {
        const saleDate = new Date(sale.date);
        const matchesDate = (!isNaN(startDate) && !isNaN(endDate)) ? (saleDate >= startDate && saleDate <= endDate) : true;
        const matchesClient = !client || sale.clientCode.toLowerCase().includes(client);
        const matchesProduct = !product || sale.productCode.toLowerCase().includes(product);
        const matchesVendedor = !vendedor || sale.vendedor.toLowerCase().includes(vendedor);
        return matchesDate && matchesClient && matchesProduct && matchesVendedor;
    });

    document.getElementById('report-results').innerHTML = results.length
        ? results.map(sale => `<p>${sale.date} - ${sale.quantity} unidade(s) do produto ${sale.productCode} vendido para ${sale.clientCode} por ${sale.vendedor}</p>`).join("")
        : "Nenhuma venda encontrada para o relatório.";
}


                                                    


                                        //VENDEDORES
                                        
// Função para vendedores
function showVendedorForm(action, vendedorCode = null) {
    hideAllForms();
    document.getElementById('add-vendedor-form').style.display = 'flex';

    if (action === 'add') {
        document.getElementById('vendedor-form-title').textContent = "Incluir Novo Vendedor";
        document.getElementById('vendedor-code').value = "V" + (vendedores.length + 1);
        document.getElementById('vendedor-name').value = '';
        document.getElementById('vendedor-contact').value = '';
        document.getElementById('vendedor-stock').value = 'big-pack-1';
    } else if (action === 'edit') {
        document.getElementById('vendedor-form-title').textContent = "Editar Vendedor";
        const vendedor = vendedores.find(v => v.code === vendedorCode);
        if (vendedor) {
            document.getElementById('vendedor-code').value = vendedor.code;
            document.getElementById('vendedor-name').value = vendedor.name;
            document.getElementById('vendedor-contact').value = vendedor.contact;
            document.getElementById('vendedor-stock').value = vendedor.stock;
        }
    }
}

// Função para salvar os vendedores
function saveVendedor() {
    const code = document.getElementById('vendedor-code').value;
    const name = document.getElementById('vendedor-name').value;
    const contact = document.getElementById('vendedor-contact').value;
    const stock = document.getElementById('vendedor-stock').value;

    if (!name) {
        alert("O nome do vendedor é obrigatório!");
        return;
    }

    const existingVendedorIndex = vendedores.findIndex(v => v.code === code);

    if (existingVendedorIndex !== -1) {
        vendedores[existingVendedorIndex] = { code, name, contact, stock };
        alert("Vendedor atualizado com sucesso!");
    } else {
        vendedores.push({ code, name, contact, stock });
        alert("Vendedor cadastrado com sucesso!");
    }

    localStorage.setItem('vendedores', JSON.stringify(vendedores));
    hideAllForms();
    showVendedorList();
}

f

// Função para mostrar a lista de vendedores
function showVendedorList() {
    hideAllForms();
    const vendedorList = document.getElementById('vendedor-list');
    vendedorList.innerHTML = "";

    if (vendedores.length === 0) {
        vendedorList.innerHTML = "<p>Nenhum vendedor cadastrado.</p>";
    } else {
        vendedores.forEach(vendedor => {
            const vendedorItem = document.createElement('div');
            vendedorItem.classList.add('vendedor-item');
            vendedorItem.innerHTML = `
                <h4>${vendedor.name} (Código: ${vendedor.code})</h4>
                <p><strong>Telefone:</strong> ${vendedor.contact}</p>
                <p><strong>Estoque Vinculado:</strong> ${vendedor.stock.toUpperCase()}</p>
                <button onclick="showVendedorForm('edit', '${vendedor.code}')">Editar</button>
                <button onclick="deleteVendedor('${vendedor.code}')">Excluir</button>
            `;
            vendedorList.appendChild(vendedorItem);
        });
    }

    document.getElementById('vendedor-list-section').style.display = 'flex';
}

// Função para deletar vendedores 
function deleteVendedor(vendedorCode) {
    vendedores = vendedores.filter(v => v.code !== vendedorCode);
    localStorage.setItem('vendedores', JSON.stringify(vendedores));
    alert("Vendedor excluído com sucesso!");
    showVendedorList();
}