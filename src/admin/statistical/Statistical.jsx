import React from 'react';
import CardStatical from "./componets/CardStatical.jsx";
import ChartComponent from "./componets/ChartComponent.jsx";
import ChartStatusBill from "./componets/ChartStatusBill.jsx";
import SalesRevenue from "./componets/SalesRevenue.jsx"
import {Card} from 'antd';

const Statistical = () => {
    return (
        <>
         <Card style={{ border: 'none' }}>
                <div style={{ fontSize: '30px', fontWeight: 'bold',textAlign:'center' }}>
                    TỔNG QUAN CỬA HÀNG
                </div>

            </Card>
           <div style={{ backgroundColor: "white", minHeight: "100vh", padding: "20px" }}>
            {/* Thống kê doanh thu */}
            <SalesRevenue />

            {/* Thống kê sản phẩm bán chạy và biểu đồ tròn */}
            <ChartStatusBill />

            {/* Thống kê sản phẩm tồn kho */}
            <CardStatical />
        </div>
        </>

    );
};

export default Statistical;



