import React from "react";
import { Box, Grid } from "@chakra-ui/react";
import Sider from "../components/sider";
import Header from "../components/header";

import Routes from "../routes/index";

export default function Layout() {
  return (
    <Box w={"100vw"} h="100vh" maxH="100vh" maxW="100vw">
      <Header />
      <Grid templateColumns="220px 1fr" w="100%" h="91vh">
        <Box>
          <Sider />
        </Box>

        <Box p={3}>
          <Box w="100%" h="100%" maxH="100%" maxW="100%" overflow="auto" p={3}>
            <Routes />
          </Box>
        </Box>
      </Grid>
    </Box>
  );
}
