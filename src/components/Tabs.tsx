import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { TabKey } from "./Adventure";

interface TabData {
  value: string;
  label: string;
  wrapped?: boolean;
}

interface GenericTabsProps {
  tabs: TabData[];
  defaultValue?: TabKey;
  onChange?: (value: TabKey) => void;
}

export const GenericTabs: React.FC<GenericTabsProps> = ({
  tabs,
  defaultValue,
  onChange,
}) => {
  const [value, setValue] = React.useState(defaultValue || tabs[0]?.value);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    onChange?.(newValue as TabKey);
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: { xs: "100%", md: "80%" },
        margin: "auto",
        justifyContent: "center",
        borderColor: "divider",
        mb: { xs: 2, md: 3 }
      }}
    >
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="dynamic tabs"
        indicatorColor="secondary"
        textColor="secondary"
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{
          width: "100%",
          "& .MuiTabs-flexContainer": {
            gap: { xs: 1, md: 2 }
          }
        }}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.value}
            value={tab.value}
            label={tab.label}
            wrapped={tab.wrapped}
            sx={{
              fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
              minWidth: { xs: "auto", md: "120px" },
              px: { xs: 2, md: 3 }
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};
