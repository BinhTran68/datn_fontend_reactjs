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
  QRCode,
} from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { FaEdit } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
const { TextArea } = Input;
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import styles from "./ProductDetail.module.css";
import { updateProduct } from "./ApiProductDetail";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { BiDownload } from "react-icons/bi";
import { FaDownload } from "react-icons/fa6";
import { IoDownload } from "react-icons/io5";
import { COLORS } from "../../../constants/constants.";

const ModalEditSanPham = ({
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
  const qrCanvasRef = useRef(null); // Ref cho canvas
  const qrSvgRef = useRef(null); // Ref cho canvas

  const [request, setRequest] = useState({
    status: "HOAT_DONG",
  });
  const downloadQRCodeSvg = () => {
    const svg = qrSvgRef.current?.querySelector("svg");
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svg); // Chuyển SVG thành chuỗi
    const blob = new Blob([svgData], { type: "image/svg+xml" }); // Tạo blob từ chuỗi SVG
    const url = URL.createObjectURL(blob); // Tạo URL tạm thời cho file SVG

    const link = document.createElement("a");
    link.href = url;
    link.download = "QRCode_SVG.svg"; // Tên file tải về
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Giải phóng URL tạm thời
  };
  const downloadQRCodeCanvas = () => {
    const canvas = qrCanvasRef.current?.querySelector("canvas");
    if (!canvas) return;

    const url = canvas.toDataURL("image/png"); // Lấy ảnh PNG từ canvas
    const link = document.createElement("a");
    link.href = url;
    link.download = "QRCode_Canvas" + getProductDetail?.id + ".png"; // Tên file tải về
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
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
              style={{ color: `${COLORS.primary}`, marginRight: 8, fontSize: "1.5rem" }}
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
            style={{
             
              
              
            }}
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
              optionFilterProp="title"
              // filterSort={(optionA, optionB) =>
              //   (optionA?.label ?? "")
              //     .toLowerCase()
              //     .localeCompare((optionB?.label ?? "").toLowerCase())
              // }
              options={dataColor?.map((de) => ({
                value: de.id,
                label: (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "1.2rem",
                        height: "1.2rem",
                        backgroundColor: `${de.code}`,
                        borderRadius: "50%",
                        border: "1px solid #ccc",
                      }}
                    />
                    {de.colorName}
                  </div>
                ),
                title: de.colorName, // Dùng 'title' để lọc khi search
              }))}
            />
            {formik.errors.soleId && (
              <div className="text-red-600">{formik.errors.soleId}</div>
            )}
          </Col>
          <Col span={6}>
            <div className="text-sm block mb-2" htmlFor="">
              <span>*</span> Số lượng
            </div>
            <InputNumber
              value={formik.values.quantity || 0}
              placeholder="số lượng"
              allowClear
              name="name"
              type="number"
              min={0}
              onChange={(value) => formik.setFieldValue("quantity", value )}
              style={{ width: "100%" }}
              suffix={<span>Đôi</span>}

            />
          </Col>
          <Col span={6}>
            <div className="text-sm block mb-2" htmlFor="">
              <span className="text-red-600">*</span> Giá bán
            </div>
            <InputNumber
              value={formik.values.price||0}
              placeholder="giá bán"
              allowClear
              name="name"
              type="number"
              onChange={(value) => formik.setFieldValue("price", value)}
              min={0}
              suffix={<span>VNĐ</span>}
              style={{ width: "100%" }}
            />
          </Col>
          <Col span={6}>
            <div className="text-sm block mb-2" htmlFor="">
              <span className="text-red-600">*</span> Cân nặng
            </div>
            <InputNumber
              value={formik.values.weight||0}
              placeholder="Cân nặng"
              allowClear
              name="name"
              type="number"
              min={0}
              onChange={(value) => formik.setFieldValue("weight", value)}
              style={{ width: "100%" }}
              suffix={<span>Kg</span>}

            />
          </Col>
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
        <Row>
          <Col span={24}>
            <div ref={qrCanvasRef}>
              <QRCode
                type="canvas"
                value={`${getProductDetail?.id || "https://ant.design/"}`}
                style={{ width: "10rem", height: "auto" }}
                // errorLevel='M'
              />
            </div>
          </Col>
          <Col>
            <Button
              type="primary"
              onClick={downloadQRCodeCanvas}
              style={{
               
                
                
                width: "10rem",
              }}
            >
              <BiDownload size={23} />
              DownLoad-QR
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div>Mô tả</div>
          </Col>

          <Col span={24}>
            {/* <TextArea
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
          /> */}

            <ReactQuill
              theme="snow"
              value={formik.values.description}
              placeholder="Mô tả tối đa 200 từ"
              onChange={(value) => formik.setFieldValue("description", value)} // Sửa thành setFieldValue
              modules={{
                toolbar: [
                  [{ header: [1, 2, false] }],
                  ["bold", "italic", "underline"],
                  [false, false],
                ],
              }}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default ModalEditSanPham;
