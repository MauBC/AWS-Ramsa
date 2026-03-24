const { ScanCommand, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { dynamodb } = require("./dynamoService");
const { AUTOMATION_TABLE } = require("../utils/config");
const { generateCodigo } = require("../utils/generators");

async function createRequest(data) {
  const codigo = generateCodigo();

  const item = {
    PK: `REQUEST#${codigo}`,
    SK: "METADATA",
    entityType: "REQUEST",

    request_id: String(codigo),
    codigo,
    pais: "peru",
    nombre_proy: data.nombre_proy || "",
    nombre_proy_abs: data.nombre_proy_abs || "",
    tipo_solicitud: data.tipo_solicitud || "",
    presupuesto: Number(data.presupuesto || 0),
    area: data.area || "",
    nombre_persona: data.nombre_persona || "",
    correo: data.correo || "",
    key_user: data.key_user || "",
    tipo_beneficio: data.tipo_beneficio || "",
    valor_beneficio: data.valor_beneficio || "",
    tipo_valor: data.tipo_valor || "",
    sustento: data.sustento || "",
    numero_paso: data.numero_paso || "",
    descripcion_paso: data.descripcion_paso || "",
    documento: data.documento || "",
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

async function listRequests() {
  const response = await dynamodb.send(
    new ScanCommand({
      TableName: AUTOMATION_TABLE,
    })
  );

  const items = response.Items || [];

  return items.filter((item) => item.entityType === "REQUEST");
}

module.exports = {
  createRequest,
  listRequests,
};