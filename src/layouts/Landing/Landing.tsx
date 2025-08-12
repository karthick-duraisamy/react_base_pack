import { Layout, Typography, Row, Col, Grid, Flex } from "antd";
import "./Landing.scss";
import { useTranslation } from "react-i18next";
import { LandingLogo } from "@/components/Icons/HeaderIcon";
import Logo from "@/components/Logo/Logo";
import CFG from "@/config/config.json";
import { sessionStorageAccessor } from "@/utils/browserStorage";
import { Theme } from "@/components/Theme/Theme";
import Language from "@/components/Language/Language";
const { useBreakpoint } = Grid;
const { Content, Sider } = Layout;
const { Text } = Typography;

interface LandingLayout {
  children: React.ReactNode;
}

const LandingLayout: React.FC<LandingLayout> = ({ children }) => {
  const { t } = useTranslation();
  const [SgetAirlineCode] = sessionStorageAccessor("airlineCode");
  const screens = useBreakpoint();
  const isMobile = !screens['md'];

  return (
    <Layout className="cls-landingLayout">
      {/* Content Area (Left Side) */}
      <Content className="cls-landingContainer">
        <Row justify="center" align="middle">
          <Col xs={24} sm={24} md={16} lg={20} className="text-center">
            <LandingLogo airline={SgetAirlineCode() || CFG.airline_code} />
            <Text className="f-sbold cls-description-heading w-100 d-iblock">
              {t("login_registered_users_get_more_offers")}
            </Text>
            <div className="fs-21 cls-description-points text-left">
              <ul className="cls-ulPoints">
                 {CFG?.airline_code !== "ADO" ? (
                  <>
                    <li> {t("view_cancel_reschedule_booking")} </li>
                    <li>{t("manage_cancellation_booking_view_booking_history")}</li>
                    <li> {t("faster_booking_with_saved_travelers")} </li>
                    <li>{t("low_cancellation_fee_for_SME_business_customers")}</li>
                  </>
                ) : (
                  <>
                    <li>{t("dynamic_ancillary_bundling")}</li>
                    <li>{t("one_click_addon_purpose")}</li>
                    <li>{t("disconnected_bundles_for_users")}</li>
                    <li>{t("customizable_fare_families")}</li>
                  </>
                )}
              </ul>
            </div>
          </Col>
        </Row>
      </Content>

      {/* Login Area (Right Side) */}
      <Sider 
        width={isMobile ? '100%' : '50%'}
        className="text-center"
        theme="light"
      >
        <Flex justify="end" gap={15} align="middle" className="px-15 p-20">
          <Theme />
          <Language />
        </Flex>
        <Row justify="center" align="middle" className="cls-loginContainer">
          <Col xs={22} md={22} lg={16} xl={16}>
            {isMobile && (
              <Col span={24} className="cls-mobLogo">
                <Logo />
              </Col>
            )}
            {children}
          </Col>
        </Row>
      </Sider>
    </Layout>
  );
};

export default LandingLayout;
