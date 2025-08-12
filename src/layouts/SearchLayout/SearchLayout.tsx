import { Layout, Row } from "antd";
import { ReactNode } from "react";
import styled from "styled-components";
import { HeaderItems } from "@/components/Header/Header";
import AccessibilityHeader from "@/components/AccessibilityHeader/AccessibilityHeader";
import "./SearchLayout.scss";
import Logo from "@/components/Logo/Logo";
const { Header, Content } = Layout;

interface ContainerProps {
  children: ReactNode;
}

const ContainerLayout = styled(Layout as any)`
  min-height: 100vh;

  .ant-layout-header {
    background-color: var(--background);
    padding: 0px;
    line-height: unset;

    .container {
      height: 100%;
      padding: 0px 28px;
      align-items: center;
    }
  }
  .ant-layout {
    background: var(--secondary-bg);
  }
`;

const SearchLayout = ({ children }: ContainerProps) => {
  return (
    <ContainerLayout className="Home">
      <AccessibilityHeader position={"vertical"} />
      <Header>
        <Row className="container">
          <Logo />
          <HeaderItems />
        </Row>
      </Header>
      <Layout>
        <Layout className="layout">
          <Content className="content">
            {children}
          </Content>
        </Layout>
      </Layout>
      {/* <Footer /> */}
    </ContainerLayout>
  );
};

export default SearchLayout;
