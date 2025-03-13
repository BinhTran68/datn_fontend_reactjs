import React from 'react';
import CardStatical from "./componets/CardStatical.jsx";
import ChartComponent from "./componets/ChartComponent.jsx";
import ChartStatusBill from "./componets/ChartStatusBill.jsx";
import SalesRevenue from "./componets/SalesRevenue.jsx"

const Statistical = () => {
    return (
        <>
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



