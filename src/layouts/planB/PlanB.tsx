import { Layout } from "antd";
import AccessibilityHeader from "@/components/AccessibilityHeader/AccessibilityHeader";
import "./PlanB.scss";
import { HeaderItems } from "@/components/Header/Header";
import { useAuth } from "@/hooks/Auth.hook";
import { useAppSelector } from "@/hooks/App.hook";
import MenuBar from "@/components/Menu/Menu";
import { ReactNode } from "react";
const { Content } = Layout;

const Container = ({children} : {children : ReactNode}) => {
  const {isAuthenticated} = useAuth();
  const { user } = useAppSelector((state: { user: any }) => state.user);
  const responsive = window.matchMedia("(min-width: 320px) and (max-width: 767px)").matches;

  let userName = user?.name;
  if (userName && userName.includes("@")) {
    userName = userName.split("@")[0];
    userName = userName.slice(0, 1).toUpperCase() + userName.slice(1).toLowerCase();
  }

  return (
    <Layout className="cls-planBLayout">
      <AccessibilityHeader position={"vertical"} />
      <HeaderItems />
      <Layout className="cls-innerLayout">
        {(isAuthenticated && !responsive) && (
          <MenuBar position={"vertical"} />
        )}
        <Layout className="layout">
          <Content className="content">
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Container;
