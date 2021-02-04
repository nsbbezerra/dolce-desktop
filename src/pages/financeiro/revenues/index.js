import React from "react";
import { Box, Tabs, TabList, Tab, TabPanel, TabPanels } from "@chakra-ui/react";
import HeaderApp from "../../../components/headerApp";
import { AiOutlineRise } from "react-icons/ai";
import config from "../../../configs/index";

import Save from "./save";
import List from "./list";

export default function RevenuesIndex() {
  return (
    <>
      <HeaderApp title="Contas a Receber" icon={AiOutlineRise} />

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
