// import React, { useState } from "react";
// import { Modal, Form, Input, Select, Button } from "antd";

// const { Option } = Select;

// const AddressFormModal = () => {
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   const showModal = () => {
//     setIsModalVisible(true);
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//   };

//   const handleFinish = () => {
//     console.log("Form values: ", values);
//     setIsModalVisible(false);
//   };

//   return (
//     <div>
//       <Button type="primary" onClick={showModal}>
//         Thêm địa chỉ
//       </Button>
//       <Modal
//         title="Thêm địa chỉ"
//         visible={isModalVisible}
//         onCancel={handleCancel}
//         footer={null}
//       >
//         <Form
//           layout="vertical"
//           onFinish={handleFinish}
//           initialValues={{ city: "", district: "", ward: "" }}
//         >
//           <Form.Item
//             label="Họ và tên"
//             name="name"
//             rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
//           >
//             <Input placeholder="Họ và tên" />
//           </Form.Item>

//           <Form.Item
//             label="Số điện thoại"
//             name="phone"
//             rules={[
//               { required: true, message: "Vui lòng nhập số điện thoại!" },
//               { pattern: /^[0-9]+$/, message: "Số điện thoại không hợp lệ!" },
//             ]}
//           >
//             <Input placeholder="Số điện thoại" />
//           </Form.Item>

//           <Form.Item
//             label="Tỉnh/Thành phố"
//             name="city"
//             rules={[{ required: true, message: "Vui lòng chọn Tỉnh/Thành phố!" }]}
//           >
//             <Select placeholder="--Chọn Tỉnh/Thành phố--">
//               <Option value="hanoi">Hà Nội</Option>
//               <Option value="hcm">Hồ Chí Minh</Option>
//               <Option value="danang">Đà Nẵng</Option>
//             </Select>
//           </Form.Item>

//           <Form.Item
//             label="Quận/Huyện"
//             name="district"
//             rules={[{ required: true, message: "Vui lòng chọn Quận/Huyện!" }]}
//           >
//             <Select placeholder="--Chọn Quận/Huyện--">
//               <Option value="district1">Quận 1</Option>
//               <Option value="district2">Quận 2</Option>
//               <Option value="district3">Quận 3</Option>
//             </Select>
//           </Form.Item>

//           <Form.Item
//             label="Xã/Phường"
//             name="ward"
//             rules={[{ required: true, message: "Vui lòng chọn Xã/Phường!" }]}
//           >
//             <Select placeholder="--Chọn Xã/Phường--">
//               <Option value="ward1">Phường 1</Option>
//               <Option value="ward2">Phường 2</Option>
//               <Option value="ward3">Phường 3</Option>
//             </Select>
//           </Form.Item>

//           <Form.Item
//             label="Số nhà/Ngõ/Đường"
//             name="address"
//             rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
//           >
//             <Input placeholder="Số nhà/Ngõ/Đường" />
//           </Form.Item>

//           <Form.Item>
//             <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
//               <Button onClick={handleCancel}>Hủy</Button>
//               <Button type="primary" htmlType="submit">
//                 Thêm
//               </Button>
//             </div>
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default AddressFormModal;    
import React, { useState } from "react";
import { Modal, Form, Input, Select, Button } from "antd";

const { Option } = Select;

const AddressFormModal = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleFinish = () => {
    form.validateFields().then((values) => {
      console.log("Form values: ", values);
      setIsModalVisible(false);
    }).catch((info) => {
      console.log('Validate Failed:', info);
    });
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Thêm địa chỉ
      </Button>
      <Modal
        title="Thêm địa chỉ"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ city: "", district: "", ward: "" }}
        >
          <Form.Item
            label="Họ và tên"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập họ và tên!" }]}
          >
            <Input placeholder="Họ và tên" />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" },
              { pattern: /^[0-9]+$/, message: "Số điện thoại không hợp lệ!" },
            ]}
          >
            <Input placeholder="Số điện thoại" />
          </Form.Item>

          <Form.Item
            label="Tỉnh/Thành phố"
            name="city"
            rules={[{ required: true, message: "Vui lòng chọn Tỉnh/Thành phố!" }]}
          >
            <Select placeholder="--Chọn Tỉnh/Thành phố--">
              <Option value="hanoi">Hà Nội</Option>
              <Option value="hcm">Hồ Chí Minh</Option>
              <Option value="danang">Đà Nẵng</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Quận/Huyện"
            name="district"
            rules={[{ required: true, message: "Vui lòng chọn Quận/Huyện!" }]}
          >
            <Select placeholder="--Chọn Quận/Huyện--">
              <Option value="district1">Quận 1</Option>
              <Option value="district2">Quận 2</Option>
              <Option value="district3">Quận 3</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Xã/Phường"
            name="ward"
            rules={[{ required: true, message: "Vui lòng chọn Xã/Phường!" }]}
          >
            <Select placeholder="--Chọn Xã/Phường--">
              <Option value="ward1">Phường 1</Option>
              <Option value="ward2">Phường 2</Option>
              <Option value="ward3">Phường 3</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Số nhà/Ngõ/Đường"
            name="address"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
          >
            <Input placeholder="Số nhà/Ngõ/Đường" />
          </Form.Item>

          <Form.Item>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
              <Button onClick={handleCancel}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Thêm
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddressFormModal;