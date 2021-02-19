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
} from "@chakra-ui/react";
import HeaderApp from "../../../components/headerApp";
import {
  FaTag,
  FaSave,
  FaArrowRight,
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

export default function Produtos() {
  const { colorMode } = useColorMode();
  const { employee } = useEmployee();
  const { data, error } = useFetch("/findDependents");
  const initialRef = useRef();

  const [tabIndex, setTabIndex] = useState(0);
  const [modalCategories, setModalCategories] = useState(false);
  const [modalDepartments, setModalDepartments] = useState(false);
  const [validators, setValidators] = useState([]);
  const [findCategories, setFindCategories] = useState("");
  const [findDepartments, setFindDepartments] = useState("");

  useEffect(() => {
    if (data) {
      setDepartments(data.departments);
      setCategories(data.categories);
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
  const [icsmOrigin, setIcmsOrigin] = useState("");
  const [icmsStRate, setIcmsStRate] = useState(0);
  const [icmsMVA, setIcmsMVA] = useState(0);
  const [icmsStModBc, setIcmsStModBc] = useState("");
  const [fcpRate, setFcpRate] = useState(0);
  const [fcpStRate, setFcpStRate] = useState(0);
  const [ipiRate, setIpiRate] = useState(0);
  const [ipiCode, setIpiCode] = useState("");
  const [ipiCst, setIpiCst] = useState("");

  /** STATES TERCEIRA TAB */
  const [margeLucro, setMargeLucro] = useState(0);
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

  function clear() {
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
    setMargeLucro(0);
    setCostValue(0);
    setOtherCost(0);
    setSaleValue(0);
    setProductWeight(0);
    setProductWidht(0);
    setProductHeight(0);
    setProductDiameter(0);
    setProductLength(0);
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

  function handleTabIndex() {
    if (tabIndex >= 4) {
      setTabIndex(0);
    } else {
      setTabIndex(tabIndex + 1);
    }
  }

  useEffect(() => {
    finderCategorieBySource(findCategories);
  }, [findCategories]);

  async function finderCategorieBySource(text) {
    if (text === "") {
      if (data) {
        await setCategories(data.categories);
      }
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

  useEffect(() => {
    finderDepartmentsBySource(findDepartments);
  }, [findDepartments]);

  async function finderDepartmentsBySource(text) {
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

  return (
    <>
      <HeaderApp title="Cadastro de Produtos" icon={FaTag} />

      <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
        <Grid templateColumns="repeat(2, 1fr)" gap="15px" alignContent="center">
          <HStack spacing="5px">
            <FormControl isRequired mr={3}>
              <FormLabel>Departamento</FormLabel>
              <Input
                placeholder="Departamento"
                w="350px"
                focusBorderColor={config.inputs}
              />
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
                Buscar Departamento
              </Button>
            </FormControl>
          </HStack>
          <HStack spacing="5px">
            <FormControl isRequired mr={3}>
              <FormLabel>Categoria</FormLabel>
              <Input
                placeholder="Departamento"
                w="350px"
                focusBorderColor={config.inputs}
              />
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
                Buscar Categoria
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
                          <FaImage style={{ fontSize: 50, marginBottom: 20 }} />
                          <Text>
                            Insira uma imagem 280x310 pixels, de até 500kb
                          </Text>
                        </InputFile>
                      )}
                    </Box>
                    <FormErrorMessage>
                      {validators.find((obj) => obj.path === "image")
                        ? validators.find((obj) => obj.path === "image").message
                        : ""}
                    </FormErrorMessage>
                  </FormControl>
                  <Box>
                    <Grid templateColumns="1fr 200px 200px" gap="15px">
                      <FormControl isRequired mr={3}>
                        <FormLabel>Nome do Produto</FormLabel>
                        <Input
                          placeholder="Nome"
                          focusBorderColor={config.inputs}
                        />
                      </FormControl>

                      <FormControl mr={3}>
                        <FormLabel>Cod. de Barras</FormLabel>
                        <Input
                          placeholder="Código de Barras"
                          focusBorderColor={config.inputs}
                        />
                      </FormControl>

                      <FormControl mr={3}>
                        <FormLabel>Cod. SKU</FormLabel>
                        <Input
                          placeholder="Código SKU"
                          focusBorderColor={config.inputs}
                        />
                      </FormControl>
                    </Grid>

                    <Grid templateColumns="1fr" mt={3} gap="15px">
                      <FormControl mr={3} isRequired>
                        <FormLabel>Descrição</FormLabel>
                        <Textarea
                          placeholder="Descrição"
                          resize="none"
                          focusBorderColor={config.inputs}
                        />
                      </FormControl>
                    </Grid>
                  </Box>
                </Grid>

                <Divider mt={5} mb={5} />
                <Button
                  leftIcon={<FaArrowRight />}
                  colorScheme="blue"
                  size="lg"
                  onClick={() => handleTabIndex()}
                >
                  Próximo
                </Button>
              </TabPanel>

              {/** TRIBUTAÇÕES */}
              <TabPanel>
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
                        <Select focusBorderColor={config.inputs}>
                          <option value={"101"}>
                            101 - Tributada pelo Simples Nacional com permissão
                            de crédito
                          </option>
                          <option value={"102"}>
                            102 - Tributada pelo Simples Nacional sem permissão
                            de crédito
                          </option>
                          <option value={"103"}>
                            103 - Isenção do ICMS no Simples Nacional para faixa
                            de receita bruta
                          </option>
                          <option value={"201"}>
                            201 - Tributada pelo Simples Nacional com permissão
                            de crédito e com cobrança do ICMS por substituição
                            tributária
                          </option>
                          <option value={"202"}>
                            202 - Tributada pelo Simples Nacional sem permissão
                            de crédito e com cobrança do ICMS por substituição
                            tributária
                          </option>
                          <option value={"203"}>
                            203 - Isenção do ICMS no Simples Nacional para faixa
                            de receita bruta e com cobrança do ICMS por
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
                        <Select focusBorderColor={config.inputs}>
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
                        <Select focusBorderColor={config.inputs}>
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
                    <Grid templateColumns="repeat(3, 1fr)" gap="10px" p={2}>
                      <FormControl mr={3}>
                        <FormLabel>Origem</FormLabel>
                        <Select focusBorderColor={config.inputs}>
                          <option value={"0"}>0 - Nacional</option>
                          <option value={"1"}>
                            1 - Estrangeira (importação direta)
                          </option>
                          <option value={"2"}>
                            2 - Estrangeira (adquirida no mercado interno)
                          </option>
                          <option value={"3"}>
                            3 - Nacional com mais de 40% de conteúdo estrangeiro
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
                          <Select focusBorderColor={config.inputs}>
                            <option value={"0"}>
                              Preço tabelado ou máximo sugerido
                            </option>
                            <option value={"1"}>Lista Negativa (valor)</option>
                            <option value={"2"}>Lista Positiva (valor)</option>
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
                        />
                      </FormControl>
                      <FormControl mr={3}>
                        <FormLabel>IPI CST</FormLabel>
                        <Select focusBorderColor={config.inputs}>
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
                          <option value={"53"}>53 – Saída Não Tributada</option>
                          <option value={"54"}>54 – Saída Imune</option>
                          <option value={"55"}>55 – Saída com Suspensão</option>
                          <option value={"99"}>99 – Outras Saídas</option>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Box>
                </Grid>
                <Divider mt={5} mb={5} />
                <Button
                  leftIcon={<FaArrowRight />}
                  colorScheme="blue"
                  size="lg"
                  onClick={() => handleTabIndex()}
                >
                  Próximo
                </Button>
              </TabPanel>

              {/** VALORES */}
              <TabPanel>
                <Grid templateColumns="repeat(4, 1fr)" gap="15px">
                  <FormControl isRequired mr={3}>
                    <FormLabel>Margem de Lucro %</FormLabel>
                    <NumberInput
                      precision={2}
                      step={0.01}
                      focusBorderColor={config.inputs}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  <FormControl isRequired mr={3}>
                    <FormLabel>Valor de Custo</FormLabel>
                    <NumberInput
                      precision={2}
                      step={0.01}
                      focusBorderColor={config.inputs}
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
                    <Input
                      placeholder="Outros Custos"
                      type="number"
                      focusBorderColor={config.inputs}
                    />
                  </FormControl>
                  <FormControl isRequired mr={3}>
                    <FormLabel>Valor de Venda</FormLabel>
                    <NumberInput
                      precision={2}
                      step={0.01}
                      focusBorderColor={config.inputs}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </Grid>
                <Button leftIcon={<FaCalculator />} mt={3}>
                  Calcular Preço de Venda
                </Button>

                <Divider mt={5} mb={5} />

                <Text fontSize="sm" color="red.400" mb={3}>
                  Preencha cada campo com a quantidade referente a 1 (um) item.
                </Text>

                <Grid templateColumns="repeat(5, 1fr)" gap="15px">
                  <FormControl isRequired mr={3}>
                    <FormLabel>Altura</FormLabel>
                    <NumberInput
                      precision={2}
                      step={0.01}
                      focusBorderColor={config.inputs}
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
                      precision={2}
                      step={0.01}
                      focusBorderColor={config.inputs}
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
                      precision={2}
                      step={0.01}
                      focusBorderColor={config.inputs}
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
                      precision={2}
                      step={0.01}
                      focusBorderColor={config.inputs}
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
                      precision={2}
                      step={0.01}
                      focusBorderColor={config.inputs}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </Grid>
                <Divider mt={5} mb={5} />
                <Button
                  leftIcon={<FaSave />}
                  colorScheme="blue"
                  size="lg"
                  onClick={() => handleTabIndex()}
                >
                  Salvar
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
                setFindCategories(capitalizeAllFirstLetter(e.target.value))
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
                setFindDepartments(capitalizeAllFirstLetter(e.target.value))
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
    </>
  );
}
