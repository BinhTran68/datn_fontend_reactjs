import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PiBellRinging } from "react-icons/pi";
import { AiOutlineGlobal } from "react-icons/ai";
import { COLORS } from "../../../constants/constants.js";
import {
  Badge,
  Button,
  Col,
  Flex,
  Input,
  List,
  Popover,
  Row,
  Space,
} from "antd";
import { SearchOutlined, SettingOutlined } from "@ant-design/icons";

function Home() {
  const [isAuthentication, setIsAuthentication] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem("user"))
  );
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
      setUser(null); // Cập nhật ngay lập tức

    window.dispatchEvent(new Event("cartUpdated")); // Cập nhật giỏ hàng
    navigate("/login");
  };

  useEffect(() => {
    const customerLogin = localStorage.getItem("customer");
    if (customerLogin) {
      setIsAuthentication(true);
      setCustomer(JSON.parse(customerLogin));
    }
  }, []);

  const [open, setOpen] = useState(false);

  const settingsOptions = [
    { key: "profile", label: "Hồ sơ" },
    { key: "change-password", label: "Đổi mật khẩu" },
    { key: "logout", label: "Đăng xuất" },
  ];

  const handleMenuClick = (key) => {
    console.log("Chọn chức năng:", key);

    if (key === "logout") {
      handleLogout();
    } else {
      navigate(`/${key}`);
    }

    setTimeout(() => setOpen(false), 200);
  };

  const content = (
    <List
      dataSource={settingsOptions}
      renderItem={(item) => (
        <List.Item
          onClick={() => handleMenuClick(item.key)}
          style={{ cursor: "pointer" }}
        >
          {item.label}
        </List.Item>
      )}
    />
  );

  return (
    <>
      <div className={"w-100"}>
        <p
          className="text-light text-center"
          style={{
            backgroundColor: `${COLORS.primary}`,
          }}
        >
          Thehands shop - Nhà sưu tầm và phân phối chính hãng các thương hiệu
          thời trang quốc tế hàng đầu Việt Nam
        </p>
        <Row gutter={[5, 5]} align={"middle"}>
          <Col span={6}></Col>
          <Col span={12}>
            <Row justify="center" gutter={[16, 16]}>
              <Col>
                <Input
                  placeholder="Nhập vào tên giày muốn tìm!"
                  prefix={<SearchOutlined />}
                  allowClear
                  name="name"
                  style={{ width: "40rem", height: "2.5rem" }}
                />
              </Col>
              <Col className="p-0">
                <Button
                  type="primary"
                  icon={<SearchOutlined />}
                  style={{ height: "2.5rem", width: "2.5rem" }}
                />
              </Col>
            </Row>
          </Col>

          <Col span={6}>
            <Flex justify="flex-end" align="center" gutter={[10, 10]}>
              <Col>
                <Space style={{ cursor: "pointer" }}>
                  <Badge count={5}>
                    <PiBellRinging size={20} style={{ fontWeight: "bold" }} />
                  </Badge>
                  <span style={{ fontSize: "0.9rem" }}>Thông báo</span>
                </Space>
              </Col>
              <Col>
                <Space>
                  <AiOutlineGlobal size={20} style={{ fontWeight: "bold" }} />
                  <span style={{ fontSize: "0.9rem" }}>Tiếng Việt</span>
                </Space>
              </Col>

              <Col>
                {!isAuthentication && (
                  <Link
                    className="text-decoration-none text-black fw-normal"
                    to="/register"
                  >
                    Đăng Kí
                  </Link>
                )}
              </Col>
              <Popover
                content={content}
                trigger="click"
                open={open}
                onOpenChange={setOpen}
                placement="bottomRight"
              >
                <SettingOutlined style={{ fontSize: 19, cursor: "pointer" }} />
              </Popover>
            </Flex>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Home;
