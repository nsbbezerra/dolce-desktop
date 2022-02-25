import React, { useEffect, useState } from "react";
import {
  Grid,
  InputLeftAddon,
  InputGroup,
  Box,
  Flex,
  Text,
  Divider,
  FormControl,
  FormLabel,
  Select,
  Center,
  Heading,
  Button,
  HStack,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import config from "../configs/index";
import { FaSave } from "react-icons/fa";
import api from "../configs/axios";
import useFetch from "../hooks/useFetch";
import uniqid from "uniqid";
import { useEmployee } from "../context/Employee";

export default function PaymentMiddleware({ order, handleClose }) {
  const toast = useToast();
  const { employee } = useEmployee();
  const { data, error } = useFetch("/payFormPdv");

  const [firstPayment, setFirstPayment] = useState(0);
  const [secontPayment, setSecontPayment] = useState(0);

  const [showSecondPayment, setShowSecondPayment] = useState(false);

  const [firstInstallment, setFirtsInstallment] = useState(1);
  const [firstInstallmentList, setFirstInstallmentList] = useState([]);
  const [secondInstallment, setSecondInstallment] = useState(1);
  const [secondInstallmentList, setSecondInstallmentList] = useState([]);

  const [firstPayFormId, setFirstPayFormId] = useState(null);
  const [firstPayForm, setFirstPayForm] = useState({});
  const [secondPayFormId, setSecondPayFormId] = useState(null);
  const [secondPayForm, setSecondPayForm] = useState({});

  const [payments, setPayments] = useState([]);
  const [payForms, setPayForms] = useState([]);
  const [firstPaymentObject, setFirstPaymentObject] = useState({});
  const [secondPaymentObject, setSecondPaymentObject] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let initialInstallment = [1];
    setFirstInstallmentList(initialInstallment);
    setSecondInstallmentList(initialInstallment);
  }, []);

  useEffect(() => {
    if (JSON.stringify(order) !== "{}") {
      setFirstPayment(parseFloat(order.total_to_pay));
    }
  }, [order]);

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

  function handleFirsPayForm(id) {
    let ident = parseInt(id);
    const result = payForms.find((obj) => obj.id === ident);
    if (result.status === "parceled_out") {
      let parc = [];
      for (let index = 0; index < result.max_portion; index++) {
        parc.push(index + 1);
      }
      setFirstInstallmentList(parc);
    } else {
      setFirstInstallmentList([1]);
      setFirtsInstallment(1);
    }
    setFirstPayForm(result);
    setFirstPayFormId(result.id);
  }

  useEffect(() => {
    if (JSON.stringify(firstPayForm) !== "{}") {
      let calc = parseFloat(firstPayment) / parseInt(firstInstallment);
      let info = {
        id: uniqid(),
        pay_form_id: firstPayForm.id,
        pay_form_name: firstPayForm.name,
        pay_form_status: firstPayForm.status,
        installment_total: firstPayment,
        installment_value: parseFloat(calc.toFixed(2)),
        installment_amount: firstInstallment,
      };
      setFirstPaymentObject(info);
    }
  }, [firstInstallment, firstPayment, firstPayForm]);

  useEffect(() => {
    if (JSON.stringify(secondPayForm) !== "{}") {
      let calc = parseFloat(secontPayment) / parseInt(secondInstallment);
      let info = {
        id: uniqid(),
        pay_form_id: secondPayForm.id,
        pay_form_name: secondPayForm.name,
        pay_form_status: secondPayForm.status,
        installment_total: secontPayment,
        installment_value: parseFloat(calc.toFixed(2)),
        installment_amount: secondInstallment,
      };
      setSecondPaymentObject(info);
    }
  }, [secondInstallment, secontPayment, secondPayForm]);

  useEffect(() => {
    if (showSecondPayment) {
      if (
        JSON.stringify(firstPayForm) !== "{}" &&
        JSON.stringify(secondPayForm) === "{}"
      ) {
        let info = [firstPaymentObject];
        setPayments(info);
      }
      if (
        JSON.stringify(firstPayForm) !== "{}" &&
        JSON.stringify(secondPayForm) !== "{}"
      ) {
        let info = [firstPaymentObject, secondPaymentObject];
        setPayments(info);
      }
    } else {
      if (JSON.stringify(firstPayForm) !== "{}") {
        let info = [firstPaymentObject];
        setPayments(info);
      }
    }
  }, [firstPaymentObject, secondPaymentObject]);

  function handleSecondPayForm(id) {
    let ident = parseInt(id);
    const result = payForms.find((obj) => obj.id === ident);
    if (result.status === "parceled_out") {
      let parc = [];
      for (let index = 0; index < result.max_portion; index++) {
        parc.push(index + 1);
      }
      setSecondInstallmentList(parc);
    } else {
      setSecondInstallmentList([1]);
      setSecondInstallment(1);
    }
    setSecondPayFormId(result.id);
    setSecondPayForm(result);
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

  useEffect(() => {
    if (data) {
      setPayForms(data);
    }
  }, [data]);

  function handleFirstPayment(value) {
    let total = parseFloat(value);
    setFirstPayment(total);
    if (isNaN(total) || total === "" || !total) {
      setFirstPayment(parseFloat(order.total_to_pay));
      setShowSecondPayment(false);
      setSecontPayment(0);
    }
    if (total === parseFloat(order.total_to_pay)) {
      setShowSecondPayment(false);
      setSecontPayment(0);
      setFirstPayment(total);
    }
    if (parseFloat(value) < parseFloat(order.total_to_pay)) {
      let calc = parseFloat(order.total_to_pay) - parseFloat(value);
      setShowSecondPayment(true);
      setSecontPayment(calc);
    }
    if (parseFloat(value) > parseFloat(order.total_to_pay)) {
      setShowSecondPayment(false);
      setFirstPayment(parseFloat(order.total_to_pay));
      setSecontPayment(0);
    }
  }

  async function Store() {
    if (payments.length === 0) {
      showToast("Calcule as formas de pagamento", "warning", "Atenção");
      return false;
    }
    if (
      showSecondPayment === false &&
      JSON.stringify(firstPaymentObject) === "{}"
    ) {
      showToast("Insira uma forma de pagamento", "warning", "Atenção");
      return false;
    }
    if (
      showSecondPayment === true &&
      JSON.stringify(secondPaymentObject) === "{}"
    ) {
      showToast(
        "Calcule o pagamento secundário corretamente",
        "warning",
        "Atenção"
      );
      return false;
    }
    setLoading(true);

    try {
      const response = await api.post(
        "/payments",
        {
          order_id: order.id,
          payments: payments,
          employee_id: employee.user,
          client_id: order.client_id,
        },
        { headers: { "x-access-token": employee.token } }
      );
      setLoading(false);
      showToast(response.data.message, "success", "Sucesso");
      handleClose();
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
      <Grid templateColumns="1fr 1fr" gap="30px">
        <Box>
          <Center rounded="md" p={2} bg="rgba(160, 174, 192, 0.1)" mb={5}>
            <Heading fontSize="md">Pagamento Principal</Heading>
          </Center>
          <InputGroup size="lg" w="100%">
            <InputLeftAddon>R$</InputLeftAddon>
            <NumberInput
              precision={2}
              step={1}
              focusBorderColor={config.inputs}
              value={firstPayment}
              onChange={(e) => handleFirstPayment(e)}
              size="lg"
              w="100%"
            >
              <NumberInputField
                borderTopLeftRadius="none"
                borderBottomLeftRadius="none"
              />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </InputGroup>
          <Grid templateColumns="2fr 1fr" gap="15px" mt={3}>
            <FormControl isRequired>
              <FormLabel mb={0}>Forma de Pagamento</FormLabel>
              <Select
                placeholder="Selecione uma opção"
                focusBorderColor={config.inputs}
                size="lg"
                value={firstPayFormId}
                onChange={(e) => handleFirsPayForm(e.target.value)}
              >
                {payForms.map((pay) => (
                  <option value={pay.id} key={pay.id}>
                    {pay.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel mb={0}>Parcelas</FormLabel>
              <Select
                placeholder="Quantidade"
                focusBorderColor={config.inputs}
                size="lg"
                value={firstInstallment}
                onChange={(e) => setFirtsInstallment(parseInt(e.target.value))}
              >
                {firstInstallmentList.map((inst) => (
                  <option value={inst} key={inst}>
                    {inst}x
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {showSecondPayment ? (
            <>
              <Divider mb={5} mt={5} />

              <Center rounded="md" p={2} bg="rgba(160, 174, 192, 0.1)" mb={5}>
                <Heading fontSize="md">Pagamento Secundário</Heading>
              </Center>
              <InputGroup size="lg" w="100%">
                <InputLeftAddon>R$</InputLeftAddon>
                <NumberInput
                  precision={2}
                  step={1}
                  focusBorderColor={config.inputs}
                  value={secontPayment}
                  isReadOnly
                  size="lg"
                  w="100%"
                >
                  <NumberInputField
                    borderTopLeftRadius="none"
                    borderBottomLeftRadius="none"
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </InputGroup>
              <Grid templateColumns="2fr 1fr" gap="15px" mt={3}>
                <FormControl isRequired>
                  <FormLabel mb={0}>Forma de Pagamento</FormLabel>
                  <Select
                    placeholder="Selecione uma opção"
                    focusBorderColor={config.inputs}
                    size="lg"
                    value={secondPayFormId}
                    onChange={(e) => handleSecondPayForm(e.target.value)}
                  >
                    {payForms.map((pay) => (
                      <option value={pay.id} key={pay.id}>
                        {pay.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel mb={0}>Parcelas</FormLabel>
                  <Select
                    placeholder="Quantidade"
                    focusBorderColor={config.inputs}
                    size="lg"
                    value={secondInstallment}
                    onChange={(e) =>
                      setSecondInstallment(parseInt(e.target.value))
                    }
                  >
                    {secondInstallmentList.map((inst) => (
                      <option value={inst} key={inst}>
                        {inst}x
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </>
          ) : (
            ""
          )}
        </Box>
        <Box>
          <Center rounded="md" p={2} bg="rgba(160, 174, 192, 0.1)" mb={5}>
            <Heading fontSize="md">Resumo</Heading>
          </Center>
          <Box borderWidth="1px" rounded="md">
            <Flex p={3} align="center" justify="space-between" h={10}>
              <Text>Valor Total</Text>
              <Text fontWeight="700">
                {JSON.stringify(order) === "{}"
                  ? 0
                  : parseFloat(order.grand_total).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
              </Text>
            </Flex>
            <Divider />
            <Flex p={3} align="center" justify="space-between" h={10}>
              <Text>Desconto</Text>
              <Text fontWeight="700">
                {JSON.stringify(order) === "{}"
                  ? 0
                  : `${parseFloat(order.discount)}%`}
              </Text>
            </Flex>
            <Divider />
            <Flex p={3} align="center" justify="space-between" h={10}>
              <Text>Total a Pagar</Text>
              <Text fontWeight="700">
                {JSON.stringify(order) === "{}"
                  ? 0
                  : parseFloat(order.total_to_pay).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
              </Text>
            </Flex>
          </Box>

          {payments.length === 0 ? (
            ""
          ) : (
            <Box borderWidth="1px" rounded="md" mt={5}>
              {payments.map((pay) => (
                <Grid
                  templateColumns="1fr 1fr 1fr"
                  gap="10px"
                  p={2}
                  key={pay.id}
                >
                  <Text>{pay.pay_form_name}</Text>
                  <Text fontWeight="700" w="100%" textAlign="center">
                    {parseFloat(pay.installment_total).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </Text>
                  <Text w="100%" textAlign="right">
                    {pay.installment_amount}x de{" "}
                    {parseFloat(pay.installment_value).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </Text>
                </Grid>
              ))}
            </Box>
          )}
        </Box>
      </Grid>

      <Flex justify="flex-end" mt={5}>
        <HStack spacing={3}>
          <Button
            leftIcon={<FaSave />}
            colorScheme={config.buttons}
            isDisabled={payments.length === 0 ? true : false}
            isLoading={loading}
            onClick={() => Store()}
          >
            Salvar
          </Button>
        </HStack>
      </Flex>
    </>
  );
}
