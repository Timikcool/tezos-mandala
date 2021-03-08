import { Tab, TabList, Tabs } from "@chakra-ui/tabs";
import { startCase } from "lodash";
import React from "react";

const rarityFilterTypes = ["all", "seed", "unique", "eye", "tezos"];
const RaritySelector = ({ value, onChange }) => {
  const onTabChange = (index) => onChange(rarityFilterTypes[index]);
  return (
    <Tabs
      onChange={onTabChange}
      index={rarityFilterTypes.indexOf(value)}
      colorScheme="orange-tabs"
      borderTop="2px solid #e2e8f0"
      w="100%"
    >
      <TabList justifyContent="space-around">
        {rarityFilterTypes.map((type) => (
          <Tab padding="1rem">{startCase(type)}</Tab>
        ))}
      </TabList>
    </Tabs>
  );
};

export default RaritySelector;
