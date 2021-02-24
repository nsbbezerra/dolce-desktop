import React, { useState } from "react";
import {
  Grid,
  Select,
  Input,
  Button,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Switch,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import config from "../../../configs/index";
import { FaSearch, FaUserFriends } from "react-icons/fa";
import HeaderApp from "../../../components/headerApp";
import InputMask from "react-input-mask";

export default function ListClients() {
  const [modalAddress, setModalAddress] = useState(false);

  return (
    <>
      <HeaderApp title="Gerenciar Clientes" icon={FaUserFriends} />

      <Box borderWidth="1px" shadow="md" rounded="md" p={3} mt="25px">
        <Grid templateColumns="1fr 1fr 200px" gap="15px">
          <Select
            placeholder="Selecione uma opção de busca"
            focusBorderColor={config.inputs}
          >
            <option value="option1">Todas as contas</option>
            <option value="option2">Buscar pelo nome</option>
            <option value="option3">Buscar ativas</option>
            <option value="option4">Buscar bloqueadas</option>
          </Select>

          <Input
            type="text"
            placeholder="Digite para buscar"
            focusBorderColor={config.inputs}
          />

          <Button
            leftIcon={<FaSearch />}
            colorScheme={config.buttons}
            variant="outline"
          >
            Buscar
          </Button>
        </Grid>

        <Table size="sm" mt="25px">
          <Thead fontWeight="700">
            <Tr>
              <Td>Cliente</Td>
              <Td textAlign="center" w="12%">
                CFP
              </Td>
              <Td textAlign="center" w="15%">
                Email
              </Td>
              <Td textAlign="center" w="12%">
                Telefone
              </Td>
              <Td w="6%" textAlign="center">
                Ativo?
              </Td>
              <Td w="7%" textAlign="center">
                Restrito?
              </Td>
              <Td w="10%" textAlign="center">
                Endereço
              </Td>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Natanael dos Santos Bezerra</Td>
              <Td textAlign="center" w="12%">
                017.067.731-10
              </Td>
              <Td textAlign="center" w="15%">
                contato.nk.info@gmail.com
              </Td>
              <Td textAlign="center" w="12%">
                (63) 99971-1716
              </Td>
              <Td w="6%" textAlign="center">
                <Switch colorScheme={config.switchs} size="sm" />
              </Td>
              <Td w="7%" textAlign="center">
                <Switch colorScheme={config.switchs} size="sm" />
              </Td>
              <Td w="10%" textAlign="center">
                <Button
                  leftIcon={<FaSearch />}
                  colorScheme={config.buttons}
                  size="sm"
                  isFullWidth
                  onClick={() => setModalAddress(true)}
                >
                  Visualizar
                </Button>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>

      <Modal
        isOpen={modalAddress}
        isCentered
        size="xl"
        onClose={() => setModalAddress(false)}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxW="70rem">
          <ModalHeader>Visualizar Endereço</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={5}>
            <Grid templateColumns="1fr 100px" gap="15px">
              <FormControl id="avenue">
                <FormLabel>Logradouro</FormLabel>
                <Input
                  placeholder="Logradouro"
                  focusBorderColor={config.inputs}
                  isReadOnly
                />
              </FormControl>
              <FormControl id="number">
                <FormLabel>Numero</FormLabel>
                <Input
                  placeholder="Numero"
                  focusBorderColor={config.inputs}
                  type="number"
                  isReadOnly
                />
              </FormControl>
            </Grid>
            <Grid templateColumns="1fr" gap="15px" mt={3}>
              <FormControl id="comp">
                <FormLabel>Complemento</FormLabel>
                <Input
                  placeholder="Complemento"
                  focusBorderColor={config.inputs}
                  isReadOnly
                />
              </FormControl>
            </Grid>
            <Grid templateColumns="1fr 1fr 100px" gap="15px" mt={3}>
              <FormControl id="cep">
                <FormLabel>CEP</FormLabel>
                <InputMask
                  mask="99.999-999"
                  className="mask-chakra"
                  placeholder="CEP"
                  readOnly
                />
              </FormControl>
              <FormControl id="city">
                <FormLabel>Cidade</FormLabel>
                <Input
                  placeholder="Cidade"
                  focusBorderColor={config.inputs}
                  type="text"
                  isReadOnly
                />
              </FormControl>
              <FormControl id="uf">
                <FormLabel>UF</FormLabel>
                <Input
                  placeholder="UF"
                  focusBorderColor={config.inputs}
                  type="text"
                  isReadOnly
                />
              </FormControl>
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
