import { useResize } from "@/utils/resize";
import { Skeleton, Divider, Flex, Row, Col } from "antd";

const ItineraryListSkeleton = () => {

  const { isSmallScreen } = useResize(991);

  return (
    <Row className="my-15" data-testId="itineraryLoader">
      <Col lg={24} xl={24}>
        <Skeleton.Input active className="w-8 h-30" />
        <Flex gap={"10px"} className="my-15" align="center" justify={isSmallScreen ? "flex-start" : "space-between"} wrap>
          {[...Array(7)].map(() => (
            <Skeleton.Input active size="small" />
          ))}
        </Flex>
        <Skeleton.Input active className="w-8 h-30" />          
        <Flex gap={"10px"} className="my-15" align="center" justify={isSmallScreen ? "flex-start" : "space-between"} wrap>
          {[...Array(7)].map(() => (
            <Skeleton.Input active size="small" />
          ))}
        </Flex>
        <Divider className="my-15" />
        <Skeleton.Input active className="w-8 h-30" />
        <Flex gap={"10px"} className="my-15" align="center" justify={isSmallScreen ? "flex-start" : "space-between"} wrap>
          {[...Array(7)].map(() => (
            <Skeleton.Input active size="small" />
          ))}
        </Flex>
      </Col>
    </Row>
  );
};

export default ItineraryListSkeleton;
