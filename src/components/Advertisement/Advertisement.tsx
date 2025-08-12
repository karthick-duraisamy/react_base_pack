import { Card, Carousel, Col, Row, Image, Typography } from "antd";
import { useGetUpcomingEventMutation } from "@/services/reschedule/Reschedule";
import ad from "@/assets/images/common/advertisement.webp";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import './Advertisement.scss';

const { Title, Text } = Typography;

const Advertisement: React.FC = () => {
  const [upcomingEvent, upcomingEventResponse] = useGetUpcomingEventMutation();
  const { t } = useTranslation();
  const [upcomingEventData, setUpcomingEventData] = useState([]);

  useEffect(() => {
    upcomingEvent([]);
  }, [upcomingEvent]);

  useEffect(() => {
    if(upcomingEventResponse?.isSuccess) {
      setUpcomingEventData((upcomingEventResponse?.data as any)?.response?.data);
    }
  }, [upcomingEventResponse?.isSuccess]);

  return (
    <div data-testid="Advertisement">
      <Row>
        <Col span={24}>
          <Image
            src={ad}
            width="100%"
            height="215px"
            className="cls-ad-img"
          ></Image>
        </Col>
      </Row>
      <Row className="pt-10 mt-20 cls-upcoming-event-container">
        <Col>
          <Card>
            <Title level={5} className="fs-18 cls-upcoming-event-title">
              {t("upcoming_events")}
            </Title>
            <Col span={24} className="cls-upcoming-event-carousel">
              <Carousel
                autoplay
                dots={true}
                dotPosition="bottom"
                className="custom-carousel"
              >
                {
                  upcomingEventData?.map((value: any) => {
                    return (
                      <Row
                        data-testid="upcomingEvent"
                        className="pt-5 pb-5 pl-15 cls-db-event-ele"
                      >
                        <Col span={24}>
                          <h1 className="fs-30 f-sbold cls-db-date">
                            {value.day}
                          </h1>
                        </Col>
                        <Col span={24}>
                          <p className="fs-12 pb-20">{value.month}</p>
                        </Col>
                        <Col span={24}>
                          <p className=" mt-5 fs-13">{value.text}</p>
                        </Col>
                        <Col span={24}>
                          <Text className="fs-12 f-sbold">{value.time}</Text>
                        </Col>
                      </Row>
                    )
                  })
                }
              </Carousel>
            </Col>
          </Card>
        </Col>
      </Row>
    </div>
  );
};


export default Advertisement;
