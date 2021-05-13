import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
  Grid,
  Select,
  Input,
  Switch,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useColorMode,
  Image,
  Flex,
  useToast,
  FormControl,
  FormLabel,
  Kbd,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  IconButton,
  Tooltip,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  Heading,
  Textarea,
} from "@chakra-ui/react";
import config from "../../configs/index";
import HeaderApp from "../../components/headerApp";
import { MdKeyboardArrowDown } from "react-icons/md";
import {
  FaSave,
  FaSearch,
  FaEdit,
  FaImage,
  FaTag,
  FaBoxOpen,
  FaCalculator,
} from "react-icons/fa";
import { InputFile, File } from "../../style/uploader";
import { AiOutlineClose } from "react-icons/ai";
import StarRatings from "react-star-ratings";
import { useEmployee } from "../../context/Employee";
import useFetch from "../../hooks/useFetch";
import api from "../../configs/axios";
import Lottie from "../../components/lottie";
import emptyAnimation from "../../animations/empty.json";
import searchAnimation from "../../animations/search.json";
import sendAnimation from "../../animations/send.json";
import { mutate as mutateGlobal } from "swr";
import Hotkeys from "react-hot-keys";
import dataTrib from "../../data/data";
import MaskedInput from "react-text-mask";
import marge from "../../data/marge";

export default function CategoryList() {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const { employee } = useEmployee();
  const { data, error, mutate } = useFetch("/products");

  const [modalInfo, setModalInfo] = useState(false);
  const [modalImage, setModalImage] = useState(false);
  const [modalSize, setModalSize] = useState(false);
  const [modalPromo, setModalPromo] = useState(false);
  const [modalGerImg, setModalGerImg] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [products, setProducts] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [advancedFind, setAdvancedFind] = useState("4");
  const [promoStatus, setPromoStatus] = useState(null);
  const [promoValue, setPromoValue] = useState("0");
  const [valueProduct, setValueProduct] = useState(0);
  const [promoRate, setPromoRate] = useState("0");
  const [productId, setProductId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [loadingImage, setLoadingImage] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [size, setSize] = useState("");
  const [amount, setAmount] = useState(0);
  const [sizeId, setSizeId] = useState(null);
  const [loadingSize, setLoadingSize] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);

  /** STATES PRIMEIRA TAB */
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [barcode, setBarcode] = useState("");
  const [sku, setSku] = useState("");

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

  const [baseUrl, setBaseUrl] = useState("");

  async function findBaseUrl() {
    const base = await localStorage.getItem("baseUrl");
    setBaseUrl(base);
  }

  useEffect(() => {
    let rate = parseFloat(promoRate);
    let prodV = parseFloat(valueProduct);
    let calc = prodV * (rate / 100);
    let rest = prodV - parseFloat(calc);
    if (isNaN(rest)) {
      setPromoValue("0");
    } else {
      setPromoValue(parseFloat(rest.toFixed(2)));
    }
  }, [promoRate]);

  useEffect(() => {
    findBaseUrl();
  }, []);

  useEffect(() => {
    setProducts(data);
  }, [data]);

  const previewThumbnail = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  async function removeThumbnail() {
    await URL.revokeObjectURL(thumbnail);
    setThumbnail(null);
  }

  function capitalizeFirstLetter(string) {
    let splited = string.split(" ");
    let toJoin = splited.map((e) => {
      return e.charAt(0).toUpperCase() + e.slice(1);
    });
    let joined = toJoin.join(" ");
    return joined;
  }

  async function finderProdBySource(text) {
    setSearchProduct(text);
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
      const result = await data.filter((obj) => obj.promotional === true);
      index = result;
    }
    if (advancedFind === "4") {
      index = data;
    }
    if (text === "") {
      await setProducts(index);
    } else {
      let termos = await text.split(" ");
      let frasesFiltradas = await index.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.name.includes(termoBuscado);
        }, true);
      });
      await setProducts(frasesFiltradas);
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

  function onKeyDown(keyName, e, handle) {
    if (keyName === "f3") {
      const inpt = document.getElementById("search");
      inpt.focus();
    }
  }

  async function handleSearch() {
    if (advancedFind === "1") {
      const result = await data.filter((obj) => obj.active === true);

      await setProducts(result);
    }
    if (advancedFind === "2") {
      const result = await data.filter((obj) => obj.active === false);

      await setProducts(result);
    }
    if (advancedFind === "3") {
      const result = await data.filter((obj) => obj.promotional === true);

      await setProducts(result);
    }
    if (advancedFind === "4") {
      await setProducts(data);
    }
  }

  function handlePromo(value, id, saleValue) {
    setProductId(id);
    setValueProduct(saleValue);
    setPromoStatus(value);
    setModalPromo(true);
  }

  async function setPromo() {
    setModalPromo(false);
    setLoading(true);
    try {
      const response = await api.put(
        `/setPromotional/${productId}`,
        {
          promotional: promoStatus,
          promotional_value: parseFloat(promoValue),
          promotional_rate: parseFloat(promoRate),
        },
        { headers: { "x-access-token": employee.token } }
      );
      const updatedProducts = await data.map((prod) => {
        if (prod.id === productId) {
          return {
            ...prod,
            promotional: response.data.product[0].promotional,
            promotional_value: response.data.product[0].promotional_value,
            promotional_rate: response.data.product[0].promotional_rate,
          };
        }
        return prod;
      });
      mutate(updatedProducts, false);
      mutateGlobal(`/setPromotional/${productId}`, {
        id: productId,
        promotional: response.data.product[0].promotional,
        promotional_value: response.data.product[0].promotional_value,
        promotional_rate: response.data.product[0].promotional_rate,
      });
      setLoading(false);
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

  async function handleActive(value, id) {
    try {
      const response = await api.put(
        `/productsActive/${id}`,
        { active: value },
        { headers: { "x-access-token": employee.token } }
      );
      const productsUpdated = await data.map((prod) => {
        if (prod.id === id) {
          return {
            ...prod,
            active: response.data.product[0].active,
          };
        }
        return prod;
      });
      mutate(productsUpdated, false);
      mutateGlobal(`/productsActive/${id}`, {
        id: id,
        active: response.data.product[0].active,
      });
      showToast(response.data.message, "success", "Sucesso");
    } catch (error) {
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

  async function handleImageProduct(id) {
    const result = await data.find((obj) => obj.id === id);
    setProductId(result.id);
    setUrl(result.thumbnail);
    setModalImage(true);
  }

  async function handelUpdateImage() {
    if (!thumbnail) {
      return false;
    }
    setLoadingImage(true);
    try {
      let dataImage = new FormData();
      dataImage.append("thumbnail", thumbnail);
      const response = await api.put(
        `/productChangeImage/${productId}`,
        dataImage,
        { headers: { "x-access-token": employee.token } }
      );
      console.log(response);
      const productUpdated = await data.map((prod) => {
        if (prod.id === productId) {
          return {
            ...prod,
            thumbnail: response.data[0].thumbnail,
          };
        }
        return prod;
      });
      mutate(productUpdated, false);
      mutateGlobal(`/productChangeImage/${productId}`, {
        id: productId,
        thumbnail: response.data[0].thumbnail,
      });
      setThumbnail(null);
      removeThumbnail();
      setModalImage(false);
      setLoadingImage(false);
      showToast("Imagem alterada com sucesso", "success", "Sucesso");
    } catch (error) {
      setLoadingImage(false);
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

  async function handleFindSizes(id) {
    setLoading(true);
    try {
      const response = await api.get(`/findSizeByProduct/${id}`);
      setSizes(response.data);
      setModalSize(true);
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

  async function handleUpdateStock(id) {
    const result = await sizes.find((obj) => obj.id === id);
    setSize(result.size);
    setAmount(result.amount);
    setSizeId(result.id);
    setModalGerImg(true);
  }

  async function saveSizeUpdate() {
    setLoadingSize(true);
    try {
      const response = await api.put(
        `/sizes/${sizeId}`,
        {
          size,
          amount,
        },
        { headers: { "x-access-token": employee.token } }
      );
      const updatedSizes = await sizes.map((si) => {
        if (si.id === sizeId) {
          return { ...si, amount: amount, size: size };
        }
        return si;
      });
      setSizes(updatedSizes);
      showToast(response.data.message, "success", "Sucesso");
      setLoadingSize(false);
      setModalGerImg(false);
    } catch (error) {
      setLoadingSize(false);
      setModalGerImg(false);
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

  async function handleProductInfo(id) {
    const result = await products.find((obj) => obj.id === id);
    setProductId(result.id);
    setName(result.name);
    setBarcode(result.barcode);
    setSku(result.sku);
    setDescription(result.description);
    setCfop(result.cfop || "");
    setNcm(result.ncm || "");
    setCest(result.cest || "");
    setIcmsRate(result.icms_rate || "0");
    setIcmsCst(result.icms_csosn || "");
    setPisRate(result.pis_rate || "0");
    setPisCst(result.pis_cst || "");
    setCofinsRate(result.cofins_rate || "0");
    setCofinsCst(result.cofins_cst || "");
    setIcmsOrigin(result.icms_origin || "");
    setIcmsStRate(result.icms_st_rate || "0");
    setIcmsMVA(result.icms_marg_val_agregate || "0");
    setFcpRetRate(result.fcp_ret_rate || "0");
    setIcmsStModBc(result.icms_st_mod_bc || "");
    setFcpRate(result.fcp_rate || "0");
    setFcpStRate(result.fcp_st_rate || "0");
    setIpiRate(result.ipi_rate || "0");
    setIpiCode(result.ipi_code || "");
    setIpiCst(result.ipi_cst || "");
    setCostValue(result.cost_value || "0");
    setOtherCost(result.other_cost || "0");
    setSaleValue(result.sale_value || "0");
    setProductHeight(result.freight_height || "0");
    setProductWidht(result.freight_width || "0");
    setProductLength(result.freight_length || "0");
    setProductDiameter(result.freight_diameter || "0");
    setProductWeight(result.freight_weight || "0");
    setModalInfo(true);
  }

  async function saveProduct() {
    setLoadingInfo(true);
    try {
      const response = await api.put(
        `/products/${productId}`,
        {
          name,
          description,
          barcode,
          sku,
          ncm,
          cfop,
          cest,
          icms_rate: parseFloat(icmsRate),
          icms_origin: icmsOrigin,
          icms_csosn: icmsCst,
          icms_st_rate: parseFloat(icmsStRate),
          icms_marg_val_agregate: parseFloat(icmsMVA),
          icms_st_mod_bc: icmsStModBc,
          fcp_rate: parseFloat(fcpRate),
          fcp_st_rate: parseFloat(fcpStRate),
          fcp_ret_rate: parseFloat(fcpRetRate),
          ipi_cst: ipiCst,
          ipi_rate: parseFloat(ipiRate),
          ipi_code: ipiCode,
          pis_cst: pisCst,
          pis_rate: parseFloat(pisRate),
          cofins_cst: cofinsCst,
          cofins_rate: parseFloat(cofinsRate),
          cost_value: parseFloat(costValue),
          other_cost: parseFloat(otherCost),
          sale_value: parseFloat(saleValue),
          freight_weight: parseFloat(productWeight),
          freight_width: parseFloat(productWidth),
          freight_height: parseFloat(productHeight),
          freight_diameter: parseFloat(productDiameter),
          freight_length: parseFloat(productLength),
        },
        {
          headers: { "x-access-token": employee.token },
        }
      );

      const updatedProducts = await data.map((prod) => {
        if (prod.id === productId) {
          return {
            ...prod,
            name: name,
            description: description,
            barcode: barcode,
            sku: sku,
            ncm: ncm,
            cfop: cfop,
            cest: cest,
            icms_rate: icmsRate,
            icms_origin: icmsOrigin,
            icms_csosn: icmsCst,
            icms_st_rate: icmsStRate,
            icms_marg_val_agregate: icmsMVA,
            icms_st_mod_bc: icmsStModBc,
            fcp_rate: fcpRate,
            fcp_st_rate: fcpStRate,
            fcp_ret_rate: fcpRetRate,
            ipi_cst: ipiCst,
            ipi_rate: ipiRate,
            ipi_code: ipiCode,
            pis_cst: pisCst,
            pis_rate: pisRate,
            cofins_cst: cofinsCst,
            cofins_rate: cofinsRate,
            cost_value: costValue,
            other_cost: otherCost,
            sale_value: saleValue,
            freight_weight: productWeight,
            freight_width: productWidth,
            freight_height: productHeight,
            freight_diameter: productDiameter,
            freight_length: productLength,
          };
        }
        return prod;
      });

      mutate(updatedProducts, false);
      mutateGlobal(`/products/${productId}`, {
        id: productId,
        name: name,
        description: description,
        barcode: barcode,
        sku: sku,
        ncm: ncm,
        cfop: cfop,
        cest: cest,
        icms_rate: icmsRate,
        icms_origin: icmsOrigin,
        icms_csosn: icmsCst,
        icms_st_rate: icmsStRate,
        icms_marg_val_agregate: icmsMVA,
        icms_st_mod_bc: icmsStModBc,
        fcp_rate: fcpRate,
        fcp_st_rate: fcpStRate,
        fcp_ret_rate: fcpRetRate,
        ipi_cst: ipiCst,
        ipi_rate: ipiRate,
        ipi_code: ipiCode,
        pis_cst: pisCst,
        pis_rate: pisRate,
        cofins_cst: cofinsCst,
        cofins_rate: cofinsRate,
        cost_value: costValue,
        other_cost: otherCost,
        sale_value: saleValue,
        freight_weight: productWeight,
        freight_width: productWidth,
        freight_height: productHeight,
        freight_diameter: productDiameter,
        freight_length: productLength,
      });
      showToast(response.data.message, "success", "Sucesso");
      setLoadingInfo(false);
      setModalInfo(false);
    } catch (error) {
      setLoadingInfo(false);
      setModalInfo(false);
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
        <HeaderApp title="Gerenciar Produtos" icon={FaTag} />

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
                value={searchProduct}
                onChange={(e) =>
                  finderProdBySource(capitalizeFirstLetter(e.target.value))
                }
              />
            </FormControl>
            <FormControl>
              <FormLabel>Selecione uma opção de busca:</FormLabel>
              <Grid templateColumns="1fr 150px" gap="15px">
                <Select
                  placeholder="Selecione uma opção de busca"
                  focusBorderColor={config.inputs}
                  value={advancedFind}
                  onChange={(e) => setAdvancedFind(e.target.value)}
                >
                  <option value={"1"}>Todos os Ativos</option>
                  <option value={"2"}>Todos os Bloqueados</option>
                  <option value={"3"}>Todos os Promocionais</option>
                  <option value={"4"}>Todos os Produtos</option>
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

          {!products ? (
            <Flex justify="center" align="center" direction="column">
              <Lottie animation={searchAnimation} height={200} width={200} />
              <Text>Buscando Informações</Text>
            </Flex>
          ) : (
            <>
              {products.length === 0 ? (
                <Flex justify="center" align="center" direction="column">
                  <Lottie animation={emptyAnimation} height={200} width={200} />
                  <Text>Nenhum produto para mostrar</Text>
                </Flex>
              ) : (
                <Table size="sm" mt="25px">
                  <Thead fontWeight="700">
                    <Tr>
                      <Td w="5%" textAlign="center">
                        Ativo?
                      </Td>
                      <Td w="5%" textAlign="center">
                        Promo?
                      </Td>
                      <Td w="25%">Nome</Td>
                      <Td w="15%" isNumeric>
                        Valor de Custo
                      </Td>
                      <Td w="15%" isNumeric>
                        Valor de Venda
                      </Td>
                      <Td w="15%" isNumeric>
                        Valor Promocional
                      </Td>
                      <Td w="10%" isNumeric>
                        Desconto
                      </Td>
                      <Td w="10%"></Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {products.map((prod) => (
                      <Tr key={prod.id}>
                        <Td w="5%" textAlign="center">
                          <Switch
                            colorScheme={config.switchs}
                            defaultIsChecked={prod.active}
                            onChange={(e) =>
                              handleActive(e.target.checked, prod.id)
                            }
                          />
                        </Td>
                        <Td w="5%" textAlign="center">
                          <Switch
                            colorScheme={config.switchs}
                            defaultIsChecked={prod.promotional}
                            onChange={(e) =>
                              handlePromo(
                                e.target.checked,
                                prod.id,
                                prod.sale_value
                              )
                            }
                          />
                        </Td>
                        <Td w="25%">{prod.name}</Td>
                        <Td w="15%" isNumeric>
                          {parseFloat(prod.cost_value).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </Td>
                        <Td w="15%" isNumeric>
                          {parseFloat(prod.sale_value).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </Td>
                        <Td w="15%" isNumeric>
                          {!prod.promotional_value
                            ? parseFloat("0,00").toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })
                            : parseFloat(prod.promotional_value).toLocaleString(
                                "pt-BR",
                                {
                                  style: "currency",
                                  currency: "BRL",
                                }
                              )}
                        </Td>
                        <Td w="10%" isNumeric>
                          {prod.promotional_rate !== null
                            ? `${prod.promotional_rate}%`
                            : "0.00%"}
                        </Td>
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
                                onClick={() => handleProductInfo(prod.id)}
                              >
                                Editar Informações
                              </MenuItem>
                              <MenuItem
                                icon={<FaBoxOpen />}
                                onClick={() => handleFindSizes(prod.id)}
                              >
                                Ajustar Estoque / Tamanhos
                              </MenuItem>
                              <MenuItem
                                icon={<FaImage />}
                                onClick={() => handleImageProduct(prod.id)}
                              >
                                Alterar Imagem
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
          isOpen={modalInfo}
          onClose={() => setModalInfo(false)}
          isCentered
          scrollBehavior="inside"
        >
          <ModalOverlay />
          <ModalContent maxW="90vw" h="98vh">
            <ModalHeader>Editar Informações</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Tabs variant="enclosed" colorScheme={config.tabs}>
                <TabList>
                  <Tab>Informações</Tab>
                  <Tab>Tributação</Tab>
                  <Tab>Preço e Frete</Tab>
                </TabList>

                <TabPanels>
                  {/** INFORMAÇÕES */}
                  <TabPanel>
                    <Grid templateColumns="1fr" gap="15px">
                      <Box>
                        <Grid templateColumns="1fr 200px 200px" gap="15px">
                          <FormControl isRequired mr={3}>
                            <FormLabel>Nome do Produto</FormLabel>
                            <Input
                              id="name"
                              placeholder="Nome"
                              focusBorderColor={config.inputs}
                              value={name}
                              onChange={(e) =>
                                setName(capitalizeFirstLetter(e.target.value))
                              }
                            />
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
                          <FormControl mr={3} isRequired>
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
                                faixa de receita bruta e com cobrança do ICMS
                                por substituição tributária
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
                                <option value={dt.code} key={dt.code}>
                                  {dt.desc}
                                </option>
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
                                <option value={dt.code} key={dt.code}>
                                  {dt.desc}
                                </option>
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
                                7 - Estrangeira (adquirida no mercado interno)
                                sem produto nacional similar
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
                      <FormControl isRequired mr={3}>
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
                      </FormControl>

                      <FormControl isRequired mr={3}>
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
                      <FormControl isRequired mr={3}>
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

                    <Grid templateColumns="repeat(5, 1fr)" gap="15px">
                      <FormControl isRequired mr={3}>
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
                      </FormControl>

                      <FormControl isRequired mr={3}>
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
                      </FormControl>
                      <FormControl isRequired mr={3}>
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
                      </FormControl>
                      <FormControl isRequired mr={3}>
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
                      </FormControl>
                      <FormControl isRequired mr={3}>
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
                      </FormControl>
                    </Grid>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme={config.buttons}
                leftIcon={<FaSave />}
                isLoading={loadingInfo}
                onClick={() => saveProduct()}
              >
                Salvar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={modalPromo}
          onClose={() => setModalPromo(false)}
          isCentered
          scrollBehavior="inside"
          size="lg"
          closeOnEsc={false}
          closeOnOverlayClick={false}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Valor Promocional</ModalHeader>
            <ModalBody>
              <Grid templateColumns="1fr 1fr" gap="20px">
                <FormControl>
                  <FormLabel>Desconto (%)</FormLabel>
                  <NumberInput
                    id="lenght"
                    precision={2}
                    step={0.01}
                    focusBorderColor={config.inputs}
                    value={promoRate}
                    onChange={(e) => setPromoRate(e)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Valor R$</FormLabel>
                  <Input
                    value={promoValue}
                    isReadOnly
                    focusBorderColor={config.inputs}
                  />
                </FormControl>
              </Grid>
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme={config.buttons}
                leftIcon={<FaSave />}
                onClick={() => setPromo()}
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

        <Modal
          isOpen={modalSize}
          onClose={() => setModalSize(false)}
          isCentered
          scrollBehavior="inside"
          size="xl"
        >
          <ModalOverlay />
          <ModalContent pb={4}>
            <ModalHeader>Estoque / Tamanhos</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box>
                {sizes.length === 0 ? (
                  <Flex justify="center" align="center" direction="column">
                    <Lottie
                      animation={emptyAnimation}
                      height={200}
                      width={200}
                    />
                    <Text>Nenhuma informação para mostrar</Text>
                  </Flex>
                ) : (
                  <Table size="sm">
                    <Thead fontWeight="700">
                      <Tr>
                        <Td>Tamanho</Td>
                        <Td>Cor</Td>
                        <Td isNumeric>Estoque</Td>
                        <Td w="15%" isNumeric></Td>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {sizes.map((siz) => (
                        <Tr key={siz.id} bg={siz.amount < 5 ? "red.100" : ""}>
                          <Td>{siz.size}</Td>
                          <Td>
                            <HStack spacing="10px">
                              <Box
                                w="60px"
                                h="25px"
                                bg={`#${siz.hex}`}
                                rounded="md"
                              />
                              <Text>{siz.name}</Text>
                            </HStack>
                          </Td>
                          <Td isNumeric>{siz.amount}</Td>
                          <Td w="15%" isNumeric>
                            <Tooltip label="Ajustar Estoque / Tamanho" hasArrow>
                              <IconButton
                                colorScheme={config.buttons}
                                size="xs"
                                icon={<FaEdit />}
                                rounded="full"
                                onClick={() => handleUpdateStock(siz.id)}
                              />
                            </Tooltip>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={modalGerImg}
          onClose={() => setModalGerImg(false)}
          isCentered
          scrollBehavior="inside"
          size="md"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Ajustar Estoque / Tamanhos</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Grid templateColumns="1fr 1fr" gap="15px">
                <FormControl>
                  <FormLabel>Tamanho</FormLabel>
                  <Input
                    placeholder="Tamanho"
                    value={size}
                    onChange={(e) => setSize(e.target.value.toUpperCase())}
                    focusBorderColor={config.inputs}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Estoque</FormLabel>
                  <NumberInput
                    id="lenght"
                    precision={0}
                    step={1}
                    focusBorderColor={config.inputs}
                    value={amount}
                    onChange={(e) => setAmount(e)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </Grid>
            </ModalBody>
            <ModalFooter>
              <Button
                leftIcon={<FaSave />}
                colorScheme={config.buttons}
                onClick={() => saveSizeUpdate()}
                isLoading={loadingSize}
              >
                Salvar
              </Button>
            </ModalFooter>
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
              <Grid templateColumns="1fr 1fr" gap="20px" justifyItems="center">
                <Box w="280px" h="320px">
                  <Text>Imagem atual:</Text>
                  <Image
                    src={`${baseUrl}/imagem/${url}`}
                    w="280px"
                    h="310px"
                    rounded="md"
                  />
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
      </Hotkeys>
    </>
  );
}
