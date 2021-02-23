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
  Tooltip,
  Text,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  HStack,
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

export default function Tamanhos() {
  const toast = useToast();
  const { employee } = useEmployee();
  const { data, error } = useFetch("/products");
  const initialRef = useRef();

  const [sizes, setSizes] = useState([]);
  const [sizeName, setSizeName] = useState("");
  const [colors, setColors] = useState([]);
  const [amount, setAmount] = useState(0);
  const [products, setProducts] = useState([]);
  const [validators, setValidators] = useState([]);

  const [modalColor, setModalColor] = useState(false);
  const [modalProducts, setModalProducts] = useState(false);
  const [nameProduct, setNameProduct] = useState("");
  const [idProduct, setIdProduct] = useState(null);
  const [colorName, setColorName] = useState("");
  const [colorId, setColorId] = useState(null);
  const [colorHex, setColorHex] = useState("");
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

  useEffect(() => {
    finderProductsBySource(findProducts);
  }, [findProducts]);

  async function finderProductsBySource(text) {
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
    setColorId(null);
    setColorName("");
    setColorHex("");
    const result = await products.find((obj) => obj.id === id);
    try {
      const response = await api.get(`/sizeDependets/${result.id}`);
      setColors(response.data);
    } catch (error) {
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
  }

  if (error) {
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

  async function handleColor(id) {
    setModalColor(false);
    setSkel(true);
    const result = await colors.find((obj) => obj.id === id);
    setColorName(result.name);
    setColorId(result.id);
    setColorHex(result.hex);
    try {
      const response = await api.get(`/findSize/${result.products_id}`);
      console.log(response);
      setSizes(response.data);
    } catch (error) {
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
      const response = await api.get(`/findSize/${idProduct}`);
      console.log(response);
      setSizes(response.data);
    } catch (error) {
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
    if (!colorId) {
      handleValidator("color", "Nenhuma cor selecionada");
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
        { product: idProduct, color: colorId, size: sizeName, amount: amount },
        { headers: { "x-access-token": employee.token } }
      );
      showToast(response.data.message, "success", "Sucesso");
      setLoading(false);
      setSizeName("");
      setAmount(0);
      findSizes();
    } catch (error) {
      setLoading(false);
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
      <HeaderApp title="Cadastro de Tamanhos" icon={FaRulerCombined} />

      <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
        <Grid templateColumns={"1fr 1fr"} gap="25px">
          <HStack spacing="15px">
            <FormControl
              isRequired
              isInvalid={
                validators.find((obj) => obj.path === "product") ? true : false
              }
            >
              <FormLabel>Produto</FormLabel>
              <Input
                id="product"
                focusBorderColor={config.inputs}
                placeholder="Buscar Produtos"
                w="350px"
                value={nameProduct}
                isReadOnly
              />
              <FormErrorMessage>
                {validators.find((obj) => obj.path === "product")
                  ? validators.find((obj) => obj.path === "product").message
                  : ""}
              </FormErrorMessage>
            </FormControl>
            <FormControl>
              <FormLabel color="transparent" userSelect="none">
                D
              </FormLabel>
              <Button
                isFullWidth
                leftIcon={<FaSearch />}
                onClick={() => setModalProducts(true)}
              >
                Buscar Produto
              </Button>
            </FormControl>
          </HStack>
          <Grid templateColumns="1fr 120px 200px" gap="15px">
            <FormControl
              isRequired
              isInvalid={
                validators.find((obj) => obj.path === "color") ? true : false
              }
            >
              <FormLabel>Nome da Cor</FormLabel>
              <Input
                id="color"
                focusBorderColor={config.inputs}
                placeholder="Nome da Cor"
                isReadOnly
                value={colorName}
              />
              <FormErrorMessage>
                {validators.find((obj) => obj.path === "color")
                  ? validators.find((obj) => obj.path === "color").message
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
            <FormControl>
              <FormLabel color="transparent" userSelect="none">
                D
              </FormLabel>
              <Button
                isFullWidth
                leftIcon={<FaSearch />}
                onClick={() => setModalColor(true)}
              >
                Buscar Cor
              </Button>
            </FormControl>
          </Grid>
        </Grid>

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
            {!!sizes.length && (
              <>
                <Divider mt={5} mb={5} />
                <Wrap spacing="15px">
                  {sizes.map((clr) => (
                    <WrapItem key={clr.id}>
                      <Box w="160px" borderWidth="1px" rounded="md" p={2}>
                        <Flex
                          direction="column"
                          justify="center"
                          align="center"
                        >
                          <Box
                            w="140px"
                            h="40px"
                            rounded="md"
                            bg={`#${clr.hex}`}
                          />
                          <Text>{clr.name}</Text>
                        </Flex>
                        <Divider />
                        <Grid templateColumns="1fr 1fr" gap="10px" mt={2}>
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
                              />
                            </PopoverTrigger>
                            <PopoverContent>
                              <PopoverArrow />
                              <PopoverCloseButton />
                              <PopoverHeader>Confirmação!</PopoverHeader>
                              <PopoverBody>
                                Deseja remover este tamanho?
                              </PopoverBody>
                              <PopoverFooter d="flex" justifyContent="flex-end">
                                <ButtonGroup size="sm">
                                  <Button variant="outline">Não</Button>
                                  <Button
                                    colorScheme="blue"
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
            )}
          </>
        )}
        <Divider mt={5} mb={5} />
        <Button
          leftIcon={<FaSave />}
          colorScheme="blue"
          size="lg"
          isLoading={loading}
          onClick={() => register()}
        >
          Salvar
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
                setFindProducts(capitalizeFirstLetter(e.target.value))
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

      <Modal
        isOpen={modalColor}
        onClose={() => setModalColor(false)}
        size="xl"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent pb={4}>
          <ModalHeader>Selecione uma Cor</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {!!colors.length ? (
              <Table size="sm">
                <Thead fontWeight="700">
                  <Tr>
                    <Td>Cor</Td>
                    <Td w="40%">Demonstração</Td>
                    <Td w="15%" isNumeric></Td>
                  </Tr>
                </Thead>
                <Tbody>
                  {colors.map((cor) => (
                    <Tr key={cor.id}>
                      <Td>{cor.name}</Td>
                      <Td w="40%">
                        <Box
                          bg={`#${cor.hex}`}
                          w="100%"
                          h="25px"
                          rounded="md"
                        />
                      </Td>
                      <Td w="15%" isNumeric>
                        <Tooltip label="Usar esta cor" hasArrow>
                          <IconButton
                            aria-label="Search database"
                            icon={<FaCheck />}
                            size="xs"
                            isRound
                            colorScheme="blue"
                            onClick={() => handleColor(cor.id)}
                          />
                        </Tooltip>
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
    </>
  );
}
