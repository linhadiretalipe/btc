// Main Application Logic
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupLanguage();
    setupTabs();
    setupSearch();
    setupTerminal();
    setupDonation();
    renderAllCommands();
    
    // Load commands for each category
    renderCommands('blockchain', 'blockchainCommands');
    renderCommands('wallet', 'walletCommands');
    renderCommands('transacoes', 'transacoesCommands');
    renderCommands('rede', 'redeCommands');
    renderCommands('mineracao', 'mineracaoCommands');
    renderCommands('utilitarios', 'utilitariosCommands');
    
    // Apply translations
    applyTranslations();
}

// Language Setup
function setupLanguage() {
    const languageSelect = document.getElementById('languageSelect');
    if (!languageSelect) return;
    
    // Set current language
    languageSelect.value = getCurrentLanguage();
    
    // Add change event listener
    languageSelect.addEventListener('change', (e) => {
        const newLang = e.target.value;
        setCurrentLanguage(newLang);
        currentLanguage = newLang;
        applyTranslations();
        // Re-render commands to update translations
        renderAllCommands();
        renderCommands('blockchain', 'blockchainCommands');
        renderCommands('wallet', 'walletCommands');
        renderCommands('transacoes', 'transacoesCommands');
        renderCommands('rede', 'redeCommands');
        renderCommands('mineracao', 'mineracaoCommands');
        renderCommands('utilitarios', 'utilitariosCommands');
    });
}

// Apply translations to all elements
function applyTranslations() {
    // Translate elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        const translation = t(key);
        if (translation) {
            // Check if translation contains HTML tags
            if (translation.includes('<strong>') || translation.includes('<i>') || translation.includes('<span>')) {
                // Set innerHTML for elements with HTML tags
                element.innerHTML = translation;
            } else {
                // Use textContent for plain text
                element.textContent = translation;
            }
        }
    });
    
    // Translate placeholders
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
        const key = element.getAttribute('data-translate-placeholder');
        const translation = t(key);
        if (translation) {
            element.placeholder = translation;
        }
    });
    
    // Update HTML lang attribute
    const lang = getCurrentLanguage();
    document.documentElement.lang = lang;
    
    // Update page title and meta description
    document.title = t('title');
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.content = t('subtitle');
    }
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
                
                const categoryNameKey = category === 'blockchain' ? 'tab_blockchain' :
                                       category === 'wallet' ? 'tab_wallet' :
                                       category === 'transacoes' ? 'tab_transacoes' :
                                       category === 'rede' ? 'tab_rede' :
                                       category === 'mineracao' ? 'tab_mineracao' :
                                       category === 'utilitarios' ? 'tab_utilitarios' : 'tab_referencia';
                const categoryName = t(categoryNameKey);
                searchHint.textContent = `${t('search_hint_waiting')} ${categoryName}`;
                searchHint.style.display = 'block';
                searchHint.style.color = '#d97706';
                
                // Auto-switch tab after 2 seconds
                searchTimeout = setTimeout(() => {
                    const tabButton = document.querySelector(`[data-tab="${category}"]`);
                    if (tabButton) {
                        tabButton.click();
                        showToast(`${t('toast_command_found')} ${categoryName}`, 'success');
                    }
                }, 2000);
            } else if (searchTerm.length > 2) {
                searchHint.textContent = t('search_hint_not_found');
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
            noResults.innerHTML = `<p>${t('no_results')} <strong>${searchTerm}</strong></p>`;
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
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'terminal-empty';
        emptyDiv.innerHTML = `<i class="fas fa-terminal"></i><p data-translate="terminal_empty">${t('terminal_empty')}</p><p class="empty-hint" data-translate="terminal_empty_hint">${t('terminal_empty_hint')}</p>`;
        terminalOutput.innerHTML = '';
        terminalOutput.appendChild(emptyDiv);
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
        showToast(t('toast_command_error'), 'error');
        return;
    }
    
    // Remove empty state
    if (terminalOutput.querySelector('.terminal-empty')) {
        terminalOutput.innerHTML = '';
    }
    
    clearHistoryBtn.style.display = 'block';
    
    // Extract command name (remove bitcoin-cli prefix if present and get first word)
    const commandParts = command.replace(/^bitcoin-cli\s+/, '').split(/\s+/);
    const commandName = commandParts[0].toLowerCase().trim();
    
    // Check if it's a bitcoin-cli command (starts with bitcoin-cli or is a known command)
    const isBitcoinCliCommand = command.toLowerCase().startsWith('bitcoin-cli') || 
                                 commandCategoryMap.hasOwnProperty(commandName);
    
    if (!isBitcoinCliCommand) {
        // Not a bitcoin-cli command
        displayCommandError(command, t('error_not_bitcoin_cli'), null);
        showToast(t('toast_not_bitcoin_cli'), 'error');
        return;
    }
    
    // Check if command is blocked/restricted
    if (isCommandBlocked(commandName)) {
        const blockedReason = getBlockedCommandReason(commandName);
        displayCommandError(command, blockedReason, null);
        showToast(t('toast_command_blocked').replace('{command}', commandName), 'error');
        return;
    }
    
    // Find command data
    const commandData = findCommand(commandName);
    
    if (!commandData) {
        // Command doesn't exist
        displayCommandError(command, t('error_command_not_found').replace('{command}', commandName), null);
        showToast(t('toast_command_not_found').replace('{command}', commandName), 'error');
        return;
    }
    
    // Validate parameters if command has required parameters
    if (commandData.parameters && commandData.parameters.length > 0) {
        const requiredParams = commandData.parameters.filter(p => p.required);
        const providedArgs = commandParts.slice(1);
        
        // Basic parameter validation
        if (requiredParams.length > 0 && providedArgs.length < requiredParams.length) {
            const missingParams = requiredParams.slice(providedArgs.length);
            const errorMsg = t('error_missing_parameters')
                .replace('{command}', commandName)
                .replace('{params}', missingParams.map(p => p.name).join(', '));
            const example = commandData.example ? commandData.example.command : commandData.syntax;
            displayCommandError(command, errorMsg, example);
            showToast(t('toast_missing_parameters'), 'error');
            return;
        }
    }
    
    // Get response from command data
    let response = null;
    
    if (commandData && commandData.example) {
        response = commandData.example.response;
    } else {
        // Generate mock response for commands without example
        response = generateMockResponse(command);
    }
    
    // Apply jq filter if provided
    let filteredResponse = response;
    if (filter) {
        try {
            filteredResponse = applyJqFilter(response, filter);
        } catch (error) {
            showToast(t('toast_jq_error') + ' ' + error.message, 'error');
            filteredResponse = { error: 'Filtro jq inválido: ' + error.message };
        }
    }
    
    // Show success message
    showToast(t('toast_command_success'), 'success');
    
    // Display command and response
    const commandElement = displayTerminalOutput(command, filter, filteredResponse, commandData);
    
    // Scroll to command execution smoothly
    setTimeout(() => {
        if (commandElement) {
            commandElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    }, 100);
}

// Blocked commands list - commands that should not be executed
const blockedCommands = {
    'stop': {
        reason: 'error_blocked_stop',
        description: 'Comando bloqueado: Este comando para o servidor Bitcoin e não pode ser executado no terminal interativo.'
    },
    'encryptwallet': {
        reason: 'error_blocked_destructive',
        description: 'Comando bloqueado: Este comando modifica permanentemente a carteira e não pode ser executado no terminal interativo.'
    },
    'walletpassphrase': {
        reason: 'error_blocked_destructive',
        description: 'Comando bloqueado: Este comando modifica a segurança da carteira e não pode ser executado no terminal interativo.'
    },
    'walletpassphrasechange': {
        reason: 'error_blocked_destructive',
        description: 'Comando bloqueado: Este comando altera a senha da carteira e não pode ser executado no terminal interativo.'
    },
    'walletlock': {
        reason: 'error_blocked_destructive',
        description: 'Comando bloqueado: Este comando bloqueia a carteira e não pode ser executado no terminal interativo.'
    },
    'importprivkey': {
        reason: 'error_blocked_destructive',
        description: 'Comando bloqueado: Este comando importa chaves privadas e não pode ser executado no terminal interativo.'
    },
    'dumpprivkey': {
        reason: 'error_blocked_security',
        description: 'Comando bloqueado: Este comando expõe chaves privadas e não pode ser executado no terminal interativo por questões de segurança.'
    }
};

// Check if command is blocked
function isCommandBlocked(commandName) {
    return blockedCommands.hasOwnProperty(commandName.toLowerCase());
}

// Get blocked command reason
function getBlockedCommandReason(commandName) {
    const blocked = blockedCommands[commandName.toLowerCase()];
    if (blocked) {
        return t(blocked.reason).replace('{command}', commandName);
    }
    return t('error_blocked_generic').replace('{command}', commandName);
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

function displayTerminalOutput(command, filter, response, commandData) {
    const terminalOutput = document.getElementById('terminalOutput');
    const time = new Date().toLocaleTimeString('pt-BR');
    
    const commandDiv = document.createElement('div');
    commandDiv.className = 'terminal-command';
    commandDiv.id = 'cmd-' + Date.now(); // Unique ID for scrolling
    
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
    
    // Add field explanations if available and response is an object
    if (commandData && commandData.responseFields && typeof response === 'object' && response !== null && !Array.isArray(response) && !response.error) {
        const fieldsExplanation = createFieldsExplanation(response, commandData.responseFields, filter);
        if (fieldsExplanation) {
            commandDiv.appendChild(fieldsExplanation);
        }
    }
    
    terminalOutput.appendChild(commandDiv);
    
    return commandDiv;
}

// Create fields explanation section
function createFieldsExplanation(response, responseFields, filter) {
    // If filter is applied, we need to explain the filtered result
    // For simplicity, we'll explain the original response fields
    if (!responseFields || Object.keys(responseFields).length === 0) {
        return null;
    }
    
    const explanationDiv = document.createElement('div');
    explanationDiv.className = 'response-fields-explanation';
    
    const explanationTitle = document.createElement('div');
    explanationTitle.className = 'explanation-title';
    explanationTitle.innerHTML = `<i class="fas fa-graduation-cap"></i> <strong>${t('response_fields_title')}</strong>`;
    
    const fieldsList = document.createElement('div');
    fieldsList.className = 'response-fields-list';
    
    // Get all fields from response
    const responseKeys = Object.keys(response);
    
    if (responseKeys.length === 0) {
        return null;
    }
    
    // Create explanation for each field in the response
    responseKeys.forEach(key => {
        const fieldValue = response[key];
        // Try to find field info by exact key or lowercase
        let fieldInfo = responseFields[key] || responseFields[key.toLowerCase()];
        
        // Also check for nested paths (e.g., "softforks.taproot")
        if (!fieldInfo) {
            const nestedKeys = Object.keys(responseFields).filter(k => k.includes('.'));
            for (const nestedKey of nestedKeys) {
                if (nestedKey.startsWith(key + '.')) {
                    // This is a nested field, skip for now
                    return;
                }
            }
        }
        
        if (fieldInfo) {
            const fieldItem = document.createElement('div');
            fieldItem.className = 'response-field-item';
            
            const fieldHeader = document.createElement('div');
            fieldHeader.className = 'response-field-header';
            fieldHeader.innerHTML = `<code class="field-name-code">${key}</code> <span class="field-type-badge">${fieldInfo.type}</span>`;
            
            const fieldDescription = document.createElement('div');
            fieldDescription.className = 'response-field-description';
            fieldDescription.textContent = fieldInfo.description;
            
            const fieldValueDisplay = document.createElement('div');
            fieldValueDisplay.className = 'response-field-value';
            const formattedValue = escapeHtml(formatFieldValue(fieldValue));
            fieldValueDisplay.innerHTML = `<strong>${t('response_field_value')}:</strong> <code>${formattedValue}</code>`;
            
            fieldItem.appendChild(fieldHeader);
            fieldItem.appendChild(fieldDescription);
            fieldItem.appendChild(fieldValueDisplay);
            
            fieldsList.appendChild(fieldItem);
        } else {
            // Field exists in response but not documented
            const fieldItem = document.createElement('div');
            fieldItem.className = 'response-field-item undocumented';
            
            const fieldHeader = document.createElement('div');
            fieldHeader.className = 'response-field-header';
            const fieldType = Array.isArray(fieldValue) ? 'array' : typeof fieldValue;
            fieldHeader.innerHTML = `<code class="field-name-code">${key}</code> <span class="field-type-badge">${fieldType}</span>`;
            
            const fieldValueDisplay = document.createElement('div');
            fieldValueDisplay.className = 'response-field-value';
            const formattedValue = escapeHtml(formatFieldValue(fieldValue));
            fieldValueDisplay.innerHTML = `<strong>${t('response_field_value')}:</strong> <code>${formattedValue}</code>`;
            
            fieldItem.appendChild(fieldHeader);
            fieldItem.appendChild(fieldValueDisplay);
            
            fieldsList.appendChild(fieldItem);
        }
    });
    
    if (fieldsList.children.length === 0) {
        return null;
    }
    
    explanationDiv.appendChild(explanationTitle);
    explanationDiv.appendChild(fieldsList);
    
    return explanationDiv;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Format field value for display
function formatFieldValue(value) {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (typeof value === 'string') {
        if (value.length > 60) {
            return value.substring(0, 60) + '...';
        }
        return value;
    }
    if (typeof value === 'object') {
        if (Array.isArray(value)) {
            const lang = getCurrentLanguage();
            const arrayText = lang === 'pt-BR' ? 'Array com' : 
                             lang === 'en' ? 'Array with' :
                             lang === 'es' ? 'Array con' :
                             lang === 'zh' ? '数组包含' :
                             lang === 'ja' ? '配列' :
                             lang === 'ru' ? 'Массив с' : 'Array com';
            const itemsText = lang === 'pt-BR' ? 'item(s)' :
                             lang === 'en' ? 'item(s)' :
                             lang === 'es' ? 'elemento(s)' :
                             lang === 'zh' ? '项' :
                             lang === 'ja' ? '項目' :
                             lang === 'ru' ? 'элемент(ов)' : 'item(s)';
            return `[${arrayText} ${value.length} ${itemsText}]`;
        }
        const lang = getCurrentLanguage();
        const objectText = lang === 'pt-BR' ? 'Object com' :
                          lang === 'en' ? 'Object with' :
                          lang === 'es' ? 'Objeto con' :
                          lang === 'zh' ? '对象包含' :
                          lang === 'ja' ? 'オブジェクト' :
                          lang === 'ru' ? 'Объект с' : 'Object com';
        const fieldsText = lang === 'pt-BR' ? 'campo(s)' :
                          lang === 'en' ? 'field(s)' :
                          lang === 'es' ? 'campo(s)' :
                          lang === 'zh' ? '字段' :
                          lang === 'ja' ? 'フィールド' :
                          lang === 'ru' ? 'полей' : 'campo(s)';
        return `{${objectText} ${Object.keys(value).length} ${fieldsText}}`;
    }
    if (typeof value === 'boolean') {
        return value ? 'true' : 'false';
    }
    if (typeof value === 'number') {
        // Format large numbers
        if (value > 1000000) {
            return value.toLocaleString();
        }
        return String(value);
    }
    return String(value);
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
                paramRequired.textContent = t('parameter_required');
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
        exampleTitle.textContent = t('example_label');
        
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
            fieldsBtn.innerHTML = `<i class="fas fa-book-open"></i> ${t('explain_fields_btn')}`;
            fieldsBtn.type = 'button';
            
            const fieldsExplanation = document.createElement('div');
            fieldsExplanation.className = 'fields-explanation';
            fieldsExplanation.style.display = 'none';
            
            const fieldsTitle = document.createElement('h4');
            fieldsTitle.className = 'fields-title';
            fieldsTitle.innerHTML = `<i class="fas fa-graduation-cap"></i> ${t('fields_explanation_title')}`;
            
            const fieldsIntro = document.createElement('p');
            fieldsIntro.className = 'fields-intro';
            fieldsIntro.style.cssText = 'color: var(--gray-600); margin-bottom: 1.5rem; font-size: 0.9375rem; line-height: 1.6;';
            fieldsIntro.textContent = t('fields_explanation_intro');
            
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
                    fieldsBtn.innerHTML = `<i class="fas fa-chevron-up"></i> ${t('hide_explanations')}`;
                    // Smooth scroll to explanation
                    setTimeout(() => {
                        fieldsExplanation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }, 100);
                } else {
                    fieldsExplanation.style.display = 'none';
                    fieldsBtn.innerHTML = `<i class="fas fa-book-open"></i> ${t('explain_fields_btn')}`;
                }
            });
            
            exampleDiv.appendChild(fieldsBtn);
            exampleDiv.appendChild(fieldsExplanation);
        }
        
        card.appendChild(exampleDiv);
    }
    
    return card;
}

// Donation Setup
function setupDonation() {
    const lnurl = 'lnurl1dp68gurn8ghj7ampd3kx2ar0veekzar0wd5xjtnrdakj7tnhv4kxctttdehhwm30d3h82unvwqhkjmnpdejhwetpd36xsvfsjrn2rl';
    const qrImage = document.getElementById('donationQRCode');
    const copyBtn = document.getElementById('copyLnurlBtn');
    const lnurlCode = document.getElementById('lnurlCode');
    
    // Set alt text for QR code image
    if (qrImage) {
        qrImage.alt = t('donation_scan') || 'Lightning Network QR Code';
    }
    
    // Copy LNURL functionality
    if (copyBtn && lnurlCode) {
        copyBtn.addEventListener('click', () => {
            const text = lnurlCode.textContent;
            navigator.clipboard.writeText(text).then(() => {
                showToast(t('donation_copied'), 'success');
                // Visual feedback
                copyBtn.innerHTML = '<i class="fas fa-check"></i>';
                copyBtn.style.background = '#10b981';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fas fa-copy"></i>';
                    copyBtn.style.background = '';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy:', err);
                showToast('Erro ao copiar', 'error');
            });
        });
    }
}

// Display command error in terminal
function displayCommandError(command, errorMessage, exampleCommand) {
    const terminalOutput = document.getElementById('terminalOutput');
    const clearHistoryBtn = document.getElementById('clearHistory');
    
    if (terminalOutput.querySelector('.terminal-empty')) {
        terminalOutput.innerHTML = '';
    }
    clearHistoryBtn.style.display = 'block';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'terminal-command terminal-error';
    
    const timeDiv = document.createElement('div');
    timeDiv.className = 'command-time';
    timeDiv.textContent = new Date().toLocaleTimeString('pt-BR');
    
    const commandLine = document.createElement('div');
    commandLine.className = 'command-line';
    commandLine.innerHTML = `<span class="command-prompt">$</span> bitcoin-cli ${command}`;
    
    const errorOutput = document.createElement('div');
    errorOutput.className = 'json-output error-output';
    
    let errorContent = `<div class="error-message">${errorMessage}</div>`;
    
    if (exampleCommand) {
        errorContent += `<div class="error-example">
            <strong>${t('error_example_label')}:</strong>
            <code class="example-code">${exampleCommand}</code>
        </div>`;
    }
    
    errorOutput.innerHTML = errorContent;
    
    errorDiv.appendChild(timeDiv);
    errorDiv.appendChild(commandLine);
    errorDiv.appendChild(errorOutput);
    
    terminalOutput.appendChild(errorDiv);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
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

