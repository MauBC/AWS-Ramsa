const {
  PutCommand,
  QueryCommand,
  DeleteCommand,
  ScanCommand,
  BatchWriteCommand,
} = require("@aws-sdk/lib-dynamodb");
const { dynamodb } = require("./dynamoService");
const { AUTOMATION_TABLE } = require("../utils/config");

const RESERVED_CATEGORIES = new Set([
  "pais",
  "catalogo",
  "beneficio",
]);

function normalizeId(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function validateNotReservedCategory(categoryId) {
  if (RESERVED_CATEGORIES.has(categoryId)) {
    throw new Error(
      `La categoria '${categoryId}' es una categoria del sistema y no se administra desde maestros`
    );
  }
}

async function createCategory(data) {
  const name = String(data.name || "").trim();
  const categoryId = normalizeId(data.category_id || name);

  if (!name) {
    throw new Error("El nombre de la categoria es obligatorio");
  }

  if (!categoryId) {
    throw new Error("No se pudo generar el category_id");
  }

  validateNotReservedCategory(categoryId);

  const item = {
    PK: "MASTER#KEYWORD",
    SK: `CAT#${categoryId}`,
    entityType: "MASTER_CATEGORY",
    category_id: categoryId,
    name,
    active: data.active !== undefined ? Boolean(data.active) : true,
    created_at: new Date().toISOString(),
  };

  await dynamodb.send(
    new PutCommand({
      TableName: AUTOMATION_TABLE,
      Item: item,
      ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)",
    })
  );

  return item;
}

async function listCategories() {
  const response = await dynamodb.send(
    new QueryCommand({
      TableName: AUTOMATION_TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": "MASTER#KEYWORD",
        ":skPrefix": "CAT#",
      },
    })
  );

  const items = response.Items || [];

  return items.filter(
    (item) => !RESERVED_CATEGORIES.has(normalizeId(item.category_id))
  );
}

async function createItem(categoryId, data) {
  const normalizedCategoryId = normalizeId(categoryId);
  const name = String(data.name || "").trim();
  const itemId = normalizeId(data.item_id || name);

  if (!normalizedCategoryId) {
    throw new Error("El categoryId es obligatorio");
  }

  validateNotReservedCategory(normalizedCategoryId);

  if (!name) {
    throw new Error("El nombre del item es obligatorio");
  }

  if (!itemId) {
    throw new Error("No se pudo generar el item_id");
  }

  const item = {
    PK: "MASTER#KEYWORD",
    SK: `ITEM#${normalizedCategoryId}#${itemId}`,
    entityType: "MASTER_ITEM",
    category_id: normalizedCategoryId,
    item_id: itemId,
    name,
    active: data.active !== undefined ? Boolean(data.active) : true,
    created_at: new Date().toISOString(),
  };

  await dynamodb.send(
    new PutCommand({
      TableName: AUTOMATION_TABLE,
      Item: item,
      ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)",
    })
  );

  return item;
}

async function listItemsByCategory(categoryId) {
  const normalizedCategoryId = normalizeId(categoryId);

  validateNotReservedCategory(normalizedCategoryId);

  const response = await dynamodb.send(
    new QueryCommand({
      TableName: AUTOMATION_TABLE,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": "MASTER#KEYWORD",
        ":skPrefix": `ITEM#${normalizedCategoryId}#`,
      },
    })
  );

  return response.Items || [];
}

async function deleteItem(categoryId, itemId) {
  const normalizedCategoryId = normalizeId(categoryId);
  const normalizedItemId = normalizeId(itemId);

  validateNotReservedCategory(normalizedCategoryId);

  await dynamodb.send(
    new DeleteCommand({
      TableName: AUTOMATION_TABLE,
      Key: {
        PK: "MASTER#KEYWORD",
        SK: `ITEM#${normalizedCategoryId}#${normalizedItemId}`,
      },
    })
  );

  return {
    category_id: normalizedCategoryId,
    item_id: normalizedItemId,
  };
}

async function deleteCategory(categoryId) {
  const normalizedCategoryId = normalizeId(categoryId);

  validateNotReservedCategory(normalizedCategoryId);

  const response = await dynamodb.send(
    new QueryCommand({
      TableName: AUTOMATION_TABLE,
      KeyConditionExpression: "PK = :pk",
      FilterExpression:
        "SK = :categorySk OR begins_with(SK, :itemPrefix)",
      ExpressionAttributeValues: {
        ":pk": "MASTER#KEYWORD",
        ":categorySk": `CAT#${normalizedCategoryId}`,
        ":itemPrefix": `ITEM#${normalizedCategoryId}#`,
      },
    })
  );

  const items = response.Items || [];

  if (items.length === 0) {
    return {
      deleted_count: 0,
      category_id: normalizedCategoryId,
    };
  }

  for (let i = 0; i < items.length; i += 25) {
    const batch = items.slice(i, i + 25);

    await dynamodb.send(
      new BatchWriteCommand({
        RequestItems: {
          [AUTOMATION_TABLE]: batch.map((item) => ({
            DeleteRequest: {
              Key: {
                PK: item.PK,
                SK: item.SK,
              },
            },
          })),
        },
      })
    );
  }

  return {
    deleted_count: items.length,
    category_id: normalizedCategoryId,
  };
}

async function listPkTypes() {
  const response = await dynamodb.send(
    new ScanCommand({
      TableName: AUTOMATION_TABLE,
      ProjectionExpression: "PK",
    })
  );

  const items = response.Items || [];
  const uniquePks = [...new Set(items.map((item) => item.PK))].sort();

  return uniquePks;
}

async function listItemsByPk(pk) {
  const value = String(pk || "").trim();

  if (!value) {
    throw new Error("El parametro pk es obligatorio");
  }

  const response = await dynamodb.send(
    new QueryCommand({
      TableName: AUTOMATION_TABLE,
      KeyConditionExpression: "PK = :pk",
      ExpressionAttributeValues: {
        ":pk": value,
      },
    })
  );

  return response.Items || [];
}

module.exports = {
  createCategory,
  listCategories,
  deleteCategory,
  createItem,
  listItemsByCategory,
  deleteItem,
  listPkTypes,
  listItemsByPk,
};