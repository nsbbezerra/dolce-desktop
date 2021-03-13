import React, { useState, useEffect } from "react";
import {
  Grid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Switch,
  Divider,
  Button,
  useToast,
  FormErrorMessage,
  Kbd,
  Spinner,
  Flex,
} from "@chakra-ui/react";
import config from "../../../configs/index";
import { FaSave } from "react-icons/fa";
import { useEmployee } from "../../../context/Employee";
import api from "../../../configs/axios";
import Hotkeys from "react-hot-keys";
import useFetch from "../../../hooks/useFetch";

export default function PayFormSave() {
  const toast = useToast();
  const { employee } = useEmployee();
  const { data, error } = useFetch("/accountbank");

  const [validators, setValidators] = useState([]);

  const [name, setName] = useState("");
  const [bank_id, setBank_Id] = useState("");
  const [status, setStatus] = useState("");
  const [max_portion, setMax_portion] = useState(0);
  const [interval_days, setInterval_days] = useState(0);
  const [type, setType] = useState("");
  const [show_on_site, setShow_on_site] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);

  function clear() {
    setName("");
    setBank_Id("");
    setStatus("");
    setMax_portion(0);
    setInterval_days(0);
    setType("");
    setShow_on_site(false);
    setDisabled(false);
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
    status === "in_cash" ? setDisabled(true) : setDisabled(false);
  }, [status]);

  function handleValidator(path, message) {
    let val = [];
    let info = { path: path, message: message };
    val.push(info);
    setValidators(val);
    const inpt = document.getElementById(path);
    inpt.focus();
  }

  function capitalizeFirstLetter(string) {
    let splited = string.split(" ");
    let toJoin = splited.map((e) => {
      return e.charAt(0).toUpperCase() + e.slice(1);
    });
    let joined = toJoin.join(" ");
    return joined;
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

  async function register(e) {
    if (e) {
      e.preventDefault();
    }
    if (name === "") {
      handleValidator("name", "O nome é obrigatório");
      return false;
    }
    if (bank_id === "" || bank_id === null || !bank_id) {
      handleValidator("bank", "A conta bancária é obrigatória");
      return false;
    }
    if (status === "") {
      handleValidator("status", "O status é obrigatório");
      return false;
    }
    if (type === "") {
      handleValidator("type", "O tipo de pagamento é obrigatório");
      return false;
    }
    setValidators([]);
    setLoading(true);
    try {
      const response = await api.post(
        "/payForm",
        {
          name,
          bank_id: parseInt(bank_id),
          max_portion: parseInt(max_portion),
          interval_days: parseInt(interval_days),
          status,
          type,
          show_on_site,
        },
        {
          headers: { "x-access-token": employee.token },
        }
      );
      clear();
      showToast(response.data.message, "success", "Sucesso");
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
        <Grid templateColumns="1fr 250px 200px" gap="15px">
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
              placeholder="Nome"
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
          <FormControl
            isRequired
            isInvalid={
              validators.find((obj) => obj.path === "bank") ? true : false
            }
          >
            <FormLabel>Conta Bancária</FormLabel>
            {!data ? (
              <Flex justify="center" align="center">
                <Spinner color={config.inputs} />
              </Flex>
            ) : (
              <Select
                id="bank"
                placeholder="Selecione"
                variant="outline"
                focusBorderColor={config.inputs}
                value={bank_id}
                onChange={(e) => setBank_Id(e.target.value)}
              >
                {data &&
                  data.map((bnk) => (
                    <option key={bnk.id} value={bnk.id}>
                      {bnk.bank}
                    </option>
                  ))}
              </Select>
            )}
            <FormErrorMessage>
              {validators.find((obj) => obj.path === "bank")
                ? validators.find((obj) => obj.path === "bank").message
                : ""}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={
              validators.find((obj) => obj.path === "status") ? true : false
            }
          >
            <FormLabel>Status do Pagamento</FormLabel>
            <Select
              id="status"
              placeholder="Selecione"
              variant="outline"
              focusBorderColor={config.inputs}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="in_cash">À Vista</option>
              <option value="parceled_out">Parcelado</option>
            </Select>
            <FormErrorMessage>
              {validators.find((obj) => obj.path === "status")
                ? validators.find((obj) => obj.path === "status").message
                : ""}
            </FormErrorMessage>
          </FormControl>
        </Grid>
        <Grid mt={3} templateColumns="1fr 1fr 1fr 120px" gap="15px">
          <FormControl>
            <FormLabel>Nº max. de Parcelas</FormLabel>
            <Input
              type="number"
              placeholder="Nº max. de Parcelas"
              focusBorderColor={config.inputs}
              value={max_portion}
              onChange={(e) => setMax_portion(e.target.value)}
              isDisabled={disabled}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Intervalo de Dias</FormLabel>
            <Input
              type="number"
              placeholder="Intervalo de Dias"
              focusBorderColor={config.inputs}
              value={interval_days}
              onChange={(e) => setInterval_days(e.target.value)}
              isDisabled={disabled}
            />
          </FormControl>
          <FormControl
            isRequired
            isInvalid={
              validators.find((obj) => obj.path === "type") ? true : false
            }
          >
            <FormLabel>Tipo de Pagamento</FormLabel>
            <Select
              id="type"
              placeholder="Selecione"
              variant="outline"
              focusBorderColor={config.inputs}
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="money">Dinheiro</option>
              <option value="ticket">Boleto</option>
              <option value="credit">Cartão de Crédito</option>
              <option value="debit">Cartão de Débito</option>
              <option value="promissory">Duplicata</option>
              <option value="transfer">Transferência</option>
              <option value="check">Cheque</option>
            </Select>
            <FormErrorMessage>
              {validators.find((obj) => obj.path === "type")
                ? validators.find((obj) => obj.path === "type").message
                : ""}
            </FormErrorMessage>
          </FormControl>
          <FormControl>
            <FormLabel>Ativar no Site?</FormLabel>
            <Switch
              colorScheme={config.switchs}
              size="lg"
              mt={1}
              mb={-1}
              value={show_on_site}
              onChange={(e) => setShow_on_site(e.target.checked)}
            />
          </FormControl>
        </Grid>
        <Divider mb={5} mt={5} />
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
