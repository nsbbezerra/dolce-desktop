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
  FormControl,
  FormLabel,
  Textarea,
  useColorMode,
  Image,
  useToast,
  Flex,
  Kbd,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import config from "../../configs/index";
import HeaderApp from "../../components/headerApp";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaSave, FaEdit, FaImage, FaTags } from "react-icons/fa";
import { InputFile, File } from "../../style/uploader";
import { AiOutlineClose } from "react-icons/ai";
import api from "../../configs/axios";
import useFetch from "../../hooks/useFetch";
import { useEmployee } from "../../context/Employee";
import Lottie from "../../components/lottie";
import emptyAnimation from "../../animations/empty.json";
import searchAnimation from "../../animations/search.json";
import { mutate as mutateGlobal } from "swr";
import Hotkeys from "react-hot-keys";

export default function CategoryList() {
  const { colorMode } = useColorMode();
  const { employee } = useEmployee();
  const { data, error, mutate } = useFetch("/categories");
  const toast = useToast();

  const [modalInfo, setModalInfo] = useState(false);
  const [modalImage, setModalImage] = useState(false);
  const [categories, setCategories] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [idCategory, setIdCategory] = useState(null);
  const [nameCategory, setNameCategory] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [url, setUrl] = useState("");

  const previewThumbnail = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  async function removeThumbnail() {
    await URL.revokeObjectURL(thumbnail);
    setThumbnail(null);
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

  useEffect(() => {
    console.log(data);
    setCategories(data);
  }, [data]);

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

  async function finderCatBySource(text) {
    setSearch(text);
    if (text === "") {
      await setCategories(data);
    } else {
      let termos = await text.split(" ");
      let frasesFiltradas = await categories.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.name.includes(termoBuscado);
        }, true);
      });
      await setCategories(frasesFiltradas);
    }
  }

  async function handleInfo(id) {
    const result = await categories.find((obj) => obj.id === id);
    setIdCategory(result.id);
    setNameCategory(result.name);
    setDescription(result.description);
    setModalInfo(true);
  }

  async function handleImage(id) {
    const result = await categories.find((obj) => obj.id === id);
    setIdCategory(result.id);
    setUrl(result.thumbnail);
    setModalImage(true);
  }

  async function handleUpdateInfo() {
    if (nameCategory === "") {
      return false;
    }
    if (description === "") {
      return false;
    }
    setLoadingInfo(true);

    try {
      const response = await api.put(
        `/categories/${idCategory}`,
        {
          name: nameCategory,
          description,
        },
        { headers: { "x-access-token": employee.token } }
      );
      const updatedCategories = await data.map((cat) => {
        if (cat.id === idCategory) {
          return {
            ...cat,
            name: response.data.category[0].name,
            description: response.data.category[0].description,
          };
        }
        return cat;
      });
      mutate(updatedCategories, false);
      mutateGlobal(`/categories/${idCategory}`, {
        id: idCategory,
        name: response.data.category[0].name,
        description: response.data.category[0].description,
      });
      showToast(response.data.message, "success", "Sucesso");
      setLoadingInfo(false);
      setModalInfo(false);
    } catch (error) {
      setLoadingInfo(false);
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
        `/activeCategory/${id}`,
        { active: value },
        { headers: { "x-access-token": employee.token } }
      );
      const updatedCategories = await data.map((cat) => {
        if (cat.id === id) {
          return {
            ...cat,
            active: response.data.category[0].active,
          };
        }
        return cat;
      });
      mutate(updatedCategories, false);
      mutateGlobal(`/activeCategory/${id}`, {
        id: id,
        active: response.data.category[0].active,
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

  async function handleUpdateImage() {
    if (!thumbnail) {
      return false;
    }
    setLoadingImage(true);
    try {
      let dataImage = new FormData();
      dataImage.append("thumbnail", thumbnail);
      const response = await api.put(
        `/categoryChangeImage/${idCategory}`,
        dataImage,
        { headers: { "x-access-token": employee.token } }
      );
      setThumbnail(null);
      removeThumbnail();
      const updatedCategories = await data.map((cat) => {
        if (cat.id === idCategory) {
          return {
            ...cat,
            thumbnail: response.data.url,
            blobName: response.data.blobName,
          };
        }
        return cat;
      });
      mutate(updatedCategories, false);
      mutateGlobal(`/categoryChangeImage/${idCategory}`, {
        id: idCategory,
        thumbnail: response.data.url,
        blobName: response.data.blobName,
      });
      showToast(response.data.message, "success", "Sucesso");
      setModalImage(false);
      setLoadingImage(false);
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

  function onKeyDown(keyName, e, handle) {
    if (keyName === "f3") {
      const inpt = document.getElementById("search");
      inpt.focus();
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
        <HeaderApp title="Gerenciar Categorias" icon={FaTags} />

        <Box borderWidth="1px" shadow="md" rounded="md" p={3} mt="25px">
          <FormControl>
            <FormLabel>
              Digite para buscar<Kbd ml={3}>F3</Kbd>
            </FormLabel>
            <Input
              id="search"
              type="text"
              placeholder="Digite para buscar"
              focusBorderColor={config.inputs}
              value={search}
              onChange={(e) =>
                finderCatBySource(capitalizeFirstLetter(e.target.value))
              }
            />
          </FormControl>

          {categories ? (
            <>
              {categories.length === 0 ? (
                <Flex justify="center" align="center" direction="column">
                  <Lottie animation={emptyAnimation} height={200} width={200} />
                  <Text>Nenhuma categoria para mostrar</Text>
                </Flex>
              ) : (
                <Table size="sm" mt="25px">
                  <Thead fontWeight="700">
                    <Tr>
                      <Td w="5%" textAlign="center">
                        Ativo?
                      </Td>
                      <Td w="25%">Nome</Td>
                      <Td w="25%">Departamento</Td>
                      <Td w="45%">Descrição</Td>
                      <Td w="10%"></Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {categories.map((cat) => (
                      <Tr key={cat.id}>
                        <Td w="5%" textAlign="center">
                          <Switch
                            colorScheme={config.switchs}
                            defaultIsChecked={cat.active}
                            onChange={(e) =>
                              handleActive(e.target.checked, cat.id)
                            }
                          />
                        </Td>
                        <Td w="25%">{cat.name}</Td>
                        <Td w="25%">{cat.dep_name}</Td>
                        <Td w="45%">
                          <Text w="45vw" isTruncated noOfLines={1}>
                            {cat.description}
                          </Text>
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
                                onClick={() => handleInfo(cat.id)}
                              >
                                Editar Informações
                              </MenuItem>
                              <MenuItem
                                icon={<FaImage />}
                                onClick={() => handleImage(cat.id)}
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
          ) : (
            <Flex justify="center" align="center" direction="column">
              <Lottie animation={searchAnimation} height={200} width={200} />
              <Text>Buscando Informações</Text>
            </Flex>
          )}
        </Box>

        <Modal
          isOpen={modalInfo}
          onClose={() => setModalInfo(false)}
          isCentered
          size="lg"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Editar Informações</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl mb={3}>
                <FormLabel>Nome</FormLabel>
                <Input
                  focusBorderColor={config.inputs}
                  value={nameCategory}
                  onChange={(e) =>
                    setNameCategory(capitalizeFirstLetter(e.target.value))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Descrição</FormLabel>
                <Textarea
                  focusBorderColor={config.inputs}
                  value={description}
                  onChange={(e) =>
                    setDescription(capitalizeOneLetter(e.target.value))
                  }
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme={config.buttons}
                leftIcon={<FaSave />}
                isLoading={loadingInfo}
                onClick={() => handleUpdateInfo()}
              >
                Salvar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={modalImage}
          onClose={() => setModalImage(false)}
          isCentered
          size="lg"
        >
          <ModalOverlay />
          <ModalContent maxW="650px">
            <ModalHeader>Alterar Imagem</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Grid templateColumns="1fr 1fr" gap="20px" justifyItems="center">
                <Box w="250px" h="270px">
                  <Text>Imagem atual:</Text>
                  <Image src={url} w="250px" h="250px" rounded="md" />
                </Box>
                <Box>
                  <Text>Nova imagem:</Text>
                  <Box w="250px" h="250px">
                    {thumbnail ? (
                      <Box rounded="md" borderWidth="1px" overflow="hidden">
                        <Image src={previewThumbnail} w="250px" h="250px" />
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
                      <InputFile alt={250} lar={250} cor={colorMode}>
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
                </Box>
              </Grid>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme={config.buttons}
                leftIcon={<FaSave />}
                isLoading={loadingImage}
                onClick={() => handleUpdateImage()}
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
