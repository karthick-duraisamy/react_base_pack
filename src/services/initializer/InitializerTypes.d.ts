export interface RouterResponse {
  description: any;
  title: any;
  menu: MenuItem[];
  route: RouteItem[];
}

export interface SystemSettingsType {
  [key: string]: {
    [key: string]: string | number | boolean | any | Array<any>;
  };
}
