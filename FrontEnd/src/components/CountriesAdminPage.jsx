import { useEffect, useState } from "react";
import {
  getCountries,
  createCountry,
  deleteCountry,
  getCountryLabels,
  createCountryLabel,
  deleteCountryLabel,
  getCountryBusinesses,
  createCountryBusiness,
  deleteCountryBusiness,
} from "../services/adminApi";

function CountriesAdminPage() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");

  const [labels, setLabels] = useState([]);
  const [selectedLabel, setSelectedLabel] = useState("");

  const [businesses, setBusinesses] = useState([]);

  const [newCountryName, setNewCountryName] = useState("");
  const [newCountryActive, setNewCountryActive] = useState(true);

  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelActive, setNewLabelActive] = useState(true);

  const [newBusinessName, setNewBusinessName] = useState("");
  const [newBusinessActive, setNewBusinessActive] = useState(true);

  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingLabels, setLoadingLabels] = useState(false);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);
  const [error, setError] = useState("");

  async function loadCountries() {
    try {
      setLoadingCountries(true);
      setError("");

      const data = await getCountries();
      const items = data.items || [];
      setCountries(items);

      if (items.length > 0) {
        const exists = items.some((x) => x.pais_id === selectedCountry);
        if (!selectedCountry || !exists) {
          setSelectedCountry(items[0].pais_id);
        }
      } else {
        setSelectedCountry("");
        setLabels([]);
        setSelectedLabel("");
        setBusinesses([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingCountries(false);
    }
  }

  async function loadLabels(paisId) {
    if (!paisId) {
      setLabels([]);
      setSelectedLabel("");
      setBusinesses([]);
      return;
    }

    try {
      setLoadingLabels(true);
      setError("");

      const data = await getCountryLabels(paisId);
      const items = data.items || [];
      setLabels(items);

      if (items.length > 0) {
        const exists = items.some((x) => x.label_id === selectedLabel);
        if (!selectedLabel || !exists) {
          setSelectedLabel(items[0].label_id);
        }
      } else {
        setSelectedLabel("");
        setBusinesses([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingLabels(false);
    }
  }

  async function loadBusinesses(paisId, labelId) {
    if (!paisId || !labelId) {
      setBusinesses([]);
      return;
    }

    try {
      setLoadingBusinesses(true);
      setError("");

      const data = await getCountryBusinesses(paisId, labelId);
      setBusinesses(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingBusinesses(false);
    }
  }

  useEffect(() => {
    loadCountries();
  }, []);

  useEffect(() => {
    loadLabels(selectedCountry);
  }, [selectedCountry]);

  useEffect(() => {
    loadBusinesses(selectedCountry, selectedLabel);
  }, [selectedCountry, selectedLabel]);

  async function handleCreateCountry() {
    if (!newCountryName.trim()) return;

    try {
      setError("");
      await createCountry({
        name: newCountryName,
        active: newCountryActive,
      });
      setNewCountryName("");
      setNewCountryActive(true);
      await loadCountries();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteCountry(paisId) {
    if (!window.confirm(`Eliminar el pais "${paisId}"?`)) return;

    try {
      setError("");
      await deleteCountry(paisId);
      await loadCountries();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreateLabel() {
    if (!selectedCountry || !newLabelName.trim()) return;

    try {
      setError("");
      await createCountryLabel(selectedCountry, {
        name: newLabelName,
        active: newLabelActive,
      });
      setNewLabelName("");
      setNewLabelActive(true);
      await loadLabels(selectedCountry);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteLabel(labelId) {
    if (!selectedCountry) return;
    if (!window.confirm(`Eliminar el label "${labelId}"?`)) return;

    try {
      setError("");
      await deleteCountryLabel(selectedCountry, labelId);
      await loadLabels(selectedCountry);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCreateBusiness() {
    if (!selectedCountry || !selectedLabel || !newBusinessName.trim()) return;

    try {
      setError("");
      await createCountryBusiness(selectedCountry, selectedLabel, {
        name: newBusinessName,
        active: newBusinessActive,
      });
      setNewBusinessName("");
      setNewBusinessActive(true);
      await loadBusinesses(selectedCountry, selectedLabel);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteBusiness(negocioId) {
    if (!selectedCountry || !selectedLabel) return;
    if (!window.confirm(`Eliminar el negocio "${negocioId}"?`)) return;

    try {
      setError("");
      await deleteCountryBusiness(selectedCountry, selectedLabel, negocioId);
      await loadBusinesses(selectedCountry, selectedLabel);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 1300, margin: "auto" }}>
      <h1>Gestion de Paises</h1>
      <p style={{ color: "#666", marginBottom: 20 }}>
        Estructura: Pais → Label → Negocio
      </p>

      {error && (
        <div
          style={{
            marginBottom: 16,
            padding: 12,
            borderRadius: 10,
            background: "#fdecec",
            color: "#a33",
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 20,
          alignItems: "start",
        }}
      >
        <div className="card" style={{ margin: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}>
            <h2>Paises</h2>
          </div>

          <input
            placeholder="Nombre del pais"
            value={newCountryName}
            onChange={(e) => setNewCountryName(e.target.value)}
          />

          <div style={{ marginTop: 12 }}>
            <b>Visible:</b>{" "}
            <button
              className="green-btn"
              onClick={() => setNewCountryActive(!newCountryActive)}
            >
              {newCountryActive ? "ON" : "OFF"}
            </button>
          </div>

          <button
            className="green-btn"
            style={{ marginTop: 14, width: "100%" }}
            onClick={handleCreateCountry}
          >
            Registrar pais
          </button>

          <div style={{ marginTop: 20 }}>
            {loadingCountries ? (
              <p>Cargando...</p>
            ) : countries.length === 0 ? (
              <p>No hay paises.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f5f5f5" }}>
                    <th>Nombre</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {countries.map((item) => (
                    <tr
                      key={item.pais_id}
                      onClick={() => setSelectedCountry(item.pais_id)}
                      style={{
                        cursor: "pointer",
                        background:
                          selectedCountry === item.pais_id ? "#eef6ff" : "transparent",
                      }}
                    >
                      <td>{item.name}</td>
                      <td>{item.active ? "ON" : "OFF"}</td>
                      <td>
                        <button onClick={() => handleDeleteCountry(item.pais_id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="card" style={{ margin: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}>
            <h2>Labels</h2>
          </div>

          <div style={{ marginBottom: 10, color: "#666" }}>
            Pais seleccionado: <b>{selectedCountry || "-"}</b>
          </div>

          <input
            placeholder="Nombre del label"
            value={newLabelName}
            onChange={(e) => setNewLabelName(e.target.value)}
            disabled={!selectedCountry}
          />

          <div style={{ marginTop: 12 }}>
            <b>Visible:</b>{" "}
            <button
              className="green-btn"
              disabled={!selectedCountry}
              onClick={() => setNewLabelActive(!newLabelActive)}
            >
              {newLabelActive ? "ON" : "OFF"}
            </button>
          </div>

          <button
            className="green-btn"
            style={{ marginTop: 14, width: "100%" }}
            onClick={handleCreateLabel}
            disabled={!selectedCountry}
          >
            Registrar label
          </button>

          <div style={{ marginTop: 20 }}>
            {loadingLabels ? (
              <p>Cargando...</p>
            ) : labels.length === 0 ? (
              <p>No hay labels.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f5f5f5" }}>
                    <th>Nombre</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {labels.map((item) => (
                    <tr
                      key={item.label_id}
                      onClick={() => setSelectedLabel(item.label_id)}
                      style={{
                        cursor: "pointer",
                        background:
                          selectedLabel === item.label_id ? "#eef6ff" : "transparent",
                      }}
                    >
                      <td>{item.name}</td>
                      <td>{item.active ? "ON" : "OFF"}</td>
                      <td>
                        <button onClick={() => handleDeleteLabel(item.label_id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="card" style={{ margin: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 15 }}>
            <h2>Negocios</h2>
          </div>

          <div style={{ marginBottom: 10, color: "#666" }}>
            Label seleccionado: <b>{selectedLabel || "-"}</b>
          </div>

          <input
            placeholder="Nombre del negocio"
            value={newBusinessName}
            onChange={(e) => setNewBusinessName(e.target.value)}
            disabled={!selectedCountry || !selectedLabel}
          />

          <div style={{ marginTop: 12 }}>
            <b>Visible:</b>{" "}
            <button
              className="green-btn"
              disabled={!selectedCountry || !selectedLabel}
              onClick={() => setNewBusinessActive(!newBusinessActive)}
            >
              {newBusinessActive ? "ON" : "OFF"}
            </button>
          </div>

          <button
            className="green-btn"
            style={{ marginTop: 14, width: "100%" }}
            onClick={handleCreateBusiness}
            disabled={!selectedCountry || !selectedLabel}
          >
            Registrar negocio
          </button>

          <div style={{ marginTop: 20 }}>
            {loadingBusinesses ? (
              <p>Cargando...</p>
            ) : businesses.length === 0 ? (
              <p>No hay negocios.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f5f5f5" }}>
                    <th>Nombre</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {businesses.map((item) => (
                    <tr key={item.negocio_id}>
                      <td>{item.name}</td>
                      <td>{item.active ? "ON" : "OFF"}</td>
                      <td>
                        <button onClick={() => handleDeleteBusiness(item.negocio_id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CountriesAdminPage;