import React from 'react';
import {Card} from "antd";

const CardStatical = ({
    title, content
                      }) => {
    return (
        <Card title={<span className={"h4"} style={{color: 'blue'}}>{title}</span>}
              className={"w-100  text-center"}>
            <p className={"h5"}>{content}</p>
        </Card>
    );
};

export default CardStatical;