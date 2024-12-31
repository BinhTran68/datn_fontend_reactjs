import React, { useState } from 'react';
import { Modal, Button, List, Radio, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const AddressModal = () => {
  const [visible, setVisible] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState(0);

  const addresses = [
    {
      name: 'Nguyễn Văn Anh',
      phone: '0370530000',
      address: '10 Trung Dương Thanh, Huyện Mường Khương, Xã Tả Ngải Chồ, Lào Cai',
      default: true,
    },
    {
      name: 'Nguyễn Văn A',
      phone: '0378544444',
      address: '10 Trung Dương Thanh, Huyện Văn Giang, Xã Nghĩa Trụ, Hưng Yên',
      default: false,
    },
  ];

  const handleOk = () => {
    setVisible(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleSelect = (index) => {
    setSelectedAddress(index);
  };

  return (
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
      <Button type="dashed" block icon={<PlusOutlined />}>
        + Thêm địa chỉ mới
      </Button>
      <List
        itemLayout="horizontal"
        dataSource={addresses}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <Button type="link" key="update">
                Cập nhật
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={
                <Radio
                  checked={selectedAddress === index}
                  onChange={() => handleSelect(index)}
                />
              }
              title={
                <Space direction="vertical">
                  <span>
                    {item.name} | {item.phone}
                  </span>
                  <span>{item.address}</span>
                  {item.default && (
                    <Button type="primary" size="small">
                      Mặc định
                    </Button>
                  )}
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default AddressModal;