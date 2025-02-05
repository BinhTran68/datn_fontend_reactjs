import React from 'react';
import {Button} from "antd";
import {COLORS} from "../../../constants/constants..js";
import {convertBillStatusToString} from "../../../helpers/Helpers.js";

const BillTypeComponent = ({
    status, text
                         }) => {
    return (
        <div>
            <Button

                disabled
                style={{
                    borderRadius: '20px',
                    padding: '6px 12px',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    backgroundColor: status === 'ONLINE' ? `${COLORS.success}` : `${COLORS.error}`,
                    color: 'white'
                }}
            >
                {text}
            </Button>

        </div>
    );
};

export default BillTypeComponent;