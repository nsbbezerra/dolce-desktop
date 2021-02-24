import React, { useState, useEffect, useRef } from "react";
import {
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Button,
  IconButton,
  Grid,
  Box,
  Divider,
  ModalCloseButton,
  ModalBody,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Skeleton,
  Stack,
  Kbd,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Text,
  Icon,
  HStack,
} from "@chakra-ui/react";
import HeaderApp from "../../../components/headerApp";
import useFetch from "../../../hooks/useFetch";
import { useEmployee } from "../../../context/Employee";
import { BsCardChecklist } from "react-icons/bs";
import config from "../../../configs";
import { FaPlus, FaSave, FaSearch, FaCheck, FaTimes } from "react-icons/fa";
import uniqId from "uniqid";
import Hotkeys from "react-hot-keys";
import api from "../../../configs/axios";

export default function DetailsProduct() {
  const toast = useToast();
  const { data, error } = useFetch("/products");
  const { employee } = useEmployee();
  const initialRef = useRef();

  const [description, setDescription] = useState("");
  const [listName, setListName] = useState("");
  const [list, setList] = useState([]);
  const [validators, setValidators] = useState([]);
  const [products, setProducts] = useState([]);
  const [nameProduct, setNameProduct] = useState("");
  const [idProduct, setIdProduct] = useState(null);
  const [modalProducts, setModalProducts] = useState(false);
  const [findProducts, setFindProducts] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setProducts(data);
  }, [data]);

  function handleValidator(path, message) {
    let val = [];
    let info = { path: path, message: message };
    val.push(info);
    setValidators(val);
    const inpt = document.getElementById(path);
    inpt.focus();
  }

  async function finderProductsBySource(text) {
    setFindProducts(text);
    if (text === "") {
      await setProducts(data);
    } else {
      let termos = await text.split(" ");
      let frasesFiltradas = await products.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.name.includes(termoBuscado);
        }, true);
      });
      await setProducts(frasesFiltradas);
    }
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

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom-right",
      duration: 8000,
    });
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async function handleProduct(id) {
    const result = await products.find((obj) => obj.id === id);
    setIdProduct(result.id);
    setNameProduct(result.name);
    setModalProducts(false);
  }

  function handleList() {
    let backList = list;
    const info = { id: uniqId(), name: listName };
    backList.push(info);
    setList(backList);
    setListName("");
  }

  async function removeFromList(id) {
    const result = await list.filter((obj) => obj.id !== id);
    setList(result);
  }

  async function register(e) {
    if (e) {
      e.preventDefault();
    }
    if (!idProduct) {
      handleValidator("product", "Nenhum produto selecionado");
      setModalProducts(true);
      return false;
    }
    if (description === "") {
      handleValidator("description", "A descrição é obrigatória");
      return false;
    }
    setLoading(true);
    try {
      const response = await api.post(
        "/details",
        {
          product: idProduct,
          description,
          list,
        },
        { headers: { "x-access-token": employee.token } }
      );
      showToast(response.data.message, "success", "Sucesso");
      setIdProduct(null);
      setNameProduct("");
      setDescription("");
      setList([]);
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
    if (keyName === "f3") {
      setModalProducts(true);
    }
    if (keyName === "f12") {
      register(e);
    }
  }

  return (
    <>
      <Hotkeys
        keyName="f3, f12"
        onKeyDown={onKeyDown}
        allowRepeat
        filter={(event) => {
          return true;
        }}
      >
        <HeaderApp
          title="Cadastrar Detalhes do Produto"
          icon={BsCardChecklist}
        />

        <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
          <Grid templateColumns={"1fr 200px"} gap="15px">
            <FormControl
              isInvalid={
                validators.find((obj) => obj.path === "product") ? true : false
              }
            >
              <Input
                id="product"
                focusBorderColor={config.inputs}
                placeholder="Buscar Produtos"
                value={nameProduct}
                isReadOnly
              />
              <FormErrorMessage>
                {validators.find((obj) => obj.path === "product")
                  ? validators.find((obj) => obj.path === "product").message
                  : ""}
              </FormErrorMessage>
            </FormControl>
            <Button
              isFullWidth
              leftIcon={<FaSearch />}
              onClick={() => setModalProducts(true)}
              colorScheme={config.buttons}
              variant="outline"
            >
              Buscar Produto
              <Kbd ml={3} color="ButtonText">
                F3
              </Kbd>
            </Button>
          </Grid>

          <Divider mt={5} mb={3} />
          <FormControl
            isRequired
            isInvalid={
              validators.find((obj) => obj.path === "description")
                ? true
                : false
            }
          >
            <FormLabel>
              Descrição do Produto -{" "}
              <strong>Separe por (.) os parágrafos</strong>
            </FormLabel>
            <Textarea
              id="description"
              rows={5}
              focusBorderColor={config.inputs}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <FormErrorMessage>
              {validators.find((obj) => obj.path === "description")
                ? validators.find((obj) => obj.path === "description").message
                : ""}
            </FormErrorMessage>
          </FormControl>
          <FormControl mt={3}>
            <FormLabel>Lista de Detalhes</FormLabel>
            <Grid templateColumns="1fr 150px" gap="15px">
              <Input
                focusBorderColor={config.inputs}
                value={listName}
                onChange={(e) =>
                  setListName(capitalizeFirstLetter(e.target.value))
                }
              />
              <Button
                colorScheme={config.buttons}
                variant="outline"
                leftIcon={<FaPlus />}
                onClick={() => handleList()}
              >
                Adicionar
              </Button>
            </Grid>
          </FormControl>

          {!!list.length && (
            <Box borderWidth="1px" rounded="md" p={3} mt={5}>
              {list.map((li) => (
                <HStack spacing={3} mt={2}>
                  <Text key={li.id}>
                    <Icon as={FaCheck} color="green.400" mr={3} /> {li.name}
                  </Text>
                  <IconButton
                    icon={<FaTimes />}
                    rounded="full"
                    colorScheme="red"
                    size="xs"
                    onClick={() => removeFromList(li.id)}
                  />
                </HStack>
              ))}
            </Box>
          )}

          <Divider mt={5} mb={5} />

          <Button
            leftIcon={<FaSave />}
            colorScheme={config.buttons}
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

        <Modal
          isOpen={modalProducts}
          onClose={() => setModalProducts(false)}
          size="xl"
          scrollBehavior="inside"
          isCentered
          initialFocusRef={initialRef}
        >
          <ModalOverlay />
          <ModalContent pb={4}>
            <ModalHeader>Produtos</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Digite para Buscar"
                focusBorderColor={config.inputs}
                value={findProducts}
                onChange={(e) =>
                  finderProductsBySource(capitalizeFirstLetter(e.target.value))
                }
                ref={initialRef}
              />
              {products ? (
                <Table size="sm" mt={3}>
                  <Thead fontWeight="700">
                    <Tr>
                      <Td>Produto</Td>
                      <Td w="10%" isNumeric></Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {products.map((pro) => (
                      <Tr key={pro.id}>
                        <Td>{pro.name}</Td>
                        <Td w="10%" isNumeric>
                          <IconButton
                            aria-label="Search database"
                            icon={<FaCheck />}
                            size="xs"
                            isRound
                            colorScheme={config.buttons}
                            onClick={() => handleProduct(pro.id)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              ) : (
                <Stack mt={3}>
                  <Skeleton height="30px" />
                  <Skeleton height="30px" />
                  <Skeleton height="30px" />
                  <Skeleton height="30px" />
                </Stack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Hotkeys>
    </>
  );
}
