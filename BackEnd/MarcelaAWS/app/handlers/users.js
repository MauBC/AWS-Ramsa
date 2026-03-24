const { searchUsers } = require("../services/userService");
const { jsonResponse } = require("../utils/response");

async function search(event, context) {
  const params = event.queryStringParameters || {};
  const query = params.q || "";

  try {
    const items = await searchUsers(query);

    return jsonResponse(200, {
      message: "Usuarios encontrados correctamente",
      count: items.length,
      items,
    });
  } catch (error) {
    return jsonResponse(500, {
      message: "Error buscando usuarios",
      error: error.message,
    });
  }
}

module.exports = {
  search,
};