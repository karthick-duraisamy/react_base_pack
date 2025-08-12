import { Radio, RadioChangeEvent, Tooltip, Typography } from "antd";
import "./Theme.scss";
import { useTheming } from "@/hooks/Theme.hook";
import { useState } from "react";
import { useEffect } from "react";
import { localStorageAccessor } from "@/utils/browserStorage";
import { useTranslation } from "react-i18next";


const Theme = () => {
  const { t } = useTranslation();
  const { Text } = Typography;
  const { changeTheme } = useTheming();
  const [newTheme,setNewTheme] = useState(true);
  const [themeValue, setThemeValue] = useState();
  /* Localstorage theme value & handlers */
  const [LgetTheme] = localStorageAccessor('theme');

  useEffect(() => {
    setNewTheme(LgetTheme() === 'default' ? true : false) // eslint-disable-next-line
  }, [])
  
  return (
    <Tooltip title={t("theme_selector")}>
      <Radio.Group
        style={{height: 32}}
        defaultValue={"default"}
        onChange={(e: RadioChangeEvent) => { 
          if(e.target.value === 'default'){
            setNewTheme(true);
          }else{
            setNewTheme(false);
          }
          changeTheme(e.target.value); setThemeValue(e.target.value);
        }}
        className="radioSwitch mt-3" value={themeValue}
      >
        <Radio.Button className={`${newTheme ?'cls-default-theme cls-radio-switch':"cls-radio-switch"}`} value="default">
          <Text className="cls-light-icon Infi-63_Light"></Text> Light
        </Radio.Button>
        <Radio.Button className={`${newTheme ?'cls-radio-switch':"cls-default-theme  cls-radio-switch"}`} value="dark">
          <Text className="cls-dark-icon Infi-64_Dark"></Text> Dark
        </Radio.Button>
      </Radio.Group>
    </Tooltip>
  );
};

export { Theme };