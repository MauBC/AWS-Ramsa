const API_BASE_URL = "https://coqzip7um2.execute-api.us-east-1.amazonaws.com";

async function parseJsonSafe(res) {
  const text = await res.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text || "Respuesta invalida del servidor" };
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await parseJsonSafe(response);

  if (!response.ok) {
    throw new Error(data.error || data.message || "Error en la peticion");
  }

  return data;
}

// Countries
export function getCountries() {
  return request("/countries");
}

export function createCountry(payload) {
  return request("/countries", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteCountry(paisId) {
  return request(`/countries/${paisId}`, {
    method: "DELETE",
  });
}

// Labels
export function getCountryLabels(paisId) {
  return request(`/countries/${paisId}/labels`);
}

export function createCountryLabel(paisId, payload) {
  return request(`/countries/${paisId}/labels`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteCountryLabel(paisId, labelId) {
  return request(`/countries/${paisId}/labels/${labelId}`, {
    method: "DELETE",
  });
}

// Businesses inside label
export function getCountryBusinesses(paisId, labelId) {
  return request(`/countries/${paisId}/labels/${labelId}/businesses`);
}

export function createCountryBusiness(paisId, labelId, payload) {
  return request(`/countries/${paisId}/labels/${labelId}/businesses`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteCountryBusiness(paisId, labelId, negocioId) {
  return request(
    `/countries/${paisId}/labels/${labelId}/businesses/${negocioId}`,
    {
      method: "DELETE",
    }
  );
}

// Benefits
export function getBenefits() {
  return request("/benefits");
}

export function createBenefit(payload) {
  return request("/benefits", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteBenefit(beneficioId) {
  return request(`/benefits/${beneficioId}`, {
    method: "DELETE",
  });
}

// Catalog
export function getCatalogItems() {
  return request("/catalog");
}

export function createCatalogItem(payload) {
  return request("/catalog", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteCatalogItem(catalogoId) {
  return request(`/catalog/${catalogoId}`, {
    method: "DELETE",
  });
}