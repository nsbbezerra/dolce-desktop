import React, { useState } from "react";
import { Box, Tabs, TabList, Tab, TabPanel, TabPanels } from "@chakra-ui/react";
import HeaderApp from "../../../components/headerApp";
import { FaCreditCard } from "react-icons/fa";
import config from "../../../configs/index";

import Save from "./save";
import List from "./list";

export default function PayFormIndex() {
  const [index, setIndex] = useState(0);

  return (
    <>
      <HeaderApp title="Forma de Pagamento" icon={FaCreditCard} />

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
