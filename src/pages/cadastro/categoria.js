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
} from "@chakra-ui/react";
import { FaSave, FaImage, FaTags, FaSearch, FaCheck } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import config from "../../configs";
import HeaderApp from "../../components/headerApp";
import { InputFile, File } from "../../style/uploader";
import useFetch from "../../hooks/useFetch";
import Hotkeys from "react-hot-keys";
import api from "../../configs/axios";
import { useEmployee } from "../../context/Employee";
import Lottie from "../../components/lottie";
import emptyAnimation from "../../animations/empty.json";

export default function Categoria() {
  const { data, error } = useFetch("/departments");
  const toast = useToast();
  const { colorMode } = useColorMode();
  const initialRef = useRef();
  const { employee } = useEmployee();

  const [modalDepartment, setModalDepartment] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [validators, setValidators] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [idDepartment, setIdDepartment] = useState(null);
  const [nameDepartment, setNameDepartment] = useState("");
  const [handleSearch, setHandleSearch] = useState("");
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    setDepartments(data);
  }, [data]);

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

  async function finderClientsBySource(text) {
    setHandleSearch(text);
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
    if (keyName === "f12") {
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
      const response = await api.post(
        "/categories",
        { department: idDepartment, name, description },
        {
          headers: { "x-access-token": employee.token },
        }
      );

      setLoading(false);
      showToast(response.data.message, "success", "Sucesso");
      setIdDepartment(null);
      setNameDepartment("");
      setName("");
      setDescription("");
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
        keyName="f3, f12"
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
              colorScheme={config.buttons}
              variant="outline"
            >
              Buscar Departamento{" "}
              <Kbd ml={3} color="ButtonText">
                F3
              </Kbd>
            </Button>
          </Grid>
          <Divider mt={5} mb={5} />
          <Grid templateColumns="1fr" gap="15px">
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

              <Button
                leftIcon={<FaSave />}
                colorScheme={config.buttons}
                size="lg"
                isLoading={loading}
                onClick={() => register()}
              >
                Cadastrar
                <Kbd ml={3} color="ButtonText">
                  F12
                </Kbd>
              </Button>
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
                  finderClientsBySource(
                    capitalizeAllFirstLetter(e.target.value)
                  )
                }
              />

              {departments && (
                <>
                  {departments.length === 0 ? (
                    <Flex justify="center" align="center" direction="column">
                      <Lottie
                        animation={emptyAnimation}
                        height={200}
                        width={200}
                      />
                      <Text>Nenhum departamento para mostrar</Text>
                    </Flex>
                  ) : (
                    <Box mt={3}>
                      <Table size="sm">
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
                                        colorScheme={config.buttons}
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
                </>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Hotkeys>
    </>
  );
}
