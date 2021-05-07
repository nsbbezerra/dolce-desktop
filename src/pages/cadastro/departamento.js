import React, { useState } from "react";
import {
  Flex,
  Box,
  Grid,
  FormLabel,
  FormControl,
  Input,
  Textarea,
  Divider,
  Button,
  useColorMode,
  useToast,
  FormErrorMessage,
  Kbd,
} from "@chakra-ui/react";
import { FaSave } from "react-icons/fa";
import { AiFillShop } from "react-icons/ai";
import config from "../../configs";
import HeaderApp from "../../components/headerApp";
import api from "../../configs/axios";
import Hotkeys from "react-hot-keys";
import { useEmployee } from "../../context/Employee";

export default function Departamento() {
  const toast = useToast();
  const { employee } = useEmployee();

  const [validators, setValidators] = useState([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

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

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom-right",
      duration: 8000,
    });
  }

  async function register(e) {
    if (e) {
      e.preventDefault();
    }
    if (!name || name === "") {
      handleValidator("name", "Insira um nome para este departamento");
      return false;
    }
    if (!description || description === "") {
      handleValidator(
        "description",
        "Insira uma descrição para este departamento"
      );
      return false;
    }
    setLoading(true);
    try {
      const response = await api.post(
        "/departments",
        { name, description },
        {
          headers: { "x-access-token": employee.token },
        }
      );
      setLoading(false);
      showToast(response.data.message, "success", "Sucesso");
      setName("");
      setDescription("");
      setValidators([]);
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
    if (keyName === "f12") {
      register(e);
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
        <HeaderApp title="Cadastro de Departamentos" icon={AiFillShop} />

        <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
          <Grid templateColumns="1fr" gap="15px">
            <Box>
              <FormControl
                isRequired
                isInvalid={
                  validators.find((obj) => obj.path === "name") ? true : false
                }
              >
                <FormLabel>Nome do Departamento</FormLabel>
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
                id="desc"
                isRequired
                mt={3}
                isInvalid={
                  validators.find((obj) => obj.path === "description")
                    ? true
                    : false
                }
              >
                <FormLabel>Descrição do Departamento</FormLabel>
                <Textarea
                  id="description"
                  placeholder="Descrição"
                  focusBorderColor={config.inputs}
                  resize="none"
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
                Cadastrar{" "}
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
