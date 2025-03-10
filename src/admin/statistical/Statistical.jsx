import React from 'react';
import CardStatical from "./componets/CardStatical.jsx";
import ChartComponent from "./componets/ChartComponent.jsx";
import ChartStatusBill from "./componets/ChartStatusBill.jsx";
import SalesRevenue from "./componets/SalesRevenue.jsx"

const Statistical = () => {
    return (
        <>
            <h1 style={{textAlign:"center", color: "orange ", fontSize: 40, fontWeight: 'bold' }}>Thống kê</h1>
            {/* Thống kê doanh thu */}
            <SalesRevenue>
            </SalesRevenue>

            {/* Thống kê sản phẩm bán chạy và biểu đồ tròn */}
            <ChartStatusBill></ChartStatusBill>
            
            {/* Thống kê sản phẩm tồn kho */}
            <CardStatical ></CardStatical>
        </>

    );
};

export default Statistical;



