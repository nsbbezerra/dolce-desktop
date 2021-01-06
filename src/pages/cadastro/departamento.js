import React from "react";
import {
  Flex,
  Icon,
  IconButton,
  Heading,
  Box,
  Grid,
  Text,
  FormLabel,
  FormControl,
  Input,
  Textarea,
  Divider,
  Button,
  useColorMode,
} from "@chakra-ui/react";
import { FaTimes, FaSave, FaImage } from "react-icons/fa";
import { AiFillShop } from "react-icons/ai";
import config from "../../configs";
import { useHistory } from "react-router-dom";

import { InputFile, File } from "../../style/uploader";

export default function Departamento() {
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
        bg={config.headerapp}
      >
        <Flex>
          <Icon as={AiFillShop} mr={3} />
          <Heading size="sm">Cadastro de Departamentos</Heading>
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

      <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
        <Grid templateColumns="250px 1fr" gap="15px">
          <Box w="250px" h="250px">
            <InputFile alt={250} lar={250} cor={colorMode}>
              <File type="file" />
              <FaImage style={{ fontSize: 50, marginBottom: 20 }} />
              <Text>Insira uma imagem 300x300 pixels, de até 500kb</Text>
            </InputFile>
          </Box>

          <Box>
            <FormControl id="name" isRequired>
              <FormLabel>Nome do Departamento</FormLabel>
              <Input placeholder="Nome" focusBorderColor={config.inputs} />
            </FormControl>
            <FormControl id="desc" isRequired mt={3}>
              <FormLabel>Descrição do Departamento</FormLabel>
              <Textarea
                placeholder="Descrição"
                focusBorderColor={config.inputs}
                resize="none"
              />
            </FormControl>
            <Divider mt={5} mb={5} />
            <Flex justify="flex-end">
              <Button leftIcon={<FaSave />} colorScheme="blue" size="lg">
                Cadastrar
              </Button>
            </Flex>
          </Box>
        </Grid>
      </Box>
    </>
  );
}
