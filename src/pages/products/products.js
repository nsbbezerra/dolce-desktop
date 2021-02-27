import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
  Grid,
  Select,
  Input,
  Switch,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useColorMode,
  Image,
  Flex,
  useToast,
  FormControl,
  FormLabel,
  Kbd,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import config from "../../configs/index";
import HeaderApp from "../../components/headerApp";
import { MdKeyboardArrowDown } from "react-icons/md";
import {
  FaSave,
  FaSearch,
  FaEdit,
  FaImage,
  FaTag,
  FaBoxOpen,
} from "react-icons/fa";
import { InputFile, File } from "../../style/uploader";
import { AiOutlineClose } from "react-icons/ai";
import StarRatings from "react-star-ratings";
import { useEmployee } from "../../context/Employee";
import useFetch from "../../hooks/useFetch";
import api from "../../configs/axios";
import Lottie from "../../components/lottie";
import emptyAnimation from "../../animations/empty.json";
import searchAnimation from "../../animations/search.json";
import sendAnimation from "../../animations/send.json";
import { mutate as mutateGlobal } from "swr";
import Hotkeys from "react-hot-keys";

import Products from "./edit/produtos/produtos";
import Sizes from "./edit/produtos/tamanhos";
import Imagens from "./edit/produtos/imagens";

export default function CategoryList() {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const { employee } = useEmployee();
  const { data, error, mutate } = useFetch("/products");

  const [modalInfo, setModalInfo] = useState(false);
  const [modalImage, setModalImage] = useState(false);
  const [modalSize, setModalSize] = useState(false);
  const [modalPromo, setModalPromo] = useState(false);
  const [modalGerImg, setModalGerImg] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [advancedFind, setAdvancedFind] = useState("4");
  const [promoStatus, setPromoStatus] = useState(null);
  const [promoValue, setPromoValue] = useState("0");
  const [productId, setProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    console.log(data);
    setProducts(data);
  }, [data]);

  const previewThumbnail = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  async function removeThumbnail() {
    await URL.revokeObjectURL(thumbnail);
    setThumbnail(null);
  }

  function capitalizeFirstLetter(string) {
    let splited = string.split(" ");
    let toJoin = splited.map((e) => {
      return e.charAt(0).toUpperCase() + e.slice(1);
    });
    let joined = toJoin.join(" ");
    return joined;
  }

  function capitalizeOneLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async function finderProdBySource(text) {
    setSearchProduct(text);
    let index;
    if (advancedFind === "1") {
      const result = await data.filter((obj) => obj.active === true);
      index = result;
    }
    if (advancedFind === "2") {
      const result = await data.filter((obj) => obj.active === false);
      index = result;
    }
    if (advancedFind === "3") {
      const result = await data.filter((obj) => obj.promotional === true);
      index = result;
    }
    if (advancedFind === "4") {
      index = data;
    }
    if (text === "") {
      await setProducts(index);
    } else {
      let termos = await text.split(" ");
      let frasesFiltradas = await index.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.name.includes(termoBuscado);
        }, true);
      });
      await setProducts(frasesFiltradas);
    }
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

  function onKeyDown(keyName, e, handle) {
    if (keyName === "f3") {
      const inpt = document.getElementById("search");
      inpt.focus();
    }
  }

  async function handleSearch() {
    if (advancedFind === "1") {
      const result = await data.filter((obj) => obj.active === true);

      await setProducts(result);
    }
    if (advancedFind === "2") {
      const result = await data.filter((obj) => obj.active === false);

      await setProducts(result);
    }
    if (advancedFind === "3") {
      const result = await data.filter((obj) => obj.promotional === true);

      await setProducts(result);
    }
    if (advancedFind === "4") {
      await setProducts(data);
    }
  }

  function handlePromo(value, id) {
    setProductId(id);
    setPromoStatus(value);
    setModalPromo(true);
  }

  async function setPromo() {
    setModalPromo(false);
    setLoading(true);
    try {
      const response = await api.put(
        `/setPromotional/${productId}`,
        {
          promotional: promoStatus,
          promotional_value: parseFloat(promoValue),
        },
        { headers: { "x-access-token": employee.token } }
      );
      const updatedProducts = await data.map((prod) => {
        if (prod.id === productId) {
          return {
            ...prod,
            promotional: response.data.product[0].promotional,
            promotional_value: response.data.product[0].promotional_value,
          };
        }
        return prod;
      });
      mutate(updatedProducts, false);
      mutateGlobal(`/setPromotional/${productId}`, {
        id: productId,
        promotional: response.data.product[0].promotional,
        promotional_value: response.data.product[0].promotional_value,
      });
      setLoading(false);
      showToast(response.data.message, "success", "Sucesso");
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

  async function handleActive(value, id) {
    try {
      const response = await api.put(
        `/productsActive/${id}`,
        { active: value },
        { headers: { "x-access-token": employee.token } }
      );
      const productsUpdated = await data.map((prod) => {
        if (prod.id === id) {
          return {
            ...prod,
            active: response.data.product[0].active,
          };
        }
        return prod;
      });
      mutate(productsUpdated, false);
      mutateGlobal(`/productsActive/${id}`, {
        id: id,
        active: response.data.product[0].active,
      });
      showToast(response.data.message, "success", "Sucesso");
    } catch (error) {
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

  async function handleImageProduct(id) {
    const result = await data.find((obj) => obj.id === id);
    setProductId(result.id);
    setUrl(result.thumbnail);
    setModalImage(true);
  }

  async function handelUpdateImage() {
    if (!thumbnail) {
      return false;
    }
    setLoadingImage(true);
    try {
      let dataImage = new FormData();
      dataImage.append("thumbnail", thumbnail);
      const response = await api.put(
        `/productChangeImage/${productId}`,
        dataImage,
        { headers: { "x-access-token": employee.token } }
      );
      const productUpdated = await data.map((prod) => {
        if (prod.id === productId) {
          return {
            ...prod,
            blobName: response.data.blobName,
            thumbnail: response.data.url,
          };
        }
        return prod;
      });
      mutate(productUpdated, false);
      mutateGlobal(`/productChangeImage/${productId}`, {
        id: productId,
        blobName: response.data.blobName,
        thumbnail: response.data.url,
      });
      setThumbnail(null);
      removeThumbnail();
      setModalImage(false);
      setLoadingImage(false);
      showToast(response.data.message, "success", "Sucesso");
    } catch (error) {
      setLoadingImage(false);
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
        keyName="f3"
        onKeyDown={onKeyDown}
        allowRepeat
        filter={(event) => {
          return true;
        }}
      >
        <HeaderApp title="Gerenciar Produtos" icon={FaTag} />

        <Box borderWidth="1px" shadow="md" rounded="md" p={3} mt="25px">
          <Grid templateColumns="2fr 1fr" gap="15px">
            <FormControl>
              <FormLabel>
                Digite para buscar <Kbd ml={3}>F3</Kbd>
              </FormLabel>
              <Input
                id="search"
                type="text"
                placeholder="Digite para buscar"
                focusBorderColor={config.inputs}
                value={searchProduct}
                onChange={(e) =>
                  finderProdBySource(capitalizeFirstLetter(e.target.value))
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Selecione uma opção de busca:</FormLabel>
              <Grid templateColumns="1fr 150px" gap="15px">
                <Select
                  placeholder="Selecione uma opção de busca"
                  focusBorderColor={config.inputs}
                  value={advancedFind}
                  onChange={(e) => setAdvancedFind(e.target.value)}
                >
                  <option value={"1"}>Todos os Ativos</option>
                  <option value={"2"}>Todos os Bloqueados</option>
                  <option value={"3"}>Todos os Promocionais</option>
                  <option value={"4"}>Todos os Produtos</option>
                </Select>

                <Button
                  leftIcon={<FaSearch />}
                  colorScheme={config.buttons}
                  variant="outline"
                  onClick={() => handleSearch()}
                >
                  Buscar
                </Button>
              </Grid>
            </FormControl>
          </Grid>

          {!products ? (
            <Flex justify="center" align="center" direction="column">
              <Lottie animation={searchAnimation} height={200} width={200} />
              <Text>Buscando Informações</Text>
            </Flex>
          ) : (
            <>
              {products.length === 0 ? (
                <Flex justify="center" align="center" direction="column">
                  <Lottie animation={emptyAnimation} height={200} width={200} />
                  <Text>Nenhum produto para mostrar</Text>
                </Flex>
              ) : (
                <Table size="sm" mt="25px">
                  <Thead fontWeight="700">
                    <Tr>
                      <Td w="5%" textAlign="center">
                        Ativo?
                      </Td>
                      <Td w="5%" textAlign="center">
                        Promo?
                      </Td>
                      <Td w="25%">Nome</Td>
                      <Td w="15%" isNumeric>
                        Valor de Custo
                      </Td>
                      <Td w="15%" isNumeric>
                        Valor de Venda
                      </Td>
                      <Td w="15%" isNumeric>
                        Valor Promocional
                      </Td>
                      <Td w="10%" textAlign="center">
                        Avaliação
                      </Td>
                      <Td w="10%"></Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {products.map((prod) => (
                      <Tr key={prod.id}>
                        <Td w="5%" textAlign="center">
                          <Switch
                            colorScheme={config.switchs}
                            defaultIsChecked={prod.active}
                            onChange={(e) =>
                              handleActive(e.target.checked, prod.id)
                            }
                          />
                        </Td>
                        <Td w="5%" textAlign="center">
                          <Switch
                            colorScheme={config.switchs}
                            defaultIsChecked={prod.promotional}
                            onChange={(e) =>
                              handlePromo(e.target.checked, prod.id)
                            }
                          />
                        </Td>
                        <Td w="25%">{prod.name}</Td>
                        <Td w="15%" isNumeric>
                          {parseFloat(prod.cost_value).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </Td>
                        <Td w="15%" isNumeric>
                          {parseFloat(prod.sale_value).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </Td>
                        <Td w="15%" isNumeric>
                          {!prod.promotional_value
                            ? parseFloat("0,00").toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })
                            : parseFloat(prod.promotional_value).toLocaleString(
                                "pt-BR",
                                {
                                  style: "currency",
                                  currency: "BRL",
                                }
                              )}
                        </Td>
                        <Td w="10%" textAlign="center">
                          <StarRatings
                            rating={!prod.rating ? 0 : parseFloat(prod.rating)}
                            starDimension="15px"
                            starSpacing="2px"
                            starRatedColor={config.primary}
                          />
                        </Td>
                        <Td w="10%">
                          <Menu>
                            <MenuButton
                              isFullWidth
                              as={Button}
                              rightIcon={<MdKeyboardArrowDown />}
                              size="sm"
                              colorScheme={config.buttons}
                            >
                              Opções
                            </MenuButton>
                            <MenuList>
                              <MenuItem
                                icon={<FaEdit />}
                                onClick={() => setModalInfo(true)}
                              >
                                Editar Informações
                              </MenuItem>
                              <MenuItem
                                icon={<FaBoxOpen />}
                                onClick={() => setModalSize(true)}
                              >
                                Ajustar Estoque / Tamanhos
                              </MenuItem>
                              <MenuItem
                                icon={<FaImage />}
                                onClick={() => handleImageProduct(prod.id)}
                              >
                                Alterar Imagem
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </>
          )}
        </Box>

        <Modal
          isOpen={modalInfo}
          onClose={() => setModalInfo(false)}
          isCentered
          scrollBehavior="inside"
        >
          <ModalOverlay />
          <ModalContent maxW="90vw">
            <ModalHeader>Editar Informações</ModalHeader>
            <ModalCloseButton />
            <ModalBody>{modalInfo === true && <Products />}</ModalBody>

            <ModalFooter>
              <Button colorScheme={config.buttons} leftIcon={<FaSave />}>
                Salvar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={modalPromo}
          onClose={() => setModalPromo(false)}
          isCentered
          scrollBehavior="inside"
          size="sm"
          closeOnEsc={false}
          closeOnOverlayClick={false}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Valor Promocional</ModalHeader>
            <ModalBody>
              <FormControl>
                <NumberInput
                  id="lenght"
                  precision={2}
                  step={0.01}
                  focusBorderColor={config.inputs}
                  value={promoValue}
                  onChange={(e) => setPromoValue(e)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme={config.buttons}
                leftIcon={<FaSave />}
                onClick={() => setPromo()}
              >
                Salvar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={loading}
          isCentered
          scrollBehavior="inside"
          size="xl"
          closeOnEsc={false}
          closeOnOverlayClick={false}
        >
          <ModalOverlay />
          <ModalContent bg="transparent" shadow="none" overflow="hidden">
            <ModalBody overflow="hidden">
              <Flex justify="center" align="center" direction="column">
                <Lottie animation={sendAnimation} height={400} width={400} />
                <Text mt={"-60px"} fontSize="3xl">
                  Aguarde...
                </Text>
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={modalSize}
          onClose={() => setModalSize(false)}
          isCentered
          scrollBehavior="inside"
        >
          <ModalOverlay />
          <ModalContent maxW="90vw" pb={4}>
            <ModalHeader>Alterar Cores</ModalHeader>
            <ModalCloseButton />
            <ModalBody>{modalSize === true && <Sizes />}</ModalBody>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={modalGerImg}
          onClose={() => setModalGerImg(false)}
          isCentered
          scrollBehavior="inside"
        >
          <ModalOverlay />
          <ModalContent maxW="90vw" pb={4}>
            <ModalHeader>Alterar Cores</ModalHeader>
            <ModalCloseButton />
            <ModalBody>{modalGerImg === true && <Imagens />}</ModalBody>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={modalImage}
          onClose={() => setModalImage(false)}
          isCentered
          size="xl"
        >
          <ModalOverlay />
          <ModalContent maxW="650px">
            <ModalHeader>Alterar Imagem</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Grid templateColumns="1fr 1fr" gap="20px" justifyItems="center">
                <Box w="280px" h="320px">
                  <Text>Imagem atual:</Text>
                  <Image src={url} w="280px" h="310px" rounded="md" />
                </Box>
                <Box>
                  <Text>Nova imagem:</Text>
                  <Box w="280px" h="310px">
                    {thumbnail ? (
                      <Box rounded="md" borderWidth="1px" overflow="hidden">
                        <Image src={previewThumbnail} w="280px" h="310px" />
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
                      <InputFile alt={310} lar={280} cor={colorMode}>
                        <File
                          type="file"
                          onChange={(event) =>
                            setThumbnail(event.target.files[0])
                          }
                        />
                        <FaImage style={{ fontSize: 50, marginBottom: 20 }} />
                        <Text>
                          Insira uma imagem 280x310 pixels, de até 500kb
                        </Text>
                      </InputFile>
                    )}
                  </Box>
                </Box>
              </Grid>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme={config.buttons}
                leftIcon={<FaSave />}
                isLoading={loadingImage}
                onClick={() => handelUpdateImage()}
              >
                Salvar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Hotkeys>
    </>
  );
}
