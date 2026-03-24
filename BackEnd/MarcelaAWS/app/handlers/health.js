const { jsonResponse } = require("../utils/response");

async function handler(event, context) {
  return jsonResponse(200, {
    status: "ok",
    service: "marcela-aws-backend",
    message: "API funcionando correctamente",
  });
}

module.exports = {
  handler,
};