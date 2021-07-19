import React, { useState, useMemo } from "react";
import {
  Grid,
  FormControl,
  FormLabel,
  Input,
  Button,
  Divider,
  useToast,
  Box,
  FormErrorMessage,
  Image,
  IconButton,
  Flex,
  Tooltip,
  useColorMode,
  Text,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Kbd,
} from "@chakra-ui/react";
import { FaSave, FaImage } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { useEmployee } from "../../../context/Employee";
import api from "../../../configs/axios";
import config from "../../../configs/index";
import { InputFile, File } from "../../../style/uploader";
import Hotkeys from "react-hot-keys";

export default function SaveBankAccount() {
  const { employee } = useEmployee();
  const toast = useToast();
  const { colorMode } = useColorMode();

  const [thumbnail, setThumbnail] = useState(null);
  const [validators, setValidators] = useState([]);
  const [loading, setLoading] = useState(false);

  const [bank, setBank] = useState("");
  const [mode, setMode] = useState("");
  const [agency, setAgency] = useState("");
  const [account, setAccount] = useState("");
  const [variation, setVariation] = useState("");
  const [operation, setOperation] = useState("");
  const [amount, setAmount] = useState("0");

  function clear() {
    setBank("");
    setMode("");
    setAgency("");
    setAccount("");
    setVariation("");
    setOperation("");
    setAmount("0");
    setThumbnail(null);
    removeThumbnail();
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

  const previewThumbnail = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  async function removeThumbnail() {
    await URL.revokeObjectURL(thumbnail);
    setThumbnail(null);
    setValidators([]);
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

  async function register(e) {
    if (e) {
      e.preventDefault();
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
      return false;
    }
    if (bank === "") {
      handleValidator("bank", "O nome do banco é obrigatório");
      return false;
    }
    if (mode === "") {
      handleValidator("mode", "Selecione uma opção");
      return false;
    }
    if (agency === "") {
      handleValidator("agency", "Digite uma agencia");
      return false;
    }
    if (account === "") {
      handleValidator("account", "Digite uma conta");
      return false;
    }
    if (amount === "") {
      handleValidator("amount", "Digite um valor");
      return false;
    }
    setValidators([]);
    setLoading(true);
    let data = new FormData();
    data.append("thumbnail", thumbnail);
    data.append("bank", bank);
    data.append("mode", mode);
    data.append("agency", agency);
    data.append("account", account);
    data.append("variation", variation);
    data.append("operation", operation);
    data.append("amount", amount);

    try {
      const response = await api.post("/accountbank", data, {
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
        <Grid templateColumns={"250px 1fr"} gap="15px">
          <Box>
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
                      onChange={(event) => setThumbnail(event.target.files[0])}
                    />
                    <FaImage style={{ fontSize: 50, marginBottom: 20 }} />
                    <Text>Insira uma imagem 300x300 pixels, de até 500kb</Text>
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
            <Grid templateColumns="3fr 1fr" gap="15px" mb={3}>
              <FormControl
                isRequired
                isInvalid={
                  validators.find((obj) => obj.path === "bank") ? true : false
                }
              >
                <FormLabel>Banco</FormLabel>
                <Input
                  id="bank"
                  value={bank}
                  onChange={(e) =>
                    setBank(capitalizeAllFirstLetter(e.target.value))
                  }
                  type="text"
                  placeholder="Banco"
                  focusBorderColor={config.inputs}
                />
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "bank")
                    ? validators.find((obj) => obj.path === "bank").message
                    : ""}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={
                  validators.find((obj) => obj.path === "mode") ? true : false
                }
              >
                <FormLabel>Tipo</FormLabel>
                <Select
                  focusBorderColor={config.inputs}
                  placeholder="Selecione uma opção"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  id="mode"
                >
                  <option value="current">Conta Corrente</option>
                  <option value="savings">Poupança</option>
                </Select>
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "mode")
                    ? validators.find((obj) => obj.path === "mode").message
                    : ""}
                </FormErrorMessage>
              </FormControl>
            </Grid>

            <Grid templateColumns="repeat(5, 1fr)" gap="15px">
              <FormControl
                isRequired
                isInvalid={
                  validators.find((obj) => obj.path === "agency") ? true : false
                }
              >
                <FormLabel>Agencia</FormLabel>
                <Input
                  id="agency"
                  value={agency}
                  onChange={(e) => setAgency(e.target.value.toUpperCase())}
                  type="text"
                  placeholder="Agencia"
                  focusBorderColor={config.inputs}
                />
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "agency")
                    ? validators.find((obj) => obj.path === "agency").message
                    : ""}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={
                  validators.find((obj) => obj.path === "account")
                    ? true
                    : false
                }
              >
                <FormLabel>Conta</FormLabel>
                <Input
                  id="account"
                  value={account}
                  onChange={(e) => setAccount(e.target.value.toUpperCase())}
                  type="text"
                  placeholder="Conta"
                  focusBorderColor={config.inputs}
                />
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "account")
                    ? validators.find((obj) => obj.path === "account").message
                    : ""}
                </FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel>Variação</FormLabel>
                <Input
                  value={variation}
                  onChange={(e) => setVariation(e.target.value.toUpperCase())}
                  type="text"
                  placeholder="Variação"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Operação</FormLabel>
                <Input
                  value={operation}
                  onChange={(e) => setOperation(e.target.value.toUpperCase())}
                  type="text"
                  placeholder="Operação"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
              <FormControl
                isRequired
                isInvalid={
                  validators.find((obj) => obj.path === "amount") ? true : false
                }
              >
                <FormLabel>Valor Inicial</FormLabel>
                <NumberInput
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e)}
                  precision={2}
                  step={0.01}
                  focusBorderColor={config.inputs}
                  placeholder="Valor Inicial"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "amount")
                    ? validators.find((obj) => obj.path === "amount").message
                    : ""}
                </FormErrorMessage>
              </FormControl>
            </Grid>
          </Box>
        </Grid>
        <Divider mt={5} mb={5} />
        <Button
          leftIcon={<FaSave />}
          colorScheme={config.buttons}
          size="lg"
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
