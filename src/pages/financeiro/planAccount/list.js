import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Button,
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
  Text,
  Tag,
  Kbd,
  useToast,
  Flex,
  Switch,
} from "@chakra-ui/react";
import { FaSave, FaSearch, FaEdit } from "react-icons/fa";
import config from "../../../configs/index";
import MaskedInput from "react-text-mask";
import { useEmployee } from "../../../context/Employee";
import api from "../../../configs/axios";
import useFecth from "../../../hooks/useFetch";
import Lottie from "../../../components/lottie";
import emptyAnimation from "../../../animations/empty.json";
import searchAnimation from "../../../animations/search.json";
import { mutate as mutateGlobal } from "swr";
import Hotkeys from "react-hot-keys";
import sendAnimation from "../../../animations/send.json";

export default function ListPlanAccount() {
  const toast = useToast();
  const { employee } = useEmployee();
  const { data, error, mutate } = useFecth("/planAccount");

  const [modalMov, setModalMov] = useState(false);
  const [plans, setPlans] = useState([]);

  const [type, setType] = useState("");
  const [identification, setIdentification] = useState("");
  const [idPlan, setIdPlan] = useState(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);

  const [search, setSearch] = useState("");
  const [numberSearch, setNumberSearch] = useState("");

  const initialRef = useRef();

  useEffect(() => {
    maskSelect(identification);
  }, [identification]);

  useEffect(() => {
    setPlans(data);
  }, [data]);

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom-right",
      duration: 8000,
    });
  }

  function capitalizeAllFirstLetter(string) {
    let splited = string.split(" ");
    let toJoin = splited.map((e) => {
      return e.charAt(0).toUpperCase() + e.slice(1);
    });
    let joined = toJoin.join(" ");
    return joined;
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

  function maskSelect(item) {
    var filt = item.substr(0, 1);
    if (filt === "1") {
      setType("credit");
    }
    if (filt === "2") {
      setType("debit");
    }
    if (
      filt === "3" ||
      filt === "4" ||
      filt === "5" ||
      filt === "6" ||
      filt === "7" ||
      filt === "8" ||
      filt === "9" ||
      filt === "0"
    ) {
      setIdentification("");
      setType("");
    }
  }

  async function handlePlan(id) {
    const result = await plans.find((obj) => obj.id === id);
    setIdPlan(result.id);
    setIdentification(result.plan);
    setName(result.name);
    setType(result.mode);
    setModalMov(true);
  }

  async function saveChanges() {
    if (identification.includes("_")) {
      showToast("Insira um plano de contas válido", "warning", "Atenção");
      return false;
    }
    if (name === "") {
      showToast("Insira um nome", "warning", "Atenção");
      return false;
    }
    setLoading(true);
    try {
      const response = await api.put(
        `/planAccount/${idPlan}`,
        {
          plan: identification,
          name,
          mode: type,
        },
        {
          headers: { "x-access-token": employee.token },
        }
      );
      const updatedPlans = await data.map((pln) => {
        if (pln.id === idPlan) {
          return {
            ...pln,
            mode: response.data.plans[0].mode,
            name: response.data.plans[0].name,
            plan: response.data.plans[0].plan,
          };
        }
        return pln;
      });

      mutate(updatedPlans, false);
      mutateGlobal(`/planAccount/${idPlan}`, {
        id: idPlan,
        mode: response.data.plans[0].mode,
        name: response.data.plans[0].name,
        plan: response.data.plans[0].plan,
      });
      setLoading(false);
      setModalMov(false);
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
      const inpt = document.getElementById("search");
      inpt.focus();
    }
  }

  async function finderPlanBySource(text) {
    setSearch(text);
    if (text === "") {
      await setPlans(data);
    } else {
      let termos = await text.split(" ");
      let frasesFiltradas = await data.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.name.includes(termoBuscado);
        }, true);
      });
      await setPlans(frasesFiltradas);
    }
  }

  async function handleSearch() {
    if (numberSearch === "1") {
      setPlans(data);
    }

    if (numberSearch === "2") {
      const restul = await data.filter((obj) => obj.active === true);
      setPlans(restul);
    }

    if (numberSearch === "3") {
      const restul = await data.filter((obj) => obj.active === false);
      setPlans(restul);
    }
  }

  async function handleActive(value, id) {
    setLoadingSend(true);
    try {
      const response = await api.put(
        `/planAccountActive/${id}`,
        { active: value },
        { headers: { "x-access-token": employee.token } }
      );
      const updatedPlans = await data.map((pln) => {
        if (pln.id === id) {
          return { ...pln, active: response.data.plans[0].active };
        }
        return pln;
      });
      mutate(updatedPlans, false);
      mutateGlobal(`/planAccountActive/${id}`, {
        id: id,
        active: response.data.plans[0].active,
      });
      setLoadingSend(false);
    } catch (error) {
      setLoadingSend(false);
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
        keyName="f3"
        onKeyDown={onKeyDown}
        allowRepeat
        filter={(event) => {
          return true;
        }}
      >
        <Grid templateColumns="1fr 1fr" gap="15px">
          <FormControl>
            <FormLabel>
              Digite para buscar <Kbd ml={3}>F3</Kbd>
            </FormLabel>
            <Input
              id="search"
              type="text"
              placeholder="Digite para buscar"
              focusBorderColor={config.inputs}
              value={search}
              onChange={(e) =>
                finderPlanBySource(capitalizeAllFirstLetter(e.target.value))
              }
            />
          </FormControl>

          <FormControl>
            <FormLabel>Selecione uma opção:</FormLabel>
            <Grid templateColumns="2fr 1fr" gap="15px">
              <Select
                placeholder="Selecione uma opção de busca"
                focusBorderColor={config.inputs}
                value={numberSearch}
                onChange={(e) => setNumberSearch(e.target.value)}
              >
                <option value="1">Todas as contas</option>
                <option value="2">Buscar ativas</option>
                <option value="3">Buscar bloqueadas</option>
              </Select>

              <Button
                leftIcon={<FaSearch />}
                colorScheme={config.buttons}
                variant="outline"
                onClick={() => handleSearch()}
              >
                Buscar
              </Button>
            </Grid>
          </FormControl>
        </Grid>

        {!plans ? (
          <Flex justify="center" align="center" direction="column">
            <Lottie animation={searchAnimation} height={200} width={200} />
            <Text>Buscando Informações</Text>
          </Flex>
        ) : (
          <>
            {plans.length === 0 ? (
              <Flex justify="center" align="center" direction="column">
                <Lottie animation={emptyAnimation} height={200} width={200} />
                <Text>Nenhum plano de contas para mostrar</Text>
              </Flex>
            ) : (
              <Table size="sm" mt="25px">
                <Thead fontWeight="700">
                  <Tr>
                    <Td textAlign="center" w="5%">
                      Ativo?
                    </Td>
                    <Td w="18%">Identificação</Td>
                    <Td>Plano de Contas</Td>
                    <Td textAlign="center" w="20%">
                      Tipo de Movimentação
                    </Td>
                    <Td w="5%"></Td>
                  </Tr>
                </Thead>
                <Tbody>
                  {plans.map((pln) => (
                    <Tr key={pln.id}>
                      <Td textAlign="center" w="5%">
                        <Switch
                          colorScheme={config.switchs}
                          size="sm"
                          defaultIsChecked={pln.active}
                          onChange={(e) =>
                            handleActive(e.target.checked, pln.id)
                          }
                        />
                      </Td>
                      <Td w="18%">{pln.plan}</Td>
                      <Td>{pln.name}</Td>
                      <Td textAlign="center" w="20%">
                        <Tag
                          colorScheme={pln.mode === "debit" ? "red" : "green"}
                        >
                          {pln.mode === "debit" ? "Despesa" : "Receita"}
                        </Tag>
                      </Td>
                      <Td w="5%">
                        <Button
                          colorScheme={config.buttons}
                          size="sm"
                          leftIcon={<FaEdit />}
                          isFullWidth
                          onClick={() => handlePlan(pln.id)}
                        >
                          Editar
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </>
        )}

        <Modal
          isOpen={modalMov}
          onClose={() => setModalMov(false)}
          isCentered
          size="xl"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Editar Plano de Contas</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Grid templateColumns="1fr" gap="15px" mb={3}>
                <FormControl>
                  <FormLabel>Nome</FormLabel>
                  <Input
                    type="text"
                    placeholder="Nome"
                    focusBorderColor={config.inputs}
                    ref={initialRef}
                    value={name}
                    onChange={(e) =>
                      setName(capitalizeAllFirstLetter(e.target.value))
                    }
                  />
                </FormControl>
              </Grid>
              <Grid templateColumns="1fr 1fr" gap="15px">
                <FormControl>
                  <FormLabel>Plano de Contas</FormLabel>
                  <MaskedInput
                    mask={[/[0-9]/, ".", /\d/, ".", /\d/, /\d/]}
                    value={identification}
                    onChange={(e) => setIdentification(e.target.value)}
                    placeholder="Plano de Contas"
                    id="identification"
                    render={(ref, props) => (
                      <Input
                        ref={ref}
                        {...props}
                        focusBorderColor={config.inputs}
                      />
                    )}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Tipo de Movimentação</FormLabel>
                  <Select
                    placeholder="Selecione"
                    variant="outline"
                    focusBorderColor={config.inputs}
                    value={type}
                    isReadOnly
                  >
                    <option value="credit">Receita</option>
                    <option value="debit">Despesa</option>
                  </Select>
                </FormControl>
              </Grid>
              <Text fontSize="sm" color="red.400" mt={5}>
                As identificações dos Plano de Contas devem seguir uma regra:
                Inicie com o número (1) todas as RECEITAS; Inicie com o número
                (2) todas as DESPESAS
              </Text>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme={config.buttons}
                leftIcon={<FaSave />}
                isLoading={loading}
                onClick={() => saveChanges()}
              >
                Salvar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={loadingSend}
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
      </Hotkeys>
    </>
  );
}
