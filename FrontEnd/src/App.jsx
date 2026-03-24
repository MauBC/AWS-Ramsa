import { useState } from "react";
import "./App.css";

import PublicNavbar from "./components/PublicNavbar";
import AuthPanel from "./components/AuthPanel";
import Sidebar from "./components/Sidebar";

import ProfilePage from "./components/ProfilePage";
import RecomendadorPage from "./components/RecomendadorPage";
import CatalogoPage from "./components/CatalogoPage";
import MisSolicitudesPage from "./components/MisSolicitudesPage";
import NuevaSolicitudPage from "./components/NuevaSolicitudPage";
import FAQPage from "./components/FAQPage";
import MaestrosPage from "./components/MaestrosPage";

function App() {

  const [panelType, setPanelType] = useState(null);
  const [isLogged, setIsLogged] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState("perfil");
  const [userData, setUserData] = useState(null);

  const closePanel = () => setPanelType(null);

  const logout = () => {
    setIsLogged(false);
    setSidebarOpen(false);
    setActivePage("perfil");
    setUserData(null);
  };

  const renderPage = () => {
    switch (activePage) {
      case "perfil":
        return <ProfilePage userData={userData} />;
      case "recomendador":
        return <RecomendadorPage />;
      case "catalogo":
        return <CatalogoPage />;
      case "mis":
        return <MisSolicitudesPage />;
      case "nueva":
        return <NuevaSolicitudPage />;
      case "faqprivado":
        return <FAQPage />;
      case "maestros":
        return <MaestrosPage />;
      default:
        return null;
    }
  };

  if (isLogged) {
    return (
      <div className="private-layout">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activePage={activePage}
          setActivePage={setActivePage}
          logout={logout}
          userData={userData}
        />

        <main className="private-content">
          {renderPage()}
        </main>
      </div>
    );
  }

  return (
    <div>
      <PublicNavbar setPanelType={setPanelType} />

      {panelType && (
        <AuthPanel
          panelType={panelType}
          closePanel={closePanel}
          setIsLogged={setIsLogged}
          setUserData={setUserData}
        />
      )}
    </div>
  );
}

export default App;