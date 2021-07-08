import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  Button,
  FormControl,
  FormLabel,
  Input,
  Divider,
  Wrap,
  WrapItem,
  Box,
  Center,
  IconButton,
  Text,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tr,
  Td,
  Tbody,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Skeleton,
  Stack,
  FormErrorMessage,
  ButtonGroup,
  Kbd,
} from "@chakra-ui/react";
import config from "../../../configs/index";
import {
  FaCheck,
  FaRulerCombined,
  FaSave,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import HeaderApp from "../../../components/headerApp";
import { useEmployee } from "../../../context/Employee";
import useFetch from "../../../hooks/useFetch";
import api from "../../../configs/axios";
import Hotkeys from "react-hot-keys";
import Lottie from "../../../components/lottie";
import emptyAnimation from "../../../animations/empty.json";

export default function Tamanhos() {
  const toast = useToast();
  const { employee } = useEmployee();
  const { data, error } = useFetch("/findProducts");
  const initialRef = useRef();

  const [sizes, setSizes] = useState([]);
  const [sizeName, setSizeName] = useState("");
  const [amount, setAmount] = useState(0);
  const [products, setProducts] = useState([]);
  const [validators, setValidators] = useState([]);

  const [modalProducts, setModalProducts] = useState(false);
  const [nameProduct, setNameProduct] = useState("");
  const [idProduct, setIdProduct] = useState(null);
  const [skel, setSkel] = useState(false);
  const [loading, setLoading] = useState(false);

  const [findProducts, setFindProducts] = useState("");

  function handleValidator(path, message) {
    let val = [];
    let info = { path: path, message: message };
    val.push(info);
    setValidators(val);
    const inpt = document.getElementById(path);
    inpt.focus();
  }

  async function finderProductsBySource(text) {
    setFindProducts(text);
    if (text === "") {
      await setProducts(data);
    } else {
      let termos = await text.split(" ");
      let frasesFiltradas = await products.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.name.includes(termoBuscado);
        }, true);
      });
      await setProducts(frasesFiltradas);
    }
  }

  function capitalizeFirstLetter(string) {
    let splited = string.split(" ");
    let toJoin = splited.map((e) => {
      return e.charAt(0).toUpperCase() + e.slice(1);
    });
    let joined = toJoin.join(" ");
    return joined;
  }

  useEffect(() => {
    setProducts(data);
  }, [data]);

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom-right",
      duration: 8000,
    });
  }

  async function handleProduct(id) {
    const result = await products.find((obj) => obj.id === id);
    setNameProduct(result.name);
    setIdProduct(result.id);
    setModalProducts(false);
    findSizesById(result.id);
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

  function removeSize(id) {
    const index = sizes.filter((item) => item.id !== id);
    setSizes(index);
  }

  async function deleteSize(id) {
    setSkel(true);
    try {
      const response = await api.delete(`/sizes/${id}`, {
        headers: { "x-access-token": employee.token },
      });
      showToast(response.data.message, "success", "Sucesso");
      removeSize(id);
    } catch (error) {
      if (error.message === "Network Error") {
        alert(
          "Sem conexão com o servidor, verifique sua conexão com a internet."
        );
        return false;
      }
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
    setSkel(false);
  }

  async function findSizes() {
    setSkel(true);
    try {
      const response = await api.get(`/findSizeByProduct/${idProduct}`);
      setSizes(response.data);
    } catch (error) {
      if (error.message === "Network Error") {
        alert(
          "Sem conexão com o servidor, verifique sua conexão com a internet."
        );
        return false;
      }
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
    setSkel(false);
  }

  async function findSizesById(id) {
    setSkel(true);
    try {
      const response = await api.get(`/findSizeByProduct/${id}`);
      setSizes(response.data);
    } catch (error) {
      if (error.message === "Network Error") {
        alert(
          "Sem conexão com o servidor, verifique sua conexão com a internet."
        );
        return false;
      }
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
    setSkel(false);
  }

  async function register(e) {
    if (e) {
      e.preventDefault();
    }
    if (!idProduct) {
      handleValidator("product", "Nenhum produto selecionado");
      return false;
    }
    if (sizeName === "") {
      handleValidator("size", "Insira um tamanho");
      return false;
    }
    setValidators([]);
    setLoading(true);
    try {
      const response = await api.post(
        "/sizes",
        { product: idProduct, size: sizeName, amount: amount },
        { headers: { "x-access-token": employee.token } }
      );
      showToast(response.data.message, "success", "Sucesso");
      setLoading(false);
      setSizeName("");
      setAmount(0);
      findSizes();
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

  function onKeyDown(keyName, e, handle) {
    if (keyName === "f2") {
      setModalProducts(true);
    }
    if (keyName === "f12") {
      register(e);
    }
  }

  return (
    <>
      <Hotkeys
        keyName="f2, f12"
        onKeyDown={onKeyDown}
        allowRepeat
        filter={(event) => {
          return true;
        }}
      >
        <HeaderApp title="Cadastro de Tamanhos" icon={FaRulerCombined} />

        <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
          <FormControl
            isRequired
            isInvalid={
              validators.find((obj) => obj.path === "product") ? true : false
            }
          >
            <FormLabel>Produto</FormLabel>
            <Grid templateColumns="1fr 200px" gap="20px">
              <Input
                id="product"
                focusBorderColor={config.inputs}
                placeholder="Buscar Produtos"
                value={nameProduct}
                isReadOnly
              />
              <Button
                isFullWidth
                leftIcon={<FaSearch />}
                onClick={() => setModalProducts(true)}
                colorScheme={config.buttons}
                variant="outline"
              >
                Buscar Produto
                <Kbd ml={3} color="ButtonText">
                  F2
                </Kbd>
              </Button>
            </Grid>
            <FormErrorMessage>
              {validators.find((obj) => obj.path === "product")
                ? validators.find((obj) => obj.path === "product").message
                : ""}
            </FormErrorMessage>
          </FormControl>

          <Divider mt={5} mb={5} />

          <Grid templateColumns="repeat(2, 1fr)" gap="15px">
            <FormControl
              isRequired
              isInvalid={
                validators.find((obj) => obj.path === "size") ? true : false
              }
            >
              <FormLabel>Tamanho</FormLabel>
              <Input
                id="size"
                focusBorderColor={config.inputs}
                placeholder="Tamanho"
                value={sizeName}
                onChange={(e) => setSizeName(e.target.value.toUpperCase())}
              />
              <FormErrorMessage>
                {validators.find((obj) => obj.path === "size")
                  ? validators.find((obj) => obj.path === "size").message
                  : ""}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={
                validators.find((obj) => obj.path === "amount") ? true : false
              }
            >
              <FormLabel>Estoque</FormLabel>
              <Input
                id="amount"
                focusBorderColor={config.inputs}
                placeholder="Estoque"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <FormErrorMessage>
                {validators.find((obj) => obj.path === "amount")
                  ? validators.find((obj) => obj.path === "amount").message
                  : ""}
              </FormErrorMessage>
            </FormControl>
          </Grid>

          {skel ? (
            <Stack mt={3}>
              <Skeleton height="30px" />
              <Skeleton height="30px" />
              <Skeleton height="30px" />
              <Skeleton height="30px" />
            </Stack>
          ) : (
            <>
              {!!sizes.length ? (
                <>
                  <Divider mt={5} mb={5} />
                  <Wrap spacing="15px">
                    {sizes.map((clr) => (
                      <WrapItem key={clr.id}>
                        <Box w="160px" borderWidth="1px" rounded="md" p={2}>
                          <Grid templateColumns="1fr 1fr" gap="10px">
                            <FormControl>
                              <FormLabel>Tamanho</FormLabel>
                              <Input
                                focusBorderColor={config.inputs}
                                value={clr.size}
                                isReadOnly
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>QTD</FormLabel>
                              <Input
                                focusBorderColor={config.inputs}
                                value={clr.amount}
                                isReadOnly
                              />
                            </FormControl>
                          </Grid>
                          <Center mt={3} mb={1}>
                            <Popover>
                              <PopoverTrigger>
                                <IconButton
                                  aria-label="Search database"
                                  variant="link"
                                  colorScheme="red"
                                  icon={<FaTimes />}
                                  ml={1}
                                  colorScheme={config.buttons}
                                />
                              </PopoverTrigger>
                              <PopoverContent>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverHeader>Confirmação!</PopoverHeader>
                                <PopoverBody>
                                  Deseja remover este tamanho?
                                </PopoverBody>
                                <PopoverFooter
                                  d="flex"
                                  justifyContent="flex-end"
                                >
                                  <ButtonGroup size="sm">
                                    <Button
                                      variant="outline"
                                      colorScheme={config.buttons}
                                    >
                                      Não
                                    </Button>
                                    <Button
                                      colorScheme={config.buttons}
                                      onClick={() => deleteSize(clr.id)}
                                    >
                                      Sim
                                    </Button>
                                  </ButtonGroup>
                                </PopoverFooter>
                              </PopoverContent>
                            </Popover>
                          </Center>
                        </Box>
                      </WrapItem>
                    ))}
                  </Wrap>
                </>
              ) : (
                <Flex justify="center" align="center" direction="column">
                  <Lottie animation={emptyAnimation} height={200} width={200} />
                  <Text>Nenhum tamanho para mostrar</Text>
                </Flex>
              )}
            </>
          )}
          <Divider mt={5} mb={5} />
          <Button
            leftIcon={<FaSave />}
            colorScheme={config.buttons}
            size="lg"
            isLoading={loading}
            onClick={() => register()}
          >
            Salvar
            <Kbd ml={3} color="ButtonText">
              F12
            </Kbd>
          </Button>
        </Box>

        <Modal
          isOpen={modalProducts}
          onClose={() => setModalProducts(false)}
          size="xl"
          scrollBehavior="inside"
          isCentered
          initialFocusRef={initialRef}
        >
          <ModalOverlay />
          <ModalContent pb={4}>
            <ModalHeader>Produtos</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Digite para Buscar"
                focusBorderColor={config.inputs}
                value={findProducts}
                onChange={(e) =>
                  finderProductsBySource(capitalizeFirstLetter(e.target.value))
                }
                ref={initialRef}
              />
              {products ? (
                <>
                  {products.length === 0 ? (
                    <Flex justify="center" align="center" direction="column">
                      <Lottie
                        animation={emptyAnimation}
                        height={200}
                        width={200}
                      />
                      <Text>Nenhum produto para mostrar</Text>
                    </Flex>
                  ) : (
                    <Table size="sm" mt={3}>
                      <Thead fontWeight="700">
                        <Tr>
                          <Td>Produto</Td>
                          <Td w="10%" isNumeric></Td>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {products.map((pro) => (
                          <Tr key={pro.id}>
                            <Td>{pro.name}</Td>
                            <Td w="10%" isNumeric>
                              <IconButton
                                aria-label="Search database"
                                icon={<FaCheck />}
                                size="xs"
                                isRound
                                colorScheme={config.buttons}
                                onClick={() => handleProduct(pro.id)}
                              />
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  )}
                </>
              ) : (
                <Stack mt={3}>
                  <Skeleton height="30px" />
                  <Skeleton height="30px" />
                  <Skeleton height="30px" />
                  <Skeleton height="30px" />
                </Stack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Hotkeys>
    </>
  );
}
