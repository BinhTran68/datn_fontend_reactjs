import {
  Modal,
  Row,
  Col,
  Input,
  Switch,
  Select,
  InputNumber,
  Radio,
  Button,
  notification,
} from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { FaEdit } from "react-icons/fa";
import { useEffect, useState } from "react";
const { TextArea } = Input;
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import styles from "./ProductDetail.module.css";
import { updateProduct } from "./ApiProductDetail";

const AddSanPham = ({
  isOpen,
  handleClose,
  title,
  handleSubmit,
  getProductDetail,
  dataType,
  dataBrand,
  dataMaterial,
  dataSole,
  dataProduct,
  dataSize,
  dataColor,
  dataGender,
}) => {
  const [request, setRequest] = useState({
    status: "HOAT_DONG",
  });
  const handleRequest = async (e) => {
    const { name, value } = e.target;
    setRequest((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const validationSchema = Yup.object().shape({
    // tenSanPham: Yup.string()
    //   .min(8, "Tên sản phẩm phải có ít nhất 8 kí tự")
    //   .required("Tên sản phẩm là bắt buộc"),
    brandId: Yup.number().required("Thương hiệu là bắt buộc"),
    typeId: Yup.number().required("Danh mục là bắt buộc"),
    materialId: Yup.number().required("Chất liệu vải là bắt buộc"),
    soleId: Yup.number().required("Chất liệu đế là bắt buộc"),
    description: Yup.string().nullable(), // Cho phép trống
  });
  function getIdByName(dataArray, keyName, targetValue) {
    // Kiểm tra nếu tham số không hợp lệ
    if (!dataArray || !Array.isArray(dataArray) || !keyName || !targetValue) {
      return null; // Trả về null nếu không hợp lệ
    }

    for (let index = 0; index < dataArray.length; index++) {
      if (dataArray[index][keyName] === targetValue) {
        return dataArray[index].id; // Trả về id nếu tìm thấy
      }
    }

    return null; // Trả về null nếu không tìm thấy
  }

  const formik = useFormik({
    initialValues: {
      description: getProductDetail?.description || "",
      price: getProductDetail?.price || "",
      quantity: getProductDetail?.quantity || "",
      weight: getProductDetail?.weight || "",
      status: getProductDetail?.status,
      typeId: getIdByName(dataType, "typeName", getProductDetail?.typeName),
      brandId: getIdByName(dataBrand, "brandName", getProductDetail?.brandName),
      materialId: getIdByName(
        dataMaterial,
        "materialName",
        getProductDetail?.materialName
      ),
      soleId: getIdByName(dataSole, "soleName", getProductDetail?.soleName),
      sizeId: getIdByName(dataSize, "sizeName", getProductDetail?.sizeName),
      genderId: getIdByName(
        dataGender,
        "genderName",
        getProductDetail?.genderName
      ),
      colorId: getIdByName(dataColor, "colorName", getProductDetail?.colorName),
      productId: getIdByName(
        dataProduct,
        "productName",
        getProductDetail?.productName
      ),
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      handleSubmit(getProductDetail?.id, values);
    },
  });

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm(); // Reset lại form khi modal đóng
    }
    console.log(dataProduct);
  }, [isOpen]);

  return (
    <>
      <Modal
        open={isOpen}
        title={
          <span className="flex">
            <FaEdit
              style={{ color: "green", marginRight: 8, fontSize: "1.5rem" }}
            />
            Chỉnh sửa {title}
          </span>
        }
        width={1000}
        okType="primary"
        onCancel={handleClose}
        footer={[
          <Button key="back" onClick={handleClose}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => formik.submitForm()} // Gọi hàm submitForm của Formik khi nhấn nút xác nhận

            // disabled={!isActiveUpdate}
          >
            Xác nhận
          </Button>,
        ]}
        keyboard={false}
        maskClosable={false}
      >
        <Row gutter={[16, 16]} className="flex justify-between mb-3">
          <Col span={6}>
            <label className="text-sm block mb-2" htmlFor="">
              <span className="text-red-600">*</span> Sản phẩm
            </label>
            <Select
              id="productId"
              name="productId"
              showSearch
              style={{
                width: "100%",
              }}
              value={formik.values.productId}
              onChange={(value) => formik.setFieldValue("productId", value)}
              placeholder="Chọn sản phẩm"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={dataProduct?.map((thuongHieu) => ({
                value: thuongHieu.id,
                label: thuongHieu.productName,
              }))}
            />
            {formik.touched.brandId && formik.errors.brandId && (
              <div className="text-red-600">{formik.errors.brandId}</div>
            )}
          </Col>
          <Col span={6}>
            <label className="text-sm block mb-2" htmlFor="">
              <span className="text-red-600">*</span> Thương hiệu
            </label>
            <Select
              id="brandId"
              name="brandId"
              showSearch
              style={{
                width: "100%",
              }}
              value={formik.values.brandId}
              onChange={(value) => formik.setFieldValue("brandId", value)}
              placeholder="Chọn thương hiệu"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={dataBrand?.map((thuongHieu) => ({
                value: thuongHieu.id,
                label: thuongHieu.brandName,
              }))}
            />
            {formik.touched.brandId && formik.errors.brandId && (
              <div className="text-red-600">{formik.errors.brandId}</div>
            )}
          </Col>
          <Col span={6}>
            <label className="text-sm block mb-2" htmlFor="">
              <span className="text-red-600">*</span> Loại giày
            </label>
            <Select
              id="typeId"
              name="typeId"
              showSearch
              style={{
                width: "100%",
              }}
              value={formik.values.typeId}
              onChange={(value) => formik.setFieldValue("typeId", value)}
              placeholder="Chọn danh mục"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={dataType?.map((danhMuc) => ({
                value: danhMuc.id,
                label: danhMuc.typeName,
              }))}
            />
            {formik.touched.typeId && formik.errors.typeId && (
              <div className="text-red-600">{formik.errors.typeId}</div>
            )}
          </Col>
          <Col span={6}>
            <label className="text-sm block mb-2" htmlFor="">
              <span className="text-red-600">*</span> Chất liệu vải
            </label>
            <Select
              id="materialId"
              name="materialId"
              showSearch
              style={{
                width: "100%",
              }}
              value={formik.values.materialId}
              onChange={(value) => formik.setFieldValue("materialId", value)}
              placeholder="Chọn chất liệu vải"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={dataMaterial?.map((vai) => ({
                value: vai.id,
                label: vai.materialName,
              }))}
            />
            {formik.errors.materialId && (
              <div className="text-red-600">{formik.errors.materialId}</div>
            )}
          </Col>
          <Col span={6}>
            <label className="text-sm block mb-2" htmlFor="">
              <span className="text-red-600">*</span> Chất liệu đế
            </label>
            <Select
              id="soleId"
              name="soleId"
              showSearch
              style={{
                width: "100%",
              }}
              value={formik.values.soleId}
              onChange={(value) => formik.setFieldValue("soleId", value)}
              placeholder="Chọn chất liệu đế"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={dataSole?.map((de) => ({
                value: de.id,
                label: de.soleName,
              }))}
            />
            {formik.errors.soleId && (
              <div className="text-red-600">{formik.errors.soleId}</div>
            )}
          </Col>
          <Col span={6}>
            <label className="text-sm block mb-2" htmlFor="">
              <span className="text-red-600">*</span> Giới tính
            </label>
            <Select
              id="genderId"
              name="genderId"
              showSearch
              style={{
                width: "100%",
              }}
              value={formik.values.genderId}
              onChange={(value) => formik.setFieldValue("genderId", value)}
              placeholder="Chọn giới tính"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={dataGender?.map((de) => ({
                value: de.id,
                label: de.genderName,
              }))}
            />
            {formik.errors.soleId && (
              <div className="text-red-600">{formik.errors.soleId}</div>
            )}
          </Col>
          <Col span={6}>
            <label className="text-sm block mb-2" htmlFor="">
              <span className="text-red-600">*</span> Kích cỡ
            </label>
            <Select
              id="sizeId"
              name="sizeId"
              showSearch
              style={{
                width: "100%",
              }}
              value={formik.values.sizeId}
              onChange={(value) => formik.setFieldValue("sizeId", value)}
              placeholder="Chọn kích cỡ"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={dataSize?.map((de) => ({
                value: de.id,
                label: de.sizeName,
              }))}
            />
            {formik.errors.soleId && (
              <div className="text-red-600">{formik.errors.soleId}</div>
            )}
          </Col>
          <Col span={6}>
            <label className="text-sm block mb-2" htmlFor="">
              <span className="text-red-600">*</span> Màu sắc
            </label>
            <Select
              id="colorId"
              name="colorId"
              showSearch
              style={{
                width: "100%",
              }}
              value={formik.values.colorId}
              onChange={(value) => formik.setFieldValue("colorId", value)}
              placeholder="Chọn màu sắc"
              optionFilterProp="label"
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              options={dataColor?.map((de) => ({
                value: de.id,
                label: de.colorName,
              }))}
            />
            {formik.errors.soleId && (
              <div className="text-red-600">{formik.errors.soleId}</div>
            )}
          </Col>
          <Col span={6}>
            <label className="text-sm block mb-2" htmlFor="">
              <span className="text-red-600">*</span> Số lượng
            </label>
            <InputNumber
              value={formik.values.quantity}
              placeholder="số lượng"
              allowClear
              name="name"
              type="number"
              min={0}
              onChange={(value) => formik.setFieldValue("quantity", value)}
            />
          </Col>
          <Col span={6}>
            <label className="text-sm block mb-2" htmlFor="">
              <span className="text-red-600">*</span> Giá bán
            </label>
            <InputNumber
              value={formik.values.price}
              placeholder="giá bán"
              allowClear
              name="name"
              type="number"
              onChange={(value) => formik.setFieldValue("price", value)}
              min={0}
            />
          </Col>
          <Col span={6}>
            <label className="text-sm block mb-2" htmlFor="">
              <span className="text-red-600">*</span> Cân nặng
            </label>
            <InputNumber
              value={formik.values.weight}
              placeholder="Cân nặng"
              allowClear
              name="name"
              type="number"
              min={0}
              onChange={(value) => formik.setFieldValue("weight", value)}
            />
          </Col>
        </Row>

        <Row>
          <label className="text-sm block mb-2" htmlFor="">
            Mô tả
          </label>

          <TextArea
            id="description"
            name="description"
            value={formik.values.description}
            // style={{
            //   width: "300px",
            // }}
            rows={4}
            placeholder="mô tả tối đa 200 từ"
            maxLength={10}
            onChange={formik.handleChange}
          />
        </Row>
        <Row>
          <Radio.Group
            onChange={(e) => formik.setFieldValue("status", e.target.value)}
            value={formik.values.status} // Liên kết với giá trị formik
            name="status"
          >
            <Row gutter={[8, 8]}>
              <Col>
                <Radio.Button
                  value="HOAT_DONG"
                  className={clsx(
                    formik.values.status === "HOAT_DONG" ? styles.statushd : "",
                    styles.statushdhv
                  )}
                >
                  HOẠT ĐỘNG
                </Radio.Button>
              </Col>

              <Col>
                <Radio.Button
                  value="NGUNG_HOAT_DONG"
                  className={clsx(
                    formik.values.status === "NGUNG_HOAT_DONG"
                      ? styles.statusnhd
                      : "",
                    styles.statusnhdhv
                  )}
                >
                  NGỪNG HOẠT ĐỘNG
                </Radio.Button>
              </Col>
            </Row>
          </Radio.Group>
        </Row>
      </Modal>
    </>
  );
};

export default AddSanPham;
