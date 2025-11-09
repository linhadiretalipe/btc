// Main Application Logic
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupTabs();
    setupSearch();
    setupTerminal();
    renderAllCommands();
    
    // Load commands for each category
    renderCommands('blockchain', 'blockchainCommands');
    renderCommands('wallet', 'walletCommands');
    renderCommands('transacoes', 'transacoesCommands');
    renderCommands('rede', 'redeCommands');
    renderCommands('mineracao', 'mineracaoCommands');
    renderCommands('utilitarios', 'utilitariosCommands');
}

// Tab Navigation
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            button.classList.add('active');
            const targetContent = document.getElementById(targetTab);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Search Functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearSearchBtn = document.getElementById('clearSearch');
    const searchHint = document.getElementById('searchHint');
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim().toLowerCase();
        
        if (searchTerm) {
            clearSearchBtn.style.display = 'block';
            
            // Clear previous timeout
            clearTimeout(searchTimeout);
            
            // Check if command exists and show hint
            if (commandCategoryMap[searchTerm]) {
                const category = commandCategoryMap[searchTerm];
                const categoryNames = {
                    blockchain: 'Blockchain',
                    wallet: 'Carteira',
                    transacoes: 'Transações',
                    rede: 'Rede',
                    mineracao: 'Mineração',
                    utilitarios: 'Utilitários'
                };
                
                searchHint.textContent = `💡 Aguardando 2 segundos para auto-selecionar a aba: ${categoryNames[category]}`;
                searchHint.style.display = 'block';
                searchHint.style.color = '#d97706';
                
                // Auto-switch tab after 2 seconds
                searchTimeout = setTimeout(() => {
                    const tabButton = document.querySelector(`[data-tab="${category}"]`);
                    if (tabButton) {
                        tabButton.click();
                        showToast(`Comando encontrado na aba: ${categoryNames[category]}`, 'success');
                    }
                }, 2000);
            } else if (searchTerm.length > 2) {
                searchHint.textContent = '⚠️ Comando não reconhecido. Use a busca para filtrar os comandos abaixo.';
                searchHint.style.display = 'block';
                searchHint.style.color = '#d97706';
            }
            
            // Filter commands in current tab
            filterCommands(searchTerm);
        } else {
            clearSearchBtn.style.display = 'none';
            searchHint.style.display = 'none';
            clearSearch();
        }
    });
    
    clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        searchHint.style.display = 'none';
        clearSearch();
    });
}

function filterCommands(searchTerm) {
    const activeTab = document.querySelector('.tab-content.active');
    if (!activeTab) return;
    
    const commandCards = activeTab.querySelectorAll('.command-card');
    let found = false;
    
    commandCards.forEach(card => {
        const commandName = card.querySelector('.command-name').textContent.toLowerCase();
        const commandDescription = card.querySelector('.command-description').textContent.toLowerCase();
        
        if (commandName.includes(searchTerm) || commandDescription.includes(searchTerm)) {
            card.style.display = 'block';
            found = true;
        } else {
            card.style.display = 'none';
        }
    });
    
    if (!found && searchTerm.length > 2) {
        // Show message if no commands found
        const commandsList = activeTab.querySelector('.commands-list, .commands-grid');
        if (commandsList && !commandsList.querySelector('.no-results')) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.style.padding = '2rem';
            noResults.style.textAlign = 'center';
            noResults.style.color = '#6b7280';
            noResults.innerHTML = '<p>Nenhum comando encontrado para: <strong>' + searchTerm + '</strong></p>';
            commandsList.appendChild(noResults);
        }
    } else {
        // Remove no results message
        const noResults = activeTab.querySelector('.no-results');
        if (noResults) {
            noResults.remove();
        }
    }
}

function clearSearch() {
    const activeTab = document.querySelector('.tab-content.active');
    if (!activeTab) return;
    
    const commandCards = activeTab.querySelectorAll('.command-card');
    commandCards.forEach(card => {
        card.style.display = 'block';
    });
    
    const noResults = activeTab.querySelector('.no-results');
    if (noResults) {
        noResults.remove();
    }
}

// Terminal Functionality
function setupTerminal() {
    const executeBtn = document.getElementById('executeBtn');
    const commandInput = document.getElementById('commandInput');
    const jqFilter = document.getElementById('jqFilter');
    const clearHistoryBtn = document.getElementById('clearHistory');
    const exampleButtons = document.querySelectorAll('.example-btn');
    
    executeBtn.addEventListener('click', executeCommand);
    commandInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            executeCommand();
        }
    });
    
    clearHistoryBtn.addEventListener('click', () => {
        const terminalOutput = document.getElementById('terminalOutput');
        terminalOutput.innerHTML = '<div class="terminal-empty"><i class="fas fa-terminal"></i><p>Nenhum comando executado ainda</p><p class="empty-hint">Digite um comando acima e clique em Executar</p></div>';
        clearHistoryBtn.style.display = 'none';
    });
    
    exampleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const cmd = btn.getAttribute('data-cmd');
            const filter = btn.getAttribute('data-filter');
            commandInput.value = cmd;
            jqFilter.value = filter || '';
            executeCommand();
        });
    });
}

function executeCommand() {
    const commandInput = document.getElementById('commandInput');
    const jqFilter = document.getElementById('jqFilter');
    const terminalOutput = document.getElementById('terminalOutput');
    const clearHistoryBtn = document.getElementById('clearHistory');
    
    const command = commandInput.value.trim();
    const filter = jqFilter.value.trim();
    
    if (!command) {
        showToast('Por favor, digite um comando', 'error');
        return;
    }
    
    // Remove empty state
    if (terminalOutput.querySelector('.terminal-empty')) {
        terminalOutput.innerHTML = '';
    }
    
    clearHistoryBtn.style.display = 'block';
    
    // Find command data
    const commandData = findCommand(command);
    let response = null;
    
    if (commandData && commandData.example) {
        response = commandData.example.response;
    } else {
        // Generate mock response for unknown commands
        response = generateMockResponse(command);
    }
    
    // Apply jq filter if provided
    let filteredResponse = response;
    if (filter) {
        try {
            filteredResponse = applyJqFilter(response, filter);
        } catch (error) {
            showToast('Erro ao aplicar filtro jq: ' + error.message, 'error');
            filteredResponse = { error: 'Filtro jq inválido: ' + error.message };
        }
    }
    
    // Display command and response
    displayTerminalOutput(command, filter, filteredResponse);
    
    // Scroll to bottom
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function findCommand(commandName) {
    // Extract command name (remove bitcoin-cli prefix if present)
    const cmd = commandName.replace(/^bitcoin-cli\s+/, '').split(' ')[0].toLowerCase();
    
    for (const category in bitcoinCommands) {
        const command = bitcoinCommands[category].find(c => c.name === cmd);
        if (command) {
            return command;
        }
    }
    
    return null;
}

function generateMockResponse(command) {
    // Generate basic mock responses for common commands
    const cmd = command.toLowerCase();
    
    if (cmd.includes('getblockchaininfo')) {
        return {
            chain: "main",
            blocks: 815234,
            difficulty: 62463471666142.88,
            verificationprogress: 0.9999876543210123
        };
    } else if (cmd.includes('getwalletinfo')) {
        return {
            balance: 1.23456789,
            txcount: 142,
            keypoolsize: 1000
        };
    } else if (cmd.includes('listunspent')) {
        return [
            { txid: "abc123...", amount: 0.5, confirmations: 125 },
            { txid: "def456...", amount: 0.25, confirmations: 45 }
        ];
    } else if (cmd.includes('getnetworkinfo')) {
        return {
            connections: 12,
            version: 300000,
            protocolversion: 70016
        };
    } else if (cmd.includes('getmininginfo')) {
        return {
            blocks: 815234,
            difficulty: 62463471666142.88,
            networkhashps: 500000000000000000
        };
    }
    
    return { message: "Comando executado com sucesso (dados simulados)", command: command };
}

function applyJqFilter(data, filter) {
    // Simple jq-like filter implementation
    // This is a basic implementation - for production, consider using a jq library
    
    try {
        // Remove quotes if present
        filter = filter.replace(/^["']|["']$/g, '');
        
        // Handle simple field access: .field
        if (filter.startsWith('.') && !filter.includes('[') && !filter.includes('|') && !filter.includes('{')) {
            const field = filter.substring(1).trim();
            if (data && typeof data === 'object' && !Array.isArray(data)) {
                return data[field];
            }
        }
        
        // Handle object creation: { field1, field2 } or . | { field1, field2 }
        if (filter.includes('{') && filter.includes('}')) {
            const match = filter.match(/\{([^}]+)\}/);
            if (match) {
                const fields = match[1].split(',').map(f => f.trim().replace(/^\./, ''));
                const result = {};
                fields.forEach(field => {
                    if (data && typeof data === 'object' && !Array.isArray(data)) {
                        if (data[field] !== undefined) {
                            result[field] = data[field];
                        }
                    }
                });
                return result;
            }
        }
        
        // Handle array iteration: .[]
        if (filter === '.[]' || filter.trim() === '.[]') {
            if (Array.isArray(data)) {
                return data;
            }
        }
        
        // Handle array mapping: [.[] | .field]
        const arrayMapMatch = filter.match(/\[\.\[\]\s*\|\s*\.(\w+)\]/);
        if (arrayMapMatch) {
            const field = arrayMapMatch[1];
            if (Array.isArray(data)) {
                return data.map(item => item && typeof item === 'object' ? item[field] : null);
            }
        }
        
        // Handle array mapping with object: [.[] | { field1, field2 }]
        const arrayObjMatch = filter.match(/\[\.\[\]\s*\|\s*\{([^}]+)\}\]/);
        if (arrayObjMatch) {
            const fields = arrayObjMatch[1].split(',').map(f => f.trim().replace(/^\./, ''));
            if (Array.isArray(data)) {
                return data.map(item => {
                    const result = {};
                    fields.forEach(field => {
                        if (item && typeof item === 'object' && item[field] !== undefined) {
                            result[field] = item[field];
                        }
                    });
                    return result;
                });
            }
        }
        
        // Handle pipe with field access: . | .field
        if (filter.includes('|')) {
            const parts = filter.split('|').map(p => p.trim());
            let result = data;
            parts.forEach(part => {
                if (part.startsWith('.')) {
                    const field = part.substring(1).trim();
                    if (result && typeof result === 'object' && !Array.isArray(result)) {
                        result = result[field];
                    }
                }
            });
            return result;
        }
        
        // Default: return original data
        return data;
    } catch (error) {
        throw new Error('Filtro jq não suportado ou inválido: ' + error.message);
    }
}

function displayTerminalOutput(command, filter, response) {
    const terminalOutput = document.getElementById('terminalOutput');
    const time = new Date().toLocaleTimeString('pt-BR');
    
    const commandDiv = document.createElement('div');
    commandDiv.className = 'terminal-command';
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'command-time';
    timeDiv.textContent = time;
    
    const commandLine = document.createElement('div');
    commandLine.className = 'command-line';
    commandLine.innerHTML = `<span class="command-prompt">$</span> bitcoin-cli ${command}`;
    if (filter) {
        commandLine.innerHTML += ` <span class="command-jq">| jq "${filter}"</span>`;
    }
    
    const jsonOutput = document.createElement('div');
    jsonOutput.className = 'json-output';
    jsonOutput.textContent = JSON.stringify(response, null, 2);
    
    // Syntax highlighting
    highlightJSON(jsonOutput);
    
    commandDiv.appendChild(timeDiv);
    commandDiv.appendChild(commandLine);
    commandDiv.appendChild(jsonOutput);
    
    terminalOutput.appendChild(commandDiv);
}

function highlightJSON(element) {
    const text = element.textContent;
    const json = JSON.parse(text);
    element.innerHTML = formatJSON(json);
}

function formatJSON(obj, indent = 0) {
    const indentStr = '  '.repeat(indent);
    
    if (obj === null) {
        return '<span class="json-null">null</span>';
    }
    
    if (typeof obj === 'string') {
        return `<span class="json-string">"${obj}"</span>`;
    }
    
    if (typeof obj === 'number') {
        return `<span class="json-number">${obj}</span>`;
    }
    
    if (typeof obj === 'boolean') {
        return `<span class="json-boolean">${obj}</span>`;
    }
    
    if (Array.isArray(obj)) {
        if (obj.length === 0) {
            return '[]';
        }
        let html = '[\n';
        obj.forEach((item, index) => {
            html += indentStr + '  ' + formatJSON(item, indent + 1);
            if (index < obj.length - 1) {
                html += ',';
            }
            html += '\n';
        });
        html += indentStr + ']';
        return html;
    }
    
    if (typeof obj === 'object') {
        const keys = Object.keys(obj);
        if (keys.length === 0) {
            return '{}';
        }
        let html = '{\n';
        keys.forEach((key, index) => {
            html += indentStr + '  <span class="json-key">"' + key + '"</span>: ' + formatJSON(obj[key], indent + 1);
            if (index < keys.length - 1) {
                html += ',';
            }
            html += '\n';
        });
        html += indentStr + '}';
        return html;
    }
    
    return String(obj);
}

// Render Commands
function renderAllCommands() {
    const referenceContent = document.getElementById('referenceContent');
    if (!referenceContent) return;
    
    const allCommands = getAllCommands();
    referenceContent.innerHTML = '';
    
    allCommands.forEach(cmd => {
        const card = createCommandCard(cmd);
        referenceContent.appendChild(card);
    });
}

function renderCommands(category, containerId) {
    const container = document.getElementById(containerId);
    if (!container || !bitcoinCommands[category]) return;
    
    container.innerHTML = '';
    
    bitcoinCommands[category].forEach(cmd => {
        const card = createCommandCard(cmd);
        container.appendChild(card);
    });
}

function createCommandCard(cmd) {
    const card = document.createElement('div');
    card.className = 'command-card';
    
    const name = document.createElement('div');
    name.className = 'command-name';
    name.innerHTML = `<i class="fas fa-code"></i> ${cmd.name}`;
    
    const description = document.createElement('div');
    description.className = 'command-description';
    description.textContent = cmd.description;
    
    const syntax = document.createElement('div');
    syntax.className = 'command-syntax';
    syntax.textContent = cmd.syntax;
    
    card.appendChild(name);
    card.appendChild(description);
    card.appendChild(syntax);
    
    // Add parameters if available
    if (cmd.parameters && cmd.parameters.length > 0) {
        const paramsDiv = document.createElement('div');
        paramsDiv.className = 'parameters-list';
        
        cmd.parameters.forEach(param => {
            const paramDiv = document.createElement('div');
            paramDiv.className = 'parameter';
            
            const paramName = document.createElement('span');
            paramName.className = 'parameter-name';
            paramName.textContent = param.name;
            
            const paramType = document.createElement('span');
            paramType.className = 'parameter-type';
            paramType.textContent = `(${param.type})`;
            
            const paramRequired = document.createElement('span');
            if (param.required) {
                paramRequired.className = 'parameter-required';
                paramRequired.textContent = 'obrigatório';
            }
            
            const paramDesc = document.createElement('div');
            paramDesc.className = 'parameter-description';
            paramDesc.textContent = param.description;
            
            paramDiv.appendChild(paramName);
            paramDiv.appendChild(paramType);
            if (param.required) {
                paramDiv.appendChild(paramRequired);
            }
            paramDiv.appendChild(paramDesc);
            paramsDiv.appendChild(paramDiv);
        });
        
        card.appendChild(paramsDiv);
    }
    
    // Add example if available
    if (cmd.example) {
        const exampleDiv = document.createElement('div');
        exampleDiv.className = 'example-section';
        
        const exampleTitle = document.createElement('strong');
        exampleTitle.textContent = 'Exemplo:';
        
        const exampleCommand = document.createElement('div');
        exampleCommand.className = 'example-command';
        exampleCommand.textContent = cmd.example.command;
        
        const exampleResponse = document.createElement('div');
        exampleResponse.className = 'example-response';
        exampleResponse.textContent = JSON.stringify(cmd.example.response, null, 2);
        
        exampleDiv.appendChild(exampleTitle);
        exampleDiv.appendChild(exampleCommand);
        exampleDiv.appendChild(exampleResponse);
        
        // Add response fields explanation if available
        if (cmd.responseFields && typeof cmd.example.response === 'object' && cmd.example.response !== null && Object.keys(cmd.responseFields).length > 0) {
            const fieldsBtn = document.createElement('button');
            fieldsBtn.className = 'fields-explanation-btn';
            fieldsBtn.innerHTML = '<i class="fas fa-book-open"></i> 📚 Explicar Campos JSON (Aprendizado)';
            fieldsBtn.type = 'button';
            
            const fieldsExplanation = document.createElement('div');
            fieldsExplanation.className = 'fields-explanation';
            fieldsExplanation.style.display = 'none';
            
            const fieldsTitle = document.createElement('h4');
            fieldsTitle.className = 'fields-title';
            fieldsTitle.innerHTML = '<i class="fas fa-graduation-cap"></i> Explicação Detalhada dos Campos da Resposta JSON';
            
            const fieldsIntro = document.createElement('p');
            fieldsIntro.className = 'fields-intro';
            fieldsIntro.style.cssText = 'color: var(--gray-600); margin-bottom: 1.5rem; font-size: 0.9375rem; line-height: 1.6;';
            fieldsIntro.textContent = 'Esta seção explica cada campo retornado na resposta JSON. Use estas explicações para entender o significado e propósito de cada atributo, facilitando o aprendizado e uso dos comandos Bitcoin-CLI.';
            
            const fieldsList = document.createElement('div');
            fieldsList.className = 'fields-list';
            
            // Create explanation for each field
            Object.keys(cmd.responseFields).forEach(fieldPath => {
                const fieldInfo = cmd.responseFields[fieldPath];
                
                const fieldItem = document.createElement('div');
                fieldItem.className = 'field-item';
                
                const fieldName = document.createElement('div');
                fieldName.className = 'field-name';
                // Format nested field paths nicely
                const displayPath = fieldPath.replace(/\./g, ' → ');
                fieldName.innerHTML = `<code>${displayPath}</code> <span class="field-type">(${fieldInfo.type})</span>`;
                
                const fieldDescription = document.createElement('div');
                fieldDescription.className = 'field-description';
                fieldDescription.textContent = fieldInfo.description;
                
                // Show example if it exists and is not an object
                if (fieldInfo.example !== undefined && 
                    fieldInfo.example !== null && 
                    fieldInfo.example !== '' && 
                    typeof fieldInfo.example !== 'object' &&
                    fieldInfo.example !== 'Objeto com informações de soft forks' &&
                    fieldInfo.example !== 'Objeto com type, active, height') {
                    const fieldExample = document.createElement('div');
                    fieldExample.className = 'field-example';
                    fieldExample.innerHTML = `<strong>Exemplo:</strong> <code>${fieldInfo.example}</code>`;
                    fieldItem.appendChild(fieldName);
                    fieldItem.appendChild(fieldDescription);
                    fieldItem.appendChild(fieldExample);
                } else {
                    fieldItem.appendChild(fieldName);
                    fieldItem.appendChild(fieldDescription);
                }
                
                fieldsList.appendChild(fieldItem);
            });
            
            fieldsExplanation.appendChild(fieldsTitle);
            fieldsExplanation.appendChild(fieldsIntro);
            fieldsExplanation.appendChild(fieldsList);
            
            fieldsBtn.addEventListener('click', () => {
                if (fieldsExplanation.style.display === 'none') {
                    fieldsExplanation.style.display = 'block';
                    fieldsBtn.innerHTML = '<i class="fas fa-chevron-up"></i> Ocultar Explicações';
                    // Smooth scroll to explanation
                    setTimeout(() => {
                        fieldsExplanation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 100);
                } else {
                    fieldsExplanation.style.display = 'none';
                    fieldsBtn.innerHTML = '<i class="fas fa-book-open"></i> 📚 Explicar Campos JSON (Aprendizado)';
                }
            });
            
            exampleDiv.appendChild(fieldsBtn);
            exampleDiv.appendChild(fieldsExplanation);
        }
        
        card.appendChild(exampleDiv);
    }
    
    return card;
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.style.display = 'block';
    
    setTimeout(() => {
        toast.classList.add('hidden');
        setTimeout(() => {
            toast.style.display = 'none';
            toast.classList.remove('hidden');
        }, 300);
    }, 3000);
}

