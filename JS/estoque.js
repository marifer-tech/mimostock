
// Função para atualizar a lista de produtos nos estoques
function updateStockDisplay(stock, displayElementId) {
    const displayElement = document.getElementById(displayElementId);
    displayElement.innerHTML = '';

    if (stock.length === 0) {
        displayElement.innerHTML = '<p>Estoque vazio.</p>';
        return;
    }

    stock.forEach(product => {
        const productItem = document.createElement('div');
        productItem.innerHTML = `
            <p><strong>${product.name}</strong> (Código: ${product.code})</p>
            <p>Quantidade: ${product.quantity}</p>
        `;
        displayElement.appendChild(productItem);
    });
}

// Função para entrada no Estoque Principal
function addToMainStock() {
    const codeOrName = document.getElementById('product-code-name').value.trim().toLowerCase();
    const quantity = parseInt(document.getElementById('entry-quantity').value);

    if (!codeOrName || isNaN(quantity) || quantity <= 0) {
        alert('Preencha todos os campos corretamente.');
        return;
    }

    const product = products.find(p =>
        p.code.toLowerCase() === codeOrName ||
        p.name.toLowerCase() === codeOrName
    );

    if (product) {
        const stockProduct = estoquePrincipal.find(p => p.code === product.code);
        if (stockProduct) {
            stockProduct.quantity += quantity;
        } else {
            estoquePrincipal.push({ code: product.code, name: product.name, quantity });
        }

        alert('Produto adicionado ao Estoque Principal.');
        updateStockDisplay(estoquePrincipal, 'estoque-principal-display');
    } else {
        alert('Produto não encontrado.');
    }

    // Limpar campos
    document.getElementById('product-code-name').value = '';
    document.getElementById('entry-quantity').value = '';
}

// Função para redistribuir produtos entre os estoques
function redistributeStock() {
    const checkboxes = document.querySelectorAll('.redistribute-checkbox:checked');
    const targetStock = document.getElementById('redistribute-target').value;

    if (!targetStock) {
        alert('Selecione o estoque de destino.');
        return;
    }

    if (checkboxes.length === 0) {
        alert('Selecione pelo menos um produto para redistribuir.');
        return;
    }

    const targetStockArray = targetStock === 'bigPack1' ? bigPack1 : bigPack2;

    checkboxes.forEach(checkbox => {
        const productCode = checkbox.dataset.productCode;
        const transferQuantity = parseInt(checkbox.dataset.transferQuantity);

        const mainStockProduct = estoquePrincipal.find(p => p.code === productCode);

        if (mainStockProduct && transferQuantity <= mainStockProduct.quantity) {
            mainStockProduct.quantity -= transferQuantity;

            const targetProduct = targetStockArray.find(p => p.code === productCode);
            if (targetProduct) {
                targetProduct.quantity += transferQuantity;
            } else {
                targetStockArray.push({
                    code: productCode,
                    name: mainStockProduct.name,
                    quantity: transferQuantity,
                });
            }

            if (mainStockProduct.quantity === 0) {
                estoquePrincipal = estoquePrincipal.filter(p => p.code !== productCode);
            }
        } else {
            alert(`Quantidade inválida para o produto ${productCode}.`);
        }
    });

    alert('Redistribuição concluída.');
    updateStockDisplay(estoquePrincipal, 'estoque-principal-display');
    updateStockDisplay(bigPack1, 'big-pack1-display');
    updateStockDisplay(bigPack2, 'big-pack2-display');
}

// Função para consultar os estoques
function searchStock() {
    const searchTerm = document.getElementById('stock-search-input').value.trim().toLowerCase();
    const stockResults = document.getElementById('stock-results');
    stockResults.innerHTML = '';

    const allStocks = [...estoquePrincipal, ...bigPack1, ...bigPack2];

    const filteredProducts = allStocks.filter(product =>
        product.code.toLowerCase().includes(searchTerm) ||
        product.name.toLowerCase().includes(searchTerm)
    );

    if (filteredProducts.length === 0) {
        stockResults.innerHTML = '<p>Nenhum produto encontrado.</p>';
        return;
    }

    filteredProducts.forEach(product => {
        const productItem = document.createElement('div');
        productItem.innerHTML = `
            <p><strong>${product.name}</strong> (Código: ${product.code})</p>
            <p>Quantidade: ${product.quantity}</p>
        `;
        stockResults.appendChild(productItem);
    });
}

// Inicializar as seções de estoque
function initializeStockSections() {
    updateStockDisplay(estoquePrincipal, 'estoque-principal-display');
    updateStockDisplay(bigPack1, 'big-pack1-display');
    updateStockDisplay(bigPack2, 'big-pack2-display');
}

function showStockSection() {
    hideAllForms(); // Esconde todas as outras seções
    document.getElementById('stock-section').style.display = 'block';
    document.getElementById('login-section').style.display = 'none'; // Esconde o login
}