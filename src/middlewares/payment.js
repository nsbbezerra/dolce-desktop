import React, { useEffect, useState } from "react";
import {
  Grid,
  InputLeftAddon,
  InputGroup,
  Input,
  InputRightAddon,
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
} from "@chakra-ui/react";
import config from "../configs/index";
import { FaSave, FaCalculator } from "react-icons/fa";
import api from "../configs/axios";
import useFetch from "../hooks/useFetch";

export default function PaymentMiddleware({ order }) {
  const toast = useToast();
  const { data, error } = useFetch("/payFormPdv");
  console.log(order);

  const [firstPayment, setFirstPayment] = useState(0);
  const [secontPayment, setSecontPayment] = useState(0);

  const [showSecondPayment, setShowSecondPayment] = useState(false);
  const [calculatePayment, setCalculatePayment] = useState(false);

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
      console.log(data);
    }
  }, [data]);

  function handleFirstPayment(value) {
    let total = parseFloat(value);
    setFirstPayment(total);
    if (isNaN(total) || total === "" || !total) {
      setFirstPayment(parseFloat(order.grand_total));
      setShowSecondPayment(false);
      setSecontPayment(0);
    }
    if (total === parseFloat(order.grand_total)) {
      setShowSecondPayment(false);
      setSecontPayment(0);
      setFirstPayment(total);
    }
    if (parseFloat(value) < parseFloat(order.grand_total)) {
      let calc = parseFloat(order.grand_total) - parseFloat(value);
      setShowSecondPayment(true);
      setSecontPayment(calc);
    }
    if (parseFloat(value) > parseFloat(order.grand_total)) {
      setShowSecondPayment(false);
      setFirstPayment(parseFloat(order.grand_total));
      setSecontPayment(0);
    }
  }

  return (
    <>
      <Grid templateColumns="1fr 1fr" gap="30px">
        <Box>
          <Center rounded="md" p={2} bg="rgba(160, 174, 192, 0.1)" mb={5}>
            <Heading fontSize="md">Pagamento Principal</Heading>
          </Center>
          <InputGroup size="lg">
            <InputLeftAddon>Valor</InputLeftAddon>
            <Input
              focusBorderColor={config.inputs}
              type="number"
              value={firstPayment}
              onChange={(e) => handleFirstPayment(e.target.value)}
            />
            <InputRightAddon>R$</InputRightAddon>
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
              <InputGroup size="lg">
                <InputLeftAddon>Valor</InputLeftAddon>
                <Input
                  focusBorderColor={config.inputs}
                  isReadOnly
                  value={secontPayment}
                />
                <InputRightAddon>R$</InputRightAddon>
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
              <Grid templateColumns="2fr 1fr 1fr" gap="10px" p={2}>
                <Text>Dinheiro</Text>
                <Text fontWeight="700">R$ 200,00</Text>
                <Text>3x de R$100,00</Text>
              </Grid>
              <Grid templateColumns="2fr 1fr 1fr" gap="10px" p={2}>
                <Text>Dinheiro</Text>
                <Text fontWeight="700">R$ 200,00</Text>
                <Text>3x de R$100,00</Text>
              </Grid>
            </Box>
          )}
        </Box>
      </Grid>

      <Flex justify="flex-end" mt={5}>
        <HStack spacing={3}>
          <Button
            leftIcon={<FaCalculator />}
            colorScheme={config.buttons}
            variant="outline"
          >
            Calcular Pagamento
          </Button>
          <Button
            leftIcon={<FaSave />}
            colorScheme={config.buttons}
            isDisabled={payments.length === 0 ? true : false}
          >
            Salvar
          </Button>
        </HStack>
      </Flex>
    </>
  );
}
