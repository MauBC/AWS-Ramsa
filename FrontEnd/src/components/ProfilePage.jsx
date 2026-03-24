function ProfilePage({ userData }) {
  return (
    <div className="card">
      <h1>Mi Perfil</h1>

      <div className="grid">
        <div className="grid-item"><b>Correo</b><br />{userData?.correo}</div>
        <div className="grid-item"><b>Password</b><br />{userData?.password}</div>
        <div className="grid-item"><b>Empresa</b><br />{userData?.empresa}</div>
        <div className="grid-item"><b>Pais</b><br />{userData?.pais}</div>
        <div className="grid-item"><b>Vicepresidencia</b><br />{userData?.vicepresidencia}</div>
        <div className="grid-item"><b>Gerencia</b><br />{userData?.gerencia}</div>
        <div className="grid-item"><b>Jefatura</b><br />{userData?.jefatura}</div>
      </div>
    </div>
  );
}

export default ProfilePage;