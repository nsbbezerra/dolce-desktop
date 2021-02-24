import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Divider,
  Wrap,
  WrapItem,
  Box,
  Text,
  Center,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Stack,
  Skeleton,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  ModalCloseButton,
  ModalBody,
  Kbd,
  FormErrorMessage,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  ButtonGroup,
} from "@chakra-ui/react";
import config from "../../../configs/index";
import { FaSave, FaSearch, FaTimes, FaCheck } from "react-icons/fa";
import { AiOutlineBgColors } from "react-icons/ai";
import HeaderApp from "../../../components/headerApp";
import api from "../../../configs/axios";
import useFetch from "../../../hooks/useFetch";
import { useEmployee } from "../../../context/Employee";
import Hotkeys from "react-hot-keys";
import { AiOutlineEnter } from "react-icons/ai";

export default function Cores({ id }) {
  const toast = useToast();
  const { data, error } = useFetch("/colorDependents");
  const { employee } = useEmployee();
  const initialRef = useRef();

  const [colorHex, setColorHex] = useState("");
  const [modalProducts, setModalProducts] = useState(false);
  const [colors, setColors] = useState([]);
  const [products, setProducts] = useState([]);
  const [colorName, setColorName] = useState("");
  const [findProducts, setFindProducts] = useState("");
  const [nameProduct, setNameProduct] = useState("");
  const [idProduct, setIdProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [skel, setSkel] = useState(false);

  function clear() {
    setColorName("");
    setColorHex("");
  }

  const [validators, setValidators] = useState([]);

  useEffect(() => {
    setProducts(data);
  }, [data]);

  function handleValidator(path, message) {
    let val = [];
    let info = { path: path, message: message };
    val.push(info);
    setValidators(val);
    const inpt = document.getElementById(path);
    inpt.focus();
  }

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom-right",
      duration: 8000,
    });
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

  function capitalizeFirstLetter(string) {
    let splited = string.split(" ");
    let toJoin = splited.map((e) => {
      return e.charAt(0).toUpperCase() + e.slice(1);
    });
    let joined = toJoin.join(" ");
    return joined;
  }

  function remove(id) {
    const index = colors.filter((item) => item.id !== id);
    setColors(index);
  }

  async function removeColor(id) {
    setSkel(true);
    try {
      const responseColor = await api.delete(`/colors/${id}`, {
        headers: { "x-access-token": employee.token },
      });
      showToast(responseColor.data.message, "success", "Sucesso");
      remove(id);
      setSkel(false);
    } catch (error) {
      setSkel(false);
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
  }

  async function handleProduct(id) {
    setSkel(true);
    const result = await products.find((obj) => obj.id === id);
    try {
      const response = await api.get(`/colorsGet/${result.id}`);
      setColors(response.data);
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
    setNameProduct(result.name);
    setIdProduct(result.id);
    setModalProducts(false);
    setSkel(false);
  }

  function onKeyDown(keyName, e, handle) {
    if (keyName === "f3") {
      setModalProducts(true);
    }
    if (keyName === "enter" || keyName === "return") {
      register(e);
    }
  }

  async function register(e) {
    if (e) {
      e.preventDefault();
    }
    if (!idProduct) {
      handleValidator("product", "Nenhum produto selecionado");
      return false;
    }
    if (colorName === "" || !colorName) {
      handleValidator("name", "O Nome da cor é obrigatório");
      return false;
    }
    if (colorHex === "" || !colorHex) {
      handleValidator("hex", "O Hexadecimal da cor é obrigatório");
      return false;
    }
    if (colorHex.includes("#")) {
      handleValidator("hex", "Insira um Hexadecimal válido");
      return false;
    }
    setLoading(true);

    try {
      const response = await api.post(
        "/colors",
        {
          product: idProduct,
          name: colorName,
          hex: colorHex,
        },
        { headers: { "x-access-token": employee.token } }
      );
      setColors(response.data.colors);
      showToast(response.data.message, "success", "Sucesso");
      clear();
      setLoading(false);
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
      <Hotkeys
        keyName="f3, enter, return"
        onKeyDown={onKeyDown}
        allowRepeat
        filter={(event) => {
          return true;
        }}
      >
        <HeaderApp title="Cadastro de Cores" icon={AiOutlineBgColors} />

        <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
          <Grid templateColumns={"1fr 200px"} gap="15px">
            <FormControl
              isInvalid={
                validators.find((obj) => obj.path === "product") ? true : false
              }
            >
              <Input
                id="product"
                focusBorderColor={config.inputs}
                placeholder="Buscar Produtos"
                value={nameProduct}
                isReadOnly
              />
              <FormErrorMessage>
                {validators.find((obj) => obj.path === "product")
                  ? validators.find((obj) => obj.path === "product").message
                  : ""}
              </FormErrorMessage>
            </FormControl>
            <Button
              isFullWidth
              leftIcon={<FaSearch />}
              onClick={() => setModalProducts(true)}
            >
              Buscar Produto
              <Kbd ml={3}>F3</Kbd>
            </Button>
          </Grid>

          <Divider mt={5} mb={5} />

          <Grid templateColumns="repeat(3, 1fr)" gap="15px">
            <FormControl
              isRequired
              isInvalid={
                validators.find((obj) => obj.path === "name") ? true : false
              }
            >
              <FormLabel>Nome da Cor</FormLabel>
              <Input
                id="name"
                focusBorderColor={config.inputs}
                placeholder="Nome da Cor"
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
              />
              <FormErrorMessage>
                {validators.find((obj) => obj.path === "name")
                  ? validators.find((obj) => obj.path === "name").message
                  : ""}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={
                validators.find((obj) => obj.path === "hex") ? true : false
              }
            >
              <FormLabel>Hexadecimal</FormLabel>
              <InputGroup>
                <InputLeftAddon children="#" />
                <Input
                  id="hex"
                  type="text"
                  borderLeftRadius="0"
                  value={colorHex}
                  onChange={(e) => setColorHex(e.target.value)}
                  focusBorderColor={config.inputs}
                />
              </InputGroup>
              <FormErrorMessage>
                {validators.find((obj) => obj.path === "hex")
                  ? validators.find((obj) => obj.path === "hex").message
                  : ""}
              </FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormLabel>Demonstração</FormLabel>
              <Input
                focusBorderColor={config.inputs}
                bg={`#${colorHex}`}
                isReadOnly
              />
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
              {!!colors.length && (
                <>
                  <Divider mt={5} mb={5} />
                  <Wrap spacing="15px">
                    {colors.map((clr) => (
                      <WrapItem key={clr.id}>
                        <Box w="140px">
                          <Box
                            w="140px"
                            h="60px"
                            bg={`#${clr.hex}`}
                            rounded="md"
                          />
                          <Center>
                            <Text>{clr.name}</Text>

                            <Popover>
                              <PopoverTrigger>
                                <IconButton
                                  aria-label="Search database"
                                  variant="link"
                                  colorScheme="red"
                                  icon={<FaTimes />}
                                  ml={1}
                                />
                              </PopoverTrigger>
                              <PopoverContent>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverHeader>Confirmação!</PopoverHeader>
                                <PopoverBody>
                                  Deseja remover esta cor?
                                </PopoverBody>
                                <PopoverFooter
                                  d="flex"
                                  justifyContent="flex-end"
                                >
                                  <ButtonGroup size="sm">
                                    <Button variant="outline">Não</Button>
                                    <Button
                                      colorScheme="blue"
                                      onClick={() => removeColor(clr.id)}
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
              )}
            </>
          )}

          <Divider mt={5} mb={5} />
          <Button
            leftIcon={<FaSave />}
            colorScheme="blue"
            size="lg"
            onClick={() => register()}
            isLoading={loading}
          >
            Salvar Cor{" "}
            <Kbd ml={3} color="ButtonText">
              <Icon as={AiOutlineEnter} />
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
                            colorScheme="blue"
                            onClick={() => handleProduct(pro.id)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
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
