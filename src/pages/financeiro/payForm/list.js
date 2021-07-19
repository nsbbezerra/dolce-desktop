import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Button,
  Switch,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  Grid,
  Input,
  Flex,
  Text,
  useToast,
} from "@chakra-ui/react";
import config from "../../../configs/index";
import { FaEdit, FaSave } from "react-icons/fa";
import Lottie from "../../../components/lottie";
import emptyAnimation from "../../../animations/empty.json";
import { useEmployee } from "../../../context/Employee";
import api from "../../../configs/axios";
import useFecth from "../../../hooks/useFetch";
import { mutate as mutateGlobal } from "swr";
import sendAnimation from "../../../animations/send.json";

export default function ListPayForm() {
  const { employee } = useEmployee();
  const { data, error, mutate } = useFecth("/payForm");
  const toast = useToast();

  const [modalEdit, setModalEdit] = useState(false);

  const [payForms, setPayForms] = useState([]);
  const [banks, setBanks] = useState([]);

  const [name, setName] = useState("");
  const [bank_id, setBank_Id] = useState("");
  const [status, setStatus] = useState("");
  const [max_portion, setMax_portion] = useState(0);
  const [interval_days, setInterval_days] = useState(0);
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(false);
  const [formId, setFormId] = useState(null);
  const [loadinSave, setLoadingSave] = useState(false);

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

  function capitalizeFirstLetter(string) {
    let splited = string.split(" ");
    let toJoin = splited.map((e) => {
      return e.charAt(0).toUpperCase() + e.slice(1);
    });
    let joined = toJoin.join(" ");
    return joined;
  }

  useEffect(() => {
    if (data) {
      setPayForms(data.payForms);
      setBanks(data.banks);
      console.log("PAY", data.payForms);
      console.log("BNK", data.banks);
    }
  }, [data]);

  async function handleEdit(id) {
    const result = await payForms.find((obj) => obj.id === id);
    setFormId(result.id);
    setName(result.name);
    setStatus(result.status);
    setBank_Id(result.id_bank_account);
    setMax_portion(result.max_portion);
    setInterval_days(result.interval_days);
    setType(result.type);
    setModalEdit(true);
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

  async function editInfo() {
    setLoading(true);
    try {
      const response = await api.put(
        `/payForm/${formId}`,
        {
          name,
          bank_id: parseInt(bank_id),
          max_portion: parseInt(max_portion),
          interval_days: parseInt(interval_days),
          status,
          type,
        },
        {
          headers: { "x-access-token": employee.token },
        }
      );
      const updatedPay = await data.payForms.map((pay) => {
        if (pay.id === formId) {
          return {
            ...pay,
            name: response.data.payForms[0].name,
            bank_id: response.data.payForms[0].bank_id,
            interval_days: response.data.payForms[0].interval_days,
            max_portion: response.data.payForms[0].max_portion,
            status: response.data.payForms[0].status,
            type: response.data.payForms[0].type,
          };
        }
        return pay;
      });
      const info = { banks: data.banks, payForms: updatedPay };
      mutate(info, false);
      mutateGlobal(`/payForm/${formId}`, {
        info,
      });
      setLoading(false);
      setModalEdit(false);
      showToast(response.data.message, "success", "Sucesso");
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

  async function handleShow(value, id) {
    setLoadingSave(true);
    try {
      const response = await api.put(
        `/showOnSitePayForm/${id}`,
        { show_on_site: value },
        {
          headers: { "x-access-token": employee.token },
        }
      );
      const updatedPay = data.payForms.map((pay) => {
        if (pay.id === id) {
          return {
            ...pay,
            show_on_site: response.data.payForms[0].show_on_site,
          };
        }
        return pay;
      });
      const info = { banks: data.banks, payForms: updatedPay };
      mutate(info, false);
      mutateGlobal(`/showOnSitePayForm/${id}`, {
        info,
      });
      showToast(response.data.message, "success", "Sucesso");
      setLoadingSave(false);
    } catch (error) {
      setLoadingSave(false);
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
      {payForms.length === 0 ? (
        <Flex justify="center" align="center" direction="column">
          <Lottie animation={emptyAnimation} height={200} width={200} />
          <Text>Nenhuma forma de pagamento para mostrar</Text>
        </Flex>
      ) : (
        <Table size="sm">
          <Thead fontWeight="700">
            <Tr>
              <Td>Forma de Pagamento</Td>
              <Td>Conta Bancária</Td>
              <Td>Status</Td>
              <Td>Nº Parcelas</Td>
              <Td>Intervalo</Td>
              <Td>Tipo</Td>
              <Td w="12%">Ativo no Site?</Td>
              <Td w="10%"></Td>
            </Tr>
          </Thead>
          <Tbody>
            {payForms.map((pay) => (
              <Tr key={pay.id}>
                <Td>{pay.name}</Td>
                <Td>{pay.bank}</Td>
                <Td>{pay.status === "in_cash" ? "À Vista" : "Parcelado"}</Td>
                <Td>{pay.max_portion}</Td>
                <Td>{pay.interval_days} Dias</Td>
                <Td>
                  {(pay.type === "money" && "Dinheiro") ||
                    (pay.type === "ticket" && "Boleto") ||
                    (pay.type === "credit" && "Cartão de Crédito") ||
                    (pay.type === "debit" && "Cartão de Débito") ||
                    (pay.type === "promissory" && "Duplicata") ||
                    (pay.type === "transfer" && "Transferência") ||
                    (pay.type === "check" && "Cheque")}
                </Td>
                <Td w="12%">
                  <Switch
                    colorScheme={config.switchs}
                    defaultIsChecked={pay.show_on_site}
                    size="sm"
                    onChange={(e) => handleShow(e.target.checked, pay.id)}
                  />
                </Td>
                <Td w="10%">
                  <Button
                    leftIcon={<FaEdit />}
                    size="sm"
                    colorScheme={config.buttons}
                    isFullWidth
                    onClick={() => handleEdit(pay.id)}
                  >
                    Editar
                  </Button>
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
        scrollBehavior="inside"
        size="xl"
      >
        <ModalOverlay />
        <ModalContent maxW="60rem">
          <ModalHeader>Alterar Informações</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="1fr 250px 200px" gap="15px">
              <FormControl>
                <FormLabel>Nome</FormLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="Nome"
                  focusBorderColor={config.inputs}
                  value={name}
                  onChange={(e) =>
                    setName(capitalizeFirstLetter(e.target.value))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Conta Bancária</FormLabel>

                <Select
                  id="bank"
                  placeholder="Selecione"
                  variant="outline"
                  focusBorderColor={config.inputs}
                  value={bank_id}
                  onChange={(e) => setBank_Id(e.target.value)}
                >
                  {banks.map((bnk) => (
                    <option key={bnk.id} value={bnk.id}>
                      {bnk.bank}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Status do Pagamento</FormLabel>
                <Select
                  id="status"
                  placeholder="Selecione"
                  variant="outline"
                  focusBorderColor={config.inputs}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="in_cash">À Vista</option>
                  <option value="parceled_out">Parcelado</option>
                </Select>
              </FormControl>
            </Grid>
            <Grid mt={3} templateColumns="1fr 1fr 1fr" gap="15px">
              <FormControl>
                <FormLabel>Nº max. de Parcelas</FormLabel>
                <Input
                  type="number"
                  placeholder="Nº max. de Parcelas"
                  focusBorderColor={config.inputs}
                  value={max_portion}
                  onChange={(e) => setMax_portion(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Intervalo de Dias</FormLabel>
                <Input
                  type="number"
                  placeholder="Intervalo de Dias"
                  focusBorderColor={config.inputs}
                  value={interval_days}
                  onChange={(e) => setInterval_days(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Tipo de Pagamento</FormLabel>
                <Select
                  id="type"
                  placeholder="Selecione"
                  variant="outline"
                  focusBorderColor={config.inputs}
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="money">Dinheiro</option>
                  <option value="ticket">Boleto</option>
                  <option value="credit">Cartão de Crédito</option>
                  <option value="debit">Cartão de Débito</option>
                  <option value="promissory">Duplicata</option>
                  <option value="transfer">Transferência</option>
                  <option value="check">Cheque</option>
                </Select>
              </FormControl>
            </Grid>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme={config.buttons}
              leftIcon={<FaSave />}
              isLoading={loading}
              onClick={() => editInfo()}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={loadinSave}
        isCentered
        scrollBehavior="inside"
        size="xl"
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent bg="transparent" shadow="none" overflow="hidden">
          <ModalBody overflow="hidden">
            <Flex justify="center" align="center" direction="column">
              <Lottie animation={sendAnimation} height={400} width={400} />
              <Text mt={"-60px"} fontSize="3xl">
                Aguarde...
              </Text>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
