import React from "react";
import { Modal, Form, Input, Button, Space } from "antd";
import type { FormInstance } from "antd/es/form";

export interface UpdateCollectionUnitFormValues {
  name: string;
  description?: string;
}

interface UpdateCollectionUnitModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: UpdateCollectionUnitFormValues) => Promise<void>;
  form: FormInstance<UpdateCollectionUnitFormValues>;
}

const UpdateCollectionUnitModal: React.FC<UpdateCollectionUnitModalProps> = ({
  visible,
  onCancel,
  onSubmit,
  form,
}) => {
  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="Chỉnh sửa đơn vị thu thập"
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={500}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          name="name"
          label="Tên đơn vị"
          rules={[
            { required: true, message: "Vui lòng nhập tên đơn vị!" },
            { max: 100, message: "Tên đơn vị không được quá 100 ký tự!" },
          ]}
        >
          <Input placeholder="Nhập tên đơn vị thu thập" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả"
          rules={[{ max: 500, message: "Mô tả không được quá 500 ký tự!" }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="Mô tả về đơn vị thu thập (tùy chọn)"
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
            <Button onClick={handleCancel}>Hủy</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateCollectionUnitModal;
