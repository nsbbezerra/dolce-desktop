import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Icon,
  IconButton,
  Text,
  useColorMode,
  Spinner,
  Divider,
  Input,
  Button,
  useToast,
} from "@chakra-ui/react";
import api from "../../configs/axios";
import { useEmployee } from "../../context/Employee";
import HeaderApp from "../../components/headerApp";
import { FaFileImport, FaSearch, FaTrash } from "react-icons/fa";
import { File, InputFile } from "../../style/uploader";
import config from "../../configs";

export default function XmlImporter() {
  const toast = useToast();
  const { employee } = useEmployee();
  const { colorMode } = useColorMode();
  const [xml, setXml] = useState(null);
  const [loading, setLoading] = useState(true);

  const [chave, setChave] = useState({});
  const [destinatario, setDestinatario] = useState({});
  const [emitente, setEmitente] = useState({});
  const [produtos, setProdutos] = useState({});
  const [total, setTotal] = useState({});
  const [transporte, setTransporte] = useState({});
  const [fornecedor, setFornecedor] = useState({});
  const [entrega, setEntrega] = useState({});

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

  async function findData() {
    setLoading(true);

    let data = new FormData();
    data.append("xml", xml);

    try {
      const response = await api.post("/xmlimporter", data, {
        headers: { "x-access-token": employee.token },
      });
      setChave(response.data.Chave);
      setDestinatario(response.data.Destinatario);
      setEmitente(response.data.Emitente);
      setFornecedor(response.data.Fornecedor);
      setEntrega(response.data.Entrega);
      setProdutos(response.data.Produtos);
      setTotal(response.data.Total);
      setTransporte(response.data.Transporte);
      console.log(response.data);
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

  useEffect(() => {
    if (xml) {
      findData();
    }
  }, [xml]);

  return (
    <>
      <HeaderApp title="Importar XML de NFE" icon={FaFileImport} />

      <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
        <Grid templateColumns="450px 1fr" gap="20px">
          <FormControl>
            <FormLabel>Importar do Arquivo XML</FormLabel>
            {!xml ? (
              <InputFile alt={100} lar={450} cor={colorMode}>
                <File
                  type="file"
                  onChange={(event) => setXml(event.target.files[0])}
                />
                <FaFileImport style={{ fontSize: 30, marginBottom: 10 }} />
                <Text>Insira o Arquivo XML da NFE</Text>
              </InputFile>
            ) : (
              <Flex
                rounded="md"
                borderWidth="1px"
                borderStyle="dashed"
                justify="center"
                align="center"
                h="100px"
                direction="column"
              >
                {loading ? (
                  <Spinner size="lg" mb={5} />
                ) : (
                  <Icon as={FaFileImport} fontSize="2xl" mb={5} />
                )}
                <Text fontSize="xs">
                  {xml.name}{" "}
                  <IconButton
                    size="xs"
                    colorScheme="red"
                    rounded="full"
                    icon={<FaTrash />}
                    ml={3}
                    onClick={() => setXml(null)}
                  />
                </Text>
              </Flex>
            )}
          </FormControl>

          <FormControl>
            <FormLabel>Importar pela Chave da NFE</FormLabel>
            <Input
              focusBorderColor={config.inputs}
              placeholder="Chave da NFE"
            />

            <Button colorScheme={config.buttons} leftIcon={<FaSearch />} mt={5}>
              Buscar Dados da NFE
            </Button>
          </FormControl>
        </Grid>

        <Divider mt={5} mb={5} />
      </Box>
    </>
  );
}
