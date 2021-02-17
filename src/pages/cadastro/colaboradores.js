import React, { useState } from "react";
import {
  Box,
  Grid,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  HStack,
  Switch,
  InputGroup,
  InputLeftAddon,
  Divider,
  useToast,
  FormErrorMessage,
  Kbd,
  Icon,
} from "@chakra-ui/react";
import HeaderApp from "../../components/headerApp";
import { FaIdCard, FaSave } from "react-icons/fa";
import { AiOutlineEnter } from "react-icons/ai";
import config from "../../configs/index";
import InputMask from "react-input-mask";
import api from "../../configs/axios";
import Hotkeys from "react-hot-keys";

import { useEmployee } from "../../context/Employee";

export default function Colaboradores() {
  const toast = useToast();
  const { employee } = useEmployee();

  const [validators, setValidators] = useState([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [gender, setGender] = useState("");
  const [sale, setSale] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [cashier, setCashier] = useState(false);
  const [comissioned, setComissioned] = useState(false);
  const [comission, setComission] = useState(0);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  function clear() {
    setName("");
    setContact("");
    setGender("");
    setSale(false);
    setAdmin(false);
    setCashier(false);
    setComission(0);
    setComissioned(false);
    setUser("");
    setPassword("");
  }

  function capitalizeFirstLetter(string) {
    let splited = string.split(" ");
    let toJoin = splited.map((e) => {
      return e.charAt(0).toUpperCase() + e.slice(1);
    });
    let joined = toJoin.join(" ");
    return joined;
  }

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom-right",
    });
  }

  function handleValidator(path, message) {
    let val = [];
    let info = { path: path, message: message };
    val.push(info);
    setValidators(val);
    if (path !== "none") {
      const inpt = document.getElementById(path);
      inpt.focus();
    }
  }

  function handleSwitch(path, e) {
    if (path === "admin") {
      setSale(false);
      setCashier(false);
      setAdmin(e);
    }
    if (path === "sale") {
      setSale(e);
      setCashier(false);
      setAdmin(false);
    }
    if (path === "cashier") {
      setSale(false);
      setCashier(e);
      setAdmin(false);
    }
  }

  async function register(e) {
    if (e) {
      e.preventDefault();
    }
    if (name === "" || !name) {
      handleValidator("name", "O Nome é obrigatório");
      return false;
    }
    if (contact === "" || !contact) {
      handleValidator("contact", "O Telefone é obrigatório");
      return false;
    }
    if (contact.includes("_")) {
      handleValidator("contact", "Digite um Telefone válido");
      return false;
    }
    if (gender === "" || !gender) {
      handleValidator("gender", "o Gênero é obrigatório");
      return false;
    }
    if (admin === false && sale === false && cashier === false) {
      handleValidator("none", "Selecione um modo de permissão");
      return false;
    }
    if (comissioned === true && comission === 0) {
      handleValidator(
        "percentage",
        "Adicione um valor de comissão maior do que 0"
      );
      return false;
    }
    if (user === "" || !user) {
      handleValidator("user", "O Nome de usuário é obrigatório");
      return false;
    }
    if (password === "" || !password) {
      handleValidator("password", "A Senha é obrigatória");
      return false;
    }
    setValidators([]);
    try {
      const response = await api.post(
        "/employee",
        {
          name,
          gender,
          contact,
          admin,
          sales: sale,
          caixa: cashier,
          comission,
          comissioned,
          user,
          password,
        },
        { headers: { "x-access-token": employee.token } }
      );
      showToast(response.data.message, "success", "Sucesso");
      setLoading(false);
      clear();
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

  function onKeyDown(keyName, e, handle) {
    if (keyName === "return" || keyName === "enter") {
      register(e);
    }
  }

  return (
    <>
      <Hotkeys
        keyName="return, enter"
        onKeyDown={onKeyDown}
        allowRepeat
        filter={(event) => {
          return true;
        }}
      >
        <HeaderApp title="Cadastro de Colaboradores" icon={FaIdCard} />

        <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
          <Grid templateColumns="1fr 200px 200px" gap="15px">
            <FormControl
              isRequired
              isInvalid={
                validators.find((obj) => obj.path === "name") ? true : false
              }
            >
              <FormLabel>Nome</FormLabel>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(capitalizeFirstLetter(e.target.value))}
                placeholder="Nome completo"
                focusBorderColor={config.inputs}
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
                validators.find((obj) => obj.path === "contact") ? true : false
              }
            >
              <FormLabel>Telefone</FormLabel>
              <InputMask
                id="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                mask="(99) 99999-9999"
                className="mask-chakra"
                placeholder="Telefone"
              />
              <FormErrorMessage>
                {validators.find((obj) => obj.path === "contact")
                  ? validators.find((obj) => obj.path === "contact").message
                  : ""}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={
                validators.find((obj) => obj.path === "gender") ? true : false
              }
            >
              <FormLabel>Genero</FormLabel>
              <Select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                placeholder="Selecione"
                variant="outline"
                focusBorderColor={config.inputs}
              >
                <option value="masc">Masculino</option>
                <option value="fem">Femenino</option>
              </Select>
              <FormErrorMessage>
                {validators.find((obj) => obj.path === "gender")
                  ? validators.find((obj) => obj.path === "gender").message
                  : ""}
              </FormErrorMessage>
            </FormControl>
          </Grid>
          <Grid templateColumns="1fr 1fr" gap="15px" mt={3}>
            <Box borderWidth="1px" rounded="md" p={3}>
              <FormControl
                as="fieldset"
                isInvalid={
                  validators.find((obj) => obj.path === "none") ? true : false
                }
              >
                <FormLabel as="legend" fontWeight="700">
                  Permissões
                </FormLabel>

                <HStack spacing="24px">
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="total" mb="0">
                      Total
                    </FormLabel>
                    <Switch
                      id="total"
                      colorScheme={config.switchs}
                      onChange={(e) => handleSwitch("admin", e.target.checked)}
                      isChecked={admin}
                    />
                  </FormControl>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="sales" mb="0">
                      Vendas
                    </FormLabel>
                    <Switch
                      id="sales"
                      colorScheme={config.switchs}
                      onChange={(e) => handleSwitch("sale", e.target.checked)}
                      isChecked={sale}
                    />
                  </FormControl>
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="cashier" mb="0">
                      Caixa
                    </FormLabel>
                    <Switch
                      id="cashier"
                      colorScheme={config.switchs}
                      onChange={(e) =>
                        handleSwitch("cashier", e.target.checked)
                      }
                      isChecked={cashier}
                    />
                  </FormControl>
                </HStack>
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "none")
                    ? validators.find((obj) => obj.path === "none").message
                    : ""}
                </FormErrorMessage>
              </FormControl>
            </Box>
            <Box borderWidth="1px" rounded="md" p={3}>
              <FormControl as="fieldset">
                <HStack spacing="24px">
                  <FormControl display="flex" alignItems="center">
                    <FormLabel htmlFor="total" mb="0">
                      Colaborador Comissionado?
                    </FormLabel>
                    <Switch
                      colorScheme={config.switchs}
                      isChecked={comissioned}
                      onChange={(e) => setComissioned(e.target.checked)}
                    />
                  </FormControl>
                  <FormControl
                    isInvalid={
                      validators.find((obj) => obj.path === "percentage")
                        ? true
                        : false
                    }
                  >
                    <FormLabel>Porcentagem</FormLabel>
                    <InputGroup>
                      <InputLeftAddon children="%" />
                      <Input
                        id="percentage"
                        type="number"
                        borderLeftRadius="0"
                        placeholder="Porcentagem"
                        focusBorderColor={config.inputs}
                        value={comission}
                        onChange={(e) => setComission(parseInt(e.target.value))}
                      />
                    </InputGroup>
                    <FormErrorMessage>
                      {validators.find((obj) => obj.path === "percentage")
                        ? validators.find((obj) => obj.path === "percentage")
                            .message
                        : ""}
                    </FormErrorMessage>
                  </FormControl>
                </HStack>
              </FormControl>
            </Box>
          </Grid>

          <Grid templateColumns="1fr 1fr" gap="15px" mt={3}>
            <FormControl
              isRequired
              isInvalid={
                validators.find((obj) => obj.path === "user") ? true : false
              }
            >
              <FormLabel>Usuário</FormLabel>
              <Input
                id="user"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                placeholder="Usuário"
                focusBorderColor={config.inputs}
              />
              <FormErrorMessage>
                {validators.find((obj) => obj.path === "user")
                  ? validators.find((obj) => obj.path === "user").message
                  : ""}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={
                validators.find((obj) => obj.path === "password") ? true : false
              }
            >
              <FormLabel>Senha</FormLabel>
              <Input
                id="password"
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                focusBorderColor={config.inputs}
              />
              <FormErrorMessage>
                {validators.find((obj) => obj.path === "password")
                  ? validators.find((obj) => obj.path === "password").message
                  : ""}
              </FormErrorMessage>
            </FormControl>
          </Grid>

          <Divider mt={5} mb={5} />
          <Button
            leftIcon={<FaSave />}
            colorScheme="blue"
            size="lg"
            onClick={() => register()}
            isLoading={loading}
          >
            Cadastrar
            <Kbd ml={3} color="ButtonText">
              <Icon as={AiOutlineEnter} />
            </Kbd>
          </Button>
        </Box>
      </Hotkeys>
    </>
  );
}
