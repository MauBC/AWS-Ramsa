function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activePage,
  setActivePage,
  logout,
  userData,
}) {
  const isAdmin = Boolean(userData?.is_admin);

  const menu = [
    { key: "perfil", label: "Perfil y Guia", icon: "👤" },
    { key: "recomendador", label: "Recomendador", icon: "✨" },
    { key: "catalogo", label: "Catalogo", icon: "📦" },
    { key: "mis", label: "Mis Solicitudes", icon: "📄" },
    { key: "nueva", label: "Nueva Solicitud", icon: "➕" },
    { key: "faqprivado", label: "FAQ", icon: "❓" },

    ...(isAdmin
      ? [
          { key: "maestros", label: "Maestros", icon: "🧠" },
          { key: "countries_admin", label: "Paises", icon: "🌎" },
          { key: "benefits_admin", label: "Beneficios", icon: "🎯" },
          { key: "catalog_admin", label: "Catalogo Admin", icon: "🗂️" },
        ]
      : []),
  ];

  return (
    <aside className={sidebarOpen ? "sidebar open" : "sidebar"}>
      <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>

      <div className="logo-box">
        <span className="icon-box">🟢</span>
        {sidebarOpen && <span className="logo-text">LOGO</span>}
      </div>

      <div className="menu-list">
        {menu.map((item) => (
          <button
            key={item.key}
            className={activePage === item.key ? "menu-item active" : "menu-item"}
            onClick={() => setActivePage(item.key)}
          >
            <span className="menu-icon">{item.icon}</span>
            {sidebarOpen && <span className="menu-label">{item.label}</span>}
          </button>
        ))}
      </div>

      <button className="menu-item logout-btn" onClick={logout}>
        <span className="menu-icon">🚪</span>
        {sidebarOpen && <span className="menu-label">Salir</span>}
      </button>
    </aside>
  );
}

export default Sidebar;