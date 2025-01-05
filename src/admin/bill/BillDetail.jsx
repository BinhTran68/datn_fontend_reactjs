import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {Button, Card, Steps} from "antd";
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    CarOutlined,
    SyncOutlined,
    SmileOutlined,
} from "@ant-design/icons";

const { Step } = Steps;

const BillDetail = () => {
    const [currentStep, setCurrentStep] = useState(0); // Trạng thái hiện tại
    const { id } = useParams();

    useEffect(() => {
        console.log(id);
    }, [id]);

    const steps = [
        {
            key: "CHO_XAC_NHAN",
            title: "Chờ xác nhận",
            timestamp: "16:37:35 23-12-2023",
            icon: <ClockCircleOutlined />,
        },
        {
            key: "DA_XAC_NHAN",
            title: "Đã xác nhận",
            timestamp: null,
            icon: <CheckCircleOutlined />,
        },
        {
            key: "CHO_VAN_CHUYEN",
            title: "Chờ vận chuyển",
            timestamp: null,
            icon: <CarOutlined />,
        },
        {
            key: "DANG_VAN_CHUYEN",
            title: "Đang vận chuyển",
            timestamp: null,
            icon: <SyncOutlined spin />,
        },
        {
            key: "DA_HOAN_THANH",
            title: "Đã hoàn thành",
            timestamp: null,
            icon: <SmileOutlined />,
        },
    ];

    return (
        <div>
            <Card>
                <div className={"mb-5"}>
                    <Steps current={currentStep} labelPlacement={"vertical"} >
                        {steps.map((step) => (
                            <Step
                                key={step.key}
                                title={<div style={{ textAlign: "center" }}>{step.title}</div>}
                                icon={step.icon}
                                description={
                                    step.timestamp && <div style={{ textAlign: "center" }}>{step.timestamp}</div>
                                }
                            />
                        ))}
                    </Steps>
                </div>


                <div>
                    <Button className={"btn-primary"} >
                        Xác nhận
                    </Button>

                    <Button className={"btn-danger"} >
                        Hủy
                    </Button>
                </div>

            </Card>

        </div>
    );
};

export default BillDetail;
