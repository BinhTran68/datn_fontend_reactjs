import {Badge} from "antd";
import React from "react";

export
    const itemsTabsBillList = () =>  {
   return  [
        {
            key: 'all',
            label: "Tất cả"

        },
        {
            key: 'CHO_XAC_NHAN',
            label: (
                <>
                    Chờ xác nhận <Badge count={5} className={"mb-3 ms-1"}/>
                </>
            ),

        },
        {
            key: 'DA_XAC_NHAN',

            label: (
                <>
                    Đã xác nhận <Badge count={5} className={"mb-3 ms-1"}/>
                </>
            ),
        },
        {
            key: 'CHO_VAN_CHUYEN',
            label: (
                <>
                    Chờ vận chuyển <Badge count={5} className={"mb-3 ms-1"}/>
                </>
            ),
        },
        {
            key: 'DANG_VAN_CHUYEN',
            label: (
                <>
                    Đang vận chuyển <Badge count={5} className={"mb-3 ms-1"}/>
                </>
            ),
        },
        {
            key: 'DA_THANH_TOAN',
            label: (
                <>
                    Đã thanh toán <Badge count={5} className={"mb-3 ms-1"}/>
                </>
            ),
        },
        {
            key: 'DA_HOAN_THANH',
            label: (
                <>
                    Đã hoàn thành <Badge count={5} className={"mb-3 ms-1"}/>
                </>
            ),
        },
        {
            key: 'DA_HUY',
            label: (
                <>
                    Đã hủy <Badge count={5} className={"mb-3 ms-1"}/>
                </>
            ),
        }
    ];
}