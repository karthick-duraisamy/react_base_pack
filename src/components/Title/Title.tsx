import { useTranslation } from "react-i18next";
import css from "./Title.module.scss";
import { useRedirect } from "@/hooks/Redirect.hook";

interface FormTitleProps {
  title: string;
  subTitle: string;
  clsName?: string;
  testId?: string;
}

const FormTitle = ({ subTitle, title, clsName, testId }: FormTitleProps) => {
  const { t } = useTranslation();
  const {isCurrentPathEqual} = useRedirect();
  const tempClass = clsName === undefined ? css["title"] : css[clsName];
   // Add try-catch for path comparison
  let isViewPnrInfoPath = false;
  try {
    isViewPnrInfoPath = isCurrentPathEqual("viewPnrInfo");
  } catch (error) {
    console.error('Error checking current path:', error);
    // Fallback to false if there's an error
    isViewPnrInfoPath = false;
  }

  return (
    <div 
     data-testid={testId} 
     className={`${tempClass}  ${ isViewPnrInfoPath ? css.cls_title_modal : '' }`}
    >
      <h1 className={`${css["title-head"]}`}>{t(title)}</h1>
      <p className={`${css["title-head-sub"]}`}>{t(subTitle)}</p>
    </div>
  );
};

export { FormTitle };
