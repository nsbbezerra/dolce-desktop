import React, { useState } from "react";
import {
  IconButton,
  Box,
  Grid,
  FormControl,
  Input,
  Select,
  FormLabel,
  Button,
  Divider,
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
import { FaMapMarkedAlt, FaSave, FaSearch, FaCheck } from "react-icons/fa";
import config from "../../configs";
import Headerapp from "../../components/headerApp";
import InputMask from "react-input-mask";

export default function Endereco() {
  const [modalClient, setModalClient] = useState(false);

  return (
    <>
      <Headerapp title="Cadastro de Endereços" icon={FaMapMarkedAlt} />

      <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
        <Grid templateColumns="1fr 200px" gap="15px">
          <Input
            placeholder="Cliente"
            focusBorderColor={config.inputs}
            isReadOnly
          />
          <Button leftIcon={<FaSearch />} onClick={() => setModalClient(true)}>
            Buscar Cliente
          </Button>
        </Grid>
        <Divider mt={5} mb={5} />
        <Grid templateColumns="1fr 100px" gap="15px">
          <FormControl id="avenue" isRequired>
            <FormLabel>Logradouro</FormLabel>
            <Input placeholder="Logradouro" focusBorderColor={config.inputs} />
          </FormControl>
          <FormControl id="number" isRequired>
            <FormLabel>Numero</FormLabel>
            <Input
              placeholder="Numero"
              focusBorderColor={config.inputs}
              type="number"
            />
          </FormControl>
        </Grid>
        <Grid templateColumns="1fr" gap="15px" mt={3}>
          <FormControl id="comp">
            <FormLabel>Complemento</FormLabel>
            <Input placeholder="Complemento" focusBorderColor={config.inputs} />
          </FormControl>
        </Grid>
        <Grid templateColumns="1fr 1fr 180px" gap="15px" mt={3}>
          <FormControl id="cep" isRequired>
            <FormLabel>CEP</FormLabel>
            <InputMask
              mask="99.999-999"
              className="mask-chakra"
              placeholder="CEP"
            />
          </FormControl>
          <FormControl id="city" isRequired>
            <FormLabel>Cidade</FormLabel>
            <Input
              placeholder="Cidade"
              focusBorderColor={config.inputs}
              type="text"
            />
          </FormControl>
          <FormControl id="uf" isRequired>
            <FormLabel>UF</FormLabel>
            <Select
              placeholder="Selecione"
              variant="outline"
              focusBorderColor={config.inputs}
            >
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </Select>
          </FormControl>
        </Grid>
        <Divider mt={5} mb={5} />
        <Button leftIcon={<FaSave />} colorScheme="blue" size="lg">
          Cadastrar
        </Button>
      </Box>

      <Modal
        isOpen={modalClient}
        onClose={() => setModalClient(false)}
        size="xl"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxW="50rem">
          <ModalHeader>Buscar Cliente</ModalHeader>
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
                      <Tooltip label="Selecionar cliente" hasArrow>
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
