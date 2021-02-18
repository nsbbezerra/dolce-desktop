import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Flex,
  IconButton,
  Box,
  Grid,
  Text,
  FormLabel,
  FormControl,
  Input,
  Textarea,
  Divider,
  Button,
  useColorMode,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  Tbody,
  Thead,
  Tr,
  Td,
  Tooltip,
  useToast,
  FormErrorMessage,
  Image,
  Kbd,
  Icon,
} from "@chakra-ui/react";
import { FaSave, FaImage, FaTags, FaSearch, FaCheck } from "react-icons/fa";
import { AiOutlineClose, AiOutlineEnter } from "react-icons/ai";
import config from "../../configs";
import HeaderApp from "../../components/headerApp";
import { InputFile, File } from "../../style/uploader";
import useFetch from "../../hooks/useFetch";
import Hotkeys from "react-hot-keys";
import api from "../../configs/axios";
import { useEmployee } from "../../context/Employee";

export default function Categoria() {
  const { data, error } = useFetch("/departments");
  const toast = useToast();
  const { colorMode } = useColorMode();
  const initialRef = useRef();
  const { employee } = useEmployee();

  const [modalDepartment, setModalDepartment] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [validators, setValidators] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [idDepartment, setIdDepartment] = useState(null);
  const [nameDepartment, setNameDepartment] = useState("");
  const [handleSearch, setHandleSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const previewThumbnail = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  async function removeThumbnail() {
    await URL.revokeObjectURL(thumbnail);
    setThumbnail(null);
    setValidators([]);
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

  useEffect(() => {
    setDepartments(data);
  }, [data]);

  if (error) {
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

  function handleValidator(path, message) {
    let val = [];
    let info = { path: path, message: message };
    val.push(info);
    setValidators(val);
    if (path !== "image") {
      const inpt = document.getElementById(path);
      inpt.focus();
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

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async function handleDepartment(id) {
    const result = await departments.find((obj) => obj.id === id);
    setIdDepartment(result.id);
    setNameDepartment(result.name);
    setModalDepartment(false);
  }

  useEffect(() => {
    finderClientsBySource(handleSearch);
  }, [handleSearch]);

  async function finderClientsBySource(text) {
    if (text === "") {
      await setDepartments(data);
    } else {
      let termos = await text.split(" ");
      let frasesFiltradas = await departments.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.name.includes(termoBuscado);
        }, true);
      });
      await setDepartments(frasesFiltradas);
    }
  }

  function onKeyDown(keyName, e, handle) {
    if (keyName === "f3") {
      setModalDepartment(true);
    }
    if (keyName === "return" || keyName === "enter") {
      register(e);
    }
  }

  async function register(e) {
    if (e) {
      e.preventDefault();
    }
    if (!idDepartment || idDepartment === null) {
      handleValidator("department", "Selecione um departamento");
      setModalDepartment(true);
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
    }
    if (!name || name === "") {
      handleValidator("name", "Insira um nome para a categoria");
      return false;
    }
    if (!description || description === "") {
      handleValidator("description", "Insira uma descrição para a categoria");
      return false;
    }
    setValidators([]);
    setLoading(true);
    try {
      let data = new FormData();
      data.append("department", idDepartment);
      data.append("name", name);
      data.append("description", description);
      data.append("thumbnail", thumbnail);

      const response = await api.post("/categories", data, {
        headers: { "x-access-token": employee.token },
      });

      setLoading(false);
      showToast(response.data.message, "success", "Sucesso");
      setIdDepartment(null);
      setNameDepartment("");
      setName("");
      setDescription("");
      setThumbnail(null);
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
      <Hotkeys
        keyName="f3, return, enter"
        onKeyDown={onKeyDown}
        allowRepeat
        filter={(event) => {
          return true;
        }}
      >
        <HeaderApp title="Cadastro de Categorias" icon={FaTags} />

        <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
          <Grid templateColumns="1fr 250px" gap="15px">
            <FormControl
              isRequired
              isInvalid={
                validators.find((obj) => obj.path === "department")
                  ? true
                  : false
              }
            >
              <Input
                id="department"
                placeholder="Departamento"
                focusBorderColor={config.inputs}
                isReadOnly
                value={nameDepartment}
              />
              <FormErrorMessage>
                {validators.find((obj) => obj.path === "department")
                  ? validators.find((obj) => obj.path === "department").message
                  : ""}
              </FormErrorMessage>
            </FormControl>
            <Button
              leftIcon={<FaSearch />}
              onClick={() => setModalDepartment(true)}
            >
              Buscar Departamento{" "}
              <Kbd ml={3} color="ButtonText">
                f3
              </Kbd>
            </Button>
          </Grid>
          <Divider mt={5} mb={5} />
          <Grid templateColumns="250px 1fr" gap="15px">
            <Box w="250px" h="250px">
              <FormControl
                isRequired
                isInvalid={
                  validators.find((obj) => obj.path === "image") ? true : false
                }
              >
                <FormLabel>Imagem</FormLabel>
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
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "image")
                    ? validators.find((obj) => obj.path === "image").message
                    : ""}
                </FormErrorMessage>
              </FormControl>
            </Box>

            <Box>
              <FormControl
                isRequired
                isInvalid={
                  validators.find((obj) => obj.path === "name") ? true : false
                }
              >
                <FormLabel>Nome da Categoria</FormLabel>
                <Input
                  id="name"
                  placeholder="Nome"
                  focusBorderColor={config.inputs}
                  value={name}
                  onChange={(e) =>
                    setName(capitalizeAllFirstLetter(e.target.value))
                  }
                />
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "name")
                    ? validators.find((obj) => obj.path === "name").message
                    : ""}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                mt={3}
                isInvalid={
                  validators.find((obj) => obj.path === "description")
                    ? true
                    : false
                }
              >
                <FormLabel>Descrição da Categoria</FormLabel>
                <Textarea
                  placeholder="Descrição"
                  focusBorderColor={config.inputs}
                  resize="none"
                  id="description"
                  value={description}
                  onChange={(e) =>
                    setDescription(capitalizeFirstLetter(e.target.value))
                  }
                />
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "description")
                    ? validators.find((obj) => obj.path === "description")
                        .message
                    : ""}
                </FormErrorMessage>
              </FormControl>
              <Divider mt={5} mb={5} />
              <Flex justify="flex-end">
                <Button
                  leftIcon={<FaSave />}
                  colorScheme="blue"
                  size="lg"
                  isLoading={loading}
                  onClick={() => register()}
                >
                  Cadastrar
                  <Kbd ml={3} color="ButtonText">
                    <Icon as={AiOutlineEnter} />
                  </Kbd>
                </Button>
              </Flex>
            </Box>
          </Grid>
        </Box>

        <Modal
          isOpen={modalDepartment}
          onClose={() => setModalDepartment(false)}
          size="xl"
          isCentered
          scrollBehavior="inside"
          initialFocusRef={initialRef}
        >
          <ModalOverlay />
          <ModalContent maxW="50rem">
            <ModalHeader>Buscar Departamento</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={5}>
              <Input
                placeholder="Digite um nome para buscar"
                focusBorderColor={config.inputs}
                ref={initialRef}
                value={handleSearch}
                onChange={(e) =>
                  setHandleSearch(capitalizeAllFirstLetter(e.target.value))
                }
              />

              {departments && (
                <Box p={2} borderWidth="1px" rounded="md" mt={3}>
                  <Table size="sm" variant="striped">
                    <Thead fontWeight="700">
                      <Tr>
                        <Td>Nome</Td>
                        <Td w="10%">Ações</Td>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {departments && (
                        <>
                          {departments.map((dep) => (
                            <Tr key={dep.id}>
                              <Td>{dep.name}</Td>
                              <Td w="10%" textAlign="center">
                                <Tooltip
                                  label="Selecionar departamento"
                                  hasArrow
                                >
                                  <IconButton
                                    aria-label="Search database"
                                    icon={<FaCheck />}
                                    size="xs"
                                    isRound
                                    colorScheme="blue"
                                    onClick={() => handleDepartment(dep.id)}
                                  />
                                </Tooltip>
                              </Td>
                            </Tr>
                          ))}
                        </>
                      )}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Hotkeys>
    </>
  );
}
