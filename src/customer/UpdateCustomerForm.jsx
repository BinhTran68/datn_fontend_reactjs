// import React, { useState } from 'react';
// import {
//   Form,
//   Input,
//   Select,
//   DatePicker,
//   Radio,
//   Button,
//   Upload,
//   Avatar,
// } from 'antd';
// import { UserOutlined, UploadOutlined } from '@ant-design/icons';

// const { Option } = Select;

// const UpdateCustomerForm = () => {
//   const [form] = Form.useForm();
//   const [imageUrl, setImageUrl] = useState(null);

//   const onFinish = (values) => {
//     console.log('Received values of form: ', values);
//     // Perform your update customer logic here
//   };

//   const handleImageChange = (info) => {
//     if (info.file.status === 'done') {
//       setImageUrl(info.file.response.url); // Assuming your upload API returns a URL
//     }
//   };

//   return (
//     <div>
//       <h1 style={{ textAlign: 'center' }}>CẬP NHẬT KHÁCH HÀNG</h1>
//       <div style={{ display: 'flex' }}>
//         <div style={{ width: '20%', padding: '20px' }}>
//           <h2>Ảnh đại diện</h2>
//           <Avatar
//             size={150}
//             src={
//               imageUrl ||
//               'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
//             }
//             icon={<UserOutlined />}
//           />
//           <Upload
//             name="avatar"
//             action="/your-upload-api" // Replace with your upload API endpoint
//             showUploadList={false}
//             onChange={handleImageChange}
//           >
//             <Button icon={<UploadOutlined />} style={{ marginTop: '10px' }}>
//               Upload
//             </Button>
//           </Upload>
//         </div>
//         <div style={{ width: '80%', padding: '20px' }}>
//           <h2>Thông tin khách hàng</h2>
//           <Form form={form} layout="vertical" onFinish={onFinish}>
//             <Form.Item
//               name="customerName"
//               label="Tên khách hàng"
//               initialValue=""
//               rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
//             >
//               <Input />
//             </Form.Item>
//             <Form.Item
//               name="phoneNumber"
//               label="Số điện thoại"
//               initialValue=""
//               rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
//             >
//               <Input />
//             </Form.Item>
//             <Form.Item
//               name="email"
//               label="Email"
//               initialValue=""
//               rules={[
//                 { required: true, message: 'Vui lòng nhập email!' },
//                 { type: 'email', message: 'Email không hợp lệ!' },
//               ]}
//             >
//               <Input />
//             </Form.Item>
//             <Form.Item
//               name="birthDate"
//               label="Ngày sinh"
//               rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
//             >
//               <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
//             </Form.Item>
//             <Form.Item
//               name="province"
//               label="Tỉnh/Thành phố"
//               initialValue=""
//               rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố!' }]}
//             >
//               <Select>
//                 <Option value="Lào Cai">Lào Cai</Option>
//                 {/* Add more provinces here */}
//               </Select>
//             </Form.Item>
//             <Form.Item
//               name="district"
//               label="Quận/Huyện"
//               initialValue=""
//               rules={[{ required: true, message: 'Vui lòng chọn quận/huyện!' }]}
//             >
//               <Select>
//                 <Option value="Huyện Mường Khương">Huyện Mường Khương</Option>
//                 {/* Add more districts here */}
//               </Select> 
//             </Form.Item>
//             <Form.Item
//               name="ward"
//               label="Xã/Phường"
//               initialValue=""
//               rules={[{ required: true, message: 'Vui lòng chọn xã/phường!' }]}
//             >
//               <Input />
//             </Form.Item>
//             <Form.Item
//               name="address"
//               label="Số nhà/Ngõ/Đường"
//               initialValue=""
//               rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
//             >
//               <Input />
//             </Form.Item>
//             <Form.Item
//               name="status"
//               label="Trạng thái"
//               initialValue="active"
//               rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
//             >
//               <Select>
//                 <Option value="active">Kích hoạt</Option>
//                 <Option value="inactive">Không kích hoạt</Option>
//               </Select>
//             </Form.Item>
//             <Form.Item
//               name="gender"
//               label="Giới tính"
//               initialValue="male"
//               rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
//             >
//               <Radio.Group>
//                 <Radio value="male">Nam</Radio>
//                 <Radio value="female">Nữ</Radio>
//               </Radio.Group>
//             </Form.Item>
//             <Form.Item style={{ textAlign: 'right' }}>
//               <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
//                 Cập nhật
//               </Button>
//               <Button htmlType="button" onClick={() => form.resetFields()}>
//                 Hủy
//               </Button>
//             </Form.Item>
//           </Form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdateCustomerForm;
import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  Button,
  Upload,
  Avatar,
  message,
} from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const UpdateCustomerForm = () => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null);

  const onFinish = (values) => {
    console.log('Received values of form: ', values);
    // Perform your update customer logic here
    message.success('Cập nhật thành công!');
  };

  const handleImageChange = (info) => {
    if (info.file.status === 'done') {
      setImageUrl(info.file.response.url); // Assuming your upload API returns a URL
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>CẬP NHẬT KHÁCH HÀNG</h1>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '20%', padding: '20px' }}>
          <h2>Ảnh đại diện</h2>
          <Avatar
            size={150}
            src={
              imageUrl ||
              'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
            }
            icon={<UserOutlined />}
          />
          <Upload
            name="avatar"
            action="/your-upload-api" // Replace with your upload API endpoint
            showUploadList={false}
            onChange={handleImageChange}
          >
            <Button icon={<UploadOutlined />} style={{ marginTop: '10px' }}>
              Upload
            </Button>
          </Upload>
        </div>
        <div style={{ width: '80%', padding: '20px' }}>
          <h2>Thông tin khách hàng</h2>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              name="customerName"
              label="Tên khách hàng"
              rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              label="Số điện thoại"
              rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="birthDate"
              label="Ngày sinh"
              rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="province"
              label="Tỉnh/Thành phố"
              rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố!' }]}
            >
              <Select>
                <Option value="Lào Cai">Lào Cai</Option>
                {/* Add more provinces here */}
              </Select>
            </Form.Item>
            <Form.Item
              name="district"
              label="Quận/Huyện"
              rules={[{ required: true, message: 'Vui lòng chọn quận/huyện!' }]}
            >
              <Select>
                <Option value="Huyện Mường Khương">Huyện Mường Khương</Option>
                {/* Add more districts here */}
              </Select>
            </Form.Item>
            <Form.Item
              name="ward"
              label="Xã/Phường"
              rules={[{ required: true, message: 'Vui lòng chọn xã/phường!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="address"
              label="Số nhà/Ngõ/Đường"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
            >
              <Select>
                <Option value="active">Kích hoạt</Option>
                <Option value="inactive">Không kích hoạt</Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="gender"
              label="Giới tính"
              rules={[{ required: true, message: 'Vui lòng chọn giới tính!' }]}
            >
              <Radio.Group>
                <Radio value="male">Nam</Radio>
                <Radio value="female">Nữ</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item style={{ textAlign: 'right' }}>
              <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
                Cập nhật
              </Button>
              <Button htmlType="button" onClick={() => form.resetFields()}>
                Hủy
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default UpdateCustomerForm;