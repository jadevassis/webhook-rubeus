require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const { buscarContatoPorId } = require('./services/rubeusService');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API de Webhook Rubeus rodando');
});

app.post('/webhook-rubeus', async (req, res) => {
  const payload = req.body;

  try {
    let logData = payload;

    // Se só veio idPessoa, buscamos os dados completos da Rubeus
    if (payload.idPessoa && !payload.nome) {
      const contato = await buscarContatoPorId(payload.idPessoa);
      logData = { ...payload, ...contato };
    }

    // Cria pasta logs se não existir
    const logsDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir);
    }

    // Grava o log
    const logPath = path.join(logsDir, 'webhook.log.jsonl');
    const logString = JSON.stringify(logData) + '\n';
    fs.appendFileSync(logPath, logString);

    res.send('Webhook recebido com sucesso');
  } catch (err) {
    console.error('Erro ao processar webhook:', err.message);
    res.status(500).send('Erro interno');
  }
});

// ✅ Rota nova: visualizar os logs
app.get('/logs', (req, res) => {
  try {
    const logPath = path.join(__dirname, 'logs', 'webhook.log.jsonl');
    if (!fs.existsSync(logPath)) {
      return res.status(404).json({ mensagem: 'Nenhum log encontrado.' });
    }

    const data = fs.readFileSync(logPath, 'utf8');
    const linhas = data.trim().split('\n').map(linha => JSON.parse(linha));

    res.json(linhas);
  } catch (err) {
    console.error('Erro ao ler logs:', err.message);
    res.status(500).send('Erro ao ler os logs');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
