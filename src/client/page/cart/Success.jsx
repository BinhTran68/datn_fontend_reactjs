import { Button, Result } from "antd";
import React from 'react'


function Success() {
  return (
    <>
      <Result
        status="success"
        title="Cảm ơn bạn đã mua hàng! Đơn hàng của bạn đã được tạo thành công! "
        subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
        extra={[
          <Button type="primary" key="console">
            Xem thêm sản phẩm
          </Button>,
          <Button key="buy">Mua thêm</Button>,
        ]}
        style={{
            backgroundColor:"white"
        }}
      />
    </>
  );
}

export default Success;
