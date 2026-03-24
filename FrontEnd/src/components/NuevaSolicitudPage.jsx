import { useState } from "react";

function NuevaSolicitudPage() {

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    codigo: "AUTO-GENERADO",
    pais: "PERU",
    nombre_proy: "",
    nombre_proy_abs: "",
    tipo_solicitud: "",
    presupuesto: "",
    area: "",

    nombre_persona: "",
    correo: "",
    key_user: "",
    dueno_proceso: false,

    tipo_beneficio: "",
    valor_beneficio: "",
    tipo_valor: "",
    sustento: "",

    tipo_paso: "",
    numero_paso: "",
    descripcion_paso: "",
    documento: null
  });

  const update = (k, v) => setForm({ ...form, [k]: v });

  const handlePresupuesto = (value) => {
    if (/^\d*\.?\d*$/.test(value)) {
      update("presupuesto", value);
    }
  };

  const Stepper = () => (
    <div style={{
      display: "flex",
      justifyContent: "center",
      gap: 30,
      marginBottom: 30
    }}>
      {["Detalles", "Personas", "Beneficios", "Descripcion"].map((s, i) => (
        <div
          key={i}
          style={{
            padding: "10px 18px",
            borderRadius: 8,
            background: step >= i + 1 ? "#1f8f5f" : "#e0e0e0",
            color: step >= i + 1 ? "white" : "#777",
            fontWeight: "bold"
          }}
        >
          Paso {i + 1}
        </div>
      ))}
    </div>
  );

  const Field = ({ label, children }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontWeight: "bold", color: "#1f8f5f" }}>{label}</label>
      {children}
    </div>
  );

  const optionsTipoSolicitud = ["Opcion 1", "Opcion 2", "Opcion 3"];
  const optionsArea = ["Area 1", "Area 2", "Area 3"];
  const optionsTipoValor = ["Valor 1", "Valor 2", "Valor 3"];
  const optionsTipoBeneficio = ["Beneficio 1", "Beneficio 2", "Beneficio 3"];

  return (
    <div className="card">

      <Stepper />

      {step === 1 && (
        <div className="grid">
          <Field label="codigo">
            <input value={form.codigo} disabled />
          </Field>

          <Field label="pais">
            <input value={form.pais} disabled />
          </Field>

          <Field label="nombre_proy">
            <input onChange={e => update("nombre_proy", e.target.value)} />
          </Field>

          <Field label="nombre_proy_abs">
            <input onChange={e => update("nombre_proy_abs", e.target.value)} />
          </Field>

          <Field label="tipo_solicitud">
            <select onChange={e => update("tipo_solicitud", e.target.value)}>
              <option value="">Seleccionar</option>
              {optionsTipoSolicitud.map(o => <option key={o}>{o}</option>)}
            </select>
          </Field>

          <Field label="presupuesto">
            <input
              value={form.presupuesto}
              onChange={e => handlePresupuesto(e.target.value)}
            />
          </Field>

          <Field label="area">
            <select onChange={e => update("area", e.target.value)}>
              <option value="">Seleccionar</option>
              {optionsArea.map(o => <option key={o}>{o}</option>)}
            </select>
          </Field>
        </div>
      )}

      {step === 2 && (
        <div className="grid">
          <Field label="nombre_persona">
            <input onChange={e => update("nombre_persona", e.target.value)} />
          </Field>

          <Field label="correo">
            <input onChange={e => update("correo", e.target.value)} />
          </Field>

          <Field label="key_user">
            <input onChange={e => update("key_user", e.target.value)} />
          </Field>

          <Field label="Dueño Proceso">
            <button
              className="green-btn"
              onClick={() => update("dueno_proceso", !form.dueno_proceso)}
            >
              {form.dueno_proceso ? "ON" : "OFF"}
            </button>
          </Field>
        </div>
      )}

      {step === 3 && (
        <div className="grid">
          <Field label="tipo_beneficio">
            <select onChange={e => update("tipo_beneficio", e.target.value)}>
              <option value="">Seleccionar</option>
              {optionsTipoBeneficio.map(o => <option key={o}>{o}</option>)}
            </select>
          </Field>

          <Field label="valor_beneficio">
            <input onChange={e => update("valor_beneficio", e.target.value)} />
          </Field>

          <Field label="tipo_valor">
            <select onChange={e => update("tipo_valor", e.target.value)}>
              <option value="">Seleccionar</option>
              {optionsTipoValor.map(o => <option key={o}>{o}</option>)}
            </select>
          </Field>

          <Field label="sustento">
            <textarea onChange={e => update("sustento", e.target.value)} />
          </Field>
        </div>
      )}

      {step === 4 && (
        <div className="grid">
          <Field label="tipo_paso">
            <input onChange={e => update("tipo_paso", e.target.value)} />
          </Field>

          <Field label="numero_paso">
            <input onChange={e => update("numero_paso", e.target.value)} />
          </Field>

          <Field label="descripcion_paso">
            <textarea onChange={e => update("descripcion_paso", e.target.value)} />
          </Field>

          <Field label="documento">
            <input type="file"
              onChange={e => update("documento", e.target.files[0])} />
          </Field>
        </div>
      )}

      <div style={{ marginTop: 30 }}>
        {step < 4 ? (
          <button
            className="green-btn"
            style={{ width: "100%" }}
            onClick={() => setStep(step + 1)}
          >
            Siguiente Paso
          </button>
        ) : (
          <button
            className="green-btn"
            style={{ width: "100%" }}
            onClick={() => console.log(form)}
          >
            Registrar Solicitud
          </button>
        )}
      </div>

    </div>
  );
}

export default NuevaSolicitudPage;