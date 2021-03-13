import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Button,
  Tooltip,
  Switch,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  Grid,
  Input,
  Flex,
  Text,
} from "@chakra-ui/react";
import config from "../../../configs/index";
import { FaEdit, FaSave } from "react-icons/fa";
import Lottie from "../../../components/lottie";
import emptyAnimation from "../../../animations/empty.json";
import { useEmployee } from "../../../context/Employee";
import api from "../../../configs/axios";
import useFecth from "../../../hooks/useFetch";
import { mutate as mutateGlobal } from "swr";

export default function ListPayForm() {
  const { employee } = useEmployee();
  const { data, error, mutate } = useFecth("/payForm");

  const [modalBankAccount, setModalBankAccount] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [modalType, setModalType] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);

  const [payForms, setPayForms] = useState([]);
  const [banks, setBanks] = useState([]);

  useEffect(() => {
    console.log(data);
    if (data) {
      setPayForms(data.payForms);
      setBanks(data.banks);
    }
  }, [data]);

  return (
    <>
      {payForms.length === 0 ? (
        <Flex justify="center" align="center" direction="column">
          <Lottie animation={emptyAnimation} height={200} width={200} />
          <Text>Nenhuma forma de pagamento para mostrar</Text>
        </Flex>
      ) : (
        <Table size="sm">
          <Thead fontWeight="700">
            <Tr>
              <Td>Forma de Pagamento</Td>
              <Td>Conta Bancária</Td>
              <Td>Status</Td>
              <Td>Nº Parcelas</Td>
              <Td>Intervalo</Td>
              <Td>Tipo</Td>
              <Td w="12%">Ativo no Site?</Td>
              <Td w="10%"></Td>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Dinheiro</Td>
              <Td>
                <Tooltip label="Clique para alterar" hasArrow>
                  <Button
                    isTruncated
                    noOfLines={1}
                    variant="link"
                    colorScheme={config.buttons}
                    size="sm"
                    onClick={() => setModalBankAccount(true)}
                  >
                    Caixa Econômica
                  </Button>
                </Tooltip>
              </Td>
              <Td>
                <Tooltip label="Clique para alterar" hasArrow>
                  <Button
                    isTruncated
                    noOfLines={1}
                    variant="link"
                    colorScheme={config.buttons}
                    size="sm"
                    onClick={() => setModalStatus(true)}
                  >
                    À Vista
                  </Button>
                </Tooltip>
              </Td>
              <Td>10</Td>
              <Td>30 Dias</Td>
              <Td>
                <Tooltip label="Clique para alterar" hasArrow>
                  <Button
                    isTruncated
                    noOfLines={1}
                    variant="link"
                    colorScheme={config.buttons}
                    size="sm"
                    onClick={() => setModalType(true)}
                  >
                    Dinheiro
                  </Button>
                </Tooltip>
              </Td>
              <Td w="12%">
                <Switch colorScheme={config.switchs} />
              </Td>
              <Td w="10%">
                <Button
                  leftIcon={<FaEdit />}
                  size="sm"
                  colorScheme={config.buttons}
                  isFullWidth
                  onClick={() => setModalEdit(true)}
                >
                  Editar
                </Button>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      )}

      <Modal
        isOpen={modalBankAccount}
        onClose={() => setModalBankAccount(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Alterar Conta Bancária</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Conta Bancária</FormLabel>
              <Select
                placeholder="Selecione"
                variant="outline"
                focusBorderColor={config.inputs}
              >
                <option value="credit">Receita</option>
                <option value="debit">Despesa</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme={config.buttons} leftIcon={<FaSave />}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalStatus}
        onClose={() => setModalStatus(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Alterar Status do Pagamento</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Status do Pagamento</FormLabel>
              <Select
                placeholder="Selecione"
                variant="outline"
                focusBorderColor={config.inputs}
              >
                <option value="credit">À Vista</option>
                <option value="debit">Parcelado</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme={config.buttons} leftIcon={<FaSave />}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={modalType} onClose={() => setModalType(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Alterar Tipo do Pagamento</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Tipo de Pagamento</FormLabel>
              <Select
                placeholder="Selecione"
                variant="outline"
                focusBorderColor={config.inputs}
              >
                <option value="credit">Dinheiro</option>
                <option value="credit">Boleto</option>
                <option value="debit">Cartão de Crédito</option>
                <option value="debit">Cartão de Débito</option>
                <option value="debit">Duplicata</option>
                <option value="debit">Transferência</option>
                <option value="debit">Cheque</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme={config.buttons} leftIcon={<FaSave />}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalEdit}
        onClose={() => setModalEdit(false)}
        isCentered
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Forma de Pagamento</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(1, 1fr)" gap="15px" mb={3}>
              <FormControl isRequired>
                <FormLabel>Forma de Pagamento</FormLabel>
                <Input
                  type="text"
                  placeholder="Forma de Pagamento"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
            </Grid>
            <Grid templateColumns="repeat(2, 1fr)" gap="15px">
              <FormControl isRequired>
                <FormLabel>Nº max. de Parcelas</FormLabel>
                <Input
                  type="number"
                  placeholder="Nº max. de Parcelas"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Intervalo de Dias</FormLabel>
                <Input
                  type="number"
                  placeholder="Intervalo de Dias"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
            </Grid>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme={config.buttons} leftIcon={<FaSave />}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
