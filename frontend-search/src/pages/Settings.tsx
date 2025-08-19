import React from "react";
import {
  Card,
  Form,
  Input,
  Button,
  Switch,
  Typography,
  Divider,
  Space,
} from "antd";
import {
  UserOutlined,
  SettingOutlined,
  SecurityScanOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

interface SettingsFormData {
  fullName: string;
  email: string;
  department: string;
}

const Settings: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: SettingsFormData) => {
    console.log("Settings saved:", values);
  };

  return (
    <div>
      <Title level={2}>Cài đặt</Title>

      <div style={{ maxWidth: 800 }}>
        <Card
          title={
            <>
              <UserOutlined /> Thông tin cá nhân
            </>
          }
          style={{ marginBottom: 16 }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              fullName: "Admin User",
              email: "admin@example.com",
              department: "IT Security",
            }}
          >
            <Form.Item label="Họ và tên" name="fullName">
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input type="email" />
            </Form.Item>
            <Form.Item label="Phòng ban" name="department">
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Lưu thay đổi
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card
          title={
            <>
              <SettingOutlined /> Cài đặt hệ thống
            </>
          }
          style={{ marginBottom: 16 }}
        >
          <Form layout="vertical">
            <Form.Item label="Thông báo email">
              <Switch defaultChecked />
              <div style={{ color: "#666", fontSize: "12px", marginTop: 4 }}>
                Nhận thông báo qua email khi phát hiện mã độc mới
              </div>
            </Form.Item>

            <Divider />

            <Form.Item label="Tự động quét">
              <Switch />
              <div style={{ color: "#666", fontSize: "12px", marginTop: 4 }}>
                Tự động quét file upload
              </div>
            </Form.Item>

            <Divider />

            <Form.Item label="Ghi log chi tiết">
              <Switch defaultChecked />
              <div style={{ color: "#666", fontSize: "12px", marginTop: 4 }}>
                Ghi lại chi tiết các hoạt động tìm kiếm
              </div>
            </Form.Item>
          </Form>
        </Card>

        <Card
          title={
            <>
              <SecurityScanOutlined /> Bảo mật
            </>
          }
        >
          <Space direction="vertical" style={{ width: "100%" }}>
            <Button type="default">Đổi mật khẩu</Button>
            <Button type="default">Kích hoạt xác thực 2 bước</Button>
            <Button type="default">Xem lịch sử đăng nhập</Button>
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
