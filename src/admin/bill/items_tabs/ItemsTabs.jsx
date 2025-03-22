import {Badge} from "antd";
import React, { useEffect, useState } from 'react';

export
    const itemsTabsBillList = (billCounts) =>  {

        return [
            {
                key: "all",
                label: (
                    <Badge count={billCounts?.TONG_CONG || 0} 
                    offset={[12, -5]}     
                    style={{ 
                        backgroundColor: "#f5222d", 
                        fontSize: "12px",  // Kích thước chữ bên trong
                        height: "20px",     // Chiều cao ô màu đỏ
                        width: "20px",      // Chiều rộng ô màu đỏ
                        minWidth: "10px",   // Đảm bảo badge không bị thu nhỏ quá mức
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%", // Bo tròn hoàn toàn
                        padding: "4px"   ,    // Khoảng cách giữa chữ và viền badge
                        background:"orange",
                        border:"1px solid white"
                    }}                       
                       
                       >

                        <span style={{ fontSize: "14px" }}>Tất cả</span>
                    </Badge>
                ),
            },
            {
                key: "CHO_XAC_NHAN",
                label: (
                    <Badge count={billCounts?.CHO_XAC_NHAN || 0} 
                    offset={[12, -5]}     
                    style={{ 
                        backgroundColor: "#f5222d", 
                        fontSize: "12px",  // Kích thước chữ bên trong
                        height: "20px",     // Chiều cao ô màu đỏ
                        width: "20px",      // Chiều rộng ô màu đỏ
                        minWidth: "10px",   // Đảm bảo badge không bị thu nhỏ quá mức
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%", // Bo tròn hoàn toàn
                        padding: "4px"   ,    // Khoảng cách giữa chữ và viền badge
                        background:"orange",
                        border:"1px solid white"
                    }}                        
                    
                    >
                        <span style={{ fontSize: "14px"}}>Chờ xác nhận</span>
                    </Badge>
                ),
            },
            {
                key: "DA_XAC_NHAN",
                label: (
                    <Badge count={billCounts?.DA_XAC_NHAN || 0} 
                    offset={[12, -5]}     
                    style={{ 
                        backgroundColor: "#f5222d", 
                        fontSize: "12px",  // Kích thước chữ bên trong
                        height: "20px",     // Chiều cao ô màu đỏ
                        width: "20px",      // Chiều rộng ô màu đỏ
                        minWidth: "10px",   // Đảm bảo badge không bị thu nhỏ quá mức
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%", // Bo tròn hoàn toàn
                        padding: "4px"   ,    // Khoảng cách giữa chữ và viền badge
                        background:"orange",
                        border:"1px solid white"
                    }}                        
                    >
                        <span style={{ fontSize: "14px" }}>Đã xác nhận</span>
                    </Badge>
                ),
            },
            {
                key: "CHO_VAN_CHUYEN",
                label: (
                    <Badge count={billCounts?.CHO_VAN_CHUYEN || 0}
                    offset={[12, -5]}     
                    style={{ 
                        backgroundColor: "#f5222d", 
                        fontSize: "12px",  // Kích thước chữ bên trong
                        height: "20px",     // Chiều cao ô màu đỏ
                        width: "20px",      // Chiều rộng ô màu đỏ
                        minWidth: "10px",   // Đảm bảo badge không bị thu nhỏ quá mức
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%", // Bo tròn hoàn toàn
                        padding: "4px"   ,    // Khoảng cách giữa chữ và viền badge
                        background:"orange",
                        border:"1px solid white"
                    }}                        
                    
                    >
                        <span style={{ fontSize: "14px" }}>Chờ vận chuyển</span>
                    </Badge>
                ),
            },
            {
                key: "DANG_VAN_CHUYEN",
                label: (
                    <Badge count={billCounts?.DANG_VAN_CHUYEN || 0} 
                    
                    offset={[12, -5]}     
                    style={{ 
                        backgroundColor: "#f5222d", 
                        fontSize: "12px",  // Kích thước chữ bên trong
                        height: "20px",     // Chiều cao ô màu đỏ
                        width: "20px",      // Chiều rộng ô màu đỏ
                        minWidth: "10px",   // Đảm bảo badge không bị thu nhỏ quá mức
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%", // Bo tròn hoàn toàn
                        padding: "4px"   ,    // Khoảng cách giữa chữ và viền badge
                        background:"orange",
                        border:"1px solid white"
                    }}                        
                    
                    >
                        <span style={{ fontSize: "14px"}}>Đang vận chuyển</span>
                    </Badge>
                ),
            },
            {
                key: "DA_THANH_TOAN",
                label: (
                    <Badge count={billCounts?.DA_THANH_TOAN || 0} 
                    
                    
                    offset={[12, -5]}     
                    style={{ 
                        backgroundColor: "#f5222d", 
                        fontSize: "12px",  // Kích thước chữ bên trong
                        height: "20px",     // Chiều cao ô màu đỏ
                        width: "20px",      // Chiều rộng ô màu đỏ
                        minWidth: "10px",   // Đảm bảo badge không bị thu nhỏ quá mức
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%", // Bo tròn hoàn toàn
                        padding: "4px"   ,    // Khoảng cách giữa chữ và viền badge
                        background:"orange",
                        border:"1px solid white"
                    }}                        
                    >
                        <span style={{ fontSize: "14px" }}>Đã thanh toán</span>
                    </Badge>
                ),
            },
            {
                key: "DA_HOAN_THANH",
                label: (
                    <Badge count={billCounts?.DA_HOAN_THANH || 0} 
                    
                    offset={[12, -5]}     
                    style={{ 
                        backgroundColor: "#f5222d", 
                        fontSize: "12px",  // Kích thước chữ bên trong
                        height: "20px",     // Chiều cao ô màu đỏ
                        width: "20px",      // Chiều rộng ô màu đỏ
                        minWidth: "10px",   // Đảm bảo badge không bị thu nhỏ quá mức
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%", // Bo tròn hoàn toàn
                        padding: "4px"   ,    // Khoảng cách giữa chữ và viền badge
                        background:"orange",
                        border:"1px solid white"
                    }}                        
                    
                    >
                        <span style={{ fontSize: "14px"}}>Đã hoàn thành</span>
                    </Badge>
                ),
            },
            {
                key: "DA_HUY",
                label: (
                    <Badge count={billCounts?.DA_HUY || 0}
                    
                    offset={[12, -5]}     
                    style={{ 
                        backgroundColor: "#f5222d", 
                        fontSize: "12px",  // Kích thước chữ bên trong
                        height: "20px",     // Chiều cao ô màu đỏ
                        width: "20px",      // Chiều rộng ô màu đỏ
                        minWidth: "10px",   // Đảm bảo badge không bị thu nhỏ quá mức
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%", // Bo tròn hoàn toàn
                        padding: "4px"   ,    // Khoảng cách giữa chữ và viền badge
                        background:"orange",
                        border:"1px solid white"
                    }}                        
                    >
                        <span style={{ fontSize: "14px"}}>Đã hủy</span>
                    </Badge>
                ),
            },
        ];
    };
    