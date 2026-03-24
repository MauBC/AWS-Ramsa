const { jsonResponse } = require("../utils/response");

async function handler(event, context) {
  return jsonResponse(200, {
    message: "Backend serverless funcionando",
    project: "Marcela AWS",
    stage: process.env.STAGE || "dev",
  });
}

module.exports = {
  handler,
};