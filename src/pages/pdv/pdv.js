import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Grid,
  Input,
  Button,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Tooltip,
  Flex,
  IconButton,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  ButtonGroup,
  Center,
  Heading,
  FormControl,
  FormLabel,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Kbd,
  useToast,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  ModalFooter,
  InputRightAddon,
  Icon,
  Divider,
  Textarea,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import config from "../../configs/index";
import HeaderApp from "../../components/headerApp";
import {
  FaShoppingBag,
  FaSearch,
  FaTimes,
  FaSearchPlus,
  FaSave,
  FaCheck,
  FaTrash,
  FaPrint,
  FaCalendarAlt,
  FaUser,
  FaTags,
  FaArrowRight,
  FaArrowLeft,
  FaEdit,
} from "react-icons/fa";
import DatePicker, { registerLocale } from "react-datepicker";
import Hotkeys from "react-hot-keys";
import pt_br from "date-fns/locale/pt-BR";

import PaymentMiddleware from "../../middlewares/payment";
import PrintMiddleware from "../../middlewares/print";

import { useEmployee } from "../../context/Employee";
import useFetch from "../../hooks/useFetch";
import api from "../../configs/axios";
import uniqid from "uniqid";

import Lottie from "../../components/lottie";
import sendAnimation from "../../animations/search.json";
import emptyAnimation from "../../animations/empty.json";

registerLocale("pt_br", pt_br);

export default function Pdv() {
  const { employee } = useEmployee();
  const toast = useToast();
  const initialRef = useRef();
  const [nameProduct, setNameProduct] = useState("");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState("0");

  const { data, error } = useFetch(
    `/productsPdv/${page}/${nameProduct === "" ? "All" : nameProduct}/${
      sku === "" ? "All" : sku
    }/${barcode === "" ? "All" : barcode}`
  );

  const [modalPayment, setModalPayment] = useState(false);
  const [modalPrint, setModalPrint] = useState(false);
  const [modalClients, setModalClients] = useState(false);
  const [modalProducts, setModalProducts] = useState(false);
  const [modalSizes, setModalSizes] = useState(false);
  const [qtd, setQtd] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [loadingModal, setLoadingModal] = useState(false);
  const [modalObs, setModalObs] = useState(false);
  const [loading, setLoading] = useState(false);

  const [clients, setClients] = useState([]);
  const [clientsSearch, setClientsSearch] = useState([]);
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [cpf, setCpf] = useState("");
  const [name, setName] = useState("");
  const [client, setClient] = useState({});

  const [orderProducts, setOrderProducts] = useState([]);
  const [productId, setProductId] = useState(null);
  const [total, setTotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [totalToPay, setTotalToPay] = useState(0);
  const [obs, setObs] = useState("");
  const [order, setOrder] = useState({});

  const [alertModal, setAlertModal] = useState(false);
  const [alertSave, setAlertSave] = useState(false);

  function clear() {
    setClient({});
    setOrderProducts([]);
    setObs("");
    setOrder({});
  }

  function handleInput(id) {
    const inpt = document.getElementById(id);
    inpt.focus();
  }

  async function findClients() {
    try {
      const response = await api.get("/clientsWithAddress");
      setClients(response.data);
      setClientsSearch(response.data);
    } catch (error) {
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
  }

  async function finderClientsBySource(text) {
    setName(text);
    if (text === "") {
      await setClients(clientsSearch);
    } else {
      let termos = await text.split(" ");
      let frasesFiltradas = await clientsSearch.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.name.includes(termoBuscado);
        }, true);
      });
      await setClients(frasesFiltradas);
    }
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

  useEffect(() => {
    if (data) {
      setProducts(data.products);
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

  async function finderClientsByCPF(text) {
    setCpf(text);
    if (text === "") {
      await setClients(clientsSearch);
    } else {
      let termos = await text.split(" ");
      let frasesFiltradas = await clientsSearch.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.cpf.includes(termoBuscado);
        }, true);
      });
      await setClients(frasesFiltradas);
    }
  }

  function capitalizeAllFirstLetter(string) {
    let splited = string.split(" ");
    let toJoin = splited.map((e) => {
      return e.charAt(0).toUpperCase() + e.slice(1);
    });
    let joined = toJoin.join(" ");
    return joined;
  }

  useEffect(() => {
    findClients();
  }, []);

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom-right",
      duration: 8000,
      isClosable: true,
    });
  }

  function onKeyDown(keyName, e, handle) {
    switch (keyName) {
      case "ctrl+p":
        setModalPrint(true);
        break;
      case "ctrl+o":
        setModalObs(true);
        break;
      case "f11":
        setModalProducts(true);
        break;
      case "f4":
        setAlertSave(true);
        break;
      case "f6":
        modalProducts === true && handleInput("qtd");
        break;
      case "f12":
        store();
        break;
      case "f3":
        modalProducts === true && handleInput("name");
        break;
      case "f7":
        modalProducts === true && handleInput("codebar");
        break;
      case "f8":
        modalProducts === true && handleInput("sku");
        break;
      case "f9":
        handleInput("discount");
        break;
      case "f10":
        handleInput("finalvalue");
        break;
      case "f2":
        setModalClients(true);
        break;

      default:
        break;
    }
  }

  const CustomInputPicker = ({ value, onClick }) => (
    <InputGroup>
      <InputLeftAddon>Data</InputLeftAddon>
      <Input focusBorderColor={config.inputs} value={value} onClick={onClick} />
      <InputRightElement pointerEvents="none" children={<FaCalendarAlt />} />
    </InputGroup>
  );

  async function handleClient(id) {
    const result = await clientsSearch.find((obj) => obj.id === id);
    setClient(result);
    setModalClients(false);
  }

  function handleByName(value) {
    if (sku !== "") {
      setSku("");
    }
    if (barcode !== "") {
      setBarcode("");
    }
    setNameProduct(value);
  }

  function handleBySku(value) {
    if (nameProduct !== "") {
      setNameProduct("");
    }
    if (barcode !== "") {
      setBarcode("");
    }
    setSku(value);
  }

  function handleByBarCode(value) {
    if (sku !== "") {
      setSku("");
    }
    if (nameProduct !== "") {
      setNameProduct("");
    }
    setBarcode(value);
  }

  async function handleProducts(id, name) {
    const result = await products.find((obj) => obj.id === productId);
    const findDuplicate = await orderProducts.find(
      (obj) => obj.product_id === result.id && obj.size_id === id
    );
    if (findDuplicate) {
      showToast("Este produto já foi inserido ao pedido", "warning", "Atenção");
      return false;
    }
    if (result) {
      const coast =
        result.promotional === true
          ? result.promotional_value
          : result.sale_value;
      let product = {
        id: uniqid(),
        product_id: result.id,
        name: result.name,
        promotional: result.promotional,
        value: parseFloat(coast),
        quantity: qtd,
        size_id: id,
        size_name: name,
        thumbnail: result.thumbnail,
        total_value: parseFloat(coast) * qtd,
      };
      setOrderProducts([...orderProducts, product]);
      setQtd(1);
      setProductId(null);
      setModalSizes(false);
      showToast("Produto adicionado ao pedido", "success", "Sucesso");
    }
  }

  async function findSizes(id) {
    setLoadingModal(true);
    setProductId(id);
    try {
      const response = await api.get(`/sizeByProduct/${id}`);
      setSizes(response.data);
      setLoadingModal(false);
      setModalSizes(true);
    } catch (error) {
      setLoadingModal(false);
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
  }

  useEffect(() => {
    let valor = orderProducts.reduce(
      (total, numeros) => total + numeros.total_value,
      0
    );
    setTotal(valor);
    setTotalToPay(valor);
  }, [orderProducts]);

  async function handleSizes(id) {
    const result = await sizes.find((obj) => obj.id === id);
    if (result) {
      if (result.amount < qtd) {
        showToast(
          "Este produto não tem a quantidade suficiente pedida",
          "warning",
          "Atenção"
        );
        return false;
      }
      handleProducts(result.id, result.size);
    }
  }

  function removeProduct(id) {
    const result = orderProducts.filter((obj) => obj.id !== id);
    setOrderProducts(result);
  }

  function calcDesc(value) {
    const desc = parseFloat(value);
    if (!isNaN(desc) || desc >= 0) {
      setDiscount(desc);
      const rest = parseFloat((total * desc) / 100);
      const soma = total - rest;
      setTotalToPay(parseFloat(soma.toFixed(2)));
    } else {
      setDiscount(value);
      setTotalToPay(total);
      if (value === "") {
        setDiscount(0);
      }
    }
  }

  function calcTotalToPay(value) {
    setTotalToPay(value);
    const valueToPay = parseFloat(value);
    if (!isNaN(valueToPay) || valueToPay >= 0) {
      const rest = valueToPay / total;
      const calcPercent = rest * 100;
      const soma = 100 - calcPercent;
      setDiscount(parseFloat(soma.toFixed(2)));
    } else {
      setDiscount(0);
      if (value === "") {
        setTotalToPay(total);
      }
    }
  }

  async function store() {
    if (JSON.stringify(client) === "{}") {
      showToast("Por favor, selecione um cliente", "warning", "Atenção");
      setModalClients(true);
      return false;
    }
    if (orderProducts.length === 0) {
      showToast("Por favor, insira produtos ao pedido", "warning", "Atenção");
      setModalProducts(true);
      return false;
    }
    setLoading(true);

    try {
      const response = await api.post(
        "/order",
        {
          client_id: client.id,
          employee_id: employee.user,
          products: orderProducts,
          grand_total: total,
          discount: discount,
          total_to_pay: totalToPay,
          order_date: startDate,
          waiting: "none",
          obs: obs,
        },
        { headers: { "x-access-token": employee.token } }
      );
      setLoading(false);
      setOrder(response.data[0]);
      setModalPayment(true);
    } catch (error) {
      console.log(error);
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

  async function storeWithBudget() {
    if (JSON.stringify(client) === "{}") {
      showToast("Por favor, selecione um cliente", "warning", "Atenção");
      setModalClients(true);
      return false;
    }
    if (orderProducts.length === 0) {
      showToast(
        "Por favor, insira produtos ao orçamento",
        "warning",
        "Atenção"
      );
      setModalProducts(true);
      return false;
    }
    setLoadingModal(true);

    try {
      const response = await api.post(
        "/budget",
        {
          client_id: client.id,
          employee_id: employee.user,
          products: orderProducts,
          grand_total: total,
          discount: discount,
          total_to_pay: totalToPay,
          order_date: startDate,
          waiting: "none",
          obs: obs,
        },
        { headers: { "x-access-token": employee.token } }
      );
      setLoadingModal(false);
      showToast(response.data.message, "success", "Sucesso");
      clear();
    } catch (error) {
      setLoadingModal(false);
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

  function handleStock(id, stock) {
    const result = orderProducts.find((obj) => obj.size_id === id);
    if (result) {
      return stock - result.quantity;
    } else {
      return stock;
    }
  }

  const handleClosePaymentModal = () => {
    setModalPayment(false);
    setAlertModal(true);
  };

  function handleAlert(mode) {
    if (mode === "no") {
      clear();
      setAlertModal(false);
    } else {
      setModalPrint(true);
      setAlertModal(false);
    }
  }

  function handleClosePrint() {
    setModalPrint(false);
    clear();
  }

  function handleAlertSave() {
    setAlertSave(false);
    storeWithBudget();
  }

  return (
    <>
      <Hotkeys
        keyName="f2, ctrl+p, f6, f3, f7, f8, f9, f10, f12, f1, f4, f5, f11, ctrl+o, ctrl+v, f4"
        onKeyDown={onKeyDown}
        allowRepeat
        filter={(event) => {
          return true;
        }}
      >
        <Grid templateRows="120px 1fr 68px" gap="15px" h="100%" maxH="100%">
          <Box>
            <HeaderApp title="Ponto de Venda" icon={FaShoppingBag} />
            <Flex
              mt="25px"
              h="62px"
              p={2}
              shadow="md"
              borderWidth="1px"
              rounded="md"
              align="center"
              justify="flex-end"
            >
              <InputGroup mr={3}>
                <InputLeftAddon>Vendedor</InputLeftAddon>
                <Input
                  focusBorderColor={config.inputs}
                  isReadOnly
                  value={employee ? employee.name : ""}
                />
                <InputRightElement pointerEvents="none" children={<FaUser />} />
              </InputGroup>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                customInput={<CustomInputPicker />}
                locale="pt_br"
                dateFormat="dd/MM/yyyy"
              />
            </Flex>
          </Box>
          <Grid templateColumns="240px 1fr" gap="25px" h="100%">
            <Box>
              <Center rounded="md" p={2} bg="rgba(160, 174, 192, 0.1)" mb={5}>
                <Heading fontSize="sm">Opções</Heading>
              </Center>
              <Stack spacing={3}>
                <Button
                  isFullWidth
                  colorScheme={config.buttons}
                  leftIcon={<FaTags />}
                  variant="outline"
                  onClick={() => setModalProducts(true)}
                  size="sm"
                >
                  Produtos <Kbd ml={1}>F11</Kbd>
                </Button>
              </Stack>
              <Divider mt={3} mb={3} />
              <Stack spacing={3}>
                <Button
                  isFullWidth
                  colorScheme={config.buttons}
                  leftIcon={<FaEdit />}
                  variant="outline"
                  onClick={() => setModalObs(true)}
                  size="sm"
                >
                  Adicionar Observação <Kbd ml={1}>Ctrl+O</Kbd>
                </Button>
                <Button
                  isFullWidth
                  colorScheme={config.buttons}
                  leftIcon={<FaSave />}
                  variant="outline"
                  size="sm"
                  onClick={() => setAlertSave(true)}
                >
                  Salvar como Orçamento <Kbd ml={1}>F4</Kbd>
                </Button>
                <Button
                  isFullWidth
                  colorScheme={config.buttons}
                  leftIcon={<FaPrint />}
                  variant="outline"
                  size="sm"
                >
                  Imprimir Pedido <Kbd ml={1}>Ctrl+P</Kbd>
                </Button>
                <Button
                  isFullWidth
                  colorScheme={config.buttons}
                  leftIcon={<FaTrash />}
                  variant="outline"
                  onClick={() => clear()}
                  size="sm"
                >
                  Cancelar Pedido <Kbd ml={1}>F5</Kbd>
                </Button>
              </Stack>
              <Divider mt={3} mb={3} />
              <Stack spacing={3}>
                <Button
                  isFullWidth
                  colorScheme={config.buttons}
                  leftIcon={<FaSearchPlus />}
                  variant="outline"
                  size="sm"
                >
                  Buscar Orçamento <Kbd ml={1}>F1</Kbd>
                </Button>
              </Stack>
            </Box>
            <Box borderWidth="1px" shadow="md" rounded="md" p={3}>
              <Center rounded="md" p={2} bg="rgba(160, 174, 192, 0.1)" mb={3}>
                <Heading fontSize="sm">Informações do Pedido</Heading>
              </Center>
              <HStack spacing={3}>
                <Input
                  type="text"
                  placeholder="Nome do cliente"
                  focusBorderColor={config.inputs}
                  isReadOnly
                  value={JSON.stringify(client) !== "{}" ? client.name : ""}
                />
                <Tooltip label="Buscar Cliente" hasArrow>
                  <Button
                    leftIcon={<FaSearch />}
                    colorScheme={config.buttons}
                    variant="outline"
                    onClick={() => setModalClients(true)}
                  >
                    <Kbd>F2</Kbd>
                  </Button>
                </Tooltip>
              </HStack>
              <HStack spacing={3} mt={3}>
                <Input
                  size="sm"
                  placeholder="Endereço do cliente"
                  focusBorderColor={config.inputs}
                  w="70%"
                  value={
                    JSON.stringify(client) !== "{}"
                      ? `${client.street}, ${client.number}, ${client.city} - ${client.state}`
                      : ""
                  }
                  isReadOnly
                />
                <Input
                  size="sm"
                  placeholder="Contato"
                  focusBorderColor={config.inputs}
                  w="30%"
                  value={JSON.stringify(client) !== "{}" ? client.contact : ""}
                  isReadOnly
                />
              </HStack>

              {orderProducts.length === 0 ? (
                <Flex justify="center" align="center" direction="column">
                  <Lottie animation={emptyAnimation} height={200} width={200} />
                  <Text>Seu pedido está vazio!</Text>
                </Flex>
              ) : (
                <Table size="sm" maxW="100%" mt={5} variant="striped">
                  <Thead fontWeight="700">
                    <Tr>
                      <Td w="2%" textAlign="center">
                        Qtd
                      </Td>
                      <Td isTruncated>Produto</Td>
                      <Td w="7%" textAlign="center">
                        Promoção?
                      </Td>
                      <Td w="7%" textAlign="center">
                        Tamanho
                      </Td>
                      <Td w="14%" isNumeric>
                        V. Uni
                      </Td>
                      <Td w="14%" isNumeric>
                        V. Tot
                      </Td>
                      <Td w="1%"></Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {orderProducts.map((prod) => (
                      <Tr key={prod.id}>
                        <Td w="2%" textAlign="center">
                          {prod.quantity}
                        </Td>
                        <Td isTruncated>
                          <Text
                            fontSize="sm"
                            isTruncated
                            noOfLines={1}
                            w="29vw"
                          >
                            {prod.name}
                          </Text>
                        </Td>
                        <Td w="7%" textAlign="center">
                          {prod.promotional === true ? (
                            <Icon as={FaCheck} color="green.500" />
                          ) : (
                            <Icon as={FaTimes} color="red.500" />
                          )}
                        </Td>
                        <Td w="7%" textAlign="center">
                          {prod.size_name}
                        </Td>
                        <Td w="14%" isNumeric>
                          {parseFloat(prod.value).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </Td>
                        <Td w="14%" isNumeric>
                          {parseFloat(prod.total_value).toLocaleString(
                            "pt-BR",
                            {
                              style: "currency",
                              currency: "BRL",
                            }
                          )}
                        </Td>
                        <Td w="1%">
                          <Tooltip label="Remover Item" hasArrow>
                            <Popover placement="left">
                              <PopoverTrigger>
                                <IconButton
                                  colorScheme="red"
                                  icon={<FaTrash />}
                                  size="xs"
                                  variant="link"
                                />
                              </PopoverTrigger>
                              <PopoverContent _focus={{ outline: "none" }}>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverHeader>Confirmação!</PopoverHeader>
                                <PopoverBody>
                                  Deseja remover este item?
                                </PopoverBody>
                                <PopoverFooter
                                  d="flex"
                                  justifyContent="flex-end"
                                >
                                  <ButtonGroup size="sm">
                                    <Button
                                      colorScheme={config.buttons}
                                      onClick={() => removeProduct(prod.id)}
                                    >
                                      Sim
                                    </Button>
                                  </ButtonGroup>
                                </PopoverFooter>
                              </PopoverContent>
                            </Popover>
                          </Tooltip>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </Box>
          </Grid>

          <Flex
            h="68px"
            borderWidth="1px"
            shadow="md"
            rounded="md"
            align="center"
          >
            <Grid templateColumns="4fr 1fr" gap="15px">
              <Grid templateColumns="1fr 1fr 1fr" gap="10px" pl={3}>
                <InputGroup size="lg">
                  <InputLeftAddon>R$</InputLeftAddon>
                  <Input
                    focusBorderColor={config.inputs}
                    value={total}
                    size="lg"
                    isReadOnly
                  />
                  <InputRightAddon>Total</InputRightAddon>
                </InputGroup>

                <InputGroup size="lg">
                  <InputLeftAddon>%</InputLeftAddon>
                  <Input
                    focusBorderColor={config.inputs}
                    value={discount}
                    size="lg"
                    id="discount"
                    onChange={(e) => calcDesc(e.target.value)}
                  />
                  <InputRightAddon>
                    Desconto <Kbd ml={1}>F9</Kbd>
                  </InputRightAddon>
                </InputGroup>

                <InputGroup size="lg">
                  <InputLeftAddon>R$</InputLeftAddon>
                  <Input
                    focusBorderColor={config.inputs}
                    value={totalToPay}
                    size="lg"
                    id="finalvalue"
                    onChange={(e) => calcTotalToPay(e.target.value)}
                  />
                  <InputRightAddon>
                    A Pagar <Kbd ml={1}>F10</Kbd>
                  </InputRightAddon>
                </InputGroup>
              </Grid>
              <Grid templateColumns="1fr" gap="15px" pr={3}>
                <Button
                  leftIcon={<FaCheck />}
                  colorScheme={config.buttons}
                  onClick={() => store()}
                  size="lg"
                  isLoading={loading}
                >
                  Finalizar Pedido{" "}
                  <Kbd color="ButtonText" ml={1}>
                    F12
                  </Kbd>
                </Button>
              </Grid>
            </Grid>
          </Flex>
        </Grid>

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
                <PaymentMiddleware
                  order={order}
                  handleClose={handleClosePaymentModal}
                />
              )}
            </ModalBody>
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

        <Modal
          isOpen={modalPrint}
          onClose={() => handleClosePrint()}
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
          isOpen={modalObs}
          onClose={() => setModalObs(false)}
          isCentered
          scrollBehavior="inside"
          size="2xl"
          initialFocusRef={initialRef}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Observação</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={4}>
              <Textarea
                ref={initialRef}
                rows={5}
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                focusBorderColor={config.inputs}
                resize="none"
              />
            </ModalBody>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={modalSizes}
          onClose={() => setModalSizes(false)}
          isCentered
          scrollBehavior="inside"
          size="xl"
          initialFocusRef={initialRef}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Tamanhos</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Quantidade</FormLabel>
                <Input
                  ref={initialRef}
                  type="number"
                  placeholder="Qtd"
                  focusBorderColor={config.inputs}
                  id="qtd"
                  value={qtd}
                  onChange={(e) => setQtd(parseInt(e.target.value))}
                />
              </FormControl>

              {sizes.length === 0 ? (
                <Flex
                  justify="center"
                  align="center"
                  direction="column"
                  w="100%"
                >
                  <Lottie animation={emptyAnimation} height={200} width={200} />
                  <Text>Nenhum tamanho para mostrar</Text>
                </Flex>
              ) : (
                <>
                  <Grid
                    templateColumns="repeat(auto-fit, minmax(140px, 140px))"
                    gap="20px"
                    justifyContent="center"
                    mt={5}
                  >
                    {sizes.map((siz) => (
                      <Box
                        rounded="md"
                        borderWidth="1px"
                        overflow="hidden"
                        key={siz.id}
                      >
                        <Flex
                          p={1}
                          textAlign="center"
                          fontSize="xl"
                          justify="center"
                          align="center"
                          fontWeight="700"
                          borderBottomWidth="1px"
                        >
                          {siz.size}
                        </Flex>
                        <Flex
                          justify="center"
                          align="center"
                          p={1}
                          mt={1}
                          direction="column"
                          textAlign="center"
                        >
                          <Text fontSize="sm">Estoque:</Text>
                          <Text fontSize="xl" fontWeight="600">
                            {handleStock(siz.id, siz.amount)}
                          </Text>
                        </Flex>

                        <Button
                          colorScheme={config.buttons}
                          size="sm"
                          leftIcon={<FaCheck />}
                          isFullWidth
                          rounded="none"
                          onClick={() => handleSizes(siz.id)}
                          isDisabled={
                            handleStock(siz.id, siz.amount) <= 0 ? true : false
                          }
                        >
                          Selecionar
                        </Button>
                      </Box>
                    ))}
                  </Grid>
                </>
              )}
            </ModalBody>
            <ModalFooter></ModalFooter>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={modalClients}
          onClose={() => setModalClients(false)}
          isCentered
          scrollBehavior="inside"
          size="3xl"
          initialFocusRef={initialRef}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Buscar Clientes</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={4}>
              <Grid templateColumns="1fr 1fr" gap="15px">
                <FormControl>
                  <FormLabel>Buscar por Nome</FormLabel>
                  <Input
                    focusBorderColor={config.inputs}
                    placeholder="Buscar por Nome"
                    ref={initialRef}
                    value={name}
                    onChange={(e) =>
                      finderClientsBySource(
                        capitalizeAllFirstLetter(e.target.value)
                      )
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Buscar por CPF</FormLabel>
                  <Input
                    focusBorderColor={config.inputs}
                    placeholder="Buscar por CPF"
                    value={cpf}
                    onChange={(e) => finderClientsByCPF(e.target.value)}
                  />
                </FormControl>
              </Grid>

              {clients.length === 0 ? (
                <Flex justify="center" align="center" direction="column">
                  <Lottie animation={emptyAnimation} height={200} width={200} />
                  <Text>Nenhum cliente para mostrar</Text>
                </Flex>
              ) : (
                <Table size="sm" mt={5}>
                  <Thead fontWeight="700">
                    <Tr>
                      <Td w="5%"></Td>
                      <Td w="40%">Nome</Td>
                      <Td>CPF</Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {clients.map((cli) => (
                      <Tr key={cli.id}>
                        <Td w="5%" textAlign="center">
                          <Tooltip
                            label="Selecionar este Cliente"
                            hasArrow
                            placement="right"
                          >
                            <IconButton
                              colorScheme={config.buttons}
                              size="xs"
                              rounded="full"
                              icon={<FaCheck />}
                              onClick={() => handleClient(cli.id)}
                            />
                          </Tooltip>
                        </Td>
                        <Td w="40%">{cli.name}</Td>
                        <Td>{cli.cpf}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={modalProducts}
          onClose={() => setModalProducts(false)}
          isCentered
          scrollBehavior="inside"
          size="6xl"
          initialFocusRef={initialRef}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Buscar Produtos</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={4}>
              <Grid templateColumns="70px 1fr 170px 170px" gap="15px">
                <FormControl>
                  <FormLabel mb={0}>
                    Qtd <Kbd ml={1}>F6</Kbd>
                  </FormLabel>
                  <Input
                    type="number"
                    placeholder="Qtd"
                    focusBorderColor={config.inputs}
                    id="qtd"
                    value={qtd}
                    onChange={(e) => setQtd(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel mb={0}>
                    Buscar por nome <Kbd ml={1}>F3</Kbd>
                  </FormLabel>

                  <Input
                    type="text"
                    placeholder="Digite o nome"
                    focusBorderColor={config.inputs}
                    id="name"
                    value={nameProduct}
                    onChange={(e) =>
                      handleByName(capitalizeAllFirstLetter(e.target.value))
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel mb={0}>
                    Cod. de Barras <Kbd ml={1}>F7</Kbd>
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="Cod. Barras"
                    focusBorderColor={config.inputs}
                    id="codebar"
                    value={barcode}
                    onChange={(e) => handleByBarCode(e.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel mb={0}>
                    SKU <Kbd ml={1}>F8</Kbd>
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="SKU"
                    focusBorderColor={config.inputs}
                    id="sku"
                    value={sku}
                    onChange={(e) => handleBySku(e.target.value)}
                  />
                </FormControl>
              </Grid>

              {products.length === 0 ? (
                <Flex justify="center" align="center" direction="column">
                  <Lottie animation={emptyAnimation} height={200} width={200} />
                  <Text>Nenhum produto para mostrar</Text>
                </Flex>
              ) : (
                <>
                  <Table size="sm" mt={2}>
                    <Thead fontWeight="700">
                      <Tr>
                        <Td w="5%"></Td>
                        <Td w="6%">ID</Td>
                        <Td w="40%" isTruncated>
                          Nome
                        </Td>
                        <Td w="18%" isTruncated>
                          SKU
                        </Td>
                        <Td w="18%" isTruncated>
                          Cód. Barras
                        </Td>
                        <Td isNumeric w="13%">
                          Valor
                        </Td>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {products.map((pro) => (
                        <Tr key={pro.id}>
                          <Td w="5%" textAlign="center">
                            <Tooltip
                              label="Selecionar este Produto"
                              hasArrow
                              placement="right"
                            >
                              <IconButton
                                size="xs"
                                colorScheme={config.buttons}
                                icon={<FaCheck />}
                                rounded="full"
                                onClick={() => findSizes(pro.id)}
                              />
                            </Tooltip>
                          </Td>
                          <Td w="6%">{pro.id}</Td>
                          <Td w="40%" isTruncated>
                            {pro.name}
                          </Td>
                          <Td isTruncated w="18%" maxW="18%">
                            {pro.sku}
                          </Td>
                          <Td isTruncated w="18%" maxW="18%">
                            {pro.barcode}
                          </Td>
                          <Td isNumeric w="13%">
                            {pro.promotional === true
                              ? parseFloat(
                                  pro.promotional_value
                                ).toLocaleString("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                })
                              : parseFloat(pro.sale_value).toLocaleString(
                                  "pt-BR",
                                  {
                                    style: "currency",
                                    currency: "BRL",
                                  }
                                )}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>

                  <Flex justify="flex-end" align="center" mt={2}>
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
                      isDisabled={
                        parseInt(page) >= parseInt(pages) ? true : false
                      }
                    >
                      Próxima
                    </Button>
                  </Flex>
                </>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>

        <AlertDialog
          isOpen={alertModal}
          isCentered
          closeOnEsc={false}
          closeOnOverlayClick={false}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Imprimir Pedido
              </AlertDialogHeader>

              <AlertDialogBody>Deseja imprimir este pedido?</AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  onClick={() => handleAlert("no")}
                  colorScheme={config.buttons}
                  variant="outline"
                >
                  Não
                </Button>
                <Button
                  colorScheme={config.buttons}
                  ml={3}
                  onClick={() => handleAlert("yes")}
                >
                  Sim
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        <AlertDialog
          isOpen={alertSave}
          isCentered
          closeOnEsc={false}
          closeOnOverlayClick={false}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Salvar como Orçamento
              </AlertDialogHeader>

              <AlertDialogBody>
                Deseja salvar este pedido como orçamento?
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  onClick={() => setAlertSave(false)}
                  colorScheme={config.buttons}
                  variant="outline"
                >
                  Não
                </Button>
                <Button
                  colorScheme={config.buttons}
                  ml={3}
                  onClick={() => handleAlertSave()}
                >
                  Sim
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Hotkeys>
    </>
  );
}
