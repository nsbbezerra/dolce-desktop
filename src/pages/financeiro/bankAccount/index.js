import React, { useState } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box } from "@chakra-ui/react";
import config from "../../../configs/index";
import HeaderApp from "../../../components/headerApp";
import { AiFillBank } from "react-icons/ai";

import Save from "./save";
import List from "./list";
import Pix from "./pix";

export default function BankAccountIndex() {
  const [index, setIndex] = useState(0);

  return (
    <>
      <HeaderApp title="Contas Bancárias" icon={AiFillBank} />

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
            <Tab>PIX</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>{index === 0 && <Save />}</TabPanel>
            <TabPanel>{index === 1 && <List />}</TabPanel>
            <TabPanel>{index === 2 && <Pix />}</TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
}
