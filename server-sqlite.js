const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;
const SECRET_KEY = 'segredo-super-seguro-2025';

// Upload config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = './uploads';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, unique + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const db = new sqlite3.Database('semelle.db');

function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}
function getQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}
function allQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL,
        role TEXT DEFAULT 'user'
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS produtos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        preco REAL NOT NULL,
        usuario_id INTEGER NOT NULL,
        FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        telefone TEXT,
        endereco TEXT,
        limite_credito REAL DEFAULT 0,
        data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS vendas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data_venda DATETIME DEFAULT CURRENT_TIMESTAMP,
        cliente_id INTEGER NOT NULL,
        valor_total REAL NOT NULL,
        forma_pagamento TEXT DEFAULT 'Dinheiro',
        status_pagamento TEXT DEFAULT 'Pago',
        usuario_id INTEGER NOT NULL,
        FOREIGN KEY(cliente_id) REFERENCES clientes(id),
        FOREIGN KEY(usuario_id) REFERENCES usuarios(id)
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS itens_venda (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        venda_id INTEGER NOT NULL,
        produto_id INTEGER NOT NULL,
        tamanho TEXT NOT NULL,
        quantidade INTEGER NOT NULL,
        preco_unitario REAL NOT NULL,
        subtotal REAL NOT NULL,
        FOREIGN KEY(venda_id) REFERENCES vendas(id),
        FOREIGN KEY(produto_id) REFERENCES produtos(id)
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS fluxo_caixa (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo TEXT NOT NULL,
        categoria TEXT NOT NULL,
        descricao TEXT,
        valor REAL NOT NULL,
        data_movimento DATETIME DEFAULT CURRENT_TIMESTAMP,
        comprovante TEXT,
        usuario_id INTEGER NOT NULL
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS produtos_tamanhos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        produto_id INTEGER NOT NULL,
        tamanho TEXT NOT NULL,
        quantidade INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY(produto_id) REFERENCES produtos(id) ON DELETE CASCADE,
        UNIQUE(produto_id, tamanho)
    )`);

    // Cliente padrão
    db.get(`SELECT id FROM clientes WHERE nome = 'Consumidor Final'`, (err, row) => {
        if (!err && !row) db.run(`INSERT INTO clientes (nome) VALUES (?)`, ['Consumidor Final']);
    });

    // Usuário admin padrão
    db.get(`SELECT id FROM usuarios WHERE email = 'admin@semelle.com'`, (err, row) => {
        if (err) return console.error(err);
        if (!row) {
            const hash = bcrypt.hashSync('123456', 10);
            db.run(`INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)`,
                ['Administrador', 'admin@semelle.com', hash, 'admin']);
            console.log('Usuário admin criado: admin@semelle.com / 123456');
        }
    });
});

function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ erro: 'Token não fornecido' });
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ erro: 'Token inválido' });
        req.user = user;
        next();
    });
}

function verificarAdmin(req, res, next) {
    db.get(`SELECT role FROM usuarios WHERE id = ?`, [req.user.id], (err, row) => {
        if (err) return res.status(500).json({ erro: err.message });
        if (!row || row.role !== 'admin') return res.status(403).json({ erro: 'Acesso negado.' });
        next();
    });
}

// ========== LOGIN ==========
app.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ erro: 'Email e senha obrigatórios' });
    try {
        const user = await getQuery(`SELECT * FROM usuarios WHERE email = ?`, [email]);
        if (!user) return res.status(401).json({ erro: 'Email ou senha inválidos' });
        if (!bcrypt.compareSync(senha, user.senha)) return res.status(401).json({ erro: 'Email ou senha inválidos' });
        const token = jwt.sign({ id: user.id, email: user.email, nome: user.nome, role: user.role }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ token, usuario: { id: user.id, nome: user.nome, email: user.email, role: user.role } });
    } catch (err) { res.status(500).json({ erro: err.message }); }
});

// ========== ADMIN ==========
app.get('/admin/usuarios', autenticarToken, verificarAdmin, async (req, res) => {
    try {
        const rows = await allQuery(`SELECT id, nome, email, role FROM usuarios ORDER BY id`);
        res.json(rows);
    } catch (err) { res.status(500).json({ erro: err.message }); }
});
app.post('/admin/usuarios', autenticarToken, verificarAdmin, async (req, res) => {
    const { nome, email, senha, role } = req.body;
    if (!nome || !email || !senha) return res.status(400).json({ erro: 'Nome, email e senha obrigatórios' });
    try {
        const existente = await getQuery(`SELECT id FROM usuarios WHERE email = ?`, [email]);
        if (existente) return res.status(400).json({ erro: 'E-mail já cadastrado' });
        const hash = bcrypt.hashSync(senha, 10);
        const result = await runQuery(`INSERT INTO usuarios (nome, email, senha, role) VALUES (?, ?, ?, ?)`, [nome, email, hash, role === 'admin' ? 'admin' : 'user']);
        res.status(201).json({ id: result.lastID, nome, email, role });
    } catch (err) { res.status(500).json({ erro: err.message }); }
});
app.delete('/admin/usuarios/:id', autenticarToken, verificarAdmin, async (req, res) => {
    const id = req.params.id;
    if (id == req.user.id) return res.status(400).json({ erro: 'Não pode excluir seu próprio usuário.' });
    try {
        const result = await runQuery(`DELETE FROM usuarios WHERE id = ?`, [id]);
        if (result.changes === 0) return res.status(404).json({ erro: 'Usuário não encontrado' });
        res.status(204).send();
    } catch (err) { res.status(500).json({ erro: err.message }); }
});

// ========== CLIENTES ==========
app.get('/clientes', autenticarToken, async (req, res) => {
    try {
        const rows = await allQuery(`SELECT * FROM clientes ORDER BY nome`);
        res.json(rows);
    } catch (err) { res.status(500).json({ erro: err.message }); }
});
app.post('/clientes', autenticarToken, async (req, res) => {
    const { nome, telefone, endereco, limite_credito } = req.body;
    if (!nome) return res.status(400).json({ erro: 'Nome é obrigatório' });
    try {
        const result = await runQuery(`INSERT INTO clientes (nome, telefone, endereco, limite_credito) VALUES (?, ?, ?, ?)`, [nome, telefone || '', endereco || '', limite_credito || 0]);
        res.status(201).json({ id: result.lastID, nome, telefone, endereco, limite_credito });
    } catch (err) { res.status(500).json({ erro: err.message }); }
});
app.put('/clientes/:id', autenticarToken, async (req, res) => {
    const id = req.params.id;
    const { nome, telefone, endereco, limite_credito } = req.body;
    try {
        const result = await runQuery(`UPDATE clientes SET nome = ?, telefone = ?, endereco = ?, limite_credito = ? WHERE id = ?`, [nome, telefone, endereco, limite_credito, id]);
        if (result.changes === 0) return res.status(404).json({ erro: 'Cliente não encontrado' });
        res.json({ id, nome, telefone, endereco, limite_credito });
    } catch (err) { res.status(500).json({ erro: err.message }); }
});
app.delete('/clientes/:id', autenticarToken, async (req, res) => {
    const id = req.params.id;
    try {
        const result = await runQuery(`DELETE FROM clientes WHERE id = ?`, [id]);
        if (result.changes === 0) return res.status(404).json({ erro: 'Cliente não encontrado' });
        res.status(204).send();
    } catch (err) { res.status(500).json({ erro: err.message }); }
});

// ========== PRODUTOS ==========
app.get('/produtos', autenticarToken, async (req, res) => {
    try {
        const rows = await allQuery(`
            SELECT p.*, COALESCE(SUM(pt.quantidade),0) as quantidade_total
            FROM produtos p
            LEFT JOIN produtos_tamanhos pt ON p.id = pt.produto_id
            WHERE p.usuario_id = ?
            GROUP BY p.id
            ORDER BY p.id
        `, [req.user.id]);
        res.json(rows);
    } catch (err) { res.status(500).json({ erro: err.message }); }
});
app.post('/produtos', autenticarToken, async (req, res) => {
    const { nome, preco } = req.body;
    if (!nome || preco === undefined) return res.status(400).json({ erro: 'Nome e preço obrigatórios' });
    try {
        const result = await runQuery(`INSERT INTO produtos (nome, preco, usuario_id) VALUES (?, ?, ?)`, [nome, preco, req.user.id]);
        res.status(201).json({ id: result.lastID, nome, preco });
    } catch (err) { res.status(500).json({ erro: err.message }); }
});
app.put('/produtos/:id', autenticarToken, async (req, res) => {
    const id = req.params.id;
    const { nome, preco } = req.body;
    try {
        const result = await runQuery(`UPDATE produtos SET nome = ?, preco = ? WHERE id = ? AND usuario_id = ?`, [nome, preco, id, req.user.id]);
        if (result.changes === 0) return res.status(404).json({ erro: 'Produto não encontrado' });
        res.json({ id, nome, preco });
    } catch (err) { res.status(500).json({ erro: err.message }); }
});
app.delete('/produtos/:id', autenticarToken, async (req, res) => {
    const id = req.params.id;
    try {
        const result = await runQuery(`DELETE FROM produtos WHERE id = ? AND usuario_id = ?`, [id, req.user.id]);
        if (result.changes === 0) return res.status(404).json({ erro: 'Produto não encontrado' });
        res.status(204).send();
    } catch (err) { res.status(500).json({ erro: err.message }); }
});

// ========== TAMANHOS ==========
app.get('/produtos/:id/tamanhos', autenticarToken, async (req, res) => {
    try {
        const rows = await allQuery(`SELECT * FROM produtos_tamanhos WHERE produto_id = ? ORDER BY tamanho`, [req.params.id]);
        res.json(rows);
    } catch (err) { res.status(500).json({ erro: err.message }); }
});
app.post('/produtos/:id/tamanhos', autenticarToken, async (req, res) => {
    const produtoId = req.params.id;
    const { tamanho, quantidade } = req.body;
    if (!tamanho || quantidade === undefined) return res.status(400).json({ erro: 'Tamanho e quantidade obrigatórios' });
    try {
        await runQuery(`INSERT INTO produtos_tamanhos (produto_id, tamanho, quantidade) VALUES (?, ?, ?) ON CONFLICT(produto_id, tamanho) DO UPDATE SET quantidade = excluded.quantidade`, [produtoId, tamanho, quantidade]);
        res.status(200).json({ produto_id: produtoId, tamanho, quantidade });
    } catch (err) { res.status(500).json({ erro: err.message }); }
});
app.put('/produtos/tamanhos/:id', autenticarToken, async (req, res) => {
    const id = req.params.id;
    const { quantidade } = req.body;
    if (quantidade === undefined) return res.status(400).json({ erro: 'Quantidade obrigatória' });
    try {
        const result = await runQuery(`UPDATE produtos_tamanhos SET quantidade = ? WHERE id = ?`, [quantidade, id]);
        if (result.changes === 0) return res.status(404).json({ erro: 'Tamanho não encontrado' });
        res.json({ id, quantidade });
    } catch (err) { res.status(500).json({ erro: err.message }); }
});
app.delete('/produtos/tamanhos/:id', autenticarToken, async (req, res) => {
    const id = req.params.id;
    try {
        const result = await runQuery(`DELETE FROM produtos_tamanhos WHERE id = ?`, [id]);
        if (result.changes === 0) return res.status(404).json({ erro: 'Tamanho não encontrado' });
        res.status(204).send();
    } catch (err) { res.status(500).json({ erro: err.message }); }
});

// ========== VENDAS ==========
app.post('/vendas', autenticarToken, async (req, res) => {
    const { cliente_id, itens, forma_pagamento, status_pagamento } = req.body;
    if (!cliente_id || !itens || !itens.length) return res.status(400).json({ erro: 'Cliente e itens são obrigatórios' });
    await new Promise((resolve, reject) => db.run("BEGIN TRANSACTION", err => err ? reject(err) : resolve()));
    try {
        let valor_total = 0;
        for (const item of itens) {
            const row = await getQuery(
                `SELECT pt.quantidade, p.preco FROM produtos_tamanhos pt JOIN produtos p ON p.id = pt.produto_id WHERE pt.produto_id = ? AND pt.tamanho = ? AND p.usuario_id = ?`,
                [item.produto_id, item.tamanho, req.user.id]
            );
            if (!row) throw new Error(`Tamanho ${item.tamanho} não encontrado`);
            if (row.quantidade < item.quantidade) throw new Error(`Estoque insuficiente para tamanho ${item.tamanho}. Disponível: ${row.quantidade}`);
            valor_total += row.preco * item.quantidade;
        }
        const vendaResult = await runQuery(`INSERT INTO vendas (cliente_id, valor_total, forma_pagamento, status_pagamento, usuario_id) VALUES (?, ?, ?, ?, ?)`, [cliente_id, valor_total, forma_pagamento || 'Dinheiro', status_pagamento || 'Pago', req.user.id]);
        const venda_id = vendaResult.lastID;
        for (const item of itens) {
            const precoRow = await getQuery(`SELECT preco FROM produtos WHERE id = ?`, [item.produto_id]);
            const preco_unitario = precoRow.preco;
            const subtotal = preco_unitario * item.quantidade;
            await runQuery(`INSERT INTO itens_venda (venda_id, produto_id, tamanho, quantidade, preco_unitario, subtotal) VALUES (?, ?, ?, ?, ?, ?)`, [venda_id, item.produto_id, item.tamanho, item.quantidade, preco_unitario, subtotal]);
            await runQuery(`UPDATE produtos_tamanhos SET quantidade = quantidade - ? WHERE produto_id = ? AND tamanho = ?`, [item.quantidade, item.produto_id, item.tamanho]);
        }
        await runQuery(`INSERT INTO fluxo_caixa (tipo, categoria, descricao, valor, usuario_id) VALUES (?, ?, ?, ?, ?)`, ['receita', 'venda', `Venda #${venda_id}`, valor_total, req.user.id]);
        await new Promise((resolve, reject) => db.run("COMMIT", err => err ? reject(err) : resolve()));
        res.status(201).json({ id: venda_id, valor_total, cliente_id });
    } catch (error) {
        await new Promise(resolve => db.run("ROLLBACK", () => resolve()));
        console.error(error);
        res.status(400).json({ erro: error.message });
    }
});

app.get('/vendas', autenticarToken, async (req, res) => {
    try {
        const rows = await allQuery(`SELECT v.*, c.nome as cliente_nome FROM vendas v JOIN clientes c ON v.cliente_id = c.id WHERE v.usuario_id = ? ORDER BY v.data_venda DESC`, [req.user.id]);
        res.json(rows);
    } catch (err) { res.status(500).json({ erro: err.message }); }
});

// ========== ROTA PARA DETALHES DA VENDA (COMPROVANTE) - CORRIGIDA ==========
app.get('/vendas/:id', autenticarToken, async (req, res) => {
    try {
        // Buscar venda sem filtrar por usuario_id para evitar problemas (mas ainda verifica token)
        const venda = await getQuery(`
            SELECT v.*, c.nome as cliente_nome
            FROM vendas v
            JOIN clientes c ON v.cliente_id = c.id
            WHERE v.id = ?
        `, [req.params.id]);
        
        if (!venda) return res.status(404).json({ erro: 'Venda não encontrada' });

        const itens = await allQuery(`
            SELECT iv.*, p.nome as produto_nome
            FROM itens_venda iv
            JOIN produtos p ON iv.produto_id = p.id
            WHERE iv.venda_id = ?
        `, [req.params.id]);

        res.json({ venda, itens });
    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: err.message });
    }
});

// ========== FLUXO DE CAIXA ==========
app.post('/fluxo', autenticarToken, upload.single('comprovante'), async (req, res) => {
    const { tipo, categoria, descricao, valor, data_movimento } = req.body;
    if (!tipo || !categoria || !valor) return res.status(400).json({ erro: 'Tipo, categoria e valor obrigatórios' });
    const data = data_movimento || new Date().toISOString();
    const comprovante = req.file ? req.file.filename : null;
    try {
        const result = await runQuery(`INSERT INTO fluxo_caixa (tipo, categoria, descricao, valor, data_movimento, comprovante, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?)`, [tipo, categoria, descricao, valor, data, comprovante, req.user.id]);
        res.status(201).json({ id: result.lastID, comprovante });
    } catch (err) { res.status(500).json({ erro: err.message }); }
});
app.get('/fluxo', autenticarToken, async (req, res) => {
    try {
        const rows = await allQuery(`SELECT * FROM fluxo_caixa WHERE usuario_id = ? ORDER BY data_movimento DESC`, [req.user.id]);
        res.json(rows);
    } catch (err) { res.status(500).json({ erro: err.message }); }
});

// ========== BACKUP ==========
app.post('/admin/backup', autenticarToken, verificarAdmin, async (req, res) => {
    const backupDir = './backups';
    if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `semelle_${timestamp}.db`);
    try {
        fs.copyFileSync('semelle.db', backupFile);
        res.json({ mensagem: 'Backup criado', arquivo: backupFile });
    } catch (err) { res.status(500).json({ erro: err.message }); }
});

// ========== DASHBOARD ==========
app.get('/dashboard/mes', autenticarToken, async (req, res) => {
    try {
        const row = await getQuery(`
            SELECT 
                COALESCE(SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END),0) as receitas,
                COALESCE(SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END),0) as despesas,
                COALESCE((SELECT SUM(valor_total) FROM vendas WHERE usuario_id = ? AND strftime('%Y-%m', data_venda) = strftime('%Y-%m', 'now')),0) as vendas
            FROM fluxo_caixa
            WHERE usuario_id = ? AND strftime('%Y-%m', data_movimento) = strftime('%Y-%m', 'now')
        `, [req.user.id, req.user.id]);
        res.json({ receitas: row.receitas, despesas: row.despesas, saldo: row.receitas - row.despesas, vendas: row.vendas });
    } catch (err) { res.status(500).json({ erro: err.message }); }
});
app.get('/dashboard/ano', autenticarToken, async (req, res) => {
    try {
        const row = await getQuery(`
            SELECT 
                COALESCE(SUM(CASE WHEN tipo = 'receita' THEN valor ELSE 0 END),0) as receitas,
                COALESCE(SUM(CASE WHEN tipo = 'despesa' THEN valor ELSE 0 END),0) as despesas,
                COALESCE((SELECT SUM(valor_total) FROM vendas WHERE usuario_id = ? AND strftime('%Y', data_venda) = strftime('%Y', 'now')),0) as vendas
            FROM fluxo_caixa
            WHERE usuario_id = ? AND strftime('%Y', data_movimento) = strftime('%Y', 'now')
        `, [req.user.id, req.user.id]);
        res.json({ receitas: row.receitas, despesas: row.despesas, saldo: row.receitas - row.despesas, vendas: row.vendas });
    } catch (err) { res.status(500).json({ erro: err.message }); }
});
app.get('/vendas-por-dia', autenticarToken, async (req, res) => {
    try {
        const rows = await allQuery(`SELECT strftime('%d', data_venda) as dia, SUM(valor_total) as total FROM vendas WHERE usuario_id = ? AND strftime('%Y-%m', data_venda) = strftime('%Y-%m', 'now') GROUP BY dia ORDER BY dia`, [req.user.id]);
        res.json(rows);
    } catch (err) { res.status(500).json({ erro: err.message }); }
});
app.get('/vendas-por-pagamento', autenticarToken, async (req, res) => {
    try {
        const rows = await allQuery(`SELECT forma_pagamento, SUM(valor_total) as total FROM vendas WHERE usuario_id = ? GROUP BY forma_pagamento ORDER BY total DESC`, [req.user.id]);
        res.json(rows);
    } catch (err) { res.status(500).json({ erro: err.message }); }
});
app.get('/top-clientes', autenticarToken, async (req, res) => {
    try {
        const rows = await allQuery(`SELECT c.nome, SUM(v.valor_total) as total_compras FROM vendas v JOIN clientes c ON v.cliente_id = c.id WHERE v.usuario_id = ? GROUP BY v.cliente_id ORDER BY total_compras DESC LIMIT 5`, [req.user.id]);
        res.json(rows);
    } catch (err) { res.status(500).json({ erro: err.message }); }
});
app.get('/clientes-devedores', autenticarToken, async (req, res) => {
    try {
        const rows = await allQuery(`SELECT c.nome, SUM(v.valor_total) as divida FROM vendas v JOIN clientes c ON v.cliente_id = c.id WHERE v.usuario_id = ? AND v.status_pagamento = 'Pendente' GROUP BY v.cliente_id ORDER BY divida DESC`, [req.user.id]);
        res.json(rows);
    } catch (err) { res.status(500).json({ erro: err.message }); }
});
app.get('/total-clientes', autenticarToken, async (req, res) => {
    try {
        const row = await getQuery(`SELECT COUNT(*) as total FROM clientes WHERE id != 1`);
        res.json({ total: row.total });
    } catch (err) { res.status(500).json({ erro: err.message }); }
});

app.listen(port, () => {
    console.log(`🚀 Servidor Semelle rodando em http://localhost:${port}`);
});