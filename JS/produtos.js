                                      //PRODUTOS


// Função para exibir o formulário de cadastro de produto e gerar o código automaticamente
//exibirFormularioProduto
function showProductForm() {
    hideAllForms();
    document.getElementById('product-code').value = "P" + (products.length + 1); // Gera o código do produto
    loadSuppliers(); // Carrega os fornecedores
    document.getElementById('add-product-form').style.display = 'flex';
}


// Função para adicionar uma variação no modo de adição
function addVariation() {
    const size = document.getElementById('variation-size').value;

    if (!size) {
        alert("Tamanho é obrigatório.");
        return;
    }

    const variationCode = `V${products.length + 1}-${currentVariations.length + 1}`;
    currentVariations.push({ variationCode, size });
    renderVariationsList('product-variations-list', currentVariations);
    
    document.getElementById('variation-size').value = '';
}

// Função para salvar um novo produto
function saveProduct() {
    const selectedSizes = Array.from(
        document.querySelectorAll("#product-sizes input[type='checkbox']:checked")
    ).map(checkbox => checkbox.value);

    const product = {
        code: document.getElementById("product-code").value,
        name: document.getElementById("product-name").value,
        costPrice: parseFloat(document.getElementById("product-cost-price").value) || 0,
        salePrice: parseFloat(document.getElementById("product-sale-price").value) || 0,
        supplier: document.getElementById("product-supplier").value,
        observation: document.getElementById("product-observation").value,
        sizes: selectedSizes, // Adiciona os tamanhos selecionados
        imageURL: document.getElementById("product-image").files[0]
            ? URL.createObjectURL(document.getElementById("product-image").files[0])
            : ""
    };

    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));

    alert("Produto salvo com sucesso!");
    hideAllForms();
    showProductList();
}

// Função para exibir a lista de produtos
function showProductList() {
    hideAllForms();
    const productList = document.getElementById('product-list');
    productList.innerHTML = ""; // Limpa a lista antes de renderizar

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');

        // Busca o nome do fornecedor com base no código do fornecedor do produto
        const fornecedor = fornecedores.find(f => f.code === product.supplier);
        const fornecedorName = fornecedor ? fornecedor.name : "Fornecedor não encontrado";

        // Adiciona os tamanhos, se houver
        const sizes = product.sizes && product.sizes.length > 0
            ? product.sizes.join(", ") // Junta os tamanhos em uma string separada por vírgulas
            : "Nenhum tamanho cadastrado";

        productItem.innerHTML = `
            <img src="${product.imageURL || 'default-image.jpg'}" alt="${product.name || 'Sem Nome'}" style="max-width: 100px; max-height: 100px;">
            <h4>${product.name || 'Sem Nome'} (Código: ${product.code || 'N/A'})</h4>
            <p><strong>Preço de Venda:</strong> R$ ${(product.salePrice ? product.salePrice.toFixed(2) : '0.00')}</p>
            <p><strong>Preço de Custo:</strong> R$ ${(product.costPrice ? product.costPrice.toFixed(2) : '0.00')}</p>
            <p><strong>Fornecedor:</strong> ${fornecedorName}</p>
            <p><strong>Observação:</strong> ${product.observation || 'Sem Observação'}</p>
            <p><strong>Tamanhos Disponíveis:</strong> ${sizes}</p>
            <button onclick="editProduct('${product.code}')">Editar</button>
            <button onclick="deleteProduct('${product.code}')">Excluir</button>
        `;

        productList.appendChild(productItem);
    });

    document.getElementById('product-list-section').style.display = 'flex';
}


// Função para abrir o formulário de edição e preencher com os dados do produto selecionado
function editProduct(productId) {
    document.getElementById('edit-product-form').style.display = 'block';
    const product = products.find(p => p.code === productId);

    if (product) {
        document.getElementById('edit-product-code').value = product.code;
        document.getElementById('edit-product-name').value = product.name;
        document.getElementById('edit-product-cost-price').value = product.costPrice;
        document.getElementById('edit-product-sale-price').value = product.salePrice;
        document.getElementById('edit-product-observation').value = product.observation || "";

        // Carregar os tamanhos marcados
        const sizeCheckboxes = document.querySelectorAll("#edit-product-sizes input[type='checkbox']");
        sizeCheckboxes.forEach(checkbox => {
            checkbox.checked = product.sizes.includes(checkbox.value);
        });

        // Carregar os fornecedores no seletor
        const supplierSelect = document.getElementById('edit-product-supplier');
        supplierSelect.innerHTML = ''; // Limpa o seletor
        fornecedores.forEach(fornecedor => {
            const option = document.createElement('option');
            option.value = fornecedor.code;
            option.textContent = fornecedor.name;
            if (product.supplier === fornecedor.code) {
                option.selected = true; // Marca o fornecedor atual como selecionado
            }
            supplierSelect.appendChild(option);
        });

        // Limpar o campo de imagem
        document.getElementById('edit-product-image').value = "";
    } else {
        alert("Produto não encontrado.");
    }
}

function getProductById(productId) {
    // Exemplo de lista de produtos com variações; substitua pelos dados reais
    const products = [
        {
            id: 'P1',
            name: 'Produto 1',
            costPrice: '10.00',
            salePrice: '15.00',
            supplier: 'Fornecedor X',
            observation: 'Observação sobre o produto',
            variations: [
                { size: 'P' },
                { size: 'M' },
                { size: 'G' }
            ]
        },
        // Outros produtos...
    ];

    return products.find(product => product.id === productId);
}


// Função para salvar as alterações no produto
function saveEditedProduct() {
    const code = document.getElementById('edit-product-code').value;
    const productIndex = products.findIndex(p => p.code === code);

    if (productIndex === -1) {
        alert("Produto não encontrado.");
        return;
    }

    // Atualiza os campos do produto
    products[productIndex].name = document.getElementById('edit-product-name').value;
    products[productIndex].costPrice = parseFloat(document.getElementById('edit-product-cost-price').value) || 0;
    products[productIndex].salePrice = parseFloat(document.getElementById('edit-product-sale-price').value) || 0;
    products[productIndex].supplier = document.getElementById('edit-product-supplier').value;
    products[productIndex].observation = document.getElementById('edit-product-observation').value;

    // Atualiza os tamanhos selecionados
    const selectedSizes = Array.from(
        document.querySelectorAll("#edit-product-sizes input[type='checkbox']:checked")
    ).map(checkbox => checkbox.value);
    products[productIndex].sizes = selectedSizes;

    // Atualiza a imagem, caso uma nova seja enviada
    const newImage = document.getElementById('edit-product-image').files[0];
    if (newImage) {
        products[productIndex].imageURL = URL.createObjectURL(newImage);
    }

    // Salva os dados atualizados no localStorage
    localStorage.setItem("products", JSON.stringify(products));

    alert("Produto atualizado com sucesso!");
    hideAllForms();
    showProductList();
}

// Função para renderizar lista de variações no formulário de edição
function renderVariationsList(elementId, variations) {
    const list = document.getElementById(elementId);
    list.innerHTML = '';
    variations.forEach((variation, index) => {
        const item = document.createElement('p');
        item.textContent = `Tamanho: ${variation.size}`;
        list.appendChild(item);
    });
}

// Função para excluir um produto
function deleteProduct(productCode) {
    products = products.filter(product => product.code !== productCode);
    localStorage.setItem('products', JSON.stringify(products));
    alert("Produto excluído com sucesso!");
    showProductList();
}



// Função para carregar fornecedores no campo de seleção
function loadSuppliers() {
    const supplierSelect = document.getElementById('product-supplier');
    supplierSelect.innerHTML = ''; // Limpa o campo de seleção

    if (fornecedores.length === 0) {
        supplierSelect.innerHTML = '<option value="">Nenhum fornecedor cadastrado</option>';
    } else {
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "Selecione um Fornecedor";
        supplierSelect.appendChild(defaultOption);

        fornecedores.forEach(fornecedor => {
            const option = document.createElement('option');
            option.value = fornecedor.code; // Define o código do fornecedor como valor
            option.textContent = fornecedor.name; // Exibe o nome do fornecedor
            supplierSelect.appendChild(option);
        });
    }
    console.log("Fornecedores carregados:", fornecedores); // Para verificar se os fornecedores são carregados corretamente
}

                                      //FATURAMENTO

// Função para exibir o formulário de faturamento
function showInvoiceProductForm() {
    hideAllForms();
    document.getElementById('invoice-product-form').style.display = 'flex';
    document.getElementById('product-search-input').value = ''; 
    document.getElementById('product-results').innerHTML = '';
}

// Função para preencher o dropdown de códigos de produtos no faturamento
function populateProductCodes() {
    const productSelect = document.getElementById('invoice-product-code');
    productSelect.innerHTML = ''; // Limpa o campo de seleção antes de adicionar novos produtos

    // Carrega a lista de produtos do localStorage
    const savedProducts = JSON.parse(localStorage.getItem('products')) || [];
    if (savedProducts.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Nenhum produto disponível para faturamento';
        productSelect.appendChild(option);
    } else {
        savedProducts.forEach(product => {
            const option = document.createElement('option');
            option.value = product.code;
            option.textContent = `${product.name} (Código: ${product.code})`;
            productSelect.appendChild(option);
        });
    }
}

// Função para buscar produtos com base no termo de pesquisa
function searchProduct() {
    const searchTerm = document.getElementById('product-search-input').value.toLowerCase();
    const productResults = document.getElementById('product-results');
    productResults.innerHTML = "";

    // Filtra produtos baseados no termo de busca
    const filteredProducts = products.filter(product =>
        product.code.toLowerCase().includes(searchTerm) ||
        product.name.toLowerCase().includes(searchTerm)
    );

    // Renderiza os resultados ou exibe mensagem de erro
    if (filteredProducts.length === 0) {
        productResults.innerHTML = "<p>Nenhum produto encontrado.</p>";
        return;
    }

    filteredProducts.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <p><strong>Código:</strong> ${product.code}</p>
            <p><strong>Nome:</strong> ${product.name}</p>
            <p><strong>Preço de Venda Atual:</strong> R$ ${product.salePrice.toFixed(2)}</p>
            <button onclick="selectProductToInvoice('${product.code}')">Selecionar</button>
        `;
        productResults.appendChild(productItem);
    });
}

// Função para selecionar o produto e exibir o campo de alteração de preço
function selectProductToInvoice(productCode) {
    const product = products.find(p => p.code === productCode);
    if (product) {
        document.getElementById('selected-product-details').innerHTML = `
            <p><strong>Produto Selecionado:</strong> ${product.name} (Código: ${product.code})</p>
            <p><strong>Preço de Venda Atual:</strong> R$ ${product.salePrice.toFixed(2)}</p>
        `;
        document.getElementById('new-sale-price').value = '';
        document.getElementById('invoice-product-details').style.display = 'block';
        document.getElementById('selected-product-code').value = productCode;
    } else {
        alert("Produto não encontrado.");
    }
}


// Função para atualizar o preço de venda do produto selecionado
function invoiceProduct() {
    const selectedCode = document.getElementById('selected-product-code').value;
    const newSalePriceInput = document.getElementById('new-sale-price').value;
    const newSalePrice = parseFloat(newSalePriceInput.replace(",", "."));

    if (!selectedCode) {
        alert("Por favor, selecione um produto.");
        return;
    }

    if (isNaN(newSalePrice) || newSalePrice <= 0) {
        alert("Insira um valor válido para o novo preço de venda.");
        return;
    }

    // Carrega produtos e encontra o produto selecionado
    const productIndex = products.findIndex(p => p.code === selectedCode);

    if (productIndex !== -1) {
        // Atualiza o preço de venda no cadastro do produto
        products[productIndex].salePrice = newSalePrice;

        // Salva a lista de produtos atualizada no localStorage
        localStorage.setItem('products', JSON.stringify(products));

        // Atualiza o preço na interface
        document.getElementById('selected-product-details').innerHTML = `
            <p><strong>Produto Selecionado:</strong> ${products[productIndex].name} (Código: ${products[productIndex].code})</p>
            <p><strong>Preço de Venda Atual:</strong> R$ ${products[productIndex].salePrice.toFixed(2)}</p>
        `;

        // Exibe mensagem de sucesso
        document.getElementById('invoice-message').textContent = "Preço atualizado com sucesso!";
        document.getElementById('invoice-message').style.color = "green";

        // Opcional: esconde o formulário de edição após salvar
        setTimeout(() => {
            document.getElementById('invoice-product-details').style.display = 'none';
        }, 2000);
    } else {
        alert("Produto não encontrado.");
    }
}
