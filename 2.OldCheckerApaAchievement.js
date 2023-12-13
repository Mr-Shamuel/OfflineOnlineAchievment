import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import axiosInstance from "../../../Services/Interceptor";
import { AddProofComment } from "../ApaAchievementCollections/AddProofComment";
import { toast } from "react-toastify";
import AchievementWorkPlanTable from "../ApaAchievementCollections/AchievementWorkPlanTable";
import { getUserInputPreviewWorkPlanTable } from "../../../Redux/Actions/Apamanagement/ApaPreparationByUser/WorkPlanTable/UserInputPreviewWorkPlanTableAction";
import { useDispatch, useSelector } from "react-redux";
import { EditAchievement } from "../ApaAchievementCollections/EditAchievement";
import { ViewProofList } from "../ApaAchievementCollections/ViewProofList";
import { MakerCheckerSubmitCheckPassword } from "../ApaAchievementCollections/MakerCheckerSubmitCheckPassword";
import { ReturnCommentList } from "../ApaAchievementCollections/ReturnCommentList";
import Tokenvalidation from "../../../Authentication/Tokenvalidation";
import { ReturnAchievement } from "../ApaAchievementCollections/ReturnAchievement";
import CheckerRibbon from "../ApaAchievementCollections/CheckerRibbon";
import { ApaAchievementUpdateRequestList } from "../ApaAchievementCollections/ApaAchievementUpdateRequestList";
import { AchievementUpdateRequest } from "../ApaAchievementCollections/AchievementUpdateRequest";
import QuartersWiseTable from "../ApaAchievementCollections/QuartersWiseTable";
import StaticHelpingToolkit from "../../../Common/CommonToolkit/StaticHelpingToolkit";
import { StaticToolkitData } from "../../../Common/CommonToolkit/StaticToolkitData";
import Breadcrumb from "../../../Common/CommonBreadcrumb/Breadcrumb";

import { ConvertToBnNumber, ConvertToEnNumber } from "../../../Common/CommonFunctions/CommonNumberConverter";
import ConvertBnStringToEnString from "../../../Common/CommonFunctions/ConvertBnStringToEnString";
import DatePicker from "react-multi-date-picker";
import dateBangla from "../../../Common/CommonDate/th_bn";
import ConvertEnStringToBnString from "../../../Common/CommonFunctions/ConvertEnStringToBnString";


function CheckerApaAchievement(props) {
    const { permission } = props;
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm();

    const { t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const [showToolkit, setShowToolkit] = useState(false);
    const [filteredData, setFilterData] = useState({});
    const [strObjeList, setStrObjList] = useState([]);
    const [activityList, setActivityList] = useState([]);
    const [indicatorList, setIndicatorList] = useState([]);
    const [indicatorOtherInfoList, setIndicatorOtherInfoList] = useState([]);
    const [disabled, setDisabled] = useState(true);
    const [quartersList, setQuartersList] = useState([]);
    const [createQuartersItem, setCreateQuartersItem] = useState([]);
    const [disabledCmnt, setDisabledCmnt] = useState(true);
    const [show, setShow] = useState(false);
    const [quartersWiseData, setQuartersWiseData] = useState([]);
    const [workplanTableData, setWorkplanTableData] = useState({});
    const [showFullAchievement, setShowFullAchievement] = useState(false);
    const [showQuartersWise, setShowQuartersWise] = useState(false);
    const [defaultAchievementData, setDefaultAchievementData] = useState("");
    const [editAchievementShow, setEditAchievementShow] = useState(false);
    const [proofListShow, setProofListShow] = useState(false);
    const [apaAchievementStatus, setApaAchievementStatus] = useState({});
    const [checkShow, setCheckShow] = useState(false);
    const [submitAchievementData, setSubmitAchievementData] = useState({});

    const [returnCommentShow, setReturnCommentShow] = useState(false);
    const [returnAchievementShow, setReturnAchievementShow] = useState(false);
    const [updateRequestAchievementShow, setupdateRequesAchievementShow] =
        useState(false);
    const [requestListAchievementShow, setRequestListAchievementShow] =
        useState(false);

    const [strObjName, setStrObjName] = useState({});
    const [activityName, setActivityName] = useState({});
    const [indicatorName, setIndicatorName] = useState({});
    const [quarterItem, setQuarterItem] = useState({});

    //bn en state
    const [achievementValue, setAchievementValue] = useState('')

    const { userinputworkplantable } = useSelector(
        (state) => state?.UserInputWorkPlanTableData
    );


    //user
    const [user, setUser] = useState({});
    useEffect(() => {
        axiosInstance
            .get("/core-module/api/v1/user-information/details")
            .then((res) => {
                setUser(res?.data?.data);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }, []);


    useEffect(() => {
        Tokenvalidation();
        axiosInstance
            .get(`/apa-config/api/v1/achivement-info/fy-mw`)
            .then((res) => {
                if (res?.status === 200) {
                    setFilterData(res?.data?.data);
                    setWorkplanTableData({});
                    setQuartersList(res?.data?.data?.quarters);
                }
            })
            .catch((err) => {
                console.log(err, "err");
            });
    }, []);

    let getStrObjList = (postData) => {
        axiosInstance
            .post(`/apa-config/api/v1/achivement-info/strategic-objectives`, postData)
            .then((res) => {
                setStrObjList(res?.data?.data);
            })
            .catch((err) => {
                console.log(err, "err");
            });
    };

    const changeQuarterHandler = (e) => {
        if (e.target.value) {
            setCreateQuartersItem(e.target.value);
            getStrObjList(filteredData);
            const id = quartersList?.find((item) => item?.id == e.target.value);
            setQuarterItem(id);
            setWorkplanTableData([]);
            setQuartersWiseData([]);
            setShowQuartersWise(false);
            setDefaultAchievementData("");
            if (
                indicatorOtherInfoList?.achievementQuarterDetails?.submissionTypeId &&
                indicatorOtherInfoList?.indicatorId
            ) {
                filterTableData(
                    indicatorOtherInfoList?.achievementQuarterDetails?.submissionTypeId,
                    indicatorOtherInfoList?.indicatorId, e.target.value
                );
                achievementStatus(
                    indicatorOtherInfoList?.achievementQuarterDetails?.submissionTypeId,
                    e.target.value
                );
            }
            setValue('achievement', '');
            setAchievementValue('')
        } else {
            setCreateQuartersItem([]);
            setWorkplanTableData([]);
            setQuartersWiseData([]);
            setShowQuartersWise(false);
            setDefaultAchievementData("");
            setValue('achievement', '');
            setAchievementValue('');
        }
    };

    let getActivityList = (id) => {
        axiosInstance
            .get(`/apa-config/api/v1/achivement-info/activities/${id}`)
            .then((res) => {
                setActivityList(res?.data?.data);
            })
            .catch((err) => {
                console.log(err, "err");
            });
    };

    const changeStrObjHandler = (e) => {
        if (e.target.value) {
            getActivityList(e.target.value);
            const strObje = strObjeList?.find(
                (item) => item?.strategicObjectiveId == e.target.value
            );
            setStrObjName(strObje);
            setIndicatorList([]);
            setIndicatorOtherInfoList([]);
            setWorkplanTableData([]);
            setQuartersWiseData([]);
            setShowQuartersWise(false);
            setDisabled(true);
            setDefaultAchievementData("");
            reset();
        } else {
            setIndicatorList([]);
            setIndicatorOtherInfoList([]);
            setWorkplanTableData([]);
            setQuartersWiseData([]);
            setShowQuartersWise(false);
            setDisabled(true);
            setDefaultAchievementData("");
            reset();
        }
    };

    let getIndicatorList = (id) => {
        axiosInstance
            .get(
                `/apa-config/api/v1/achivement-info/indicators/${id}/apa/${filteredData?.apaId}`
            )
            .then((res) => {
                setIndicatorList(res?.data?.data);
            })
            .catch((err) => {
                console.log(err, "err");
            });
    };

    const changeActivityHandler = (e) => {
        if (e.target.value) {
            getIndicatorList(e.target.value);

            const actObje = activityList?.find(
                (item) => item?.activityId == e.target.value
            );
            setActivityName(actObje);
            setIndicatorOtherInfoList([]);
            setWorkplanTableData([]);
            setQuartersWiseData([]);
            setShowQuartersWise(false);
            setDisabled(true);
            setDefaultAchievementData("");
            reset();
        } else {
            setIndicatorList([]);
            setIndicatorOtherInfoList([]);
            setWorkplanTableData([]);
            setQuartersWiseData([]);
            setShowQuartersWise(false);
            setDisabled(true);
            setDefaultAchievementData("");
            reset();
        }
    };

    const filterTableData = (submissionTypeId, indicatorId, qtrId) => {
        if (submissionTypeId) {
            let postAchievement = {
                apaId: filteredData?.apaId,
                submissionTypeId: submissionTypeId,
                quarterId: qtrId ? qtrId : createQuartersItem,
                indicatorId: indicatorId,
            };

            axiosInstance
                .post(
                    `/apa-config/api/v1/achivement-info/indicator-wise-achievement`,
                    postAchievement
                )
                .then((res) => {
                    if (res?.status === 200) {
                        setQuartersWiseData(res?.data?.data);
                        setShowQuartersWise(true);
                    }
                })
                .catch((err) => {
                    console.log(err, "err");
                });
        }
    };

    const achievementStatus = (submissionTypeId, qtrId) => {
        if (submissionTypeId) {
            let postAchievementStatus = {
                apaId: filteredData?.apaId,
                submissionTypeId: submissionTypeId,
                quarterId: qtrId ? qtrId : createQuartersItem,
            };
            axiosInstance
                .post(
                    `/apa-config/api/v1/achivement-info/status`,
                    postAchievementStatus
                )
                .then((res) => {
                    if (res?.data?.data !== undefined) {
                        setApaAchievementStatus(res?.data?.data);
                        setDisabledCmnt(res?.data?.data?.isCheckerSubmissionAllowed === 0);
                    } else {
                        setApaAchievementStatus({});
                        setDisabledCmnt(true);
                    }
                })
                .catch((err) => {
                    console.log(err, "errrrr");
                });
        }
    };

    let getIndicatorOthersInfo = (id) => {
        axiosInstance
            .get(`/apa-config/api/v1/achivement-info/indicator-extras/${id}`)
            .then((res) => {
                if (res?.data?.data?.unitBn !== null) {
                    setIndicatorOtherInfoList(res?.data?.data);
                    setDisabled(false);
                    filterTableData(
                        res?.data?.data?.achievementQuarterDetails?.submissionTypeId,
                        res?.data?.data?.indicatorId
                    );
                    achievementStatus(
                        res?.data?.data?.achievementQuarterDetails?.submissionTypeId,
                        null
                    );
                } else {
                    setIndicatorOtherInfoList([]);
                    setDisabled(true);
                    reset();
                }
            })
            .catch((err) => {
                console.log(err, "err");
            });
    };

    const changeIndicatorHandler = (e) => {
        if (e.target.value) {
            getIndicatorOthersInfo(e.target.value);
            const indiObje = indicatorList?.find(
                (item) => item?.indicatorId == e.target.value
            );
            setIndicatorName(indiObje);
            setWorkplanTableData([]);
            setQuartersWiseData([]);
            setShowQuartersWise(false);
            setDefaultAchievementData("");
            setDisabledCmnt(true);
        } else {
            setIndicatorOtherInfoList([]);
            setWorkplanTableData([]);
            setQuartersWiseData([]);
            setShowQuartersWise(false);
            setDefaultAchievementData("");
            setDisabledCmnt(true);
            reset();
        }
    };

    const openPrfCmt = () => {
        setShow(true);
    };

    // achievement date and time 
    const handleAchievementChange = (e, type) => {
        if (type === 'DATE') {
            const year = e.year;
            const month = e.month.number >= 10 ? e.month.number : `0${e.month.number}`;
            const day = e.day >= 10 ? e.day : `0${e.day}`;
            const startDates = `${year}-${month}-${day}`;
            console.log(startDates, 'x12123')
            setAchievementValue(startDates);

        } else {
            let userInput = e.target.value;
            if (i18n.language === "en") {
                userInput = ConvertToEnNumber(userInput) //en
            } else {
                userInput = ConvertToBnNumber(userInput) //bn
            }
            const isValidInput = /^[0-9০-৯.]+[\b\u2190\u2192]*$/.test(userInput);
            if (isValidInput || userInput === "") {
                setAchievementValue(userInput);
            }
        }
    }


    const progressSubmitHandler = (data) => {
        data.achievement = ConvertBnStringToEnString(achievementValue);
        setDisabledCmnt(true);
        let postData = {
            apaId: filteredData?.apaId,
            indicatorId: indicatorOtherInfoList?.indicatorId,
            submissionTypeId:
                indicatorOtherInfoList?.achievementQuarterDetails?.submissionTypeId,
            quarterId: createQuartersItem,
            achievement: data?.achievement,
        };
        axiosInstance
            .post(`/apa-config/api/v1/achivement/create`, postData)
            .then((res) => {
                if (res?.status === 201) {
                    toast.success("তৈরি করা হয়েছে", {
                        position: toast.POSITION.TOP_RIGHT,
                        hideProgressBar: false,
                        autoClose: 500,
                        theme: "colored",
                    });
                    filterTableData(
                        indicatorOtherInfoList?.achievementQuarterDetails?.submissionTypeId,
                        indicatorOtherInfoList?.indicatorId
                    );
                    reset();
                    setValue('achievement', '');
                    setAchievementValue('');
                    setDisabledCmnt(false);
                }
            })
            .catch((err) => {
                console.log(err, "errrrrr");
            });
    };

    const viewFullAchievement = () => {
        let postWorkplan = {
            structureId: filteredData?.structureId,
            organizationId: filteredData?.organizationId,
            mandatoryWeightId: filteredData?.mandatoryWeightId,
            fiscalYearId: filteredData?.fiscalYearId,
            submissionTypeId:
                indicatorOtherInfoList?.achievementQuarterDetails?.submissionTypeId,
            quarterId: createQuartersItem,
        };
        if (postWorkplan) {
            dispatch(
                getUserInputPreviewWorkPlanTable(
                    filteredData?.workplanTableId,
                    postWorkplan
                )
            );
            Tokenvalidation();
            setShowFullAchievement(true);
        }
    };

    useEffect(() => {
        setWorkplanTableData(userinputworkplantable);
    }, [userinputworkplantable]);

    const submitAchievement = () => {
        let postAchievement = {
            apaId: filteredData?.apaId,
            submissionTypeId:
                indicatorOtherInfoList?.achievementQuarterDetails?.submissionTypeId,
            quarterId: createQuartersItem,
            checkerIsSubmitted: 1,
        };
        setSubmitAchievementData(postAchievement);
        setCheckShow(true);
    };

    const returnAchievement = () => {
        setReturnAchievementShow(true);
    };

    const requestForUpdate = () => {
        setupdateRequesAchievementShow(true);
    };

    const requestList = () => {
        setRequestListAchievementShow(true);
    };

    const toolkitData = {
        title: "অগ্রগতি(পরিবেক্ষণকারী)",
        description:
            "প্রতিটি অফিস কর্তৃক দাখিলকৃত চূড়ান্ত এপিএ-এর উপর প্রতি কোয়ার্টার কিংবা প্রতি মাসে অগ্রগতি দাখিল করতে হবে। মূলতঃ প্রতিটি সূচকে অগ্রগতি দাখিল করতে হবে। অগ্রগতি দাখিলের ক্ষেত্রে প্রমাণক এবং মন্তব্য দেওয়া যাবে। ",
    };
    return (
        <div className="main-container container">
            {/* breadcrumb-start */}
            <Breadcrumb
                toolkit={true}
                toolkitData={toolkitData}
                currentMenu={false}
                mainMenu={"অগ্রগতি"}
                subMenu={"অগ্রগতি(পরিবেক্ষণকারী)"}
                subSubMenu={false}
            />
            {/* breadcrumb-end */}

            <Card>
                <Card.Body>
                    <Row>
                        <Col lg={6} md={6} sm={12} className="">
                            <Form className="card p-3 background-light-info">
                                <Row>
                                    <Col lg={12} md={12} sm={12}>
                                        <Form.Label className="form-label mg-b-10 text-dark">
                                            কোয়ার্টার/মাস
                                            <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select onChange={(e) => changeQuarterHandler(e)}>
                                            <option value="" selected>
                                                {t("CommonBtn.placeholder")}
                                            </option>

                                            {quartersList?.map((qtrItem, strIndx) => (
                                                <option value={qtrItem?.id} key={qtrItem?.id}>
                                                    {qtrItem?.nameBn}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        {errors?.quater?.type === "required" && (
                                            <span
                                                className="text-danger"
                                                style={{ fontSize: "16px" }}
                                            >
                                                {i18n.language === "en"
                                                    ? " Required"
                                                    : "এই তথ্যটি আবশ্যক"}
                                            </span>
                                        )}
                                    </Col>

                                    <Col lg={12} md={12} sm={12}>
                                        <Form.Label className="form-label mg-b-10 text-dark">
                                            {t("workPlanTable.columName1")}
                                            <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select onChange={(e) => changeStrObjHandler(e)}>
                                            <option value="" selected disabled>
                                                {t("CommonBtn.placeholder")}
                                            </option>
                                            {/* for mandatory  */}
                                            <optgroup label="আবশ্যিক কৌশলগত উদ্দেশ্য">
                                                {strObjeList?.map((strItem, strIndx) => (

                                                    (strItem?.isHigherOffice === 1 && <option
                                                        value={strItem?.strategicObjectiveId}
                                                        key={strItem?.strategicObjectiveId}
                                                    >
                                                        {ConvertEnStringToBnString(strItem?.nameBn)}
                                                    </option>)

                                                ))}
                                            </optgroup>


                                            {/* for non Mandatory  */}
                                            <optgroup label={`${user?.hierarchyName} কৌশলগত উদ্দেশ্য`}>
                                                {strObjeList?.map((strItem, strIndx) => (

                                                    (strItem?.isHigherOffice === 0 && <option
                                                        value={strItem?.strategicObjectiveId}
                                                        key={strItem?.strategicObjectiveId}
                                                    >
                                                        {ConvertEnStringToBnString(strItem?.nameBn)}
                                                    </option>)

                                                ))}
                                            </optgroup>
                                        </Form.Select>
                                        {errors?.columnNameBn?.type === "required" && (
                                            <span
                                                className="text-danger"
                                                style={{ fontSize: "16px" }}
                                            >
                                                {i18n.language === "en"
                                                    ? " Required"
                                                    : "এই তথ্যটি আবশ্যক"}
                                            </span>
                                        )}
                                    </Col>

                                    <Col lg={12} md={12} sm={12}>
                                        <Form.Label className="form-label mg-b-10 text-dark">
                                            {t("workPlanTable.columName3")}
                                            <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select onChange={(e) => changeActivityHandler(e)}>
                                            <option value="" selected>
                                                {t("CommonBtn.placeholder")}
                                            </option>

                                            {activityList?.map((actvtyItem, actvtyIndx) => (
                                                <option
                                                    value={actvtyItem?.activityId}
                                                    key={actvtyItem?.activityId}
                                                >
                                                    {ConvertEnStringToBnString(actvtyItem?.nameBn)}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        {errors?.columnNameBn?.type === "required" && (
                                            <span
                                                className="text-danger"
                                                style={{ fontSize: "16px" }}
                                            >
                                                {i18n.language === "en"
                                                    ? " Required"
                                                    : "এই তথ্যটি আবশ্যক"}
                                            </span>
                                        )}
                                    </Col>

                                    <Col lg={12} md={12} sm={12}>
                                        <Form.Label className="form-label mg-b-10 text-dark">
                                            {t("workPlanTable.columName4")}
                                            <span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Select onChange={(e) => changeIndicatorHandler(e)}>
                                            <option value="" selected>
                                                {t("CommonBtn.placeholder")}
                                            </option>
                                            {indicatorList?.map((indiItem, indiIndx) => (
                                                <option
                                                    value={indiItem?.indicatorId}
                                                    key={indiItem?.indicatorId}
                                                >
                                                    {ConvertEnStringToBnString(indiItem?.nameBn)}
                                                </option>
                                            ))}
                                        </Form.Select>
                                        {errors?.columnNameBn?.type === "required" && (
                                            <span
                                                className="text-danger"
                                                style={{ fontSize: "16px" }}
                                            >
                                                {i18n.language === "en"
                                                    ? " Required"
                                                    : "এই তথ্যটি আবশ্যক"}
                                            </span>
                                        )}
                                    </Col>

                                    {quartersWiseData?.achievementStatus && (
                                        <Col lg={12} md={12} sm={12}>
                                            <Form.Label className="form-label mg-b-10 text-dark">
                                                অর্জন সমূহ:
                                            </Form.Label>
                                            <p className="fw-bold text-success">
                                                {quartersWiseData?.achievementStatus
                                                    ? `${quartersWiseData?.achievementStatus} এর অর্জন দেয়া হয়েছে `
                                                    : "অর্জন দেয়া হয়নি "}
                                            </p>
                                        </Col>
                                    )}
                                </Row>
                            </Form>
                        </Col>

                        <Col lg={6} md={6} sm={12}>
                            <Form className="card p-2 background-primary">
                                <Row>
                                    <Col lg={4} md={4} sm={12}>
                                        <Form.Label className="form-label mg-b-10 text-dark">
                                            সূচকের একক
                                            {/* <span className="text-danger">*</span> */}
                                        </Form.Label>
                                        <Form.Control
                                            className="btnReadOnlyColor cursor-not-allowed"
                                            type="text"
                                            placeholder={t("CommonBtn.placeholder2")}
                                            {...register("incator", {
                                                required: false,
                                            })}
                                            value={indicatorOtherInfoList?.unitBn}
                                            disabled
                                        />
                                        {errors?.incator?.type === "required" && (
                                            <span
                                                className="text-danger"
                                                style={{ fontSize: "16px" }}
                                            >
                                                {i18n.language === "en"
                                                    ? " Required"
                                                    : "এই তথ্যটি আবশ্যক"}
                                            </span>
                                        )}
                                    </Col>

                                    <Col lg={4} md={4} sm={12}>
                                        <Form.Label className="form-label mg-b-10 text-dark">
                                            সূচকের মান
                                            {/* <span className="text-danger">*</span> */}
                                        </Form.Label>
                                        <Form.Control
                                            className="btnReadOnlyColor"
                                            type="number"
                                            placeholder={t("CommonBtn.placeholder2")}
                                            {...register("incatorValue", {
                                                required: false,
                                            })}
                                            value={indicatorOtherInfoList?.weightOfIndicator}
                                            disabled
                                        />
                                        {errors?.incatorValue?.type === "required" && (
                                            <span
                                                className="text-danger"
                                                style={{ fontSize: "16px" }}
                                            >
                                                {i18n.language === "en"
                                                    ? " Required"
                                                    : "এই তথ্যটি আবশ্যক"}
                                            </span>
                                        )}
                                    </Col>

                                    <Col lg={4} md={4} sm={12}>
                                        <Form.Label className="form-label mg-b-10 text-dark">
                                            গণনা পদ্ধতি
                                            {/* <span className="text-danger">*</span> */}
                                        </Form.Label>
                                        <Form.Control
                                            className="btnReadOnlyColor"
                                            type="text"
                                            placeholder={t("CommonBtn.placeholder2")}
                                            {...register("calculation", {
                                                required: false,
                                            })}
                                            value={indicatorOtherInfoList?.calculationMethod}
                                            disabled
                                        />
                                        {errors?.calculation?.type === "required" && (
                                            <span
                                                className="text-danger"
                                                style={{ fontSize: "16px" }}
                                            >
                                                {i18n.language === "en"
                                                    ? " Required"
                                                    : "এই তথ্যটি আবশ্যক"}
                                            </span>
                                        )}
                                    </Col>
                                    {indicatorOtherInfoList?.targets && (
                                        <Col lg={12} md={12} sm={12}>
                                            <Form.Label className="form-label fw-bold mb-0 text-dark">
                                                লক্ষ্যমাত্রা
                                            </Form.Label>
                                            <hr className="m-0" />
                                        </Col>
                                    )}
                                    {indicatorOtherInfoList?.targets?.map(
                                        (trgtsItem, tarIndx) => (
                                            <Col lg={4} md={4} sm={12} key={trgtsItem?.target_id}>
                                                <Form.Label className="form-label mg-b-10 text-dark">
                                                    {trgtsItem?.column_name_bn}
                                                    {/* <span className="text-danger">*</span> */}
                                                </Form.Label>

                                                <Form.Control
                                                    className="btnReadOnlyColor"
                                                    type={
                                                        indicatorOtherInfoList?.calculationMethod ===
                                                            "তারিখ"
                                                            ? "date"
                                                            : "number"
                                                    }
                                                    placeholder={t("CommonBtn.placeholder2")}
                                                    {...register(`${trgtsItem?.column_name_en}`, {
                                                        required: false,
                                                    })}
                                                    value={trgtsItem?.user_input_txt}
                                                    disabled
                                                />
                                                {errors?.[trgtsItem?.column_name_en]?.type ===
                                                    "required" && (
                                                        <span
                                                            className="text-danger"
                                                            style={{ fontSize: "16px" }}
                                                        >
                                                            {i18n.language === "en"
                                                                ? " Required"
                                                                : "এই তথ্যটি আবশ্যক"}
                                                        </span>
                                                    )}
                                            </Col>
                                        )
                                    )}
                                </Row>
                            </Form>

                            <Form className="card p-2 background-light-info">
                                <Row className="d-flex align-items-end">
                                    <Col lg={4} md={4} sm={12} className="mb-1">
                                        <Form.Label className="form-label mg-b-10 text-dark">
                                            অর্জন
                                            <span className="text-danger">*</span>
                                        </Form.Label>
                                        {/* <Form.Control
                      className="btnReadOnlyColor"
                      style={{ height: "48px" }}
                      type={
                         
                          ? "date"
                          : "number"
                      }
                      disabled={disabledCmnt}
                      placeholder={t("CommonBtn.placeholder2")}
                      {...register("achievement", {
                        required: false,
                      })}
                    /> */}


                                        {
                                            indicatorOtherInfoList?.calculationMethod === "তারিখ" ?

                                                (

                                                    <DatePicker
                                                        selected={achievementValue}
                                                        value={achievementValue}
                                                        onChange={(e) => handleAchievementChange(e, 'DATE')}

                                                        name="achievement"
                                                        locale={i18n.language === "en" ? undefined : dateBangla}
                                                        dateFormat="yyyy-MM-dd"
                                                        style={{ height: "42px", width: "200%" }}
                                                        placeholder={i18n.language === "en" ? 'YYYY-MM-DD' : 'বছর/মাস/দিন'}
                                                    />

                                                )
                                                :
                                                (<Form.Control
                                                    className="btnReadOnlyColor"
                                                    style={{ height: "46px" }}

                                                    type="text"
                                                    {...register("achievement", {
                                                        required: false,
                                                    })}
                                                    disabled={disabledCmnt}
                                                    value={achievementValue}
                                                    control
                                                    onChange={(e) => handleAchievementChange(e, 'NUMBER')}
                                                    placeholder={t("CommonBtn.placeholder2")}


                                                />)
                                        }
                                        {errors?.achievement?.type === "required" && (
                                            <span
                                                className="text-danger"
                                                style={{ fontSize: "16px" }}
                                            >
                                                {i18n.language === "en"
                                                    ? " Required"
                                                    : "এই তথ্যটি আবশ্যক"}
                                            </span>
                                        )}
                                    </Col>
                                    <Col lg={4} md={4} sm={12} className="mb-1">
                                        <Button
                                            variant="none"
                                            className="btn btn-primary w-100"
                                            type="submit"
                                            onClick={handleSubmit(progressSubmitHandler)}
                                            disabled={disabledCmnt}
                                        >
                                            {" "}
                                            অর্জন দিন
                                        </Button>
                                    </Col>

                                    <Col lg={4} md={4} sm={12} className="mb-1">
                                        <Button
                                            disabled={disabledCmnt}
                                            onClick={() => openPrfCmt()}
                                            variant="none"
                                            className="btn btn-info w-100"
                                        >
                                            প্রমাণক/মন্তব্য দিন
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Card>
                {showQuartersWise && (
                    <>
                        <Card.Body className="pb-2">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="fw-bold text-dark">
                                    পূর্বের প্রদানকৃত অর্জন সমূহ
                                </div>
                                <div className="d-flex justify-content-end align-items-center gap-1">
                                    {disabledCmnt ? (
                                        <Button className="btn btn-sm btn-danger">
                                            ফেরত পাঠানো হয়েছে
                                        </Button>
                                    ) : (
                                        <Button
                                            disabled={disabledCmnt}
                                            className="btn btn-sm btn-danger"
                                            onClick={() => returnAchievement()}
                                        >
                                            ফেরত পাঠান
                                        </Button>
                                    )}

                                    <Button
                                        variant="none"
                                        className="btn btn-sm btn-info"
                                        onClick={() => viewFullAchievement()}
                                    >
                                        সম্পূর্ণ অগ্রগতি প্রতিবেদন
                                    </Button>

                                    <Button
                                        disabled={disabledCmnt}
                                        className="btn btn-sm btn-success text-light"
                                        onClick={() => submitAchievement()}
                                    >
                                        অগ্রগতি দাখিল করুন
                                    </Button>
                                </div>
                            </div>
                        </Card.Body>

                        <Card.Body className="pb-2">
                            <div className="d-flex justify-content-center align-items-center gap-1">
                                <CheckerRibbon
                                    apaAchievementStatus={apaAchievementStatus}
                                    disabledCmnt={disabledCmnt}
                                    setReturnCommentShow={setReturnCommentShow}
                                    requestForUpdate={requestForUpdate}
                                    requestList={requestList}
                                />
                            </div>
                        </Card.Body>
                    </>
                )}

                <Card.Body>
                    {showQuartersWise ? (
                        <QuartersWiseTable
                            quartersWiseData={quartersWiseData}
                            setProofListShow={setProofListShow}
                            setQuarterItem={setQuarterItem}
                        />
                    ) : (
                        <div>
                            <ul style={{ color: "#3C21F7" }}>
                                <li className="text-size-20 py-2">
                                    পূর্বের প্রদানকৃত অর্জন সমূহের ডাটা দেখার জন্য অনুগ্রহপূর্বক
                                    ফিল্টার ব্যবহার করুন।
                                </li>
                            </ul>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {showFullAchievement && (
                <AchievementWorkPlanTable
                    userinputworkplantable={workplanTableData}
                    showFullAchievement={showFullAchievement}
                    setShowFullAchievement={setShowFullAchievement}
                    setProofListShow={setProofListShow}
                    setDefaultAchievementData={setDefaultAchievementData}
                    setEditAchievementShow={setEditAchievementShow}
                    disabled={disabledCmnt}
                    setStrObjName={setStrObjName}
                    setActivityName={setActivityName}
                    setIndicatorName={setIndicatorName}
                    setQuarterItem={setQuarterItem}
                    filteredData={filteredData}
                    submissionTypeId={
                        indicatorOtherInfoList?.achievementQuarterDetails?.submissionTypeId
                    }
                    quaterId={createQuartersItem}
                />
            )}

            {show && (
                <AddProofComment
                    show={show}
                    setShow={setShow}
                    filteredData={filteredData}
                    indicatorOtherInfoList={indicatorOtherInfoList}
                    quartersList={quartersList}
                    quartersItem={createQuartersItem}
                />
            )}

            {proofListShow && (
                <ViewProofList
                    proofListShow={proofListShow}
                    setProofListShow={setProofListShow}
                    filteredData={filteredData}
                    indicatorOtherInfoList={indicatorOtherInfoList}
                    strObjName={strObjName}
                    activityName={activityName}
                    indicatorName={indicatorName}
                    quarterItem={quarterItem}
                    quartersList={quartersList}
                    disabled={disabledCmnt}
                />
            )}

            {editAchievementShow && (
                <EditAchievement
                    editAchievementShow={editAchievementShow}
                    setEditAchievementShow={setEditAchievementShow}
                    filteredData={filteredData}
                    indicatorOtherInfoList={indicatorOtherInfoList}
                    quartersList={quartersList}
                    defaultAchievementData={defaultAchievementData}
                    filterTableData={filterTableData}
                    strObjName={strObjName}
                    activityName={activityName}
                    indicatorName={indicatorName}
                    quarterItem={quarterItem}
                />
            )}

            {checkShow && (
                <MakerCheckerSubmitCheckPassword
                    setCheckShow={setCheckShow}
                    checkShow={checkShow}
                    submitAchievementData={submitAchievementData}
                    achievementStatus={achievementStatus}
                />
            )}
            {returnCommentShow && (
                <ReturnCommentList
                    returnCommentShow={returnCommentShow}
                    setReturnCommentShow={setReturnCommentShow}
                    apaAchievementStatus={apaAchievementStatus}
                />
            )}

            {returnAchievementShow && (
                <ReturnAchievement
                    setReturnAchievementShow={setReturnAchievementShow}
                    returnAchievementShow={returnAchievementShow}
                    filteredData={filteredData}
                    indicatorOtherInfoList={indicatorOtherInfoList}
                    quarterItem={createQuartersItem}
                    achievementStatus={achievementStatus}
                />
            )}
            {updateRequestAchievementShow && (
                <AchievementUpdateRequest
                    updateRequestAchievementShow={updateRequestAchievementShow}
                    setupdateRequesAchievementShow={setupdateRequesAchievementShow}
                    apaAchievementStatus={apaAchievementStatus}
                />
            )}

            {requestListAchievementShow && (
                <ApaAchievementUpdateRequestList
                    requestListAchievementShow={requestListAchievementShow}
                    setRequestListAchievementShow={setRequestListAchievementShow}
                    filteredData={filteredData}
                />
            )}

            {showToolkit && (
                <StaticHelpingToolkit
                    showToolkit={showToolkit}
                    setShowToolkit={setShowToolkit}
                    toolkitData={StaticToolkitData?.makerCheckerAchievement}
                />
            )}
        </div>
    );
}

export default CheckerApaAchievement;
