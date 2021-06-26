import React, { useState } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box } from "@chakra-ui/react";
import config from "../../../configs/index";
import HeaderApp from "../../../components/headerApp";
import { FaClipboardList } from "react-icons/fa";

import Save from "./save";
import List from "./list";

export default function PlanAccountIndex() {
  const [index, setIndex] = useState(0);

  return (
    <>
      <HeaderApp title="Plano de Contas" icon={FaClipboardList} />

      <Box borderWidth="1px" shadow="md" rounded="md" p={3} mt="25px">
        <Tabs
          variant="enclosed"
          colorScheme={config.tabs}
          index={index}
          onChange={(ind) => setIndex(ind)}
        >
          <TabList>
            <Tab>Cadastro</Tab>
            <Tab>Listagem</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>{index === 0 && <Save />}</TabPanel>
            <TabPanel>{index === 1 && <List />}</TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
}
