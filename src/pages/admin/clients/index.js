import React, { useState, useEffect } from "react";
import {
  Grid,
  Select,
  Input,
  Button,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Switch,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useToast,
  Flex,
  Kbd,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  ModalFooter,
  Heading,
  Divider,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  ButtonGroup,
} from "@chakra-ui/react";
import config from "../../../configs/index";
import {
  FaSearch,
  FaUserFriends,
  FaMapMarkedAlt,
  FaEdit,
  FaSave,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import HeaderApp from "../../../components/headerApp";
import useFetch from "../../../hooks/useFetch";
import { useEmployee } from "../../../context/Employee";
import { MdKeyboardArrowDown } from "react-icons/md";
import axios from "axios";
import Lottie from "../../../components/lottie";
import emptyAnimation from "../../../animations/empty.json";
import searchAnimation from "../../../animations/search.json";
import sendAnimation from "../../../animations/send.json";
import MaskedInput from "react-text-mask";
import api from "../../../configs/axios";
import { mutate as mutateGlobal } from "swr";
import Hotkeys from "react-hot-keys";

export default function ListClients() {
  const toast = useToast();
  const { data, error, mutate } = useFetch("/clients");
  const { employee } = useEmployee();

  const [modalAddress, setModalAddress] = useState(false);
  const [modalInfo, setModalInfo] = useState(false);
  const [modalNewAddress, setModalNewAddress] = useState(false);
  const [clients, setClients] = useState([]);
  const [addresses, setAddresses] = useState([]);

  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [idClient, setIdClient] = useState(null);
  const [idAddress, setIdAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);

  const [newstreet, setNewStreet] = useState("");
  const [newnumber, setNewNumber] = useState("");
  const [newcomp, setNewComp] = useState("");
  const [newbairro, setNewBairro] = useState("");
  const [newcep, setNewCep] = useState("");
  const [newcity, setNewCity] = useState("");
  const [newstate, setNewState] = useState("");
  const [modeSave, setModeSave] = useState("save");
  const [search, setSearch] = useState("");
  const [advancedFind, setAdvancedFind] = useState("4");

  function clear() {
    setNewBairro("");
    setNewCep("");
    setNewCity("");
    setNewComp("");
    setNewNumber("");
    setNewState("");
    setNewStreet("");
    setModeSave("save");
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
    setClients(data);
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

  useEffect(() => {
    handleNewCep(newcep);
  }, [newcep]);

  async function handleNewCep(value) {
    const parse = value.replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, "");
    if (parse.length === 8) {
      try {
        const response = await axios.get(
          `https://brasilapi.com.br/api/cep/v1/${parse}`
        );
        setNewCity(response.data.city);
        setNewState(response.data.state);
      } catch (error) {
        if (error.message === "Network Error") {
          alert(
            "Sem conexão com o servidor, verifique sua conexão com a internet."
          );
          return false;
        }
        const err = error.response.data.errors[0].message || "CEP Inválido";
        showToast(err, "error", "Erro");
      }
    }
  }

  async function handleAddress(id) {
    setIdClient(id);
    setLoading(true);
    try {
      const response = await api.get(`/address/${id}`);
      setAddresses(response.data);
      setLoading(false);
      setModalAddress(true);
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

  async function handleAddressUpdate(id) {
    const result = await addresses.find((obj) => obj.id === id);
    setIdAddress(result.id);
    setIdClient(result.client_id);
    setNewStreet(result.street);
    setNewNumber(result.number);
    setNewComp(!result.comp ? "" : result.comp);
    setNewBairro(result.bairro);
    setNewCep(result.cep);
    setNewCity(result.city);
    setNewState(result.state);
    setModeSave("update");
    setModalNewAddress(true);
  }

  function onCloseModalNewAddress() {
    clear();
    setModalNewAddress(false);
  }

  async function setSaveAddress() {
    setLoadingAddress(true);
    try {
      if (modeSave === "save") {
        const response = await api.post(
          "/address",
          {
            client_id: idClient,
            street: newstreet,
            number: newnumber,
            comp: newcomp,
            bairro: newbairro,
            cep: newcep,
            city: newcity,
            state: newstate,
          },
          { headers: { "x-access-token": employee.token } }
        );
        let newAddresses = addresses;
        const info = {
          id: response.data.address[0].id,
          client_id: response.data.address[0].client_id,
          street: response.data.address[0].street,
          number: response.data.address[0].number,
          comp: response.data.address[0].comp,
          bairro: response.data.address[0].bairro,
          cep: response.data.address[0].cep,
          city: response.data.address[0].city,
          state: response.data.address[0].state,
        };
        newAddresses.push(info);
        setAddresses(newAddresses);
        showToast(response.data.message, "success", "Sucesso");
        setLoadingAddress(false);
        setModalNewAddress(false);
        clear();
      } else {
        const response = await api.put(
          `/address/${idAddress}`,
          {
            street: newstreet,
            number: newnumber,
            comp: newcomp,
            bairro: newbairro,
            cep: newcep,
            city: newcity,
            state: newstate,
          },
          { headers: { "x-access-token": employee.token } }
        );
        const updatedAddress = addresses.map((add) => {
          if (add.id === idAddress) {
            return {
              ...add,
              street: response.data.address[0].street,
              number: response.data.address[0].number,
              comp: response.data.address[0].comp,
              bairro: response.data.address[0].bairro,
              cep: response.data.address[0].cep,
              city: response.data.address[0].city,
              state: response.data.address[0].state,
            };
          }
          return add;
        });
        setAddresses(updatedAddress);
        showToast(response.data.message, "success", "Sucesso");
        setLoadingAddress(false);
        setModalNewAddress(false);
        clear();
      }
    } catch (error) {
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

  async function handleAddressRemove(id) {
    setLoading(true);
    try {
      const response = await api.delete(`/address/${id}`, {
        headers: { "x-access-token": employee.token },
      });
      const result = await addresses.filter((obj) => obj.id !== id);
      setAddresses(result);
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

  async function handleInfo(id) {
    const result = await clients.find((obj) => obj.id === id);
    setIdClient(result.id);
    setName(result.name);
    setCpf(result.cpf);
    setContact(result.contact);
    setEmail(result.email);
    setGender(result.gender);
    setUser(result.user);
    setModalInfo(true);
  }

  async function saveEditClient() {
    if (password === "") {
      showToast("Digite uma senha", "warning", "Atenção");
      return false;
    }
    setLoadingInfo(true);
    try {
      const response = await api.put(
        `/clients/${idClient}`,
        {
          name,
          gender,
          cpf,
          email,
          contact,
          user,
          password,
        },
        {
          headers: { "x-access-token": employee.token },
        }
      );
      const clientsUpdated = await data.map((cli) => {
        if (cli.id === idClient) {
          return {
            ...cli,
            name: response.data.client[0].name,
            gender: response.data.client[0].gender,
            cpf: response.data.client[0].cpf,
            email: response.data.client[0].email,
            contact: response.data.client[0].contact,
            user: response.data.client[0].user,
            password: response.data.client[0].password,
          };
        }
        return cli;
      });
      mutate(clientsUpdated, false);
      mutateGlobal(`/clients/${idClient}`, {
        id: idClient,
        name: response.data.client[0].name,
        gender: response.data.client[0].gender,
        cpf: response.data.client[0].cpf,
        email: response.data.client[0].email,
        contact: response.data.client[0].contact,
        user: response.data.client[0].user,
        password: response.data.client[0].password,
      });
      setLoadingInfo(false);
      setModalInfo(false);
      showToast(response.data.message, "success", "Sucesso");
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
        `/activeclient/${id}`,
        {
          active: value,
        },
        { headers: { "x-access-token": employee.token } }
      );
      const updateClients = await data.map((cli) => {
        if (cli.id === id) {
          return { ...cli, active: response.data.client[0].active };
        }
        return cli;
      });
      mutate(updateClients, false);
      mutateGlobal(`/activeclient/${id}`, {
        id: id,
        active: response.data.client[0].active,
      });
      setLoading(false);
      showToast(response.data.message, "success", "Sucesso");
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

  async function handleRestrict(value, id) {
    setLoading(true);
    try {
      const response = await api.put(
        `/restrictclient/${id}`,
        {
          restrict: value,
        },
        { headers: { "x-access-token": employee.token } }
      );
      const updateClients = await data.map((cli) => {
        if (cli.id === id) {
          return { ...cli, restrict: response.data.client[0].restrict };
        }
        return cli;
      });
      mutate(updateClients, false);
      mutateGlobal(`/restrictclient/${id}`, {
        id: id,
        restrict: response.data.client[0].restrict,
      });
      setLoading(false);
      showToast(response.data.message, "success", "Sucesso");
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

  async function finderProdBySource(text) {
    setSearch(text);
    let index;
    if (advancedFind === "1") {
      const result = await data.filter((obj) => obj.active === true);
      index = result;
    }
    if (advancedFind === "2") {
      const result = await data.filter((obj) => obj.active === false);
      index = result;
    }
    if (advancedFind === "3") {
      const result = await data.filter((obj) => obj.restrict === true);
      index = result;
    }
    if (advancedFind === "4") {
      index = data;
    }
    if (text === "") {
      await setClients(index);
    } else {
      let termos = await text.split(" ");
      let frasesFiltradas = await index.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.name.includes(termoBuscado);
        }, true);
      });
      await setClients(frasesFiltradas);
    }
  }

  function onKeyDown(keyName, e, handle) {
    if (keyName === "f3") {
      const inpt = document.getElementById("search");
      inpt.focus();
    }
  }

  async function handleSearch() {
    if (advancedFind === "1") {
      const result = await data.filter((obj) => obj.active === true);

      await setClients(result);
    }
    if (advancedFind === "2") {
      const result = await data.filter((obj) => obj.active === false);

      await setClients(result);
    }
    if (advancedFind === "3") {
      const result = await data.filter((obj) => obj.restrict === true);

      await setClients(result);
    }
    if (advancedFind === "4") {
      await setClients(data);
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
        <HeaderApp title="Gerenciar Clientes" icon={FaUserFriends} />

        <Box borderWidth="1px" shadow="md" rounded="md" p={3} mt="25px">
          <Grid templateColumns="2fr 1fr" gap="15px">
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
                  finderProdBySource(capitalizeFirstLetter(e.target.value))
                }
              />
            </FormControl>

            <FormControl>
              <FormLabel>Selecione uma opção de busca:</FormLabel>
              <Grid templateColumns="2fr 1fr" gap="15px">
                <Select
                  placeholder="Selecione uma opção de busca"
                  focusBorderColor={config.inputs}
                  value={advancedFind}
                  onChange={(e) => setAdvancedFind(e.target.value)}
                >
                  <option value="1">Todos os Ativos</option>
                  <option value="2">Todos os Bloqueados</option>
                  <option value="3">Todos os Restritos</option>
                  <option value="4">Todos os Clientes</option>
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

          {!clients ? (
            <Flex justify="center" align="center" direction="column">
              <Lottie animation={searchAnimation} height={200} width={200} />
              <Text>Buscando Informações</Text>
            </Flex>
          ) : (
            <>
              {clients.length === 0 ? (
                <Flex justify="center" align="center" direction="column">
                  <Lottie animation={emptyAnimation} height={200} width={200} />
                  <Text>Nenhum cliente para mostrar</Text>
                </Flex>
              ) : (
                <Table size="sm" mt="25px">
                  <Thead fontWeight="700">
                    <Tr>
                      <Td>Cliente</Td>
                      <Td textAlign="center" w="12%">
                        CFP
                      </Td>
                      <Td textAlign="center" w="15%">
                        Email
                      </Td>
                      <Td textAlign="center" w="12%">
                        Telefone
                      </Td>
                      <Td w="6%" textAlign="center">
                        Ativo?
                      </Td>
                      <Td w="7%" textAlign="center">
                        Restrito?
                      </Td>
                      <Td w="7%" textAlign="center"></Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {clients.map((cli) => (
                      <Tr key={cli.id}>
                        <Td>{cli.name}</Td>
                        <Td textAlign="center" w="12%">
                          {cli.cpf}
                        </Td>
                        <Td textAlign="center" w="15%">
                          {cli.email}
                        </Td>
                        <Td textAlign="center" w="12%">
                          {cli.contact}
                        </Td>
                        <Td w="6%" textAlign="center">
                          <Switch
                            colorScheme={config.switchs}
                            size="sm"
                            defaultIsChecked={cli.active}
                            onChange={(e) =>
                              handleActive(e.target.checked, cli.id)
                            }
                          />
                        </Td>
                        <Td w="7%" textAlign="center">
                          <Switch
                            colorScheme={config.switchs}
                            size="sm"
                            defaultIsChecked={cli.restrict}
                            onChange={(e) =>
                              handleRestrict(e.target.checked, cli.id)
                            }
                          />
                        </Td>
                        <Td w="7%" textAlign="center">
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
                                icon={<FaEdit />}
                                onClick={() => handleInfo(cli.id)}
                              >
                                Editar Informações
                              </MenuItem>
                              <MenuItem
                                icon={<FaMapMarkedAlt />}
                                onClick={() => handleAddress(cli.id)}
                              >
                                Visualizar Endereços
                              </MenuItem>
                            </MenuList>
                          </Menu>
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
          isOpen={modalAddress}
          isCentered
          size="xl"
          onClose={() => setModalAddress(false)}
          scrollBehavior="inside"
        >
          <ModalOverlay />
          <ModalContent maxW="60rem">
            <ModalHeader>Visualizar Endereço</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {addresses.length === 0 ? (
                <Flex justify="center" align="center" direction="column">
                  <Lottie animation={emptyAnimation} height={200} width={200} />
                  <Text>Nenhum endereço para mostrar</Text>
                </Flex>
              ) : (
                <>
                  {addresses.map((add) => (
                    <Box
                      rounded="md"
                      borderWidth="1px"
                      p={3}
                      mb={5}
                      key={add.id}
                    >
                      <Heading fontSize="xl">Endereço ID: {add.id}</Heading>
                      <Divider mt={3} mb={3} />
                      <Grid templateColumns="1fr 100px" gap="15px">
                        <FormControl id="avenue">
                          <FormLabel>Logradouro</FormLabel>
                          <Input
                            placeholder="Logradouro"
                            focusBorderColor={config.inputs}
                            isReadOnly
                            value={add.street}
                          />
                        </FormControl>
                        <FormControl id="number">
                          <FormLabel>Numero</FormLabel>
                          <Input
                            placeholder="Numero"
                            focusBorderColor={config.inputs}
                            isReadOnly
                            value={add.number}
                          />
                        </FormControl>
                      </Grid>
                      <Grid templateColumns="1fr 1fr" gap="15px" mt={3}>
                        <FormControl id="comp">
                          <FormLabel>Complemento</FormLabel>
                          <Input
                            placeholder="Complemento"
                            focusBorderColor={config.inputs}
                            isReadOnly
                            value={!add.comp ? "" : add.comp}
                          />
                        </FormControl>
                        <FormControl id="comp">
                          <FormLabel>Bairro</FormLabel>
                          <Input
                            placeholder="Complemento"
                            focusBorderColor={config.inputs}
                            isReadOnly
                            value={add.bairro}
                          />
                        </FormControl>
                      </Grid>
                      <Grid templateColumns="1fr 1fr 100px" gap="15px" mt={3}>
                        <FormControl id="cep">
                          <FormLabel>CEP</FormLabel>
                          <Input
                            placeholder="Complemento"
                            focusBorderColor={config.inputs}
                            isReadOnly
                            value={add.cep}
                          />
                        </FormControl>
                        <FormControl id="city">
                          <FormLabel>Cidade</FormLabel>
                          <Input
                            placeholder="Cidade"
                            focusBorderColor={config.inputs}
                            type="text"
                            isReadOnly
                            value={add.city}
                          />
                        </FormControl>
                        <FormControl id="uf">
                          <FormLabel>UF</FormLabel>
                          <Input
                            placeholder="UF"
                            focusBorderColor={config.inputs}
                            type="text"
                            isReadOnly
                            value={add.state}
                          />
                        </FormControl>
                      </Grid>

                      <Divider mt={3} mb={3} />

                      <Flex>
                        <Button
                          colorScheme={config.buttons}
                          leftIcon={<FaEdit />}
                          variant="outline"
                          onClick={() => handleAddressUpdate(add.id)}
                        >
                          Editar Endereço
                        </Button>
                        <Popover>
                          <PopoverTrigger>
                            <Button
                              colorScheme={config.buttons}
                              leftIcon={<FaTrash />}
                              variant="outline"
                              ml={3}
                            >
                              Excluir Endereço
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader>Confirmação!</PopoverHeader>
                            <PopoverBody>
                              Deseja remover este endereço?
                            </PopoverBody>
                            <PopoverFooter d="flex" justifyContent="flex-end">
                              <ButtonGroup size="sm">
                                <Button
                                  variant="outline"
                                  colorScheme={config.buttons}
                                >
                                  Não
                                </Button>
                                <Button
                                  colorScheme={config.buttons}
                                  onClick={() => handleAddressRemove(add.id)}
                                >
                                  Sim
                                </Button>
                              </ButtonGroup>
                            </PopoverFooter>
                          </PopoverContent>
                        </Popover>
                      </Flex>
                    </Box>
                  ))}
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme={config.buttons}
                leftIcon={<FaPlus />}
                onClick={() => setModalNewAddress(true)}
              >
                Adicionar Novo
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={modalInfo}
          isCentered
          size="xl"
          onClose={() => setModalInfo(false)}
          scrollBehavior="inside"
        >
          <ModalOverlay />
          <ModalContent maxW="60rem">
            <ModalHeader>Visualizar Informações</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Grid templateColumns="1fr 1fr 250px" gap="15px">
                <FormControl>
                  <FormLabel>Nome</FormLabel>
                  <Input
                    placeholder="Nome completo"
                    focusBorderColor={config.inputs}
                    value={name}
                    onChange={(e) =>
                      setName(capitalizeFirstLetter(e.target.value))
                    }
                    id="name"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>CPF</FormLabel>
                  <MaskedInput
                    mask={[
                      /[0-9]/,
                      /\d/,
                      /\d/,
                      ".",
                      /\d/,
                      /\d/,
                      /\d/,
                      ".",
                      /\d/,
                      /\d/,
                      /\d/,
                      "-",
                      /\d/,
                      /\d/,
                    ]}
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    placeholder="CPF"
                    id="cpf"
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
                    id="gender"
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
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    id="email"
                    placeholder="Email"
                    focusBorderColor={config.inputs}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>
                <FormControl>
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
              </Grid>

              <Grid templateColumns="1fr 1fr" gap="15px" mt={3}>
                <FormControl>
                  <FormLabel>Usuário</FormLabel>
                  <Input
                    id="user"
                    placeholder="Usuário"
                    focusBorderColor={config.inputs}
                    value={user}
                    onChange={(e) => setUser(e.target.value.toLowerCase())}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Senha</FormLabel>
                  <Input
                    id="password"
                    placeholder="Usuário"
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
                onClick={() => saveEditClient()}
              >
                Salvar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={modalNewAddress}
          onClose={() => onCloseModalNewAddress()}
          isCentered
          size="xl"
        >
          <ModalOverlay />
          <ModalContent maxW="60rem">
            <ModalHeader>Cadastrar / Editar Endereço</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Grid templateColumns="1fr 100px" gap="15px">
                <FormControl>
                  <FormLabel>Logradouro</FormLabel>
                  <Input
                    placeholder="Logradouro"
                    focusBorderColor={config.inputs}
                    value={newstreet}
                    onChange={(e) =>
                      setNewStreet(capitalizeFirstLetter(e.target.value))
                    }
                    id="street"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Numero</FormLabel>
                  <Input
                    placeholder="Numero"
                    focusBorderColor={config.inputs}
                    type="text"
                    value={newnumber}
                    onChange={(e) => setNewNumber(e.target.value.toUpperCase())}
                    id="number"
                  />
                </FormControl>
              </Grid>
              <Grid templateColumns="1fr 1fr" gap="15px" mt={3}>
                <FormControl id="comp">
                  <FormLabel>Complemento</FormLabel>
                  <Input
                    placeholder="Complemento"
                    focusBorderColor={config.inputs}
                    value={newcomp}
                    onChange={(e) =>
                      setNewComp(capitalizeFirstLetter(e.target.value))
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Bairro</FormLabel>
                  <Input
                    id="bairro"
                    placeholder="Bairro"
                    focusBorderColor={config.inputs}
                    value={newbairro}
                    onChange={(e) =>
                      setNewBairro(capitalizeFirstLetter(e.target.value))
                    }
                  />
                </FormControl>
              </Grid>
              <Grid templateColumns="1fr 1fr 100px" gap="15px" mt={3}>
                <FormControl>
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
                    value={newcep}
                    onChange={(e) => setNewCep(e.target.value)}
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
                </FormControl>
                <FormControl>
                  <FormLabel>Cidade</FormLabel>
                  <Input
                    placeholder="Cidade"
                    focusBorderColor={config.inputs}
                    type="text"
                    value={newcity}
                    onChange={(e) =>
                      setNewCity(capitalizeFirstLetter(e.target.value))
                    }
                    id="city"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>UF</FormLabel>
                  <Select
                    placeholder="Selecione"
                    variant="outline"
                    focusBorderColor={config.inputs}
                    value={newstate}
                    onChange={(e) => setNewState(e.target.value)}
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
                </FormControl>
              </Grid>
            </ModalBody>

            <ModalFooter>
              <Button
                leftIcon={<FaSave />}
                colorScheme={config.buttons}
                isLoading={loadingAddress}
                onClick={() => setSaveAddress()}
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
      </Hotkeys>
    </>
  );
}
