import { useState } from "react";
import {
  Button,
  Col,
  Divider,
  Drawer,
  Radio,
  RadioChangeEvent,
  Row,
  Tooltip,
} from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import "./ThemeChanger.scss";
import { useTheming } from "@/hooks/Theme.hook";
import { ThemeIcon, ThemePreviewIcon, ThemeChecked } from "../Icons/HeaderIcon";
import { useTranslation } from "react-i18next";
import { localStorageAccessor, sessionStorageAccessor } from "@/utils/browserStorage";
// import { ThemeContext } from "../ThemeManager/ThemeManager";
import CFG from "@/config/config.json";
import { GFThemeIcon, VAThemeIcon } from "../Icons/Icons";

const ThemeChanger = () => {
  const [themeCollapse, setThemeCollapse] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const { t } = useTranslation();
  const [LgetLayout, LsetLayout, LremoveLayout] = localStorageAccessor("layout");

  const changeLayout = (layoutName: string) => {
    layoutName === "Reset" ? LremoveLayout() : LsetLayout(layoutName);
    window.location.reload();
  };

  return (
    <>
      <Tooltip title={t(t("theme_selector"))} data-testid="ThemeChanger">
        <Button
          data-testid="ThemeButton"
          type="link"
          className="cls-theme-selector"
          onClick={() => {
            setThemeCollapse(true);
            setShowDrawer(true);
          }}
        >
          <ThemeIcon />
        </Button>
      </Tooltip>
      {showDrawer && (
        <Drawer
          closable={false}
          placement="right"
          onClose={() => {
            setThemeCollapse(false);
            setTimeout(() => {
              setShowDrawer(false);
            }, 1000);
          }}
          open={themeCollapse}
        >
          <div className="ThemeChanger">
            <div className="d-flex mb-20 theme-header space-between">
              <h3 className="f-sbold mb-0 d-flex align-center">
                <ThemeIcon />
                {t("theme_settings")}
              </h3>
              <CloseCircleOutlined
                onClick={() => {
                  setThemeCollapse(false);
                  setTimeout(() => {
                    setShowDrawer(false);
                  }, 1000);
                }}
                style={{ color: "#FF4646", fontSize: "20px" }}
              />
            </div>
            <div className="cls-theme-change">
              <p>{t("theme")}</p>
              <TempThemeChanger />
            </div>
            {/* <div className="notification d-flex">
              <h3 className="f-sbold">{t("notifications")}</h3>
              <Switch />
            </div> */}
            <Row className="my-15">
              <Col className="f-sbold"> {t("select_layout")} </Col>
            </Row>
            <Radio.Group
              className="cls-layout-group"
              onChange={(e: RadioChangeEvent) => changeLayout(e.target.value)}
              defaultValue={LgetLayout() ? LgetLayout() : "HomeLayout"}
            >
              <Radio.Button value="HomeHorizontaLgetLayout()">{t("horizontal_layout")}</Radio.Button>
              <Radio.Button value="HomeLayout">{t("vertical_layout")}</Radio.Button>
            </Radio.Group>
          </div>
        </Drawer>
      )}
    </>
  );
};

const TempThemeChanger = () => {
  const { changeTheme } = useTheming();
  const { t } = useTranslation();
  const [LgetTheme] = localStorageAccessor("theme");
  const [SgetAirlineCode, SsetAirlineCode] = sessionStorageAccessor("airlineCode");
  const handleTheme = (e: RadioChangeEvent) => {
    if (SgetAirlineCode() !== e.target.value && e.target.value.length === 2) {
      SsetAirlineCode(e.target.value);
      window.location.reload();
    } else {
      changeTheme(e.target.value);
    }
  };

  return (
    <>
      <Radio.Group onChange={handleTheme} defaultValue={LgetTheme()}>
        <Radio.Button value="default">
          <ThemePreviewIcon color="#CDDDF5" />
          <span className="checked-icon">
            <ThemeChecked />
          </span>
        </Radio.Button>
        <Radio.Button className="dark" value="dark">
          <ThemePreviewIcon color="#4B5284" />
          <span className="checked-icon">
            <ThemeChecked />
          </span>
        </Radio.Button>
      </Radio.Group>
      <Divider />
      <Row className="my-15">
        <Col className="f-sbold"> {t("airline_theme")} </Col>
      </Row>
      <Radio.Group onChange={handleTheme} defaultValue={SgetAirlineCode() ? SgetAirlineCode() : CFG.airline_code}>
        <Radio.Button className="cls-airline-theme-logo" value="VA" title="Voyageraid">
          <VAThemeIcon />
          <span className="checked-icon">
            <ThemeChecked />
          </span>
        </Radio.Button>
        <Radio.Button className="cls-airline-theme-logo" value="GF" title="Gulf air">
          <GFThemeIcon/>
          <span className="checked-icon">
            <ThemeChecked />
          </span>
        </Radio.Button>
      </Radio.Group>
    </>
  );
};

export { ThemeChanger };
