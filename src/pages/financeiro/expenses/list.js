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
} from "@chakra-ui/react";
import config from "../../../configs/index";
import {
  FaCalendarAlt,
  FaEdit,
  FaSave,
  FaSearch,
  FaSearchPlus,
  FaTrash,
} from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import InputMask from "react-input-mask";
import pt_br from "date-fns/locale/pt-BR";
import DatePicker, { registerLocale } from "react-datepicker";
import Lottie from "../../../components/lottie";
import emptyAnimation from "../../../animations/empty.json";
import sendAnimation from "../../../animations/send.json";
import api from "../../../configs/axios";
import * as dateFns from "date-fns";

registerLocale("pt_br", pt_br);

export default function ListExpenses() {
  const date = new Date();
  const year = date.getFullYear();
  const toast = useToast();
  const [find, setFind] = useState("1");

  const [loadingSearch, setLoadingSearch] = useState(false);

  const [modalEdit, setModalEdit] = useState(false);
  const [modalMoviment, setModalMoviment] = useState(false);
  const [modalPayment, setModalPayment] = useState(false);

  const [month, setMonth] = useState("");
  const [yearFind, setYearFind] = useState(year);
  const [initialDate, setInitialDate] = useState(new Date());
  const [finalDate, setFinalDate] = useState(new Date());
  const [expenses, setExpenses] = useState([]);
  const [idExpense, setIdExpense] = useState(null);
  const [statusExpense, setStatusExpense] = useState("");

  const [identify, setIdentify] = useState("");
  const [due_date, setDue_date] = useState(new Date());
  const [exp_value, setExp_value] = useState("");
  const [description, setDescription] = useState("");
  const [pay_form, setPay_form] = useState("");
  const [plan_account, setPlan_account] = useState("");

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom-right",
      duration: 8000,
    });
  }

  async function findExpenses() {
    setLoadingSearch(true);
    try {
      const response = await api.get(`/expenses/${find}`);
      console.log(response.data);
      setLoadingSearch(false);
      setExpenses(response.data);
    } catch (error) {
      setLoadingSearch(false);
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
    findExpenses();
  }, []);

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
    setIdentify(result.identify);
    setDue_date(new Date(result.due_date));
    setExp_value(result.value);
    setDescription(result.description);
    setPay_form(result.pay_form_name);
    setPlan_account(result.plan_accounts_name);
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

  return (
    <>
      <Grid templateColumns="1fr 1fr 200px" gap="15px">
        <Select
          placeholder="Selecione uma opção de busca"
          focusBorderColor={config.inputs}
          value={find}
          onChange={(e) => setFind(e.target.value)}
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
              value={month}
              onChange={(e) => setMonth(e.target.value)}
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
              value={yearFind}
              onChange={(e) => setYearFind(e.target.value)}
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
            <DatePicker
              selected={initialDate}
              onChange={(date) => setInitialDate(date)}
              customInput={<CustomInputPicker />}
              locale="pt_br"
              dateFormat="dd/MM/yyyy"
            />
            <Text ml={1} mr={1}>
              até
            </Text>
            <DatePicker
              selected={finalDate}
              onChange={(date) => setFinalDate(date)}
              customInput={<CustomInputPicker />}
              locale="pt_br"
              dateFormat="dd/MM/yyyy"
            />
          </Flex>
        )}

        <Button
          leftIcon={<FaSearch />}
          colorScheme={config.buttons}
          variant="outline"
          isLoading={loadingSearch}
          onClick={() => findExpenses()}
        >
          Buscar
        </Button>
      </Grid>

      {expenses.length === 0 ? (
        <Flex justify="center" align="center" direction="column">
          <Lottie animation={emptyAnimation} height={200} width={200} />
          <Text>Nenhuma Despesa para mostrar</Text>
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
                Status Movimentação
              </Td>
              <Td w="15%"></Td>
            </Tr>
          </Thead>

          <Tbody>
            {expenses.map((exp) => (
              <Tr key={exp.id}>
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
                        {(exp.status === "done" && "Concluído") ||
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
                        {(exp.movimentation === "done" && "Concluído") ||
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
                <Td w="15%">
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
                      <MenuItem icon={<FaTrash />}>Excluir</MenuItem>
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
                <Input
                  placeholder="Valor"
                  focusBorderColor={config.inputs}
                  isReadOnly
                  value={pay_form}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Plano de Contas</FormLabel>
                <Input
                  placeholder="Valor"
                  focusBorderColor={config.inputs}
                  isReadOnly
                  value={plan_account}
                />
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
            <Button colorScheme={config.buttons} leftIcon={<FaSave />}>
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
          <ModalHeader>Status da Movimentação</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Status da Movimentação</FormLabel>
              <Select
                placeholder="Selecione"
                variant="outline"
                focusBorderColor={config.inputs}
                value={statusExpense}
                onChange={(e) => setStatusExpense(e.target.value)}
              >
                <option value="waiting">Aguardando</option>
                <option value="done">Concluído</option>
                <option value="cancel">Cancelado</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme={config.buttons} leftIcon={<FaSave />}>
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
                <option value="done">Concluído</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme={config.buttons} leftIcon={<FaSave />}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
