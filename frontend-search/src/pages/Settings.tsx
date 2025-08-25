import React, { useState, useEffect } from "react";
import { Card, Form, Input, Button, Typography, message, Spin } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { authAPI } from "../services/api";
// import { useNavigate } from "react-router-dom";

const { Title } = Typography;

interface UserInfo {
  _id: string;
  username: string;
  fullName: string;
  department?: string;
  role?: string;
  isActive: boolean;
}

interface ProfileFormData {
  fullName: string;
  department: string;
}

interface PasswordFormData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Settings: React.FC = () => {
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const user = await authAPI.getProfile();
        setUserInfo(user);
        profileForm.setFieldsValue({
          fullName: user.fullName,
          department: user.department || "",
        });
      } catch (error) {
        console.error("Error fetching user profile:", error);
        message.error("Không thể tải thông tin người dùng");
      } finally {
        setDataLoading(false);
      }
    };

    fetchUserProfile();
  }, [profileForm]);

  const onProfileFinish = async (values: ProfileFormData) => {
    setProfileLoading(true);
    try {
      await authAPI.updateProfile(values);
      message.success("Cập nhật thông tin cá nhân thành công");
      // Reload trang sau khi cập nhật thành công
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Cập nhật thông tin thất bại");
    } finally {
      setProfileLoading(false);
    }
  };

  const onPasswordFinish = async (values: PasswordFormData) => {
    setPasswordLoading(true);
    try {
      await authAPI.changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      message.success("Đổi mật khẩu thành công! Đang đăng xuất...");
      passwordForm.resetFields();

      authAPI.logout();
      localStorage.clear();
      window.location.href = "/login";
      window.location.reload();
    } catch (error) {
      console.error("Error changing password:", error);
      message.error("Đổi mật khẩu thất bại. Vui lòng kiểm tra mật khẩu cũ.");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={2} style={{ marginTop: 0 }}>
        Cài đặt
      </Title>

      <div
        style={{
          width: "100%",
          display: "flex",
          gap: "48px",
          justifyContent: "space-between",
          alignItems: "stretch",
        }}
      >
        <Card
          title={
            <>
              <UserOutlined /> Thông tin cá nhân
            </>
          }
          style={{ flex: 1 }}
        >
          <Form form={profileForm} layout="vertical" onFinish={onProfileFinish}>
            <Form.Item label="Tên đăng nhập" style={{ marginBottom: 16 }}>
              <Input value={userInfo?.username} disabled />
            </Form.Item>

            <Form.Item label="Vai trò" style={{ marginBottom: 16 }}>
              <Input value={userInfo?.role} disabled />
            </Form.Item>

            <Form.Item
              label="Họ và tên"
              name="fullName"
              rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Phòng ban" name="department">
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={profileLoading}>
                Lưu thay đổi
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <Card
          title={
            <>
              <LockOutlined /> Đổi mật khẩu
            </>
          }
          style={{ flex: 1 }}
        >
          <Form
            form={passwordForm}
            layout="vertical"
            onFinish={onPasswordFinish}
          >
            <Form.Item
              label="Mật khẩu hiện tại"
              name="oldPassword"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu hiện tại" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Mật khẩu mới"
              name="newPassword"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu mới"
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu mới" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Mật khẩu xác nhận không khớp!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={passwordLoading}
              >
                Đổi mật khẩu
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
