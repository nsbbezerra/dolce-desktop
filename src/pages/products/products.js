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
  Th,
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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
  Heading,
  Textarea,
  List,
  ListItem,
  ListIcon,
  Checkbox,
  Spinner,
  Stack,
} from "@chakra-ui/react";
import config from "../../configs/index";
import HeaderApp from "../../components/headerApp";
import { MdCheckCircle, MdKeyboardArrowDown } from "react-icons/md";
import {
  FaSave,
  FaTrash,
  FaEdit,
  FaImage,
  FaTag,
  FaBoxOpen,
  FaCalculator,
  FaArrowLeft,
  FaArrowRight,
  FaPlus,
  FaList,
  FaShippingFast,
} from "react-icons/fa";
import { InputFile, File } from "../../style/uploader";
import { AiOutlineClose } from "react-icons/ai";
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

export default function ProductList() {
  const { colorMode } = useColorMode();
  const toast = useToast();
  const { employee } = useEmployee();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState("0");
  const [advancedFind, setAdvancedFind] = useState("4");
  const [searchProduct, setSearchProduct] = useState("");
  const { data, error, mutate } = useFetch(
    `/products/${page}/${advancedFind}/${
      searchProduct === "" ? "All" : searchProduct
    }`
  );

  const [modalInfo, setModalInfo] = useState(false);
  const [modalImage, setModalImage] = useState(false);
  const [modalSize, setModalSize] = useState(false);
  const [modalPromo, setModalPromo] = useState(false);
  const [modalGerImg, setModalGerImg] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [products, setProducts] = useState([]);
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

  const [formato, setFormato] = useState("");

  /** STATES PRIMEIRA TAB */
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [barcode, setBarcode] = useState("");
  const [sku, setSku] = useState("");
  const [provider_code, setProvider_code] = useState("");

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
  const [icmsBaseCalc, setIcmsBaseCalc] = useState(0);
  const [icmsStBaseCalc, setIcmsStBaseCalc] = useState(0);
  const [fcpBaseCalc, setFcpBaseCalc] = useState(0);
  const [fcpStBaseCalc, setFcpStBaseCalce] = useState(0);
  const [pisBaseCalc, setPisBaseCalc] = useState(0);
  const [cofinsBaseCalc, setCofinsBaseCalc] = useState(0);

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

  const [modalInformation, setModalInformation] = useState(false);

  const [information, setInformation] = useState("");
  const [list, setList] = useState([]);
  const [listText, setListText] = useState("");
  const [loadingList, setLoadingList] = useState(false);

  const [promocao, setPromocao] = useState(false);
  const [loadingPromo, setLoadingPromo] = useState(false);
  const [tagsPromo, setTagsPromo] = useState([]);
  const [namePromo, setNamePromo] = useState("");
  const [idPromo, setIdPromo] = useState(0);

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

  function handlePagination(num) {
    const divisor = parseFloat(num) / 10;
    if (divisor > parseInt(divisor) && divisor < parseInt(divisor) + 1) {
      setPages(parseInt(divisor) + 1);
    } else {
      setPages(parseInt(divisor));
    }
  }

  useEffect(() => {
    if (page === "") {
      setPage("1");
    }
    if (parseInt(page) < 1) {
      setPage("1");
    }
  }, [page]);

  useEffect(() => {
    if (advancedFind !== "5" && searchProduct === "") {
      setSearchProduct("");
    }
  }, [advancedFind]);

  useEffect(() => {
    if (data) {
      setProducts(data.products);
      handlePagination(data.count.count);
      console.log(data);
    }
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
      if (searchProduct !== "") {
        if (advancedFind !== "5") {
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
  }

  function onKeyDown(keyName, e, handle) {
    if (keyName === "f3") {
      const inpt = document.getElementById("search");
      inpt.focus();
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
          tag_name: namePromo,
          tag_id: idPromo,
        },
        { headers: { "x-access-token": employee.token } }
      );
      const updatedProducts = await data.products.map((prod) => {
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
      const info = { products: updatedProducts, count: data.count };
      mutate(info, false);
      mutateGlobal(`/setPromotional/${productId}`, {
        id: productId,
        promotional: response.data.product[0].promotional,
        promotional_value: response.data.product[0].promotional_value,
        promotional_rate: response.data.product[0].promotional_rate,
      });
      setLoading(false);
      setNamePromo("");
      setIdPromo(0);
      setPromocao(false);
      setPromoRate(0);
      setPromoValue(0);
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
      console.log(response);
      const productsUpdated = await data.products.map((prod) => {
        if (prod.id === id) {
          return {
            ...prod,
            active: response.data.product[0].active,
          };
        }
        return prod;
      });
      const info = { products: productsUpdated, count: data.count };
      mutate(info, false);
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
    const result = await data.products.find((obj) => obj.id === id);
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
      const productUpdated = await data.products.map((prod) => {
        if (prod.id === productId) {
          return {
            ...prod,
            thumbnail: response.data[0].thumbnail,
          };
        }
        return prod;
      });
      const info = { products: productUpdated, count: data.count };
      mutate(info, false);
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
    setProvider_code(result.provider_code);
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
    setFormato(result.freight_format || "");
    setIcmsBaseCalc(result.icms_base_calc || 0);
    setIcmsStBaseCalc(result.imcs_st_base_calc || 0);
    setFcpBaseCalc(result.fcp_base_calc || 0);
    setFcpStBaseCalce(result.fcp_st_base_calc || 0);
    setPisBaseCalc(result.pis_base_calc || 0);
    setCofinsBaseCalc(result.cofins_base_calc || 0);
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
          provider_code,
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
          freight_format: formato,
          icms_base_calc: parseFloat(icmsBaseCalc),
          imcs_st_base_calc: parseFloat(icmsStBaseCalc),
          fcp_base_calc: parseFloat(fcpBaseCalc),
          fcp_st_base_calc: parseFloat(fcpStBaseCalc),
          pis_base_calc: parseFloat(pisBaseCalc),
          cofins_base_calc: parseFloat(cofinsBaseCalc),
        },
        {
          headers: { "x-access-token": employee.token },
        }
      );

      const updatedProducts = await data.products.map((prod) => {
        if (prod.id === productId) {
          return {
            ...prod,
            name: name,
            description: description,
            barcode: barcode,
            sku: sku,
            provider_code: provider_code,
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
            freight_format: formato,
            icms_base_calc: icmsBaseCalc,
            imcs_st_base_calc: icmsStBaseCalc,
            fcp_base_calc: fcpBaseCalc,
            fcp_st_base_calc: fcpStBaseCalc,
            pis_base_calc: pisBaseCalc,
            cofins_base_calc: cofinsBaseCalc,
          };
        }
        return prod;
      });
      const info = { products: updatedProducts, count: data.count };
      mutate(info, false);
      mutateGlobal(`/products/${productId}`, {
        id: productId,
        name: name,
        description: description,
        barcode: barcode,
        sku: sku,
        provider_code: provider_code,
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
        freight_format: formato,
        icms_base_calc: icmsBaseCalc,
        imcs_st_base_calc: icmsStBaseCalc,
        fcp_base_calc: fcpBaseCalc,
        fcp_st_base_calc: fcpStBaseCalc,
        pis_base_calc: pisBaseCalc,
        cofins_base_calc: cofinsBaseCalc,
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

  async function handleListInformation(id) {
    const result = await products.find((obj) => obj.id === id);
    if (result.list) {
      setList(result.list);
    } else {
      setList([]);
    }
    if (result.information) {
      setInformation(result.information);
    }
    setProductId(result.id);
    setModalInformation(true);
  }

  async function UpdateList() {
    if (information === "") {
      showToast("Escreva uma informação sobre o produto", "warning", "Atenção");
      return false;
    }
    if (list.length === 0) {
      showToast("Insira uma lista de especificações", "warning", "Atenção");
      return false;
    }
    setLoadingList(true);

    try {
      const response = await api.put(
        `/updateInfoAndList/${productId}`,
        { information, list: JSON.stringify(list) },
        { headers: { "x-access-token": employee.token } }
      );

      const updatedProducts = await data.products.map((prod) => {
        if (prod.id === productId) {
          return {
            ...prod,
            information: response.data.product[0].information,
            list: response.data.product[0].list,
          };
        }
        return prod;
      });

      const info = { products: updatedProducts, count: data.count };

      mutate(info, false);
      mutateGlobal(`/updateInfoAndList/${productId}`, {
        id: productId,
        information: response.data.product[0].information,
        list: response.data.product[0].list,
      });

      showToast(response.data.message, "success", "Sucesso");
      setLoadingList(false);
      setModalInformation(false);
    } catch (error) {
      setLoadingList(false);
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

  async function handleUsePromo(value) {
    if (value === false) {
      setPromocao(value);
      setPromoRate(0);
    } else {
      setPromocao(value);
      setLoadingPromo(true);

      try {
        const response = await api.get("/findActiveTags");
        setTagsPromo(response.data);
        setLoadingPromo(false);
      } catch (error) {
        setLoadingPromo(false);
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
  }

  function handleAddDiscount(discount, name, id) {
    setPromoRate(discount);
    setNamePromo(name);
    setIdPromo(id);
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
          <Grid templateColumns="1fr 3fr" gap="15px">
            <FormControl>
              <FormLabel>Selecione uma opção de busca:</FormLabel>
              <Grid templateColumns="1fr" gap="15px">
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
                  <option value={"5"}>Pesquisar por Nome</option>
                  <option value={"6"}>Pesquisar por Código</option>
                </Select>
              </Grid>
            </FormControl>
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
                  setSearchProduct(
                    advancedFind === "5"
                      ? capitalizeFirstLetter(e.target.value)
                      : e.target.value
                  )
                }
                isDisabled={
                  advancedFind === "5" || advancedFind === "6" ? false : true
                }
              />
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
                  <Thead>
                    <Tr>
                      <Th w="5%" textAlign="center">
                        Ativo?
                      </Th>
                      <Th w="5%" textAlign="center">
                        Promoção?
                      </Th>
                      <Th w="25%">Nome</Th>
                      <Th w="15%">Código</Th>
                      <Th w="15%" isNumeric>
                        Valor de Custo
                      </Th>
                      <Th w="15%" isNumeric>
                        Valor de Venda
                      </Th>
                      <Th w="15%" isNumeric>
                        Valor Promocional
                      </Th>
                      <Th w="10%" isNumeric>
                        Desconto
                      </Th>
                      <Th w="10%"></Th>
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
                            size="sm"
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
                            size="sm"
                          />
                        </Td>
                        <Td w="25%">{prod.name}</Td>
                        <Td w="15%" isTruncated>
                          {prod.sku}
                        </Td>
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
                            ? `${parseFloat(prod.promotional_rate)}%`
                            : "0%"}
                        </Td>
                        <Td w="10%">
                          <Menu>
                            <MenuButton
                              isFullWidth
                              as={Button}
                              rightIcon={<MdKeyboardArrowDown />}
                              size="xs"
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
                                icon={<FaList />}
                                onClick={() => handleListInformation(prod.id)}
                              >
                                Ajustar Especificações
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
              <Divider mt={5} mb={5} />
              <Flex justify="flex-end" align="center">
                <Button
                  size="sm"
                  colorScheme={config.buttons}
                  mr={2}
                  leftIcon={<FaArrowLeft />}
                  onClick={() => setPage(page - 1)}
                  isDisabled={page <= 1 ? true : false}
                >
                  Anterior
                </Button>
                <NumberInput
                  precision={0}
                  step={1}
                  focusBorderColor={config.inputs}
                  value={page}
                  onChange={(e) => setPage(e)}
                  size="sm"
                  w="70px"
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>

                <Text ml={2} mr={2}>
                  de
                </Text>
                <Input
                  size="sm"
                  w="70px"
                  focusBorderColor={config.inputs}
                  value={pages}
                  isReadOnly
                  type="number"
                  mr={2}
                />
                <Button
                  size="sm"
                  colorScheme={config.buttons}
                  rightIcon={<FaArrowRight />}
                  onClick={() => setPage(page + 1)}
                  isDisabled={parseInt(page) >= parseInt(pages) ? true : false}
                >
                  Próxima
                </Button>
              </Flex>
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
                        <Grid
                          templateColumns="1fr 150px 150px 150px"
                          gap="15px"
                        >
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

                          <FormControl>
                            <FormLabel>Cod. Fornecedor</FormLabel>
                            <Input
                              placeholder="Cod. Fornecedor"
                              focusBorderColor={config.inputs}
                              value={provider_code}
                              isReadOnly
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
                            <FormLabel>CST / CSOSN</FormLabel>
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

                        <Grid templateColumns="1fr 1fr" gap="10px" p={2}>
                          <FormControl>
                            <FormLabel>ICMS Base de Cálculo</FormLabel>
                            <NumberInput
                              precision={2}
                              step={0.01}
                              focusBorderColor={config.inputs}
                              value={icmsBaseCalc}
                              onChange={(e) => setIcmsBaseCalc(e)}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </FormControl>
                          <FormControl>
                            <FormLabel>ICMS ST Base de Cálculo</FormLabel>
                            <NumberInput
                              precision={2}
                              step={0.01}
                              focusBorderColor={config.inputs}
                              value={icmsStBaseCalc}
                              onChange={(e) => setIcmsStBaseCalc(e)}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
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
                          <FormControl>
                            <FormLabel>Base de Cálculo</FormLabel>
                            <NumberInput
                              precision={2}
                              step={0.01}
                              focusBorderColor={config.inputs}
                              value={pisBaseCalc}
                              onChange={(e) => setPisBaseCalc(e)}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </FormControl>
                        </Grid>

                        <FormControl p={2}>
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
                          <FormControl>
                            <FormLabel>Base de Cálculo</FormLabel>
                            <NumberInput
                              precision={2}
                              step={0.01}
                              focusBorderColor={config.inputs}
                              value={cofinsBaseCalc}
                              onChange={(e) => setCofinsBaseCalc(e)}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </FormControl>
                        </Grid>
                        <FormControl p={2}>
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
                      </Box>
                    </Grid>

                    <Grid templateColumns="repeat(1, 1fr)" gap={3} mt={3}>
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
                            <FormLabel>% Substituição Tributária</FormLabel>
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
                            <FormLabel>% FCP Retido</FormLabel>
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
                        <Grid templateColumns="repeat(5, 1fr)" gap="10px" p={2}>
                          <FormControl mr={3}>
                            <FormLabel>Mod. Base de Cálculo ST</FormLabel>
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
                          <FormControl>
                            <FormLabel>FCP Base de Cálculo</FormLabel>
                            <NumberInput
                              precision={2}
                              step={0.01}
                              focusBorderColor={config.inputs}
                              value={fcpBaseCalc}
                              onChange={(e) => setFcpBaseCalc(e)}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </FormControl>
                          <FormControl>
                            <FormLabel>FCP ST Base de Cálculo</FormLabel>
                            <NumberInput
                              precision={2}
                              step={0.01}
                              focusBorderColor={config.inputs}
                              value={fcpStBaseCalc}
                              onChange={(e) => setFcpStBaseCalce(e)}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
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

                    <Grid templateColumns="repeat(6, 1fr)" gap="15px">
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
                      <FormControl isRequired>
                        <FormLabel>Formato da Encomenda</FormLabel>
                        <Select
                          id="format"
                          focusBorderColor={config.inputs}
                          placeholder="Formato da Encomenda"
                          value={formato}
                          onChange={(e) => setFormato(e.target.value)}
                        >
                          <option value={"1"}>Formato Caixa/Pacote</option>
                          <option value={"2"}>Formato Rolo/Prisma</option>
                          <option value={"3"}>Envelope</option>
                        </Select>
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
              {promocao && (
                <>
                  {loadingPromo ? (
                    <Flex justify="center" align="center" mb={5}>
                      <Spinner size="lg" />
                    </Flex>
                  ) : (
                    <Stack mb={5}>
                      {tagsPromo.map((tg) => (
                        <Button
                          w="max-content"
                          size="sm"
                          colorScheme={config.buttons}
                          rounded="full"
                          key={tg.id}
                          onClick={() =>
                            handleAddDiscount(
                              parseFloat(tg.discount),
                              tg.name,
                              tg.id
                            )
                          }
                        >
                          {tg.name} - {parseFloat(tg.discount)}%
                        </Button>
                      ))}
                    </Stack>
                  )}
                </>
              )}
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
              <Checkbox
                colorScheme={config.buttons}
                size="lg"
                mr={4}
                defaultIsChecked={promocao}
                onChange={(e) => handleUsePromo(e.target.checked)}
              >
                Usar Promoções
              </Checkbox>
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
                    <Thead>
                      <Tr>
                        <Th>Tamanho</Th>
                        <Th isNumeric>Estoque</Th>
                        <Th w="15%" isNumeric></Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {sizes.map((siz) => (
                        <Tr key={siz.id} bg={siz.amount < 5 ? "red.100" : ""}>
                          <Td>{siz.size}</Td>
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
          <ModalContent maxW="670px">
            <ModalHeader>Alterar Imagem</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Grid templateColumns="1fr 1fr" gap="20px" justifyItems="center">
                <Box w="300px" h="300px">
                  <Text>Imagem atual:</Text>
                  <Image
                    src={`${baseUrl}/imagem/${url}`}
                    w="300px"
                    h="300px"
                    rounded="md"
                  />
                </Box>
                <Box>
                  <Text>Nova imagem:</Text>
                  <Box w="300px" h="300px">
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
                      <InputFile alt={300} lar={300} cor={colorMode}>
                        <File
                          type="file"
                          onChange={(event) =>
                            setThumbnail(event.target.files[0])
                          }
                        />
                        <FaImage style={{ fontSize: 50, marginBottom: 20 }} />
                        <Text>
                          Insira uma imagem 300x300 pixels, de até 500kb
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

        <Modal
          isOpen={modalInformation}
          onClose={() => setModalInformation(false)}
          isCentered
          scrollBehavior="inside"
          size="2xl"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Informação e Especificações</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Informação sobre o Produto</FormLabel>
                <Textarea
                  value={information}
                  focusBorderColor={config.inputs}
                  rows={5}
                  resize="none"
                  onChange={(e) =>
                    setInformation(capitalizeFirstLetter(e.target.value))
                  }
                />
              </FormControl>

              <FormControl mt={5}>
                <FormLabel>Lista de Especificações</FormLabel>
                <Grid templateColumns="1fr 180px" gap="15px">
                  <Input
                    focusBorderColor={config.inputs}
                    value={listText}
                    onChange={(e) =>
                      setListText(capitalizeFirstLetter(e.target.value))
                    }
                  />
                  <Button
                    leftIcon={<FaPlus />}
                    colorScheme={config.buttons}
                    onClick={() => handleList()}
                    variant="outline"
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
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme={config.buttons}
                leftIcon={<FaSave />}
                isLoading={loadingList}
                onClick={() => UpdateList()}
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
