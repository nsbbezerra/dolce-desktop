import React from "react";
import {
  Flex,
  Icon,
  Heading,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import config from "../configs/index";
import { useHistory } from "react-router-dom";
import { FaTimes } from "react-icons/fa";

export default function HeaderApp({ title, icon }) {
  const { push } = useHistory();
  const { colorMode } = useColorMode();
  return (
    <>
      <Flex
        shadow="md"
        rounded="md"
        pt={1}
        pb={1}
        pl={3}
        pr={2}
        justify="space-between"
        align="center"
        bg={
          colorMode === "dark" ? config.headerapp.dark : config.headerapp.light
        }
      >
        <Flex>
          <Icon as={icon} mr={3} />
          <Heading size="sm">{title}</Heading>
        </Flex>
        <IconButton
          aria-label="Search database"
          icon={<FaTimes />}
          size="xs"
          isRound
          colorScheme="red"
          onClick={() => push("/")}
        />
      </Flex>
    </>
  );
}
