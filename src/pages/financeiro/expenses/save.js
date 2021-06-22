import React, { useEffect, useRef, useState } from "react";
import {
  Grid,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Button,
  Select,
  Textarea,
  Divider,
  InputGroup,
  InputRightElement,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  SkeletonText,
  IconButton,
  Tooltip,
  Text,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormErrorMessage,
  Kbd,
} from "@chakra-ui/react";
import config from "../../../configs/index";
import { FaCalendarAlt, FaCheck, FaSave, FaSearch } from "react-icons/fa";
import pt_br from "date-fns/locale/pt-BR";
import DatePicker, { registerLocale } from "react-datepicker";
import Hotkeys from "react-hot-keys";
import useFetch from "../../../hooks/useFetch";
import Lottie from "../../../components/lottie";
import emptyAnimation from "../../../animations/empty.json";
import api from "../../../configs/axios";
import { useEmployee } from "../../../context/Employee";

registerLocale("pt_br", pt_br);

export default function SaveExpenses() {
  const { data, error } = useFetch("/expensesDependets");
  const toast = useToast();
  const initialRef = useRef();
  const { employee } = useEmployee();

  const [vencimento, setVencimento] = useState(new Date());
  const [payForm, setPayForm] = useState([]);
  const [planAccount, setPlanAccount] = useState([]);
  const [modalPayForm, setModalPayForm] = useState(false);
  const [modalPlanAccount, setModalPlanAccount] = useState(false);
  const [loading, setLoading] = useState(false);

  const [findPayForm, setFindPayForm] = useState("");
  const [findPlanAccounts, setFindPlanAccounts] = useState("");

  const [idPayForm, setIdPayForm] = useState(null);
  const [payformname, setPayFormName] = useState("");
  const [idPlanAccounts, setIdPlanAccounts] = useState(null);
  const [planAccountsName, setPlanAccountsName] = useState("");

  const [identify, setIdentify] = useState("");
  const [value, setValue] = useState("0");
  const [status, setStatus] = useState("");
  const [movimentation, setMovimentation] = useState("");
  const [description, setDescription] = useState("");
  const [validators, setValidators] = useState([]);

  const CustomInputPicker = ({ value, onClick }) => (
    <InputGroup>
      <Input
        focusBorderColor={config.inputs}
        value={value}
        onClick={onClick}
        w="100%"
      />
      <InputRightElement pointerEvents="none" children={<FaCalendarAlt />} />
    </InputGroup>
  );

  function clear() {
    setIdPayForm(null);
    setPayFormName("");
    setIdPlanAccounts(null);
    setPlanAccountsName("");
    setIdentify("");
    setValue("0");
    setStatus("");
    setMovimentation("");
    setDescription("");
    setValidators([]);
  }

  function handleValidator(path, message) {
    let val = [];
    let info = { path: path, message: message };
    val.push(info);
    setValidators(val);
    const inpt = document.getElementById(path);
    inpt.focus();
  }

  useEffect(() => {
    if (data) {
      setPlanAccount(data.planAccounts);
      setPayForm(data.payForm);
    }
  }, [data]);

  async function finderPayFormBySource(text) {
    setFindPayForm(text);
    if (text === "") {
      await setPayForm(data.payForm);
    } else {
      let termos = await text.split(" ");
      let frasesFiltradas = await data.payForm.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.name.includes(termoBuscado);
        }, true);
      });
      await setPayForm(frasesFiltradas);
    }
  }

  async function finderPlanAccountsBySource(text) {
    setFindPlanAccounts(text);
    if (text === "") {
      await setPlanAccount(data.planAccounts);
    } else {
      let termos = await text.split(" ");
      let frasesFiltradas = await data.planAccounts.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.name.includes(termoBuscado);
        }, true);
      });
      await setPlanAccount(frasesFiltradas);
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

  function handlePayForm(id) {
    const result = data.payForm.find((obj) => obj.id === id);
    setIdPayForm(id);
    setPayFormName(result.name);
    setModalPayForm(false);
  }

  function handlePlanAccount(id) {
    const result = data.planAccounts.find((obj) => obj.id === id);
    setIdPlanAccounts(id);
    setPlanAccountsName(result.name);
    setModalPlanAccount(false);
  }

  async function register(e) {
    if (e) {
      e.preventDefault();
    }
    if (idPayForm === null) {
      handleValidator("payform", "Selecione uma forma de pagamento");
      return false;
    }
    if (idPlanAccounts === null) {
      handleValidator("planaccount", "Selecione um plano de contas");
      return false;
    }
    if (identify === "") {
      handleValidator("identify", "Digite uma identificação");
      return false;
    }
    if (status === "") {
      handleValidator("status", "Selecione um status para a despesa");
      return false;
    }
    if (movimentation === "") {
      handleValidator(
        "movimentation",
        "Selecione ums movimentação para a despesa"
      );
      return false;
    }
    setValidators([]);
    setLoading(true);
    try {
      const response = await api.post(
        "/expenses",
        {
          payForm_id: idPayForm,
          planAccounts_id: idPlanAccounts,
          identify,
          due_date: new Date(vencimento),
          value,
          status,
          movimentation,
          description,
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

  function onKeyDown(keyName, e, handle) {
    if (keyName === "f12") {
      register(e);
    }
    if (keyName === "f3") {
      setModalPayForm(true);
    }
    if (keyName === "f4") {
      setModalPlanAccount(true);
    }
  }

  return (
    <>
      <Hotkeys
        keyName="f3, f4, f12"
        onKeyDown={onKeyDown}
        allowRepeat
        filter={(event) => {
          return true;
        }}
      >
        <Grid templateColumns="repeat(2, 1fr)" gap="15px">
          <FormControl
            isRequired
            isInvalid={
              validators.find((obj) => obj.path === "payform") ? true : false
            }
          >
            <FormLabel>
              Forma de Pagamento <Kbd>F3</Kbd>
            </FormLabel>
            <HStack spacing={3}>
              <Input
                id="payform"
                type="text"
                placeholder="Forma de Pagamento"
                focusBorderColor={config.inputs}
                isReadOnly
                value={payformname}
              />
              <Button
                leftIcon={<FaSearch />}
                colorScheme={config.buttons}
                variant="outline"
                w="110px"
                onClick={() => setModalPayForm(true)}
              >
                Buscar
              </Button>
            </HStack>
            <FormErrorMessage>
              {validators.find((obj) => obj.path === "payform")
                ? validators.find((obj) => obj.path === "payform").message
                : ""}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={
              validators.find((obj) => obj.path === "planaccount")
                ? true
                : false
            }
          >
            <FormLabel>
              Plano de Contas <Kbd>F4</Kbd>
            </FormLabel>
            <HStack spacing={3}>
              <Input
                id="planaccount"
                type="text"
                placeholder="Plano de Contas"
                focusBorderColor={config.inputs}
                isReadOnly
                value={planAccountsName}
              />
              <Button
                leftIcon={<FaSearch />}
                colorScheme={config.buttons}
                variant="outline"
                w="110px"
                onClick={() => setModalPlanAccount(true)}
              >
                Buscar
              </Button>
            </HStack>
            <FormErrorMessage>
              {validators.find((obj) => obj.path === "planaccount")
                ? validators.find((obj) => obj.path === "planaccount").message
                : ""}
            </FormErrorMessage>
          </FormControl>
        </Grid>

        <Grid mt={3} templateColumns="1fr 200px 200px" gap="15px">
          <FormControl
            isRequired
            isInvalid={
              validators.find((obj) => obj.path === "identify") ? true : false
            }
          >
            <FormLabel>Identificação</FormLabel>
            <Input
              id="identify"
              type="text"
              placeholder="Identificação"
              focusBorderColor={config.inputs}
              value={identify}
              onChange={(e) =>
                setIdentify(capitalizeFirstLetter(e.target.value))
              }
            />
            <FormErrorMessage>
              {validators.find((obj) => obj.path === "identify")
                ? validators.find((obj) => obj.path === "identify").message
                : ""}
            </FormErrorMessage>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Vencimento</FormLabel>
            <DatePicker
              selected={vencimento}
              onChange={(date) => setVencimento(date)}
              customInput={<CustomInputPicker />}
              locale="pt_br"
              dateFormat="dd/MM/yyyy"
            />
          </FormControl>
          <FormControl
            isRequired
            isInvalid={
              validators.find((obj) => obj.path === "value") ? true : false
            }
          >
            <FormLabel>Valor</FormLabel>
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
        </Grid>

        <Grid mt={3} templateColumns="1fr 1fr" gap="15px">
          <FormControl
            isRequired
            isInvalid={
              validators.find((obj) => obj.path === "status") ? true : false
            }
          >
            <FormLabel>Status do Pagamento</FormLabel>
            <Select
              id="status"
              placeholder="Selecione"
              variant="outline"
              focusBorderColor={config.inputs}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="cancel">Cancelado</option>
              <option value="waiting">Aguardando</option>
              <option value="done">Pago</option>
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
              validators.find((obj) => obj.path === "movimentation")
                ? true
                : false
            }
          >
            <FormLabel>Status da Movimentação</FormLabel>
            <Select
              id="movimentation"
              placeholder="Selecione"
              variant="outline"
              focusBorderColor={config.inputs}
              value={movimentation}
              onChange={(e) => setMovimentation(e.target.value)}
            >
              <option value="waiting">Aguardando</option>
              <option value="done">Confirmado</option>
              <option value="cancel">Cancelado</option>
            </Select>
            <FormErrorMessage>
              {validators.find((obj) => obj.path === "movimentation")
                ? validators.find((obj) => obj.path === "movimentation").message
                : ""}
            </FormErrorMessage>
          </FormControl>
        </Grid>

        <Grid templateColumns="1fr" gap="15px" mt={3}>
          <FormControl>
            <FormLabel>Descrição</FormLabel>
            <Textarea
              resize="none"
              focusBorderColor={config.inputs}
              placeholder="Descrição"
              rows={2}
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
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
          Salvar
          <Kbd ml={3} color="ButtonText">
            F12
          </Kbd>
        </Button>

        <Modal
          isOpen={modalPayForm}
          onClose={() => setModalPayForm(false)}
          size="xl"
          isCentered
          scrollBehavior="inside"
          initialFocusRef={initialRef}
        >
          <ModalOverlay />
          <ModalContent maxW="50rem">
            <ModalHeader>Buscar Forma de Pagamento</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={5}>
              <Input
                ref={initialRef}
                placeholder="Digite um nome para buscar"
                focusBorderColor={config.inputs}
                value={findPayForm}
                onChange={(e) =>
                  finderPayFormBySource(capitalizeFirstLetter(e.target.value))
                }
              />
              {payForm ? (
                <>
                  {payForm.length === 0 ? (
                    <Flex justify="center" align="center" direction="column">
                      <Lottie
                        animation={emptyAnimation}
                        height={200}
                        width={200}
                      />
                      <Text>Nenhuma Forma de Pagamento para mostrar</Text>
                    </Flex>
                  ) : (
                    <Table size="sm" mt={5}>
                      <Thead fontWeight="700">
                        <Tr>
                          <Td>Nome</Td>
                          <Td w="10%">Ações</Td>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {payForm && (
                          <>
                            {payForm.map((client) => (
                              <Tr key={client.id}>
                                <Td>{client.name}</Td>
                                <Td w="10%" textAlign="center">
                                  <Tooltip
                                    label="Selecionar Forma de Pagamento"
                                    hasArrow
                                  >
                                    <IconButton
                                      aria-label="Search database"
                                      icon={<FaCheck />}
                                      size="xs"
                                      isRound
                                      colorScheme={config.buttons}
                                      onClick={() => handlePayForm(client.id)}
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

        <Modal
          isOpen={modalPlanAccount}
          onClose={() => setModalPlanAccount(false)}
          size="xl"
          isCentered
          scrollBehavior="inside"
          initialFocusRef={initialRef}
        >
          <ModalOverlay />
          <ModalContent maxW="50rem">
            <ModalHeader>Buscar Plano de Contas</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={5}>
              <Input
                ref={initialRef}
                placeholder="Digite um nome para buscar"
                focusBorderColor={config.inputs}
                value={findPlanAccounts}
                onChange={(e) =>
                  finderPlanAccountsBySource(
                    capitalizeFirstLetter(e.target.value)
                  )
                }
              />
              {planAccount ? (
                <>
                  {planAccount.length === 0 ? (
                    <Flex justify="center" align="center" direction="column">
                      <Lottie
                        animation={emptyAnimation}
                        height={200}
                        width={200}
                      />
                      <Text>Nenhum Plano de Contas para mostrar</Text>
                    </Flex>
                  ) : (
                    <Table size="sm" mt={5}>
                      <Thead fontWeight="700">
                        <Tr>
                          <Td>Nome</Td>
                          <Td w="10%">Ações</Td>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {planAccount && (
                          <>
                            {planAccount.map((client) => (
                              <Tr key={client.id}>
                                <Td>{client.name}</Td>
                                <Td w="10%" textAlign="center">
                                  <Tooltip
                                    label="Selecionar Plano de Contas"
                                    hasArrow
                                  >
                                    <IconButton
                                      aria-label="Search database"
                                      icon={<FaCheck />}
                                      size="xs"
                                      isRound
                                      colorScheme={config.buttons}
                                      onClick={() =>
                                        handlePlanAccount(client.id)
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
