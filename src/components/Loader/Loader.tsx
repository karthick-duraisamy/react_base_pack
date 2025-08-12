import "./Loader.scss";
import { memo } from "react";
import CFG from "@/config/config.json";
import { useTranslation } from "react-i18next";
import { sessionStorageAccessor } from "@/utils/browserStorage";

interface LoaderProps {
  fallback?: boolean;
}

const Loader = memo(({ fallback }: LoaderProps) => {
  const { t } = useTranslation();
  const [SgetAirlineCode] = sessionStorageAccessor("airlineCode");

  const Loader = memo(() => {
    let dynamicImagePath: string;
    try {
      dynamicImagePath = new URL(
        `../../plugins/${CFG?.airline_code || "VA"}/assets/loader.gif`,
        import.meta.url
      ).href;
    } catch {
      console.error(`Error getting loader for airline ${SgetAirlineCode() ? SgetAirlineCode() : CFG.airline_code}`);
      dynamicImagePath = new URL(
        `../../plugins/${CFG?.airline_code || "VA"}/assets/images/logo.svg`,
        import.meta.url
      ).href
    }

    return (
      <div data-testid="loader" className="cls-loaderContainer">
        <div className="cls-loader" >
          <span className="d-block w-100 text-center">
            <img src={dynamicImagePath} alt="Loader" width={CFG.airline_code === "ADO" ? 170 : 125}></img>
            <span className="d-block fs-16 f-med p-clr" style={{marginTop: CFG.airline_code === "VA" ? -15 : 5}}>{t("please_wait")}</span>
          </span>
        </div>
      </div>
    );
  });

  return fallback ? <Loader /> : null;
});

export { Loader };
