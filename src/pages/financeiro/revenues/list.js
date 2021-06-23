import React, { useEffect, useState } from "react";
import {
  Grid,
  Select,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  InputGroup,
  InputRightElement,
  Flex,
  Text,
  useToast,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import config from "../../../configs/index";
import {
  FaCalendarAlt,
  FaEdit,
  FaSave,
  FaSearchPlus,
  FaTrash,
} from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import pt_br from "date-fns/locale/pt-BR";
import DatePicker, { registerLocale } from "react-datepicker";
import Lottie from "../../../components/lottie";
import emptyAnimation from "../../../animations/empty.json";
import api from "../../../configs/axios";
import * as dateFns from "date-fns";
import { useEmployee } from "../../../context/Employee";
import { mutate as mutateGlobal } from "swr";
import useFetch from "../../../hooks/useFetch";

registerLocale("pt_br", pt_br);

export default function ListRevenues() {
  const date = new Date();
  const year = date.getFullYear();
  const toast = useToast();
  const { employee } = useEmployee();
  const [find, setFind] = useState("1");
  const [initialDate, setInitialDate] = useState("0");
  const [finalDate, setFinalDate] = useState("0");

  const { data, mutate, error } = useFetch(
    `/revenues/${find}/${initialDate}/${finalDate}`
  );

  const [modalMoviment, setModalMoviment] = useState(false);
  const [modalPayment, setModalPayment] = useState(false);

  const [modalEdit, setModalEdit] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [idExpense, setIdExpense] = useState(null);
  const [statusExpense, setStatusExpense] = useState("");
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  const [identify, setIdentify] = useState("");
  const [due_date, setDue_date] = useState(new Date());
  const [exp_value, setExp_value] = useState("");
  const [description, setDescription] = useState("");
  const [pay_form, setPay_form] = useState("");
  const [plan_account, setPlan_account] = useState("");

  const [payForms, setPayForms] = useState([]);
  const [planAccounts, setPlanAccounts] = useState([]);

  const [confirm, setConfirm] = useState(false);

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

  async function findDependents() {
    try {
      const response = await api.get("/revenuesDependets");
      setPayForms(response.data.payForm);
      setPlanAccounts(response.data.planAccounts);
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

  useEffect(() => {
    findDependents();
  }, []);

  useEffect(() => {
    if (data) {
      setExpenses(data);
    }
  }, [data]);

  function handleUpdateStatus(type, id, info) {
    if (type === "status") {
      setIdExpense(id);
      setStatusExpense(info);
      setModalPayment(true);
    } else {
      setIdExpense(id);
      setStatusExpense(info);
      setModalMoviment(true);
    }
  }

  function handleEdit(id) {
    const result = expenses.find((obj) => obj.id === id);
    setIdExpense(id);
    setIdentify(result.identify);
    setDue_date(new Date(result.due_date));
    setExp_value(result.value);
    setDescription(result.description);
    setPay_form(result.pay_form_id);
    setPlan_account(result.plan_accounts_id);
    setModalEdit(true);
  }

  function capitalizeAllFirstLetter(string) {
    let splited = string.split(" ");
    let toJoin = splited.map((e) => {
      return e.charAt(0).toUpperCase() + e.slice(1);
    });
    let joined = toJoin.join(" ");
    return joined;
  }

  async function sendUpdateStatus() {
    setLoadingUpdate(true);

    try {
      const response = await api.put(
        `/revenueChangeStatus/${idExpense}`,
        { status: statusExpense },
        {
          headers: { "x-access-token": employee.token },
        }
      );
      const updated = await expenses.map((exp) => {
        if (exp.id === idExpense) {
          return { ...exp, status: response.data.expense[0].status };
        }
        return exp;
      });
      mutate(updated, false);
      mutateGlobal(`/revenueChangeStatus/${idExpense}`, {
        id: idExpense,
        status: response.data.expense[0].status,
      });
      setLoadingUpdate(false);
      setModalPayment(false);
      showToast("Informações alteradas com sucesso", "success", "Sucesso");
    } catch (error) {
      setLoadingUpdate(false);
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

  async function sendUpdateMovimentation() {
    setLoadingUpdate(true);

    try {
      const response = await api.put(
        `/revenueChangeMovimentation/${idExpense}`,
        { movimentation: statusExpense },
        {
          headers: { "x-access-token": employee.token },
        }
      );
      const updated = await expenses.map((exp) => {
        if (exp.id === idExpense) {
          return {
            ...exp,
            movimentation: response.data.expense[0].movimentation,
          };
        }
        return exp;
      });
      mutate(updated, false);
      mutateGlobal(`/revenueChangeMovimentation/${idExpense}`, {
        id: idExpense,
        movimentation: response.data.expense[0].movimentation,
      });
      setLoadingUpdate(false);
      setModalMoviment(false);
      showToast("Informações alteradas com sucesso", "success", "Sucesso");
    } catch (error) {
      setLoadingUpdate(false);
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

  async function sendUpdateInfo() {
    setLoadingUpdate(true);

    try {
      const response = await api.put(
        `/revenues/${idExpense}`,
        {
          payForm_id: pay_form,
          planAccounts_id: plan_account,
          identify: identify,
          due_date: due_date,
          value: exp_value,
          description: description,
        },
        { headers: { "x-access-token": employee.token } }
      );
      const updated = await expenses.map((exp) => {
        if (exp.id === idExpense) {
          return {
            ...exp,
            identify: response.data.expense[0].identify,
            due_date: response.data.expense[0].due_date,
            value: response.data.expense[0].value,
            description: response.data.expense[0].description,
            pay_form_id: response.data.expense[0].payForm_id,
            plan_accounts_id: response.data.expense[0].planAccounts_id,
          };
        }
        return exp;
      });
      mutate(updated, false);
      mutateGlobal(`/revenues/${idExpense}`, {
        id: idExpense,
        identify: response.data.expense[0].identify,
        due_date: response.data.expense[0].due_date,
        value: response.data.expense[0].value,
        description: response.data.expense[0].description,
        pay_form_id: response.data.expense[0].payForm_id,
        plan_accounts_id: response.data.expense[0].planAccounts_id,
      });
      setLoadingUpdate(false);
      setModalEdit(false);
      showToast("Informações alteradas com sucesso", "success", "Sucesso");
    } catch (error) {
      setLoadingUpdate(false);
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

  function handleFind(key) {
    if (key === "1") {
      setFind(key);
      setInitialDate(new Date());
      setFinalDate(new Date());
    }
    if (key === "2") {
      setInitialDate(
        new Date().toLocaleString("pt-BR", { month: "long" }).toString()
      );
      setFinalDate(new Date().getFullYear().toString());
      setFind(key);
    }
    if (key === "3") {
      setInitialDate(new Date());
      setFinalDate(new Date());
      setFind(key);
    }
  }

  function handleDelete(id) {
    setIdExpense(id);
    setConfirm(true);
  }

  async function sendDelExpense() {
    setLoadingUpdate(true);
    try {
      const response = await api.delete(`/revenues/${idExpense}`, {
        headers: { "x-access-token": employee.token },
      });
      const updated = await expenses.filter((obj) => obj.id !== idExpense);
      setExpenses(updated);
      showToast(response.data.message, "success", "Sucesso");
      setConfirm(false);
    } catch (error) {
      setLoadingUpdate(false);
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
      <Text mb={2}>Selecione uma opção de busca:</Text>
      <Grid templateColumns="1fr 1fr" gap="15px">
        <Select
          placeholder="Selecione uma opção de busca"
          focusBorderColor={config.inputs}
          value={find}
          onChange={(e) => handleFind(e.target.value)}
        >
          <option value={"1"}>Mês Atual</option>
          <option value={"2"}>Por Período</option>
          <option value={"3"}>Por Intervalo</option>
        </Select>

        {find === "1" && (
          <Input
            type="text"
            placeholder="Digite para buscar"
            focusBorderColor={config.inputs}
            isReadOnly
            isDisabled
          />
        )}

        {find === "2" && (
          <Grid templateColumns="1fr 1fr" gap="15px">
            <Select
              placeholder="Selecione um Mês"
              focusBorderColor={config.inputs}
              value={initialDate}
              onChange={(e) => setInitialDate(e.target.value)}
            >
              <option value="janeiro">Janeiro</option>
              <option value="fevereiro">Fevereiro</option>
              <option value="março">Março</option>
              <option value="abril">Abril</option>
              <option value="maio">Maio</option>
              <option value="junho">Junho</option>
              <option value="julho">Julho</option>
              <option value="agosto">Agosto</option>
              <option value="setembro">Setembro</option>
              <option value="outubro">Outubro</option>
              <option value="novembro">Novembro</option>
              <option value="dezembro">Dezembro</option>
            </Select>
            <Select
              placeholder="Selecione um Ano"
              focusBorderColor={config.inputs}
              value={finalDate}
              onChange={(e) => setFinalDate(e.target.value.toString())}
            >
              <option value={year - 1}>{year - 1}</option>
              <option value={year}>{year}</option>
              <option value={year + 1}>{year + 1}</option>
            </Select>
          </Grid>
        )}

        {find === "3" && (
          <Flex justify="space-around" align="center">
            <Text mr={1}>De:</Text>
            <div className="customDatePickerWidth">
              <DatePicker
                selected={initialDate}
                onChange={(date) => setInitialDate(date)}
                customInput={<CustomInputPicker />}
                locale="pt_br"
                dateFormat="dd/MM/yyyy"
              />
            </div>
            <Text ml={1} mr={1}>
              até
            </Text>
            <div className="customDatePickerWidth">
              <DatePicker
                selected={finalDate}
                onChange={(date) => setFinalDate(date)}
                customInput={<CustomInputPicker />}
                locale="pt_br"
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </Flex>
        )}
      </Grid>

      {expenses.length === 0 ? (
        <Flex justify="center" align="center" direction="column">
          <Lottie animation={emptyAnimation} height={200} width={200} />
          <Text>Nenhuma Receita para mostrar</Text>
        </Flex>
      ) : (
        <Table size="sm" mt="25px">
          <Thead fontWeight="700">
            <Tr>
              <Td>Identificação</Td>
              <Td w="10%" textAlign="center">
                Vencimento
              </Td>
              <Td w="12%" isNumeric>
                Valor
              </Td>
              <Td w="15%" textAlign="center">
                Status Pagamento
              </Td>
              <Td w="15%" textAlign="center">
                Autorização
              </Td>
              <Td w="10%"></Td>
            </Tr>
          </Thead>

          <Tbody>
            {expenses.map((exp) => (
              <Tr
                key={exp.id}
                bg={
                  exp.status === "waiting" &&
                  dateFns.isBefore(new Date(exp.due_date), new Date())
                    ? "rgba(255, 215, 214, .2)"
                    : ""
                }
              >
                <Td>{exp.identify}</Td>
                <Td w="10%" textAlign="center">
                  {dateFns.format(new Date(exp.due_date), "dd/MM/yyyy")}
                </Td>
                <Td w="12%" isNumeric>
                  {parseFloat(exp.value).toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </Td>
                <Td w="15%" textAlign="center">
                  <Flex align="center" justify="center">
                    {
                      <Text
                        fontWeight="700"
                        color={
                          (exp.status === "done" && "green.500") ||
                          (exp.status === "cancel" && "red.500") ||
                          (exp.status === "waiting" && "yellow.500")
                        }
                      >
                        {(exp.status === "done" && "Pago") ||
                          (exp.status === "cancel" && "Cancelado") ||
                          (exp.status === "waiting" && "Aguardando")}
                      </Text>
                    }{" "}
                    <Tooltip label="Clique aqui para alterar" hasArrow>
                      <IconButton
                        size="xs"
                        colorScheme={config.buttons}
                        icon={<FaEdit />}
                        ml={2}
                        onClick={() =>
                          handleUpdateStatus("status", exp.id, exp.status)
                        }
                        variant="outline"
                        rounded="full"
                      />
                    </Tooltip>
                  </Flex>
                </Td>
                <Td w="15%" textAlign="center">
                  <Flex align="center" justify="center">
                    {
                      <Text
                        fontWeight="700"
                        color={
                          (exp.movimentation === "done" && "green.500") ||
                          (exp.movimentation === "cancel" && "red.500") ||
                          (exp.movimentation === "waiting" && "yellow.500")
                        }
                      >
                        {(exp.movimentation === "done" && "Confirmado") ||
                          (exp.movimentation === "cancel" && "Cancelado") ||
                          (exp.movimentation === "waiting" && "Aguardando")}
                      </Text>
                    }{" "}
                    <Tooltip label="Clique aqui para alterar" hasArrow>
                      <IconButton
                        size="xs"
                        colorScheme={config.buttons}
                        icon={<FaEdit />}
                        ml={2}
                        onClick={() =>
                          handleUpdateStatus(
                            "movimentation",
                            exp.id,
                            exp.movimentation
                          )
                        }
                        variant="outline"
                        rounded="full"
                      />
                    </Tooltip>
                  </Flex>
                </Td>
                <Td w="10%">
                  <Menu>
                    <MenuButton
                      isFullWidth
                      as={Button}
                      rightIcon={<MdKeyboardArrowDown />}
                      size="sm"
                      colorScheme={config.buttons}
                    >
                      Opções
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        icon={<FaSearchPlus />}
                        onClick={() => handleEdit(exp.id)}
                      >
                        Visualizar e Editar
                      </MenuItem>
                      <MenuItem
                        icon={<FaTrash />}
                        onClick={() => handleDelete(exp.id)}
                      >
                        Excluir
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Modal
        isOpen={modalEdit}
        onClose={() => setModalEdit(false)}
        isCentered
        size="xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Informações</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid mt={3} templateColumns="1fr" gap="15px">
              <FormControl>
                <FormLabel>Identificação</FormLabel>
                <Input
                  type="text"
                  placeholder="Identificação"
                  focusBorderColor={config.inputs}
                  value={identify}
                  onChange={(e) =>
                    setIdentify(capitalizeAllFirstLetter(e.target.value))
                  }
                />
              </FormControl>
            </Grid>

            <Grid mt={3} templateColumns="repeat(2, 1fr)" gap="15px">
              <FormControl>
                <FormLabel>Vencimento</FormLabel>
                <div className="customDatePickerWidth">
                  <DatePicker
                    selected={due_date}
                    onChange={(date) => setDue_date(date)}
                    customInput={<CustomInputPicker />}
                    locale="pt_br"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
              </FormControl>
              <FormControl>
                <FormLabel>Valor</FormLabel>
                <NumberInput
                  precision={2}
                  step={0.01}
                  focusBorderColor={config.inputs}
                  value={exp_value}
                  onChange={(e) => setExp_value(e)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </Grid>

            <Grid mt={3} templateColumns="repeat(2, 1fr)" gap="15px">
              <FormControl>
                <FormLabel>Forma de Pagamento</FormLabel>
                <Select
                  placeholder="Selecione uma opção"
                  focusBorderColor={config.inputs}
                  value={pay_form}
                  onChange={(e) => setPay_form(e.target.value)}
                >
                  {payForms.map((pay) => (
                    <option value={pay.id} key={pay.id}>
                      {pay.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Plano de Contas</FormLabel>
                <Select
                  placeholder="Selecione uma opção"
                  focusBorderColor={config.inputs}
                  value={plan_account}
                  onChange={(e) => setPlan_account(e.target.value)}
                >
                  {planAccounts.map((plan) => (
                    <option value={plan.id} key={plan.id}>
                      {plan.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid templateColumns="1fr" gap="15px" mt={3}>
              <FormControl>
                <FormLabel>Descrição</FormLabel>
                <Textarea
                  resize="none"
                  focusBorderColor={config.inputs}
                  placeholder="Descrição"
                  rows={3}
                  value={description}
                  onChange={(e) =>
                    setDescription(capitalizeAllFirstLetter(e.target.value))
                  }
                />
              </FormControl>
            </Grid>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme={config.buttons}
              leftIcon={<FaSave />}
              isLoading={loadingUpdate}
              onClick={() => sendUpdateInfo()}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalMoviment}
        onClose={() => setModalMoviment(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Autorização</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Autorização</FormLabel>
              <Select
                placeholder="Selecione"
                variant="outline"
                focusBorderColor={config.inputs}
                value={statusExpense}
                onChange={(e) => setStatusExpense(e.target.value)}
              >
                <option value="waiting">Aguardando</option>
                <option value="done">Confirmado</option>
                <option value="cancel">Cancelado</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme={config.buttons}
              leftIcon={<FaSave />}
              isLoading={loadingUpdate}
              onClick={() => sendUpdateMovimentation()}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalPayment}
        onClose={() => setModalPayment(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Status do Pagamento</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Status do Pagamento</FormLabel>
              <Select
                placeholder="Selecione"
                variant="outline"
                focusBorderColor={config.inputs}
                value={statusExpense}
                onChange={(e) => setStatusExpense(e.target.value)}
              >
                <option value="cancel">Cancelado</option>
                <option value="waiting">Aguardando</option>
                <option value="done">Pago</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme={config.buttons}
              leftIcon={<FaSave />}
              isLoading={loadingUpdate}
              onClick={() => sendUpdateStatus()}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={confirm}
        onClose={() => setConfirm(false)}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Excluir Receita
            </AlertDialogHeader>

            <AlertDialogBody>Deseja excluir esta receita?</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                onClick={() => setConfirm(false)}
                variant="outline"
                colorScheme={config.buttons}
              >
                Não
              </Button>
              <Button
                ml={3}
                colorScheme={config.buttons}
                isLoading={loadingUpdate}
                onClick={() => sendDelExpense()}
              >
                Sim
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
