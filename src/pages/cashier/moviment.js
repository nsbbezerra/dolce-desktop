import React, { useEffect, useState, useRef } from "react";
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
  useToast,
  InputRightElement,
  Text,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import config from "../../configs/index";
import HeaderApp from "../../components/headerApp";
import {
  FaCalculator,
  FaCashRegister,
  FaBookOpen,
  FaLockOpen,
  FaCalendarAlt,
} from "react-icons/fa";
import { useHistory } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { useEmployee } from "../../context/Employee";
import DatePicker, { registerLocale } from "react-datepicker";
import pt_br from "date-fns/locale/pt-BR";
import Lottie from "../../components/lottie";
import emptyAnimation from "../../animations/empty.json";
import api from "../../configs/axios";
import * as dateFns from "date-fns";

registerLocale("pt_br", pt_br);

export default function MovimentCashier() {
  const date = new Date();
  const year = date.getFullYear();

  const { push } = useHistory();
  const { employee } = useEmployee();
  const toast = useToast();
  const initialRef = useRef();
  const [find, setFind] = useState("1");
  const [init, setInit] = useState("0");
  const [final, setFinal] = useState("0");

  const { data, error } = useFetch(`/cashier/${find}/${init}/${final}`);

  const [modalOpen, setModalOpen] = useState(false);

  const [cashier, setCashier] = useState([]);
  const [value, setValue] = useState("0.00");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(data);
    if (data) {
      setCashier(data);
    }
  }, [data]);

  function routing(rt) {
    push(rt);
  }

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom",
      duration: 8000,
      isClosable: true,
    });
  }

  if (error) {
    if (error.message === "Network Error") {
      alert(
        "Sem conexão com o servidor, verifique sua conexão com a internet."
      );
    } else {
      const statusCode = error.response.status || 400;
      const typeError =
        error.response.data.message || "Ocorreu um erro ao buscar";
      const errorMesg = error.response.data.errorMessage || statusCode;
      const errorMessageFinal = `${typeError} + Cod: ${errorMesg}`;
      showToast(
        errorMessageFinal,
        "error",
        statusCode === 401 ? "Erro Autorização" : "Erro no Cadastro"
      );
    }
  }

  const CustomInputPicker = ({ value, onClick }) => (
    <InputGroup>
      <Input
        focusBorderColor={config.inputs}
        value={value}
        onClick={onClick}
        w="100%"
      />
      <InputRightElement pointerEvents="none" children={<FaCalendarAlt />} />
    </InputGroup>
  );

  function handleFind(key) {
    if (key === "1") {
      setFind(key);
      setInit(new Date());
      setFinal(new Date());
    }
    if (key === "2") {
      setInit(new Date().toLocaleString("pt-BR", { month: "long" }).toString());
      setFinal(new Date().getFullYear().toString());
      setFind(key);
    }
    if (key === "3") {
      setInit(new Date());
      setFinal(new Date());
      setFind(key);
    }
  }

  async function openCashier() {
    setLoading(true);

    try {
      const response = await api.post(
        "/cashier",
        {
          employee_id: employee.user,
          open_value: value,
        },
        {
          headers: { "x-access-token": employee.token },
        }
      );
      showToast(response.data.message, "success", "Sucesso");
      setLoading(false);
      setModalOpen(false);
    } catch (error) {
      setLoading(false);
      if (error.message === "Network Error") {
        alert(
          "Sem conexão com o servidor, verifique sua conexão com a internet."
        );
        return false;
      }
      const statusCode = error.response.status || 400;
      const typeError =
        error.response.data.message || "Ocorreu um erro ao salvar";
      const errorMesg = error.response.data.errorMessage || statusCode;
      const errorMessageFinal = `${typeError} + Cod: ${errorMesg}`;
      showToast(
        errorMessageFinal,
        "error",
        statusCode === 401 ? "Erro Autorização" : "Erro no Cadastro"
      );
    }
  }

  return (
    <>
      <HeaderApp title="Gerenciar Caixa" icon={FaCalculator} />

      <Box borderWidth="1px" shadow="md" rounded="md" p={3} mt="25px">
        <Text mb={2}>Selecione uma opção de busca:</Text>
        <Grid templateColumns="1fr 1fr" gap="15px">
          <Select
            placeholder="Selecione uma opção de busca"
            focusBorderColor={config.inputs}
            value={find}
            onChange={(e) => handleFind(e.target.value)}
          >
            <option value={"1"}>Mês Atual</option>
            <option value={"2"}>Por Período</option>
            <option value={"3"}>Por Intervalo</option>
          </Select>

          {find === "1" && (
            <Input
              type="text"
              placeholder="Digite para buscar"
              focusBorderColor={config.inputs}
              isReadOnly
              isDisabled
            />
          )}

          {find === "2" && (
            <Grid templateColumns="1fr 1fr" gap="15px">
              <Select
                placeholder="Selecione um Mês"
                focusBorderColor={config.inputs}
                value={init}
                onChange={(e) => setInit(e.target.value)}
              >
                <option value="janeiro">Janeiro</option>
                <option value="fevereiro">Fevereiro</option>
                <option value="março">Março</option>
                <option value="abril">Abril</option>
                <option value="maio">Maio</option>
                <option value="junho">Junho</option>
                <option value="julho">Julho</option>
                <option value="agosto">Agosto</option>
                <option value="setembro">Setembro</option>
                <option value="outubro">Outubro</option>
                <option value="novembro">Novembro</option>
                <option value="dezembro">Dezembro</option>
              </Select>
              <Select
                placeholder="Selecione um Ano"
                focusBorderColor={config.inputs}
                value={final}
                onChange={(e) => setFinal(e.target.value.toString())}
              >
                <option value={year - 1}>{year - 1}</option>
                <option value={year}>{year}</option>
                <option value={year + 1}>{year + 1}</option>
              </Select>
            </Grid>
          )}

          {find === "3" && (
            <Flex justify="space-around" align="center">
              <Text mr={1}>De:</Text>
              <div className="customDatePickerWidth">
                <DatePicker
                  selected={init}
                  onChange={(date) => setInit(date)}
                  customInput={<CustomInputPicker />}
                  locale="pt_br"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
              <Text ml={1} mr={1}>
                até
              </Text>
              <div className="customDatePickerWidth">
                <DatePicker
                  selected={final}
                  onChange={(date) => setFinal(date)}
                  customInput={<CustomInputPicker />}
                  locale="pt_br"
                  dateFormat="dd/MM/yyyy"
                />
              </div>
            </Flex>
          )}
        </Grid>

        {cashier.length === 0 ? (
          <Flex justify="center" align="center" direction="column">
            <Lottie animation={emptyAnimation} height={200} width={200} />
            <Text>Nenhum Caixa para mostrar</Text>
          </Flex>
        ) : (
          <>
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
                {cashier.map((cash) => (
                  <Tr key={cash.id}>
                    <Td>{cash.employee_name}</Td>
                    <Td w="8%" textAlign="center">
                      {(cash.status === "open" && (
                        <Tag colorScheme="green">Aberto</Tag>
                      )) ||
                        (cash.status === "freeze" && (
                          <Tag colorScheme="yellow">Parado</Tag>
                        )) ||
                        (cash.status === "close" && (
                          <Tag colorScheme="red">Fechado</Tag>
                        ))}
                    </Td>
                    <Td w="13%" textAlign="center">
                      {dateFns.format(new Date(cash.open_date), "dd/MM/yyyy")}
                    </Td>
                    <Td w="13%" textAlign="center">
                      {cash.close_date === null
                        ? "-"
                        : dateFns.format(
                            new Date(cash.close_date),
                            "dd/MM/yyyy"
                          )}
                    </Td>
                    <Td w="13%" isNumeric>
                      {parseFloat(cash.open_value).toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </Td>
                    <Td w="13%" isNumeric>
                      {cash.close_value === null
                        ? "-"
                        : parseFloat(cash.close_value).toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })}
                    </Td>
                    <Td w="12%">
                      <Button
                        leftIcon={<FaCashRegister />}
                        colorScheme={config.buttons}
                        size="xs"
                        onClick={() => routing(`/cashier/${cash.id}`)}
                      >
                        Ir para o Caixa
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </>
        )}

        <Button
          leftIcon={<FaCashRegister />}
          size="lg"
          colorScheme={config.buttons}
          onClick={() => setModalOpen(true)}
          mt={5}
        >
          Novo Caixa
        </Button>
      </Box>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        isCentered
        initialFocusRef={initialRef}
        size="sm"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Abrir Caixa</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Valor de Abertura</FormLabel>
              <InputGroup size="lg">
                <InputLeftAddon>R$</InputLeftAddon>
                <NumberInput
                  focusBorderColor={config.inputs}
                  size="lg"
                  w="100%"
                  precision={2}
                  step={0.01}
                  value={value}
                  onChange={(e) => setValue(e)}
                >
                  <NumberInputField
                    borderTopLeftRadius={0}
                    borderBottomLeftRadius={0}
                    ref={initialRef}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </InputGroup>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              leftIcon={<FaLockOpen />}
              colorScheme={config.buttons}
              isLoading={loading}
              onClick={() => openCashier()}
            >
              Abrir
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
