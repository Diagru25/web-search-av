import React from "react";
import { Card, Row, Col, Statistic, Typography } from "antd";
import {
  BugOutlined,
  SafetyOutlined,
  EyeOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const Dashboard: React.FC = () => {
  return (
    <div>
      <Title level={2}>Dashboard</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Tổng mã độc"
              value={1234}
              prefix={<BugOutlined />}
              valueStyle={{ color: "#cf1322" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Đã quét"
              value={9876}
              prefix={<SafetyOutlined />}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Lần truy cập"
              value={567}
              prefix={<EyeOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Hoạt động gần đây"
              value={24}
              prefix={<ClockCircleOutlined />}
              suffix="giờ"
              valueStyle={{ color: "#722ed1" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Thống kê theo loại mã độc" size="small">
            <div style={{ padding: 20 }}>
              <p>📊 Biểu đồ thống kê sẽ được hiển thị ở đây</p>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Hoạt động gần đây" size="small">
            <div style={{ padding: 20 }}>
              <p>📋 Danh sách hoạt động gần đây sẽ được hiển thị ở đây</p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
