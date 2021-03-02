import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  useToast,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Kbd,
  Image,
  Switch,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormErrorMessage,
  Select,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  useColorMode,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { FaEdit, FaImage, FaSave, FaShippingFast } from "react-icons/fa";
import HeaderApp from "../../../components/headerApp";
import useFetch from "../../../hooks/useFetch";
import { useEmployee } from "../../../context/Employee";
import config from "../../../configs/index";
import Lottie from "../../../components/lottie";
import emptyAnimation from "../../../animations/empty.json";
import searchAnimation from "../../../animations/search.json";
import sendAnimation from "../../../animations/send.json";
import { MdKeyboardArrowDown } from "react-icons/md";
import MaskedInput from "react-text-mask";
import axios from "axios";
import api from "../../../configs/axios";
import { mutate as mutateGlobal } from "swr";
import { InputFile, File } from "../../../style/uploader";
import { AiOutlineClose } from "react-icons/ai";
import Hotkeys from "react-hot-keys";

export default function ListProviders() {
  const toast = useToast();
  const { employee } = useEmployee();
  const { data, error, mutate } = useFetch("/providers");
  const { colorMode } = useColorMode();

  const [providers, setProviders] = useState([]);
  const [modalInfo, setModalInfo] = useState(false);
  const [validators, setValidators] = useState([]);

  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [comp, setComp] = useState("");
  const [district, setDistrict] = useState("");
  const [cep, setCep] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);
  const [typeContact, setTypeContact] = useState("1");
  const [providerId, setProviderId] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [modalImage, setModalImage] = useState(false);
  const [url, setUrl] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [findProvider, setFindProvider] = useState("");

  async function finderProviderBySource(text) {
    setFindProvider(text);
    if (text === "") {
      await setProviders(data);
    } else {
      let termos = await text.split(" ");
      let frasesFiltradas = await providers.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.name.includes(termoBuscado);
        }, true);
      });
      await setProviders(frasesFiltradas);
    }
  }

  function handleValidator(path, message) {
    let val = [];
    let info = { path: path, message: message };
    val.push(info);
    setValidators(val);
    if (path !== "image") {
      const inpt = document.getElementById(path);
      inpt.focus();
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
    console.log(data);
    setProviders(data);
  }, [data]);

  useEffect(() => {
    handleCep(cep);
  }, [cep]);

  const previewThumbnail = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  async function removeThumbnail() {
    await URL.revokeObjectURL(thumbnail);
    setThumbnail(null);
    setValidators([]);
  }

  async function handleCep(value) {
    const parse = value.replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, "");
    if (parse.length === 8) {
      try {
        const response = await axios.get(
          `https://brasilapi.com.br/api/cep/v1/${parse}`
        );
        setValidators([]);
        setCity(response.data.city);
        setState(response.data.state);
      } catch (error) {
        if (error.message === "Network Error") {
          alert(
            "Sem conexão com o servidor, verifique sua conexão com a internet."
          );
          return false;
        }
        const err = error.response.data.errors[0].message || "CEP Inválido";
        handleValidator("cep", err);
      }
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

  async function handleProviderInfo(id) {
    const result = await providers.find((obj) => obj.id === id);
    setProviderId(result.id);
    setName(result.name);
    setCnpj(result.cnpj);
    setContact(result.contact);
    if (result.contact.length > 14) {
      setTypeContact("2");
    } else {
      setTypeContact("1");
    }
    setEmail(result.email);
    setStreet(result.street);
    setNumber(result.number);
    setComp(!result.comp ? "" : result.comp);
    setCep(result.cep);
    setCity(result.city);
    setState(result.state);
    setDistrict(result.district);
    setModalInfo(true);
  }

  async function saveProvider() {
    setLoading(true);
    try {
      const response = await api.put(
        `/providers/${providerId}`,
        {
          name,
          cnpj,
          contact,
          email,
          street,
          number,
          comp,
          district,
          cep,
          city,
          state,
        },
        { headers: { "x-access-token": employee.token } }
      );

      const updatedProvider = await data.map((prov) => {
        if (prov.id === providerId) {
          return {
            ...prov,
            name,
            cnpj,
            contact,
            email,
            street,
            number,
            comp,
            district,
            cep,
            city,
            state,
          };
        }
        return prov;
      });

      mutate(updatedProvider, false);
      mutateGlobal(`/providers/${providerId}`, {
        id: providerId,
        name,
        cnpj,
        contact,
        email,
        street,
        number,
        comp,
        district,
        cep,
        city,
        state,
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

  async function handleActive(value, id) {
    setModalLoading(true);
    try {
      const response = await api.put(
        `/providerActive/${id}`,
        {
          active: value,
        },
        {
          headers: { "x-access-token": employee.token },
        }
      );
      const updatedProvider = await data.map((prov) => {
        if (prov.id === id) {
          return { ...prov, active: value };
        }
        return prov;
      });
      mutate(updatedProvider, false);
      mutateGlobal(`/providerActive/${id}`, {
        id: id,
        active: value,
      });
      showToast(response.data.message, "success", "Sucesso");
      setModalLoading(false);
    } catch (error) {
      setModalLoading(false);
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

  async function handleImage(id) {
    const result = await providers.find((obj) => obj.id === id);
    setProviderId(result.id);
    setUrl(result.thumbnail);
    setModalImage(true);
  }

  async function handelUpdateImage() {
    setLoadingImage(true);
    try {
      let dataImage = new FormData();
      dataImage.append("thumbnail", thumbnail);
      const response = await api.put(
        `/changeProviderImage/${providerId}`,
        dataImage,
        { headers: { "x-access-token": employee.token } }
      );
      const updatedProvider = await data.map((prov) => {
        if (prov.id === providerId) {
          return {
            ...prov,
            thumbnail: response.data.url,
            blobName: response.data.blobName,
          };
        }
        return prov;
      });
      mutate(updatedProvider, false);
      mutateGlobal(`/changeProviderImage/${providerId}`, {
        id: providerId,
        thumbnail: response.data.url,
        blobName: response.data.blobName,
      });
      showToast(response.data.message, "success", "Sucesso");
      setLoadingImage(false);
      setModalImage(false);
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

  function onKeyDown(keyName, e, handle) {
    if (keyName === "f3") {
      const inpt = document.getElementById("search");
      inpt.focus();
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
        <HeaderApp title="Gerenciar Fornecedores" icon={FaShippingFast} />
        <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
          <FormControl>
            <FormLabel>
              Digite para buscar <Kbd ml={3}>F3</Kbd>
            </FormLabel>
            <Input
              id="search"
              focusBorderColor={config.inputs}
              value={findProvider}
              placeholder="Digite para buscar"
              onChange={(e) =>
                finderProviderBySource(capitalizeFirstLetter(e.target.value))
              }
            />
          </FormControl>

          {!providers ? (
            <Flex justify="center" align="center" direction="column">
              <Lottie animation={searchAnimation} height={200} width={200} />
              <Text>Buscando Informações</Text>
            </Flex>
          ) : (
            <>
              {providers.length === 0 ? (
                <Flex justify="center" align="center" direction="column">
                  <Lottie animation={emptyAnimation} height={200} width={200} />
                  <Text>Nenhum fornecedor para mostrar</Text>
                </Flex>
              ) : (
                <Table size="sm" mt={5}>
                  <Thead>
                    <Tr fontWeight="700">
                      <Td w="5%" textAlign="center"></Td>
                      <Td w="7%" textAlign="center">
                        Ativo?
                      </Td>
                      <Td w="25%">Fornecedor</Td>
                      <Td w="13%">CNPJ</Td>
                      <Td>Email</Td>
                      <Td>Contato</Td>
                      <Td>Cidade</Td>
                      <Td w="5%">UF</Td>
                      <Td w="10%"></Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {providers.map((prov) => (
                      <Tr key={prov.id}>
                        <Td w="5%" textAlign="center">
                          <Box w="25px" h="25px" rounded="lg" overflow="hidden">
                            <Image src={prov.thumbnail} w="25px" h="25px" />
                          </Box>
                        </Td>
                        <Td w="7%" textAlign="center">
                          <Switch
                            colorScheme={config.switchs}
                            defaultIsChecked={prov.active}
                            size="sm"
                            onChange={(e) =>
                              handleActive(e.target.checked, prov.id)
                            }
                          />
                        </Td>
                        <Td w="25%">{prov.name}</Td>
                        <Td w="13%">{prov.cnpj}</Td>
                        <Td>{prov.email}</Td>
                        <Td>{prov.contact}</Td>
                        <Td>{prov.city}</Td>
                        <Td w="5%">{prov.state}</Td>
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
                                icon={<FaEdit />}
                                onClick={() => handleProviderInfo(prov.id)}
                              >
                                Editar Informações
                              </MenuItem>
                              <MenuItem
                                icon={<FaImage />}
                                onClick={() => handleImage(prov.id)}
                              >
                                Alterar Logomarca
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

          <Modal
            isOpen={modalInfo}
            onClose={() => setModalInfo(false)}
            isCentered
            size="xl"
          >
            <ModalOverlay />
            <ModalContent maxW="60rem">
              <ModalHeader>Editar Informações</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Grid templateColumns="1fr" gap="15px">
                  <FormControl
                    isRequired
                    isInvalid={
                      validators.find((obj) => obj.path === "name")
                        ? true
                        : false
                    }
                  >
                    <FormLabel>Razão Social</FormLabel>
                    <Input
                      placeholder="Nome"
                      id="name"
                      focusBorderColor={config.inputs}
                      value={name}
                      onChange={(e) =>
                        setName(capitalizeFirstLetter(e.target.value))
                      }
                    />
                    <FormErrorMessage>
                      {validators.find((obj) => obj.path === "name")
                        ? validators.find((obj) => obj.path === "name").message
                        : ""}
                    </FormErrorMessage>
                  </FormControl>
                </Grid>

                <Grid mt={3} templateColumns="repeat(3, 1fr)" gap="15px">
                  <FormControl
                    isRequired
                    isInvalid={
                      validators.find((obj) => obj.path === "cnpj")
                        ? true
                        : false
                    }
                  >
                    <FormLabel>CNPJ</FormLabel>
                    <MaskedInput
                      mask={[
                        /[0-9]/,
                        /\d/,
                        ".",
                        /\d/,
                        /\d/,
                        /\d/,
                        ".",
                        /\d/,
                        /\d/,
                        /\d/,
                        "/",
                        /\d/,
                        /\d/,
                        /\d/,
                        /\d/,
                        "-",
                        /\d/,
                        /\d/,
                      ]}
                      value={cnpj}
                      onChange={(e) => setCnpj(e.target.value)}
                      placeholder="CNPJ"
                      id="cnpj"
                      render={(ref, props) => (
                        <Input
                          ref={ref}
                          {...props}
                          focusBorderColor={config.inputs}
                        />
                      )}
                    />
                    <FormErrorMessage>
                      {validators.find((obj) => obj.path === "cnpj")
                        ? validators.find((obj) => obj.path === "cnpj").message
                        : ""}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isInvalid={
                      validators.find((obj) => obj.path === "contact")
                        ? true
                        : false
                    }
                  >
                    <FormLabel>
                      <Stack direction="row">
                        <Text>Contato:</Text>
                        <RadioGroup
                          value={typeContact}
                          onChange={(e) => setTypeContact(e)}
                          colorScheme={config.switchs}
                          ml={4}
                          fontSize="xs"
                        >
                          <Stack spacing={5} direction="row">
                            <Radio value="1">Comercial</Radio>
                            <Radio value="2">Celular</Radio>
                          </Stack>
                        </RadioGroup>
                      </Stack>
                    </FormLabel>
                    {typeContact === "1" ? (
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
                    ) : (
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
                    )}
                    <FormErrorMessage>
                      {validators.find((obj) => obj.path === "contact")
                        ? validators.find((obj) => obj.path === "contact")
                            .message
                        : ""}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={
                      validators.find((obj) => obj.path === "email")
                        ? true
                        : false
                    }
                  >
                    <FormLabel>Email</FormLabel>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value.toLowerCase())}
                      placeholder="Email"
                      id="email"
                      focusBorderColor={config.inputs}
                    />
                    <FormErrorMessage>
                      {validators.find((obj) => obj.path === "email")
                        ? validators.find((obj) => obj.path === "email").message
                        : ""}
                    </FormErrorMessage>
                  </FormControl>
                </Grid>

                <Grid templateColumns="3fr 1fr" mt={3} gap="15px">
                  <FormControl
                    isRequired
                    isInvalid={
                      validators.find((obj) => obj.path === "street")
                        ? true
                        : false
                    }
                  >
                    <FormLabel>Logradouro</FormLabel>
                    <Input
                      placeholder="Logradouro"
                      id="street"
                      focusBorderColor={config.inputs}
                      value={street}
                      onChange={(e) =>
                        setStreet(capitalizeFirstLetter(e.target.value))
                      }
                    />
                    <FormErrorMessage>
                      {validators.find((obj) => obj.path === "street")
                        ? validators.find((obj) => obj.path === "street")
                            .message
                        : ""}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={
                      validators.find((obj) => obj.path === "number")
                        ? true
                        : false
                    }
                  >
                    <FormLabel>Número</FormLabel>
                    <Input
                      placeholder="Número"
                      id="number"
                      focusBorderColor={config.inputs}
                      value={number}
                      onChange={(e) => setNumber(e.target.value.toUpperCase())}
                    />
                    <FormErrorMessage>
                      {validators.find((obj) => obj.path === "number")
                        ? validators.find((obj) => obj.path === "number")
                            .message
                        : ""}
                    </FormErrorMessage>
                  </FormControl>
                </Grid>

                <Grid templateColumns="1fr 1fr" mt={3} gap="15px">
                  <FormControl>
                    <FormLabel>Complemento</FormLabel>
                    <Input
                      placeholder="Complemento"
                      id="comp"
                      focusBorderColor={config.inputs}
                      value={comp}
                      onChange={(e) =>
                        setComp(capitalizeFirstLetter(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={
                      validators.find((obj) => obj.path === "district")
                        ? true
                        : false
                    }
                  >
                    <FormLabel>Bairro</FormLabel>
                    <Input
                      placeholder="Bairro"
                      id="district"
                      focusBorderColor={config.inputs}
                      value={district}
                      onChange={(e) =>
                        setDistrict(capitalizeFirstLetter(e.target.value))
                      }
                    />
                    <FormErrorMessage>
                      {validators.find((obj) => obj.path === "district")
                        ? validators.find((obj) => obj.path === "district")
                            .message
                        : ""}
                    </FormErrorMessage>
                  </FormControl>
                </Grid>

                <Grid templateColumns="1fr 1fr 200px" mt={3} gap="15px">
                  <FormControl
                    isRequired
                    isInvalid={
                      validators.find((obj) => obj.path === "cep")
                        ? true
                        : false
                    }
                  >
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
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
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
                    <FormErrorMessage>
                      {validators.find((obj) => obj.path === "cep")
                        ? validators.find((obj) => obj.path === "cep").message
                        : ""}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={
                      validators.find((obj) => obj.path === "city")
                        ? true
                        : false
                    }
                  >
                    <FormLabel>Cidade</FormLabel>
                    <Input
                      placeholder="Cidade"
                      id="city"
                      focusBorderColor={config.inputs}
                      value={city}
                      onChange={(e) =>
                        setCity(capitalizeFirstLetter(e.target.value))
                      }
                    />
                    <FormErrorMessage>
                      {validators.find((obj) => obj.path === "city")
                        ? validators.find((obj) => obj.path === "city").message
                        : ""}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={
                      validators.find((obj) => obj.path === "state")
                        ? true
                        : false
                    }
                  >
                    <FormLabel>UF</FormLabel>
                    <Select
                      placeholder="Selecione"
                      variant="outline"
                      focusBorderColor={config.inputs}
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
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
                    <FormErrorMessage>
                      {validators.find((obj) => obj.path === "state")
                        ? validators.find((obj) => obj.path === "state").message
                        : ""}
                    </FormErrorMessage>
                  </FormControl>
                </Grid>
              </ModalBody>

              <ModalFooter>
                <Button
                  leftIcon={<FaSave />}
                  colorScheme={config.buttons}
                  isLoading={loading}
                  onClick={() => saveProvider()}
                >
                  Salvar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Modal
            isOpen={modalLoading}
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

          <Modal
            isOpen={modalImage}
            onClose={() => setModalImage(false)}
            isCentered
            size="xl"
          >
            <ModalOverlay />
            <ModalContent maxW="650px">
              <ModalHeader>Alterar Imagem</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Grid
                  templateColumns="1fr 1fr"
                  gap="20px"
                  justifyItems="center"
                >
                  <Box w="280px" h="320px">
                    <Text>Imagem atual:</Text>
                    <Image src={url} w="280px" h="310px" rounded="md" />
                  </Box>
                  <Box>
                    <Text>Nova imagem:</Text>
                    <Box w="280px" h="310px">
                      {thumbnail ? (
                        <Box rounded="md" borderWidth="1px" overflow="hidden">
                          <Image src={previewThumbnail} w="280px" h="310px" />
                          <Flex justify="center" mt="-30px">
                            <Tooltip label="Remover Imagem" hasArrow>
                              <IconButton
                                icon={<AiOutlineClose />}
                                colorScheme="red"
                                rounded="full"
                                size="sm"
                                shadow="md"
                                onClick={() => removeThumbnail()}
                              />
                            </Tooltip>
                          </Flex>
                        </Box>
                      ) : (
                        <InputFile alt={310} lar={280} cor={colorMode}>
                          <File
                            type="file"
                            onChange={(event) =>
                              setThumbnail(event.target.files[0])
                            }
                          />
                          <FaImage style={{ fontSize: 50, marginBottom: 20 }} />
                          <Text>
                            Insira uma imagem 280x310 pixels, de até 500kb
                          </Text>
                        </InputFile>
                      )}
                    </Box>
                  </Box>
                </Grid>
              </ModalBody>

              <ModalFooter>
                <Button
                  colorScheme={config.buttons}
                  leftIcon={<FaSave />}
                  isLoading={loadingImage}
                  onClick={() => handelUpdateImage()}
                >
                  Salvar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      </Hotkeys>
    </>
  );
}
