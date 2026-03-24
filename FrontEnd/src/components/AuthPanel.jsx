import { useState } from "react";

function AuthPanel({ panelType, closePanel, setIsLogged, setUserData }) {

  const [login, setLogin] = useState({
    correo: "",
    password: ""
  });

  const [register, setRegister] = useState({
    correo: "",
    password: "",
    empresa: "",
    pais: "",
    vicepresidencia: "",
    gerencia: "",
    jefatura: "",
    accepted: false
  });

  const [error, setError] = useState("");

  const validPassword = (p) => {
    return p.length >= 8 && /[A-Z]/.test(p) && /\d/.test(p);
  };

  const submitLogin = (e) => {
    e.preventDefault();

    if (!login.correo || !login.password) {
      setError("Completa los campos");
      return;
    }

      setUserData({
      correo: login.correo,
      password: "***",
      empresa: "Empresa Demo",
      pais: "Peru",
      vicepresidencia: "VP Demo",
      gerencia: "Gerencia Demo",
      jefatura: "Jefatura Demo",
      user_type: "cliente",
      is_admin: true
    });

    setIsLogged(true);
    closePanel();
  };

  const submitRegister = (e) => {
    e.preventDefault();

    const r = register;

    if (!r.correo || !r.password || !r.empresa || !r.pais ||
        !r.vicepresidencia || !r.gerencia || !r.jefatura) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (!validPassword(r.password)) {
      setError("Password invalido");
      return;
    }

    if (!r.accepted) {
      setError("Debes aceptar terminos");
      return;
    }

    setUserData({
      correo: r.correo,
      password: "***",
      empresa: r.empresa,
      pais: r.pais,
      vicepresidencia: r.vicepresidencia,
      gerencia: r.gerencia,
      jefatura: r.jefatura
    });

    setIsLogged(true);
    closePanel();
  };

  return (
    <>
      <div className="overlay" onClick={closePanel}></div>

      <aside className="panel open">
        <div className="panel-header">
          <h2>{panelType === "login" ? "Ingresar" : "Registrarse"}</h2>
          <button className="close-btn" onClick={closePanel}>X</button>
        </div>

        {panelType === "login" && (
          <form className="form" onSubmit={submitLogin}>
            <input placeholder="Correo"
              onChange={(e)=>setLogin({...login, correo:e.target.value})}/>
            <input type="password" placeholder="Password"
              onChange={(e)=>setLogin({...login, password:e.target.value})}/>
            {error && <p className="error">{error}</p>}
            <button className="green-btn full">Ingresar</button>
          </form>
        )}

        {panelType === "register" && (
          <form className="form scroll" onSubmit={submitRegister}>
            <input placeholder="Correo"
              onChange={(e)=>setRegister({...register, correo:e.target.value})}/>
            <input placeholder="Password"
              onChange={(e)=>setRegister({...register, password:e.target.value})}/>
            <input placeholder="Empresa"
              onChange={(e)=>setRegister({...register, empresa:e.target.value})}/>
            <input placeholder="Pais"
              onChange={(e)=>setRegister({...register, pais:e.target.value})}/>
            <input placeholder="Vicepresidencia"
              onChange={(e)=>setRegister({...register, vicepresidencia:e.target.value})}/>
            <input placeholder="Gerencia"
              onChange={(e)=>setRegister({...register, gerencia:e.target.value})}/>
            <input placeholder="Jefatura"
              onChange={(e)=>setRegister({...register, jefatura:e.target.value})}/>

            <label className="check">
              <input type="checkbox"
                onChange={(e)=>setRegister({...register, accepted:e.target.checked})}/>
              Acepto terminos
            </label>

            {error && <p className="error">{error}</p>}
            <button className="green-btn full">Registrarse</button>
          </form>
        )}
      </aside>
    </>
  );
}

export default AuthPanel;