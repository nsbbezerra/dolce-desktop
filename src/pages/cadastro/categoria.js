import React, { useState } from "react";
import {
  Flex,
  IconButton,
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  Tbody,
  Thead,
  Tr,
  Td,
  Tooltip,
} from "@chakra-ui/react";
import { FaSave, FaImage, FaTags, FaSearch, FaCheck } from "react-icons/fa";
import config from "../../configs";
import HeaderApp from "../../components/headerApp";
import { InputFile, File } from "../../style/uploader";

export default function Categoria() {
  const { colorMode } = useColorMode();
  const [modalDepartment, setModalDepartment] = useState(false);
  return (
    <>
      <HeaderApp title="Cadastro de Categorias" icon={FaTags} />

      <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
        <Grid templateColumns="1fr 200px" gap="15px">
          <Input
            placeholder="Departamento"
            focusBorderColor={config.inputs}
            isReadOnly
          />
          <Button
            leftIcon={<FaSearch />}
            onClick={() => setModalDepartment(true)}
          >
            Buscar Departamento
          </Button>
        </Grid>
        <Divider mt={5} mb={5} />
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
              <FormLabel>Nome da Categoria</FormLabel>
              <Input placeholder="Nome" focusBorderColor={config.inputs} />
            </FormControl>
            <FormControl id="desc" isRequired mt={3}>
              <FormLabel>Descrição da Categoria</FormLabel>
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

      <Modal
        isOpen={modalDepartment}
        onClose={() => setModalDepartment(false)}
        size="xl"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxW="50rem">
          <ModalHeader>Buscar Departamento</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={5}>
            <Input
              placeholder="Digite um nome para buscar"
              focusBorderColor={config.inputs}
            />

            <Box p={2} borderWidth="1px" rounded="md" mt={3}>
              <Table size="sm" variant="striped">
                <Thead fontWeight="700">
                  <Tr>
                    <Td>Nome</Td>
                    <Td w="10%">Ações</Td>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>Natanael dos Santos Bezerra</Td>
                    <Td w="10%" textAlign="center">
                      <Tooltip label="Selecionar departamento" hasArrow>
                        <IconButton
                          aria-label="Search database"
                          icon={<FaCheck />}
                          size="xs"
                          isRound
                          colorScheme="blue"
                        />
                      </Tooltip>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
