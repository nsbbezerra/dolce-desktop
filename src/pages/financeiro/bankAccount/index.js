import React from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box } from "@chakra-ui/react";
import config from "../../../configs/index";
import HeaderApp from "../../../components/headerApp";
import { AiFillBank } from "react-icons/ai";

import Save from "./save";

export default function BankAccountIndex() {
  return (
    <>
      <HeaderApp title="Contas Bancárias" icon={AiFillBank} />

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
              <p>two!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
}
