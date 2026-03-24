const { ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { dynamodb } = require("./dynamoService");
const { AUTOMATION_TABLE } = require("../utils/config");

async function searchUsers(query) {
  const q = (query || "").trim().toLowerCase();

  if (!q) {
    return [];
  }

  const response = await dynamodb.send(
    new ScanCommand({
      TableName: AUTOMATION_TABLE,
    })
  );

  const items = response.Items || [];

  const userItems = items.filter((item) => item.entityType === "USER");

  const results = userItems.filter((item) => {
    const fullName = (item.full_name || "").toLowerCase();
    const email = (item.email || "").toLowerCase();

    return fullName.includes(q) || email.includes(q);
  });

  return results.slice(0, 10);
}

module.exports = {
  searchUsers,
};