# 💰 FinGuard Bot - Bot de Controle Financeiro para WhatsApp

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Um bot inteligente para WhatsApp que ajuda você a gerenciar suas finanças pessoais de forma simples e eficiente.

## ✨ Funcionalidades

- 💳 **Gerenciamento de Cartões** - Cadastre seus cartões e acompanhe os limites
- 💸 **Registro de Gastos** - Registre despesas rapidamente por comando
- 💰 **Registro de Receitas** - Acompanhe suas entradas de dinheiro
- 📊 **Extrato Mensal** - Visualize resumo completo do mês
- 📈 **Limites de Cartão** - Monitore o uso dos seus cartões com barra de progresso visual
- 🔒 **Fechamento de Mês** - Feche o mês e reinicie os contadores

## 🚀 Instalação

### Pré-requisitos

- Node.js 18 ou superior
- NPM ou Yarn
- WhatsApp ativo no celular

### Passos

1. **Clone o repositório**
   ```bash
   git clone https://github.com/MAY0LPHI/bot-de-controle-financeiro.git
   cd bot-de-controle-financeiro/dados
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o bot**
   ```bash
   npm run config:install
   ```

4. **Inicie o bot**
   ```bash
   npm start
   ```

5. **Escaneie o QR Code**
   - Abra o WhatsApp no seu celular
   - Vá em **Configurações > Dispositivos Conectados > Conectar Dispositivo**
   - Escaneie o QR Code exibido no terminal

## 📱 Comandos

### 💳 Cartões

| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| `!cartao-add <nome> <limite>` | Adiciona um novo cartão | `!cartao-add Nubank 5000` |
| `!cartao-limite <nome> <valor>` | Define/atualiza limite | `!cartao-limite Nubank 8000` |
| `!limites` | Lista todos os cartões e limites | `!limites` |

### 💸 Lançamentos

| Comando | Descrição | Exemplo |
|---------|-----------|---------|
| `!gasto <valor> <descrição> [cartão]` | Registra um gasto | `!gasto 50,00 Almoço Nubank` |
| `!receita <valor> <descrição>` | Registra uma receita | `!receita 3000 Salário` |

### 📊 Relatórios

| Comando | Descrição |
|---------|-----------|
| `!extrato` | Mostra extrato do mês atual |
| `!limites` | Mostra status dos limites dos cartões |

### ⚙️ Gestão

| Comando | Descrição |
|---------|-----------|
| `!fechar-mes` | Fecha o mês e reseta gastos dos cartões |
| `!recibo` | Envia comprovante (em desenvolvimento) |

### 📌 Utilitários

| Comando | Descrição |
|---------|-----------|
| `!menu` ou `!ajuda` | Exibe o menu completo |
| `!ping` | Verifica se o bot está online |

## ⚙️ Configuração

O arquivo de configuração está em `dados/src/config.json`:

```json
{
  "prefixo": "!",
  "nomebot": "FinGuard Bot",
  "ownerNumber": "",
  "grupoLog": "",
  "autoRead": true,
  "antiFake": false,
  "comandosPorMinuto": 15,
  "tempoLimiteResposta": 30000,
  "moeda": "BRL",
  "simboloMoeda": "R$",
  "fusoHorario": "America/Sao_Paulo"
}
```

### Opções

| Opção | Descrição | Padrão |
|-------|-----------|--------|
| `prefixo` | Prefixo dos comandos | `!` |
| `nomebot` | Nome exibido do bot | `FinGuard Bot` |
| `ownerNumber` | Número do proprietário | `` |
| `autoRead` | Marcar mensagens como lidas | `true` |
| `moeda` | Código da moeda | `BRL` |
| `simboloMoeda` | Símbolo da moeda | `R$` |
| `fusoHorario` | Fuso horário para datas | `America/Sao_Paulo` |

## 📁 Estrutura do Projeto

```
dados/
├── package.json           # Dependências e scripts
├── src/
│   ├── config.json        # Configurações do bot
│   ├── connect.js         # Conexão WhatsApp (Baileys)
│   ├── index.js           # Processador de mensagens
│   ├── database.js        # Persistência de dados
│   ├── helpers.js         # Funções auxiliares
│   ├── paths.js           # Caminhos do sistema
│   ├── menus/
│   │   ├── index.js       # Exportador de menus
│   │   └── menu.js        # Menu principal
│   ├── funcs/
│   │   ├── exports.js     # Mapeamento de comandos
│   │   ├── financeiro.js  # Handlers financeiros
│   │   └── utils/
│   │       └── ping.js    # Comando ping
│   └── .scripts/
│       ├── config.js      # Script de configuração
│       ├── start.js       # Script de inicialização
│       └── update.js      # Script de atualização
└── data/                  # Dados persistidos
    ├── financeiro.json    # Banco de dados financeiro
    └── backups/           # Backups mensais
```

## 🛠️ Scripts NPM

```bash
npm start          # Inicia o bot
npm run dev        # Inicia em modo desenvolvimento (watch)
npm run config     # Mostra configuração atual
npm run config:install  # Cria arquivo de configuração
npm run update     # Verifica atualizações (em desenvolvimento)
```

## 📦 Dependências

- **whaileys** - Biblioteca para conectar ao WhatsApp
- **@hapi/boom** - Tratamento de erros HTTP
- **axios** - Cliente HTTP
- **fluent-ffmpeg** - Processamento de mídia
- **linkedom** - Parser HTML
- **node-cache** - Cache em memória
- **node-cron** - Agendamento de tarefas
- **node-webpmux** - Manipulação de WebP
- **pino** - Logger de alta performance
- **qrcode-terminal** - QR Code no terminal

## 🔮 Roadmap

- [ ] Processamento de recibos por imagem (OCR)
- [ ] Gráficos e relatórios visuais
- [ ] Categorização automática de gastos
- [ ] Metas de economia
- [ ] Lembretes de contas a pagar
- [ ] Exportação para Excel/PDF
- [ ] Anti-delete de mensagens
- [ ] Fila de mensagens com rate limiting

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

💰 **FinGuard Bot** - Organize suas finanças com inteligência!