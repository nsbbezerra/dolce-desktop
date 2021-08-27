import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Grid,
  Button,
  Divider,
  Input,
  Stack,
  RadioGroup,
  Radio,
  Flex,
  Text,
  useToast,
  Tooltip,
  IconButton,
  useColorMode,
  Image,
  Select,
  Kbd,
} from "@chakra-ui/react";
import config from "../../configs/index";
import { useEmployee } from "../../context/Employee";
import HeaderApp from "../../components/headerApp";
import Hotkeys from "react-hot-keys";
import axios from "axios";
import MaskedInput from "react-text-mask";
import { FaShippingFast, FaImage, FaSave } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { InputFile, File } from "../../style/uploader";
import api from "../../configs/axios";

export default function RegisterProvider() {
  const toast = useToast();
  const { colorMode } = useColorMode();
  const { employee } = useEmployee();

  const [typeContact, setTypeContact] = useState("1");
  const [validators, setValidators] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [comp, setComp] = useState("");
  const [district, setDistrict] = useState("");
  const [cep, setCep] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);
  const [fantasia, setFantasia] = useState("");

  function clear() {
    setName("");
    setTypeContact("1");
    setCnpj("");
    setContact("");
    setEmail("");
    setStreet("");
    setNumber("");
    setComp("");
    setDistrict("");
    setCep("");
    setCity("");
    setState("");
    setThumbnail(null);
    removeThumbnail();
    setFantasia("");
  }

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

  function capitalizeFirstLetter(string) {
    let splited = string.split(" ");
    let toJoin = splited.map((e) => {
      return e.charAt(0).toUpperCase() + e.slice(1);
    });
    let joined = toJoin.join(" ");
    return joined;
  }

  const previewThumbnail = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  async function removeThumbnail() {
    await URL.revokeObjectURL(thumbnail);
    setThumbnail(null);
    setValidators([]);
  }

  async function register(e) {
    if (e) {
      e.preventDefault();
    }
    if (!thumbnail) {
      handleValidator("image", "Insira uma imagem");
      return false;
    }
    if (name === "") {
      handleValidator("name", "O nome é obrigatório");
      return false;
    }
    if (cnpj === "") {
      handleValidator("cnpj", "O CNPJ é obrigatório");
      return false;
    }
    if (cnpj.includes("_")) {
      handleValidator("cnpj", "Insira um CNPJ válido");
      return false;
    }
    if (contact === "") {
      handleValidator("contact", "O telefone é obrigatório");
      return false;
    }
    if (contact.includes("_")) {
      handleValidator("contact", "Insira um telefone válido");
      return false;
    }
    if (email === "") {
      handleValidator("email", "O email é obrigatório");
      return false;
    }
    if (!email.includes("@") || !email.includes(".")) {
      handleValidator("email", "Insira um email válido");
      return false;
    }
    if (street === "") {
      handleValidator("street", "O logradouro é obrigatório");
      return false;
    }
    if (number === "") {
      handleValidator("number", "O número é obrigatório");
      return false;
    }
    if (district === "") {
      handleValidator("district", "O bairro é obrigatório");
      return false;
    }
    if (cep === "") {
      handleValidator("cep", "O CEP é obrigatório");
      return false;
    }
    if (cep.includes("_")) {
      handleValidator("cep", "Insira um CEP válido");
      return false;
    }
    if (city === "") {
      handleValidator("city", "A cidade é obrigatória");
      return false;
    }
    if (state === "") {
      handleValidator("state", "O estado é obrigatório");
      return false;
    }
    setLoading(true);
    try {
      let data = new FormData();
      data.append("thumbnail", thumbnail);
      data.append("name", name);
      data.append("cnpj", cnpj);
      data.append("contact", contact);
      data.append("email", email);
      data.append("street", street);
      data.append("number", number);
      data.append("comp", comp);
      data.append("district", district);
      data.append("cep", cep);
      data.append("city", city);
      data.append("state", state);
      data.append("fantasia", fantasia);
      console.log(thumbnail);
      const response = await api.post("/providers", data, {
        headers: { "x-access-token": employee.token },
      });
      showToast(response.data.message, "success", "Sucesso");
      setLoading(false);
      clear();
    } catch (error) {
      setLoading(false);
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
        <HeaderApp title="Cadastro de Fornecedores" icon={FaShippingFast} />
        <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
          <Grid templateColumns="250px 1fr" gap="25px">
            <Box>
              <FormControl
                isRequired
                isInvalid={
                  validators.find((obj) => obj.path === "image") ? true : false
                }
              >
                <FormLabel>Logomarca</FormLabel>
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
              <Grid templateColumns="1fr 1fr" gap="15px">
                <FormControl
                  isRequired
                  isInvalid={
                    validators.find((obj) => obj.path === "name") ? true : false
                  }
                >
                  <FormLabel>Razão Social</FormLabel>
                  <Input
                    placeholder="Razão Social"
                    id="name"
                    focusBorderColor={config.inputs}
                    value={name}
                    onChange={(e) =>
                      setName(capitalizeFirstLetter(e.target.value))
                    }
                  />
                  <FormErrorMessage>
                    {validators.find((obj) => obj.path === "name")
                      ? validators.find((obj) => obj.path === "name").message
                      : ""}
                  </FormErrorMessage>
                </FormControl>

                <FormControl>
                  <FormLabel>Nome Fantasia</FormLabel>
                  <Input
                    placeholder="Nome Fantasia"
                    id="fantasia"
                    focusBorderColor={config.inputs}
                    value={fantasia}
                    onChange={(e) =>
                      setFantasia(capitalizeFirstLetter(e.target.value))
                    }
                  />
                </FormControl>
              </Grid>

              <Grid mt={3} templateColumns="repeat(3, 1fr)" gap="15px">
                <FormControl
                  isRequired
                  isInvalid={
                    validators.find((obj) => obj.path === "cnpj") ? true : false
                  }
                >
                  <FormLabel>CNPJ</FormLabel>
                  <MaskedInput
                    mask={[
                      /[0-9]/,
                      /\d/,
                      ".",
                      /\d/,
                      /\d/,
                      /\d/,
                      ".",
                      /\d/,
                      /\d/,
                      /\d/,
                      "/",
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                      "-",
                      /\d/,
                      /\d/,
                    ]}
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    placeholder="CNPJ"
                    id="cnpj"
                    render={(ref, props) => (
                      <Input
                        ref={ref}
                        {...props}
                        focusBorderColor={config.inputs}
                      />
                    )}
                  />
                  <FormErrorMessage>
                    {validators.find((obj) => obj.path === "cnpj")
                      ? validators.find((obj) => obj.path === "cnpj").message
                      : ""}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={
                    validators.find((obj) => obj.path === "contact")
                      ? true
                      : false
                  }
                >
                  <FormLabel>
                    <Stack direction="row">
                      <Text>Contato:</Text>
                      <RadioGroup
                        value={typeContact}
                        onChange={(e) => setTypeContact(e)}
                        colorScheme={config.switchs}
                        ml={4}
                        fontSize="xs"
                      >
                        <Stack spacing={5} direction="row">
                          <Radio value="1">Comercial</Radio>
                          <Radio value="2">Celular</Radio>
                        </Stack>
                      </RadioGroup>
                    </Stack>
                  </FormLabel>
                  {typeContact === "1" ? (
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
                  ) : (
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
                  )}
                  <FormErrorMessage>
                    {validators.find((obj) => obj.path === "contact")
                      ? validators.find((obj) => obj.path === "contact").message
                      : ""}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={
                    validators.find((obj) => obj.path === "email")
                      ? true
                      : false
                  }
                >
                  <FormLabel>Email</FormLabel>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value.toLowerCase())}
                    placeholder="Email"
                    id="email"
                    focusBorderColor={config.inputs}
                  />
                  <FormErrorMessage>
                    {validators.find((obj) => obj.path === "email")
                      ? validators.find((obj) => obj.path === "email").message
                      : ""}
                  </FormErrorMessage>
                </FormControl>
              </Grid>

              <Grid templateColumns="3fr 1fr" mt={3} gap="15px">
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
                    id="street"
                    focusBorderColor={config.inputs}
                    value={street}
                    onChange={(e) =>
                      setStreet(capitalizeFirstLetter(e.target.value))
                    }
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
                  <FormLabel>Número</FormLabel>
                  <Input
                    placeholder="Número"
                    id="number"
                    focusBorderColor={config.inputs}
                    value={number}
                    onChange={(e) => setNumber(e.target.value.toUpperCase())}
                  />
                  <FormErrorMessage>
                    {validators.find((obj) => obj.path === "number")
                      ? validators.find((obj) => obj.path === "number").message
                      : ""}
                  </FormErrorMessage>
                </FormControl>
              </Grid>

              <Grid templateColumns="1fr 1fr" mt={3} gap="15px">
                <FormControl>
                  <FormLabel>Complemento</FormLabel>
                  <Input
                    placeholder="Complemento"
                    id="comp"
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
                    validators.find((obj) => obj.path === "district")
                      ? true
                      : false
                  }
                >
                  <FormLabel>Bairro</FormLabel>
                  <Input
                    placeholder="Bairro"
                    id="district"
                    focusBorderColor={config.inputs}
                    value={district}
                    onChange={(e) =>
                      setDistrict(capitalizeFirstLetter(e.target.value))
                    }
                  />
                  <FormErrorMessage>
                    {validators.find((obj) => obj.path === "district")
                      ? validators.find((obj) => obj.path === "district")
                          .message
                      : ""}
                  </FormErrorMessage>
                </FormControl>
              </Grid>

              <Grid templateColumns="1fr 1fr 200px" mt={3} gap="15px">
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
                    id="city"
                    focusBorderColor={config.inputs}
                    value={city}
                    onChange={(e) =>
                      setCity(capitalizeFirstLetter(e.target.value))
                    }
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
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
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
            </Box>
          </Grid>

          <Divider mt={5} mb={5} />

          <Button
            colorScheme={config.buttons}
            leftIcon={<FaSave />}
            size="lg"
            isLoading={loading}
            onClick={() => register()}
          >
            Salvar{" "}
            <Kbd ml={3} color="ButtonText">
              F12
            </Kbd>
          </Button>
        </Box>
      </Hotkeys>
    </>
  );
}
