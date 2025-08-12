import React  from 'react';
import "./Home.scss";
import { Layout, theme } from 'antd';
import { HeaderItems } from '@/components/Header/Header';
import MenuBar from '@/components/Menu/Menu';
import CFG from "@/config/config.json";
import { useResize } from '@/utils/resize';
import AccessibilityHeader from '@/components/AccessibilityHeader/AccessibilityHeader';
const { Content, Sider } = Layout;

interface HomeLayout {
  children: React.ReactNode;
}

const HomeLayout: React.FC<HomeLayout> = ({ children }) => {

  const { token: { colorBgContainer } } = theme.useToken();
  const { isSmallScreen } = useResize(767);

  const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: 'calc(100vh - 78px)',
    overflowY: "auto",
    position: 'sticky',
    insetInlineStart: 0,
    top: 78,
    bottom: 0,
    boxShadow: '0px 3px 6px 0px #00000029',
    scrollbarWidth: 'none',
    background: colorBgContainer,
    zIndex: 11
  };

  return (
    <Layout className='cls-homeLayout'>
      {CFG.accessibility_pos === "horizontal" && <AccessibilityHeader position={CFG.accessibility_pos as "horizontal" | "vertical"} />}
      <HeaderItems />
      <Layout>
        { 
          CFG.menu_position === "vertical" && !isSmallScreen ? (
            <Sider 
              width={92}
              style={siderStyle}
            >
              <MenuBar position={CFG.menu_position} />
            </Sider>
          ) : <></>
        }
        <Layout style={{ padding: '25px' }}>
          <Content
            style={{
              margin: 0,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default HomeLayout;