function PublicNavbar({ setPanelType }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header className="navbar">
        <div className="left">
          <div className="logo">LOGO</div>

          <nav className="public-nav">
            <button onClick={() => scrollTo("objetivos")}>Objetivos</button>
            <button onClick={() => scrollTo("servicios")}>Servicios</button>
            <button onClick={() => scrollTo("catalogo-publico")}>Catalogo</button>
            <button onClick={() => scrollTo("faq-publico")}>FAQ</button>
          </nav>
        </div>

        <div className="right">
          <button className="btn-outline" onClick={() => setPanelType("login")}>
            Ingresar
          </button>
          <button className="btn-primary" onClick={() => setPanelType("register")}>
            Registrarse
          </button>
        </div>
      </header>

      <section className="hero">
        <h1>Marcela AWS Platform</h1>
        <p>Gestion moderna de solicitudes y proyectos</p>
      </section>

      <section id="objetivos" className="section">Objetivos</section>
      <section id="servicios" className="section alt">Servicios</section>
      <section id="catalogo-publico" className="section">Catalogo</section>
      <section id="faq-publico" className="section alt">FAQ</section>
    </>
  );
}

export default PublicNavbar;