import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {GrCaretNext} from "react-icons/gr";
import BlurBillHistoryComponent from "./BlurBillHistoryComponent.jsx";


const StepProgress = ({steps, currentStep, billHistoryList}) => {

    // const billHistoryListUniqueByStatus = Array.from(
    //     billHistoryList?.reduce((map, item) => {
    //         map.set(item.status, item);
    //         return map;
    //     }, new Map()).values()
    // );


    return (
        <div className="d-flex align-items-center justify-content-between">
            {steps.map((step, index) => (
                <div
                    key={step.id}
                    className="text-center position-relative flex-fill"
                    style={{color: index + 1 <= currentStep ? "#0d6efd" : "#adb5bd"}}
                >
                    {/* Biểu tượng và tiêu đề */}
                    <div
                        className={`rounded-circle d-flex justify-content-center align-items-center mx-auto`}
                        style={{
                            width: "80px",
                            height: "80px",
                            backgroundColor: index + 1 <= currentStep ? "#0d6efd" : "#adb5bd",
                            color: "white",
                            fontSize: "24px",
                        }}
                    >
                        {step.icon}
                    </div>


                    <div className="arrow-container">
                        <div
                            style={{
                                width: 1.2,
                                height: 100,
                                backgroundColor: index + 1 <= currentStep ? "#0d6efd" : "#adb5bd",
                            }}
                            className={"position-absolute bottom-50 text-black"}>

                        </div>
                        <div
                            style={{
                                backgroundColor: index + 1 <= currentStep ? "#0d6efd" : "#adb5bd",
                            }}
                            className="arrow">
                            <div className="circle"></div>
                        </div>
                    </div>
                    <div
                        className={"d-flex gap-2 justify-content-center flex-column "}
                        style={{
                            height: 60,
                        }}>
                        <div className=" m-0 fw-bold ">
                            {billHistoryList.length > 0 ? (billHistoryList[index]?.status ??
                                <BlurBillHistoryComponent/>) : <BlurBillHistoryComponent/>
                            }
                        </div>
                        <p className=" fw-bold d-flex flex-column m-0">
                            {billHistoryList.length > 0 ? (billHistoryList[index]?.createdAt ??
                                <BlurBillHistoryComponent/>) : <BlurBillHistoryComponent/>
                            }
                        </p>
                    </div>

                    <div style={{
                        height: 50
                    }}>

                    </div>


                </div>


            ))}
        </div>
    );
};

export default StepProgress