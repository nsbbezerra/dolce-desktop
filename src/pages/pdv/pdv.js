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
  Divider,
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
  Image,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
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
} from "@chakra-ui/react";
import config from "../../configs/index";
import HeaderApp from "../../components/headerApp";
import {
  FaShoppingBag,
  FaSearch,
  FaTimes,
  FaPlus,
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
} from "react-icons/fa";
import DatePicker, { registerLocale } from "react-datepicker";
import Hotkeys from "react-hot-keys";
import pt_br from "date-fns/locale/pt-BR";

import PaymentMiddleware from "../../middlewares/payment";
import PrintMiddleware from "../../middlewares/print";

import { useEmployee } from "../../context/Employee";
import useFetch from "../../hooks/useFetch";
import { mutate as mutateGlobal } from "swr";
import api from "../../configs/axios";

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

  const [clients, setClients] = useState([]);
  const [clientsSearch, setClientsSearch] = useState([]);
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [cpf, setCpf] = useState("");
  const [name, setName] = useState("");
  const [client, setClient] = useState({});

  const [orderProducts, setOrderProducts] = useState([]);
  const [productId, setProductId] = useState(null);

  function clear() {
    setClient({});
  }

  function handleInput(id) {
    const inpt = document.getElementById(id);
    inpt.focus();
  }

  async function findClients() {
    try {
      const response = await api.get("/clientsWithAddress");
      setClients(response.data);
      console.log(response.data);
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
      console.log(data.products);
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
      position: "bottom",
      duration: 8000,
      isClosable: true,
    });
  }

  function onKeyDown(keyName, e, handle) {
    switch (keyName) {
      case "ctrl+p":
        setModalPrint(true);
        break;
      case "f11":
        setModalProducts(true);
        break;
      case "f6":
        handleInput("qtd");
        break;
      case "f12":
        setModalPayment(true);
        break;
      case "f3":
        handleInput("name");
        break;
      case "f7":
        handleInput("codebar");
        break;
      case "f8":
        handleInput("sku");
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
      (obj) => obj.id === result.id
    );
    if (findDuplicate) {
      if (findDuplicate.size_id === id) {
        showToast("Este produto já foi inserido", "warning", "Atenção");
        return false;
      }
    }
    const coast =
      result.promotional === true
        ? result.promotional_value
        : result.sale_value;
    let product = {
      id: result.id,
      name: result.name,
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
    showToast("Produto adicionado ao pedido", "success", "Sucesso");
  }

  async function findSizes(id) {
    setLoadingModal(true);
    setProductId(id);
    try {
      const response = await api.get(`/sizeByProduct/${id}`);
      setSizes(response.data);
      console.log(response.data);
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
    console.log(orderProducts);
  }, [orderProducts]);

  async function handleSizes(id) {
    const result = await sizes.find((obj) => obj.id === id);
    console.log(result);
    setModalSizes(false);
    handleProducts(result.id, result.size);
  }

  return (
    <>
      <Hotkeys
        keyName="f2, ctrl+p, f6, f3, f7, f8, f9, f10, f12, f1, f4, f5, f11"
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
                >
                  Produtos <Kbd ml={1}>F11</Kbd>
                </Button>
                <Button
                  isFullWidth
                  colorScheme={config.buttons}
                  leftIcon={<FaSearchPlus />}
                  variant="outline"
                >
                  Buscar Orçamento <Kbd ml={1}>F1</Kbd>
                </Button>
                <Button
                  isFullWidth
                  colorScheme={config.buttons}
                  leftIcon={<FaSave />}
                  variant="outline"
                >
                  Salvar como Orçamento <Kbd ml={1}>F4</Kbd>
                </Button>
                <Button
                  isFullWidth
                  colorScheme={config.buttons}
                  leftIcon={<FaPrint />}
                  variant="outline"
                >
                  Imprimir Pedido <Kbd ml={1}>Ctrl+P</Kbd>
                </Button>
                <Button
                  isFullWidth
                  colorScheme={config.buttons}
                  leftIcon={<FaTrash />}
                  variant="outline"
                >
                  Cancelar Pedido{" "}
                  <Kbd ml={1} color="ButtonText">
                    F5
                  </Kbd>
                </Button>
              </Stack>
            </Box>
            <Box
              borderWidth="1px"
              shadow="md"
              rounded="md"
              p={3}
              h="100%"
              minH="100%"
              maxH="100%"
              overflow="auto"
            >
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

              <Divider mt={3} mb={3} />

              <Table size="sm" maxW="100%">
                <Thead fontWeight="700">
                  <Tr>
                    <Td w="2%" textAlign="center">
                      Qtd
                    </Td>
                    <Td isTruncated>Produto</Td>
                    <Td w="7%" textAlign="center">
                      Cor
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
                  <Tr>
                    <Td w="2%" textAlign="center">
                      10
                    </Td>
                    <Td isTruncated>
                      <Tooltip
                        label="Camiseta Masculina Masculina Topper adasdasdasda"
                        hasArrow
                      >
                        <Text fontSize="sm" isTruncated noOfLines={1} w="10vw">
                          Camiseta Masculina Masculina Topper adasdasdasda
                        </Text>
                      </Tooltip>
                    </Td>
                    <Td w="7%" textAlign="center">
                      <Box w="100%" h="20px" bg="yellow.400" rounded="md" />
                    </Td>
                    <Td w="7%" textAlign="center">
                      PP
                    </Td>
                    <Td w="14%" isNumeric>
                      400,00
                    </Td>
                    <Td w="14%" isNumeric>
                      400,00
                    </Td>
                    <Td w="1%">
                      <Tooltip label="Remover Item" hasArrow>
                        <Popover>
                          <PopoverTrigger>
                            <IconButton
                              colorScheme="red"
                              icon={<FaTimes />}
                              size="xs"
                              variant="link"
                            />
                          </PopoverTrigger>
                          <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader>Confirmação!</PopoverHeader>
                            <PopoverBody>Deseja remover este item?</PopoverBody>
                            <PopoverFooter d="flex" justifyContent="flex-end">
                              <ButtonGroup size="sm">
                                <Button
                                  variant="outline"
                                  colorScheme={config.buttons}
                                >
                                  Não
                                </Button>
                                <Button colorScheme={config.buttons}>
                                  Sim
                                </Button>
                              </ButtonGroup>
                            </PopoverFooter>
                          </PopoverContent>
                        </Popover>
                      </Tooltip>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </Grid>

          <Flex
            h="68px"
            borderWidth="1px"
            shadow="md"
            rounded="md"
            align="center"
          >
            <Grid templateColumns="3fr 1fr" gap="15px">
              <Grid templateColumns="repeat(3, 1fr)" gap="10px" pl={3}>
                <InputGroup size="lg">
                  <InputLeftAddon>Total</InputLeftAddon>
                  <Input focusBorderColor={config.inputs} />
                </InputGroup>

                <InputGroup size="lg">
                  <InputLeftAddon>
                    Desconto <Kbd ml={1}>F9</Kbd>
                  </InputLeftAddon>
                  <Input focusBorderColor={config.inputs} id="discount" />
                </InputGroup>

                <InputGroup size="lg">
                  <InputLeftAddon>
                    A Pagar <Kbd ml={1}>F10</Kbd>
                  </InputLeftAddon>
                  <Input focusBorderColor={config.inputs} id="finalvalue" />;
                </InputGroup>
              </Grid>
              <Grid templateColumns="1fr" gap="15px" pr={3}>
                <Button
                  leftIcon={<FaCheck />}
                  colorScheme={config.buttons}
                  onClick={() => setModalPayment(true)}
                  size="lg"
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
          onClose={() => setModalPayment(false)}
          isCentered
          scrollBehavior="inside"
        >
          <ModalOverlay />
          <ModalContent maxW="60rem" pb={4}>
            <ModalHeader>Adicionar Forma de Pagamento</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {modalPayment === true && <PaymentMiddleware />}
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
          isOpen={modalSizes}
          onClose={() => setModalSizes(false)}
          isCentered
          scrollBehavior="inside"
          size="lg"
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

              <Grid
                templateColumns="repeat(auto-fit, minmax(140px, 140px))"
                gap="20px"
                justifyContent="center"
                mt={5}
              >
                {sizes.length === 0 ? (
                  <Flex justify="center" align="center" direction="column">
                    <Lottie
                      animation={emptyAnimation}
                      height={200}
                      width={200}
                    />
                    <Text>Nenhum tamanho para mostrar</Text>
                  </Flex>
                ) : (
                  <>
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
                            {siz.amount}
                          </Text>
                        </Flex>

                        <Button
                          colorScheme={config.buttons}
                          size="sm"
                          leftIcon={<FaCheck />}
                          isFullWidth
                          rounded="none"
                          onClick={() => handleSizes(siz.id)}
                          isDisabled={siz.amount <= 0 ? true : false}
                        >
                          Selecionar
                        </Button>
                      </Box>
                    ))}
                  </>
                )}
              </Grid>
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
      </Hotkeys>
    </>
  );
}
