# 👟 Semelle - Sistema de Gestão de Vendas e Estoque

Sistema completo para loja de calçados, com controle de produtos, estoque por tamanhos, vendas, fluxo de caixa, clientes e **impressão de comprovante de venda**.

## 🌐 Acesse o sistema online

🔗 **URL do sistema:** [https://dulcet-narwhal-c7632b.netlify.app](https://dulcet-narwhal-c7632b.netlify.app)

> ⚠️ O backend está hospedado no plano gratuito do Render. Pode haver um atraso de até 50 segundos na primeira requisição enquanto o serviço desperta.

## 🔐 Credenciais de acesso (administrador)

- **E-mail:** `admin@semelle.com`
- **Senha:** `123456`

Após login, você pode cadastrar produtos, clientes, realizar vendas e emitir comprovantes.

## ✨ Funcionalidades principais

- **Dashboard** com gráficos de vendas por dia, forma de pagamento e top clientes
- **Gestão de produtos** com estoque por tamanhos (do 33 ao 46 + tamanhos personalizados)
- **Registro de vendas** com baixa automática de estoque
- **Histórico de vendas** e reimpressão de comprovante
- **Controle de clientes** (limite de crédito, endereço, telefone)
- **Fluxo de caixa** (receitas e despesas com upload de comprovante)
- **Backup manual** do banco de dados (apenas administrador)
- **Autenticação JWT** com dois perfis: usuário comum e administrador

## 🛠️ Tecnologias utilizadas

### Backend
- Node.js + Express
- better-sqlite3 (banco de dados SQLite)
- JWT para autenticação
- bcryptjs para hash de senhas
- multer para upload de arquivos

### Frontend
- HTML5, CSS3, JavaScript puro
- Chart.js para gráficos
- Font Awesome para ícones
- Design responsivo e botão de impressão do comprovante

### Hospedagem
- **Render** – backend (API) → [https://semelle-api.onrender.com](https://semelle-api.onrender.com)
- **Netlify** – frontend (interface) → [https://dulcet-narwhal-c7632b.netlify.app](https://dulcet-narwhal-c7632b.netlify.app)

## 🚀 Como rodar localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Gabriel7z/CRUD.git
   cd CRUD


   Instale as dependências:

bash
npm install
Inicie o servidor backend:

bash
node server-sqlite.js
O servidor rodará em http://localhost:3000

Abra o arquivo index.html no navegador (ou use Live Server).

Faça login com as credenciais acima.

📦 Estrutura de pastas (relevante)
text
/
├── server-sqlite.js          # Backend principal
├── index.html                # Frontend completo (all-in-one)
├── package.json              # Dependências Node.js
├── semelle.db                # Banco de dados (criado na primeira execução)
├── uploads/                  # Pasta para comprovantes (criada automaticamente)
├── backups/                  # Pasta para backups (criada ao gerar backup)
└── README.md                 # Este arquivo
⚙️ Configuração para produção (ambiente online)
O backend está configurado para usar a porta fornecida pelo serviço de hospedagem (process.env.PORT).

O frontend aponta para a URL do backend através da variável API no index.html.

Para deploy no Render: comando node server-sqlite.js.

Para deploy no Netlify: arrastar a pasta contendo o index.html.

📄 Licença
Este projeto está sob a licença MIT. Sinta-se à vontade para usar, modificar e distribuir.

✒️ Autor
Gabriel Ferreira – GitHub



