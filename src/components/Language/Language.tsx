/**
 * Title       : Language component
 * Description : This component provides a language selector with a dropdown menu, allowing users to switch the language of the application.
 *               It leverages Ant Design's `Select` component and includes functionality to detect clicks outside the dropdown for closing it.
 *               Additionally, it dynamically loads available languages based on configuration from Redux and supports language switching.
 */
import { Select, Typography } from "antd";
import { useLang } from "@/hooks/Language.hook";
import "./Language.scss";
import { useEffect, useState, useRef, memo } from "react";
// import { useAppSelector } from "@/hooks/App.hook";
import CFG from "@/config/config.json"
const { Text } = Typography;

/**
 * Language component allows users to select and change the application's language.
 * It supports dynamic dropdown visibility and ensures the dropdown closes when clicking outside.
 * It also retrieves language configuration from Redux.
 * @returns A language selector dropdown component.
 */
const Language = () => {
  
  /* --- Hook variables --- */
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { lang, changeLang } = useLang(); // Custom hook for language management that provides current language and the function to change it

  // /* --- Store variables --- */
  // const { CFG } = useAppSelector((state) => state.SystemSettingsReducer); // Retrieve configuration data from Redux, specifically the language settings

  /* --- State variables --- */
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Local state to manage whether the dropdown is open or closed

  useEffect(() => {
    if (isDropdownOpen) {
      // Add an event listener when the dropdown is open to detect outside clicks
      document.addEventListener("click", handleClickOutside);
    } else {
      // Remove the event listener when the dropdown is closed
      document.removeEventListener("click", handleClickOutside);
    }
    // Cleanup function to remove the event listener when the component unmounts or before the effect runs again
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);

  /**
   * Function to handle language change when an option is selected from the dropdown.
   * @param value - The selected language code (e.g., 'en' for English)
   */
  const changeLanguage = (value: string) => {
    changeLang(value); // Use the custom hook to change the language of the app
    setIsDropdownOpen(false); // Close the dropdown after a language is selected
  };

  /**
   * Function to toggle the state of the dropdown (open or closed).
   * @param open - Boolean value indicating whether the dropdown is open
   */
  const toggleDropdown = (open: boolean) => {
    setIsDropdownOpen(open);
  };

  /**
   * Function to handle clicks outside of the dropdown to close it.
   * @param event - MouseEvent object that contains information about the click
   */
  const handleClickOutside = (event: MouseEvent) => {
    // Check if the click is outside the dropdown element by comparing event target
    if (
      dropdownRef.current &&  // Ensure the dropdown reference exists
      !dropdownRef.current.contains(event.target as Node)  // Check if the click target is inside the dropdown
    ) {
      setIsDropdownOpen(false); // Close the dropdown if the click is outside the dropdown
    }
  };

  return (
    <div
      className="cls-languageContainer"
      data-testid="lang"
      ref={dropdownRef}  // Assign the dropdown reference to detect outside clicks
    >
      <Select
        defaultValue={CFG?.site?.language?.default}
        value={lang}
        onChange={changeLanguage}  // Trigger the language change when a new language is selected
        suffixIcon={
          <Text className="Infi-04_DropdownArrow p-clr cls-dropdown-icon"></Text>
        }
        variant="borderless"  // Borderless style for the Select component
        onOpenChange={toggleDropdown}  // Update dropdown visibility state when it is opened/closed
        style={{width:  105}}
      >
        {/* Map through the available languages from the configuration */}
        {CFG?.site?.language?.available.map((option: any) => {
          return (
            <Select.Option 
              key={option.code}
              value={option.code}  // Language code for the option value
              className="cls-language-select d-block"
            >
              {/* Display the country flag and language name */}
              <img 
                className="cls-flag-img" 
                src={
                  new URL(
                    `../../plugins/${CFG?.airline_code}/assets/images/language/${option.flag}.webp`,
                    import.meta.url
                  ).href
                } 
                alt={`${option.text} flag`}  // Image source for the flag, dynamically loaded based on the airline code and configuration
              />
              {option.text}  {/* Display the language name */}
            </Select.Option>
          );
        })}
      </Select>
    </div>
  );
};

export default memo(Language);
