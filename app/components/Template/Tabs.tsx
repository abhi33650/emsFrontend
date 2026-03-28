"use client";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import React,{ useState } from "react";
import { Tabb } from "@/Interface/Template/interfaces";
interface TabProps { onTabChange: (page: string) => void; tabs:Tabb[]; defaultTab: string; };
const AllTabs: React.FC<TabProps> = ({ defaultTab,tabs,onTabChange }) => {
    const [selectedTab, setSelectedPage] = useState<string>(defaultTab);
    const handleChange= (event: React.SyntheticEvent, newValue: string) => {
    setSelectedPage(newValue);
    onTabChange(newValue);
  };
  return (
    <TabContext value={selectedTab}>
      <Tabs value={selectedTab} onChange={handleChange} aria-label="Capstone Tab" variant="scrollable" scrollButtons="auto">
        {tabs.map((tab) => (
          <Tab key={tab.value} icon={tab.icon} label={tab.label} iconPosition="start" value={tab.value} disabled={tab.disabled}/>
        ))}
      </Tabs>
    </TabContext>
  );
};
export default AllTabs;