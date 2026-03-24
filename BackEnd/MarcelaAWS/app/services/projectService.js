const { ScanCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { dynamodb } = require("./dynamoService");
const { AUTOMATION_TABLE } = require("../utils/config");
const crypto = require("crypto");

async function listProjects() {
  const response = await dynamodb.send(
    new ScanCommand({
      TableName: AUTOMATION_TABLE,
    })
  );

  const items = response.Items || [];

  return items.filter((item) => item.entityType === "PROJECT");
}

async function createProject(data) {
  const projectId = crypto.randomUUID();

  const item = {
    PK: `PROJECT#${projectId}`,
    SK: "METADATA",
    entityType: "PROJECT",

    project_id: projectId,
    title: data.title,
    description: data.description || "",
    price: Number(data.price || 0),
    category: data.category || "general",
    created_at: new Date().toISOString(),
  };

  await dynamodb.send(
    new PutCommand({
      TableName: AUTOMATION_TABLE,
      Item: item,
    })
  );

  return item;
}

module.exports = {
  listProjects,
  createProject,
};