import React, { useEffect, useState, useRef } from "react";
import {
  IconButton,
  Box,
  Grid,
  FormControl,
  Input,
  Select,
  FormLabel,
  Button,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  Tbody,
  Thead,
  Tr,
  Td,
  Tooltip,
  useToast,
  SkeletonText,
  Kbd,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Text,
  FormErrorMessage,
  Flex,
} from "@chakra-ui/react";
import { FaMapMarkedAlt, FaSave, FaSearch, FaCheck } from "react-icons/fa";
import config from "../../configs";
import Headerapp from "../../components/headerApp";
import useFetch from "../../hooks/useFetch";
import Hotkeys from "react-hot-keys";
import { useEmployee } from "../../context/Employee";
import api from "../../configs/axios";
import axios from "axios";
import MaskedInput from "react-text-mask";
import Lottie from "../../components/lottie";
import emptyAnimation from "../../animations/empty.json";

export default function Endereco() {
  const toast = useToast();
  const { data, error } = useFetch("/clients");
  const initialRef = useRef();
  const { employee } = useEmployee();

  const [validators, setValidators] = useState([]);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [modalCaution, setModalCaution] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalErroMessage, setModalErroMessage] = useState("");

  const [modalClient, setModalClient] = useState(false);
  const [clients, setClients] = useState([]);
  const [findClient, setFindClient] = useState("");
  const [clientId, setClientId] = useState(null);
  const [clientName, setClientName] = useState("");

  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [comp, setComp] = useState("");
  const [bairro, setBairro] = useState("");
  const [cep, setCep] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  useEffect(() => {
    setClients(data);
  }, [data]);

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

  function clear() {
    setStreet("");
    setNumber("");
    setComp("");
    setBairro("");
    setCep("");
    setCity("");
    setState();
    setClientId(null);
    setClientName("");
  }

  function handleValidator(path, message) {
    let val = [];
    let info = { path: path, message: message };
    val.push(info);
    setValidators(val);
    const inpt = document.getElementById(path);
    inpt.focus();
    setTimeout(() => {
      setValidators([]);
    }, 4000);
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

  async function finderClientsBySource(text) {
    setFindClient(text);
    if (text === "") {
      await setClients(data);
    } else {
      let termos = await text.split(" ");
      let frasesFiltradas = await clients.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.name.includes(termoBuscado);
        }, true);
      });
      await setClients(frasesFiltradas);
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

  function capitalizeFirstLetter(string) {
    let splited = string.split(" ");
    let toJoin = splited.map((e) => {
      return e.charAt(0).toUpperCase() + e.slice(1);
    });
    let joined = toJoin.join(" ");
    return joined;
  }

  function handleFindClient(id) {
    const result = clients.find((obj) => obj.id === id);
    setClientId(result.id);
    setClientName(result.name);
    setModalClient(false);
  }

  async function registerAddress(e) {
    if (e) {
      e.preventDefault();
    }

    if (clientId === null || !clientId) {
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
          client_id: clientId,
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

  function onKeyDown(keyName, e, handle) {
    if (keyName === "f3") {
      setModalClient(true);
    }
    if (keyName === "f12") {
      registerAddress(e);
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
        <Headerapp title="Cadastro de Endereços" icon={FaMapMarkedAlt} />

        <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
          <Grid templateColumns="1fr 200px" gap="15px">
            <Input
              placeholder="Cliente"
              focusBorderColor={config.inputs}
              isReadOnly
              value={clientName}
            />
            <Button
              leftIcon={<FaSearch />}
              onClick={() => setModalClient(true)}
              colorScheme={config.buttons}
              variant="outline"
            >
              Buscar Cliente{" "}
              <Kbd ml={3} color="ButtonText">
                F3
              </Kbd>
            </Button>
          </Grid>
          <Divider mt={5} mb={5} />
          <Grid templateColumns="1fr 200px" gap="15px">
            <FormControl
              isRequired
              isInvalid={
                validators.find((obj) => obj.path === "street") ? true : false
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
                validators.find((obj) => obj.path === "number") ? true : false
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
                onChange={(e) => setComp(capitalizeFirstLetter(e.target.value))}
              />
            </FormControl>
            <FormControl
              isRequired
              isInvalid={
                validators.find((obj) => obj.path === "bairro") ? true : false
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
          <Grid templateColumns="1fr 1fr 200px" gap="15px" mt={3}>
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
                onChange={(e) => setCity(capitalizeFirstLetter(e.target.value))}
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
                validators.find((obj) => obj.path === "state") ? true : false
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
          <Divider mt={5} mb={5} />
          <Button
            leftIcon={<FaSave />}
            colorScheme={config.buttons}
            size="lg"
            isLoading={loadingAddress}
            onClick={() => registerAddress()}
          >
            Cadastrar{" "}
            <Kbd ml={3} color="ButtonText">
              F12
            </Kbd>
          </Button>
        </Box>

        <Modal
          isOpen={modalClient}
          onClose={() => setModalClient(false)}
          size="xl"
          isCentered
          scrollBehavior="inside"
          initialFocusRef={initialRef}
        >
          <ModalOverlay />
          <ModalContent maxW="50rem">
            <ModalHeader>Buscar Cliente</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={5}>
              <Input
                ref={initialRef}
                placeholder="Digite um nome para buscar"
                focusBorderColor={config.inputs}
                value={findClient}
                onChange={(e) =>
                  finderClientsBySource(capitalizeFirstLetter(e.target.value))
                }
              />
              {clients ? (
                <>
                  {clients.length === 0 ? (
                    <Flex justify="center" align="center" direction="column">
                      <Lottie
                        animation={emptyAnimation}
                        height={200}
                        width={200}
                      />
                      <Text>Nenhum cliente para mostrar</Text>
                    </Flex>
                  ) : (
                    <Table size="sm">
                      <Thead fontWeight="700">
                        <Tr>
                          <Td>Nome</Td>
                          <Td w="10%">Ações</Td>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {clients && (
                          <>
                            {clients.map((client) => (
                              <Tr key={client.id}>
                                <Td>{client.name}</Td>
                                <Td w="10%" textAlign="center">
                                  <Tooltip label="Selecionar cliente" hasArrow>
                                    <IconButton
                                      aria-label="Search database"
                                      icon={<FaCheck />}
                                      size="xs"
                                      isRound
                                      colorScheme={config.buttons}
                                      onClick={() =>
                                        handleFindClient(client.id)
                                      }
                                    />
                                  </Tooltip>
                                </Td>
                              </Tr>
                            ))}
                          </>
                        )}
                      </Tbody>
                    </Table>
                  )}
                </>
              ) : (
                <SkeletonText noOfLines={4} spacing="4" />
              )}
            </ModalBody>
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
