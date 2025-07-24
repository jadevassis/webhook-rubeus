require('dotenv').config();
const { buscarContatoPorId } = require('./services/rubeusService');

app.post('/webhook-rubeus', async (req, res) => {
  const payload = req.body;

  try {
    let logData = payload;

    // Se só veio idPessoa, buscamos o resto dos dados
    if (payload.idPessoa && !payload.nome) {
      const contato = await buscarContatoPorId(payload.idPessoa);
      logData = { ...payload, ...contato };
    }

    const logPath = path.join(__dirname, 'logs', 'webhook.log.jsonl');
    const logString = JSON.stringify(logData) + '\n';
    fs.appendFileSync(logPath, logString);

    res.send('Webhook recebido com sucesso');
  } catch (err) {
    console.error('Erro ao processar webhook:', err.message);
    res.status(500).send('Erro interno');
  }
});
