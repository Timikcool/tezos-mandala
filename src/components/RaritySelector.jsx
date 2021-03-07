import { Tab, TabList, Tabs } from "@chakra-ui/tabs";
import { startCase } from "lodash";
import React from "react";

const rarityFilterTypes = ["all", "seed", "unique", "eye", "tezos"];
const RaritySelector = ({ value, onChange }) => {
  const onTabChange = (index) => onChange(rarityFilterTypes[index]);
  return (
    <Tabs onChange={onTabChange} index={rarityFilterTypes.indexOf(value)}>
      <TabList>
        {rarityFilterTypes.map((type) => (
          <Tab>{startCase(type)}</Tab>
        ))}
      </TabList>
    </Tabs>
  );
};

export default RaritySelector;
