const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

// Diretório de logs
const LOG_DIR = path.join(__dirname, 'logs');
const LOG_FILE = path.join(LOG_DIR, 'webhook.log.jsonl');

// Garante que a pasta de logs existe
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

app.post('/webhook-rubeus', (req, res) => {
  const data = req.body;

  const logEntry = JSON.stringify({
    recebido_em: new Date().toISOString(),
    payload: data
  });

  fs.appendFile(LOG_FILE, logEntry + '\n', (err) => {
    if (err) {
      console.error('Erro ao gravar log:', err);
      return res.status(500).send('Erro ao registrar webhook');
    }

    console.log('📩 Webhook recebido e registrado');
    res.status(200).send('Webhook recebido com sucesso');
  });
});

app.get('/', (req, res) => {
  res.send('Servidor webhook Rubeus ativo');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
