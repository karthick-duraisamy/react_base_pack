import React from "react";
import { Breadcrumb, Typography } from "antd";
import { Link } from "react-router-dom";
import "./Breadcrumb.scss";
import { useRedirect } from "@/hooks/Redirect.hook";
import {
  BreadcrumbItemType,
  BreadcrumbSeparatorType,
} from "antd/es/breadcrumb/Breadcrumb";

const { Text } = Typography;

export interface BreadcrumbItemProps {
  path: string;
  title: string;
  breadcrumbName: string;
  key: string;
}

export interface BreadcrumbProps {
  props: BreadcrumbItemProps[];
}

const BreadcrumbComponent: React.FC<BreadcrumbProps> = ({ props }) => {
  const { isCurrentPathEqual, getEncryptedPath } = useRedirect();

  const itemRender = (route: any) => {
    try {
      // Add null check for route.path
      if (!route.path) {
        return <div key={route.key}>{route.title}</div>;
      }

      const isCurrent = isCurrentPathEqual(route.path);
      return isCurrent ? (
        <div key={route.key}>{route.title}</div>
      ) : (
        <Link
          key={route.key}
          to={getEncryptedPath(route.path)}
          data-testid={`breadcrumb-link-${route.key}`}
        >
          {route.title}
        </Link>
      );
    } catch (error) {
      console.error("Breadcrumb rendering error:", error);
      return <div key={route.key}>{route.title}</div>;
    }
  };

  return (
    <Breadcrumb
      data-testid="Breadcrumb"
      itemRender={itemRender}
      items={props as Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[]}
      separator={
        <Text className="cls-breadcrumbSeparator Infi-06_DownArrow"></Text>
      }
    />
  );
};

export default BreadcrumbComponent;
