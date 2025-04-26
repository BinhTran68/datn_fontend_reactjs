import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import {Segmented, Select, Space} from 'antd';
import dayjs from 'dayjs';
import 'antd/dist/reset.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const { Option } = Select;

// Hàm tạo dữ liệu 14 đơn vị gần nhất (Ngày, Tuần, Năm)
const generateData = (timeType) => {
    const data = [];

    if (timeType === 'Ngày') {
        for (let i = 13; i >= 0; i--) {
            const date = dayjs().subtract(i, 'day').format('DD/MM');
            data.push({
                label: date,
                đơn_hàng: Math.floor(Math.random() * 100),
                số_lượng: Math.floor(Math.random() * 500),
            });
        }
    } else if (timeType === 'Tuần') {
        for (let i = 13; i >= 0; i--) {
            const week = dayjs().subtract(i, 'week').week();
            const year = dayjs().subtract(i, 'week').year();
            data.push({
                label: `Tuần ${week}/${year}`,
                đơn_hàng: Math.floor(Math.random() * 700),
                số_lượng: Math.floor(Math.random() * 1500),
            });
        }
    } else if (timeType === 'Năm') {
        for (let i = 13; i >= 0; i--) {
            const year = dayjs().subtract(i, 'year').year();
            data.push({
                label: `${year}`,
                đơn_hàng: Math.floor(Math.random() * 3000),
                số_lượng: Math.floor(Math.random() * 10000),
            });
        }
    }

    return data;
};

const ProductOrderChart = () => {
    const [selectedType, setSelectedType] = useState('đơn_hàng');
    const [selectedTime, setSelectedTime] = useState('Ngày');
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        setChartData(generateData(selectedTime));
    }, [selectedTime]); // Cập nhật lại data mỗi lần đổi khoảng thời gian

    return (
        <div className="container mt-4">
            <div className="card p-4 shadow-sm">
                <h5 className="mb-4">Thống kê {selectedType === 'đơn_hàng' ? 'đơn hàng' : 'số lượng'} theo {selectedTime.toLowerCase()}</h5>

                <div className="row mb-3">
                    <div className="col-md-6 mb-2">
                        <Space>
                            <span>Loại thống kê:</span>
                            <Select
                                value={selectedType}
                                style={{width: 150}}
                                onChange={value => setSelectedType(value)}
                            >
                                <Option value="đơn_hàng">Đơn Hàng</Option>
                                <Option value="số_lượng">Số Lượng</Option>
                            </Select>
                        </Space>
                    </div>

                    <div className="col-md-6 mb-2">
                        <Space>
                            <span>Khoảng thời gian:</span>
                            <Segmented
                                options={['Ngày', 'Tuần', 'Năm']}
                                value={selectedTime}
                                onChange={value => setSelectedTime(value)}
                            />
                        </Space>
                    </div>
                </div>

                <div style={{width: '100%', height: 400}}>
                    <ResponsiveContainer>
                        <BarChart
                            data={chartData}
                            margin={{top: 20, right: 30, left: 20, bottom: 5}}
                        >
                        <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="label" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey={selectedType} fill="#1890ff">
                                <LabelList dataKey={selectedType} position="top" />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ProductOrderChart;
