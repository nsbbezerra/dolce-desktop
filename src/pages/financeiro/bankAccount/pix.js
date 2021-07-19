import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Select,
  Table,
  Thead,
  Tbody,
  Td,
  Tr,
  HStack,
  Flex,
  Text,
  useToast,
  Kbd,
} from "@chakra-ui/react";
import config from "../../../configs/index";
import MaskedInput from "react-text-mask";
import { FaSave, FaTrash } from "react-icons/fa";
import useFetch from "../../../hooks/useFetch";
import Lottie from "../../../components/lottie";
import searchAnimation from "../../../animations/search.json";
import emptyAnimation from "../../../animations/empty.json";
import api from "../../../configs/axios";
import { useEmployee } from "../../../context/Employee";
import Hotkeys from "react-hot-keys";

export default function Pixx() {
  const { data, error } = useFetch("/pix");
  const { employee } = useEmployee();
  const toast = useToast();

  const [key, setKey] = useState("cpf");
  const [value, setValue] = useState("");
  const [pixs, setPixs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPixs(data);
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

  async function register(e) {
    if (e) {
      e.preventDefault();
    }
    if (value === "") {
      showToast("Insira um valor para a chave", "warning", "Atenção");
      return false;
    }
    setLoading(true);
    try {
      const response = await api.post(
        "/pix",
        { type: key, value },
        {
          headers: { "x-access-token": employee.token },
        }
      );
      showToast(response.data.message, "success", "Sucesso");
      setLoading(false);
      setKey("cpf");
      setValue("");
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

  async function popPix(id) {
    const result = await data.filter((obj) => obj.id !== id);
    setPixs(result);
  }

  async function removePix(id) {
    try {
      const response = await api.delete(`/pix/${id}`, {
        headers: { "x-access-token": employee.token },
      });
      showToast(response.data.message, "success", "Sucesso");
      popPix(id);
    } catch (error) {
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
        <Grid templateColumns="1fr 1fr" gap="30px">
          <Box rounded="md" borderWidth="1px" p={3} h="min-content">
            <Heading fontSize="lg">Cadastrar Chave PIX</Heading>
            <Divider mt={2} mb={5} />
            <Grid templateColumns="1fr 2fr" gap="15px">
              <FormControl>
                <FormLabel>Tipo de Chave</FormLabel>
                <Select
                  focusBorderColor={config.inputs}
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                >
                  <option value="cpf">CPF</option>
                  <option value="cnpj">CNPJ</option>
                  <option value="phone">Telefone</option>
                  <option value="email">Email</option>
                  <option value="aleatory">Aleatória</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Valor da Chave</FormLabel>
                {key === "cpf" && (
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
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
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
                )}
                {key === "cnpj" && (
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
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
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
                )}
                {key === "phone" && (
                  <Input
                    placeholder="Telefone"
                    focusBorderColor={config.inputs}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                )}
                {key === "email" && (
                  <Input
                    placeholder="Email"
                    focusBorderColor={config.inputs}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                )}
                {key === "aleatory" && (
                  <Input
                    placeholder="Aleatória"
                    focusBorderColor={config.inputs}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                )}
              </FormControl>
            </Grid>
            <Divider mt={5} mb={5} />
            <Button
              colorScheme={config.buttons}
              size="lg"
              leftIcon={<FaSave />}
              isLoading={loading}
              onClick={() => register()}
            >
              Cadastrar
              <Kbd ml={3} color="ButtonText">
                F12
              </Kbd>
            </Button>
          </Box>
          <Box rounded="md" borderWidth="1px" p={3}>
            <Heading fontSize="lg">Minhas Chaves PIX</Heading>
            <Divider mt={2} mb={5} />
            {!pixs ? (
              <Flex justify="center" align="center" direction="column">
                <Lottie animation={searchAnimation} height={200} width={200} />
                <Text>Buscando Informações</Text>
              </Flex>
            ) : (
              <>
                {pixs.length === 0 ? (
                  <Flex justify="center" align="center" direction="column">
                    <Lottie
                      animation={emptyAnimation}
                      height={200}
                      width={200}
                    />
                    <Text>Nenhuma chave PIX para mostrar</Text>
                  </Flex>
                ) : (
                  <Table size="sm">
                    <Thead fontWeight="700">
                      <Tr>
                        <Td w="20%%">Tipo</Td>
                        <Td w="65%">Valor</Td>
                        <Td w="15%"></Td>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {pixs.map((pix) => (
                        <Tr key={pix.id}>
                          <Td w="20%%">
                            {pix.type === "cpf" && "CPF"}
                            {pix.type === "cnpj" && "CNPJ"}
                            {pix.type === "phone" && "Telefone"}
                            {pix.type === "email" && "Email"}
                            {pix.type === "aleatory" && "Aleatória"}
                          </Td>
                          <Td w="65%">{pix.value}</Td>
                          <Td w="15%" isNumeric>
                            <HStack>
                              <Button
                                colorScheme="red"
                                leftIcon={<FaTrash />}
                                size="sm"
                                onClick={() => removePix(pix.id)}
                              >
                                Excluir
                              </Button>
                            </HStack>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
              </>
            )}
          </Box>
        </Grid>
      </Hotkeys>
    </>
  );
}
