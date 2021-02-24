import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  Input,
  Select,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  FormErrorMessage,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Text,
  useToast,
  Kbd,
  Icon,
} from "@chakra-ui/react";
import { FaUserFriends, FaSave } from "react-icons/fa";
import config from "../../configs";
import HeaderApp from "../../components/headerApp";
import { AiOutlineEnter } from "react-icons/ai";
import Hotkeys from "react-hot-keys";
import axios from "axios";
import MaskedInput from "react-text-mask";

import { useEmployee } from "../../context/Employee";
import api from "../../configs/axios";

export default function SaveClient() {
  const { employee } = useEmployee();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [modalAddress, setModalAddress] = useState(false);
  const [validators, setValidators] = useState([]);
  const [modalCaution, setModalCaution] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalErroMessage, setModalErroMessage] = useState("");

  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [idClient, setIdClient] = useState(null);

  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [comp, setComp] = useState("");
  const [bairro, setBairro] = useState("");
  const [cep, setCep] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  function clear() {
    setName("");
    setCpf("");
    setGender("");
    setEmail("");
    setContact("");
    setUser("");
    setStreet("");
    setNumber("");
    setComp("");
    setBairro("");
    setCep("");
    setCity("");
    setState();
    setIdClient(null);
    setPassword("");
  }

  function handleValidator(path, message) {
    let val = [];
    let info = { path: path, message: message };
    val.push(info);
    setValidators(val);
    const inpt = document.getElementById(path);
    inpt.focus();
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
    if (name === "" || !name) {
      handleValidator("name", "O Nome é obrigatório");
      return false;
    }
    if (cpf === "" || !cpf) {
      handleValidator("cpf", "O CPF é obrigatório");
      return false;
    }
    if (cpf.includes("_")) {
      handleValidator("cpf", "Digite um CFP válido");
      return false;
    }
    if (gender === "" || !gender) {
      handleValidator("gender", "o Gênero é obrigatório");
      return false;
    }
    if (email === "" || !email) {
      handleValidator("email", "O Email é obrigatório");
      return false;
    }
    if (
      (email.length && !email.includes("@")) ||
      (email.length && !email.includes("."))
    ) {
      handleValidator(
        "email",
        "Digite um email válido, deve conter um (@) e um (.)"
      );
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
    if (password === "" || !password) {
      handleValidator("password", "A Senha é obrigatória");
      return false;
    }
    if (user === "" || !user) {
      handleValidator("user", "O Nome de usuário é obrigatório");
      return false;
    }
    setLoading(true);
    try {
      const response = await api.post(
        "/clients",
        {
          name,
          gender,
          cpf,
          email,
          contact,
          user,
          password,
        },
        { headers: { "x-access-token": employee.token } }
      );
      setIdClient(response.data.client);
      setLoading(false);
      showToast(response.data.message, "success", "Sucesso");
      setModalAddress(true);
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

  async function registerAddress() {
    if (idClient === null || !idClient) {
      setModalErroMessage("Cod: 400");
      setModalMessage("Nenhum cliente selecionado");
      setModalTitle("Erro no cadastro");
      setModalCaution(true);
      return false;
    }
    if (street === "" || !street) {
      handleValidator("street", "O nome da Rua/Avenida é obrigatório");
      return false;
    }
    if (number === "" || !number) {
      handleValidator("number", "Obrigatório");
      return false;
    }
    if (bairro === "" || !bairro) {
      handleValidator("bairro", "O Bairro é obrigatório");
      return false;
    }
    if (cep === "" || !cep) {
      handleValidator("cep", "O CEP é obrigatório");
      return false;
    }
    if (cep.includes("_")) {
      handleValidator("cep", "Digite um CEP válido");
      return false;
    }
    if (city === "" || !city) {
      handleValidator("city", "O nome da Cidade é obrigatório");
      return false;
    }
    if (state === "" || !state) {
      handleValidator("state", "Obrigatório");
      return false;
    }
    setLoadingAddress(true);
    try {
      const response = await api.post(
        "/address",
        {
          client_id: idClient,
          street,
          number,
          comp,
          bairro,
          cep,
          city,
          state,
        },
        { headers: { "x-access-token": employee.token } }
      );
      showToast(response.data.message, "success", "Sucesso");
      setModalAddress(false);
      setLoadingAddress(false);
      clear();
    } catch (error) {
      setLoadingAddress(false);
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

  function capitalizeFirstLetter(string) {
    let splited = string.split(" ");
    let toJoin = splited.map((e) => {
      return e.charAt(0).toUpperCase() + e.slice(1);
    });
    let joined = toJoin.join(" ");
    return joined;
  }

  function onKeyDown(keyName, e, handle) {
    if (keyName === "return") {
      register(e);
    }
  }

  useEffect(() => {
    handleCep(cep);
  }, [cep]);

  async function handleCep(value) {
    const parse = value.replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, "");
    if (parse.length === 8) {
      try {
        const response = await axios.get(
          `https://brasilapi.com.br/api/cep/v1/${parse}`
        );
        setValidators([]);
        setCity(response.data.city);
        setState(response.data.state);
      } catch (error) {
        if (error.message === "Network Error") {
          alert(
            "Sem conexão com o servidor, verifique sua conexão com a internet."
          );
          return false;
        }
        const err = error.response.data.errors[0].message || "CEP Inválido";
        handleValidator("cep", err);
      }
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
        <HeaderApp title="Cadastro de Clientes" icon={FaUserFriends} />

        <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
          <Grid templateColumns="1fr 1fr 250px" gap="15px">
            <FormControl
              isRequired
              isInvalid={
                validators.find((obj) => obj.path === "name") ? true : false
              }
            >
              <FormLabel>Nome</FormLabel>
              <Input
                placeholder="Nome completo"
                focusBorderColor={config.inputs}
                value={name}
                onChange={(e) => setName(capitalizeFirstLetter(e.target.value))}
                id="name"
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
                validators.find((obj) => obj.path === "cpf") ? true : false
              }
            >
              <FormLabel>CPF</FormLabel>
              <MaskedInput
                mask={[
                  /[0-9]/,
                  /\d/,
                  /\d/,
                  ".",
                  /\d/,
                  /\d/,
                  /\d/,
                  ".",
                  /\d/,
                  /\d/,
                  /\d/,
                  "-",
                  /\d/,
                  /\d/,
                ]}
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="CPF"
                id="cpf"
                render={(ref, props) => (
                  <Input
                    ref={ref}
                    {...props}
                    focusBorderColor={config.inputs}
                  />
                )}
              />
              <FormErrorMessage>
                {validators.find((obj) => obj.path === "cpf")
                  ? validators.find((obj) => obj.path === "cpf").message
                  : ""}
              </FormErrorMessage>
            </FormControl>
            <FormControl
              id="gender"
              isRequired
              isInvalid={
                validators.find((obj) => obj.path === "gender") ? true : false
              }
            >
              <FormLabel>Genero</FormLabel>
              <Select
                id="gender"
                placeholder="Selecione"
                variant="outline"
                focusBorderColor={config.inputs}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
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
            <FormControl
              isInvalid={
                validators.find((obj) => obj.path === "email") ? true : false
              }
              isRequired
            >
              <FormLabel>Email</FormLabel>
              <Input
                id="email"
                placeholder="Email"
                focusBorderColor={config.inputs}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormErrorMessage>
                {validators.find((obj) => obj.path === "email")
                  ? validators.find((obj) => obj.path === "email").message
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
              <MaskedInput
                mask={[
                  "(",
                  /[0-9]/,
                  /\d/,
                  ")",
                  " ",
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                  "-",
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                ]}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Telefone"
                id="contact"
                render={(ref, props) => (
                  <Input
                    ref={ref}
                    {...props}
                    focusBorderColor={config.inputs}
                  />
                )}
              />
              <FormErrorMessage>
                {validators.find((obj) => obj.path === "contact")
                  ? validators.find((obj) => obj.path === "contact").message
                  : ""}
              </FormErrorMessage>
            </FormControl>
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
                placeholder="Usuário"
                focusBorderColor={config.inputs}
                value={user}
                onChange={(e) => setUser(e.target.value.toLowerCase())}
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
                placeholder="Usuário"
                type="password"
                focusBorderColor={config.inputs}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            colorScheme={config.buttons}
            size="lg"
            isLoading={loading}
            onClick={() => register()}
          >
            Cadastrar{" "}
            <Kbd ml={3} color="ButtonText">
              <Icon as={AiOutlineEnter} />
            </Kbd>
          </Button>
        </Box>

        <Modal
          isOpen={modalAddress}
          closeOnEsc={false}
          closeOnOverlayClick={false}
          isCentered
          size="xl"
        >
          <ModalOverlay />
          <ModalContent maxW="70rem">
            <ModalHeader>Cadastrar Endereço</ModalHeader>
            <ModalBody>
              <Grid templateColumns="1fr 100px" gap="15px">
                <FormControl
                  isRequired
                  isInvalid={
                    validators.find((obj) => obj.path === "street")
                      ? true
                      : false
                  }
                >
                  <FormLabel>Logradouro</FormLabel>
                  <Input
                    placeholder="Logradouro"
                    focusBorderColor={config.inputs}
                    value={street}
                    onChange={(e) =>
                      setStreet(capitalizeFirstLetter(e.target.value))
                    }
                    id="street"
                  />
                  <FormErrorMessage>
                    {validators.find((obj) => obj.path === "street")
                      ? validators.find((obj) => obj.path === "street").message
                      : ""}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={
                    validators.find((obj) => obj.path === "number")
                      ? true
                      : false
                  }
                >
                  <FormLabel>Numero</FormLabel>
                  <Input
                    placeholder="Numero"
                    focusBorderColor={config.inputs}
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value.toUpperCase())}
                    id="number"
                  />
                  <FormErrorMessage>
                    {validators.find((obj) => obj.path === "number")
                      ? validators.find((obj) => obj.path === "number").message
                      : ""}
                  </FormErrorMessage>
                </FormControl>
              </Grid>
              <Grid templateColumns="1fr 1fr" gap="15px" mt={3}>
                <FormControl id="comp">
                  <FormLabel>Complemento</FormLabel>
                  <Input
                    placeholder="Complemento"
                    focusBorderColor={config.inputs}
                    value={comp}
                    onChange={(e) =>
                      setComp(capitalizeFirstLetter(e.target.value))
                    }
                  />
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={
                    validators.find((obj) => obj.path === "bairro")
                      ? true
                      : false
                  }
                >
                  <FormLabel>Bairro</FormLabel>
                  <Input
                    id="bairro"
                    placeholder="Bairro"
                    focusBorderColor={config.inputs}
                    value={bairro}
                    onChange={(e) =>
                      setBairro(capitalizeFirstLetter(e.target.value))
                    }
                  />
                  <FormErrorMessage>
                    {validators.find((obj) => obj.path === "bairro")
                      ? validators.find((obj) => obj.path === "bairro").message
                      : ""}
                  </FormErrorMessage>
                </FormControl>
              </Grid>
              <Grid templateColumns="1fr 1fr 100px" gap="15px" mt={3}>
                <FormControl
                  isRequired
                  isInvalid={
                    validators.find((obj) => obj.path === "cep") ? true : false
                  }
                >
                  <FormLabel>CEP</FormLabel>
                  <MaskedInput
                    mask={[
                      /[0-9]/,
                      /\d/,
                      ".",
                      /\d/,
                      /\d/,
                      /\d/,
                      "-",
                      /\d/,
                      /\d/,
                      /\d/,
                    ]}
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    placeholder="CEP"
                    id="cep"
                    render={(ref, props) => (
                      <Input
                        ref={ref}
                        {...props}
                        focusBorderColor={config.inputs}
                      />
                    )}
                  />
                  <FormErrorMessage>
                    {validators.find((obj) => obj.path === "cep")
                      ? validators.find((obj) => obj.path === "cep").message
                      : ""}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={
                    validators.find((obj) => obj.path === "city") ? true : false
                  }
                >
                  <FormLabel>Cidade</FormLabel>
                  <Input
                    placeholder="Cidade"
                    focusBorderColor={config.inputs}
                    type="text"
                    value={city}
                    onChange={(e) =>
                      setCity(capitalizeFirstLetter(e.target.value))
                    }
                    id="city"
                  />
                  <FormErrorMessage>
                    {validators.find((obj) => obj.path === "city")
                      ? validators.find((obj) => obj.path === "city").message
                      : ""}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={
                    validators.find((obj) => obj.path === "state")
                      ? true
                      : false
                  }
                >
                  <FormLabel>UF</FormLabel>
                  <Select
                    placeholder="Selecione"
                    variant="outline"
                    focusBorderColor={config.inputs}
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    id="state"
                  >
                    <option value="AC">AC</option>
                    <option value="AL">AL</option>
                    <option value="AP">AP</option>
                    <option value="AM">AM</option>
                    <option value="BA">BA</option>
                    <option value="CE">CE</option>
                    <option value="DF">DF</option>
                    <option value="ES">ES</option>
                    <option value="GO">GO</option>
                    <option value="MA">MA</option>
                    <option value="MT">MT</option>
                    <option value="MS">MS</option>
                    <option value="MG">MG</option>
                    <option value="PA">PA</option>
                    <option value="PB">PB</option>
                    <option value="PR">PR</option>
                    <option value="PE">PE</option>
                    <option value="PI">PI</option>
                    <option value="RJ">RJ</option>
                    <option value="RN">RN</option>
                    <option value="RS">RS</option>
                    <option value="RO">RO</option>
                    <option value="RR">RR</option>
                    <option value="SC">SC</option>
                    <option value="SP">SP</option>
                    <option value="SE">SE</option>
                    <option value="TO">TO</option>
                  </Select>
                  <FormErrorMessage>
                    {validators.find((obj) => obj.path === "state")
                      ? validators.find((obj) => obj.path === "state").message
                      : ""}
                  </FormErrorMessage>
                </FormControl>
              </Grid>
            </ModalBody>

            <ModalFooter>
              <Button
                leftIcon={<FaSave />}
                colorScheme={config.buttons}
                isLoading={loadingAddress}
                onClick={() => registerAddress()}
              >
                Cadastrar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <AlertDialog
          isOpen={modalCaution}
          onClose={() => setModalCaution(false)}
          isCentered
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                {modalTitle}
              </AlertDialogHeader>

              <AlertDialogBody>
                <Text>{modalMessage}</Text>
                <Text color="red.500" mt={3}>
                  {modalErroMessage || modalErroMessage !== ""
                    ? `Erro: ${modalErroMessage}`
                    : ""}
                </Text>
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button
                  colorScheme={config.buttons}
                  onClick={() => setModalCaution(false)}
                  ml={3}
                >
                  Fechar
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Hotkeys>
    </>
  );
}
