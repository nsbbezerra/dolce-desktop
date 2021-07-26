import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Button,
  Select,
  Textarea,
  Divider,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
  FormErrorMessage,
  SkeletonText,
  IconButton,
  Tooltip,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Text,
  InputGroup,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  InputRightElement,
  Kbd,
} from "@chakra-ui/react";
import config from "../../../configs/index";
import { FaSave, FaSearch, FaCheck, FaCalendarAlt } from "react-icons/fa";
import useFetch from "../../../hooks/useFetch";
import { useEmployee } from "../../../context/Employee";
import api from "../../../configs/axios";
import Lottie from "../../../components/lottie";
import emptyAnimation from "../../../animations/empty.json";
import pt_br from "date-fns/locale/pt-BR";
import DatePicker, { registerLocale } from "react-datepicker";
import Hotkeys from "react-hot-keys";

registerLocale("pt_br", pt_br);

export default function SaveCheck() {
  const toast = useToast();
  const { employee } = useEmployee();
  const { data, error } = useFetch("/clients");
  const initialRef = useRef();

  const [clients, setClients] = useState([]);
  const [modalClient, setModalClient] = useState(false);
  const [findClient, setFindClient] = useState("");
  const [clientId, setClientId] = useState(null);
  const [clientName, setClientName] = useState("");
  const [validators, setValidators] = useState([]);

  const [number, setNumber] = useState("");
  const [entity, setEntity] = useState("");
  const [situation, setSituation] = useState("");
  const [status, setStatus] = useState("");
  const [value, setValue] = useState("0");
  const [emission, setEmission] = useState(new Date());
  const [due_date, setDue_date] = useState(new Date());
  const [observation, setObservation] = useState("");

  const [loading, setLoading] = useState(false);

  function clear() {
    setNumber("");
    setEntity("");
    setSituation("");
    setStatus("");
    setValue("0");
    setEmission(new Date());
    setDue_date(new Date());
    setObservation("");
    setClientName("");
    setClientId(null);
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

  useEffect(() => {
    if (data) {
      setClients(data);
    }
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

  function handleFindClient(id) {
    const result = clients.find((obj) => obj.id === id);
    setClientId(result.id);
    setClientName(result.name);
    setModalClient(false);
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

  function capitalizeFirstLetter(string) {
    let splited = string.split(" ");
    let toJoin = splited.map((e) => {
      return e.charAt(0).toUpperCase() + e.slice(1);
    });
    let joined = toJoin.join(" ");
    return joined;
  }

  const CustomInputPicker = ({ value, onClick }) => (
    <InputGroup>
      <Input
        focusBorderColor={config.inputs}
        value={value}
        onClick={onClick}
        w="250px"
      />
      <InputRightElement pointerEvents="none" children={<FaCalendarAlt />} />
    </InputGroup>
  );

  function onKeyDown(keyName, e, handle) {
    if (keyName === "f12") {
      register(e);
    }
  }

  async function register(e) {
    if (e) {
      e.preventDefault();
    }
    if (clientId === null) {
      handleValidator("client", "Selecione um cliente");
      return false;
    }
    if (number === "") {
      handleValidator("number", "Digite o número do cheque");
      return false;
    }
    if (situation === "") {
      handleValidator("situation", "Selecione uma opção");
      return false;
    }
    if (status === "") {
      handleValidator("status", "Selecione uma opção");
      return false;
    }
    if (value === "0") {
      handleValidator("value", "Digite um valor válido");
      return false;
    }
    setValidators([]);
    setLoading(true);
    try {
      const response = await api.post(
        "/checks",
        {
          client_id: clientId,
          number,
          entity,
          situation,
          status,
          value,
          emission,
          due_date,
          observation,
        },
        {
          headers: { "x-access-token": employee.token },
        }
      );
      setLoading(false);
      showToast(response.data.message, "success", "Sucesso");
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
        <Grid templateColumns="1fr 300px 200px" gap="15px">
          <FormControl
            isRequired
            isInvalid={
              validators.find((obj) => obj.path === "client") ? true : false
            }
          >
            <FormLabel>Selecione o Cliente</FormLabel>
            <HStack spacing={3}>
              <Input
                id="client"
                type="text"
                placeholder="Selecione o Cliente"
                focusBorderColor={config.inputs}
                isReadOnly
                value={clientName}
              />
              <Button
                leftIcon={<FaSearch />}
                colorScheme={config.buttons}
                variant="outline"
                w="110px"
                onClick={() => setModalClient(true)}
              >
                Buscar
              </Button>
            </HStack>
            <FormErrorMessage>
              {validators.find((obj) => obj.path === "client")
                ? validators.find((obj) => obj.path === "client").message
                : ""}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={
              validators.find((obj) => obj.path === "number") ? true : false
            }
          >
            <FormLabel>Número</FormLabel>
            <Input
              id="number"
              type="text"
              placeholder="Número"
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
          <FormControl>
            <FormLabel>Entidade</FormLabel>
            <Input
              type="text"
              placeholder="Entidade"
              focusBorderColor={config.inputs}
              value={entity}
              onChange={(e) => setEntity(capitalizeFirstLetter(e.target.value))}
            />
          </FormControl>
        </Grid>

        <Grid mt={3} templateColumns="repeat(5, 1fr)" gap="15px">
          <FormControl
            isRequired
            isInvalid={
              validators.find((obj) => obj.path === "situation") ? true : false
            }
          >
            <FormLabel>Situação</FormLabel>
            <Select
              id="situation"
              placeholder="Selecione"
              variant="outline"
              focusBorderColor={config.inputs}
              value={situation}
              onChange={(e) => setSituation(e.target.value)}
            >
              <option value="waiting">Aguardando</option>
              <option value="okay">Aprovado</option>
              <option value="refused">Recusado</option>
            </Select>
            <FormErrorMessage>
              {validators.find((obj) => obj.path === "situation")
                ? validators.find((obj) => obj.path === "situation").message
                : ""}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={
              validators.find((obj) => obj.path === "status") ? true : false
            }
          >
            <FormLabel>Tipo de Cheque</FormLabel>
            <Select
              id="status"
              placeholder="Selecione"
              variant="outline"
              focusBorderColor={config.inputs}
              onChange={(e) => setStatus(e.target.value)}
              value={status}
            >
              <option value="in_cash">À Vista</option>
              <option value="parceled_out">À Prazo</option>
            </Select>
            <FormErrorMessage>
              {validators.find((obj) => obj.path === "status")
                ? validators.find((obj) => obj.path === "status").message
                : ""}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={
              validators.find((obj) => obj.path === "value") ? true : false
            }
          >
            <FormLabel>Valor do Cheque</FormLabel>
            <NumberInput
              id="value"
              precision={2}
              step={0.01}
              focusBorderColor={config.inputs}
              value={value}
              onChange={(e) => setValue(e)}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <FormErrorMessage>
              {validators.find((obj) => obj.path === "value")
                ? validators.find((obj) => obj.path === "value").message
                : ""}
            </FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>Data da Emissão</FormLabel>
            <DatePicker
              selected={emission}
              onChange={(date) => setEmission(date)}
              customInput={<CustomInputPicker />}
              locale="pt_br"
              dateFormat="dd/MM/yyyy"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Vencimento</FormLabel>
            <DatePicker
              selected={due_date}
              onChange={(date) => setDue_date(date)}
              customInput={<CustomInputPicker />}
              locale="pt_br"
              dateFormat="dd/MM/yyyy"
            />
          </FormControl>
        </Grid>

        <Grid mt={3} templateColumns="1fr" gap="15px">
          <FormControl>
            <FormLabel>Observações</FormLabel>
            <Textarea
              resize="none"
              focusBorderColor={config.inputs}
              rows={2}
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
            />
          </FormControl>
        </Grid>

        <Divider mb={5} mt={5} />

        <Button
          size="lg"
          colorScheme={config.buttons}
          leftIcon={<FaSave />}
          isLoading={loading}
          onClick={() => register()}
        >
          Salvar{" "}
          <Kbd color="ButtonText" ml={3}>
            F12
          </Kbd>
        </Button>

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
      </Hotkeys>
    </>
  );
}
