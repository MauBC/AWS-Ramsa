import { useEffect, useState } from "react";
import {
  getBenefits,
  createBenefit,
  deleteBenefit,
} from "../services/adminApi";

function BenefitsAdminPage() {
  const [items, setItems] = useState([]);
  const [name, setName] = useState("");
  const [defaultValue, setDefaultValue] = useState("");
  const [defaultUnit, setDefaultUnit] = useState("");
  const [active, setActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadBenefits() {
    try {
      setLoading(true);
      setError("");
      const data = await getBenefits();
      setItems(data.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBenefits();
  }, []);

  async function handleCreateBenefit() {
    if (!name.trim()) return;

    try {
      setError("");
      await createBenefit({
        name,
        default_value: defaultValue === "" ? null : Number(defaultValue),
        default_unit: defaultUnit,
        active,
      });

      setName("");
      setDefaultValue("");
      setDefaultUnit("");
      setActive(true);

      await loadBenefits();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteBenefit(beneficioId) {
    if (!window.confirm(`Eliminar el beneficio "${beneficioId}"?`)) return;

    try {
      setError("");
      await deleteBenefit(beneficioId);
      await loadBenefits();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 1100, margin: "auto" }}>
      <h1>Gestion de Beneficios</h1>
      <p style={{ color: "#666", marginBottom: 20 }}>
        Administra beneficios y sus valores por defecto
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

      <div className="card" style={{ marginBottom: 20 }}>
        <h2>Nuevo Beneficio</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr auto",
            gap: 12,
            alignItems: "center",
          }}
        >
          <input
            placeholder="Nombre del beneficio"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Valor por defecto"
            value={defaultValue}
            onChange={(e) => setDefaultValue(e.target.value)}
          />

          <input
            placeholder="Unidad por defecto"
            value={defaultUnit}
            onChange={(e) => setDefaultUnit(e.target.value)}
          />

          <button
            className="green-btn"
            onClick={() => setActive(!active)}
          >
            {active ? "ON" : "OFF"}
          </button>
        </div>

        <button
          className="green-btn"
          style={{ marginTop: 14 }}
          onClick={handleCreateBenefit}
        >
          Registrar beneficio
        </button>
      </div>

      <div className="card">
        <h2>Lista de Beneficios</h2>

        {loading ? (
          <p>Cargando...</p>
        ) : items.length === 0 ? (
          <p>No hay beneficios registrados.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f5f5f5" }}>
                <th>Nombre</th>
                <th>Valor</th>
                <th>Unidad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.beneficio_id}>
                  <td>{item.name}</td>
                  <td>{item.default_value ?? "-"}</td>
                  <td>{item.default_unit || "-"}</td>
                  <td>{item.active ? "ON" : "OFF"}</td>
                  <td>
                    <button
                      onClick={() => handleDeleteBenefit(item.beneficio_id)}
                    >
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
  );
}

export default BenefitsAdminPage;