import styled from "styled-components";
import { Col, Result } from "antd";
import { SmileOutlined } from "@ant-design/icons";

const ResultContainer = styled(Col as any)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 75vh;
`;

const ComingSoon = () => {
  return (
    <ResultContainer data-testid="comingsoon">
      <Result
      icon={<SmileOutlined style={{color:"var(--t-primary)"}} />}
        title="Coming Soon....."
        // extra={<Button type="primary">Next</Button>}
      />
    </ResultContainer>
  );
};

export default ComingSoon;
