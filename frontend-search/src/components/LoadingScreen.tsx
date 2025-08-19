import React from "react";
import { Spin } from "antd";

const LoadingScreen: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <Spin size="large" />
      <div style={{ marginTop: 16, color: "#666" }}>Đang tải...</div>
    </div>
  );
};

export default LoadingScreen;
