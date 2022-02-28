import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Grid,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  HStack,
  IconButton,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  ButtonGroup,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormLabel,
  InputGroup,
  Input,
  InputRightAddon,
  Textarea,
  FormControl,
  Center,
  Heading,
  Divider,
  Text,
  Icon,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  useToast,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Tag,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
import config from "../../configs/index";
import HeaderApp from "../../components/headerApp";
import {
  FaBarcode,
  FaCashRegister,
  FaChartLine,
  FaCheck,
  FaLock,
  FaPrint,
  FaSave,
  FaClipboardList,
  FaTrash,
  FaPlus,
  FaArrowRight,
  FaArrowLeft,
  FaTimes,
  FaTools,
} from "react-icons/fa";
import {
  AiOutlineBarcode,
  AiOutlineDollar,
  AiOutlineFall,
  AiOutlineRise,
} from "react-icons/ai";

import PrintMiddleware from "../../middlewares/print";
import PaymentMiddleware from "../../middlewares/payment";

import { useHistory, useParams } from "react-router-dom";

import useFetch from "../../hooks/useFetch";
import emptyAnimation from "../../animations/empty.json";
import Lottie from "../../components/lottie";
import { format } from "date-fns";
import pt_br from "date-fns/locale/pt-BR";
import sendAnimation from "../../animations/search.json";
import api from "../../configs/axios";
import { useEmployee } from "../../context/Employee";

export default function Cashier() {
  const { employee } = useEmployee();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState("0");

  const { data, error } = useFetch(`/findOrdersCashier/${page}`);

  const cancelRef = useRef();
  const { push } = useHistory();
  const { cash } = useParams();
  const toast = useToast();

  const [modalRevenue, setModalRevenue] = useState(false);
  const [modalExpense, setModalExpense] = useState(false);
  const [modalPrint, setModalPrint] = useState(false);
  const [modalPayment, setModalPayment] = useState(false);
  const [modalPayments, setModalPayments] = useState(false);
  const [modalFinish, setModalFinish] = useState(false);
  const [modalMoviment, setModalMoviment] = useState(false);
  const [modalCloseCashier, setModalCloseCashier] = useState(false);
  const [modalClose, setModalClose] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [loadingDel, setLoadingDel] = useState(false);

  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState({});
  const [payments, setPayments] = useState([]);

  const [value, setValue] = useState(0);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");

  const [ordersReport, setOrdersReport] = useState([]);
  const [cashierInfo, setCashierInfo] = useState({});
  const [payFormsReport, setPayFormsReport] = useState([]);
  const [paymentsReport, setPaymentsReport] = useState([]);
  const [revenuesReport, setRevenuesReport] = useState([]);
  const [expensesReport, setExpensesReport] = useState([]);

  const [reportLoading, setReportLoading] = useState(false);
  const [closeLoading, setCloseLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setOrders(data.orders);
      handlePagination(data.count.count);
    }
  }, [data]);

  function handlePagination(num) {
    const divisor = parseFloat(num) / 10;
    if (divisor > parseInt(divisor) && divisor < parseInt(divisor) + 1) {
      setPages(parseInt(divisor) + 1);
    } else {
      setPages(parseInt(divisor));
    }
  }

  function handleCloseCashier() {
    setModalClose(false);
    setModalCloseCashier(true);
  }

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

  async function findPaymentsByOrder(id) {
    const result = await orders.find((obj) => obj.id === id);
    setOrder(result);
    setLoadingModal(true);
    try {
      const response = await api.get(`/findPaymentsByOrder/${id}`);
      setPayments(response.data);
      setLoadingModal(false);
      setModalPayments(true);
    } catch (error) {
      setLoadingModal(false);
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

  const handleClose = () => {
    setModalPayments(false);
    setModalPayment(false);
  };

  async function delPaymentsByOrder() {
    let idOrder;
    if (JSON.stringify(order) !== "{}") {
      idOrder = order.id;
    } else {
      showToast("Nenhum pedido selecionado", "info", "Informação");
      return false;
    }
    setLoadingDel(true);
    try {
      const response = await api.delete(`/delPaymentsByOrder/${idOrder}`, {
        headers: { "x-access-token": employee.token },
      });
      showToast(response.data.message, "success", "Sucesso");
      setModalPayments(false);
      setLoadingDel(false);
      setModalPayment(true);
    } catch (error) {
      setLoadingDel(false);
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

  const handleCloseDeposit = () => {
    setValue(0);
    setDescription("");
    setModalRevenue(false);
  };

  const openDeposit = () => {
    setType("deposit");
    setModalRevenue(true);
  };

  const openWithDraw = () => {
    setType("withdraw");
    setModalExpense(true);
  };

  const handleCloseWithDraw = () => {
    setValue(0);
    setDescription("");
    setModalExpense(false);
  };

  async function convertOrderToBudget(id) {
    setLoadingModal(true);

    try {
      const response = await api.put(
        `/convertToBudget/${id}`,
        {},
        { headers: { "x-access-token": employee.token } }
      );
      const updated = await orders.filter((obj) => obj.id !== id);
      setOrders(updated);
      showToast(response.data.message, "success", "Sucesso");

      setLoadingModal(false);
    } catch (error) {
      setLoadingModal(false);
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

  async function storeHandling() {
    setLoadingDel(true);

    try {
      const response = await api.post(
        "/cashHandling",
        {
          description,
          value,
          cashier_id: parseInt(cash),
          type,
        },
        { headers: { "x-access-token": employee.token } }
      );
      showToast(response.data.message, "success", "Sucesso");
      setModalExpense(false);
      setModalRevenue(false);
      setType("");
      setDescription("");
      setValue(0);
      setLoadingDel(false);
    } catch (error) {
      setLoadingDel(false);
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

  async function handleFinish(id) {
    const result = await orders.find((obj) => obj.id === id);
    await setOrder(result);
    setTimeout(() => {
      setModalFinish(true);
    }, 100);
  }

  async function finalizeOrder() {
    if (JSON.stringify(order) === "{}") {
      showToast("Nenhuma informação do pedido", "error", "Erro");
      return false;
    }
    setLoadingDel(true);

    try {
      const response = await api.put(
        `/finalizeOrder/${order.id}`,
        { cash: parseInt(cash) },
        { headers: { "x-access-token": employee.token } }
      );
      showToast(response.data.message, "success", "Sucesso");
      const updated = await orders.filter((obj) => obj.id !== order.id);
      setOrders(updated);
      setModalFinish(false);
      setLoadingDel(false);
      setOrder({});
    } catch (error) {
      setLoadingDel(false);
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

  async function cashierReport() {
    setReportLoading(true);
    try {
      const response = await api.get(`/cashierMoviment/${cash}`);
      setCashierInfo(response.data.cashier);
      setExpensesReport(response.data.expenses);
      setOrdersReport(response.data.orders);
      setPayFormsReport(response.data.payFormsReport);
      setPaymentsReport(response.data.payments);
      setRevenuesReport(response.data.revenues);
      setModalMoviment(true);
      setReportLoading(false);
    } catch (error) {
      setReportLoading(false);
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

  function calculatePrice(list) {
    let valor = list.reduce(
      (total, numeros) => total + parseFloat(numeros.value),
      0
    );
    return parseFloat(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  async function closeCashier() {
    setCloseLoading(true);

    try {
      const response = await api.put(
        `/closeCashier/${cash}`,
        {},
        {
          headers: { "x-access-token": employee.token },
        }
      );
      showToast(response.data.message, "success", "Sucesso");
      setCloseLoading(true);
      routing("/cashiermoviment");
    } catch (error) {
      setCloseLoading(false);
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

  return (
    <>
      <HeaderApp title="Caixa Diário" icon={FaCashRegister} />
      <Grid templateColumns="220px 1fr" gap="20px" mt="25px">
        <Box>
          <Center rounded="md" p={2} bg="rgba(160, 174, 192, 0.1)" mb={5}>
            <Heading fontSize="sm">Opções</Heading>
          </Center>

          <Grid gap={3} templateColumns="1fr 1fr">
            <Button colorScheme="green" onClick={() => openDeposit()} h="80px">
              <Flex direction="column" justify="center" align="center" h="80px">
                <Icon as={AiOutlineRise} fontSize="4xl" />
                <Text fontSize="sm">Depósito</Text>
              </Flex>
            </Button>

            <Button colorScheme="red" onClick={() => openWithDraw()} h="80px">
              <Flex direction="column" justify="center" align="center" h="80px">
                <Icon as={AiOutlineFall} fontSize="4xl" />
                <Text fontSize="sm">Retirada</Text>
              </Flex>
            </Button>
          </Grid>

          <Divider mt={3} mb={3} />

          <Stack spacing={3}>
            <Button
              colorScheme="gray"
              leftIcon={<FaChartLine />}
              onClick={() => cashierReport()}
              isLoading={reportLoading}
            >
              Relatório do Caixa
            </Button>
          </Stack>

          <Divider mt={3} mb={3} />

          <Stack spacing={3}>
            <Button
              colorScheme="blue"
              leftIcon={<FaLock />}
              onClick={() => setModalClose(true)}
            >
              Fechar o Caixa
            </Button>
          </Stack>
        </Box>

        <Box
          borderWidth="1px"
          shadow="md"
          rounded="md"
          p={3}
          h="100%"
          maxH="min-content"
          overflow="auto"
        >
          {orders.length === 0 ? (
            <Flex justify="center" align="center" direction="column">
              <Lottie animation={emptyAnimation} height={200} width={200} />
              <Text>Nenhum pedido para mostrar</Text>
            </Flex>
          ) : (
            <>
              <Table size="sm">
                <Thead fontWeight="700">
                  <Tr>
                    <Td w="6%" textAlign="center">
                      Nº
                    </Td>
                    <Td>Cliente</Td>
                    <Td w="7%" textAlign="center">
                      Data
                    </Td>
                    <Td isNumeric w="9%">
                      Valor Total
                    </Td>
                    <Td isNumeric w="5%">
                      Desconto
                    </Td>
                    <Td isNumeric w="9%">
                      Total a Pagar
                    </Td>

                    <Td w="8%"></Td>
                  </Tr>
                </Thead>
                <Tbody>
                  {orders.map((ord) => (
                    <Tr key={ord.id}>
                      <Td w="6%" textAlign="center">
                        {ord.id}
                      </Td>
                      <Td>{ord.client_name}</Td>
                      <Td w="7%" textAlign="center">
                        {format(new Date(ord.order_date), "dd/MM/yyyy", {
                          locale: pt_br,
                        })}
                      </Td>
                      <Td isNumeric w="12%">
                        {parseFloat(ord.grand_total).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </Td>
                      <Td isNumeric w="5%">
                        {parseFloat(ord.discount)}%
                      </Td>
                      <Td isNumeric w="12%">
                        {parseFloat(ord.total_to_pay).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </Td>
                      <Td w="8%">
                        <Menu>
                          <MenuButton
                            as={Button}
                            leftIcon={<FaTools />}
                            colorScheme={config.buttons}
                            size="xs"
                          >
                            Opções
                          </MenuButton>
                          <MenuList>
                            <MenuItem
                              icon={<FaPrint />}
                              onClick={() => setModalPrint(true)}
                            >
                              Imprimir
                            </MenuItem>
                            <MenuItem
                              icon={<FaBarcode />}
                              onClick={() => findPaymentsByOrder(ord.id)}
                            >
                              Pagamentos
                            </MenuItem>
                            <MenuItem
                              icon={<FaClipboardList />}
                              onClick={() => convertOrderToBudget(ord.id)}
                            >
                              Converter em Orçamento
                            </MenuItem>
                            <MenuDivider />
                            <MenuItem
                              icon={<FaCheck />}
                              onClick={() => handleFinish(ord.id)}
                            >
                              Faturar
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </>
          )}
          <Flex justify="flex-end" align="center" mt={5}>
            <Button
              size="sm"
              colorScheme={config.buttons}
              mr={2}
              leftIcon={<FaArrowLeft />}
              onClick={() => setPage(page - 1)}
              isDisabled={page <= 1 ? true : false}
            >
              Anterior
            </Button>
            <NumberInput
              precision={0}
              step={1}
              focusBorderColor={config.inputs}
              value={page}
              onChange={(e) => setPage(e)}
              size="sm"
              w="70px"
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>

            <Text ml={2} mr={2}>
              de
            </Text>
            <Input
              size="sm"
              w="70px"
              focusBorderColor={config.inputs}
              value={pages}
              isReadOnly
              type="number"
              mr={2}
            />
            <Button
              size="sm"
              colorScheme={config.buttons}
              rightIcon={<FaArrowRight />}
              onClick={() => setPage(page + 1)}
              isDisabled={parseInt(page) >= parseInt(pages) ? true : false}
            >
              Próxima
            </Button>
          </Flex>
        </Box>
      </Grid>

      <Modal
        isOpen={modalRevenue}
        onClose={() => handleCloseDeposit()}
        isCentered
        scrollBehavior="inside"
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Depósito</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Valor do Depósito</FormLabel>
              <InputGroup size="lg">
                <Input
                  focusBorderColor={config.inputs}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  type="number"
                />
                <InputRightAddon>R$</InputRightAddon>
              </InputGroup>
            </FormControl>
            <FormControl mt={3}>
              <FormLabel>Descrição</FormLabel>
              <Textarea
                placeholder="Descrição"
                focusBorderColor={config.inputs}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              leftIcon={<FaSave />}
              colorScheme={config.buttons}
              isLoading={loadingDel}
              onClick={() => storeHandling()}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalExpense}
        onClose={() => handleCloseWithDraw()}
        isCentered
        scrollBehavior="inside"
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Retirada</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Valor da Retirada</FormLabel>
              <InputGroup size="lg">
                <Input
                  focusBorderColor={config.inputs}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  type="number"
                />
                <InputRightAddon>R$</InputRightAddon>
              </InputGroup>
            </FormControl>
            <FormControl mt={3}>
              <FormLabel>Descrição</FormLabel>
              <Textarea
                placeholder="Descrição"
                focusBorderColor={config.inputs}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              leftIcon={<FaSave />}
              colorScheme={config.buttons}
              isLoading={loadingDel}
              onClick={() => storeHandling()}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalFinish}
        onClose={() => setModalFinish(false)}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxW="70rem">
          <ModalHeader>Finalizar Pedido</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {JSON.stringify(order) === "{}" ? (
              <Flex justify="center" align="center" direction="column">
                <Lottie animation={emptyAnimation} height={200} width={200} />
                <Text>Nenhum informação para mostrar</Text>
              </Flex>
            ) : (
              <>
                <Center rounded="md" p={2} bg="rgba(160, 174, 192, 0.1)" mb={3}>
                  <Heading fontSize="sm">Informações do Pedido</Heading>
                </Center>

                <FormControl>
                  <FormLabel>Cliente</FormLabel>
                  <Input
                    type="text"
                    placeholder="Nome do cliente"
                    focusBorderColor={config.inputs}
                    isReadOnly
                    value={order.client_name}
                  />
                </FormControl>

                <Table size="sm" maxW="100%" mt={5}>
                  <Thead fontWeight="700">
                    <Tr>
                      <Td w="2%" textAlign="center">
                        Qtd
                      </Td>
                      <Td isTruncated w="62%" maxW="62%">
                        Produto
                      </Td>
                      <Td w="7%" textAlign="center">
                        Promocional?
                      </Td>
                      <Td w="14%" isNumeric>
                        V. Unitário
                      </Td>
                      <Td w="14%" isNumeric>
                        V. Total
                      </Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {order.products.map((pro) => (
                      <Tr key={pro.id}>
                        <Td w="2%" textAlign="center">
                          {pro.quantity}
                        </Td>
                        <Td isTruncated w="62%" maxW="62%">
                          <Text>{pro.name}</Text>
                        </Td>
                        <Td w="7%" textAlign="center">
                          {pro.promotional === false ? (
                            <Icon as={FaTimes} color="red.500" fontSize="sm" />
                          ) : (
                            <Icon
                              as={FaCheck}
                              color="green.500"
                              fontSize="sm"
                            />
                          )}
                        </Td>
                        <Td w="14%" isNumeric>
                          {parseFloat(pro.value).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </Td>
                        <Td w="14%" isNumeric>
                          {parseFloat(pro.total_value).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>

                <Grid templateColumns="1fr 1fr" gap="15px" mt={5}>
                  <Box>
                    <Center
                      rounded="md"
                      p={2}
                      bg="rgba(160, 174, 192, 0.1)"
                      mb={3}
                    >
                      <Heading fontSize="sm">Resumo</Heading>
                    </Center>
                    <Box borderWidth="1px" rounded="md" h="123px">
                      <Flex p={3} align="center" justify="space-between" h={10}>
                        <Text>Valor Total</Text>
                        <Text fontWeight="700">
                          {parseFloat(order.grand_total).toLocaleString(
                            "pt-BR",
                            {
                              style: "currency",
                              currency: "BRL",
                            }
                          )}
                        </Text>
                      </Flex>
                      <Divider />
                      <Flex p={3} align="center" justify="space-between" h={10}>
                        <Text>Desconto</Text>
                        <Text fontWeight="700">
                          {parseFloat(order.discount)}%
                        </Text>
                      </Flex>
                      <Divider />
                      <Flex p={3} align="center" justify="space-between" h={10}>
                        <Text>Total a Pagar</Text>
                        <Text fontWeight="700">
                          {parseFloat(order.total_to_pay).toLocaleString(
                            "pt-BR",
                            {
                              style: "currency",
                              currency: "BRL",
                            }
                          )}
                        </Text>
                      </Flex>
                    </Box>
                  </Box>
                  <Box>
                    <Center
                      rounded="md"
                      p={2}
                      bg="rgba(160, 174, 192, 0.1)"
                      mb={3}
                    >
                      <Heading fontSize="sm">Pagamento</Heading>
                    </Center>
                    <Box
                      borderWidth="1px"
                      rounded="md"
                      h="123px"
                      maxH="123px"
                      overflow="auto"
                    >
                      {!order.payment_info ||
                      order.payment_info.length === 0 ? (
                        ""
                      ) : (
                        <Table size="sm">
                          <Thead fontWeight="700">
                            <Tr>
                              <Td>Descrição do Pagamento</Td>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {order.payment_info.map((pay) => (
                              <Tr key={pay.id}>
                                <Td>{`${pay.pay_form_name} - ${parseFloat(
                                  pay.installment_total
                                ).toLocaleString("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                })} em ${
                                  pay.installment_amount
                                }x de ${parseFloat(
                                  pay.installment_value
                                ).toLocaleString("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                })}`}</Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      )}
                    </Box>
                  </Box>
                </Grid>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              leftIcon={<FaCheck />}
              colorScheme={config.buttons}
              isLoading={loadingDel}
              onClick={() => finalizeOrder()}
            >
              Finalizar Pedido
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalMoviment}
        onClose={() => setModalMoviment(false)}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxW="70rem">
          <ModalHeader>Relatório do Caixa</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center rounded="md" p={2} bg="blackAlpha.200" mb={3}>
              <Heading fontSize="sm">Informações do Caixa</Heading>
            </Center>
            <Box p={2} rounded="md" borderWidth="1px">
              <Grid templateColumns="1fr 1fr 1fr" gap="20px">
                <Text>
                  <strong>Funcionário:</strong>{" "}
                  {JSON.stringify(cashierInfo) === "{}"
                    ? "-"
                    : cashierInfo.employee_name}
                </Text>
                <Text>
                  <strong>Data de Abertura:</strong>{" "}
                  {JSON.stringify(cashierInfo) === "{}"
                    ? "-"
                    : format(new Date(cashierInfo.open_date), "dd/MM/yyyy", {
                        locale: pt_br,
                      })}
                </Text>
                <Text>
                  <strong>Status:</strong>{" "}
                  {JSON.stringify(cashierInfo) === "{}" ? (
                    "-"
                  ) : (
                    <>
                      {cashierInfo.status === "open" && (
                        <Tag
                          size="xs"
                          colorScheme="green"
                          w="150px"
                          rounded="md"
                          justifyContent="center"
                        >
                          Aberto
                        </Tag>
                      )}
                      {cashierInfo.status === "close" && (
                        <Tag
                          size="xs"
                          colorScheme="red"
                          w="150px"
                          rounded="md"
                          justifyContent="center"
                        >
                          Fechado
                        </Tag>
                      )}
                    </>
                  )}
                </Text>
              </Grid>
              <Grid templateColumns="1fr 1fr 1fr" gap="20px" mt={2}>
                <Text>
                  <strong>Valor de Abertura:</strong>{" "}
                  {JSON.stringify(cashierInfo) === "{}"
                    ? "-"
                    : parseFloat(cashierInfo.open_value).toLocaleString(
                        "pt-BR",
                        {
                          style: "currency",
                          currency: "BRL",
                        }
                      )}
                </Text>
                <Text>
                  <strong>Data de Fechamento:</strong>{" "}
                  {JSON.stringify(cashierInfo) === "{}" ? (
                    "-"
                  ) : (
                    <>
                      {!cashierInfo.close_date
                        ? "-"
                        : format(
                            new Date(cashierInfo.close_date),
                            "dd/MM/yyyy",
                            {
                              locale: pt_br,
                            }
                          )}
                    </>
                  )}
                </Text>
                <Text>
                  <strong>Valor de Fechamento:</strong>{" "}
                  {JSON.stringify(cashierInfo) === "{}" ? (
                    "-"
                  ) : (
                    <>
                      {!cashierInfo.close_value
                        ? "-"
                        : parseFloat(cashierInfo.close_value).toLocaleString(
                            "pt-BR",
                            {
                              style: "currency",
                              currency: "BRL",
                            }
                          )}
                    </>
                  )}
                </Text>
              </Grid>
            </Box>

            <Center rounded="md" p={2} bg="blackAlpha.200" mb={3} mt={5}>
              <Heading fontSize="sm">Pedidos</Heading>
            </Center>

            <Box p={2} rounded="md" borderWidth="1px">
              <Table size="sm">
                <Thead fontWeight="700">
                  <Tr>
                    <Td w="6%" textAlign="center">
                      Nº
                    </Td>
                    <Td>Cliente</Td>
                    <Td isNumeric w="12%">
                      V. Total
                    </Td>
                    <Td isNumeric w="9%">
                      Desconto
                    </Td>
                    <Td isNumeric w="12%">
                      T. a Pagar
                    </Td>
                    <Td textAlign="center" w="12%">
                      Data
                    </Td>
                  </Tr>
                </Thead>
                <Tbody>
                  {ordersReport.map((ord) => (
                    <Tr key={ord.id}>
                      <Td w="6%" textAlign="center">
                        {ord.id}
                      </Td>
                      <Td>{ord.client_name}</Td>
                      <Td isNumeric w="12%">
                        {parseFloat(ord.grand_total).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </Td>
                      <Td isNumeric w="9%">
                        {parseFloat(ord.discount)}%
                      </Td>
                      <Td isNumeric w="12%">
                        {parseFloat(ord.total_to_pay).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </Td>
                      <Td textAlign="center" w="12%">
                        {format(new Date(ord.order_date), "dd/MM/yyyy", {
                          locale: pt_br,
                        })}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>

            <Center rounded="md" p={2} bg="blackAlpha.200" mb={3} mt={5}>
              <Heading fontSize="sm">Movimentações do Caixa</Heading>
            </Center>

            <Grid templateColumns="repeat(2, 1fr)" gap="15px">
              <Box borderWidth="1px" rounded="md" h="min-content">
                <Flex p={2} align="center">
                  <Icon as={AiOutlineRise} mr={3} />
                  <Text fontWeight="700">Depósitos</Text>
                </Flex>
                <Divider />
                <Table size="sm">
                  <Thead fontWeight="700">
                    <Tr>
                      <Td w="60%">Descrição</Td>
                      <Td textAlign="center">Data</Td>
                      <Td isNumeric>Valor</Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {revenuesReport.map((rev) => (
                      <Tr key={rev.id}>
                        <Td w="60%">{rev.description}</Td>
                        <Td textAlign="center">
                          {format(new Date(rev.created_at), "dd/MM/yyyy", {
                            locale: pt_br,
                          })}
                        </Td>
                        <Td isNumeric>
                          {parseFloat(rev.value).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>

              <Box borderWidth="1px" rounded="md" h="min-content">
                <Flex p={2} align="center">
                  <Icon as={AiOutlineFall} mr={3} />
                  <Text fontWeight="700">Retiradas</Text>
                </Flex>
                <Divider />
                <Table size="sm">
                  <Thead fontWeight="700">
                    <Tr>
                      <Td w="60%">Descrição</Td>
                      <Td textAlign="center">Data</Td>
                      <Td isNumeric>Valor</Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {expensesReport.map((exp) => (
                      <Tr key={exp.id}>
                        <Td w="60%">{exp.description}</Td>
                        <Td textAlign="center">
                          {format(new Date(exp.created_at), "dd/MM/yyyy", {
                            locale: pt_br,
                          })}
                        </Td>
                        <Td isNumeric>
                          {parseFloat(exp.value).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </Grid>

            <Center rounded="md" p={2} bg="blackAlpha.200" mb={3} mt={5}>
              <Heading fontSize="sm">Movimentação Financeira</Heading>
            </Center>

            <Grid templateColumns="1fr 2fr" gap="20px">
              <Box>
                <Box borderWidth="1px" rounded="md" h="min-content">
                  <Flex p={2} align="center">
                    <Icon as={AiOutlineDollar} mr={3} />
                    <Text fontWeight="700">Resumo dos Pagamentos</Text>
                  </Flex>
                  <Divider />
                  <Table size="sm">
                    <Thead fontWeight="700">
                      <Tr>
                        <Td>Forma de Pagamento</Td>
                        <Td w="13%" isNumeric>
                          Total
                        </Td>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {payFormsReport.map((pfr) => (
                        <Tr key={pfr.id}>
                          <Td>{pfr.pay_form}</Td>
                          <Td w="13%" isNumeric>
                            {parseFloat(pfr.value).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>

                <Box borderWidth="1px" rounded="md" h="min-content" mt={5}>
                  <Flex p={2} align="center">
                    <Icon as={AiOutlineRise} mr={3} />
                    <Text fontWeight="700">Total dos Depósitos</Text>
                  </Flex>
                  <Divider />
                  <Text fontSize="lg" p={3}>
                    {calculatePrice(revenuesReport)}
                  </Text>
                </Box>

                <Box borderWidth="1px" rounded="md" h="min-content" mt={5}>
                  <Flex p={2} align="center">
                    <Icon as={AiOutlineFall} mr={3} />
                    <Text fontWeight="700">Total das Retiradas</Text>
                  </Flex>
                  <Divider />
                  <Text fontSize="lg" p={3}>
                    {calculatePrice(expensesReport)}
                  </Text>
                </Box>
              </Box>
              <Box borderWidth="1px" rounded="md" h="min-content">
                <Flex p={2} align="center">
                  <Icon as={AiOutlineBarcode} mr={3} />
                  <Text fontWeight="700">Pagamentos</Text>
                </Flex>
                <Divider />
                <Table size="sm">
                  <Thead fontWeight="700">
                    <Tr>
                      <Td>Descrição</Td>
                      <Td w="15%">Status</Td>
                      <Td w="10%" textAlign="center">
                        Vencimento
                      </Td>
                      <Td w="12%" isNumeric>
                        Valor
                      </Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {paymentsReport.map((pay) => (
                      <Tr key={pay.id}>
                        <Td>{pay.identify}</Td>
                        <Td w="15%">
                          {pay.status === "paid_out" && (
                            <Tag
                              w="100%"
                              justifyContent="center"
                              size="xs"
                              colorScheme="green"
                              rounded="md"
                            >
                              Pago
                            </Tag>
                          )}
                          {pay.status === "waiting" && (
                            <Tag
                              w="100%"
                              justifyContent="center"
                              size="xs"
                              colorScheme="yellow"
                              rounded="md"
                            >
                              Não Pago
                            </Tag>
                          )}
                          {pay.status === "canceled" && (
                            <Tag
                              w="100%"
                              justifyContent="center"
                              size="xs"
                              colorScheme="red"
                              rounded="md"
                            >
                              Cancelado
                            </Tag>
                          )}
                        </Td>
                        <Td w="10%" textAlign="center">
                          {format(new Date(pay.due_date), "dd/MM/yyyy", {
                            locale: pt_br,
                          })}
                        </Td>
                        <Td w="12%" isNumeric>
                          {parseFloat(pay.value).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button
              leftIcon={<FaPrint />}
              colorScheme={config.buttons}
              onClick={() => setModalPrint(true)}
            >
              Imprimir
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalPrint}
        onClose={() => setModalPrint(false)}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxW="95vw" minH="89vh" pb={4} p={0} overflow="hidden">
          <ModalHeader pt={2} pb={2} pl={5}>
            Imprimir
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={0} overflow="hidden">
            <Box h="89vh">
              <embed
                src={`${config.url}/cashierReport/${cash}`}
                width="100%"
                height="100%"
                type="application/pdf"
              />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalPayments}
        onClose={() => setModalPayments(false)}
        isCentered
        scrollBehavior="inside"
        size="6xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Pagamentos</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {payments.length === 0 ? (
              <Flex justify="center" align="center" direction="column">
                <Lottie animation={emptyAnimation} height={200} width={200} />
                <Text>Nenhum pagamento para mostrar</Text>
              </Flex>
            ) : (
              <Table size="sm">
                <Thead fontWeight="700">
                  <Tr>
                    <Td>Descrição</Td>
                    <Td w="12%" textAlign="center">
                      Vencimento
                    </Td>
                    <Td w="12%" textAlign="center">
                      Status
                    </Td>
                    <Td w="16%" isNumeric>
                      Valor
                    </Td>
                  </Tr>
                </Thead>
                <Tbody>
                  {payments.map((pay) => (
                    <Tr key={pay.id}>
                      <Td>{pay.identify}</Td>
                      <Td w="12%" textAlign="center">
                        {format(new Date(pay.due_date), "dd/MM/yyyy", {
                          locale: pt_br,
                        })}
                      </Td>
                      <Td w="12%" textAlign="center">
                        {pay.status === "waiting" && (
                          <Tag
                            w="100%"
                            justifyContent="center"
                            colorScheme="yellow"
                          >
                            Não Pago
                          </Tag>
                        )}
                        {pay.status === "canceled" && (
                          <Tag
                            w="100%"
                            justifyContent="center"
                            colorScheme="red"
                          >
                            Cancelado
                          </Tag>
                        )}
                        {pay.status === "paid_out" && (
                          <Tag
                            w="100%"
                            justifyContent="center"
                            colorScheme="green"
                          >
                            Pago
                          </Tag>
                        )}
                      </Td>
                      <Td w="16%" isNumeric>
                        {parseFloat(pay.value).toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </ModalBody>
          <ModalFooter>
            <Popover placement="left">
              <PopoverTrigger>
                <Button leftIcon={<FaPlus />} colorScheme={config.buttons}>
                  Nova Forma de Pagamento
                </Button>
              </PopoverTrigger>
              <PopoverContent _focus={{ outline: "none" }}>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Confirmação!</PopoverHeader>
                <PopoverBody>
                  Estes pagamentos serão excluídos e adicionados os novos ao
                  pedido, deseja continuar?
                </PopoverBody>
                <PopoverFooter d="flex" justifyContent="flex-end">
                  <ButtonGroup size="sm">
                    <Button
                      colorScheme={config.buttons}
                      onClick={() => delPaymentsByOrder()}
                      isLoading={loadingDel}
                    >
                      Sim
                    </Button>
                  </ButtonGroup>
                </PopoverFooter>
              </PopoverContent>
            </Popover>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalPayment}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxW="60rem" pb={4}>
          <ModalHeader>Adicionar Forma de Pagamento</ModalHeader>

          <ModalBody>
            {modalPayment === true && (
              <PaymentMiddleware order={order} handleClose={handleClose} />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={() => setModalClose(false)}
        isOpen={modalClose}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Fechar o Caixa</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Após o fechamento do caixa, não será mais possível fazer
            movimentações ou utilizá-lo, deseja prosseguir?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              onClick={() => setModalClose(false)}
              colorScheme={config.buttons}
              variant="outline"
            >
              Não
            </Button>
            <Button
              colorScheme={config.buttons}
              ml={3}
              ref={cancelRef}
              onClick={() => closeCashier()}
              isLoading={closeLoading}
            >
              Sim
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Modal
        isOpen={loadingModal}
        isCentered
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent maxW="60rem" pb={4} bg="transparent" boxShadow="none">
          <ModalBody bg="transparent" boxShadow="none">
            <Flex justify="center" align="center" direction="column">
              <Lottie animation={sendAnimation} height={250} width={250} />
              <Text fontSize="2xl" color="gray.100">
                Aguarde...
              </Text>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
