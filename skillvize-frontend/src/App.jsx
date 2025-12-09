import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthRestrictedRoute from "./routes/AuthRestrictedRoute";
import Analysis from "./components/Analysis";
import Roadmap from "./components/Roadmap";
import About from "./components/About";

const Layout = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/register"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <div className={!shouldHideNavbar ? "pt-16" : ""}>
        <Routes>
          {/* Restricted: Don't allow logged-in users to visit auth pages */}
          <Route
            path="/login"
            element={
              <AuthRestrictedRoute>
                <Login />
              </AuthRestrictedRoute>
            }
          />

          <Route
            path="/register"
            element={
              <AuthRestrictedRoute>
                <Register />
              </AuthRestrictedRoute>
            }
          />

          {/* Protected Home */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analysis"
            element={
              <ProtectedRoute>
                <Analysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roadmap"
            element={
              <ProtectedRoute>
                <Roadmap />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
};

const App = () => (
  <Router>
    <Layout />
  </Router>
);

export default App;
