import React, { useState, useEffect } from "react";
import {
  Grid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  Divider,
  Button,
  useToast,
  FormErrorMessage,
  Kbd,
} from "@chakra-ui/react";
import config from "../../../configs/index";
import { FaSave } from "react-icons/fa";
import MaskedInput from "react-text-mask";
import api from "../../../configs/axios";
import { useEmployee } from "../../../context/Employee";
import Hotkeys from "react-hot-keys";

export default function PlanAccountSave() {
  const toast = useToast();
  const { employee } = useEmployee();

  const [type, setType] = useState("");
  const [identification, setIdentification] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [validators, setValidators] = useState([]);

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom-right",
      duration: 8000,
    });
  }

  function handleValidator(path, message) {
    let val = [];
    let info = { path: path, message: message };
    val.push(info);
    setValidators(val);
    const inpt = document.getElementById(path);
    inpt.focus();
  }

  useEffect(() => {
    maskSelect(identification);
  }, [identification]);

  function maskSelect(item) {
    var filt = item.substr(0, 1);
    if (filt === "1") {
      setType("credit");
    }
    if (filt === "2") {
      setType("debit");
    }
    if (
      filt === "3" ||
      filt === "4" ||
      filt === "5" ||
      filt === "6" ||
      filt === "7" ||
      filt === "8" ||
      filt === "9" ||
      filt === "0"
    ) {
      setIdentification("");
      setType("");
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

  async function register(e) {
    if (e) {
      e.preventDefault();
    }
    if (identification === "") {
      handleValidator("identification", "Insira um identificador");
      return false;
    }
    if (identification.includes("_")) {
      handleValidator("identification", "Insira um identificador válido");
      return false;
    }
    if (name === "") {
      handleValidator("name", "Insira um nome");
      return false;
    }
    setValidators([]);
    setLoading(true);
    try {
      const response = await api.post(
        "/planAccount",
        {
          plan: identification,
          name,
          mode: type,
        },
        { headers: { "x-access-token": employee.token } }
      );
      setIdentification("");
      setName("");
      setType("");
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

  function onKeyDown(keyName, e, handle) {
    if (keyName === "f12") {
      register(e);
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
        <Grid templateColumns={"150px 1fr 200px"} gap={"15px"}>
          <FormControl
            isRequired
            isInvalid={
              validators.find((obj) => obj.path === "identification")
                ? true
                : false
            }
          >
            <FormLabel>Plano de Contas</FormLabel>
            <MaskedInput
              mask={[/[0-9]/, ".", /\d/, ".", /\d/, /\d/]}
              value={identification}
              onChange={(e) => setIdentification(e.target.value)}
              placeholder="Identificação"
              id="identification"
              render={(ref, props) => (
                <Input ref={ref} {...props} focusBorderColor={config.inputs} />
              )}
            />
            <FormErrorMessage>
              {validators.find((obj) => obj.path === "identification")
                ? validators.find((obj) => obj.path === "identification")
                    .message
                : ""}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={
              validators.find((obj) => obj.path === "name") ? true : false
            }
          >
            <FormLabel>Nome</FormLabel>
            <Input
              id="name"
              type="text"
              placeholder="Plano de Contas"
              focusBorderColor={config.inputs}
              value={name}
              onChange={(e) => setName(capitalizeFirstLetter(e.target.value))}
            />
            <FormErrorMessage>
              {validators.find((obj) => obj.path === "name")
                ? validators.find((obj) => obj.path === "name").message
                : ""}
            </FormErrorMessage>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Tipo de Movimentação</FormLabel>
            <Select
              placeholder="Selecione"
              variant="outline"
              focusBorderColor={config.inputs}
              value={type}
              isReadOnly
            >
              <option value="credit">Receita</option>
              <option value="debit">Despesa</option>
            </Select>
          </FormControl>
        </Grid>
        <Text fontSize="sm" color="red.400" mt={3} mb={5}>
          As identificações dos Plano de Contas devem seguir uma regra: Inicie
          com o número (1) todas as RECEITAS; Inicie com o número (2) todas as
          DESPESAS
        </Text>
        <Divider mb={5} />
        <Button
          leftIcon={<FaSave />}
          size="lg"
          colorScheme={config.buttons}
          isLoading={loading}
          onClick={() => register()}
        >
          Salvar
          <Kbd ml={3} color="ButtonText">
            F12
          </Kbd>
        </Button>
      </Hotkeys>
    </>
  );
}
