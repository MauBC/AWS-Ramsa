import { useEffect, useState } from "react";
import {
  getCatalogItems,
  createCatalogItem,
  deleteCatalogItem,
} from "../services/adminApi";

function CatalogAdminPage() {
  const [items, setItems] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [active, setActive] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadCatalog() {
    try {
      setLoading(true);
      setError("");
      const data = await getCatalogItems();
      setItems(data.items || []);
    } catch (err) {
      setError(err.message || "Error cargando catalogo");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCatalog();
  }, []);

  async function handleCreateCatalogItem() {
    if (!name.trim()) return;

    try {
      setError("");
      await createCatalogItem({
        name,
        description,
        image_url: imageUrl,
        active,
      });

      setName("");
      setDescription("");
      setImageUrl("");
      setActive(true);

      await loadCatalog();
    } catch (err) {
      setError(err.message || "Error creando item de catalogo");
    }
  }

  async function handleDeleteCatalogItem(catalogoId) {
    const ok = window.confirm(`Deseas eliminar el item "${catalogoId}"?`);
    if (!ok) return;

    try {
      setError("");
      await deleteCatalogItem(catalogoId);
      await loadCatalog();
    } catch (err) {
      setError(err.message || "Error eliminando item de catalogo");
    }
  }

  return (
    <div className="card" style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Gestion de Catalogo</h1>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Administra items de catalogo con su imagen
      </p>

      {error && (
        <div
          style={{
            background: "#fdecea",
            color: "#b42318",
            padding: "12px 14px",
            borderRadius: "10px",
            marginBottom: "16px",
            border: "1px solid #f5c2c7",
          }}
        >
          {error}
        </div>
      )}

      <div className="card" style={{ marginBottom: "20px" }}>
        <h2>Nuevo Item</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          <input
            type="text"
            placeholder="Nombre del item"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="URL de imagen"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </div>

        <textarea
          placeholder="Descripcion"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: "100%",
            minHeight: "100px",
            marginTop: "12px",
            padding: "12px",
            borderRadius: "10px",
            border: "1px solid #ddd",
            resize: "vertical",
          }}
        />

        <div style={{ marginTop: "12px" }}>
          <button
            className="green-btn"
            onClick={() => setActive(!active)}
            type="button"
          >
            Estado: {active ? "ON" : "OFF"}
          </button>
        </div>

        <button
          className="green-btn"
          style={{ marginTop: "14px" }}
          onClick={handleCreateCatalogItem}
          type="button"
        >
          Agregar item
        </button>
      </div>

      <div className="card">
        <h2>Lista de Catalogo</h2>

        {loading ? (
          <p>Cargando catalogo...</p>
        ) : items.length === 0 ? (
          <p>No hay items registrados.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f5f5f5" }}>
                <th>ID</th>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.catalogo_id}>
                  <td>{item.catalogo_id}</td>

                  <td style={{ width: "120px" }}>
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        style={{
                          width: "90px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid #ddd",
                        }}
                      />
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>
                    <div style={{ fontWeight: "bold" }}>{item.name}</div>
                    <div style={{ fontSize: "13px", color: "#666" }}>
                      {item.description || "-"}
                    </div>
                  </td>

                  <td>{item.active ? "ON" : "OFF"}</td>

                  <td>
                    <button
                      onClick={() => handleDeleteCatalogItem(item.catalogo_id)}
                      type="button"
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

export default CatalogAdminPage;