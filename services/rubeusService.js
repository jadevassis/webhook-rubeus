const axios = require('axios');

async function buscarContatoPorId(idPessoa) {
  const response = await axios.post(`${process.env.RUBEUS_BASE_URL}/api/Contato`, {
    idPessoa,
    token: process.env.RUBEUS_TOKEN
  });

  return response.data?.data || {};
}

module.exports = {
  buscarContatoPorId
};