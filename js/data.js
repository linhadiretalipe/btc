// Bitcoin CLI Commands Data
const bitcoinCommands = {
    blockchain: [
        {
            name: "getbestblockhash",
            description: "Retorna o hash do melhor bloco (bloco com mais trabalho)",
            syntax: "bitcoin-cli getbestblockhash",
            parameters: [],
            example: {
                command: "bitcoin-cli getbestblockhash",
                response: "00000000000000000002a7c4c1e48d76c5a37902165a270156b7a8d72728a054"
            }
        },
        {
            name: "getblockchaininfo",
            description: "Retorna informações sobre o estado atual da blockchain",
            syntax: "bitcoin-cli getblockchaininfo",
            parameters: [],
            example: {
                command: "bitcoin-cli getblockchaininfo",
                response: {
                    chain: "main",
                    blocks: 815234,
                    headers: 815234,
                    bestblockhash: "00000000000000000002a7c4c1e48d76c5a37902165a270156b7a8d72728a054",
                    difficulty: 62463471666142.88,
                    time: 1698765432,
                    mediantime: 1698765000,
                    verificationprogress: 0.9999876543210123,
                    initialblockdownload: false,
                    chainwork: "00000000000000000000000000000000000000005c2e9b3e327f1e8f1e1f1e1f",
                    size_on_disk: 567890123456,
                    pruned: false,
                    softforks: {
                        taproot: {
                            type: "bip9",
                            active: true,
                            height: 709632
                        }
                    }
                }
            },
            responseFields: {
                chain: {
                    type: "string",
                    description: "Rede da blockchain. Valores possíveis: 'main' (rede principal), 'test' (testnet), 'regtest' (rede de testes local)",
                    example: "main"
                },
                blocks: {
                    type: "number",
                    description: "Número do último bloco validado na blockchain local. Representa a altura atual da cadeia de blocos.",
                    example: 815234
                },
                headers: {
                    type: "number",
                    description: "Número de headers de blocos recebidos dos peers. Pode ser maior que 'blocks' se o nó ainda está sincronizando.",
                    example: 815234
                },
                bestblockhash: {
                    type: "string",
                    description: "Hash hexadecimal do bloco com mais trabalho acumulado (melhor bloco). Este é o bloco na ponta da cadeia principal.",
                    example: "00000000000000000002a7c4c1e48d76c5a37902165a270156b7a8d72728a054"
                },
                difficulty: {
                    type: "number",
                    description: "Dificuldade atual da proof-of-work. Representa o quão difícil é minerar um novo bloco. Valores maiores indicam maior dificuldade.",
                    example: 62463471666142.88
                },
                time: {
                    type: "number",
                    description: "Timestamp Unix (segundos desde 1970-01-01) do melhor bloco. Indica quando o bloco foi minerado.",
                    example: 1698765432
                },
                mediantime: {
                    type: "number",
                    description: "Timestamp mediano dos últimos 11 blocos. Usado para medir o tempo real e evitar manipulação por mineradores.",
                    example: 1698765000
                },
                verificationprogress: {
                    type: "number",
                    description: "Progresso da verificação da blockchain (0.0 a 1.0). 1.0 significa que a blockchain está totalmente verificada e sincronizada.",
                    example: 0.9999876543210123
                },
                initialblockdownload: {
                    type: "boolean",
                    description: "Indica se o nó ainda está no processo inicial de download da blockchain (IBD - Initial Block Download). 'true' significa que está sincronizando.",
                    example: false
                },
                chainwork: {
                    type: "string",
                    description: "Soma total de trabalho (work) acumulado em todos os blocos da cadeia. Representado em hexadecimal. Quanto maior, mais trabalho foi realizado.",
                    example: "00000000000000000000000000000000000000005c2e9b3e327f1e8f1e1f1e1f"
                },
                size_on_disk: {
                    type: "number",
                    description: "Tamanho total da blockchain em bytes armazenada no disco. Inclui blocos, índices e outros dados.",
                    example: 567890123456
                },
                pruned: {
                    type: "boolean",
                    description: "Indica se o nó está rodando em modo 'pruned' (podado). Nós podados não armazenam todos os blocos antigos para economizar espaço.",
                    example: false
                },
                softforks: {
                    type: "object",
                    description: "Informações sobre soft forks ativos na rede. Contém detalhes sobre atualizações de consenso como Taproot, SegWit, etc.",
                    example: "Objeto com informações de soft forks"
                },
                "softforks.taproot": {
                    type: "object",
                    description: "Informações sobre o soft fork Taproot (BIP 340-342). Taproot permite transações mais privadas e eficientes.",
                    example: "Objeto com type, active, height"
                },
                "softforks.taproot.type": {
                    type: "string",
                    description: "Tipo de ativação do soft fork. 'bip9' significa que usa o mecanismo BIP9 para ativação.",
                    example: "bip9"
                },
                "softforks.taproot.active": {
                    type: "boolean",
                    description: "Indica se o soft fork Taproot está ativo na rede. 'true' significa que está totalmente ativado.",
                    example: true
                },
                "softforks.taproot.height": {
                    type: "number",
                    description: "Altura do bloco onde o soft fork Taproot foi ativado.",
                    example: 709632
                }
            }
        },
        {
            name: "getblock",
            description: "Retorna informações detalhadas de um bloco específico",
            syntax: 'bitcoin-cli getblock "blockhash" [verbosity]',
            parameters: [
                { name: "blockhash", type: "string", required: true, description: "Hash do bloco" },
                { name: "verbosity", type: "number", required: false, description: "0=hex, 1=json, 2=json com tx" }
            ],
            example: {
                command: 'bitcoin-cli getblock "00000000000000000002a7c4c1e48d76c5a37902165a270156b7a8d72728a054" 1',
                response: {
                    hash: "00000000000000000002a7c4c1e48d76c5a37902165a270156b7a8d72728a054",
                    confirmations: 5,
                    height: 815234,
                    version: 536870912,
                    versionHex: "20000000",
                    merkleroot: "8e7f4b3c2d1a9e8f7d6c5b4a3e2d1c0b9a8e7d6c5b4a3e2d1c0b9a8e7d6c5b4a",
                    time: 1698765432,
                    mediantime: 1698762000,
                    nonce: 2834234567,
                    bits: "170469f0",
                    difficulty: 62463471666142.88,
                    chainwork: "00000000000000000000000000000000000000005c2e9b3e327f1e8f1e1f1e1f",
                    nTx: 2456,
                    previousblockhash: "00000000000000000001234567890abcdef1234567890abcdef1234567890abc",
                    nextblockhash: "00000000000000000003fedcba0987654321fedcba0987654321fedcba098765"
                }
            },
            responseFields: {
                hash: {
                    type: "string",
                    description: "Hash do bloco em hexadecimal. É o identificador único do bloco, calculado a partir do cabeçalho do bloco.",
                    example: "00000000000000000002a7c4c1e48d76c5a37902165a270156b7a8d72728a054"
                },
                confirmations: {
                    type: "number",
                    description: "Número de blocos minerados após este bloco. Quanto maior, mais confirmado está o bloco.",
                    example: 5
                },
                height: {
                    type: "number",
                    description: "Altura do bloco na blockchain. Representa a posição do bloco na cadeia, começando do bloco gênese (altura 0).",
                    example: 815234
                },
                version: {
                    type: "number",
                    description: "Versão do bloco em formato decimal. Indica as regras de consenso que o minerador está seguindo.",
                    example: 536870912
                },
                versionHex: {
                    type: "string",
                    description: "Versão do bloco em formato hexadecimal. Mais legível que a versão decimal.",
                    example: "20000000"
                },
                merkleroot: {
                    type: "string",
                    description: "Raiz da árvore de Merkle de todas as transações no bloco. Garante a integridade das transações.",
                    example: "8e7f4b3c2d1a9e8f7d6c5b4a3e2d1c0b9a8e7d6c5b4a3e2d1c0b9a8e7d6c5b4a"
                },
                time: {
                    type: "number",
                    description: "Timestamp Unix do bloco (segundos desde 1970-01-01). Definido pelo minerador.",
                    example: 1698765432
                },
                mediantime: {
                    type: "number",
                    description: "Timestamp mediano dos últimos 11 blocos. Usado para suavizar variações no tempo.",
                    example: 1698762000
                },
                nonce: {
                    type: "number",
                    description: "Número usado na prova de trabalho. O minerador varia este valor para encontrar um hash válido.",
                    example: 2834234567
                },
                bits: {
                    type: "string",
                    description: "Bits de dificuldade do bloco em hexadecimal. Representa o target de dificuldade de mineração.",
                    example: "170469f0"
                },
                difficulty: {
                    type: "number",
                    description: "Dificuldade de mineração deste bloco. Quanto maior, mais difícil foi minerar.",
                    example: 62463471666142.88
                },
                chainwork: {
                    type: "string",
                    description: "Trabalho total acumulado até este bloco. Usado para determinar a cadeia com mais trabalho.",
                    example: "00000000000000000000000000000000000000005c2e9b3e327f1e8f1e1f1e1f"
                },
                nTx: {
                    type: "number",
                    description: "Número de transações incluídas neste bloco. Inclui a transação coinbase.",
                    example: 2456
                },
                previousblockhash: {
                    type: "string",
                    description: "Hash do bloco anterior na cadeia. Cria a ligação entre blocos na blockchain.",
                    example: "00000000000000000001234567890abcdef1234567890abcdef1234567890abc"
                },
                nextblockhash: {
                    type: "string",
                    description: "Hash do próximo bloco na cadeia (se existir). Null se este for o bloco mais recente.",
                    example: "00000000000000000003fedcba0987654321fedcba0987654321fedcba098765"
                }
            }
        },
        {
            name: "getblockcount",
            description: "Retorna o número do bloco mais recente na blockchain",
            syntax: "bitcoin-cli getblockcount",
            parameters: [],
            example: {
                command: "bitcoin-cli getblockcount",
                response: 815234
            }
        },
        {
            name: "getblockhash",
            description: "Retorna o hash de um bloco em determinada altura",
            syntax: "bitcoin-cli getblockhash height",
            parameters: [
                { name: "height", type: "number", required: true, description: "Altura do bloco" }
            ],
            example: {
                command: "bitcoin-cli getblockhash 815234",
                response: "00000000000000000002a7c4c1e48d76c5a37902165a270156b7a8d72728a054"
            }
        },
        {
            name: "getdifficulty",
            description: "Retorna a dificuldade atual da proof-of-work",
            syntax: "bitcoin-cli getdifficulty",
            parameters: [],
            example: {
                command: "bitcoin-cli getdifficulty",
                response: 62463471666142.88
            }
        },
        {
            name: "getchaintips",
            description: "Retorna informações sobre todos os chain tips conhecidos (forks)",
            syntax: "bitcoin-cli getchaintips",
            parameters: [],
            example: {
                command: "bitcoin-cli getchaintips",
                response: [
                    {
                        height: 815234,
                        hash: "00000000000000000002a7c4c1e48d76c5a37902165a270156b7a8d72728a054",
                        branchlen: 0,
                        status: "active"
                    },
                    {
                        height: 815230,
                        hash: "00000000000000000001a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3",
                        branchlen: 1,
                        status: "valid-fork"
                    }
                ]
            }
        },
        {
            name: "getblockstats",
            description: "Retorna estatísticas computadas para um bloco específico",
            syntax: "bitcoin-cli getblockstats hash_or_height [stats]",
            parameters: [
                { name: "hash_or_height", type: "string|number", required: true, description: "Hash ou altura do bloco" },
                { name: "stats", type: "array", required: false, description: "Estatísticas específicas" }
            ],
            example: {
                command: "bitcoin-cli getblockstats 815234",
                response: {
                    avgfee: 12345,
                    avgfeerate: 50,
                    avgtxsize: 500,
                    blockhash: "00000000000000000002a7c4c1e48d76c5a37902165a270156b7a8d72728a054",
                    height: 815234,
                    ins: 5000,
                    maxfee: 500000,
                    medianfee: 10000,
                    mediantime: 1698762000,
                    minfee: 1000,
                    outs: 5100,
                    subsidy: 312500000,
                    total_out: 12500000000,
                    totalfee: 12345678,
                    txs: 2456,
                    utxo_increase: 100
                }
            }
        },
        {
            name: "gettxout",
            description: "Retorna detalhes sobre uma transação de saída não gasta (UTXO)",
            syntax: 'bitcoin-cli gettxout "txid" n [include_mempool]',
            parameters: [
                { name: "txid", type: "string", required: true, description: "ID da transação" },
                { name: "n", type: "number", required: true, description: "Índice de saída (vout)" },
                { name: "include_mempool", type: "boolean", required: false, description: "Incluir mempool" }
            ],
            example: {
                command: 'bitcoin-cli gettxout "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b" 0',
                response: {
                    bestblock: "00000000000000000002a7c4c1e48d76c5a37902165a270156b7a8d72728a054",
                    confirmations: 125,
                    value: 0.5,
                    scriptPubKey: {
                        asm: "OP_0 abcdef1234567890abcdef1234567890abcdef12",
                        hex: "0014abcdef1234567890abcdef1234567890abcdef12",
                        address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
                        type: "witness_v0_keyhash"
                    },
                    coinbase: false
                }
            }
        },
        {
            name: "getmempoolinfo",
            description: "Retorna informações sobre o mempool (pool de transações pendentes)",
            syntax: "bitcoin-cli getmempoolinfo",
            parameters: [],
            example: {
                command: "bitcoin-cli getmempoolinfo",
                response: {
                    loaded: true,
                    size: 2456,
                    bytes: 1234567,
                    usage: 5678901,
                    total_fee: 0.12345678,
                    maxmempool: 300000000,
                    mempoolminfee: 0.00001,
                    minrelaytxfee: 0.00001
                }
            }
        },
        {
            name: "getrawmempool",
            description: "Retorna todas as transações no mempool",
            syntax: "bitcoin-cli getrawmempool [verbose]",
            parameters: [
                { name: "verbose", type: "boolean", required: false, description: "true para detalhes completos" }
            ],
            example: {
                command: "bitcoin-cli getrawmempool false",
                response: [
                    "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
                    "f0e1d2c3b4a5968778695a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d"
                ]
            }
        }
    ],
    wallet: [
        {
            name: "createwallet",
            description: "Cria e carrega uma nova carteira",
            syntax: 'bitcoin-cli createwallet "wallet_name" [disable_private_keys] [blank] [passphrase] [avoid_reuse] [descriptors]',
            parameters: [
                { name: "wallet_name", type: "string", required: true, description: "Nome da carteira" },
                { name: "disable_private_keys", type: "boolean", required: false, description: "Carteira apenas para watch" },
                { name: "blank", type: "boolean", required: false, description: "Criar carteira vazia" },
                { name: "passphrase", type: "string", required: false, description: "Senha para encriptação" },
                { name: "avoid_reuse", type: "boolean", required: false, description: "Evitar reutilização" },
                { name: "descriptors", type: "boolean", required: false, description: "Usar descriptors (recomendado)" }
            ],
            example: {
                command: 'bitcoin-cli createwallet "minha_carteira" false false "" false true',
                response: {
                    name: "minha_carteira",
                    warning: ""
                }
            }
        },
        {
            name: "loadwallet",
            description: "Carrega uma carteira existente",
            syntax: 'bitcoin-cli loadwallet "wallet_name"',
            parameters: [
                { name: "wallet_name", type: "string", required: true, description: "Nome da carteira" }
            ],
            example: {
                command: 'bitcoin-cli loadwallet "minha_carteira"',
                response: {
                    name: "minha_carteira",
                    warning: ""
                }
            }
        },
        {
            name: "listwallets",
            description: "Lista todas as carteiras atualmente carregadas",
            syntax: "bitcoin-cli listwallets",
            parameters: [],
            example: {
                command: "bitcoin-cli listwallets",
                response: ["wallet.dat", "savings", "trading"]
            }
        },
        {
            name: "getwalletinfo",
            description: "Retorna informações sobre a carteira atual",
            syntax: "bitcoin-cli getwalletinfo",
            parameters: [],
            example: {
                command: "bitcoin-cli getwalletinfo",
                response: {
                    walletname: "wallet.dat",
                    walletversion: 169900,
                    format: "bdb",
                    balance: 1.23456789,
                    unconfirmed_balance: 0,
                    immature_balance: 0,
                    txcount: 142,
                    keypoolsize: 1000,
                    keypoolsize_hd_internal: 1000,
                    paytxfee: 0,
                    hdseedid: "1234567890abcdef1234567890abcdef12345678",
                    private_keys_enabled: true,
                    avoid_reuse: false,
                    scanning: false
                }
            },
            responseFields: {
                walletname: {
                    type: "string",
                    description: "Nome do arquivo da carteira. Em carteiras antigas, geralmente é 'wallet.dat'. Em carteiras nomeadas, é o nome da carteira.",
                    example: "wallet.dat"
                },
                walletversion: {
                    type: "number",
                    description: "Versão do formato da carteira. Versões mais recentes suportam mais recursos como descriptors e HD wallets.",
                    example: 169900
                },
                format: {
                    type: "string",
                    description: "Formato de armazenamento da carteira. 'bdb' (Berkeley DB) para carteiras antigas, 'sqlite' para carteiras mais recentes.",
                    example: "bdb"
                },
                balance: {
                    type: "number",
                    description: "Saldo total confirmado da carteira em BTC. Inclui apenas transações com pelo menos 1 confirmação (ou minconf configurado).",
                    example: 1.23456789
                },
                unconfirmed_balance: {
                    type: "number",
                    description: "Saldo total não confirmado (pendente) da carteira em BTC. São transações que ainda não foram incluídas em um bloco.",
                    example: 0
                },
                immature_balance: {
                    type: "number",
                    description: "Saldo imaturo da carteira em BTC. São fundos de transações coinbase (mineração) que ainda não atingiram 100 confirmações.",
                    example: 0
                },
                txcount: {
                    type: "number",
                    description: "Número total de transações na carteira. Inclui todas as transações recebidas e enviadas.",
                    example: 142
                },
                keypoolsize: {
                    type: "number",
                    description: "Tamanho do pool de chaves públicas pré-geradas para recebimento. Permite gerar endereços sem acessar as chaves privadas.",
                    example: 1000
                },
                keypoolsize_hd_internal: {
                    type: "number",
                    description: "Tamanho do pool de chaves HD internas (mudança) pré-geradas. Usado para endereços de troco em transações.",
                    example: 1000
                },
                paytxfee: {
                    type: "number",
                    description: "Taxa de transação padrão configurada em BTC/kB. 0 significa que não há taxa padrão definida.",
                    example: 0
                },
                hdseedid: {
                    type: "string",
                    description: "Identificador único da semente HD (Hierarchical Deterministic). Usado para derivar todas as chaves da carteira de forma determinística.",
                    example: "1234567890abcdef1234567890abcdef12345678"
                },
                private_keys_enabled: {
                    type: "boolean",
                    description: "Indica se a carteira tem chaves privadas. 'false' significa que é uma carteira watch-only (apenas observação).",
                    example: true
                },
                avoid_reuse: {
                    type: "boolean",
                    description: "Indica se a carteira está configurada para evitar reutilização de endereços. Boa prática de privacidade.",
                    example: false
                },
                scanning: {
                    type: "boolean",
                    description: "Indica se a carteira está atualmente escaneando a blockchain em busca de transações. 'true' significa que está sincronizando.",
                    example: false
                }
            }
        },
        {
            name: "getbalance",
            description: "Retorna o saldo total da carteira",
            syntax: 'bitcoin-cli getbalance ["minconf"] [include_watchonly]',
            parameters: [
                { name: "minconf", type: "number", required: false, description: "Confirmações mínimas (padrão: 0)" },
                { name: "include_watchonly", type: "boolean", required: false, description: "Incluir watch-only" }
            ],
            example: {
                command: "bitcoin-cli getbalance",
                response: 1.23456789
            }
        },
        {
            name: "getnewaddress",
            description: "Gera um novo endereço Bitcoin para receber pagamentos",
            syntax: 'bitcoin-cli getnewaddress ["label"] ["address_type"]',
            parameters: [
                { name: "label", type: "string", required: false, description: "Etiqueta do endereço" },
                { name: "address_type", type: "string", required: false, description: "legacy, p2sh-segwit, bech32" }
            ],
            example: {
                command: 'bitcoin-cli getnewaddress "pagamentos" "bech32"',
                response: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
            }
        },
        {
            name: "listunspent",
            description: "Lista todas as transações não gastas (UTXOs)",
            syntax: "bitcoin-cli listunspent [minconf] [maxconf]",
            parameters: [
                { name: "minconf", type: "number", required: false, description: "Confirmações mínimas" },
                { name: "maxconf", type: "number", required: false, description: "Confirmações máximas" }
            ],
            example: {
                command: "bitcoin-cli listunspent 1 9999999",
                response: [
                    {
                        txid: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
                        vout: 0,
                        address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
                        label: "pagamentos",
                        scriptPubKey: "0014abcdef1234567890abcdef1234567890abcdef12",
                        amount: 0.5,
                        confirmations: 125,
                        spendable: true,
                        solvable: true,
                        safe: true
                    },
                    {
                        txid: "9f8e7d6c5b4a3e2d1c0b9a8e7d6c5b4a3e2d1c0b9a8e7d6c5b4a3e2d1c0b9a8e",
                        vout: 1,
                        address: "bc1q9rk8xvq7zp4kv8xqx8xqx8xqx8xqx8xqx8xqx8",
                        scriptPubKey: "0014123456789abcdef0123456789abcdef012345678",
                        amount: 0.73456789,
                        confirmations: 45,
                        spendable: true,
                        solvable: true,
                        safe: true
                    }
                ]
            },
            responseFields: {
                txid: {
                    type: "string",
                    description: "ID da transação (Transaction ID) em hexadecimal. Identificador único da transação que criou este UTXO.",
                    example: "1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b"
                },
                vout: {
                    type: "number",
                    description: "Índice da saída (output index) na transação. Identifica qual saída específica desta transação é o UTXO.",
                    example: 0
                },
                address: {
                    type: "string",
                    description: "Endereço Bitcoin que controla este UTXO. Pode ser em formato legacy (1...), segwit (3...), ou bech32 (bc1...).",
                    example: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
                },
                label: {
                    type: "string",
                    description: "Etiqueta associada ao endereço. Usado para organização e identificação de diferentes propósitos (ex: 'pagamentos', 'economias').",
                    example: "pagamentos"
                },
                scriptPubKey: {
                    type: "string",
                    description: "Script de bloqueio (locking script) em hexadecimal. Define as condições para gastar este UTXO. É o script que está no output da transação.",
                    example: "0014abcdef1234567890abcdef1234567890abcdef12"
                },
                amount: {
                    type: "number",
                    description: "Quantidade de Bitcoin (BTC) neste UTXO. Valor disponível para gastar.",
                    example: 0.5
                },
                confirmations: {
                    type: "number",
                    description: "Número de confirmações que este UTXO recebeu. Representa quantos blocos foram minerados desde que a transação foi incluída na blockchain.",
                    example: 125
                },
                spendable: {
                    type: "boolean",
                    description: "Indica se este UTXO pode ser gasto pela carteira. 'true' significa que a carteira tem as chaves privadas necessárias.",
                    example: true
                },
                solvable: {
                    type: "boolean",
                    description: "Indica se a carteira pode resolver o script para gastar este UTXO. Pode ser 'true' mesmo que 'spendable' seja 'false' em alguns casos.",
                    example: true
                },
                safe: {
                    type: "boolean",
                    description: "Indica se este UTXO é considerado seguro para gastar. Geralmente 'true' quando tem confirmações suficientes e não há risco de double-spend.",
                    example: true
                }
            }
        },
        {
            name: "backupwallet",
            description: "Faz backup da carteira para um arquivo específico",
            syntax: 'bitcoin-cli backupwallet "destination"',
            parameters: [
                { name: "destination", type: "string", required: true, description: "Caminho do arquivo de backup" }
            ],
            example: {
                command: 'bitcoin-cli backupwallet "/backup/wallet_backup_2025-11-02.dat"',
                response: null
            }
        },
        {
            name: "getaddressinfo",
            description: "Retorna informações detalhadas sobre um endereço da carteira",
            syntax: 'bitcoin-cli getaddressinfo "address"',
            parameters: [
                { name: "address", type: "string", required: true, description: "Endereço Bitcoin" }
            ],
            example: {
                command: 'bitcoin-cli getaddressinfo "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"',
                response: {
                    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
                    scriptPubKey: "0014abcdef1234567890abcdef1234567890abcdef12",
                    ismine: true,
                    solvable: true,
                    iswatchonly: false,
                    isscript: false,
                    iswitness: true,
                    witness_version: 0,
                    ischange: false,
                    timestamp: 1698700000,
                    hdkeypath: "m/84'/0'/0'/0/0",
                    labels: ["pagamentos"]
                }
            },
            responseFields: {
                address: {
                    type: "string",
                    description: "Endereço Bitcoin no formato legível. Pode ser legacy (1...), segwit (3...), ou bech32 (bc1...).",
                    example: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"
                },
                scriptPubKey: {
                    type: "string",
                    description: "Script de bloqueio (locking script) em hexadecimal. Define as condições para gastar fundos enviados a este endereço.",
                    example: "0014abcdef1234567890abcdef1234567890abcdef12"
                },
                ismine: {
                    type: "boolean",
                    description: "Indica se este endereço pertence à carteira atual. 'true' significa que a carteira tem as chaves privadas.",
                    example: true
                },
                solvable: {
                    type: "boolean",
                    description: "Indica se a carteira pode resolver o script para gastar fundos deste endereço. Pode ser 'true' mesmo para endereços watch-only em alguns casos.",
                    example: true
                },
                iswatchonly: {
                    type: "boolean",
                    description: "Indica se este endereço é apenas para observação (watch-only). 'true' significa que a carteira não tem as chaves privadas.",
                    example: false
                },
                isscript: {
                    type: "boolean",
                    description: "Indica se este endereço é um script (multisig, P2SH, etc.) em vez de um endereço de chave única.",
                    example: false
                },
                iswitness: {
                    type: "boolean",
                    description: "Indica se este endereço usa Segregated Witness (SegWit). 'true' para endereços bech32 e segwit.",
                    example: true
                },
                witness_version: {
                    type: "number",
                    description: "Versão do witness program. 0 para endereços bech32 padrão (P2WPKH, P2WSH). Valores maiores são para versões futuras.",
                    example: 0
                },
                ischange: {
                    type: "boolean",
                    description: "Indica se este endereço é um endereço de troco (change). Criado automaticamente para receber o troco de transações.",
                    example: false
                },
                timestamp: {
                    type: "number",
                    description: "Timestamp Unix (segundos desde 1970-01-01) de quando este endereço foi criado na carteira.",
                    example: 1698700000
                },
                hdkeypath: {
                    type: "string",
                    description: "Caminho de derivação BIP32/44 para este endereço. Formato: m/purpose'/coin_type'/account'/change/index. Usado em carteiras HD.",
                    example: "m/84'/0'/0'/0/0"
                },
                labels: {
                    type: "array",
                    description: "Lista de etiquetas associadas a este endereço. Usado para organização e categorização de endereços.",
                    example: ["pagamentos"]
                }
            }
        },
        {
            name: "getbalances",
            description: "Retorna todos os saldos da carteira (confirmado, não confirmado, imaturo)",
            syntax: "bitcoin-cli getbalances",
            parameters: [],
            example: {
                command: "bitcoin-cli getbalances",
                response: {
                    mine: {
                        trusted: 1.23456789,
                        untrusted_pending: 0,
                        immature: 0
                    },
                    watchonly: {
                        trusted: 0,
                        untrusted_pending: 0,
                        immature: 0
                    }
                }
            }
        },
        {
            name: "sendtoaddress",
            description: "Envia Bitcoin para um endereço",
            syntax: 'bitcoin-cli sendtoaddress "address" amount ["comment"] ["comment_to"] [subtractfeefromamount] [replaceable] [conf_target] [estimate_mode]',
            parameters: [
                { name: "address", type: "string", required: true, description: "Endereço de destino" },
                { name: "amount", type: "number", required: true, description: "Quantidade em BTC" },
                { name: "comment", type: "string", required: false, description: "Comentário" },
                { name: "comment_to", type: "string", required: false, description: "Comentário para destinatário" },
                { name: "subtractfeefromamount", type: "boolean", required: false, description: "Subtrair taxa do valor" },
                { name: "replaceable", type: "boolean", required: false, description: "Permitir RBF" },
                { name: "conf_target", type: "number", required: false, description: "Blocos para confirmação" },
                { name: "estimate_mode", type: "string", required: false, description: "UNSET, ECONOMICAL, CONSERVATIVE" }
            ],
            example: {
                command: 'bitcoin-cli sendtoaddress "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" 0.1',
                response: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2"
            }
        }
    ],
    transacoes: [
        {
            name: "createrawtransaction",
            description: "Cria uma transação raw não assinada",
            syntax: 'bitcoin-cli createrawtransaction "[{\\"txid\\":\\"id\\",\\"vout\\":n}]" "{\\"address\\":amount}"',
            parameters: [
                { name: "inputs", type: "array", required: true, description: "Array de inputs (txid, vout)" },
                { name: "outputs", type: "object", required: true, description: "Objeto com endereços e valores" }
            ],
            example: {
                command: 'bitcoin-cli createrawtransaction "[{\\"txid\\":\\"a1b2c3...\\",\\"vout\\":0}]" "{\\"bc1q...\\":0.1}"',
                response: "0100000001a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b20000000000ffffffff01..."
            }
        },
        {
            name: "signrawtransactionwithwallet",
            description: "Assina uma transação raw usando a carteira",
            syntax: 'bitcoin-cli signrawtransactionwithwallet "hexstring"',
            parameters: [
                { name: "hexstring", type: "string", required: true, description: "Transação raw em hex" }
            ],
            example: {
                command: 'bitcoin-cli signrawtransactionwithwallet "0100000001..."',
                response: {
                    hex: "0100000001a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2000000006a473044022...",
                    complete: true
                }
            }
        },
        {
            name: "sendrawtransaction",
            description: "Envia uma transação raw assinada para a rede",
            syntax: 'bitcoin-cli sendrawtransaction "hexstring" [maxfeerate]',
            parameters: [
                { name: "hexstring", type: "string", required: true, description: "Transação raw assinada" },
                { name: "maxfeerate", type: "number", required: false, description: "Taxa máxima em BTC/kB" }
            ],
            example: {
                command: 'bitcoin-cli sendrawtransaction "0100000001a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2000000006a473044022..."',
                response: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2"
            }
        },
        {
            name: "decoderawtransaction",
            description: "Decodifica uma transação raw em formato legível",
            syntax: 'bitcoin-cli decoderawtransaction "hexstring"',
            parameters: [
                { name: "hexstring", type: "string", required: true, description: "Transação raw em hex" }
            ],
            example: {
                command: 'bitcoin-cli decoderawtransaction "0100000001..."',
                response: {
                    txid: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
                    hash: "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
                    version: 2,
                    size: 225,
                    vsize: 225,
                    weight: 900,
                    locktime: 0,
                    vin: [
                        {
                            txid: "f1e2d3c4b5a6978879685a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d",
                            vout: 0,
                            scriptSig: {
                                asm: "...",
                                hex: "..."
                            },
                            sequence: 4294967295
                        }
                    ],
                    vout: [
                        {
                            value: 0.1,
                            n: 0,
                            scriptPubKey: {
                                asm: "OP_0 abcdef1234567890abcdef1234567890abcdef12",
                                hex: "0014abcdef1234567890abcdef1234567890abcdef12",
                                address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
                                type: "witness_v0_keyhash"
                            }
                        }
                    ]
                }
            }
        },
        {
            name: "createpsbt",
            description: "Cria um PSBT (Partially Signed Bitcoin Transaction)",
            syntax: 'bitcoin-cli createpsbt "[{\\"txid\\":\\"id\\",\\"vout\\":n}]" "{\\"address\\":amount}"',
            parameters: [
                { name: "inputs", type: "array", required: true, description: "Array de inputs" },
                { name: "outputs", type: "object", required: true, description: "Objeto com outputs" }
            ],
            example: {
                command: 'bitcoin-cli createpsbt "[{\\"txid\\":\\"a1b2c3...\\",\\"vout\\":0}]" "{\\"bc1q...\\":0.1}"',
                response: "cHNidP8BAH0CAAAA..."
            }
        },
        {
            name: "walletprocesspsbt",
            description: "Processa um PSBT usando a carteira",
            syntax: 'bitcoin-cli walletprocesspsbt "psbt" [sign] [sighashtype] [bip32derivs]',
            parameters: [
                { name: "psbt", type: "string", required: true, description: "PSBT em base64" },
                { name: "sign", type: "boolean", required: false, description: "Assinar a transação" },
                { name: "sighashtype", type: "string", required: false, description: "Tipo de hash de assinatura" },
                { name: "bip32derivs", type: "boolean", required: false, description: "Incluir derivações BIP32" }
            ],
            example: {
                command: 'bitcoin-cli walletprocesspsbt "cHNidP8BAH0CAAAA..." true',
                response: {
                    psbt: "cHNidP8BAH0CAAAA...",
                    complete: true
                }
            }
        }
    ],
    rede: [
        {
            name: "getnetworkinfo",
            description: "Retorna informações sobre a rede P2P",
            syntax: "bitcoin-cli getnetworkinfo",
            parameters: [],
            example: {
                command: "bitcoin-cli getnetworkinfo",
                response: {
                    version: 300000,
                    subversion: "/Satoshi:30.0.0/",
                    protocolversion: 70016,
                    localservices: "000000000000040d",
                    localservicesnames: ["NETWORK", "WITNESS", "NETWORK_LIMITED"],
                    localrelay: true,
                    timeoffset: 0,
                    networkactive: true,
                    connections: 12,
                    connections_in: 2,
                    connections_out: 10,
                    network: "ipv4"
                }
            },
            responseFields: {
                version: {
                    type: "number",
                    description: "Versão do cliente Bitcoin Core. 300000 representa a versão 30.0.0 (formato: versão * 10000).",
                    example: 300000
                },
                subversion: {
                    type: "string",
                    description: "String de identificação do cliente enviada aos peers. Contém o nome e versão do software.",
                    example: "/Satoshi:30.0.0/"
                },
                protocolversion: {
                    type: "number",
                    description: "Versão do protocolo P2P Bitcoin que este nó suporta. Versões mais recentes incluem mais recursos.",
                    example: 70016
                },
                localservices: {
                    type: "string",
                    description: "Serviços oferecidos por este nó em hexadecimal. Indica quais recursos o nó suporta (rede completa, witness, etc.).",
                    example: "000000000000040d"
                },
                localservicesnames: {
                    type: "array",
                    description: "Lista de nomes dos serviços oferecidos. Inclui NETWORK (nó completo), WITNESS (SegWit), NETWORK_LIMITED (nó limitado), etc.",
                    example: ["NETWORK", "WITNESS", "NETWORK_LIMITED"]
                },
                localrelay: {
                    type: "boolean",
                    description: "Indica se este nó está retransmitindo transações para outros peers. 'true' significa que está atuando como relay.",
                    example: true
                },
                timeoffset: {
                    type: "number",
                    description: "Diferença de tempo em segundos entre o relógio local e os peers. Valores próximos de 0 indicam sincronização correta.",
                    example: 0
                },
                networkactive: {
                    type: "boolean",
                    description: "Indica se a rede P2P está ativa. 'true' significa que o nó está conectado e comunicando com outros nós.",
                    example: true
                },
                connections: {
                    type: "number",
                    description: "Número total de conexões ativas com outros peers na rede Bitcoin.",
                    example: 12
                },
                connections_in: {
                    type: "number",
                    description: "Número de conexões de entrada (inbound). São peers que se conectaram a este nó.",
                    example: 2
                },
                connections_out: {
                    type: "number",
                    description: "Número de conexões de saída (outbound). São peers aos quais este nó se conectou.",
                    example: 10
                },
                network: {
                    type: "string",
                    description: "Tipo de rede sendo usada. Pode ser 'ipv4', 'ipv6', 'onion' (Tor), ou 'i2p'.",
                    example: "ipv4"
                }
            }
        },
        {
            name: "getconnectioncount",
            description: "Retorna o número de conexões ativas",
            syntax: "bitcoin-cli getconnectioncount",
            parameters: [],
            example: {
                command: "bitcoin-cli getconnectioncount",
                response: 12
            }
        },
        {
            name: "getpeerinfo",
            description: "Retorna informações detalhadas sobre cada peer conectado",
            syntax: "bitcoin-cli getpeerinfo",
            parameters: [],
            example: {
                command: "bitcoin-cli getpeerinfo",
                response: [
                    {
                        id: 1,
                        addr: "192.168.1.1:8333",
                        addrbind: "192.168.1.100:54321",
                        addrlocal: "192.168.1.100:54321",
                        services: "000000000000040d",
                        servicesnames: ["NETWORK", "WITNESS", "NETWORK_LIMITED"],
                        relaytxes: true,
                        lastsend: 1698765432,
                        lastrecv: 1698765430,
                        last_transaction: 1698765400,
                        last_block: 1698765000,
                       bytessent: 1234567,
                        bytesrecv: 2345678,
                        conntime: 1698700000,
                        timeoffset: 0,
                        pingtime: 0.05,
                        minping: 0.04,
                        version: 70016,
                        subver: "/Satoshi:30.0.0/",
                        inbound: false,
                        addnode: false,
                        startingheight: 815000,
                        banscore: 0,
                        synced_headers: 815234,
                        synced_blocks: 815234,
                        inflight: [],
                        whitelisted: false,
                        permissions: [],
                        minfeefilter: 0.00001,
                        bytessent_per_msg: {
                            addr: 1234,
                            feefilter: 32,
                            getheaders: 1024,
                            headers: 5678,
                            inv: 12345,
                            ping: 32,
                            pong: 32,
                            sendcmpct: 66,
                            sendheaders: 24,
                            tx: 123456,
                            verack: 24,
                            version: 126
                        },
                        bytesrecv_per_msg: {
                            addr: 2345,
                            feefilter: 32,
                            getdata: 1234,
                            getheaders: 1024,
                            headers: 6789,
                            inv: 23456,
                            ping: 32,
                            pong: 32,
                            sendcmpct: 66,
                            sendheaders: 24,
                            tx: 234567,
                            verack: 24,
                            version: 126
                        }
                    }
                ]
            }
        },
        {
            name: "addnode",
            description: "Adiciona ou remove um node da lista de conexões",
            syntax: 'bitcoin-cli addnode "node" "add|remove|onetry"',
            parameters: [
                { name: "node", type: "string", required: true, description: "Endereço do node" },
                { name: "command", type: "string", required: true, description: "add, remove ou onetry" }
            ],
            example: {
                command: 'bitcoin-cli addnode "192.168.1.1:8333" "add"',
                response: null
            }
        },
        {
            name: "ping",
            description: "Envia um ping para todos os peers conectados",
            syntax: "bitcoin-cli ping",
            parameters: [],
            example: {
                command: "bitcoin-cli ping",
                response: null
            }
        }
    ],
    mineracao: [
        {
            name: "getmininginfo",
            description: "Retorna informações sobre mineração",
            syntax: "bitcoin-cli getmininginfo",
            parameters: [],
            example: {
                command: "bitcoin-cli getmininginfo",
                response: {
                    blocks: 815234,
                    currentblockweight: 4000000,
                    currentblocktx: 2456,
                    difficulty: 62463471666142.88,
                    networkhashps: 500000000000000000,
                    pooledtx: 1234,
                    chain: "main",
                    warnings: ""
                }
            },
            responseFields: {
                blocks: {
                    type: "number",
                    description: "Número do último bloco na blockchain local. Representa a altura atual da cadeia.",
                    example: 815234
                },
                currentblockweight: {
                    type: "number",
                    description: "Peso (weight) total do bloco atual sendo construído. Limite máximo é 4.000.000 (4MB de weight).",
                    example: 4000000
                },
                currentblocktx: {
                    type: "number",
                    description: "Número de transações no bloco atual sendo construído. Inclui apenas transações não confirmadas.",
                    example: 2456
                },
                difficulty: {
                    type: "number",
                    description: "Dificuldade atual da proof-of-work. Representa o quão difícil é encontrar um hash válido para um novo bloco.",
                    example: 62463471666142.88
                },
                networkhashps: {
                    type: "number",
                    description: "Hash rate estimado da rede em hashes por segundo. Representa o poder computacional total da rede Bitcoin.",
                    example: 500000000000000000
                },
                pooledtx: {
                    type: "number",
                    description: "Número de transações no mempool local aguardando para serem incluídas em um bloco.",
                    example: 1234
                },
                chain: {
                    type: "string",
                    description: "Rede da blockchain. Valores: 'main' (principal), 'test' (testnet), 'regtest' (teste local).",
                    example: "main"
                },
                warnings: {
                    type: "string",
                    description: "Avisos sobre o estado da mineração ou da rede. String vazia significa que não há avisos.",
                    example: ""
                }
            }
        },
        {
            name: "getnetworkhashps",
            description: "Retorna o hash rate estimado da rede",
            syntax: "bitcoin-cli getnetworkhashps [nblocks] [height]",
            parameters: [
                { name: "nblocks", type: "number", required: false, description: "Número de blocos (padrão: 120)" },
                { name: "height", type: "number", required: false, description: "Altura do bloco" }
            ],
            example: {
                command: "bitcoin-cli getnetworkhashps",
                response: 500000000000000000
            }
        },
        {
            name: "getblocktemplate",
            description: "Retorna um template de bloco para mineração",
            syntax: 'bitcoin-cli getblocktemplate ["template_request"]',
            parameters: [
                { name: "template_request", type: "object", required: false, description: "Configurações do template" }
            ],
            example: {
                command: 'bitcoin-cli getblocktemplate "{\\"rules\\":[\\"segwit\\"]}"',
                response: {
                    capabilities: ["proposal"],
                    version: 536870912,
                    rules: ["segwit"],
                    vbavailable: {},
                    vbrequired: 0,
                    previousblockhash: "00000000000000000002a7c4c1e48d76c5a37902165a270156b7a8d72728a054",
                    transactions: [],
                    coinbaseaux: {
                        flags: ""
                    },
                    coinbasevalue: 312500000,
                    longpollid: "00000000000000000002a7c4c1e48d76c5a37902165a270156b7a8d72728a054123",
                    target: "00000000000000000002a7c4c1e48d76c5a37902165a270156b7a8d72728a054",
                    mintime: 1698765432,
                    mutable: ["time", "transactions", "prevblock"],
                    noncerange: "00000000ffffffff",
                    sigoplimit: 80000,
                    sizelimit: 4000000,
                    weightlimit: 4000000,
                    curtime: 1698765432,
                    bits: "170469f0",
                    height: 815235
                }
            }
        },
        {
            name: "submitblock",
            description: "Submete um novo bloco para a rede",
            syntax: 'bitcoin-cli submitblock "hexdata" ["dummy"]',
            parameters: [
                { name: "hexdata", type: "string", required: true, description: "Bloco em formato hex" },
                { name: "dummy", type: "string", required: false, description: "Ignorado" }
            ],
            example: {
                command: 'bitcoin-cli submitblock "01000000..."',
                response: null
            }
        },
        {
            name: "generatetoaddress",
            description: "Gera blocos para um endereço (apenas regtest)",
            syntax: 'bitcoin-cli generatetoaddress nblocks "address" [maxtries]',
            parameters: [
                { name: "nblocks", type: "number", required: true, description: "Número de blocos" },
                { name: "address", type: "string", required: true, description: "Endereço para receber recompensa" },
                { name: "maxtries", type: "number", required: false, description: "Tentativas máximas" }
            ],
            example: {
                command: 'bitcoin-cli generatetoaddress 1 "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"',
                response: [
                    "00000000000000000002a7c4c1e48d76c5a37902165a270156b7a8d72728a054"
                ]
            }
        }
    ],
    utilitarios: [
        {
            name: "validateaddress",
            description: "Valida um endereço Bitcoin",
            syntax: 'bitcoin-cli validateaddress "address"',
            parameters: [
                { name: "address", type: "string", required: true, description: "Endereço Bitcoin para validar" }
            ],
            example: {
                command: 'bitcoin-cli validateaddress "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh"',
                response: {
                    isvalid: true,
                    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
                    scriptPubKey: "0014abcdef1234567890abcdef1234567890abcdef12",
                    isscript: false,
                    iswitness: true,
                    witness_version: 0,
                    witness_program: "abcdef1234567890abcdef1234567890abcdef12"
                }
            }
        },
        {
            name: "estimatesmartfee",
            description: "Estima a taxa de transação recomendada",
            syntax: "bitcoin-cli estimatesmartfee conf_target [estimate_mode]",
            parameters: [
                { name: "conf_target", type: "number", required: true, description: "Blocos para confirmação" },
                { name: "estimate_mode", type: "string", required: false, description: "UNSET, ECONOMICAL, CONSERVATIVE" }
            ],
            example: {
                command: "bitcoin-cli estimatesmartfee 6",
                response: {
                    feerate: 0.00005,
                    blocks: 6
                }
            }
        },
        {
            name: "help",
            description: "Lista todos os comandos disponíveis ou mostra ajuda de um comando específico",
            syntax: 'bitcoin-cli help [command]',
            parameters: [
                { name: "command", type: "string", required: false, description: "Comando para obter ajuda" }
            ],
            example: {
                command: "bitcoin-cli help",
                response: "== Blockchain ==\ngetbestblockhash\ngetblock\n..."
            }
        },
        {
            name: "stop",
            description: "Para o servidor Bitcoin",
            syntax: "bitcoin-cli stop",
            parameters: [],
            example: {
                command: "bitcoin-cli stop",
                response: "Bitcoin server stopping"
            }
        },
        {
            name: "uptime",
            description: "Retorna o tempo de atividade do servidor",
            syntax: "bitcoin-cli uptime",
            parameters: [],
            example: {
                command: "bitcoin-cli uptime",
                response: 86400
            }
        },
        {
            name: "getmemoryinfo",
            description: "Retorna informações sobre o uso de memória",
            syntax: 'bitcoin-cli getmemoryinfo ["mode"]',
            parameters: [
                { name: "mode", type: "string", required: false, description: "stats ou mallocinfo" }
            ],
            example: {
                command: 'bitcoin-cli getmemoryinfo "stats"',
                response: {
                    locked: {
                        used: 12345678,
                        free: 98765432,
                        total: 111111110,
                        locked: 50000000,
                        chunks_used: 100,
                        chunks_free: 200
                    }
                }
            }
        }
    ]
};

// Command category mapping for search
const commandCategoryMap = {
    getbestblockhash: "blockchain",
    getblockchaininfo: "blockchain",
    getblock: "blockchain",
    getblockcount: "blockchain",
    getblockhash: "blockchain",
    getdifficulty: "blockchain",
    getchaintips: "blockchain",
    getblockstats: "blockchain",
    gettxout: "blockchain",
    getmempoolinfo: "blockchain",
    getrawmempool: "blockchain",
    createwallet: "wallet",
    loadwallet: "wallet",
    listwallets: "wallet",
    getwalletinfo: "wallet",
    getbalance: "wallet",
    getnewaddress: "wallet",
    listunspent: "wallet",
    backupwallet: "wallet",
    getaddressinfo: "wallet",
    getbalances: "wallet",
    sendtoaddress: "wallet",
    createrawtransaction: "transacoes",
    signrawtransactionwithwallet: "transacoes",
    sendrawtransaction: "transacoes",
    decoderawtransaction: "transacoes",
    createpsbt: "transacoes",
    walletprocesspsbt: "transacoes",
    getnetworkinfo: "rede",
    getconnectioncount: "rede",
    getpeerinfo: "rede",
    addnode: "rede",
    ping: "rede",
    getmininginfo: "mineracao",
    getnetworkhashps: "mineracao",
    getblocktemplate: "mineracao",
    submitblock: "mineracao",
    generatetoaddress: "mineracao",
    validateaddress: "utilitarios",
    estimatesmartfee: "utilitarios",
    help: "utilitarios",
    stop: "utilitarios",
    uptime: "utilitarios",
    getmemoryinfo: "utilitarios"
};

// Get all commands for reference tab
function getAllCommands() {
    const allCommands = [];
    for (const category in bitcoinCommands) {
        allCommands.push(...bitcoinCommands[category]);
    }
    return allCommands;
}


