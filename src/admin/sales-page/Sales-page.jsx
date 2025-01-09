import React, {useState} from 'react';
import {Button, Card, Tabs} from "antd";
import {toast} from "react-toastify";

const SalesPage = () => {
    const [items, setItems] = useState([
        {
            key: "1",
            label: "Hóa đơn 1",
            productList: [],
        },
    ]);

    const handleOnCreateBill = () => {
        if(items.length >= 10) {
            toast.warning("Đạt giới hạn hóa đơn")
            return;
        }
        const newKey = (items.length + 1).toString(); // Tạo key mới cho hóa đơn
        const newItem = {
            key: newKey,
            label: `Hóa đơn ${newKey}`,
            productList: [],
        };

        setItems([...items, newItem]);
    };

    return (
        <div>
            <div>
                <Button onClick={handleOnCreateBill}>
                    Tạo hóa đơn
                </Button>
            </div>

            <Card>
                <Tabs
                    defaultActiveKey="1"
                    items={items}
                />

            </Card>
        </div>
    );
};

export default SalesPage;
