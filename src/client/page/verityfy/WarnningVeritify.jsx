import { Button, Result, List, Typography, Card } from "antd";
import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

function WarningVeritify() {

  
  return (
    <Card style={{ backgroundColor: "white", padding: 20 ,minHeight:600}}>
      Vui lòng mở mail để xác thực đơn hàng
    </Card>
  );
}

export default WarningVeritify;
