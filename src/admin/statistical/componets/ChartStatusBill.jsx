import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import {Card} from "antd";

const data = [
    { name: 'Chưa xác nhận', value: 400 },
    { name: 'Đã hoàn thành', value: 300 },
    { name: 'Đã hủy', value: 300 },
    { name: 'Đang chờ xác nhận', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ChartStatusBill = () => {
    return (
        <Card>
            <h2>Trạng thái đơn hàng</h2>
            <PieChart width={400} height={400}>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </Card>
    );
};

export default ChartStatusBill;
