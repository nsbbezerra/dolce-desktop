import React, { useState } from "react";
import {
  Grid,
  Box,
  Select,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Switch,
  HStack,
  FormControl,
  FormLabel,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
} from "@chakra-ui/react";
import config from "../../../configs/index";
import { FaSearch, FaIdCard, FaSearchPlus, FaSave } from "react-icons/fa";
import HeaderApp from "../../../components/headerApp";
import InputMask from "react-input-mask";

export default function ListEmployee() {
  const [modalEdit, setModalEdit] = useState(false);

  return (
    <>
      <HeaderApp title="Gerenciar Colaboradores" icon={FaIdCard} />

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

          <Button leftIcon={<FaSearch />}>Buscar</Button>
        </Grid>

        <Table size="sm" mt="25px">
          <Thead fontWeight="700">
            <Tr>
              <Td>Colaborador</Td>
              <Td w="12%" textAlign="center">
                Contato
              </Td>
              <Td w="6%" textAlign="center">
                Ativo?
              </Td>
              <Td w="7%" textAlign="center">
                Comissionado?
              </Td>
              <Td w="6%" textAlign="center" isNumeric>
                Porcentagem
              </Td>
              <Td w="20%" textAlign="center">
                Permissões
              </Td>
              <Td w="13%"></Td>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Natanael dos Santos Bezerra</Td>
              <Td w="12%" textAlign="center">
                (63) 99971-1716
              </Td>
              <Td w="6%" textAlign="center">
                <Switch colorScheme={config.switchs} size="sm" />
              </Td>
              <Td w="7%" textAlign="center">
                <Switch colorScheme={config.switchs} size="sm" />
              </Td>
              <Td w="6%" textAlign="center" isNumeric>
                <Tooltip label="Clique para alterar" hasArrow>
                  <Button size="sm" variant="link" colorScheme="blue">
                    0.5%
                  </Button>
                </Tooltip>
              </Td>
              <Td w="20%" textAlign="center">
                <HStack>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="email-alerts" mb="0" fontSize="sm">
                      Total:
                    </FormLabel>
                    <Switch
                      id="email-alerts"
                      colorScheme={config.switchs}
                      size="sm"
                    />
                  </FormControl>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="email-alerts" mb="0" fontSize="sm">
                      Vendas:
                    </FormLabel>
                    <Switch
                      id="email-alerts"
                      colorScheme={config.switchs}
                      size="sm"
                    />
                  </FormControl>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="email-alerts" mb="0" fontSize="sm">
                      Caixa:
                    </FormLabel>
                    <Switch
                      id="email-alerts"
                      colorScheme={config.switchs}
                      size="sm"
                    />
                  </FormControl>
                </HStack>
              </Td>
              <Td w="13%">
                <Button
                  size="sm"
                  colorScheme="blue"
                  leftIcon={<FaSearchPlus />}
                  isFullWidth
                  onClick={() => setModalEdit(true)}
                >
                  Visualizar e Editar
                </Button>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>

      <Modal
        isOpen={modalEdit}
        isCentered
        size="xl"
        onClose={() => setModalEdit(false)}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Informação do Colaborador</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={5}>
            <Grid templateColumns="1fr" gap="15px">
              <FormControl id="avenue">
                <FormLabel>Nome</FormLabel>
                <Input placeholder="Nome" focusBorderColor={config.inputs} />
              </FormControl>
            </Grid>
            <Grid templateColumns="1fr 1fr" gap="15px" mt={3}>
              <FormControl id="phone">
                <FormLabel>Telefone</FormLabel>
                <InputMask
                  mask="(99) 99999-9999"
                  className="mask-chakra"
                  placeholder="Telefone"
                />
              </FormControl>
              <FormControl id="gender">
                <FormLabel>Genero</FormLabel>
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
          </ModalBody>
          <ModalFooter>
            <Button leftIcon={<FaSave />} colorScheme="blue">
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
