import React, {useEffect, useState} from 'react';
import {Card} from "antd";
import CardStatical from "./componets/CardStatical.jsx";
import ChartComponent from "./componets/ChartComponent.jsx";
import ChartStatusBill from "./componets/ChartStatusBill.jsx";
import useWebSocket from "../../websocket/useWebSocket.jsx";
import webSocketService from "../../websocket/WebSocketService.js";
import { Client } from "@stomp/stompjs";
const Statistical = () => {

    const [message, setMessage] = useState("");
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const stompClient = new Client({
            brokerURL: "ws://localhost:8080/ws",
            connectHeaders: {
                login: "guest",
                passcode: "guest",
            },
            debug: (str) => {
                console.log(  );
            },
            reconnectDelay: 5000, // Thử kết nối lại sau 5 giây nếu thất bại
        });

        stompClient.onConnect = () => {
            console.log("Kết nối WebSocket thành công!");
            stompClient.subscribe("/topic/product-updates", (message) => {
                const updatedProduct = JSON.parse(message.body);
                console.log("Sản phẩm cập nhật:", updatedProduct);
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product.id === updatedProduct.id ? updatedProduct : product
                    )
                );
            });
        };

        stompClient.onStompError = (frame) => {
            console.log("Lỗi WebSocket:", frame);
        };
        stompClient.activate();
        return () => {
            stompClient.deactivate();
        };
    }, []);



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