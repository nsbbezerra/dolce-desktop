import React, { useState } from "react";
import { Box, Tabs, TabList, Tab, TabPanel, TabPanels } from "@chakra-ui/react";
import HeaderApp from "../../components/headerApp";
import { FaFileImport } from "react-icons/fa";
import config from "../../configs/index";

import Save from "./xmlimporter";
import List from "./xmlList";

export default function CheckIndex() {
  const [index, setIndex] = useState(0);

  return (
    <>
      <HeaderApp title="Importar XML" icon={FaFileImport} />

      <Box borderWidth="1px" shadow="md" rounded="md" p={3} mt="25px">
        <Tabs
          variant="enclosed"
          colorScheme={config.tabs}
          index={index}
          onChange={(ind) => setIndex(ind)}
        >
          <TabList>
            <Tab>Importar Arquivo</Tab>
            <Tab>Produtos Importados</Tab>
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
