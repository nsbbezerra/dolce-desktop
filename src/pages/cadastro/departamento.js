import React from "react";
import {
  Flex,
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
import { FaSave, FaImage } from "react-icons/fa";
import { AiFillShop } from "react-icons/ai";
import config from "../../configs";
import HeaderApp from "../../components/headerApp";
import { InputFile, File } from "../../style/uploader";

export default function Departamento() {
  const { colorMode } = useColorMode();
  return (
    <>
      <HeaderApp title="Cadastro de Departamentos" icon={AiFillShop} />

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
