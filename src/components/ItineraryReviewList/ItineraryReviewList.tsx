import { Row, Col, Tag, Alert, QRCode, Divider, Typography } from "antd";
import "./ItineraryReviewList.scss";
import { FdFlightDestinationDotIcon, FlightRouteRe } from "../Icons/Icons";
import { useState } from "react";
import { useAppSelector } from "@/hooks/App.hook";
import { t } from "i18next";
import { sessionStorageAccessor } from "@/utils/browserStorage";
import React from "react";
import { getDynamicDate } from "@/utils/general";
import { useResize } from "@/utils/resize";
const Text = Typography.Text;

const ItineraryReviewList = (props: any) => {
  const { isSmallScreen } = useResize(1199);
  // eslint-disable-next-line
  const [text, _setText] = useState("https://reschedule.grouprm.net/");
  // const { activePNR } = useAppSelector((state) => state.PNRReducer);
  const [ SgetFinalViewPnrData ] = sessionStorageAccessor<any>("finalViewPNRData");
  const SfinalViewPnrData = SgetFinalViewPnrData();
  const [ SgetSearchFlightPNRData ] = sessionStorageAccessor<any>("searchFlightPNRData");
  const SsearchFlightPNRData = SgetSearchFlightPNRData();
  const [ SgetFinalReviewPnrData ] = sessionStorageAccessor<any>("finalReviewPNRData");
  const SfinalReviewPnrData = SgetFinalReviewPnrData();
  var activePNR:any = props?.isConfirmpage 
                        ? SfinalReviewPnrData 
                          ? SfinalReviewPnrData 
                          : props?.finalReviewPNRData || []
                        : SsearchFlightPNRData 
                          ? SsearchFlightPNRData 
                          : SfinalViewPnrData 
                            ? SfinalViewPnrData 
                            : props?.finalViewPNRData || [];

  console.log(activePNR, props.isConfirmpage)
  const { reviewStatus } = useAppSelector((state) => state.ReviewFlightReducer);
  const [SgetReviewStatus] = sessionStorageAccessor<string>("reviewStatus");
  const SreviewStatus = SgetReviewStatus();
  const reviewOption = 
    !reviewStatus 
      ? SreviewStatus 
      : props?.reviewStatus ? props.reviewStatus
                           : reviewStatus;
  const [SgetSelectedFlights] = sessionStorageAccessor<any>("selectedFlights");
  const SselectedFlights = SgetSelectedFlights();
  const selectedFlightData = 
    SselectedFlights 
      ? SselectedFlights 
      : props?.selectedFlightData 
        ? props?.selectedFlightData
        : [];
  const flightSpacing = "--";
  const allFlightChanged = selectedFlightData.length ? activePNR?.[0]?.rebookOptionalFlightDetails?.length === selectedFlightData?.length : false;

  console.log(activePNR?.[0]?.rebookOptionalFlightDetails);
  

  return (
    <div data-testid="ItineraryReviewList" className="cls-itineraryReviewList">
      {reviewOption !== "Custom" && !props?.isConfirmpage ? (
        <div
          className={`cls-review-list cls-${reviewOption?.toLowerCase()}-border`}
        >
          <Row justify="start" className="cls-statusRow">
            <Text className={`cls-${reviewOption?.toLowerCase()}-span`}>
              {reviewOption === "Accept"
                ? "Accepted"
                : reviewOption === "Modify"
                  ? "Modified"
                  : reviewOption === "Cancel"
                    ? "Cancelled"
                    : ""}
            </Text>
          </Row>
          {
            (reviewOption === "Accept" || reviewOption === "Cancel") ?
            activePNR?.[0]?.rebookOptionalFlightDetails?.map((data: any, mainIndex:number) =>
                data?.flightDetails?.map((item: any, index: number) =>
                  <React.Fragment key={reviewOption + reviewOption + mainIndex + index}>
                    {index === 0 ? (
                      <Text className="d-iblock pt-10 ml-20 p-clr cls-trip">
                        Trip {data.trip}
                      </Text>
                    ) : null}
                    <Row
                      style={{ padding: "5px 0px 15px" }}
                      justify="space-between"
                      className={`ml-20 mr-30 ${data.flightDetails.length === index + 1 && activePNR?.[0]?.rebookOptionalFlightDetails?.length !== mainIndex+1 ? "bordered-row" : ""}`}
                    >
                      <Col xs={24} md={24} lg={4} xl={4} className={`res-only cls-depDate fs-13 f-reg d-iblock h-24`}>
                        {getDynamicDate(item?.departDate) as string}
                      </Col>
                      <Col xs={6} xl={4} className={`${isSmallScreen ? "fs-12 f-med" : "f-sbold"} py-10 text-ellipsis`} title={item?.flightNumber}>
                        {item?.flightNumber}
                      </Col>
                      <Col xs={4} xl={5}>
                        <Text className={`${isSmallScreen ? "fs-14" : "fs-16"} f-sbold d-block`}>
                          {item?.originAirportCode} 
                          <Text className={`${isSmallScreen ? "fs-12 d-block" : "fs-16 d-iblock pl-5"} f-sbold`}>{item?.depart}</Text>
                        </Text>
                        <Text className="fs-13 hide-res-only">{getDynamicDate(item?.departDate) as string}</Text>
                      </Col>
                      <Col xs={9} xl={5} className="fs-13 cls-lightgray py-10">
                        <Row className="cls-flight-route-container">
                          <Col className="cls-flight-duration">
                            <FlightRouteRe />
                          </Col>
                          <Text className="cls-travel-point">
                            {flightSpacing}
                          </Text>
                          <Col className={`cls-flight-duration ${isSmallScreen ? "fs-11" : "fs-12"}`}>
                            {item?.duration}
                          </Col>
                          <Text className="cls-travel-point">
                            {flightSpacing}
                          </Text>
                          <Col>
                            <FdFlightDestinationDotIcon />
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={5} xl={5} className={`${isSmallScreen ? "text-right" : ""}`}>
                        <Text className={`${isSmallScreen ? "fs-14" : "fs-16"} f-sbold d-block`}>
                          {item?.destinationAirportCode}
                          <Text className={`${isSmallScreen ? "fs-12 d-block" : "fs-16 d-iblock pl-5"} f-sbold`}>{item?.arrival}</Text>
                        </Text>
                        <Text className="fs-13 hide-res-only">{getDynamicDate(item?.arrivalDate) as string}</Text>
                      </Col>
                      <Col xs={24} xl={5} className="py-10 text-left cls-disruptionStatus">
                        <Tag
                          color={
                            item?.statusCode === "HK"
                              ? "var(--ant-color-success-text-active)"
                              : item.statusCode === "SC"
                                ? "var(--t-primary)"
                                : item.statusCode === "WK"
                                  ? "var(--ant-color-error-text-active)"
                                  : "var(--t-orange-dark)"
                          }
                          className="mr-0"
                        >
                          {item?.status} ({item.statusCode})
                        </Tag>
                      </Col>
                    </Row>
                    {data.flightDetails.length !== index + 1 &&
                    data.stops !== "" ? (
                      <Row className="text-center">
                        <span className="d-block cls-stop">
                          {data?.stops} stop(s) -{" "}
                          {data?.stopDetails[index]?.airportName} (
                          {data?.stopDetails[index]?.airportCode}){" - "}
                          {data?.stopDetails[index]?.stopOverTime}
                        </span>
                      </Row>
                    ) : null}
                  </React.Fragment>
                )
            ) : <></>
          }
          {
            !allFlightChanged && reviewOption === "Modify" ?
            activePNR?.[0]?.rebookOptionalFlightDetails?.map((data: any, mainIndex: number) =>
                data?.flightDetails?.map((item: any, index: number) =>
                  item?.statusCode === "HK" ? (
                    <React.Fragment key={reviewOption + mainIndex + index}>
                      {index === 0 ? (
                        <Text className="d-iblock pt-10 ml-20 p-clr cls-trip">
                          Trip {data.trip}
                        </Text>
                      ) : null}
                      <Row
                        style={{ padding: "5px 0px 15px" }}
                        justify="space-between"
                        className={`ml-20 mr-30 ${data.flightDetails.length === index + 1 && activePNR?.[0]?.rebookOptionalFlightDetails?.length !== mainIndex+1 ? "bordered-row" : ""}`}
                      >
                        <Col xs={24} md={24} lg={4} xl={4} className={`res-only cls-depDate fs-13 f-reg d-iblock h-24`}>
                          {getDynamicDate(item?.departDate) as string}
                        </Col>
                        <Col xs={6} xl={4} className={`${isSmallScreen ? "fs-12 f-med" : "f-sbold"} py-10 text-ellipsis`} title={item?.flightNumber}>
                          {item?.flightNumber}
                        </Col>
                        <Col xs={4} xl={5}>
                          <Text className={`${isSmallScreen ? "fs-14" : "fs-16"} f-sbold d-block`}>
                            {item?.originAirportCode} 
                            <Text className={`${isSmallScreen ? "fs-12 d-block" : "fs-16 d-iblock pl-5"} f-sbold`}>{item?.depart}</Text>
                          </Text>
                          <Text className="fs-13 hide-res-only">{getDynamicDate(item?.departDate) as string}</Text>
                        </Col>
                        <Col xs={9} xl={5} className="fs-13 cls-lightgray py-10">
                          <Row className="cls-flight-route-container">
                            <Col className="cls-flight-duration">
                              <FlightRouteRe />
                            </Col>
                            <Text className="cls-travel-point">
                              {flightSpacing}
                            </Text>
                            <Col className={`cls-flight-duration ${isSmallScreen ? "fs-11" : "fs-12"}`}>
                              {item?.duration}
                            </Col>
                            <Text className="cls-travel-point">
                              {flightSpacing}
                            </Text>
                            <Col>
                              <FdFlightDestinationDotIcon />
                            </Col>
                          </Row>
                        </Col>
                        <Col xs={5} xl={5} className={`${isSmallScreen ? "text-right" : ""}`}>
                          <Text className={`${isSmallScreen ? "fs-14" : "fs-16"} f-sbold d-block`}>
                            {item?.destinationAirportCode}
                            <Text className={`${isSmallScreen ? "fs-12 d-block" : "fs-16 d-iblock pl-5"} f-sbold`}>{item?.arrival}</Text>
                          </Text>
                          <Text className="fs-13 hide-res-only">{getDynamicDate(item?.arrivalDate) as string}</Text>
                        </Col>
                        <Col xs={24} xl={5} className="py-10 text-left cls-disruptionStatus">
                          <Tag
                            color={
                              item?.statusCode === "HK"
                                ? "var(--ant-color-success-text-active)"
                                : item.statusCode === "SC"
                                  ? "var(--t-primary)"
                                  : item.statusCode === "WK"
                                    ? "var(--ant-color-error-text-active)"
                                    : "var(--t-orange-dark)"
                            }
                            className="mr-0"
                          >
                            {item?.status} ({item.statusCode})
                          </Tag>
                        </Col>
                      </Row>
                      {data.flightDetails.length !== index + 1 &&
                      data.stops !== "" ? (
                        <Row className="text-center">
                          <span className="d-block cls-stop">
                            {data?.stops} stop(s) -{" "}
                            {data?.stopDetails[index]?.airportName} (
                            {data?.stopDetails[index]?.airportCode}){" - "}
                            {data?.stopDetails[index]?.stopOverTime}
                          </span>
                        </Row>
                      ) : null}
                    </React.Fragment>
                  ) : <></>
                )
            ) : <></>
          }
          {
            selectedFlightData?.length ? selectedFlightData?.map((data: any, flightIndex: number) => (
                <React.Fragment key={"CustomSelect"+flightIndex}>
                    { data?.viaFlightDetails?.map(
                      (item: any, index: number) => (
                        <React.Fragment key={reviewOption + flightIndex + index}>
                          {index === 0 ? (
                            <Text className="d-iblock pt-10 ml-20 p-clr cls-trip">
                              Trip {data.trip}
                            </Text>
                          ) : (
                            <></>
                          )}
                          <Row
                            style={{ padding: "5px 0px 15px" }}
                            justify="space-between"
                            className={`ml-20 mr-30 ${data.viaFlightDetails.length === index + 1 && selectedFlightData?.length !== flightIndex+1 ? "bordered-row" : ""}`}
                          >
                            <Col xs={24} md={24} lg={4} xl={4} className={`res-only cls-depDate fs-13 f-reg d-iblock h-24`}>
                              {getDynamicDate(item?.departDate) as string}
                            </Col>
                            <Col xs={6} xl={4} className={`${isSmallScreen ? "fs-12 f-med" : "f-sbold"} py-10 text-ellipsis`} title={item?.flightNumber}>
                              {item?.flightNumber}
                            </Col>
                            <Col xs={4} xl={5}>
                              <Text className={`${isSmallScreen ? "fs-14" : "fs-16"} f-sbold d-block`}>
                                {item?.originAirportCode} 
                                <Text className={`${isSmallScreen ? "fs-12 d-block" : "fs-16 d-iblock pl-5"} f-sbold`}>{item?.depart}</Text>
                              </Text>
                              <Text className="fs-13 hide-res-only">{getDynamicDate(item?.departDate) as string}</Text>
                            </Col>
                            <Col xs={9} xl={5} className="fs-13 cls-lightgray py-10">
                              <Row className="cls-flight-route-container">
                                <Col className="cls-flight-duration">
                                  <FlightRouteRe />
                                </Col>
                                <Text className="cls-travel-point">
                                  {flightSpacing}
                                </Text>
                                <Col className={`cls-flight-duration ${isSmallScreen ? "fs-11" : "fs-12"}`}>
                                  {item?.duration}
                                </Col>
                                <Text className="cls-travel-point">
                                  {flightSpacing}
                                </Text>
                                <Col>
                                  <FdFlightDestinationDotIcon />
                                </Col>
                              </Row>
                            </Col>
                            <Col xs={5} xl={5} className={`${isSmallScreen ? "text-right" : ""}`}>
                              <Text className={`${isSmallScreen ? "fs-14" : "fs-16"} f-sbold d-block`}>
                                {item?.destinationAirportCode}
                                <Text className={`${isSmallScreen ? "fs-12 d-block" : "fs-16 d-iblock pl-5"} f-sbold`}>{item?.arrival}</Text>
                              </Text>
                              <Text className="fs-13 hide-res-only">{getDynamicDate(item?.arrivalDate) as string}</Text>
                            </Col>
                            <Col xs={24} xl={5} className="py-10 text-left cls-disruptionStatus">
                              <Tag
                                color={
                                  data?.statusCode === "HK"
                                    ? "var(--ant-color-success-text-active)"
                                    : data?.statusCode === "SC"
                                      ? "var(--t-primary)"
                                      : data?.statusCode === "WK"
                                        ? "var(--ant-color-error-text-active)"
                                        : "var(--t-orange-dark)"
                                }
                                className="mr-0"
                              >
                                {data?.status} ({data?.statusCode})
                              </Tag>
                            </Col>
                          </Row>
                          {data?.stops !== 0 &&
                          data?.viaFlightDetails.length !== index + 1 ? (
                            <Row className="text-center">
                              <span className="d-block cls-stop">
                                {data?.stops} stop(s) - (
                                {data?.viaPoints})
                              </span>
                            </Row>
                          ) : (
                            <></>
                          )}
                        </React.Fragment>
                      )
                    )}
                </React.Fragment>
              )) : <></>
          }
          <Col className="mt-5 mb-10 mx-10 py-5 px-10">
            <Alert
              message={
                <Text className="ml-20 d-iblock">
                  { 
                    SreviewStatus?.toLowerCase() === "cancel"
                      ? (t("reject_flight_description") as string)
                      : (t("review_flight_description") as string)
                  }
                </Text>
              }
              type="info"
            />
          </Col>
        </div>
      ) : 
      reviewOption === "Custom" && !props?.isConfirmpage ? (
        <>
          { 
            !allFlightChanged ? activePNR?.[0]?.rebookOptionalFlightDetails?.map((pnr: any, mainIndex: number) => (
              <div className={`cls-review-list cls-${pnr?.itinerary_status?.toLowerCase()}-border mb-10 ${mainIndex !== 0 && !isSmallScreen ? "mt-25" : ""}`}>
                {
                  pnr?.itinerary_status?.toLowerCase() !== "modify" ?
                  pnr?.flightDetails?.map((item: any, index: number) => (
                  <React.Fragment key={"pnrFlight"+pnr?.itinerary_status?.toLowerCase()+mainIndex+index}>
                    {index === 0 ? (
                      <React.Fragment key={reviewOption + pnr?.itinerary_status?.toLowerCase() +"pnr" + mainIndex + index}>
                        <Row justify="start" className="cls-statusRow">
                          <Text
                            className={`cls-${pnr?.itinerary_status?.toLowerCase()}-span`}
                          >
                            {pnr?.itinerary_status?.toLowerCase() ===
                            "accept"
                              ? "Accepted"
                              : pnr?.itinerary_status?.toLowerCase() ===
                                  "modify"
                                ? "Modified"
                                : pnr?.itinerary_status?.toLowerCase() ===
                                    "cancel"
                                  ? "Cancelled"
                                  : ""}
                          </Text>
                        </Row>
                        <Text className="d-iblock pt-10 ml-20 p-clr cls-trip">
                         Trip {pnr.trip}
                        </Text>
                      </React.Fragment>
                      ) : <></>
                    }
                    <Row
                      justify="space-between"
                      className={`py-15 pr-10 pl-20`}
                    >
                      <Col xs={24} md={24} lg={4} xl={4} className={`res-only cls-depDate fs-13 f-reg d-iblock h-24`}>
                        {getDynamicDate(item?.departDate) as string}
                      </Col>
                      <Col xs={6} xl={4} className={`${isSmallScreen ? "fs-12 f-med" : "f-sbold"} py-10 text-ellipsis`} title={item?.flightNumber}>
                        {item?.flightNumber}
                      </Col>
                      <Col xs={4} xl={5}>
                        <Text className={`${isSmallScreen ? "fs-14" : "fs-16"} f-sbold d-block`}>
                          {item?.originAirportCode} 
                          <Text className={`${isSmallScreen ? "fs-12 d-block" : "fs-16 d-iblock pl-5"} f-sbold`}>{item?.depart}</Text>
                        </Text>
                        <Text className="fs-13 hide-res-only">{getDynamicDate(item?.departDate) as string}</Text>
                      </Col>
                      <Col xs={9} xl={5} className="fs-13 cls-lightgray py-10">
                        <Row className="cls-flight-route-container">
                          <Col className="cls-flight-duration">
                            <FlightRouteRe />
                          </Col>
                          <Text className="cls-travel-point">
                            {flightSpacing}
                          </Text>
                          <Col className={`cls-flight-duration ${isSmallScreen ? "fs-11" : "fs-12"}`}>
                            {item?.duration}
                          </Col>
                          <Text className="cls-travel-point">
                            {flightSpacing}
                          </Text>
                          <Col>
                            <FdFlightDestinationDotIcon />
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={5} xl={5} className={`${isSmallScreen ? "text-right" : ""}`}>
                        <Text className={`${isSmallScreen ? "fs-14" : "fs-16"} f-sbold d-block`}>
                          {item?.destinationAirportCode}
                          <Text className={`${isSmallScreen ? "fs-12 d-block" : "fs-16 d-iblock pl-5"} f-sbold`}>{item?.arrival}</Text>
                        </Text>
                        <Text className="fs-13 hide-res-only">{getDynamicDate(item?.arrivalDate) as string}</Text>
                      </Col>
                      <Col xs={24} xl={5} className="py-10 text-left cls-disruptionStatus">
                        <Tag
                          color={
                            item?.statusCode === "HK"
                              ? "var(--ant-color-success-text-active)"
                              : item.statusCode === "SC"
                                ? "var(--t-primary)"
                                : item.statusCode === "WK"
                                  ? "var(--ant-color-error-text-active)"
                                  : "var(--t-orange-dark)"
                          }
                          className="mr-0"
                        >
                          {item?.status} ({item.statusCode})
                        </Tag>
                      </Col>
                    </Row>
                    {pnr.flightDetails.length !== index + 1 && pnr.stops !== "" ? (
                      <Row className="text-center">
                        <span className="d-block cls-stop">
                          {" "}
                          {pnr?.stops} stop(s) -{" "}
                          {pnr?.stopDetails[index]?.airportName} (
                          {pnr?.stopDetails[index]?.airportCode}){" - "}
                          {pnr?.stopDetails[index]?.stopOverTime}
                        </span>
                      </Row>
                    ) : (
                      <></>
                    )}
                    { 
                      pnr?.itinerary_status &&
                        pnr?.flightDetails?.length === index + 1 && (
                          <Col className="mt-5 mb-10 mx-10 py-5 px-10">
                            <Alert
                              message={
                                <Text className="ml-20 d-iblock">
                                  { 
                                    pnr?.itinerary_status === "cancel"
                                    ? (t("reject_flight_description") as string)
                                    : (t("review_flight_description") as string)
                                  }
                                </Text>

                              }
                              type="info"
                            />
                          </Col>
                        )
                      }
                  </React.Fragment>
                  )) : <></>
                }
              </div>
            )) : <></>
          }
          { 
            selectedFlightData && activePNR?.[0]?.rebookOptionalFlightDetails?.map((pnr: any, mainIndex: number) => (
              <div className={`cls-review-list cls-${pnr?.itinerary_status?.toLowerCase()}-border mb-10 ${mainIndex !== 0 ? "mt-25" : ""}`}>
                {
                  (allFlightChanged && mainIndex === 0) ?
                  selectedFlightData?.map((data: any, index: number) => (
                    <React.Fragment key={reviewOption + "review" + mainIndex + index}>
                      {
                        index === 0 ? (
                          <Row justify="start" className="cls-statusRow">
                            <Text
                              className={`cls-${pnr?.itinerary_status?.toLowerCase()}-span`}
                            >
                              {pnr?.itinerary_status?.toLowerCase() === "accept"
                                ? "Accepted"
                                : pnr?.itinerary_status?.toLowerCase() ===
                                    "modify"
                                  ? "Modified"
                                  : pnr?.itinerary_status?.toLowerCase() ===
                                      "cancel"
                                    ? "Cancelled"
                                    : ""}
                            </Text>
                          </Row>
                        ) : <></>
                      }
                      { data?.viaFlightDetails.map(
                          (item: any, index: number) => (
                            <React.Fragment key={"dataFlight"+index}>
                              {
                                index === 0 ? (
                                  <Text className="d-iblock pt-10 ml-20 p-clr cls-trip">
                                    Trip {data.trip}
                                  </Text>
                                ) : <></>
                              }
                              <Row
                                style={{ padding: "5px 0px 15px" }}
                                justify="space-between"
                                className={`mx-20 ${data?.viaFlightDetails.length === index + 1 && item.trip !== "return" ? "bordered-row" : ""}`}
                              >
                                <Col xs={24} md={24} lg={4} xl={4} className={`res-only cls-depDate fs-13 f-reg d-iblock h-24`}>
                                  {getDynamicDate(item?.departDate) as string}
                                </Col>
                                <Col xs={6} xl={4} className={`${isSmallScreen ? "fs-12 f-med" : "f-sbold"} py-10 text-ellipsis`} title={item?.flightNumber}>
                                  {item?.flightNumber}
                                </Col>
                                <Col xs={4} xl={5}>
                                  <Text className={`${isSmallScreen ? "fs-14" : "fs-16"} f-sbold d-block`}>
                                    {item?.originAirportCode} 
                                    <Text className={`${isSmallScreen ? "fs-12 d-block" : "fs-16 d-iblock pl-5"} f-sbold`}>{item?.depart}</Text>
                                  </Text>
                                  <Text className="fs-13 hide-res-only">{getDynamicDate(item?.departDate) as string}</Text>
                                </Col>
                                <Col
                                  xs={9}
                                  xl={5}
                                  className="fs-13 cls-lightgray py-10"
                                >
                                  <Row className="cls-flight-route-container">
                                    <Col className="cls-flight-duration">
                                      <FlightRouteRe />
                                    </Col>
                                    <Text className="cls-travel-point">
                                      {flightSpacing}
                                    </Text>
                                    <Col className={`cls-flight-duration ${isSmallScreen ? "fs-11" : "fs-12"}`}>
                                      {item?.duration}
                                    </Col>
                                    <Text className="cls-travel-point">
                                      {flightSpacing}
                                    </Text>
                                    <Col>
                                      <FdFlightDestinationDotIcon />
                                    </Col>
                                  </Row>
                                </Col>
                                <Col xs={5} xl={5} className={`${isSmallScreen ? "text-right" : ""}`}>
                                  <Text className={`${isSmallScreen ? "fs-14" : "fs-16"} f-sbold d-block`}>
                                    {item?.destinationAirportCode}
                                    <Text className={`${isSmallScreen ? "fs-12 d-block" : "fs-16 d-iblock pl-5"} f-sbold`}>{item?.arrival}</Text>
                                  </Text>
                                  <Text className="fs-13 hide-res-only">{getDynamicDate(item?.arrivalDate) as string}</Text>
                                </Col>
                                <Col xs={24} xl={5} className="py-10 text-left cls-disruptionStatus">
                                  <Tag
                                    color={
                                      data?.statusCode === "HK"
                                        ? "var(--ant-color-success-text-active)"
                                        : data?.statusCode === "SC"
                                          ? "var(--t-primary)"
                                          : data?.statusCode === "WK"
                                            ? "var(--ant-color-error-text-active)"
                                            : "var(--t-orange-dark)"
                                    }
                                    className="mr-0"
                                  >
                                    {data?.status} ({data?.statusCode})
                                  </Tag>
                                </Col>
                              </Row>
                              {data?.stops !== 0 &&
                              data?.viaFlightDetails.length !==
                                index + 1 ? (
                                <Row className="text-center">
                                  <span className="d-block cls-stop">
                                    {data?.stops} stop(s) - (
                                    {data?.viaPoints})
                                  </span>
                                </Row>
                              ) : (
                                <></>
                              )}
                            </React.Fragment>
                          )
                      )}
                      { pnr?.itinerary_status &&
                          selectedFlightData?.length === index + 1 && (
                            <Col className="mt-5 mb-10 mx-10 py-5 px-10">
                              <Alert
                                message={
                                  <Text className="ml-20 d-iblock">
                                    { 
                                      pnr?.itinerary_status === "cancel"
                                        ? (t("reject_flight_description") as string)
                                        : (t("review_flight_description") as string)
                                    }
                                  </Text>
                                }
                                type="info"
                              />
                            </Col>
                        )
                      }
                    </React.Fragment>
                  )) :
                  pnr?.itinerary_status?.toLowerCase() === "modify" && !allFlightChanged ?
                    selectedFlightData?.map((data: any, index: number) => (
                      <React.Fragment key={reviewOption + "select" + mainIndex + index}>
                        {
                          index === 0 ? (
                            <Row justify="start" className="cls-statusRow">
                              <Text
                                className={`cls-${pnr?.itinerary_status?.toLowerCase()}-span`}
                              >
                                {pnr?.itinerary_status?.toLowerCase() === "accept"
                                  ? "Accepted"
                                  : pnr?.itinerary_status?.toLowerCase() ===
                                      "modify"
                                    ? "Modified"
                                    : pnr?.itinerary_status?.toLowerCase() ===
                                        "cancel"
                                      ? "Cancelled"
                                      : ""}
                              </Text>
                            </Row>
                          ) : <></>
                        }
                        { data?.viaFlightDetails.map(
                            (item: any, index: number) => (
                              <React.Fragment key={"data"+index}>
                                {
                                  index === 0 ? (
                                    <Text className="d-iblock pt-10 ml-20 p-clr cls-trip">
                                      Trip {data.trip}
                                    </Text>
                                  ) : <></>
                                }
                                <Row
                                  style={{ padding: "5px 0px 15px" }}
                                  justify="space-between"
                                  className={`mx-20 ${data?.viaFlightDetails.length === index + 1 && item.trip !== "return" ? "bordered-row" : ""}`}
                                >
                                  <Col xs={24} md={24} lg={4} xl={4} className={`res-only cls-depDate fs-13 f-reg d-iblock h-24`}>
                                    {getDynamicDate(item?.departDate) as string}
                                  </Col>
                                  <Col xs={6} xl={4} className={`${isSmallScreen ? "fs-12 f-med" : "f-sbold"} py-10 text-ellipsis`} title={item?.flightNumber}>
                                    {item?.flightNumber}
                                  </Col>
                                  <Col xs={4} xl={5}>
                                    <Text className={`${isSmallScreen ? "fs-14" : "fs-16"} f-sbold d-block`}>
                                      {item?.originAirportCode} 
                                      <Text className={`${isSmallScreen ? "fs-12 d-block" : "fs-16 d-iblock pl-5"} f-sbold`}>{item?.depart}</Text>
                                    </Text>
                                    <Text className="fs-13 hide-res-only">{getDynamicDate(item?.departDate) as string}</Text>
                                  </Col>
                                  <Col xs={9} xl={5} className="fs-13 cls-lightgray py-10">
                                    <Row className="cls-flight-route-container">
                                      <Col className="cls-flight-duration">
                                        <FlightRouteRe />
                                      </Col>
                                      <Text className="cls-travel-point">
                                        {flightSpacing}
                                      </Text>
                                      <Col className={`cls-flight-duration ${isSmallScreen ? "fs-11" : "fs-12"}`}>
                                        {item?.duration}
                                      </Col>
                                      <Text className="cls-travel-point">
                                        {flightSpacing}
                                      </Text>
                                      <Col>
                                        <FdFlightDestinationDotIcon />
                                      </Col>
                                    </Row>
                                  </Col>
                                  <Col xs={5} xl={5} className={`${isSmallScreen ? "text-right" : ""}`}>
                                    <Text className={`${isSmallScreen ? "fs-14" : "fs-16"} f-sbold d-block`}>
                                      {item?.destinationAirportCode}
                                      <Text className={`${isSmallScreen ? "fs-12 d-block" : "fs-16 d-iblock pl-5"} f-sbold`}>{item?.arrival}</Text>
                                    </Text>
                                    <Text className="fs-13 hide-res-only">{getDynamicDate(item?.arrivalDate) as string}</Text>
                                  </Col>
                                  <Col xs={24} xl={5} className="py-10 text-left cls-disruptionStatus">
                                    <Tag
                                      color={
                                        data?.statusCode === "HK"
                                          ? "var(--ant-color-success-text-active)"
                                          : data?.statusCode === "SC"
                                            ? "var(--t-primary)"
                                            : data?.statusCode === "WK"
                                              ? "var(--ant-color-error-text-active)"
                                              : "var(--t-orange-dark)"
                                      }
                                      className="mr-0"
                                    >
                                      {data?.status} ({data?.statusCode})
                                    </Tag>
                                  </Col>
                                </Row>
                                {data?.stops !== 0 &&
                                data?.viaFlightDetails.length !==
                                  index + 1 ? (
                                  <Row className="text-center">
                                    <span className="d-block cls-stop">
                                      {data?.stops} stop(s) - (
                                      {data?.viaPoints})
                                    </span>
                                  </Row>
                                ) : (
                                  <></>
                                )}
                              </React.Fragment>
                            )
                        )}
                        {pnr?.itinerary_status &&
                          selectedFlightData?.length === index + 1 && (
                            <Col className="mt-5 mb-10 mx-10 py-5 px-10">
                                <Alert
                                  message={
                                    <Text className="ml-20 d-iblock">
                                    { 
                                      pnr?.itinerary_status === "cancel"
                                        ? (t("reject_flight_description") as string)
                                        : (t("review_flight_description") as string)
                                    }
                                    </Text>
                                  }
                                  type="info"
                                />
                            </Col>
                          )}
                      </React.Fragment>
                    )) : 
                    <></>
                }
              </div>
            ))
          }
        </>
      ) : (
        <></>
      )}
      { props?.isConfirmpage ? (
        <Row>
          <Col xs={24} lg={24} xl={20}>
            { 
              selectedFlightData?.length && (reviewOption === "Modify" || reviewOption === "Custom") ? 
              (
                <React.Fragment key={reviewOption+"confirmselected"}>
                  {
                    selectedFlightData?.length !== activePNR?.[0]?.rebookOptionalFlightDetails?.length ? 
                    activePNR?.[0]?.rebookOptionalFlightDetails?.map((data: any, mainIndex:number) => (
                        <React.Fragment key={reviewOption + "selectedpnr" + mainIndex}>
                          {data.flightDetails.map((item: any, index: number) =>
                            item?.statusCode === "HK" ||
                            (data?.itinerary_status &&
                              data?.itinerary_status?.toLowerCase() !==
                                "modify") ? (
                              <React.Fragment key={reviewOption + "selectedpnrsub" + mainIndex}>
                                {index === 0 && (
                                  <Text className="d-iblock pt-10 p-clr cls-trip">
                                    Trip {data.trip}
                                  </Text>
                                )}
                                <Row
                                  style={{ padding: "5px 0px 15px" }}
                                  justify="space-between"
                                  className={`mr-20 ${data?.flightDetails.length === index + 1 && activePNR?.[0]?.rebookOptionalFlightDetails?.length !== mainIndex+1 ? "bordered-row" : ""}`}
                                >
                                  <Col xs={24} md={24} lg={4} xl={4} className={`res-only cls-depDate fs-13 f-reg d-iblock h-24`}>
                                    {getDynamicDate(item?.departDate) as string}
                                  </Col>
                                  <Col xs={6} xl={4} className={`${isSmallScreen ? "fs-12 f-med" : "f-sbold"} py-10 text-ellipsis`} title={item?.flightNumber}>
                                    {item?.flightNumber}
                                  </Col>
                                  <Col xs={4} xl={5}>
                                    <Text className={`${isSmallScreen ? "fs-14" : "fs-16"} f-sbold d-block`}>
                                      {item?.originAirportCode} 
                                      <Text className={`${isSmallScreen ? "fs-12 d-block" : "fs-16 d-iblock pl-5"} f-sbold`}>{item?.depart}</Text>
                                    </Text>
                                    <Text className="fs-13 hide-res-only">{getDynamicDate(item?.departDate) as string}</Text>
                                  </Col>
                                  <Col xs={9} xl={5} className="fs-13 cls-lightgray py-10">
                                    <Row className="cls-flight-route-container">
                                      <Col className="cls-flight-duration">
                                        <FlightRouteRe />
                                      </Col>
                                      <Text className="cls-travel-point">
                                        {flightSpacing}
                                      </Text>
                                      <Col className={`cls-flight-duration ${isSmallScreen ? "fs-11" : "fs-12"}`}>
                                        {item?.duration}
                                      </Col>
                                      <Text className="cls-travel-point">
                                        {flightSpacing}
                                      </Text>
                                      <Col>
                                        <FdFlightDestinationDotIcon />
                                      </Col>
                                    </Row>
                                  </Col>
                                  <Col xs={5} xl={5} className={`${isSmallScreen ? "text-right" : ""}`}>
                                    <Text className={`${isSmallScreen ? "fs-14" : "fs-16"} f-sbold d-block`}>
                                      {item?.destinationAirportCode}
                                      <Text className={`${isSmallScreen ? "fs-12 d-block" : "fs-16 d-iblock pl-5"} f-sbold`}>{item?.arrival}</Text>
                                    </Text>
                                    <Text className="fs-13 hide-res-only">{getDynamicDate(item?.arrivalDate) as string}</Text>
                                  </Col>
                                  <Col xs={24} xl={5} className="py-10 text-left cls-disruptionStatus">
                                    <Tag
                                      color={
                                        item?.statusCode === "HK"
                                          ? "var(--ant-color-success-text-active)"
                                          : item.statusCode === "SC"
                                            ? "var(--t-primary)"
                                            : item.statusCode === "WK"
                                              ? "var(--ant-color-error-text-active)"
                                              : "var(--t-orange-dark)"
                                      }
                                      className="mr-0"
                                    >
                                      { (data?.itinerary_status === "cancel" || item?.status === "Cancelled") ? "Cancelled" : item?.status + " (" + item.statusCode +")"}
                                    </Tag>
                                  </Col>
                                </Row>
                                {data.flightDetails.length !== index + 1 &&
                                  data.stops !== "" && (
                                    <Row className="text-center">
                                      <span className="d-block cls-stop">
                                        {data?.stops} stop(s) -{" "}
                                        {data?.stopDetails[index]?.airportName}{" "}
                                        ({data?.stopDetails[index]?.airportCode}
                                        ){" - "}
                                        {data?.stopDetails[index]?.stopOverTime}
                                      </span>
                                    </Row>
                                  )}
                              </React.Fragment>
                            ) : (
                              <></>
                            )
                          )}
                              </React.Fragment>
                            )
                          )
                    :
                    activePNR?.[0]?.rebookOptionalFlightDetails?.map(
                        (data: any, mainIndex: number) => (
                          <React.Fragment key={reviewOption + "pnr" + mainIndex}>
                            {data.flightDetails.map((item: any, index: number) =>
                              item?.statusCode === "HK" &&
                              data?.itinerary_status &&
                              data?.itinerary_status?.toLowerCase() !==
                                "modify" ? (
                                <React.Fragment key={reviewOption + "pnrsub" + index}>
                                  {index === 0 && (
                                    <Text className="d-iblock pt-10 p-clr cls-trip">
                                      Trip {data.trip}
                                    </Text>
                                  )}
                                  <Row
                                    style={{ padding: "5px 0px 15px" }}
                                    justify="space-between"
                                    className={`mr-20 ${data.flightDetails.length === index + 1 && activePNR?.[0]?.rebookOptionalFlightDetails?.length !== mainIndex+1 ? "bordered-row" : ""}`}
                                  >
                                    <Col xs={24} md={24} lg={4} xl={4} className={`res-only cls-depDate fs-13 f-reg d-iblock h-24`}>
                                      {getDynamicDate(item?.departDate) as string}
                                    </Col>
                                    <Col xs={6} xl={4} className={`${isSmallScreen ? "fs-12 f-med" : "f-sbold"} py-10 text-ellipsis`} title={item?.flightNumber}>
                                      {item?.flightNumber}
                                    </Col>
                                    <Col xs={4} xl={5}>
                                      <Text className={`${isSmallScreen ? "fs-14" : "fs-16"} f-sbold d-block`}>
                                        {item?.originAirportCode} 
                                        <Text className={`${isSmallScreen ? "fs-12 d-block" : "fs-16 d-iblock pl-5"} f-sbold`}>{item?.depart}</Text>
                                      </Text>
                                      <Text className="fs-13 hide-res-only">{getDynamicDate(item?.departDate) as string}</Text>
                                    </Col>
                                    <Col xs={9} xl={5} className="fs-13 cls-lightgray py-10">
                                      <Row className="cls-flight-route-container">
                                        <Col className="cls-flight-duration">
                                          <FlightRouteRe />
                                        </Col>
                                        <Text className="cls-travel-point">
                                          {flightSpacing}
                                        </Text>
                                        <Col className={`cls-flight-duration ${isSmallScreen ? "fs-11" : "fs-12"}`}>
                                          {item?.duration}
                                        </Col>
                                        <Text className="cls-travel-point">
                                          {flightSpacing}
                                        </Text>
                                        <Col>
                                          <FdFlightDestinationDotIcon />
                                        </Col>
                                      </Row>
                                    </Col>
                                    <Col xs={5} xl={5} className={`${isSmallScreen ? "text-right" : ""}`}>
                                      <Text className={`${isSmallScreen ? "fs-14" : "fs-16"} f-sbold d-block`}>
                                        {item?.destinationAirportCode}
                                        <Text className={`${isSmallScreen ? "fs-12 d-block" : "fs-16 d-iblock pl-5"} f-sbold`}>{item?.arrival}</Text>
                                      </Text>
                                      <Text className="fs-13 hide-res-only">{getDynamicDate(item?.arrivalDate) as string}</Text>
                                    </Col>
                                    <Col xs={24} xl={5} className="py-10 text-left cls-disruptionStatus">
                                      <Tag
                                        color={
                                          item?.statusCode === "HK"
                                            ? "var(--ant-color-success-text-active)"
                                            : item.statusCode === "SC"
                                              ? "var(--t-primary)"
                                              : item.statusCode === "WK"
                                                ? "var(--ant-color-error-text-active)"
                                                : "var(--t-orange-dark)"
                                        }
                                        className="mr-0"
                                      >
                                        { data?.itinerary_status === "cancel" || item?.status === "Cancelled" ? "Cancelled" : item?.status + " (" + item.statusCode +")"}
                                      </Tag>
                                    </Col>
                                  </Row>
                                  {data.flightDetails.length !== index + 1 &&
                                    data.stops !== "" && (
                                      <Row className="text-center">
                                        <span className="d-block cls-stop">
                                          {data?.stops} stop(s) -{" "}
                                          {data?.stopDetails[index]?.airportName}{" "}
                                          ({data?.stopDetails[index]?.airportCode}
                                          ){" - "}
                                          {data?.stopDetails[index]?.stopOverTime}
                                        </span>
                                      </Row>
                                    )}
                                </React.Fragment>
                              ) : (
                                <></>
                              )
                            )}
                          </React.Fragment>
                        )
                      )
                  }
                  {selectedFlightData?.map((data: any, mainIndex: number) => (
                    <React.Fragment key={"selectedFlight"+mainIndex}>
                      {
                        data?.viaFlightDetails?.map(
                          (item: any, index: number) => (
                            <React.Fragment key={reviewOption + "selected" + index}>
                              {index === 0 ? (
                                <Text className="d-iblock pt-10 p-clr cls-trip">
                                  Trip {data.trip}
                                </Text>
                              ) : (
                                <></>
                              )}
                              <Row
                                style={{ padding: "5px 0px 15px" }}
                                justify="space-between"
                                className={`mr-20 ${data.viaFlightDetails.length === index + 1 && selectedFlightData?.length !== mainIndex+1 ? "bordered-row" : ""}`}
                              >
                                <Col xs={24} md={24} lg={4} xl={4} className={`res-only cls-depDate fs-13 f-reg d-iblock h-24`}>
                                  {getDynamicDate(item?.departDate) as string}
                                </Col>
                                <Col xs={6} xl={4} className={`${isSmallScreen ? "fs-12 f-med" : "f-sbold"} py-10 text-ellipsis`} title={item?.flightNumber}>
                                  {item?.flightNumber}
                                </Col>
                                <Col xs={4} xl={5}>
                                  <Text className={`${isSmallScreen ? "fs-14" : "fs-16"} f-sbold d-block`}>
                                    {item?.originAirportCode} 
                                    <Text className={`${isSmallScreen ? "fs-12 d-block" : "fs-16 d-iblock pl-5"} f-sbold`}>{item?.depart}</Text>
                                  </Text>
                                  <Text className="fs-13 hide-res-only">{getDynamicDate(item?.departDate) as string}</Text>
                                </Col>
                                <Col xs={9} xl={5} className="fs-13 cls-lightgray py-10">
                                  <Row className="cls-flight-route-container">
                                    <Col className="cls-flight-duration">
                                      <FlightRouteRe />
                                    </Col>
                                    <Text className="cls-travel-point">
                                      {flightSpacing}
                                    </Text>
                                    <Col className={`cls-flight-duration ${isSmallScreen ? "fs-11" : "fs-12"}`}>
                                      {item?.duration}
                                    </Col>
                                    <Text className="cls-travel-point">
                                      {flightSpacing}
                                    </Text>
                                    <Col>
                                      <FdFlightDestinationDotIcon />
                                    </Col>
                                  </Row>
                                </Col>
                                <Col xs={5} xl={5} className={`${isSmallScreen ? "text-right" : ""}`}>
                                  <Text className={`${isSmallScreen ? "fs-14" : "fs-16"} f-sbold d-block`}>
                                    {item?.destinationAirportCode}
                                    <Text className={`${isSmallScreen ? "fs-12 d-block" : "fs-16 d-iblock pl-5"} f-sbold`}>{item?.arrival}</Text>
                                  </Text>
                                  <Text className="fs-13 hide-res-only">{getDynamicDate(item?.arrivalDate) as string}</Text>
                                </Col>
                                <Col xs={24} xl={5} className="py-10 text-left cls-disruptionStatus">
                                  <Tag
                                    color={
                                      "var(--ant-color-success-text-active)"
                                    }
                                    className="mr-0"
                                  >
                                    Confirmed (HK)
                                  </Tag>
                                </Col>
                              </Row>
                              {data?.stops !== 0 &&
                              data?.viaFlightDetails.length !==
                                index + 1 ? (
                                <Row className="text-center">
                                  <span className="d-block cls-stop">
                                    {data?.stops} stop(s) - (
                                    {data?.viaPoints})
                                  </span>
                                </Row>
                              ) : (
                                <></>
                              )}
                            </React.Fragment>
                          )
                        )
                      }
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ) :
              (
                <React.Fragment key={reviewOption+"confirm"}>
                {
                  activePNR?.[0]?.rebookOptionalFlightDetails?.map((data: any, mainIndex: any) => (
                  <React.Fragment key={reviewOption + "activepnr" + mainIndex}>
                    {data?.flightDetails?.map((item: any, index: number) => (
                      <React.Fragment key={reviewOption + "activepnrsub" + index}>
                        {index === 0 ? (
                          <Text className="d-iblock pt-10 p-clr cls-trip">
                            Trip {data.trip}
                          </Text>
                        ) : (
                          <></>
                        )}
                        <Row
                          style={{ padding: isSmallScreen ? "5px 0 15px 0" : "5px 10px 15px 0" }}
                          justify="space-between"
                          className={`${data.flightDetails.length === index + 1 && activePNR?.[0]?.rebookOptionalFlightDetails?.length !== mainIndex+1 ? "bordered-row" : ""}`}
                        >
                          <Col xs={24} md={24} lg={4} xl={4} className={`res-only cls-depDate fs-13 f-reg d-iblock h-24`}>
                            {getDynamicDate(item?.departDate) as string}
                          </Col>
                          <Col xs={6} xl={4} className={`${isSmallScreen ? "fs-12 f-med" : "f-sbold"} py-10 text-ellipsis`} title={item?.flightNumber}>
                            {item?.flightNumber}
                          </Col>

                          <Col xs={4} xl={5}>
                            <Text className={`${isSmallScreen ? "fs-14" : "fs-16"} f-sbold d-block`}>
                              {item?.originAirportCode} 
                              <Text className={`${isSmallScreen ? "fs-12 d-block" : "fs-16 d-iblock pl-5"} f-sbold`}>{item?.depart}</Text>
                            </Text>
                            <Text className="fs-13 hide-res-only">{getDynamicDate(item?.departDate) as string}</Text>
                          </Col>
                          <Col xs={9} xl={5} className="fs-13 cls-lightgray py-10">
                            <Row className="cls-flight-route-container">
                              <Col className="cls-flight-duration">
                                <FlightRouteRe />
                              </Col>
                              <Text className="cls-travel-point">
                                {flightSpacing}
                              </Text>
                              <Col className={`cls-flight-duration ${isSmallScreen ? "fs-11" : "fs-12"}`}>
                                {item?.duration}
                              </Col>
                              <Text className="cls-travel-point">
                                {flightSpacing}
                              </Text>
                              <Col>
                                <FdFlightDestinationDotIcon />
                              </Col>
                            </Row>
                          </Col>
                          <Col xs={5} xl={5} className={`${isSmallScreen ? "text-right" : ""}`}>
                            <Text className={`${isSmallScreen ? "fs-14" : "fs-16"} f-sbold d-block`}>
                              {item?.destinationAirportCode}
                              <Text className={`${isSmallScreen ? "fs-12 d-block" : "fs-16 d-iblock pl-5"} f-sbold`}>{item?.arrival}</Text>
                            </Text>
                            <Text className="fs-13 hide-res-only">{getDynamicDate(item?.arrivalDate) as string}</Text>
                          </Col>
                          <Col xs={24} xl={5} className="py-10 text-left cls-disruptionStatus">
                            <Tag
                              color={
                                item?.statusCode === "HK"
                                  ? "var(--ant-color-success-text-active)"
                                  : item.statusCode === "SC"
                                    ? "var(--t-primary)"
                                    : item.statusCode === "WK"
                                      ? "var(--ant-color-error-text-active)"
                                      : "var(--t-orange-dark)"
                              }
                              className="mr-0"
                            >
                              { (data.itinerary_status === "cancel" || reviewOption === "Cancel" || item?.status === "Cancelled") ? "Cancelled" : item?.status + " (" + item.statusCode +")"}    
                            </Tag>
                          </Col>
                        </Row>
                        {data.flightDetails.length !== index + 1 &&
                        data.stops !== "" ? (
                          <Row className="text-center">
                            <span className="d-block cls-stop">
                              {data?.stops} stop(s) -
                              {data?.stopDetails[index]?.airportName} (
                              {data?.stopDetails[index]?.airportCode}){" - "}
                              {data?.stopDetails[index]?.stopOverTime}
                            </span>
                          </Row>
                        ) : (
                          <></>
                        )}
                      </React.Fragment>
                    ))}
                  </React.Fragment>))
                }
                </React.Fragment>
              )
            }
          </Col>
          {
            isSmallScreen 
              ? <></>
              : <>
                  <Col xl={4} className="cls-qr-col">
                    <QRCode value={text || "-"} size={110} />
                  </Col>
                  <Divider dashed />
                </>
          }
        </Row>
      ) : (
        ""
      )}
    </div>
  );
};

export default ItineraryReviewList;
