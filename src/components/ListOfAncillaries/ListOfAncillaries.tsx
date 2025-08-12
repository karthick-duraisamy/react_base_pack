import { FC, useEffect, useState } from 'react';
import './ListOfAncillaries.scss';
import { Button, Card, Col, Dropdown, Row, Space, Typography } from 'antd';
import { useLazyGetAncillariesQuery } from '@/services/ado/Ado';
import { DownOutlined } from '@ant-design/icons';
import { FdAddAncillaryIcons } from '../Icons/Icons';
import { useRedirect } from '@/hooks/Redirect.hook';
import Link from 'antd/lib/typography/Link';
const Text = Typography;

interface ListOfAncillariesProps {
  page: string;
  onAddAncillaryButton?: (data: any) => void; // Function to handle adding ancillary
  onApplyAncillary?: (ancillary: any) => void; // Function to handle applying ancillary
}

const ListOfAncillaries: FC<ListOfAncillariesProps> = ({
  page,
  onAddAncillaryButton,
  onApplyAncillary
}) => {
  const { redirect } = useRedirect();
  const [ancillaryList, setAncillaryList] = useState<any>([]);
  const [GetAncillaryListService, AncillaryListResponse] = useLazyGetAncillariesQuery();

  useEffect(() => {
    GetAncillaryListService();
  }, []);

  useEffect(() => {
    if (AncillaryListResponse?.isSuccess) {
      var values = JSON.parse(JSON.stringify((AncillaryListResponse?.data as any)?.response?.data));
      setAncillaryList(values);
    }
  }, [AncillaryListResponse?.isSuccess]);

  return (
    <Card
      title="List of Ancillaries"
      className="cls-ListOfAncillaries mt-25"
      data-testid="ListOfAncillaries"
    >
      <Row gutter={[16, 16]}>
        {ancillaryList.map((ancillary: any) => (
          <Col key={ancillary.id || ancillary.ancillaryCode} xs={24} sm={12} md={8} lg={6}>
            {ancillary.subCategories?.length ? (
              <Col className="cls-addAccDropdown">
                <Dropdown
                  className="cls-addCreateBundelDropdown"
                  menu={{
                    items: ancillary?.subCategories?.map((data: any) => ({
                      key: data?.ancillaryCode,
                      label: (
                        <Link
                          style={{ flexBasis: 100 }}
                          onClick={
                            () => page === "bundle"
                              ? onAddAncillaryButton?.(data)
                              : onApplyAncillary?.(ancillary)
                          }
                        >
                          {data}
                          <Text className="Infi-30_Plus add" />
                        </Link>
                      ),
                    })),
                  }}
                >
                  <Link
                    onClick={
                      (e) => page === "bundle"
                        ? e?.preventDefault()
                        : redirect("createBundling")
                    }
                  >
                    <Space>
                      <FdAddAncillaryIcons />
                      {ancillary?.category}
                      <DownOutlined />
                    </Space>
                  </Link>
                </Dropdown>

              </Col>
            ) : (
              <Button
                icon={<FdAddAncillaryIcons />}
                className="justify-start h-40 cls-addButton"
                onClick={() => page === "bundle" ? onAddAncillaryButton?.(ancillary.category) : redirect("createBundling")}
              >
                {ancillary.category}
                <Text className="Infi-30_Plus add" />
              </Button>
            )}
          </Col>
        ))}
      </Row>
    </Card>
  )
};

export default ListOfAncillaries;
