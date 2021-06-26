import React, { useEffect, useState } from "react";
import { Box, Tabs, TabList, Tab, TabPanel, TabPanels } from "@chakra-ui/react";
import HeaderApp from "../../../components/headerApp";
import { AiOutlineFall } from "react-icons/ai";
import config from "../../../configs/index";

import Save from "./save";
import List from "./list";

export default function ExpensesIndex() {
  const [index, setIndex] = useState(0);

  return (
    <>
      <HeaderApp title="Contas a Pagar" icon={AiOutlineFall} />

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
