import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  FormLabel,
  FormControl,
  Input,
  Textarea,
  Divider,
  Button,
  useToast,
  FormErrorMessage,
  Kbd,
  Select,
} from "@chakra-ui/react";
import { FaSave, FaTags } from "react-icons/fa";
import config from "../../configs";
import HeaderApp from "../../components/headerApp";
import useFetch from "../../hooks/useFetch";
import Hotkeys from "react-hot-keys";
import api from "../../configs/axios";
import { useEmployee } from "../../context/Employee";

export default function Categoria() {
  const { data, error } = useFetch("/departments");
  const toast = useToast();
  const { employee } = useEmployee();

  const [departments, setDepartments] = useState([]);
  const [validators, setValidators] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [idDepartment, setIdDepartment] = useState(null);
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
    if (data) {
      setDepartments(data);
    }
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

  function onKeyDown(keyName, e, handle) {
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
        keyName="f12"
        onKeyDown={onKeyDown}
        allowRepeat
        filter={(event) => {
          return true;
        }}
      >
        <HeaderApp title="Cadastro de Categorias" icon={FaTags} />

        <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
          <Grid templateColumns="1fr 1fr" gap="15px">
            <FormControl
              isRequired
              isInvalid={
                validators.find((obj) => obj.path === "department")
                  ? true
                  : false
              }
            >
              <FormLabel>Selecione um Departamento</FormLabel>
              <Select
                id="department"
                focusBorderColor={config.inputs}
                placeholder="Selecione um Departamento"
                value={idDepartment}
                onChange={(e) => setIdDepartment(e.target.value)}
              >
                {departments.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {dep.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>
                {validators.find((obj) => obj.path === "department")
                  ? validators.find((obj) => obj.path === "department").message
                  : ""}
              </FormErrorMessage>
            </FormControl>
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
          </Grid>
          <Grid templateColumns="1fr" gap="15px" mt={5}>
            <Box>
              <FormControl
                isRequired
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
      </Hotkeys>
    </>
  );
}
