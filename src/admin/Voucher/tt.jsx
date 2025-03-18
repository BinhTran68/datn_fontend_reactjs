import React, { useState } from "react";
import "./StatusSelector.css"; // Tạo file CSS để định dạng giao diện nếu cần

const StatusSelector = () => {
  const [status, setStatus] = useState("Đang kích hoạt");

  const statuses = [
    { label: "Đang kích hoạt", color: `${COLORS.primary}` },
    { label: "Ngừng kích hoạt", color: "red" },
    { label: "Chưa kích hoạt", color: "gray" },
  ];

  return (
    <div className="status-selector">
      <h3>Trạng Thái</h3>
      <div className="status-options">
        {statuses.map((item) => (
          <button
            key={item.label}
            className={`status-button ${
              status === item.label ? "active" : ""
            }`}
            style={{ backgroundColor: status === item.label ? item.color : "#ddd" }}
            onClick={() => setStatus(item.label)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StatusSelector;

// Tạo file CSS (StatusSelector.css) để định dạng
/**
.status-selector {
  text-align: center;
  font-family: Arial, sans-serif;
}

.status-options {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.status-button {
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  color: white;
}

.status-button.active {
  font-weight: bold;
  transform: scale(1.1);
}
**/
const AdvancedSearchForm = ({ onSearch }) => {
  const [form] = Form.useForm();
  const [expand, setExpand] = useState(false);

  const { RangePicker } = DatePicker;
  const onFinish = (values) => {
      onSearch(values);
  };

  return (
      <Card>
          <Form form={form} name="advanced_search" onFinish={onFinish} layout="vertical">
              <Row gutter={24}>
                  {/* Ô tìm kiếm tên phiếu giảm giá luôn hiển thị */}
                  <Col span={24}>
                      <Form.Item name="voucherName" label="Tên phiếu giảm giá">
                          <Input placeholder="Nhập Tên phiếu giảm giá" />
                      </Form.Item>
                  </Col>

              </Row>

              {expand && (
                  <Row gutter={24}>
                      <Col span={8}>
                          <Form.Item label="Khoảng giá giá trị đơn hàng" name="billMinValue">
                              <Space>
                                  <InputNumber
                                      placeholder="Từ"
                                      style={{ width: '100%' }}
                                      min={0}
                                  />
                                  -
                                  <InputNumber
                                      placeholder="Đến"
                                      style={{ width: '100%' }}
                                      min={0}
                                  />
                              </Space>
                          </Form.Item>
                      </Col>
                      <Col span={8}>
                          <Form.Item label="Khoảng giá giá trị phiếu giảm giá" name="discountMaxValue">
                              <Space>
                                  <InputNumber
                                      placeholder="Từ"
                                      style={{ width: '100%' }}
                                      min={0}
                                  />
                                  -
                                  <InputNumber
                                      placeholder="Đến"
                                      style={{ width: '100%' }}
                                      min={0}
                                  />
                              </Space>
                          </Form.Item>
                      </Col>
                      <Col span={4}>
                          <Form.Item name="voucherType" label="Loại phiếu giảm">
                              <Select placeholder="Chọn trạng thái">
                                  <Option value="dang_kich_hoat">Tất cả</Option>
                                  <Option value="PUBLIC">Công khai</Option>
                                  <Option value="PRIVATE">Riêng tư</Option>
                              </Select>
                          </Form.Item>
                      </Col>
                      <Col span={4}>
                          <Form.Item name="quantity" label="Số lượng">
                              <InputNumber style={{ width: '100%' }}min={0}
                                  placeholder="Nhập số lượng" />
                          </Form.Item>
                      </Col>
                      <Col span={4}>
                          <Form.Item name="statusVoucher" label="Trạng thái">
                              <Select placeholder="Chọn trạng thái">
                                  <Option value="dang_kich_hoat">Đang kích hoạt</Option>
                                  <Option value="ngung_kich_hoat">Ngừng kích hoạt</Option>
                                  <Option value="chua_kich_hoat">Chưa kích hoạt</Option>
                              </Select>
                          </Form.Item>
                      </Col>
                      <Col span={8}>
                          <Form.Item name="dateRange" label="Chọn khoảng thời gian">
                              <RangePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
                          </Form.Item>
                      </Col>


                  </Row>
              )}

              <div style={{ textAlign: 'right' }}>
                  <Space size="small">
                      <Button
                          icon={<RedoOutlined />}
                          onClick={() => form.resetFields()}
                          style={{ color: 'white', borderRadius: '20px', backgroundColor: '#ff974d', borderColor: '#ff974d' }}
                      />
                      <a
                          style={{ fontSize: 12 }}
                          onClick={() => setExpand(!expand)}
                      >
                          <DownOutlined rotate={expand ? 180 : 0} /> {expand ? 'Thu gọn tìm kiếm' : 'Mở rộng tìm kiếm'}
                      </a>
                  </Space>
              </div>
          </Form>
      </Card>
  );
};