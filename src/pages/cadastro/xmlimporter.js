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
  Input,
  Button,
  useToast,
  Center,
  Heading,
  Table,
  Thead,
  Th,
  Tr,
  Tbody,
  Td,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import api from "../../configs/axios";
import { useEmployee } from "../../context/Employee";
import HeaderApp from "../../components/headerApp";
import { FaFileImport, FaSave, FaTrash } from "react-icons/fa";
import { File, InputFile } from "../../style/uploader";
import config from "../../configs";
import HandleProducts from "../../components/products";

export default function XmlImporter() {
  const toast = useToast();
  const { employee } = useEmployee();
  const { colorMode } = useColorMode();
  const [xml, setXml] = useState(null);
  const [loading, setLoading] = useState(true);

  const [emitente, setEmitente] = useState({});
  const [produtos, setProdutos] = useState([]);
  const [total, setTotal] = useState({});
  const [imported, setImported] = useState(false);
  const [modalHandle, setModalHandle] = useState(false);
  const [productHandle, setProductHandle] = useState({});

  async function handleCloseModal() {
    const updated = await produtos.filter((obj) => obj.id !== productHandle.id);
    setProdutos(updated);
    setModalHandle(false);
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

  async function findData() {
    setLoading(true);

    let data = new FormData();
    data.append("xml", xml);

    try {
      const response = await api.post("/xmlimporter", data, {
        headers: { "x-access-token": employee.token },
      });
      setEmitente(response.data.Emitente);
      setProdutos(response.data.Produtos);
      setTotal(response.data.Total);
      setImported(response.data.imported);
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

  function handleSaveProduct(info) {
    setProductHandle(info);
    setModalHandle(true);
  }

  return (
    <>
      <HeaderApp title="Importar XML de NFE" icon={FaFileImport} />

      <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
        <Grid templateColumns="1fr" gap="20px">
          <FormControl>
            <FormLabel>Importar do Arquivo XML</FormLabel>

            {!xml ? (
              <InputFile alt={100} cor={colorMode} style={{ width: "100%" }}>
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
                w="100%"
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
        </Grid>

        {JSON.stringify(emitente) !== "{}" && (
          <>
            <Center
              rounded="md"
              p={2}
              bg="rgba(160, 174, 192, 0.1)"
              mb={5}
              mt={5}
            >
              <Heading fontSize="sm">Informações do Emitente</Heading>
            </Center>

            <Grid templateColumns="1fr 1fr" gap="20px">
              <FormControl>
                <FormLabel>Razão Social</FormLabel>
                <Input
                  isReadOnly
                  focusBorderColor={config.inputs}
                  placeholder="Razão Social"
                  value={emitente.name}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Nome Fantasia</FormLabel>
                <Input
                  isReadOnly
                  focusBorderColor={config.inputs}
                  placeholder="Nome Fantasia"
                  value={emitente.fantasia}
                />
              </FormControl>
            </Grid>
            <Grid templateColumns="1fr 1fr 1fr" gap="20px" mt={3}>
              <FormControl>
                <FormLabel>CNPJ</FormLabel>
                <Input
                  isReadOnly
                  focusBorderColor={config.inputs}
                  placeholder="CNPJ"
                  value={emitente.cnpj}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Contato</FormLabel>
                <Input
                  isReadOnly
                  focusBorderColor={config.inputs}
                  placeholder="Contato"
                  value={emitente.contact}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  isReadOnly
                  focusBorderColor={config.inputs}
                  placeholder="Email"
                  value={emitente.email}
                />
              </FormControl>
            </Grid>
            <Grid mt={3} templateColumns="3fr 1fr" gap="20px">
              <FormControl>
                <FormLabel>Logradouro</FormLabel>
                <Input
                  isReadOnly
                  focusBorderColor={config.inputs}
                  placeholder="Logradouro"
                  value={emitente.street}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Número</FormLabel>
                <Input
                  isReadOnly
                  focusBorderColor={config.inputs}
                  placeholder="Número"
                  value={emitente.number}
                />
              </FormControl>
            </Grid>
            <Grid templateColumns="1fr 1fr" gap="20px" mt={3}>
              <FormControl>
                <FormLabel>Complemento</FormLabel>
                <Input
                  isReadOnly
                  focusBorderColor={config.inputs}
                  placeholder="Complemento"
                  value={emitente.comp}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Bairro</FormLabel>
                <Input
                  isReadOnly
                  focusBorderColor={config.inputs}
                  placeholder="Bairro"
                  value={emitente.district}
                />
              </FormControl>
            </Grid>
            <Grid templateColumns="1fr 1fr 1fr" gap="20px" mt={3}>
              <FormControl>
                <FormLabel>CEP</FormLabel>
                <Input
                  isReadOnly
                  focusBorderColor={config.inputs}
                  placeholder="CEP"
                  value={emitente.cep}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Cidade</FormLabel>
                <Input
                  isReadOnly
                  focusBorderColor={config.inputs}
                  placeholder="Cidade"
                  value={emitente.city}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Estado</FormLabel>
                <Input
                  isReadOnly
                  focusBorderColor={config.inputs}
                  placeholder="Estado"
                  value={emitente.state}
                />
              </FormControl>
            </Grid>
          </>
        )}

        {produtos.length !== 0 && (
          <>
            <Center
              rounded="md"
              p={2}
              bg="rgba(160, 174, 192, 0.1)"
              mb={1}
              mt={5}
            >
              <Heading fontSize="sm">Produtos da NFE</Heading>
            </Center>

            <Table size="sm">
              <Thead>
                <Tr>
                  <Th w="40%">Nome</Th>
                  <Th>SKU</Th>
                  <Th>Cód. Barras</Th>
                  <Th isNumeric w="12%">
                    Custo
                  </Th>
                  <Th w="10%"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {produtos.map((prod) => (
                  <Tr key={prod.id}>
                    <Td w="40%">{prod.name}</Td>
                    <Td>{prod.sku}</Td>
                    <Td>{prod.barcode}</Td>
                    <Td isNumeric w="12%">
                      {parseFloat(prod.cost_value).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </Td>
                    <Td w="10%">
                      <Button
                        colorScheme={config.buttons}
                        size="xs"
                        leftIcon={<FaSave />}
                        onClick={() => handleSaveProduct(prod)}
                      >
                        Visualizar e Salvar
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </>
        )}

        {JSON.stringify(total) !== "{}" && (
          <>
            <Center
              rounded="md"
              p={2}
              bg="rgba(160, 174, 192, 0.1)"
              mb={5}
              mt={5}
            >
              <Heading fontSize="sm">Total da NFE</Heading>
            </Center>

            <Grid templateColumns="2fr 1fr 1fr 1fr" gap="20px">
              <FormControl>
                <FormLabel>Chave da NFE</FormLabel>
                <Input
                  isReadOnly
                  focusBorderColor={config.inputs}
                  placeholder="Chave da NFE"
                  value={total.chave_nfe}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Valor da NFE</FormLabel>
                <Input
                  isReadOnly
                  focusBorderColor={config.inputs}
                  placeholder="Valor da NFE"
                  value={parseFloat(total.total_nota).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Valor dos Produtos</FormLabel>
                <Input
                  isReadOnly
                  focusBorderColor={config.inputs}
                  placeholder="Valor dos Produtos"
                  value={parseFloat(total.total_produtos).toLocaleString(
                    "pt-BR",
                    {
                      style: "currency",
                      currency: "BRL",
                    }
                  )}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Valor do Frete</FormLabel>
                <Input
                  isReadOnly
                  focusBorderColor={config.inputs}
                  placeholder="Valor do Frete"
                  value={parseFloat(total.valor_frete).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                />
              </FormControl>
            </Grid>
          </>
        )}
      </Box>

      <AlertDialog
        isOpen={imported}
        onClose={() => setImported(false)}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Atenção!
            </AlertDialogHeader>

            <AlertDialogBody>Esta NFE já foi importada!</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                colorScheme={config.buttons}
                onClick={() => setImported(false)}
              >
                OK
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal
        isOpen={modalHandle}
        onClose={() => setModalHandle(false)}
        size="7xl"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent h="95vh" maxW="95vw">
          <ModalHeader>Visualizar e Salvar</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={5}>
            {modalHandle && (
              <HandleProducts
                item={productHandle}
                onClosed={handleCloseModal}
                emitter={emitente}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
