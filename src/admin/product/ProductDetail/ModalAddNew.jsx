// ModalAddNew.jsx
import React, { memo, useEffect, useState } from "react";
import { Modal, Button, Form, Input } from "antd";

const ModalAddNew = ({ open, onCreate, onCancel, loading, title, req }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    console.log(values);

    await onCreate(values);
    form.resetFields(); // Reset the form fields after submission
  };
  useEffect(() => {
    console.warn("dax chayj vaof ddaya-------------------", title);
  });
  return (
    <Modal
      open={open}
      title={`Thêm ${title}`}
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
      <p>Nhập thông tin {title} mới...</p>
      <Form
        form={form}
        onFinish={handleSubmit} // Handle form submission
        layout="vertical"
      >
        <Form.Item
          name={req}
          label={`Tên ${title}`}
          rules={[
            { required: true, message: "Không được để trống" },
            {
              pattern: /^[\p{L}\p{N}\s]{1,20}$/u,
              message: `Tên ${title} là chữ, số tối đa 20 ký tự, và không chứa ký tự đặc biệt`,
            },
          ]}
        >
          <Input placeholder="Nhập tên mới vào đây!" allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default memo(ModalAddNew);
