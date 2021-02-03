import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box } from "@chakra-ui/react";
import config from "../../../configs/index";
import HeaderApp from "../../../components/headerApp";
import { FaClipboardList } from "react-icons/fa";

import Save from "./save";
import List from "./list";

export default function PlanAccountIndex() {
  return (
    <>
      <HeaderApp title="Plano de Contas" icon={FaClipboardList} />

      <Box borderWidth="1px" shadow="md" rounded="md" p={3} mt="25px">
        <Tabs variant="enclosed" colorScheme={config.tabs}>
          <TabList>
            <Tab>Cadastro</Tab>
            <Tab>Listagem</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Save />
            </TabPanel>
            <TabPanel>
              <List />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
}
