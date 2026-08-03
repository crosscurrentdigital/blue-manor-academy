import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { PwaInstallProvider } from "./context/PwaInstallContext";
import { AppModeProvider } from "./context/AppModeContext";
import { ParentOnlyRoute } from "./components/ParentOnlyRoute";
import { Home } from "./pages/Home";
import { Schedule } from "./pages/Schedule";
import { Library } from "./pages/Library";
import { KidsTeachKids } from "./pages/KidsTeachKids";
import { Family } from "./pages/Family";
import { About } from "./pages/About";
import { InstallPrompt } from "./components/InstallPrompt";
import { UpdateToast } from "./components/UpdateToast";
import { ScrollToTop } from "./components/ScrollToTop";

function App() {
  return (
    <AppModeProvider>
      <PwaInstallProvider>
        <ScrollToTop />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/library" element={<Library />} />
            <Route path="/kids-teach-kids" element={<KidsTeachKids />} />
            <Route
              path="/family"
              element={
                <ParentOnlyRoute>
                  <Family />
                </ParentOnlyRoute>
              }
            />
            <Route
              path="/about"
              element={
                <ParentOnlyRoute>
                  <About />
                </ParentOnlyRoute>
              }
            />
          </Routes>
        </Layout>
        <InstallPrompt />
        <UpdateToast />
      </PwaInstallProvider>
    </AppModeProvider>
  );
}

export default App;
