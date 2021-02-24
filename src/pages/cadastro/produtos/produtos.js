import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Grid,
  Input,
  Button,
  FormLabel,
  FormControl,
  HStack,
  Divider,
  Textarea,
  Heading,
  Select,
  Tooltip,
  Text,
  useColorMode,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Stack,
  Skeleton,
  ModalBody,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  IconButton,
  FormErrorMessage,
  Flex,
  Image,
  useToast,
  Kbd,
  Icon,
} from "@chakra-ui/react";
import HeaderApp from "../../../components/headerApp";
import {
  FaTag,
  FaSave,
  FaCalculator,
  FaImage,
  FaCheck,
  FaSearch,
} from "react-icons/fa";
import { AiOutlineClose, AiOutlineEnter } from "react-icons/ai";
import { File, InputFile } from "../../../style/uploader";
import config from "../../../configs";
import dataTrib from "../../../data/data";
import { useEmployee } from "../../../context/Employee";
import useFetch from "../../../hooks/useFetch";
import Hotkeys from "react-hot-keys";
import api from "../../../configs/axios";
import marge from "../../../data/marge";
import MaskedInput from "react-text-mask";

export default function Produtos() {
  const { colorMode } = useColorMode();
  const { employee } = useEmployee();
  const { data, error } = useFetch("/findDependents");
  const initialRef = useRef();
  const toast = useToast();

  const [tabIndex, setTabIndex] = useState(0);
  const [modalCategories, setModalCategories] = useState(false);
  const [modalDepartments, setModalDepartments] = useState(false);
  const [validators, setValidators] = useState([]);
  const [findCategories, setFindCategories] = useState("");
  const [findDepartments, setFindDepartments] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data) {
      setDepartments(data.departments);
    }
  }, [data]);

  /** STATES PRIMEIRA TAB */
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [barcode, setBarcode] = useState("");
  const [sku, setSku] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  /** STATES SEGUNDA TAB */
  const [icmsRate, setIcmsRate] = useState(0);
  const [icmsCst, setIcmsCst] = useState("");
  const [pisRate, setPisRate] = useState(0);
  const [pisCst, setPisCst] = useState("");
  const [cofinsRate, setCofinsRate] = useState(0);
  const [cofinsCst, setCofinsCst] = useState("");
  const [icmsOrigin, setIcmsOrigin] = useState("");
  const [icmsStRate, setIcmsStRate] = useState(0);
  const [icmsMVA, setIcmsMVA] = useState(0);
  const [icmsStModBc, setIcmsStModBc] = useState("");
  const [fcpRate, setFcpRate] = useState(0);
  const [fcpStRate, setFcpStRate] = useState(0);
  const [fcpRetRate, setFcpRetRate] = useState(0);
  const [ipiRate, setIpiRate] = useState(0);
  const [ipiCode, setIpiCode] = useState("");
  const [ipiCst, setIpiCst] = useState("");
  const [cfop, setCfop] = useState("");
  const [ncm, setNcm] = useState("");
  const [cest, setCest] = useState("");

  /** STATES TERCEIRA TAB */
  const [margeLucro, setMargeLucro] = useState(1.15);
  const [costValue, setCostValue] = useState(0);
  const [otherCost, setOtherCost] = useState(0);
  const [saleValue, setSaleValue] = useState(0);
  const [productHeight, setProductHeight] = useState(0);
  const [productWidth, setProductWidht] = useState(0);
  const [productDiameter, setProductDiameter] = useState(0);
  const [productLength, setProductLength] = useState(0);
  const [productWeight, setProductWeight] = useState(0);

  const [departmentName, setDepartmentName] = useState("");
  const [departmentId, setDepartmentId] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesSearched, setCategoriesSearched] = useState([]);

  function clear() {
    setFcpRetRate(0);
    setNcm("");
    setCest("");
    setCfop("");
    setDepartmentName("");
    setDepartmentId(null);
    setCategoryName("");
    setCategoryId(null);
    setTabIndex(0);
    setName("");
    setDescription("");
    setBarcode("");
    setSku("");
    setThumbnail(null);
    setIcmsRate(0);
    setIcmsCst("");
    setPisRate(0);
    setPisCst("");
    setCofinsRate(0);
    setCofinsCst("");
    setIcmsOrigin("");
    setIcmsStRate(0);
    setIcmsMVA(0);
    setIcmsStModBc("");
    setFcpRate(0);
    setFcpStRate(0);
    setIpiRate(0);
    setIpiCode("");
    setIpiCst("");
    setMargeLucro(1.15);
    setCostValue(0);
    setOtherCost(0);
    setSaleValue(0);
    setProductWeight(0);
    setProductWidht(0);
    setProductHeight(0);
    setProductDiameter(0);
    setProductLength(0);
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

  const previewThumbnail = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  async function removeThumbnail() {
    await URL.revokeObjectURL(thumbnail);
    setThumbnail(null);
    setValidators([]);
  }

  const handleTabsChange = (index) => {
    setTabIndex(index);
  };

  async function finderCategorieBySource(text) {
    setFindCategories(text);
    if (text === "") {
      setCategories(categoriesSearched);
    } else {
      let termos = await text.split(" ");
      let frasesFiltradas = await categories.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.name.includes(termoBuscado);
        }, true);
      });
      await setCategories(frasesFiltradas);
    }
  }

  async function finderDepartmentsBySource(text) {
    setFindDepartments(text);
    if (text === "") {
      if (data) {
        await setDepartments(data.departments);
      }
    } else {
      let termos = await text.split(" ");
      let frasesFiltradas = await departments.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.name.includes(termoBuscado);
        }, true);
      });
      await setDepartments(frasesFiltradas);
    }
  }

  function capitalizeAllFirstLetter(string) {
    let splited = string.split(" ");
    let toJoin = splited.map((e) => {
      return e.charAt(0).toUpperCase() + e.slice(1);
    });
    let joined = toJoin.join(" ");
    return joined;
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(() => {
    if (thumbnail) {
      let size = thumbnail.size / 1024;
      let thumbname = thumbnail.name;
      if (thumbname.includes(" ")) {
        handleValidator("image", "Nome da imagem não pode conter espaços");
      }
      if (size > 500) {
        handleValidator(
          "image",
          "Imagem maior que 500kb, insira uma imagem menor"
        );
      }
    } else {
      setValidators([]);
    }
  }, [thumbnail]);

  async function handleCategoryId(id) {
    const result = await categories.find((obj) => obj.id === id);
    setCategoryId(result.id);
    setCategoryName(result.name);
    setModalCategories(false);
  }

  async function handleDepartmentId(id) {
    setCategoryId(null);
    setCategoryName("");
    let cat;
    let categor;
    if (data) {
      cat = data.categories;
      categor = await cat.filter((obj) => obj.departments_id === id);
    }
    const result = await departments.find((obj) => obj.id === id);
    setCategories(categor);
    setCategoriesSearched(categor);
    setDepartmentId(result.id);
    setDepartmentName(result.name);
    setModalDepartments(false);
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

  async function register(e) {
    if (e) {
      e.preventDefault();
    }
    if (!departmentId) {
      handleValidator("department", "Selcione um departamento");
      return false;
    }
    if (!categoryId) {
      handleValidator("category", "Selcione uma categoria");
      return false;
    }
    if (!thumbnail) {
      setTabIndex(0);
      handleValidator("image", "Selecione uma imagem");
      return false;
    }
    if (thumbnail.name.includes(" ")) {
      setTabIndex(0);
      handleValidator("image", "Nome da imagem não pode conter espaços");
      return false;
    }
    let size = thumbnail.size / 1024;
    if (size > 500) {
      setTabIndex(0);
      handleValidator(
        "image",
        "Imagem maior que 500kb, insira uma imagem menor"
      );
      return false;
    }
    if (!name || name === "") {
      setTabIndex(0);
      handleValidator("name", "O Nome é obrigatório");
      return false;
    }
    if (!description || description === "") {
      setTabIndex(0);
      handleValidator("description", "A Descrição é obrigatória");
      return false;
    }
    if (saleValue === 0) {
      setTabIndex(2);
      handleValidator("valueSale", "Faça o cálculo de venda corretamente");
      return false;
    }
    if (productHeight === 0) {
      setTabIndex(2);
      handleValidator("height", "Adicione uma altura para o produto");
      return false;
    }
    if (productWidth === 0) {
      setTabIndex(2);
      handleValidator("width", "Adicione uma largura para o produto");
      return false;
    }
    if (productLength === 0) {
      setTabIndex(2);
      handleValidator("lenght", "Adicione um comprimento para o produto");
      return false;
    }
    if (productDiameter === 0) {
      setTabIndex(2);
      handleValidator("diameter", "Adicione um diâmetro para o produto");
      return false;
    }
    if (productWeight === 0) {
      setTabIndex(2);
      handleValidator("weight", "Adicione um peso para o produto");
      return false;
    }
    try {
      setLoading(true);
      let data = new FormData();
      data.append("thumbnail", thumbnail);
      data.append("name", name);
      data.append("description", description);
      data.append("sku", sku);
      data.append("barcode", barcode);
      data.append("cfop", cfop);
      data.append("ncm", ncm);
      data.append("icms_rate", parseFloat(icmsRate));
      data.append("icms_origin", icmsOrigin);
      data.append("icms_csosn", icmsCst);
      data.append("icms_st_rate", parseFloat(icmsStRate));
      data.append("icms_marg_val_agregate", parseFloat(icmsMVA));
      data.append("icms_st_mod_bc", icmsStModBc);
      data.append("fcp_rate", parseFloat(fcpRate));
      data.append("fcp_st_rate", parseFloat(fcpStRate));
      data.append("fcp_ret_rate", parseFloat(fcpRetRate));
      data.append("ipi_cst", ipiCst);
      data.append("ipi_rate", parseFloat(ipiRate));
      data.append("ipi_code", ipiCode);
      data.append("pis_cst", pisCst);
      data.append("pis_rate", parseFloat(pisRate));
      data.append("cofins_cst", cofinsCst);
      data.append("cofins_rate", parseFloat(cofinsRate));
      data.append("cest", cest);
      data.append("cost_value", parseFloat(costValue));
      data.append("other_cost", parseFloat(otherCost));
      data.append("sale_value", parseFloat(saleValue));
      data.append("freight_weight", parseFloat(productWeight));
      data.append("freight_width", parseFloat(productWidth));
      data.append("freight_height", parseFloat(productHeight));
      data.append("freight_diameter", parseFloat(productDiameter));
      data.append("freight_length", parseFloat(productLength));
      data.append("departments_id", departmentId);
      data.append("categories_id", categoryId);

      const response = await api.post("/products", data, {
        headers: { "x-access-token": employee.token },
      });
      clear();
      showToast(response.data.message, "success", "Sucesso");
      setLoading(false);
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

  function calcSalePrice() {
    let cost = parseFloat(costValue) + parseFloat(otherCost);
    setSaleValue(cost * margeLucro);
  }

  function onKeyDown(keyName, e, handle) {
    if (keyName === "f3") {
      setModalCategories(true);
    }
    if (keyName === "f2") {
      setModalDepartments(true);
    }
    if (keyName === "return" || keyName === "enter") {
      register(e);
    }
  }

  return (
    <>
      <Hotkeys
        keyName="f3, f2, return, enter"
        onKeyDown={onKeyDown}
        allowRepeat
        filter={(event) => {
          return true;
        }}
      >
        <HeaderApp title="Cadastro de Produtos" icon={FaTag} />

        <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
          <Grid
            templateColumns="repeat(2, 1fr)"
            gap="15px"
            alignContent="center"
          >
            <HStack spacing="5px">
              <FormControl
                isRequired
                mr={3}
                isInvalid={
                  validators.find((obj) => obj.path === "department")
                    ? true
                    : false
                }
              >
                <FormLabel>Departamento</FormLabel>
                <Input
                  id="department"
                  placeholder="Departamento"
                  w="350px"
                  focusBorderColor={config.inputs}
                  isReadOnly
                  value={departmentName}
                />
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "department")
                    ? validators.find((obj) => obj.path === "department")
                        .message
                    : ""}
                </FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel color="transparent" userSelect="none">
                  o
                </FormLabel>
                <Button
                  isFullWidth
                  leftIcon={<FaSearch />}
                  onClick={() => setModalDepartments(true)}
                >
                  Buscar Departamento{" "}
                  <Kbd ml={3} color="ButtonText">
                    F2
                  </Kbd>
                </Button>
              </FormControl>
            </HStack>
            <HStack spacing="5px">
              <FormControl
                isRequired
                mr={3}
                isInvalid={
                  validators.find((obj) => obj.path === "category")
                    ? true
                    : false
                }
              >
                <FormLabel>Categoria</FormLabel>
                <Input
                  id="category"
                  placeholder="Departamento"
                  w="350px"
                  focusBorderColor={config.inputs}
                  isReadOnly
                  value={categoryName}
                />
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "category")
                    ? validators.find((obj) => obj.path === "category").message
                    : ""}
                </FormErrorMessage>
              </FormControl>
              <FormControl>
                <FormLabel color="transparent" userSelect="none">
                  o
                </FormLabel>
                <Button
                  isFullWidth
                  leftIcon={<FaSearch />}
                  onClick={() => setModalCategories(true)}
                >
                  Buscar Categoria{" "}
                  <Kbd ml={3} color="ButtonText">
                    F3
                  </Kbd>
                </Button>
              </FormControl>
            </HStack>
          </Grid>

          <Divider mt={5} mb={5} />

          <Box>
            <Tabs
              variant="enclosed"
              colorScheme={config.tabs}
              index={tabIndex}
              onChange={handleTabsChange}
            >
              <TabList>
                <Tab>Informações</Tab>
                <Tab>Tributação</Tab>
                <Tab>Preço e Frete</Tab>
              </TabList>

              <TabPanels>
                {/** INFORMAÇÕES */}
                <TabPanel>
                  <Grid templateColumns="280px 1fr" gap="15px">
                    <FormControl
                      isRequired
                      isInvalid={
                        validators.find((obj) => obj.path === "image")
                          ? true
                          : false
                      }
                    >
                      <FormLabel>Imagem</FormLabel>
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
                            <FaImage
                              style={{ fontSize: 50, marginBottom: 20 }}
                            />
                            <Text>
                              Insira uma imagem 280x310 pixels, de até 500kb
                            </Text>
                          </InputFile>
                        )}
                      </Box>
                      <FormErrorMessage>
                        {validators.find((obj) => obj.path === "image")
                          ? validators.find((obj) => obj.path === "image")
                              .message
                          : ""}
                      </FormErrorMessage>
                    </FormControl>
                    <Box>
                      <Grid templateColumns="1fr 200px 200px" gap="15px">
                        <FormControl
                          isRequired
                          mr={3}
                          isInvalid={
                            validators.find((obj) => obj.path === "name")
                              ? true
                              : false
                          }
                        >
                          <FormLabel>Nome do Produto</FormLabel>
                          <Input
                            id="name"
                            placeholder="Nome"
                            focusBorderColor={config.inputs}
                            value={name}
                            onChange={(e) =>
                              setName(capitalizeAllFirstLetter(e.target.value))
                            }
                          />
                          <FormErrorMessage>
                            {validators.find((obj) => obj.path === "name")
                              ? validators.find((obj) => obj.path === "name")
                                  .message
                              : ""}
                          </FormErrorMessage>
                        </FormControl>

                        <FormControl mr={3}>
                          <FormLabel>Cod. de Barras</FormLabel>
                          <Input
                            placeholder="Código de Barras"
                            focusBorderColor={config.inputs}
                            value={barcode}
                            onChange={(e) =>
                              setBarcode(e.target.value.toUpperCase())
                            }
                          />
                        </FormControl>

                        <FormControl mr={3}>
                          <FormLabel>Cod. SKU</FormLabel>
                          <Input
                            placeholder="Código SKU"
                            focusBorderColor={config.inputs}
                            value={sku}
                            onChange={(e) =>
                              setSku(e.target.value.toUpperCase())
                            }
                          />
                        </FormControl>
                      </Grid>

                      <Grid templateColumns="1fr" mt={3} gap="15px">
                        <FormControl
                          mr={3}
                          isRequired
                          isInvalid={
                            validators.find((obj) => obj.path === "description")
                              ? true
                              : false
                          }
                        >
                          <FormLabel>Descrição</FormLabel>
                          <Textarea
                            id="description"
                            placeholder="Descrição"
                            resize="none"
                            focusBorderColor={config.inputs}
                            value={description}
                            onChange={(e) =>
                              setDescription(
                                capitalizeFirstLetter(e.target.value)
                              )
                            }
                          />
                          <FormErrorMessage>
                            {validators.find(
                              (obj) => obj.path === "description"
                            )
                              ? validators.find(
                                  (obj) => obj.path === "description"
                                ).message
                              : ""}
                          </FormErrorMessage>
                        </FormControl>
                      </Grid>
                    </Box>
                  </Grid>
                </TabPanel>

                {/** TRIBUTAÇÕES */}
                <TabPanel>
                  <Grid mb={3} gap="15px" templateColumns="repeat(3, 1fr)">
                    <FormControl>
                      <FormLabel>CFOP</FormLabel>
                      <MaskedInput
                        mask={[/[0-9]/, /\d/, /\d/, /\d/]}
                        value={cfop}
                        onChange={(e) => setCfop(e.target.value)}
                        placeholder="CFOP"
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
                      <FormLabel>NCM</FormLabel>
                      <MaskedInput
                        mask={[
                          /[0-9]/,
                          /\d/,
                          /\d/,
                          /\d/,
                          ".",
                          /\d/,
                          /\d/,
                          ".",
                          /\d/,
                          /\d/,
                        ]}
                        value={ncm}
                        onChange={(e) => setNcm(e.target.value)}
                        placeholder="NCM"
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
                      <FormLabel>CEST</FormLabel>
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
                        ]}
                        value={cest}
                        onChange={(e) => setCest(e.target.value)}
                        placeholder="CEST"
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
                  <Grid templateColumns="repeat(3, 1fr)" gap="15px">
                    <Box borderWidth="1px" rounded="md">
                      <Heading size="sm" p={3}>
                        ICMS
                      </Heading>
                      <Divider />
                      <Grid templateColumns="1fr 1fr" gap="10px" p={2}>
                        <FormControl mr={3}>
                          <FormLabel>Alíquota</FormLabel>
                          <NumberInput
                            precision={2}
                            step={0.01}
                            focusBorderColor={config.inputs}
                            value={icmsRate}
                            onChange={(e) => setIcmsRate(e)}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>
                        <FormControl mr={3}>
                          <FormLabel>CSOSN</FormLabel>
                          <Select
                            focusBorderColor={config.inputs}
                            value={icmsCst}
                            onChange={(e) => setIcmsCst(e.target.value)}
                          >
                            <option value={"101"}>
                              101 - Tributada pelo Simples Nacional com
                              permissão de crédito
                            </option>
                            <option value={"102"}>
                              102 - Tributada pelo Simples Nacional sem
                              permissão de crédito
                            </option>
                            <option value={"103"}>
                              103 - Isenção do ICMS no Simples Nacional para
                              faixa de receita bruta
                            </option>
                            <option value={"201"}>
                              201 - Tributada pelo Simples Nacional com
                              permissão de crédito e com cobrança do ICMS por
                              substituição tributária
                            </option>
                            <option value={"202"}>
                              202 - Tributada pelo Simples Nacional sem
                              permissão de crédito e com cobrança do ICMS por
                              substituição tributária
                            </option>
                            <option value={"203"}>
                              203 - Isenção do ICMS no Simples Nacional para
                              faixa de receita bruta e com cobrança do ICMS por
                              substituição tributária
                            </option>
                            <option value={"300"}>300 - Imune</option>
                            <option value={"400"}>
                              400 - Não tributada pelo Simples Nacional
                            </option>
                            <option value={"500"}>
                              500 - ICMS cobrado anteriormente por substituição
                              tributária (substituído) ou por antecipação
                            </option>
                            <option value={"900"}>900 - Outros</option>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Box>

                    <Box borderWidth="1px" rounded="md">
                      <Heading size="sm" p={3}>
                        PIS
                      </Heading>
                      <Divider />
                      <Grid templateColumns="1fr 1fr" gap="10px" p={2}>
                        <FormControl mr={3}>
                          <FormLabel>Alíquota</FormLabel>
                          <NumberInput
                            precision={2}
                            step={0.01}
                            focusBorderColor={config.inputs}
                            onChange={(e) => setPisRate(e)}
                            value={pisRate}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>
                        <FormControl mr={3}>
                          <FormLabel>CST</FormLabel>
                          <Select
                            focusBorderColor={config.inputs}
                            value={pisCst}
                            onChange={(e) => setPisCst(e.target.value)}
                          >
                            {dataTrib.map((dt) => (
                              <option value={dt.code}>{dt.desc}</option>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Box>

                    <Box borderWidth="1px" rounded="md">
                      <Heading size="sm" p={3}>
                        COFINS
                      </Heading>
                      <Divider />
                      <Grid templateColumns="1fr 1fr" gap="10px" p={2}>
                        <FormControl mr={3}>
                          <FormLabel>Alíquota</FormLabel>
                          <NumberInput
                            precision={2}
                            step={0.01}
                            focusBorderColor={config.inputs}
                            value={cofinsRate}
                            onChange={(e) => setCofinsRate(e)}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>
                        <FormControl mr={3}>
                          <FormLabel>CST</FormLabel>
                          <Select
                            focusBorderColor={config.inputs}
                            value={cofinsCst}
                            onChange={(e) => setCofinsCst(e.target.value)}
                          >
                            {dataTrib.map((dt) => (
                              <option value={dt.code}>{dt.desc}</option>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Box>
                  </Grid>

                  <Grid templateColumns="repeat(2, 1fr)" gap="15px" mt={3}>
                    <Box borderWidth="1px" rounded="md">
                      <Heading size="sm" p={3}>
                        ICMS Outros
                      </Heading>
                      <Divider />
                      <Grid templateColumns="repeat(4, 1fr)" gap="10px" p={2}>
                        <FormControl mr={3}>
                          <FormLabel>Origem</FormLabel>
                          <Select
                            focusBorderColor={config.inputs}
                            value={icmsOrigin}
                            onChange={(e) => setIcmsOrigin(e.target.value)}
                          >
                            <option value={"0"}>0 - Nacional</option>
                            <option value={"1"}>
                              1 - Estrangeira (importação direta)
                            </option>
                            <option value={"2"}>
                              2 - Estrangeira (adquirida no mercado interno)
                            </option>
                            <option value={"3"}>
                              3 - Nacional com mais de 40% de conteúdo
                              estrangeiro
                            </option>
                            <option value={"4"}>
                              4 - Nacional produzida através de processos
                              produtivos básicos
                            </option>
                            <option value={"5"}>
                              5 - Nacional com menos de 40% de conteúdo
                              estrangeiro
                            </option>
                            <option value={"6"}>
                              6 - Estrangeira (importação direta) sem produto
                              nacional similar
                            </option>
                            <option value={"7"}>
                              7 - Estrangeira (adquirida no mercado interno) sem
                              produto nacional similar
                            </option>
                            <option value={"8"}>
                              8 - Nacional, mercadoria ou bem com Conteúdo de
                              Importação superior a 70%;
                            </option>
                          </Select>
                        </FormControl>
                        <FormControl mr={3}>
                          <FormLabel>% Subst. Trib.</FormLabel>
                          <Tooltip
                            label="Alíquota de Substituição Tributária"
                            hasArrow
                          >
                            <NumberInput
                              precision={2}
                              step={0.01}
                              focusBorderColor={config.inputs}
                              value={icmsStRate}
                              onChange={(e) => setIcmsStRate(e)}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </Tooltip>
                        </FormControl>
                        <FormControl mr={3}>
                          <FormLabel>% MVA</FormLabel>
                          <Tooltip
                            label="Alíquota ST Margem de Valor Adicionada"
                            hasArrow
                          >
                            <NumberInput
                              precision={2}
                              step={0.01}
                              focusBorderColor={config.inputs}
                              onChange={(e) => setIcmsMVA(e)}
                              value={icmsMVA}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </Tooltip>
                        </FormControl>
                        <FormControl mr={3}>
                          <FormLabel>% FCP Ret.</FormLabel>
                          <Tooltip
                            label="Alíquota ST Margem de Valor Adicionada"
                            hasArrow
                          >
                            <NumberInput
                              precision={2}
                              step={0.01}
                              focusBorderColor={config.inputs}
                              onChange={(e) => setFcpRetRate(e)}
                              value={fcpRetRate}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </Tooltip>
                        </FormControl>
                      </Grid>
                      <Grid templateColumns="repeat(3, 1fr)" gap="10px" p={2}>
                        <FormControl mr={3}>
                          <FormLabel>Mod. BC ST</FormLabel>
                          <Tooltip
                            label="Modalidade de Base de Cálculo da Substituição Tributária"
                            hasArrow
                            placement="top"
                          >
                            <Select
                              focusBorderColor={config.inputs}
                              value={icmsStModBc}
                              onChange={(e) => setIcmsStModBc(e.target.value)}
                            >
                              <option value={"0"}>
                                Preço tabelado ou máximo sugerido
                              </option>
                              <option value={"1"}>
                                Lista Negativa (valor)
                              </option>
                              <option value={"2"}>
                                Lista Positiva (valor)
                              </option>
                              <option value={"3"}>Lista Neutra (valor)</option>
                              <option value={"4"}>
                                Margem Valor Agregado (%)
                              </option>
                              <option value={"5"}>Pauta (valor)</option>
                            </Select>
                          </Tooltip>
                        </FormControl>
                        <FormControl mr={3}>
                          <FormLabel>% FCP</FormLabel>
                          <Tooltip label="Alíquota FCP" hasArrow>
                            <NumberInput
                              precision={2}
                              step={0.01}
                              focusBorderColor={config.inputs}
                              value={fcpRate}
                              onChange={(e) => setFcpRate(e)}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </Tooltip>
                        </FormControl>
                        <FormControl mr={3}>
                          <FormLabel>% FCP ST</FormLabel>
                          <Tooltip
                            label="Alíquota FCP de Substituição Tributária"
                            hasArrow
                          >
                            <NumberInput
                              precision={2}
                              step={0.01}
                              focusBorderColor={config.inputs}
                              value={fcpStRate}
                              onChange={(e) => setFcpStRate(e)}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </Tooltip>
                        </FormControl>
                      </Grid>
                    </Box>

                    <Box borderWidth="1px" rounded="md">
                      <Heading size="sm" p={3}>
                        IPI
                      </Heading>
                      <Divider />
                      <Grid templateColumns="1fr 1fr 1fr" gap="10px" p={2}>
                        <FormControl mr={3}>
                          <FormLabel>Alíquota</FormLabel>
                          <NumberInput
                            precision={2}
                            step={0.01}
                            focusBorderColor={config.inputs}
                            value={ipiRate}
                            onChange={(e) => setIpiRate(e)}
                          >
                            <NumberInputField />
                            <NumberInputStepper>
                              <NumberIncrementStepper />
                              <NumberDecrementStepper />
                            </NumberInputStepper>
                          </NumberInput>
                        </FormControl>
                        <FormControl mr={3}>
                          <FormLabel>Código</FormLabel>
                          <Input
                            placeholder="Código IPI"
                            type="text"
                            focusBorderColor={config.inputs}
                            value={ipiCode}
                            onChange={(e) => setIpiCode(e.target.value)}
                          />
                        </FormControl>
                        <FormControl mr={3}>
                          <FormLabel>IPI CST</FormLabel>
                          <Select
                            focusBorderColor={config.inputs}
                            value={ipiCst}
                            onChange={(e) => setIpiCst(e.target.value)}
                          >
                            <option value={""}>Nenhum</option>
                            <option value={"00"}>
                              00 – Entrada com Recuperação de Crédito
                            </option>
                            <option value={"01"}>
                              01 – Entrada Tributada com Alíquota Zero
                            </option>
                            <option value={"02"}>02 – Entrada Isenta</option>
                            <option value={"03"}>
                              03 – Entrada Não Tributada
                            </option>
                            <option value={"04"}>04 – Entrada Imune</option>
                            <option value={"05"}>
                              05 – Entrada com Suspensão
                            </option>
                            <option value={"49"}>49 – Outras Entradas</option>
                            <option value={"50"}>50 – Saída Tributada</option>
                            <option value={"51"}>
                              51 – Saída Tributável com Alíquota Zero
                            </option>
                            <option value={"52"}>52 – Saída Isenta</option>
                            <option value={"53"}>
                              53 – Saída Não Tributada
                            </option>
                            <option value={"54"}>54 – Saída Imune</option>
                            <option value={"55"}>
                              55 – Saída com Suspensão
                            </option>
                            <option value={"99"}>99 – Outras Saídas</option>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Box>
                  </Grid>
                </TabPanel>

                {/** VALORES */}
                <TabPanel>
                  <Grid templateColumns="repeat(4, 1fr)" gap="15px">
                    <FormControl
                      isRequired
                      mr={3}
                      isInvalid={
                        validators.find((obj) => obj.path === "marge")
                          ? true
                          : false
                      }
                    >
                      <FormLabel>Margem de Lucro %</FormLabel>
                      <Select
                        value={margeLucro}
                        onChange={(e) =>
                          setMargeLucro(parseFloat(e.target.value))
                        }
                        focusBorderColor={config.inputs}
                      >
                        {marge.map((mar) => (
                          <option value={mar.value}>{mar.text}</option>
                        ))}
                      </Select>

                      <FormErrorMessage>
                        {validators.find((obj) => obj.path === "marge")
                          ? validators.find((obj) => obj.path === "marge")
                              .message
                          : ""}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl
                      isRequired
                      mr={3}
                      isInvalid={
                        validators.find((obj) => obj.path === "valueCusto")
                          ? true
                          : false
                      }
                    >
                      <FormLabel>Valor de Custo</FormLabel>
                      <NumberInput
                        id="valueCusto"
                        precision={2}
                        step={0.01}
                        focusBorderColor={config.inputs}
                        value={costValue}
                        onChange={(e) => setCostValue(e)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>
                        {validators.find((obj) => obj.path === "valueCusto")
                          ? validators.find((obj) => obj.path === "valueCusto")
                              .message
                          : ""}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl mr={3}>
                      <FormLabel>Outros Custos</FormLabel>
                      <NumberInput
                        precision={2}
                        step={0.01}
                        focusBorderColor={config.inputs}
                        value={otherCost}
                        onChange={(e) => setOtherCost(e)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                    <FormControl
                      isRequired
                      mr={3}
                      isInvalid={
                        validators.find((obj) => obj.path === "valueSale")
                          ? true
                          : false
                      }
                    >
                      <FormLabel>Valor de Venda</FormLabel>
                      <NumberInput
                        id="valueSale"
                        precision={2}
                        step={0.01}
                        focusBorderColor={config.inputs}
                        value={saleValue}
                        onChange={(e) => setSaleValue(e)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>
                        {validators.find((obj) => obj.path === "valueSale")
                          ? validators.find((obj) => obj.path === "valueSale")
                              .message
                          : ""}
                      </FormErrorMessage>
                    </FormControl>
                  </Grid>
                  <Button
                    leftIcon={<FaCalculator />}
                    mt={3}
                    onClick={() => calcSalePrice()}
                  >
                    Calcular Preço de Venda
                  </Button>

                  <Divider mt={5} mb={5} />

                  <Text fontSize="sm" color="red.400" mb={3}>
                    Preencha cada campo com a quantidade referente a 1 (um)
                    item.
                  </Text>

                  <Grid templateColumns="repeat(5, 1fr)" gap="15px">
                    <FormControl
                      isRequired
                      mr={3}
                      isInvalid={
                        validators.find((obj) => obj.path === "height")
                          ? true
                          : false
                      }
                    >
                      <FormLabel>Altura</FormLabel>
                      <NumberInput
                        id="height"
                        precision={2}
                        step={0.01}
                        focusBorderColor={config.inputs}
                        value={productHeight}
                        onChange={(e) => setProductHeight(e)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>
                        {validators.find((obj) => obj.path === "height")
                          ? validators.find((obj) => obj.path === "height")
                              .message
                          : ""}
                      </FormErrorMessage>
                    </FormControl>

                    <FormControl
                      isRequired
                      mr={3}
                      isInvalid={
                        validators.find((obj) => obj.path === "width")
                          ? true
                          : false
                      }
                    >
                      <FormLabel>Largura</FormLabel>
                      <NumberInput
                        id="width"
                        precision={2}
                        step={0.01}
                        focusBorderColor={config.inputs}
                        value={productWidth}
                        onChange={(e) => setProductWidht(e)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>
                        {validators.find((obj) => obj.path === "width")
                          ? validators.find((obj) => obj.path === "width")
                              .message
                          : ""}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isRequired
                      mr={3}
                      isInvalid={
                        validators.find((obj) => obj.path === "lenght")
                          ? true
                          : false
                      }
                    >
                      <FormLabel>Comprimento</FormLabel>
                      <NumberInput
                        id="lenght"
                        precision={2}
                        step={0.01}
                        focusBorderColor={config.inputs}
                        value={productLength}
                        onChange={(e) => setProductLength(e)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>
                        {validators.find((obj) => obj.path === "lenght")
                          ? validators.find((obj) => obj.path === "lenght")
                              .message
                          : ""}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isRequired
                      mr={3}
                      isInvalid={
                        validators.find((obj) => obj.path === "diameter")
                          ? true
                          : false
                      }
                    >
                      <FormLabel>Diâmetro</FormLabel>
                      <NumberInput
                        id="diameter"
                        precision={2}
                        step={0.01}
                        focusBorderColor={config.inputs}
                        value={productDiameter}
                        onChange={(e) => setProductDiameter(e)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>
                        {validators.find((obj) => obj.path === "diameter")
                          ? validators.find((obj) => obj.path === "diameter")
                              .message
                          : ""}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      isRequired
                      mr={3}
                      isInvalid={
                        validators.find((obj) => obj.path === "weight")
                          ? true
                          : false
                      }
                    >
                      <FormLabel>Peso</FormLabel>
                      <NumberInput
                        id="weight"
                        precision={2}
                        step={0.01}
                        focusBorderColor={config.inputs}
                        value={productWeight}
                        onChange={(e) => setProductWeight(e)}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <FormErrorMessage>
                        {validators.find((obj) => obj.path === "weight")
                          ? validators.find((obj) => obj.path === "weight")
                              .message
                          : ""}
                      </FormErrorMessage>
                    </FormControl>
                  </Grid>
                  <Divider mt={5} mb={5} />
                  <Button
                    leftIcon={<FaSave />}
                    colorScheme="blue"
                    size="lg"
                    onClick={() => register()}
                    isLoading={loading}
                  >
                    Salvar{" "}
                    <Kbd ml={3} color="ButtonText">
                      <Icon as={AiOutlineEnter} />
                    </Kbd>
                  </Button>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>

        <Modal
          isOpen={modalCategories}
          onClose={() => setModalCategories(false)}
          size="xl"
          scrollBehavior="inside"
          isCentered
          initialFocusRef={initialRef}
        >
          <ModalOverlay />
          <ModalContent pb={4}>
            <ModalHeader>Categorias</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Digite para Buscar"
                focusBorderColor={config.inputs}
                value={findCategories}
                onChange={(e) =>
                  finderCategorieBySource(
                    capitalizeAllFirstLetter(e.target.value)
                  )
                }
                ref={initialRef}
              />

              {!!categories.length ? (
                <Table size="sm" mt={3}>
                  <Thead fontWeight="700">
                    <Tr>
                      <Td>Categoria</Td>
                      <Td w="10%" isNumeric></Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {categories.map((cat) => (
                      <Tr key={cat.id}>
                        <Td>{cat.name}</Td>
                        <Td w="10%" isNumeric>
                          <IconButton
                            aria-label="Search database"
                            icon={<FaCheck />}
                            size="xs"
                            isRound
                            colorScheme="blue"
                            onClick={() => handleCategoryId(cat.id)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              ) : (
                <Stack mt={3}>
                  <Skeleton height="30px" />
                  <Skeleton height="30px" />
                  <Skeleton height="30px" />
                  <Skeleton height="30px" />
                </Stack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={modalDepartments}
          onClose={() => setModalDepartments(false)}
          size="xl"
          scrollBehavior="inside"
          isCentered
          initialFocusRef={initialRef}
        >
          <ModalOverlay />
          <ModalContent pb={4}>
            <ModalHeader>Departamentos</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                placeholder="Digite para Buscar"
                focusBorderColor={config.inputs}
                value={findDepartments}
                onChange={(e) =>
                  finderDepartmentsBySource(
                    capitalizeAllFirstLetter(e.target.value)
                  )
                }
                ref={initialRef}
              />
              {!!departments.length ? (
                <Table size="sm" mt={3}>
                  <Thead fontWeight="700">
                    <Tr>
                      <Td>Departamento</Td>
                      <Td w="10%" isNumeric></Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {departments.map((dep) => (
                      <Tr key={dep.id}>
                        <Td>{dep.name}</Td>
                        <Td w="10%" isNumeric>
                          <IconButton
                            aria-label="Search database"
                            icon={<FaCheck />}
                            size="xs"
                            isRound
                            colorScheme="blue"
                            onClick={() => handleDepartmentId(dep.id)}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              ) : (
                <Stack mt={3}>
                  <Skeleton height="30px" />
                  <Skeleton height="30px" />
                  <Skeleton height="30px" />
                  <Skeleton height="30px" />
                </Stack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Hotkeys>
    </>
  );
}
