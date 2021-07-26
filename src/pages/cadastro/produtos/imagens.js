import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  Button,
  Grid,
  Text,
  useColorMode,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Divider,
  Image,
  Center,
  HStack,
  Tooltip,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  useToast,
  Stack,
  Skeleton,
  FormErrorMessage,
  Flex,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  ButtonGroup,
  Kbd,
} from "@chakra-ui/react";
import HeaderApp from "../../../components/headerApp";
import { InputFile, File } from "../../../style/uploader";
import {
  FaImage,
  FaSave,
  FaCheck,
  FaSearch,
  FaTimes,
  FaImages,
} from "react-icons/fa";
import config from "../../../configs";
import useFetch from "../../../hooks/useFetch";
import { useEmployee } from "../../../context/Employee";
import api from "../../../configs/axios";
import Hotkeys from "react-hot-keys";
import { AiOutlineClose } from "react-icons/ai";
import Lottie from "../../../components/lottie";
import emptyAnimation from "../../../animations/empty.json";

export default function ImagesSave() {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const { employee } = useEmployee();
  const { data, error } = useFetch("/findProducts");
  const initialRef = useRef();

  const [thumbnail, setThumbnail] = useState(null);
  const [products, setProducts] = useState([]);
  const [validators, setValidators] = useState([]);
  const [findProducts, setFindProducts] = useState("");
  const [modalProducts, setModalProducts] = useState(false);
  const [nameProduct, setNameProduct] = useState("");
  const [idProduct, setIdProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [skel, setSkel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");

  function capitalizeFirstLetter(string) {
    let splited = string.split(" ");
    let toJoin = splited.map((e) => {
      return e.charAt(0).toUpperCase() + e.slice(1);
    });
    let joined = toJoin.join(" ");
    return joined;
  }

  const previewThumbnail = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  async function removeThumbnail() {
    await URL.revokeObjectURL(thumbnail);
    setThumbnail(null);
    setValidators([]);
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

  async function handleProduct(id) {
    const result = await products.find((obj) => obj.id === id);
    setNameProduct(result.name);
    setIdProduct(result.id);
    setModalProducts(false);
    findImagesById(result.id);
  }

  useEffect(() => {
    if (thumbnail) {
      let size = thumbnail.size / 1024;
      let thumbname = thumbnail.name;
      if (thumbname.includes(" ")) {
        handleValidator("image", "Nome da imagem não pode conter espaços");
      }
      if (size > 500) {
        handleValidator(
          "image",
          "Imagem maior que 500kb, insira uma imagem menor"
        );
      }
    } else {
      setValidators([]);
    }
  }, [thumbnail]);

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

  async function findBaseUrl() {
    const base = await localStorage.getItem("baseUrl");
    setBaseUrl(base);
  }

  useEffect(() => {
    findBaseUrl();
  }, []);

  useEffect(() => {
    setProducts(data);
  }, [data]);

  function handleValidator(path, message) {
    let val = [];
    let info = { path: path, message: message };
    val.push(info);
    setValidators(val);
    if (path !== "image") {
      const inpt = document.getElementById(path);
      inpt.focus();
    }
    setTimeout(() => {
      setValidators([]);
    }, 4000);
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

  async function findImages() {
    setSkel(true);
    try {
      const response = await api.get(`/findImages/${idProduct}`);
      setImages(response.data);
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

  async function findImagesById(id) {
    setSkel(true);
    try {
      const response = await api.get(`/findImages/${id}`);
      setImages(response.data);
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
    if (!thumbnail) {
      handleValidator("image", "Selecione uma imagem");
      return false;
    }
    if (thumbnail.name.includes(" ")) {
      handleValidator("image", "Nome da imagem não pode conter espaços");
      return false;
    }
    let size = thumbnail.size / 1024;
    if (size > 500) {
      handleValidator(
        "image",
        "Imagem maior que 500kb, insira uma imagem menor"
      );
      return false;
    }
    setValidators([]);
    setLoading(true);
    let data = new FormData();
    data.append("product", idProduct);
    data.append("image", thumbnail);
    try {
      const response = await api.post("/imageColors", data, {
        headers: { "x-access-token": employee.token },
      });
      setThumbnail(null);
      setLoading(false);
      showToast(response.data.message, "success", "Sucesso");
      findImages();
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

  function removeImages(id) {
    const index = images.filter((item) => item.id !== id);
    setImages(index);
  }

  async function deleteImages(id) {
    setSkel(true);
    try {
      const response = await api.delete(`/imageColors/${id}`, {
        headers: { "x-access-token": employee.token },
      });
      showToast(response.data.message, "success", "Sucesso");
      removeImages(id);
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
        <HeaderApp title="Cadastro de Imagens" icon={FaImages} />

        <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
          <FormControl
            isRequired
            isInvalid={
              validators.find((obj) => obj.path === "product") ? true : false
            }
          >
            <FormLabel>Produto</FormLabel>
            <Grid templateColumns="1fr 200px" gap="15px">
              <Input
                id="product"
                focusBorderColor={config.inputs}
                placeholder="Buscar Produtos"
                w="100%"
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
                <Kbd color="ButtonText" ml={3}>
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

          <Grid templateColumns="300px 1fr" gap="15px">
            <Box>
              <FormControl
                isRequired
                isInvalid={
                  validators.find((obj) => obj.path === "image") ? true : false
                }
              >
                <FormLabel>Imagem</FormLabel>
                <Box w="300px" h="300px">
                  {thumbnail ? (
                    <Box rounded="md" borderWidth="1px" overflow="hidden">
                      <Image src={previewThumbnail} w="300px" h="300px" />
                      <Flex justify="center" mt="-30px">
                        <Tooltip label="Remover Imagem" hasArrow>
                          <IconButton
                            icon={<AiOutlineClose />}
                            colorScheme="red"
                            rounded="full"
                            size="sm"
                            shadow="md"
                            onClick={() => removeThumbnail()}
                          />
                        </Tooltip>
                      </Flex>
                    </Box>
                  ) : (
                    <InputFile alt={300} lar={300} cor={colorMode}>
                      <File
                        type="file"
                        onChange={(event) =>
                          setThumbnail(event.target.files[0])
                        }
                      />
                      <FaImage style={{ fontSize: 50, marginBottom: 20 }} />
                      <Text>
                        Insira uma imagem 300x300 pixels, de até 500kb
                      </Text>
                    </InputFile>
                  )}
                </Box>
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "image")
                    ? validators.find((obj) => obj.path === "image").message
                    : ""}
                </FormErrorMessage>
              </FormControl>
              <Button
                leftIcon={<FaSave />}
                colorScheme={config.buttons}
                size="lg"
                mt={3}
                isFullWidth
                onClick={() => register()}
                isLoading={loading}
              >
                Salvar Imagem{" "}
                <Kbd color="ButtonText" ml={3}>
                  F12
                </Kbd>
              </Button>
            </Box>

            <Box rounded="md" p={3}>
              {skel === false ? (
                <Grid
                  templateColumns="repeat(auto-fit, minmax(200px, 200px))"
                  gap="15px"
                  justifyContent="center"
                >
                  {!!images.length ? (
                    <>
                      {images.map((img) => (
                        <Box
                          w="200px"
                          p={2}
                          shadow="md"
                          rounded="md"
                          borderWidth="1px"
                          key={img.id}
                        >
                          <Image
                            src={`${baseUrl}/imagem/${img.image}`}
                            w="200px"
                            h="200px"
                            rounded="md"
                          />
                          <Popover>
                            <PopoverTrigger>
                              <Button
                                leftIcon={<FaTimes />}
                                isFullWidth
                                colorScheme="red"
                                mt={3}
                                size="sm"
                              >
                                Excluir Imagem
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent>
                              <PopoverArrow />
                              <PopoverCloseButton />
                              <PopoverHeader>Confirmação!</PopoverHeader>
                              <PopoverBody>
                                Deseja remover esta imagem?
                              </PopoverBody>
                              <PopoverFooter d="flex" justifyContent="flex-end">
                                <ButtonGroup size="sm">
                                  <Button
                                    variant="outline"
                                    colorScheme={config.buttons}
                                  >
                                    Não
                                  </Button>
                                  <Button
                                    colorScheme={config.buttons}
                                    onClick={() => deleteImages(img.id)}
                                  >
                                    Sim
                                  </Button>
                                </ButtonGroup>
                              </PopoverFooter>
                            </PopoverContent>
                          </Popover>
                        </Box>
                      ))}
                    </>
                  ) : (
                    <Flex justify="center" align="center" direction="column">
                      <Lottie
                        animation={emptyAnimation}
                        height={200}
                        width={200}
                      />
                      <Text>Nenhuma imagem para mostrar</Text>
                    </Flex>
                  )}
                </Grid>
              ) : (
                <Stack mt={3}>
                  <Skeleton height="30px" />
                  <Skeleton height="30px" />
                  <Skeleton height="30px" />
                  <Skeleton height="30px" />
                </Stack>
              )}
            </Box>
          </Grid>
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
