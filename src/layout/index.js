import React from "react";
import { Box, Grid } from "@chakra-ui/react";
import Sider from "../components/sider";
import Header from "../components/header";

export default function Layout() {
  return (
    <Box w={"100vw"} h="100vh" maxH="100vh" maxW="100vw">
      <Header />
      <Grid templateColumns="220px 1fr" w="100%" h="91vh">
        <Box>
          <Sider />
        </Box>

        <Box></Box>
      </Grid>
    </Box>
  );
}
