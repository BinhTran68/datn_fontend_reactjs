// ModalAddProduct.jsx
import React, { useState, useLayoutEffect } from "react";
import { Modal, Button, Form, Input, Radio } from "antd";
import clsx from "clsx";
import styles from "./Product.module.css";

const ModalAddProduct = ({
  open,
  onCreate,
  onCancel,
  loading,
}) => {
  const [request, setRequest] = useState({
    productName: "",
    status: "HOAT_DONG",
  });

  const [isActive, setIsActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRequest = (e) => {
    const { name, value } = e.target;
    setRequest((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useLayoutEffect(() => {
    if (!/^[\p{L}\p{N}\s]{1,20}$/u.test(request.productName)) {
      setErrorMessage(
        "Tên sản phẩm là chữ, số tối đa 20 ký tự, và không chứa ký tự đặc biệt"
      );
      setIsActive(false);
    } else if (request.productName.trim() === "") {
      setErrorMessage("Không được để trống");
      setIsActive(false);
    } else {
      setErrorMessage("Hợp lệ !!!");
      setIsActive(true);
    }
  }, [request.productName]);

  const handleSubmit =async () => {
   await onCreate(request);
    setRequest({ productName: "", status: "HOAT_DONG" });
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
          onClick={handleSubmit}
          disabled={!isActive}
        >
          Xác nhận
        </Button>,
      ]}
    >
      <p>Nhập thông tin sản phẩm mới...</p>
      <Form>
        <Input
          placeholder="Nhập tên sản phẩm vào đây!"
          style={{ marginBottom: "0.3rem" }}
          value={request.productName}
          name="productName"
          onChange={handleRequest}
          allowClear
        />
        <div style={{ color: isActive ? "green" : "red" }}>{errorMessage}</div>
      </Form>
    </Modal>
  );
};

export default ModalAddProduct;