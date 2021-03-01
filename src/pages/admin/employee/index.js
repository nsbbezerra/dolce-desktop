import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Select,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Switch,
  HStack,
  FormControl,
  FormLabel,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  useToast,
  Flex,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import config from "../../../configs/index";
import { FaIdCard, FaSearchPlus, FaSave } from "react-icons/fa";
import HeaderApp from "../../../components/headerApp";
import InputMask from "react-input-mask";
import { useEmployee } from "../../../context/Employee";
import useFetch from "../../../hooks/useFetch";
import { mutate as mutateGlobal } from "swr";
import Lottie from "../../../components/lottie";
import emptyAnimation from "../../../animations/empty.json";
import searchAnimation from "../../../animations/search.json";
import sendAnimation from "../../../animations/send.json";
import api from "../../../configs/axios";
import MaskedInput from "react-text-mask";

export default function ListEmployee() {
  const { data, error, mutate } = useFetch("/employee");
  const { employee } = useEmployee();
  const toast = useToast();

  const [modalEdit, setModalEdit] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comissionValue, setComissionValue] = useState("");
  const [comissionStatus, setComissionStatus] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const [modalComission, setModalComission] = useState(false);
  const [loadingComission, setLoadingComission] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [gender, setGender] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [loadingInfo, setLoadingInfo] = useState(false);

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom-right",
      duration: 8000,
    });
  }

  useEffect(() => {
    console.log(data);
    setEmployees(data);
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

  function capitalizeFirstLetter(string) {
    let splited = string.split(" ");
    let toJoin = splited.map((e) => {
      return e.charAt(0).toUpperCase() + e.slice(1);
    });
    let joined = toJoin.join(" ");
    return joined;
  }

  async function handlePermission(value, id, field) {
    if (value === false) {
      setEmployees(data);
      return false;
    }
    let total;
    let cashier;
    let pdv;
    if (field === "admin") {
      total = true;
      cashier = false;
      pdv = false;
    }
    if (field === "sales") {
      total = false;
      cashier = false;
      pdv = true;
    }
    if (field === "cashier") {
      total = false;
      cashier = true;
      pdv = false;
    }
    setLoading(true);
    try {
      const response = await api.put(
        `/geremployee/${id}`,
        {
          admin: total,
          sales: pdv,
          caixa: cashier,
        },
        { headers: { "x-access-token": employee.token } }
      );
      const employeeUpdated = await data.map((emp) => {
        if (emp.id === id) {
          return {
            ...emp,
            admin: response.data.employee[0].admin,
            sales: response.data.employee[0].sales,
            caixa: response.data.employee[0].caixa,
          };
        }
        return emp;
      });

      mutate(employeeUpdated, false);
      mutateGlobal(`/geremployee/${id}`, {
        id: id,
        admin: response.data.employee[0].admin,
        sales: response.data.employee[0].sales,
        caixa: response.data.employee[0].caixa,
      });
      showToast(response.data.message, "success", "Sucesso");
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
  }

  async function handleComission(value, id) {
    const result = await employees.find((obj) => obj.id === id);
    setEmployeeId(result.id);
    setComissionStatus(value);
    setModalComission(true);
  }

  async function saveComission() {
    setModalComission(false);
    setLoadingComission(true);
    try {
      const response = await api.put(
        `/comission/${employeeId}`,
        {
          comission: comissionValue,
          comissioned: comissionStatus,
        },
        { headers: { "x-access-token": employee.token } }
      );
      const updatedEmployee = await data.map((emp) => {
        if (emp.id === employeeId) {
          return {
            ...emp,
            comission: response.data.employee[0].comission,
            comissioned: response.data.employee[0].comissioned,
          };
        }
        return emp;
      });
      mutate(updatedEmployee, false);
      mutateGlobal(`/comission/${employeeId}`, {
        id: employeeId,
        comission: response.data.employee[0].comission,
        comissioned: response.data.employee[0].comissioned,
      });
      showToast(response.data.message, "success", "Sucesso");
      setLoadingComission(false);
      setModalComission(false);
    } catch (error) {
      setLoadingComission(false);
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
  }

  async function handleInfo(id) {
    const result = await employees.find((obj) => obj.id === id);
    setEmployeeId(result.id);
    setName(result.name);
    setGender(result.gender);
    setContact(result.contact);
    setUser(result.user);
    setModalEdit(true);
  }

  async function saveUpdateEmployee() {
    if (password === "") {
      showToast("Insira uma nova senha", "warning", "Atenção");
      return false;
    }
    setLoadingInfo(true);
    try {
      const response = await api.put(
        `/employee/${employeeId}`,
        {
          name,
          gender,
          contact,
          password,
          user,
        },
        {
          headers: { "x-access-token": employee.token },
        }
      );
      const updatedEmployee = await data.map((emp) => {
        if (emp.id === employeeId) {
          return {
            ...emp,
            name: response.data.employee[0].name,
            gender: response.data.employee[0].gender,
            contact: response.data.employee[0].contact,
            user: response.data.employee[0].user,
          };
        }
        return emp;
      });
      mutate(updatedEmployee, false);
      mutateGlobal(`/employee/${employeeId}`, {
        id: employeeId,
        name: response.data.employee[0].name,
        gender: response.data.employee[0].gender,
        contact: response.data.employee[0].contact,
        user: response.data.employee[0].user,
      });
      setModalEdit(false);
      showToast(response.data.message, "success", "Sucesso");
      setLoadingInfo(false);
    } catch (error) {
      setLoadingInfo(false);
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
  }

  async function handleActive(value, id) {
    setLoading(true);
    try {
      const response = await api.put(
        `/employeeact/${id}`,
        {
          active: value,
        },
        {
          headers: { "x-access-token": employee.token },
        }
      );
      const updatedEmployee = await data.map((emp) => {
        if (emp.id === id) {
          return { ...emp, active: value };
        }
        return emp;
      });
      mutate(updatedEmployee, false);
      mutateGlobal(`/employeeact/${id}`, {
        id: id,
        active: value,
      });
      showToast(response.data.message, "success", "Sucesso");
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
  }

  return (
    <>
      <HeaderApp title="Gerenciar Colaboradores" icon={FaIdCard} />

      <Box borderWidth="1px" shadow="md" rounded="md" p={3} mt="25px">
        {!employees ? (
          <Flex justify="center" align="center" direction="column">
            <Lottie animation={searchAnimation} height={200} width={200} />
            <Text>Buscando Informações</Text>
          </Flex>
        ) : (
          <>
            {employees.length === 0 ? (
              <Flex justify="center" align="center" direction="column">
                <Lottie animation={emptyAnimation} height={200} width={200} />
                <Text>Nenhum colaborador para mostrar</Text>
              </Flex>
            ) : (
              <Table size="sm">
                <Thead fontWeight="700">
                  <Tr>
                    <Td>Colaborador</Td>
                    <Td w="12%" textAlign="center">
                      Contato
                    </Td>
                    <Td w="6%" textAlign="center">
                      Ativo?
                    </Td>
                    <Td w="7%" textAlign="center">
                      Comissionado?
                    </Td>
                    <Td w="6%" textAlign="center" isNumeric>
                      Porcentagem
                    </Td>
                    <Td w="20%" textAlign="center">
                      Permissões
                    </Td>
                    <Td w="13%"></Td>
                  </Tr>
                </Thead>
                <Tbody>
                  {employees.map((emp) => (
                    <Tr key={emp.id}>
                      <Td>{emp.name}</Td>
                      <Td w="12%" textAlign="center">
                        {emp.contact}
                      </Td>
                      <Td w="6%" textAlign="center">
                        <Switch
                          colorScheme={config.switchs}
                          size="sm"
                          defaultIsChecked={emp.active}
                          onChange={(e) =>
                            handleActive(e.target.checked, emp.id)
                          }
                        />
                      </Td>
                      <Td w="7%" textAlign="center">
                        <Switch
                          colorScheme={config.switchs}
                          size="sm"
                          defaultIsChecked={emp.comissioned}
                          onChange={(e) =>
                            handleComission(e.target.checked, emp.id)
                          }
                        />
                      </Td>
                      <Td w="6%" textAlign="center" isNumeric>
                        {emp.comission} %
                      </Td>
                      <Td w="20%" textAlign="center">
                        <HStack>
                          <FormControl display="flex" alignItems="center">
                            <FormLabel
                              htmlFor="email-alerts"
                              mb="0"
                              fontSize="sm"
                            >
                              Total:
                            </FormLabel>
                            <Switch
                              id="email-alerts"
                              colorScheme={config.switchs}
                              size="sm"
                              isChecked={emp.admin}
                              onChange={(e) =>
                                handlePermission(
                                  e.target.checked,
                                  emp.id,
                                  "admin"
                                )
                              }
                            />
                          </FormControl>
                          <FormControl display="flex" alignItems="center">
                            <FormLabel
                              htmlFor="email-alerts"
                              mb="0"
                              fontSize="sm"
                            >
                              Vendas:
                            </FormLabel>
                            <Switch
                              id="email-alerts"
                              colorScheme={config.switchs}
                              size="sm"
                              isChecked={emp.sales}
                              onChange={(e) =>
                                handlePermission(
                                  e.target.checked,
                                  emp.id,
                                  "sales"
                                )
                              }
                            />
                          </FormControl>
                          <FormControl display="flex" alignItems="center">
                            <FormLabel
                              htmlFor="email-alerts"
                              mb="0"
                              fontSize="sm"
                            >
                              Caixa:
                            </FormLabel>
                            <Switch
                              id="email-alerts"
                              colorScheme={config.switchs}
                              size="sm"
                              isChecked={emp.caixa}
                              onChange={(e) =>
                                handlePermission(
                                  e.target.checked,
                                  emp.id,
                                  "cashier"
                                )
                              }
                            />
                          </FormControl>
                        </HStack>
                      </Td>
                      <Td w="13%">
                        <Button
                          size="sm"
                          colorScheme={config.buttons}
                          leftIcon={<FaSearchPlus />}
                          isFullWidth
                          onClick={() => handleInfo(emp.id)}
                        >
                          Visualizar e Editar
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </>
        )}
      </Box>

      <Modal
        isOpen={modalEdit}
        isCentered
        size="xl"
        onClose={() => setModalEdit(false)}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Informação do Colaborador</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={5}>
            <Grid templateColumns="1fr" gap="15px">
              <FormControl id="avenue">
                <FormLabel>Nome</FormLabel>
                <Input
                  placeholder="Nome"
                  focusBorderColor={config.inputs}
                  value={name}
                  onChange={(e) =>
                    setName(capitalizeFirstLetter(e.target.value))
                  }
                />
              </FormControl>
            </Grid>
            <Grid templateColumns="1fr 1fr" gap="15px" mt={3}>
              <FormControl id="phone">
                <FormLabel>Telefone</FormLabel>
                <MaskedInput
                  mask={[
                    "(",
                    /[0-9]/,
                    /\d/,
                    ")",
                    " ",
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                    "-",
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                  ]}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Telefone"
                  id="contact"
                  render={(ref, props) => (
                    <Input
                      ref={ref}
                      {...props}
                      focusBorderColor={config.inputs}
                    />
                  )}
                />
              </FormControl>
              <FormControl id="gender">
                <FormLabel>Genero</FormLabel>
                <Select
                  placeholder="Selecione"
                  variant="outline"
                  focusBorderColor={config.inputs}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="masc">Masculino</option>
                  <option value="fem">Femenino</option>
                </Select>
              </FormControl>
            </Grid>

            <Grid templateColumns="1fr 1fr" gap="15px" mt={3}>
              <FormControl id="phone">
                <FormLabel>Usuário</FormLabel>
                <Input
                  placeholder="Usuário"
                  focusBorderColor={config.inputs}
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                />
              </FormControl>
              <FormControl id="gender">
                <FormLabel>Senha</FormLabel>
                <Input
                  placeholder="Senha"
                  type="password"
                  focusBorderColor={config.inputs}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button
              leftIcon={<FaSave />}
              colorScheme={config.buttons}
              isLoading={loadingInfo}
              onClick={() => saveUpdateEmployee()}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalComission}
        onClose={() => setModalComission(false)}
        isCentered
        scrollBehavior="inside"
        size="sm"
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Porcentagem da Comissão</ModalHeader>
          <ModalBody>
            <FormControl>
              <NumberInput
                id="lenght"
                precision={2}
                step={0.01}
                focusBorderColor={config.inputs}
                value={comissionValue}
                onChange={(e) => setComissionValue(e)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme={config.buttons}
              leftIcon={<FaSave />}
              onClick={() => saveComission()}
              isLoading={loadingComission}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={loading}
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
