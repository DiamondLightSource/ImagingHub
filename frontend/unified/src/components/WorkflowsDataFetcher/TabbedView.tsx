import { Tab, Tabs } from "@mui/material";
import { useState } from "react";

const TAB_TITLES = ["Process", "View"];

export const TabbedView = () => {
  const [tabIndex, setTabIndex] = useState<number>(0);

  return (
    <>
      <Tabs
        value={tabIndex}
        onChange={(_, newValue: number) => setTabIndex(newValue)}
      >
        {TAB_TITLES.map((title) => (
          <Tab key={title} label={title} />
        ))}
      </Tabs>
      {TAB_TITLES.map((_, idx) => (
        <TabContent key={idx} index={idx} selectedIndex={tabIndex} />
      ))}
    </>
  );
};

type TabContentProps = {
  index: number;
  selectedIndex: number;
};

const TabContent = ({ index, selectedIndex }: TabContentProps) => {
  return <div hidden={index !== selectedIndex}>{`Tab index: ${index}`}</div>;
};
