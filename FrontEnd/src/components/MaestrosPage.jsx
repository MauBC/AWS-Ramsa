import { useState } from "react";

function MaestrosPage() {

  const [masters, setMasters] = useState({
    pais: [
      { name: "Peru", active: true },
      { name: "Chile", active: false }
    ],
    toppings: [
      { name: "Queso", active: true },
      { name: "Tocino", active: true }
    ]
  });

  const [selected, setSelected] = useState("pais");

  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);

  const [newCategory, setNewCategory] = useState("");
  const [newCategoryVisible, setNewCategoryVisible] = useState(true);

  const [newItemName, setNewItemName] = useState("");
  const [newItemVisible, setNewItemVisible] = useState(true);

  const toggleStatus = (index) => {
    const copy = { ...masters };
    copy[selected][index].active = !copy[selected][index].active;
    setMasters(copy);
  };

  const deleteItem = (index) => {
    const copy = { ...masters };
    copy[selected].splice(index, 1);
    setMasters(copy);
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setEditingValue(masters[selected][index].name);
  };

  const saveEdit = () => {
    const copy = { ...masters };
    copy[selected][editingIndex].name = editingValue;
    setMasters(copy);
    setEditingIndex(null);
  };

  const cancelEdit = () => {
    setEditingIndex(null);
  };

  const addItem = () => {
    if (!newItemName) return;
    const copy = { ...masters };
    copy[selected].push({
      name: newItemName,
      active: newItemVisible
    });
    setMasters(copy);
    setShowItemModal(false);
    setNewItemName("");
    setNewItemVisible(true);
  };

  const addCategory = () => {
    if (!newCategory) return;
    setMasters({
      ...masters,
      [newCategory]: []
    });
    setShowCategoryModal(false);
    setNewCategory("");
    setNewCategoryVisible(true);
  };

  return (
    <div className="card" style={{ maxWidth: 900, margin: "auto" }}>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h1>Gestion de Maestros</h1>
        <button className="green-btn" onClick={() => setShowCategoryModal(true)}>
          + Nuevo M1
        </button>
      </div>

      <div style={{
        position: "relative",
        marginBottom: 25,
        width: "30%"
        }}>

            
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 16px",
            borderRadius: 12,
            border: "1px solid #e0e0e0",
            appearance: "none",
            background: "white",
            fontSize: 15
          }}
        >
          {Object.keys(masters).map(cat => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {masters[selected].map((item, i) => (
            <tr key={i}>
              <td>
                {editingIndex === i ? (
                  <input
                    value={editingValue}
                    onChange={e => setEditingValue(e.target.value)}
                  />
                ) : (
                  item.name
                )}
              </td>

              <td>
                <button className="green-btn" onClick={() => toggleStatus(i)}>
                  {item.active ? "ON" : "OFF"}
                </button>
              </td>

              <td>
                {editingIndex === i ? (
                  <>
                    <button onClick={saveEdit}>Guardar</button>
                    <button onClick={cancelEdit}>Cancelar</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(i)}>Editar</button>
                    <button onClick={() => deleteItem(i)}>Eliminar</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ textAlign: "center", marginTop: 20 }}>
        <button className="green-btn" onClick={() => setShowItemModal(true)}>
          +
        </button>
      </div>

      {/* Modal Categoria */}
      {showCategoryModal && (
        <div className="overlay" onClick={() => setShowCategoryModal(false)}>
          <div className="card" style={{ maxWidth: 400, margin: "150px auto" }} onClick={(e) => e.stopPropagation()}>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2>Nueva Categoria</h2>
              <button onClick={() => setShowCategoryModal(false)}>✕</button>
            </div>

            <input
              placeholder="Nombre"
              onChange={e => setNewCategory(e.target.value)}
            />

            <div style={{ marginTop: 15 }}>
              <b>Visible:</b>
              <button className="green-btn" onClick={() => setNewCategoryVisible(!newCategoryVisible)}>
                {newCategoryVisible ? "ON" : "OFF"}
              </button>
            </div>

            <button className="green-btn" style={{ marginTop: 20 }} onClick={addCategory}>
              Registrar
            </button>

          </div>
        </div>
      )}

      {/* Modal Item */}
      {showItemModal && (
        <div className="overlay" onClick={() => setShowItemModal(false)}>
          <div className="card" style={{ maxWidth: 400, margin: "150px auto" }} onClick={(e) => e.stopPropagation()}>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2>Nuevo Item</h2>
              <button onClick={() => setShowItemModal(false)}>✕</button>
            </div>

            <input
              placeholder="Nombre"
              onChange={e => setNewItemName(e.target.value)}
            />

            <div style={{ marginTop: 15 }}>
              <b>Visible:</b>
              <button className="green-btn" onClick={() => setNewItemVisible(!newItemVisible)}>
                {newItemVisible ? "ON" : "OFF"}
              </button>
            </div>

            <button className="green-btn" style={{ marginTop: 20 }} onClick={addItem}>
              Registrar
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default MaestrosPage;