import React, { useState } from "react";
import {
  Grid,
  Box,
  Button,
  Select,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Tag,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import config from "../../configs/index";
import HeaderApp from "../../components/headerApp";
import {
  FaCalculator,
  FaSearch,
  FaCashRegister,
  FaBookOpen,
  FaLockOpen,
} from "react-icons/fa";
import { useHistory } from "react-router-dom";

export default function MovimentCashier() {
  const { push } = useHistory();

  const [modalOpen, setModalOpen] = useState(false);

  function routing(rt) {
    push(rt);
  }

  return (
    <>
      <HeaderApp title="Movimentação de Caixa" icon={FaCalculator} />

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
              <Td>Colaborador</Td>
              <Td w="8%" textAlign="center">
                Status
              </Td>
              <Td w="13%" textAlign="center">
                Data Abertura
              </Td>

              <Td w="13%" textAlign="center">
                Data Fechamento
              </Td>
              <Td w="13%" isNumeric>
                Valor de Abertura
              </Td>
              <Td w="13%" isNumeric>
                Valor de Fechamento
              </Td>
              <Td w="12%"></Td>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Natanael dos Santos Bezerra</Td>
              <Td w="8%" textAlign="center">
                <Tag colorScheme="green">Aberto</Tag>
              </Td>
              <Td w="13%" textAlign="center">
                10/10/1010
              </Td>
              <Td w="13%" textAlign="center">
                10/10/1010
              </Td>
              <Td w="13%" isNumeric>
                R$ 0,00
              </Td>
              <Td w="13%" isNumeric>
                R$ 400,00
              </Td>
              <Td w="12%">
                <Button
                  leftIcon={<FaCashRegister />}
                  colorScheme={config.buttons}
                  size="sm"
                  onClick={() => routing("/cashier")}
                >
                  Ir para o Caixa
                </Button>
              </Td>
            </Tr>
          </Tbody>
        </Table>

        <Divider mt={5} mb={5} />

        <Button
          leftIcon={<FaBookOpen />}
          size="lg"
          colorScheme={config.buttons}
          onClick={() => setModalOpen(true)}
        >
          Abrir novo Caixa
        </Button>
      </Box>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Abrir Caixa</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Valor de Abertura</FormLabel>
              <InputGroup size="lg">
                <InputLeftAddon>R$</InputLeftAddon>
                <Input focusBorderColor={config.inputs} />
              </InputGroup>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button leftIcon={<FaLockOpen />} colorScheme={config.buttons}>
              Abrir
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
