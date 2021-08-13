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
} from "react-icons/fa";
import { AiOutlineBlock, AiOutlineFall, AiOutlineRise } from "react-icons/ai";

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

  useEffect(() => {
    if (data) {
      setOrders(data.orders);
      handlePagination(data.count.count);
      console.log(data.orders);
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

  return (
    <>
      <HeaderApp title="Caixa Diário" icon={FaCashRegister} />
      <Grid templateColumns="220px 1fr" gap="20px" mt="25px">
        <Box>
          <Center rounded="md" p={2} bg="rgba(160, 174, 192, 0.1)" mb={5}>
            <Heading fontSize="sm">Opções</Heading>
          </Center>

          <Stack spacing={3}>
            <Button
              colorScheme="green"
              leftIcon={<AiOutlineRise />}
              onClick={() => openDeposit()}
            >
              Efetuar Depósito
            </Button>
            <Button
              colorScheme="red"
              leftIcon={<AiOutlineFall />}
              onClick={() => openWithDraw()}
            >
              Efetuar Retirada
            </Button>
          </Stack>

          <Divider mt={3} mb={3} />

          <Stack spacing={3}>
            <Button
              colorScheme="gray"
              leftIcon={<FaChartLine />}
              onClick={() => setModalMoviment(true)}
            >
              Movimentação do Caixa
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
                      <Td w="12%">
                        <HStack spacing={2} justify="flex-end">
                          <Tooltip label="Imprimir Pedido" hasArrow>
                            <IconButton
                              icon={<FaPrint />}
                              rounded="full"
                              size="xs"
                              onClick={() => setModalPrint(true)}
                              colorScheme={config.buttons}
                              variant="ghost"
                            />
                          </Tooltip>
                          <Tooltip label="Visualizar Pagamentos" hasArrow>
                            <IconButton
                              icon={<FaBarcode />}
                              rounded="full"
                              size="xs"
                              onClick={() => findPaymentsByOrder(ord.id)}
                              colorScheme={config.buttons}
                              variant="ghost"
                            />
                          </Tooltip>

                          <Popover placement="bottom-end">
                            <PopoverTrigger>
                              <IconButton
                                icon={<FaClipboardList />}
                                size="xs"
                                rounded="full"
                                colorScheme={config.buttons}
                                variant="ghost"
                              />
                            </PopoverTrigger>
                            <PopoverContent _focus={{ outline: "none" }}>
                              <PopoverArrow />
                              <PopoverCloseButton />
                              <PopoverHeader>Confirmação!</PopoverHeader>
                              <PopoverBody>
                                Deseja converter este pedido em orçamento?
                              </PopoverBody>
                              <PopoverFooter d="flex" justifyContent="flex-end">
                                <ButtonGroup size="xs">
                                  <Button
                                    colorScheme={config.buttons}
                                    onClick={() => convertOrderToBudget(ord.id)}
                                  >
                                    Sim
                                  </Button>
                                </ButtonGroup>
                              </PopoverFooter>
                            </PopoverContent>
                          </Popover>

                          <Popover placement="bottom-end">
                            <PopoverTrigger>
                              <IconButton
                                colorScheme="red"
                                icon={<FaTrash />}
                                size="xs"
                                rounded="full"
                                variant="ghost"
                              />
                            </PopoverTrigger>
                            <PopoverContent _focus={{ outline: "none" }}>
                              <PopoverArrow />
                              <PopoverCloseButton />
                              <PopoverHeader>Confirmação!</PopoverHeader>
                              <PopoverBody>
                                Deseja cancelar este pedido?
                              </PopoverBody>
                              <PopoverFooter d="flex" justifyContent="flex-end">
                                <ButtonGroup size="xs">
                                  <Button colorScheme={config.buttons}>
                                    Sim
                                  </Button>
                                </ButtonGroup>
                              </PopoverFooter>
                            </PopoverContent>
                          </Popover>

                          <Button
                            leftIcon={<FaCheck />}
                            colorScheme={config.buttons}
                            size="xs"
                            isFullWidth
                            onClick={() => handleFinish(ord.id)}
                          >
                            Finalizar
                          </Button>
                        </HStack>
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

                <Divider mt={3} mb={3} />

                <Table size="sm" maxW="100%">
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
          <ModalHeader>Movimentações do Caixa</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(1, 1fr)" gap="15px">
              <Box borderWidth="1px" rounded="md" h="min-content">
                <Flex p={2} align="center">
                  <Icon as={AiOutlineRise} mr={3} />
                  <Text fontWeight="700">Depósitos</Text>
                </Flex>
                <Divider />
                <Table size="sm">
                  <Thead fontWeight="700">
                    <Tr>
                      <Td w="80%">Descrição</Td>
                      <Td textAlign="center">Data</Td>
                      <Td isNumeric>Valor</Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td w="80%">Descrição</Td>
                      <Td textAlign="center">Data</Td>
                      <Td isNumeric>Valor</Td>
                    </Tr>
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
                      <Td w="80%">Descrição</Td>
                      <Td textAlign="center">Data</Td>
                      <Td isNumeric>Valor</Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td w="80%">Descrição</Td>
                      <Td textAlign="center">10/10/1000</Td>
                      <Td isNumeric>R$ 3000,00</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>
            </Grid>

            <Divider mt={5} mb={5} />

            <Box borderWidth="1px" rounded="md">
              <Table size="sm">
                <Tbody>
                  <Tr>
                    <Td fontWeight="700" w="70%">
                      Valor de Abertura
                    </Td>
                    <Td isNumeric>R$ 4000,00</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="700" w="70%">
                      Total das Entradas
                    </Td>
                    <Td isNumeric color="green.400">
                      R$ 4000,00
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="700" w="70%">
                      Total das Saídas
                    </Td>
                    <Td isNumeric color="red.400">
                      R$ 4000,00
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="700" w="70%">
                      Valor de Fechamento
                    </Td>
                    <Td isNumeric>R$ 4000,00</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button leftIcon={<FaPrint />} colorScheme={config.buttons}>
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
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Imprimir</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={4}>
            {modalPrint === true && <PrintMiddleware />}
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
              onClick={() => handleCloseCashier()}
            >
              Sim
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Modal
        isOpen={modalCloseCashier}
        onClose={() => setModalCloseCashier(false)}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxW="50rem">
          <ModalHeader>Fechamento de Caixa</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(1, 1fr)" gap="15px">
              <Box borderWidth="1px" rounded="md" h="min-content">
                <Flex p={2} align="center">
                  <Icon as={AiOutlineRise} mr={3} />
                  <Text fontWeight="700">Depósitos</Text>
                </Flex>
                <Divider />
                <Table size="sm">
                  <Thead fontWeight="700">
                    <Tr>
                      <Td w="80%">Descrição</Td>
                      <Td textAlign="center">Data</Td>
                      <Td isNumeric>Valor</Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td w="80%">Descrição</Td>
                      <Td textAlign="center">Data</Td>
                      <Td isNumeric>Valor</Td>
                    </Tr>
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
                      <Td w="80%">Descrição</Td>
                      <Td textAlign="center">Data</Td>
                      <Td isNumeric>Valor</Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td w="80%">Descrição</Td>
                      <Td textAlign="center">10/10/1000</Td>
                      <Td isNumeric>R$ 3000,00</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>
            </Grid>

            <Box borderWidth="1px" rounded="md" h="min-content" mt="15px">
              <Flex p={2} align="center">
                <Icon as={AiOutlineFall} mr={3} />
                <Text fontWeight="700">Resumo das Movimentações de Caixa</Text>
              </Flex>
              <Divider />
              <Table size="sm">
                <Tbody>
                  <Tr>
                    <Td fontWeight="700" w="70%">
                      Valor de Abertura
                    </Td>
                    <Td isNumeric>R$ 4000,00</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="700" w="70%">
                      Total das Entradas
                    </Td>
                    <Td isNumeric color="green.400">
                      R$ 4000,00
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="700" w="70%">
                      Total das Saídas
                    </Td>
                    <Td isNumeric color="red.400">
                      R$ 4000,00
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="700" w="70%">
                      Valor de Fechamento
                    </Td>
                    <Td isNumeric>R$ 4000,00</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>

            <Box borderWidth="1px" rounded="md" h="min-content" mt="15px">
              <Flex p={2} align="center">
                <Icon as={AiOutlineFall} mr={3} />
                <Text fontWeight="700">Resumo dos Pagamentos</Text>
              </Flex>
              <Divider />
              <Table size="sm">
                <Tbody>
                  <Tr>
                    <Td fontWeight="700" w="70%">
                      Total em Dinheiro
                    </Td>
                    <Td isNumeric>R$ 4000,00</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="700" w="70%">
                      Total em Cartão de Crédito
                    </Td>
                    <Td isNumeric>R$ 4000,00</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="700" w="70%">
                      Total em Cartão de Débito
                    </Td>
                    <Td isNumeric>R$ 4000,00</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="700" w="70%">
                      Total em Cheque
                    </Td>
                    <Td isNumeric>R$ 4000,00</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="700" w="70%">
                      Total em Duplicata
                    </Td>
                    <Td isNumeric>R$ 4000,00</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="700" w="70%">
                      Total em Transferências
                    </Td>
                    <Td isNumeric>R$ 4000,00</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              leftIcon={<FaPrint />}
              mr={3}
              colorScheme={config.buttons}
              variant="outline"
            >
              Imprimir Relatório
            </Button>
            <Button
              leftIcon={<FaCheck />}
              colorScheme={config.buttons}
              onClick={() => routing("/cashiermoviment")}
            >
              Concluir
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
