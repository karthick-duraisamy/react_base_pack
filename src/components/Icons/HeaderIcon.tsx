import { useAppSelector } from "@/hooks/App.hook";
import { useRedirect } from "@/hooks/Redirect.hook";
import { sessionStorageAccessor } from "@/utils/browserStorage";

const ThemeIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" >
    <circle cx="14" cy="14" r="14" fill="var(--t-primary-lt)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M19.7058 17.1139C20.6384 13.6334 18.4301 10.0385 14.8021 9.0665C10.7051 7.96766 4.89025 10.8211 6.18384 14.4812C6.61265 15.6917 7.43812 15.9749 8.99525 15.9972L9.09263 15.999C9.91541 16.0088 10.1468 16.0624 10.2165 16.175C10.3299 16.3608 10.3317 16.6565 10.204 17.4704C10.1432 17.8545 10.1236 17.9885 10.1003 18.1984C9.9583 19.4768 10.1745 20.4738 11.0116 21.3761C13.6273 24.1929 18.6525 21.0429 19.7058 17.1139ZM7.86872 13.8844C7.21746 12.0441 11.385 9.99917 14.3393 10.7907C17.0346 11.5134 18.6507 14.1444 17.9798 16.6503C17.2312 19.4447 13.7077 21.6531 12.3212 20.1594C11.8924 19.6984 11.7861 19.2053 11.8763 18.395C11.8951 18.2217 11.913 18.102 11.9693 17.7464C12.1649 16.4984 12.1622 15.9284 11.7388 15.2396C11.2081 14.3758 10.5774 14.2301 9.11496 14.2114L9.02027 14.2096C8.15906 14.198 7.95448 14.1274 7.86783 13.8844H7.86872Z" fill="var(--t-primary)" />
    <path d="M10.5757 13.5801C10.2795 13.5801 9.99548 13.4624 9.78606 13.253C9.57664 13.0436 9.45898 12.7596 9.45898 12.4634C9.45898 12.1672 9.57664 11.8832 9.78606 11.6738C9.99548 11.4643 10.2795 11.3467 10.5757 11.3467C10.8719 11.3467 11.1559 11.4643 11.3653 11.6738C11.5747 11.8832 11.6924 12.1672 11.6924 12.4634C11.6924 12.7596 11.5747 13.0436 11.3653 13.253C11.1559 13.4624 10.8719 13.5801 10.5757 13.5801Z" fill="var(--t-primary)" />
    <path d="M13.9263 13.5801C13.6301 13.5801 13.3461 13.4624 13.1366 13.253C12.9272 13.0436 12.8096 12.7596 12.8096 12.4634C12.8096 12.1672 12.9272 11.8832 13.1366 11.6738C13.3461 11.4643 13.6301 11.3467 13.9263 11.3467C14.2224 11.3467 14.5065 11.4643 14.7159 11.6738C14.9253 11.8832 15.043 12.1672 15.043 12.4634C15.043 12.7596 14.9253 13.0436 14.7159 13.253C14.5065 13.4624 14.2224 13.5801 13.9263 13.5801Z" fill="var(--t-primary)" />
    <path d="M16.1597 16.2607C15.8635 16.2607 15.5795 16.1431 15.37 15.9337C15.1606 15.7243 15.043 15.4402 15.043 15.144C15.043 14.8479 15.1606 14.5638 15.37 14.3544C15.5795 14.145 15.8635 14.0273 16.1597 14.0273C16.4558 14.0273 16.7399 14.145 16.9493 14.3544C17.1587 14.5638 17.2764 14.8479 17.2764 15.144C17.2764 15.4402 17.1587 15.7243 16.9493 15.9337C16.7399 16.1431 16.4558 16.2607 16.1597 16.2607Z" fill="var(--t-primary)" />
    <path d="M14.8189 19.3867C14.5227 19.3867 14.2386 19.2691 14.0292 19.0597C13.8198 18.8502 13.7021 18.5662 13.7021 18.27C13.7021 17.9739 13.8198 17.6898 14.0292 17.4804C14.2386 17.271 14.5227 17.1533 14.8189 17.1533C15.115 17.1533 15.3991 17.271 15.6085 17.4804C15.8179 17.6898 15.9356 17.9739 15.9356 18.27C15.9356 18.5662 15.8179 18.8502 15.6085 19.0597C15.3991 19.2691 15.115 19.3867 14.8189 19.3867Z" fill="var(--t-primary)" />
    <path d="M18.0525 7.86664C18.1584 7.80989 18.2747 7.77509 18.3944 7.76433C18.5141 7.75357 18.6347 7.76707 18.7491 7.80402C18.8634 7.84097 18.9691 7.90061 19.0599 7.97937C19.1507 8.05813 19.2246 8.15439 19.2773 8.2624L22.9338 15.7666C22.9949 15.9015 23.0023 16.0546 22.9545 16.1947C22.9067 16.3349 22.8074 16.4516 22.6767 16.5211C22.5459 16.5906 22.3936 16.6077 22.2507 16.569C22.1078 16.5302 21.9851 16.4385 21.9074 16.3125L17.7014 9.10305C17.6409 8.99934 17.6021 8.88449 17.5871 8.76538C17.5721 8.64627 17.5813 8.52536 17.6141 8.4099C17.647 8.29444 17.7029 8.18681 17.7783 8.09346C17.8538 8.0001 17.9474 7.92296 18.0534 7.86664H18.0525Z" fill="var(--t-primary)" />
    <path fillRule="evenodd" clipRule="evenodd" d="M16.4152 7.75897C16.8503 8.5764 17.582 8.8051 18.2895 8.429C18.9962 8.05378 19.2168 7.31855 18.7818 6.50112C18.2851 5.56488 17.2202 4.71618 16.5144 5.0905C15.8087 5.46571 15.9176 6.82273 16.4161 7.75897H16.4152ZM17.2041 7.33909C17.0459 7.02145 16.9489 6.67686 16.9182 6.32334C16.9049 6.17555 16.9103 6.02667 16.9343 5.88023L16.9504 5.88827C16.995 5.90971 17.1335 5.97404 17.3104 6.11519C17.5802 6.33049 17.8482 6.64763 17.9929 6.92011C18.1975 7.30425 18.1394 7.49722 17.8696 7.64105C17.6016 7.78399 17.4087 7.72324 17.2041 7.33999V7.33909Z" fill="var(--t-primary)" />
  </svg>
);
const ThemePreviewIcon = ({ color }: any) => (
  <svg width="73" height="56" viewBox="0 0 73 56" fill="none" xmlns="http://www.w3.org/2000/svg" >
    <rect x="0.5" y="0.5" width="72" height="55" rx="4.5" stroke={color ? color : "#CDDDF5"} />
    <path d="M0 5C0 2.23858 2.23858 0 5 0H68C70.7614 0 73 2.23858 73 5V18H0V5Z" fill={color ? color : "#CDDDF5"} />
    <circle cx="16" cy="36" r="11" fill={color ? color : "#CDDDF5"} />
    <rect x="33" y="25" width="34" height="3" rx="1.5" fill={color ? color : "#CDDDF5"} />
    <rect x="33" y="31" width="28" height="3" rx="1.5" fill={color ? color : "#CDDDF5"} />
    <rect x="33" y="37" width="21" height="3" rx="1.5" fill={color ? color : "#CDDDF5"} />
    <rect x="33" y="43" width="13" height="3" rx="1.5" fill={color ? color : "#CDDDF5"} />
  </svg>
);
const ThemeChecked = () => (
  <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d_934:1633)">
      <rect x="4" y="3" width="12" height="11" rx="2" fill="#37C57A" />
      <rect x="4.25" y="3.25" width="11.5" height="10.5" rx="1.75" stroke="white" strokeWidth="0.5" />
    </g>
    <path fillRule="evenodd" clipRule="evenodd" d="M13.835 6.94583L9.90928 10.8375C9.6907 11.0542 9.34098 11.0542 9.1224 10.8375L7.16393 8.87917C6.94536 8.6625 6.94536 8.3125 7.16393 8.09583C7.38251 7.87917 7.73224 7.87917 7.95082 8.09583L9.52458 9.6625L13.0568 6.1625C13.2754 5.94583 13.6251 5.94583 13.8437 6.1625C14.0535 6.37917 14.0535 6.72917 13.835 6.94583Z" fill="white" />
    <defs>
      <filter id="filter0_d_934:1633" x="0" y="0" width="20" height="19" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB" >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dy="1" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_934:1633" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_934:1633" result="shape" />
      </filter>
    </defs>
  </svg>
);

const LandingLogo = (props: any) => {
  const { redirect } = useRedirect();
  // const { defaultRoute } = useAppSelector((state) => state.MenuReducer);
  const menuState = useAppSelector((state) => state.MenuReducer);
  const defaultRoute = menuState?.defaultRoute || '/';
  const [SgetAirlineCode] = sessionStorageAccessor("airlineCode");

  const dynamicImagePath = new URL(
    `../../plugins/${SgetAirlineCode() || props?.airline}/assets/images/loginLogo.svg`,
    import.meta.url
  ).href;

  return (
    <img 
      id="landingLogo" 
      src={dynamicImagePath} 
      alt="logo" 
      className="pointer"
      style={{ maxWidth: "100%", height: "50px", marginBottom: "10px" }}
      onClick={() => redirect(defaultRoute)}
    />
  );
};

export {
  ThemeIcon,
  ThemePreviewIcon,
  ThemeChecked,
  LandingLogo,
};