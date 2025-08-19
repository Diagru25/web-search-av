import React, { useState } from "react";
import { Layout, Menu, Avatar, Dropdown, message } from "antd";
import {
  SearchOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  DashboardOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../services/api";
import { config } from "../config";

const { Header, Sider, Content } = Layout;

interface User {
  _id: string;
  username: string;
  fullName: string;
  department?: string;
  role?: string;
  isActive: boolean;
}

interface MainLayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  user,
  onLogout,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authAPI.logout();
    onLogout();
    message.success("Đăng xuất thành công!");
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: user?.fullName || user?.username || "User",
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: handleLogout,
    },
  ];

  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: "Dashboard",
    },
    {
      key: "/search",
      icon: <SearchOutlined />,
      label: "Tìm kiếm mã độc",
    },
    {
      key: "/management/malware",
      icon: <DatabaseOutlined />,
      label: "Quản lý mã độc",
    },
    {
      key: "/management/collection-unit",
      icon: <DatabaseOutlined />,
      label: "Quản lý đơn vị",
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            height: 32,
            margin: 16,
            background: "rgba(255, 255, 255, 0.3)",
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: collapsed ? "12px" : "14px",
          }}
        >
          {collapsed ? "AV" : "AntiVirus"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: "margin-left 0.2s",
        }}
      >
        <Header
          style={{
            padding: 0,
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingRight: 24,
            boxShadow: "0 1px 4px rgba(0,21,41,.08)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {React.createElement(
              collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
              {
                className: "trigger",
                onClick: () => setCollapsed(!collapsed),
                style: {
                  fontSize: "18px",
                  lineHeight: "64px",
                  padding: "0 24px",
                  cursor: "pointer",
                  transition: "color 0.3s",
                },
              }
            )}
            <span style={{ fontSize: "16px", fontWeight: 500 }}>
              {config.APP_NAME}
            </span>
          </div>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                padding: "0 12px",
                borderRadius: "6px",
                transition: "background-color 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f5f5f5";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
              <span style={{ color: "#333" }}>
                {user?.fullName || user?.username}
              </span>
            </div>
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: 0,
            padding: 24,
            background: "#f0f2f5",
            minHeight: "calc(100vh - 64px)",
            overflow: "auto",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
