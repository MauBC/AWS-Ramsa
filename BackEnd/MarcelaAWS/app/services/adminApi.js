const API_BASE =
  "https://coqzip7um2.execute-api.us-east-1.amazonaws.com";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Error en API");
  }

  return res.json();
}

/* =========================
   COUNTRIES
========================= */

export const getCountries = () =>
  request("/countries");

export const createCountry = (body) =>
  request("/countries", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const deleteCountry = (id) =>
  request(`/countries/${id}`, {
    method: "DELETE",
  });

export const getCountryLabels = (id) =>
  request(`/countries/${id}/labels`);

export const createCountryLabel = (id, body) =>
  request(`/countries/${id}/labels`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const deleteCountryLabel = (id, labelId) =>
  request(`/countries/${id}/labels/${labelId}`, {
    method: "DELETE",
  });

export const getLabelBusinesses = (paisId, labelId) =>
  request(`/countries/${paisId}/labels/${labelId}/businesses`);

export const createLabelBusiness = (paisId, labelId, body) =>
  request(`/countries/${paisId}/labels/${labelId}/businesses`, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const deleteLabelBusiness = (paisId, labelId, negocioId) =>
  request(
    `/countries/${paisId}/labels/${labelId}/businesses/${negocioId}`,
    {
      method: "DELETE",
    }
  );

/* =========================
   BENEFITS
========================= */

export const getBenefits = () =>
  request("/benefits");

export const createBenefit = (body) =>
  request("/benefits", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const deleteBenefit = (id) =>
  request(`/benefits/${id}`, {
    method: "DELETE",
  });

/* =========================
   CATALOG
========================= */

export const getCatalogItems = () =>
  request("/catalog");

export const createCatalogItem = (body) =>
  request("/catalog", {
    method: "POST",
    body: JSON.stringify(body),
  });

export const deleteCatalogItem = (id) =>
  request(`/catalog/${id}`, {
    method: "DELETE",
  });