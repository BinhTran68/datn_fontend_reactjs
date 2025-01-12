// import React, { useState } from 'react';
// import { Modal, Button, List, Radio, Space } from 'antd';
// import { PlusOutlined } from '@ant-design/icons';

// const AddressModal = () => {
//   const [visible, setVisible] = useState(true);
//   const [selectedAddress, setSelectedAddress] = useState(0);

//   const addresses = [
//     {
//       name: 'Nguyễn Văn Anh',
//       phone: '0370530000',
//       address: '10 Trung Dương Thanh, Huyện Mường Khương, Xã Tả Ngải Chồ, Lào Cai',
//       default: true,
//     },
//     {
//       name: 'Nguyễn Văn A',
//       phone: '0378544444',
//       address: '10 Trung Dương Thanh, Huyện Văn Giang, Xã Nghĩa Trụ, Hưng Yên',
//       default: false,
//     },
//   ];

//   const handleOk = () => {
//     setVisible(false);
//   };

//   const handleCancel = () => {
//     setVisible(false);
//   };

//   const handleSelect = (index) => {
//     setSelectedAddress(index);
//   };

//   return (
//     <Modal
//       title="Địa chỉ"
//       visible={visible}
//       onOk={handleOk}
//       onCancel={handleCancel}
//       footer={[
//         <Button key="cancel" onClick={handleCancel}>
//           Cancel
//         </Button>,
//         <Button key="ok" type="primary" onClick={handleOk}>
//           OK
//         </Button>,
//       ]}
//     >
//       <Button type="dashed" block icon={<PlusOutlined />}>
//         + Thêm địa chỉ mới
//       </Button>
//       <List
//         itemLayout="horizontal"
//         dataSource={addresses}
//         renderItem={(item, index) => (
//           <List.Item
//             actions={[
//               <Button type="link" key="update">
//                 Cập nhật
//               </Button>,
//             ]}
//           >
//             <List.Item.Meta
//               avatar={
//                 <Radio
//                   checked={selectedAddress === index}
//                   onChange={() => handleSelect(index)}
//                 />
//               }
//               title={
//                 <Space direction="vertical">
//                   <span>
//                     {item.name} | {item.phone}
//                   </span>
//                   <span>{item.address}</span>
//                   {item.default && (
//                     <Button type="primary" size="small">
//                       Mặc định
//                     </Button>
//                   )}
//                 </Space>
//               }
//             />
//           </List.Item>
//         )}
//       />
//     </Modal>
//   );
// };

// export default AddressModal;
import React, { useState } from 'react';
import { Modal, Button, List, Radio, Space, Input, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const AddressModal = () => {
  const [visible, setVisible] = useState(true);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [addresses, setAddresses] = useState([
    {
      name: 'Nguyễn Văn Anh',
      phone: '0370530000',
      address: '10 Trung Dương Thanh, Huyện Mường Khương, Xã Tả Ngải Chồ, Lào Cai',
      default: true,
      id: 1,
    },
    {
      name: 'Nguyễn Văn A',
      phone: '0378544444',
      address: '10 Trung Dương Thanh, Huyện Văn Giang, Xã Nghĩa Trụ, Hưng Yên',
      default: false,
      id: 2,
    },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const handleOk = () => {
    setVisible(false);
    console.log('Selected Address:', addresses[selectedAddressIndex]);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSelect = (index) => {
    setSelectedAddressIndex(index);
  };

  const handleAddAddressClick = () => {
    setIsAdding(true);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
  };

  const onFinishAdd = (values) => {
    const newAddress = { ...values, id: Date.now(), default: false };
    setAddresses([...addresses, newAddress]);
    setIsAdding(false);
  };

  const handleEditAddress = (id) => {
    setEditingAddressId(id);
  };

  const handleCancelEdit = () => {
    setEditingAddressId(null);
  };

  const onFinishEdit = (values) => {
    const updatedAddresses = addresses.map((address) =>
      address.id === editingAddressId ? { ...address, ...values } : address
    );
    setAddresses(updatedAddresses);
    setEditingAddressId(null);
  };

  const handleDeleteAddress = (id) => {
    const updatedAddresses = addresses.filter((address) => address.id !== id);
    setAddresses(updatedAddresses);
  };

  const handleSetDefault = (id) => {
    const updatedAddresses = addresses.map((address) => ({
      ...address,
      default: address.id === id,
    }));
    setAddresses(updatedAddresses);
  };

  return (
    <>
      <Modal
        title="Địa chỉ"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="ok" type="primary" onClick={handleOk}>
            OK
          </Button>,
        ]}
      >
        <Button type="dashed" block icon={<PlusOutlined />} onClick={handleAddAddressClick}>
          + Thêm địa chỉ mới
        </Button>
        <List
          itemLayout="horizontal"
          dataSource={addresses}
          renderItem={(item, index) => (
            <List.Item
              actions={[
                <Button type="link" key="update" onClick={() => handleEditAddress(item.id)}>
                  Cập nhật
                </Button>,
                <Button type="link" danger key="delete" onClick={() => handleDeleteAddress(item.id)}>
                  Xóa
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Radio
                    checked={selectedAddressIndex === index}
                    onChange={() => handleSelect(index)}
                  />
                }
                title={
                  <Space direction="vertical">
                    <span>
                      {item.name} | {item.phone}
                    </span>
                    <span>{item.address}</span>
                    <Space>
                      {item.default ? (
                        <Button type="primary" size="small">
                          Mặc định
                        </Button>
                      ) : (
                        <Button type="link" size="small" onClick={() => handleSetDefault(item.id)}>
                          Đặt làm mặc định
                        </Button>
                      )}
                    </Space>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Modal>

      {/* Modal Thêm địa chỉ */}
      <Modal
        title="Thêm địa chỉ mới"
        visible={isAdding}
        onCancel={handleCancelAdd}
        footer={null}
      >
        <Form name="add_address" onFinish={onFinishAdd}>
          <Form.Item
            label="Họ và tên"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Thêm địa chỉ
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Cập nhật địa chỉ */}
      <Modal
        title="Cập nhật địa chỉ"
        visible={editingAddressId !== null}
        onCancel={handleCancelEdit}
        footer={null}
      >
        <Form
          name="edit_address"
          onFinish={onFinishEdit}
          initialValues={addresses.find((address) => address.id === editingAddressId)}
        >
          <Form.Item
            label="Họ và tên"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Địa chỉ"
            name="address"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddressModal;