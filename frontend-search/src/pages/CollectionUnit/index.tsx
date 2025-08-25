import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Typography,
  message,
  Popconfirm,
  Input,
  Card,
  Tooltip,
  Form,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { collectionUnitAPI } from "../../services/api";
import type {
  CollectionUnitItem,
  CreateCollectionUnitRequest,
  UpdateCollectionUnitRequest,
} from "../../services/api";
import CreateCollectionUnitModal, {
  type CreateCollectionUnitFormValues,
} from "./CreateCollectionUnitModal";
import UpdateCollectionUnitModal, {
  type UpdateCollectionUnitFormValues,
} from "./UpdateCollectionUnitModal";

const { Title } = Typography;

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

const CollectionUnitManagement: React.FC = () => {
  const [collectionUnitList, setCollectionUnitList] = useState<
    CollectionUnitItem[]
  >([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Modal states
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<CollectionUnitItem | null>(
    null
  );

  // Forms
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Fetch data
  const fetchCollectionUnitList = async () => {
    setLoading(true);
    try {
      const data = await collectionUnitAPI.getAll();
      setCollectionUnitList(data);
      setTotal(data.length);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      message.error(
        apiError.response?.data?.message ||
          "Lỗi khi tải danh sách đơn vị thu thập"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectionUnitList();
  }, []);

  // Handle search and reload
  const handleSearch = () => {
    // Since this is a simple client-side search, we just filter the existing data
    // This maintains the same pattern as MalwareManagement but adapted for collection units
    fetchCollectionUnitList();
  };

  const handleReload = () => {
    setSearchText("");
    fetchCollectionUnitList();
  };

  // Handle pagination change
  const handleTableChange = (page: number, size?: number) => {
    const newPageSize = size || pageSize;
    setCurrentPage(page);
    setPageSize(newPageSize);
  };

  // Create collection unit
  const handleCreate = async (values: CreateCollectionUnitFormValues) => {
    try {
      const createData: CreateCollectionUnitRequest = {
        name: values.name.trim(),
        description: values.description?.trim(),
      };

      await collectionUnitAPI.create(createData);
      message.success("Tạo đơn vị thu thập thành công!");
      setIsCreateModalVisible(false);
      createForm.resetFields();
      fetchCollectionUnitList();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      message.error(
        apiError.response?.data?.message || "Lỗi khi tạo đơn vị thu thập"
      );
    }
  };

  // Update collection unit
  const handleUpdate = async (values: UpdateCollectionUnitFormValues) => {
    if (!editingRecord) return;

    try {
      const updateData: UpdateCollectionUnitRequest = {
        name: values.name.trim(),
        description: values.description?.trim(),
      };

      await collectionUnitAPI.update(editingRecord._id, updateData);
      message.success("Cập nhật đơn vị thu thập thành công!");
      setIsEditModalVisible(false);
      setEditingRecord(null);
      editForm.resetFields();
      fetchCollectionUnitList();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      message.error(
        apiError.response?.data?.message || "Lỗi khi cập nhật đơn vị thu thập"
      );
    }
  };

  // Delete collection unit
  const handleDelete = async (id: string) => {
    try {
      await collectionUnitAPI.delete(id);
      message.success("Xóa đơn vị thu thập thành công!");
      fetchCollectionUnitList();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      message.error(
        apiError.response?.data?.message || "Lỗi khi xóa đơn vị thu thập"
      );
    }
  };

  // Edit modal
  const showEditModal = (record: CollectionUnitItem) => {
    setEditingRecord(record);
    editForm.setFieldsValue({
      name: record.name,
      description: record.description,
    });
    setIsEditModalVisible(true);
  };

  // Table columns
  const columns: ColumnsType<CollectionUnitItem> = [
    {
      title: "Tên đơn vị",
      dataIndex: "name",
      key: "name",
      width: 200,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
      render: (description: string) => description || "-",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 150,
      sorter: (a, b) =>
        new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => showEditModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa đơn vị thu thập này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2} style={{ marginTop: 0 }}>
        Quản lý đơn vị thu thập
      </Title>

      {/* Search and filters */}
      <Card style={{ marginBottom: 16 }}>
        <Space
          direction="horizontal"
          style={{ width: "100%", justifyContent: "space-between" }}
        >
          <Space wrap>
            <Input
              placeholder="Tìm theo tên đơn vị"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 200 }}
              onPressEnter={handleSearch}
            />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
            >
              Tìm kiếm
            </Button>
          </Space>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={handleReload}></Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalVisible(true)}
            >
              Thêm đơn vị thu thập
            </Button>
          </Space>
        </Space>
      </Card>

      {/* Table */}
      <Table
        size="small"
        columns={columns}
        dataSource={collectionUnitList.filter(
          (item) =>
            !searchText ||
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            (item.description &&
              item.description.toLowerCase().includes(searchText.toLowerCase()))
        )}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: currentPage,
          total: total,
          pageSize: pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} đơn vị thu thập`,
          onChange: handleTableChange,
          onShowSizeChange: handleTableChange,
        }}
        scroll={{ x: 800 }}
      />

      <CreateCollectionUnitModal
        visible={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onSubmit={handleCreate}
        form={createForm}
      />

      <UpdateCollectionUnitModal
        visible={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingRecord(null);
        }}
        onSubmit={handleUpdate}
        form={editForm}
      />
    </div>
  );
};

export default CollectionUnitManagement;
