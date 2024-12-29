import React from 'react';
import {Card} from "antd";
import CardStatical from "./componets/CardStatical.jsx";
import ChartComponent from "./componets/ChartComponent.jsx";
import ChartStatusBill from "./componets/ChartStatusBill.jsx";

const Statistical = () => {
    return (
        <div className={"d-flex gap-3 flex-column"}>
            <div className={"d-flex justify-content-around gap-3"}>
                <CardStatical title={"Doanh thu hôm nay"} content={"2903820223 đ"}/>
                <CardStatical title={"Doanh thu tuần này"} content={"2903820223 đ"}/>
                <CardStatical title={"Doanh thu tháng này"} content={"2903820223 đ"}/>
            </div>
            <ChartComponent/>
            <div className={"d-flex justify-content-center gap-3"}>
                <CardStatical title={"Top bán chạy trong tháng"} content={"2903820223 đ"}/>
                <ChartStatusBill/>
            </div>

        </div>
    );
};

export default Statistical;