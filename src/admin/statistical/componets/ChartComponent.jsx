import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {Card, DatePicker, Space} from "antd";

const { RangePicker } = DatePicker;

const ChartComponent = () => {
    // Dữ liệu mẫu
    const [data, setData] = useState([
        { date: "01/12/2022", orders: 0 },
        { date: "02/12/2022", orders: 0 },
        { date: "03/12/2022", orders: 1 },
        { date: "04/12/2022", orders: 0 },
        { date: "05/12/2022", orders: 0 },
        { date: "06/12/2022", orders: 2 },
        { date: "07/12/2022", orders: 0 },
        { date: "23/12/2022", orders: 4 },
        { date: "24/12/2022", orders: 6 },
        { date: "24/12/2022", orders: 6 },
        { date: "24/12/2022", orders: 6 },
        { date: "24/12/2022", orders: 6 },
        { date: "24/12/2022", orders: 6 },
        { date: "24/12/2022", orders: 6 },
        { date: "24/12/2022", orders: 6 },
        { date: "24/12/2022", orders: 6 },
    ]);

    const handleDateChange = (dates) => {
        if (dates) {
            const [startDate, endDate] = dates;
            console.log("Selected range:", startDate.format("DD/MM/YYYY"), endDate.format("DD/MM/YYYY"));
            // Bạn có thể lọc dữ liệu hoặc gọi API để lấy dữ liệu mới tại đây
        }
    };

    return (
        <Card>
            <div style={{padding: "20px"}}>
                <h3>Biểu Đồ Thống Kê</h3>
                {/* Bộ lọc ngày */}
                <Space style={{marginBottom: "20px"}}>
                    <RangePicker format="DD/MM/YYYY" onChange={handleDateChange}/>
                </Space>

                {/* Biểu đồ */}
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data} margin={{top: 20, right: 30, left: 20, bottom: 20}}>
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="date" angle={-45} textAnchor="end" height={60}/>
                        <YAxis/>
                        <Tooltip/>
                        <Bar dataKey="orders" fill="#4287f5" name="Số Đơn Hàng"/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
};

export default ChartComponent;
