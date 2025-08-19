import React, { useState, useEffect } from "react";
import { ConfigProvider } from "antd";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MalwareSearch from "./pages/MalwareSearch";
import MalwareManagement from "./pages/MalwareManagement";
import Settings from "./pages/Settings";
import MainLayout from "./components/MainLayout";
import LoadingScreen from "./components/LoadingScreen";
import { authAPI } from "./services/api";
import CollectionUnitManagement from "./pages/CollectionUnit";
// import "./App.css";

interface User {
  _id: string;
  username: string;
  fullName: string;
  department?: string;
  role?: string;
  isActive: boolean;
}

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra token trong localStorage khi app khởi tạo
    const token = localStorage.getItem("access_token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ConfigProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Navigate to="/dashboard" replace />
              )
            }
          />

          {/* Protected routes với MainLayout */}
          <Route
            path="/*"
            element={
              isAuthenticated ? (
                <MainLayout user={user} onLogout={handleLogout}>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/search" element={<MalwareSearch />} />
                    <Route
                      path="/management/malware"
                      element={<MalwareManagement />}
                    />
                    <Route
                      path="/management/collection-unit"
                      element={<CollectionUnitManagement />}
                    />
                    <Route path="/settings" element={<Settings />} />
                    <Route
                      path="*"
                      element={<Navigate to="/dashboard" replace />}
                    />
                  </Routes>
                </MainLayout>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </Router>
    </ConfigProvider>
  );
};

export default App;
