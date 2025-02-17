import React, { useState } from "react";
import { Modal, Button, Form, Input } from "antd";

const ModalAddProduct = ({ open, onCreate, onCancel, loading }) => {
  const [form] = Form.useForm();
  const [request, setRequest] = useState({
    productName: "",
    status: "HOAT_DONG",
  });

  const handleSubmit = async (values) => {
    console.log(values);

    await onCreate(values);
    form.resetFields(); // Reset the form fields after submission
  };

  return (
    <Modal
      open={open}
      title="Thêm Sản Phẩm"
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()} // Submit the form
        >
          Xác nhận
        </Button>,
      ]}
    >
      <p>Nhập thông tin sản phẩm mới...</p>
      <Form
        form={form}
        onFinish={handleSubmit} // Handle form submission
        layout="vertical"
      >
        <Form.Item
          name="productName"
          label="Tên sản phẩm"
          rules={[
            { required: true, message: "Không được để trống" },
            {
              pattern: /^[\p{L}\p{N}\s]{1,20}$/u,
              message:
                "Tên sản phẩm là chữ, số tối đa 20 ký tự, và không chứa ký tự đặc biệt",
            },
          ]}
        >
          <Input placeholder="Nhập tên sản phẩm vào đây!" allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalAddProduct;
