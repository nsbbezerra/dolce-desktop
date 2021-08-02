import React, { useState, useEffect, useMemo } from "react";
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
  Divider,
  Textarea,
  Select,
  Tooltip,
  Text,
  useColorMode,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  IconButton,
  FormErrorMessage,
  Flex,
  Image,
  useToast,
  Kbd,
  List,
  ListItem,
  ListIcon,
} from "@chakra-ui/react";
import HeaderApp from "../../../components/headerApp";
import {
  FaTag,
  FaSave,
  FaCalculator,
  FaImage,
  FaArrowLeft,
  FaArrowRight,
  FaPlus,
  FaTrash,
  FaShippingFast,
} from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { File, InputFile } from "../../../style/uploader";
import config from "../../../configs";
import dataTrib from "../../../data/data";
import { useEmployee } from "../../../context/Employee";
import useFetch from "../../../hooks/useFetch";
import Hotkeys from "react-hot-keys";
import api from "../../../configs/axios";
import marge from "../../../data/marge";
import MaskedInput from "react-text-mask";
import { MdCheckCircle } from "react-icons/md";

export default function Produtos() {
  const { colorMode } = useColorMode();
  const { employee } = useEmployee();
  const { data, error } = useFetch("/findDependents");
  const toast = useToast();

  const [tabIndex, setTabIndex] = useState(0);
  const [validators, setValidators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState([]);
  const [providerId, setProviderId] = useState(null);

  useEffect(() => {
    if (data) {
      setDepartments(data.departments);
      setProviders(data.providers);
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

  const [departmentId, setDepartmentId] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [sub_cat_id, setSub_cat_id] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCats, setSubCats] = useState([]);
  const [information, setInformation] = useState("");
  const [list, setList] = useState([]);
  const [listText, setListText] = useState("");

  function clear() {
    setFcpRetRate(0);
    setNcm("");
    setCest("");
    setCfop("");
    setDepartmentId(null);
    setCategoryId(null);
    setSub_cat_id(null);
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
    setInformation("");
    setList([]);
  }

  function handleDepartment(value) {
    setDepartmentId(value);
    findCategories(value);
    setCategoryId(null);
    setSub_cat_id(null);
  }

  function handleCategories(value) {
    setCategoryId(value);
    findSubCategories(value);
    setSub_cat_id(null);
  }

  async function findCategories(id) {
    try {
      const response = await api.get(`/findCatByDepartments/${id}`);
      setCategories(response.data);
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

  async function findSubCategories(id) {
    try {
      const response = await api.get(`/subCat/${id}`);
      setSubCats(response.data);
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
    if (tabIndex !== 3) return false;
    if (!providerId) {
      handleValidator("provider", "Selcione um fornecedor");
      return false;
    }
    if (!departmentId) {
      handleValidator("department", "Selcione um departamento");
      return false;
    }
    if (!categoryId) {
      handleValidator("category", "Selcione uma categoria");
      return false;
    }
    if (!sub_cat_id) {
      handleValidator("sub_cat", "Selcione uma Sub-Categoria");
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
      data.append("provider", providerId);
      data.append("information", information);
      data.append("list", JSON.stringify(list));

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
    if (keyName === "f12") {
      register(e);
    }
  }

  function handleList() {
    const result = list.find((obj) => obj.text === listText);
    if (result) {
      showToast("Esta informação já existe", "warning", "Atenção");
      return false;
    }
    setList([...list, { text: listText }]);
    setListText("");
  }

  function removeList(text) {
    const result = list.filter((obj) => obj.text !== text);
    setList(result);
  }

  return (
    <>
      <Hotkeys
        keyName="f3, f2, f12, f5"
        onKeyDown={onKeyDown}
        allowRepeat
        filter={(event) => {
          return true;
        }}
      >
        <HeaderApp title="Cadastro de Produtos" icon={FaTag} />

        <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
          <Grid
            templateColumns="repeat(4, 1fr)"
            gap="15px"
            alignContent="center"
          >
            <FormControl
              isRequired
              mr={3}
              isInvalid={
                validators.find((obj) => obj.path === "provider") ? true : false
              }
            >
              <FormLabel>Fornecedor</FormLabel>
              <Select
                id="provider"
                focusBorderColor={config.inputs}
                placeholder="Selecione um Fornecedor"
                value={providerId}
                onChange={(e) => setProviderId(e.target.value)}
              >
                {providers.map((pro) => (
                  <option value={pro.id} key={pro.id}>
                    {pro.name}
                  </option>
                ))}
              </Select>

              <FormErrorMessage>
                {validators.find((obj) => obj.path === "provider")
                  ? validators.find((obj) => obj.path === "provider").message
                  : ""}
              </FormErrorMessage>
            </FormControl>

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
              <Select
                id="department"
                focusBorderColor={config.inputs}
                placeholder="Selecione um Departamento"
                value={departmentId}
                onChange={(e) => handleDepartment(e.target.value)}
              >
                {departments.map((dep) => (
                  <option value={dep.id} key={dep.id}>
                    {dep.name}
                  </option>
                ))}
              </Select>

              <FormErrorMessage>
                {validators.find((obj) => obj.path === "department")
                  ? validators.find((obj) => obj.path === "department").message
                  : ""}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              isRequired
              mr={3}
              isInvalid={
                validators.find((obj) => obj.path === "category") ? true : false
              }
            >
              <FormLabel>Categoria</FormLabel>
              <Select
                id="category"
                focusBorderColor={config.inputs}
                placeholder="Selecione uma Categoria"
                value={categoryId}
                onChange={(e) => handleCategories(e.target.value)}
              >
                {categories.map((cat) => (
                  <option value={cat.id} key={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Select>

              <FormErrorMessage>
                {validators.find((obj) => obj.path === "category")
                  ? validators.find((obj) => obj.path === "category").message
                  : ""}
              </FormErrorMessage>
            </FormControl>

            <FormControl
              isRequired
              mr={3}
              isInvalid={
                validators.find((obj) => obj.path === "sub_cat") ? true : false
              }
            >
              <FormLabel>Sub-Categoria</FormLabel>
              <Select
                id="sub_cat"
                focusBorderColor={config.inputs}
                placeholder="Selecione uma Sub-Categoria"
                value={sub_cat_id}
                onChange={(e) => setSub_cat_id(e.target.value)}
              >
                {subCats.map((cat) => (
                  <option value={cat.id} key={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Select>

              <FormErrorMessage>
                {validators.find((obj) => obj.path === "sub_cat")
                  ? validators.find((obj) => obj.path === "sub_cat").message
                  : ""}
              </FormErrorMessage>
            </FormControl>
          </Grid>

          <Divider mt={5} mb={5} />

          <Box>
            <Grid templateColumns="1fr 30px" gap={5}>
              <Tabs
                variant="enclosed"
                colorScheme={config.tabs}
                index={tabIndex}
              >
                <TabList>
                  <Tab>Informações</Tab>
                  <Tab>Tributação</Tab>
                  <Tab>Preço e Frete</Tab>
                  <Tab>Detalhes do Produto</Tab>
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
                            <Box
                              rounded="md"
                              borderWidth="1px"
                              overflow="hidden"
                            >
                              <Image
                                src={previewThumbnail}
                                w="280px"
                                h="310px"
                              />
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
                                setName(
                                  capitalizeAllFirstLetter(e.target.value)
                                )
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
                              validators.find(
                                (obj) => obj.path === "description"
                              )
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

                    <Box mt={5}>
                      <Tabs variant="soft-rounded" colorScheme={config.buttons}>
                        <TabList>
                          <Tab>ICMS</Tab>
                          <Tab>PIS</Tab>
                          <Tab>COFINS</Tab>
                          <Tab>IPI</Tab>
                        </TabList>
                        <TabPanels>
                          <TabPanel>
                            <Grid templateColumns="1fr 1fr" gap="10px" mb={3}>
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
                                    103 - Isenção do ICMS no Simples Nacional
                                    para faixa de receita bruta
                                  </option>
                                  <option value={"201"}>
                                    201 - Tributada pelo Simples Nacional com
                                    permissão de crédito e com cobrança do ICMS
                                    por substituição tributária
                                  </option>
                                  <option value={"202"}>
                                    202 - Tributada pelo Simples Nacional sem
                                    permissão de crédito e com cobrança do ICMS
                                    por substituição tributária
                                  </option>
                                  <option value={"203"}>
                                    203 - Isenção do ICMS no Simples Nacional
                                    para faixa de receita bruta e com cobrança
                                    do ICMS por substituição tributária
                                  </option>
                                  <option value={"300"}>300 - Imune</option>
                                  <option value={"400"}>
                                    400 - Não tributada pelo Simples Nacional
                                  </option>
                                  <option value={"500"}>
                                    500 - ICMS cobrado anteriormente por
                                    substituição tributária (substituído) ou por
                                    antecipação
                                  </option>
                                  <option value={"900"}>900 - Outros</option>
                                </Select>
                              </FormControl>
                            </Grid>

                            <Grid
                              templateColumns="repeat(4, 1fr)"
                              gap="10px"
                              mb={3}
                            >
                              <FormControl mr={3}>
                                <FormLabel>Origem</FormLabel>
                                <Select
                                  focusBorderColor={config.inputs}
                                  value={icmsOrigin}
                                  onChange={(e) =>
                                    setIcmsOrigin(e.target.value)
                                  }
                                >
                                  <option value={"0"}>0 - Nacional</option>
                                  <option value={"1"}>
                                    1 - Estrangeira (importação direta)
                                  </option>
                                  <option value={"2"}>
                                    2 - Estrangeira (adquirida no mercado
                                    interno)
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
                                    6 - Estrangeira (importação direta) sem
                                    produto nacional similar
                                  </option>
                                  <option value={"7"}>
                                    7 - Estrangeira (adquirida no mercado
                                    interno) sem produto nacional similar
                                  </option>
                                  <option value={"8"}>
                                    8 - Nacional, mercadoria ou bem com Conteúdo
                                    de Importação superior a 70%;
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
                                <Tooltip label="Alíquota FCP Retido" hasArrow>
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
                            <Grid templateColumns="repeat(3, 1fr)" gap="10px">
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
                                    onChange={(e) =>
                                      setIcmsStModBc(e.target.value)
                                    }
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
                                    <option value={"3"}>
                                      Lista Neutra (valor)
                                    </option>
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
                          </TabPanel>
                          <TabPanel>
                            <Grid templateColumns="1fr 1fr" gap="10px">
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
                                    <option value={dt.code} key={dt.code}>
                                      {dt.desc}
                                    </option>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                          </TabPanel>
                          <TabPanel>
                            <Grid templateColumns="1fr 1fr" gap="10px">
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
                                    <option value={dt.code} key={dt.code}>
                                      {dt.desc}
                                    </option>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                          </TabPanel>
                          <TabPanel>
                            <Grid templateColumns="1fr 1fr 1fr" gap="10px">
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
                                  <option value={"02"}>
                                    02 – Entrada Isenta
                                  </option>
                                  <option value={"03"}>
                                    03 – Entrada Não Tributada
                                  </option>
                                  <option value={"04"}>
                                    04 – Entrada Imune
                                  </option>
                                  <option value={"05"}>
                                    05 – Entrada com Suspensão
                                  </option>
                                  <option value={"49"}>
                                    49 – Outras Entradas
                                  </option>
                                  <option value={"50"}>
                                    50 – Saída Tributada
                                  </option>
                                  <option value={"51"}>
                                    51 – Saída Tributável com Alíquota Zero
                                  </option>
                                  <option value={"52"}>
                                    52 – Saída Isenta
                                  </option>
                                  <option value={"53"}>
                                    53 – Saída Não Tributada
                                  </option>
                                  <option value={"54"}>54 – Saída Imune</option>
                                  <option value={"55"}>
                                    55 – Saída com Suspensão
                                  </option>
                                  <option value={"99"}>
                                    99 – Outras Saídas
                                  </option>
                                </Select>
                              </FormControl>
                            </Grid>
                          </TabPanel>
                        </TabPanels>
                      </Tabs>
                    </Box>
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
                            <option value={mar.value} key={mar.value}>
                              {mar.text}
                            </option>
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
                            ? validators.find(
                                (obj) => obj.path === "valueCusto"
                              ).message
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
                      colorScheme={config.buttons}
                      variant="outline"
                    >
                      Calcular Preço de Venda
                    </Button>

                    <Divider mt={5} mb={5} />

                    <Text fontSize="sm" color="red.400" mb={3}>
                      Preencha cada campo com a quantidade referente a 1 (um)
                      item.
                    </Text>

                    <Grid templateColumns="repeat(6, 1fr)" gap="15px">
                      <FormControl
                        isRequired
                        mr={3}
                        isInvalid={
                          validators.find((obj) => obj.path === "height")
                            ? true
                            : false
                        }
                      >
                        <FormLabel>Altura (cm)</FormLabel>
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
                        <FormLabel>Largura (cm)</FormLabel>
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
                        <FormLabel>Comprimento (cm)</FormLabel>
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
                        <FormLabel>Diâmetro (cm)</FormLabel>
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
                        <FormLabel>Peso (kg)</FormLabel>
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

                      <FormControl
                        isRequired
                        mr={3}
                        isInvalid={
                          validators.find((obj) => obj.path === "format")
                            ? true
                            : false
                        }
                      >
                        <FormLabel>Formato da Encomenda</FormLabel>
                        <Select
                          id="format"
                          focusBorderColor={config.inputs}
                          placeholder="Formato da Encomenda"
                        >
                          <option value={1}>Formato Caixa/Pacote</option>
                          <option value={2}>Formato Rolo/Prisma</option>
                          <option value={3}>Envelope</option>
                        </Select>
                        <FormErrorMessage>
                          {validators.find((obj) => obj.path === "format")
                            ? validators.find((obj) => obj.path === "format")
                                .message
                            : ""}
                        </FormErrorMessage>
                      </FormControl>
                    </Grid>

                    <Button
                      colorScheme={config.buttons}
                      leftIcon={<FaShippingFast />}
                      mt={3}
                      variant="outline"
                    >
                      Simular Frete
                    </Button>
                  </TabPanel>

                  <TabPanel>
                    <FormControl>
                      <FormLabel>Informação sobre o Produto</FormLabel>
                      <Textarea
                        focusBorderColor={config.inputs}
                        resize="none"
                        rows={5}
                        maxLength={250}
                        value={information}
                        onChange={(e) =>
                          setInformation(capitalizeFirstLetter(e.target.value))
                        }
                      />
                    </FormControl>

                    <FormControl mt={5}>
                      <FormLabel>Lista de Especificações</FormLabel>
                      <Grid templateColumns="1fr 200px" gap="15px">
                        <Input
                          focusBorderColor={config.inputs}
                          value={listText}
                          onChange={(e) =>
                            setListText(
                              capitalizeAllFirstLetter(e.target.value)
                            )
                          }
                        />
                        <Button
                          leftIcon={<FaPlus />}
                          colorScheme={config.buttons}
                          onClick={() => handleList()}
                        >
                          Adicionar
                        </Button>
                      </Grid>
                    </FormControl>

                    {list.length === 0 ? (
                      ""
                    ) : (
                      <>
                        <List spacing={3} mt={5}>
                          {list.map((li) => (
                            <ListItem key={li.text}>
                              <ListIcon as={MdCheckCircle} color="green.500" />
                              {li.text}{" "}
                              <Tooltip label="Excluir Especificação" hasArrow>
                                <IconButton
                                  icon={<FaTrash />}
                                  size="xs"
                                  colorScheme="red"
                                  ml={3}
                                  onClick={() => removeList(li.text)}
                                />
                              </Tooltip>
                            </ListItem>
                          ))}
                        </List>
                      </>
                    )}
                  </TabPanel>
                </TabPanels>
              </Tabs>

              <Flex justify="center" align="center" direction="column">
                <Tooltip label="Anterior" hasArrow placement="left">
                  <IconButton
                    icon={<FaArrowLeft />}
                    onClick={() => tabIndex !== 0 && setTabIndex(tabIndex - 1)}
                    isDisabled={tabIndex === 0 ? true : false}
                    colorScheme={config.buttons}
                    h="50%"
                    mb={7}
                  />
                </Tooltip>

                <Tooltip label="Próximo" hasArrow placement="left">
                  <IconButton
                    colorScheme={config.buttons}
                    icon={<FaArrowRight />}
                    onClick={() => tabIndex !== 3 && setTabIndex(tabIndex + 1)}
                    isDisabled={tabIndex === 3 ? true : false}
                    h="50%"
                  />
                </Tooltip>
              </Flex>
            </Grid>

            {tabIndex === 3 && (
              <>
                <Divider mt={5} mb={5} />
                <Button
                  leftIcon={<FaSave />}
                  colorScheme={config.buttons}
                  size="lg"
                  onClick={() => register()}
                  isLoading={loading}
                >
                  Salvar{" "}
                  <Kbd ml={3} color="ButtonText">
                    F12
                  </Kbd>
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Hotkeys>
    </>
  );
}
