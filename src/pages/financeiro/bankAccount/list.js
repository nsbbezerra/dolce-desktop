import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  Input,
  Button,
  Grid,
  Select,
  Table,
  Thead,
  Tbody,
  Td,
  Tr,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Switch,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Divider,
  Box,
  Flex,
  Icon,
  Text,
  InputGroup,
  InputRightElement,
  useToast,
  Image,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorMode,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import config from "../../../configs/index";
import {
  FaSave,
  FaSearch,
  FaEdit,
  FaCalendarAlt,
  FaImage,
} from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import {
  AiOutlineRise,
  AiOutlineFall,
  AiOutlineAreaChart,
  AiOutlineClose,
} from "react-icons/ai";
import DatePicker, { registerLocale } from "react-datepicker";
import pt_br from "date-fns/locale/pt-BR";
import { useEmployee } from "../../../context/Employee";
import api from "../../../configs/axios";
import { InputFile, File } from "../../../style/uploader";
import useFecth from "../../../hooks/useFetch";
import { mutate as mutateGlobal } from "swr";
import Lottie from "../../../components/lottie";
import emptyAnimation from "../../../animations/empty.json";
import searchAnimation from "../../../animations/search.json";
import sendAnimation from "../../../animations/send.json";

registerLocale("pt_br", pt_br);

export default function ListBankAccount() {
  const initialRef = useRef();
  const toast = useToast();
  const { data, error, mutate } = useFecth("/accountbank");
  const { employee } = useEmployee();
  const { colorMode } = useColorMode();

  const [modalEdit, setModalEdit] = useState(false);
  const [drawerMoviment, setDrawerMoviment] = useState(false);
  const [typeSearch, setTypeSearch] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [banks, setBanks] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [modalImage, setModalImage] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const [bank, setBank] = useState("");
  const [mode, setMode] = useState("");
  const [agency, setAgency] = useState("");
  const [account, setAccount] = useState("");
  const [variation, setVariation] = useState("");
  const [operation, setOperation] = useState("");
  const [amount, setAmount] = useState("0");
  const [idBank, setIdBank] = useState(null);
  const [url, setUrl] = useState("");

  useEffect(() => {
    console.log(data);
    setBanks(data);
  }, [data]);

  const DataAtual = new Date();
  const Ano = DataAtual.getFullYear();

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

  const previewThumbnail = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  async function removeThumbnail() {
    await URL.revokeObjectURL(thumbnail);
    setThumbnail(null);
  }

  function handleSearch(value) {
    setTypeSearch(parseInt(value));
  }

  const CustomInputPicker = ({ value, onClick }) => (
    <InputGroup>
      <Input focusBorderColor={config.inputs} value={value} onClick={onClick} />
      <InputRightElement pointerEvents="none" children={<FaCalendarAlt />} />
    </InputGroup>
  );

  async function handleInfo(id) {
    const result = await banks.find((obj) => obj.id === id);
    setIdBank(result.id);
    setBank(result.bank);
    setMode(result.mode);
    setAgency(result.agency);
    setAccount(result.account);
    setOperation(result.operation);
    setVariation(result.variation);
    setAmount(result.amount);
    setModalEdit(true);
  }

  async function handleImage(id) {
    const result = await banks.find((obj) => obj.id === id);
    setIdBank(result.id);
    setUrl(result.thumbnail);
    setModalImage(true);
  }

  async function saveBank() {
    setLoadingInfo(true);
    try {
      const response = await api.put(
        `/accountbank/${idBank}`,
        {
          bank,
          mode,
          agency,
          account,
          variation,
          operation,
          amount,
        },
        {
          headers: { "x-access-token": employee.token },
        }
      );
      const updatedBanks = await data.map((bnk) => {
        if (bnk.id === idBank) {
          return {
            ...bnk,
            bank: response.data.banks[0].bank,
            mode: response.data.banks[0].mode,
            agency: response.data.banks[0].agency,
            account: response.data.banks[0].account,
            variation: response.data.banks[0].variation,
            operation: response.data.banks[0].operation,
            amount: response.data.banks[0].amount,
          };
        }
        return bnk;
      });
      mutate(updatedBanks, false);
      mutateGlobal(`/accountbank/${idBank}`, {
        id: idBank,
        bank: response.data.banks[0].bank,
        mode: response.data.banks[0].mode,
        agency: response.data.banks[0].agency,
        account: response.data.banks[0].account,
        variation: response.data.banks[0].variation,
        operation: response.data.banks[0].operation,
        amount: response.data.banks[0].amount,
      });
      showToast(response.data.message, "success", "Sucesso");
      setModalEdit(false);
      setLoadingInfo(false);
    } catch (error) {
      setLoadingInfo(false);
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
      {!banks ? (
        <Flex justify="center" align="center" direction="column">
          <Lottie animation={searchAnimation} height={200} width={200} />
          <Text>Buscando Informações</Text>
        </Flex>
      ) : (
        <>
          {banks.length === 0 ? (
            <Flex justify="center" align="center" direction="column">
              <Lottie animation={emptyAnimation} height={200} width={200} />
              <Text>Nenhuma conta bancária para mostrar</Text>
            </Flex>
          ) : (
            <Table size="sm">
              <Thead fontWeight="700">
                <Tr>
                  <Td w="5%" textAlign="center"></Td>
                  <Td w="5%" textAlign="center">
                    Ativo?
                  </Td>
                  <Td>Banco</Td>
                  <Td w="10%">Tipo</Td>
                  <Td w="10%">Agencia</Td>
                  <Td w="10%">Conta</Td>
                  <Td w="7%">Operação</Td>
                  <Td w="7%">Variação</Td>
                  <Td isNumeric>Valor</Td>
                  <Td w="10%"></Td>
                </Tr>
              </Thead>
              <Tbody>
                {banks.map((bnk) => (
                  <Tr key={bnk.id}>
                    <Td w="5%" textAlign="center">
                      <Box w="25px" h="25px" rounded="lg" overflow="hidden">
                        <Image src={bnk.thumbnail} w="25px" h="25px" />
                      </Box>
                    </Td>
                    <Td w="5%" textAlign="center">
                      <Switch
                        id="email-alerts"
                        colorScheme={config.switchs}
                        size="sm"
                        defaultIsChecked={bnk.active}
                      />
                    </Td>
                    <Td>{bnk.bank}</Td>
                    <Td w="10%">
                      {bnk.mode === "current" ? "Conta Corrente" : "Poupança"}
                    </Td>
                    <Td w="10%">{bnk.agency}</Td>
                    <Td w="10%">{bnk.account}</Td>
                    <Td w="7%">{bnk.operation}</Td>
                    <Td w="7%">{bnk.variation}</Td>
                    <Td isNumeric>
                      {parseFloat(bnk.amount).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
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
                            onClick={() => handleInfo(bnk.id)}
                            icon={<FaEdit />}
                          >
                            Editar Informações
                          </MenuItem>
                          <MenuItem
                            onClick={() => handleImage(bnk.id)}
                            icon={<FaImage />}
                          >
                            Alterar Logomarca
                          </MenuItem>
                          <MenuItem
                            onClick={() => setDrawerMoviment(true)}
                            icon={<AiOutlineAreaChart />}
                          >
                            Movimentação Financeira
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
        size="xl"
        isOpen={modalEdit}
        onClose={() => setModalEdit(false)}
        isCentered
        initialFocusRef={initialRef}
      >
        <ModalOverlay />
        <ModalContent maxW="65rem">
          <ModalHeader>Editar Informações</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="3fr 1fr" gap="15px" mb={3}>
              <FormControl>
                <FormLabel>Banco</FormLabel>
                <Input
                  id="bank"
                  value={bank}
                  onChange={(e) =>
                    setBank(capitalizeAllFirstLetter(e.target.value))
                  }
                  type="text"
                  placeholder="Banco"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Tipo</FormLabel>
                <Select
                  focusBorderColor={config.inputs}
                  placeholder="Selecione uma opção"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  id="mode"
                >
                  <option value="current">Conta Corrente</option>
                  <option value="savings">Poupança</option>
                </Select>
              </FormControl>
            </Grid>

            <Grid templateColumns="repeat(5, 1fr)" gap="15px">
              <FormControl>
                <FormLabel>Agencia</FormLabel>
                <Input
                  id="agency"
                  value={agency}
                  onChange={(e) => setAgency(e.target.value.toUpperCase())}
                  type="text"
                  placeholder="Agencia"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Conta</FormLabel>
                <Input
                  id="account"
                  value={account}
                  onChange={(e) => setAccount(e.target.value.toUpperCase())}
                  type="text"
                  placeholder="Conta"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Variação</FormLabel>
                <Input
                  value={variation}
                  onChange={(e) => setVariation(e.target.value.toUpperCase())}
                  type="text"
                  placeholder="Variação"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Operação</FormLabel>
                <Input
                  value={operation}
                  onChange={(e) => setOperation(e.target.value.toUpperCase())}
                  type="text"
                  placeholder="Operação"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Valor</FormLabel>
                <NumberInput
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e)}
                  precision={2}
                  step={0.01}
                  focusBorderColor={config.inputs}
                  placeholder="Valor Inicial"
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
              variant="solid"
              colorScheme={config.buttons}
              leftIcon={<FaSave />}
              isLoading={loadingInfo}
              onClick={() => saveBank()}
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
        size="lg"
      >
        <ModalOverlay />
        <ModalContent maxW="650px">
          <ModalHeader>Alterar Imagem</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="1fr 1fr" gap="20px" justifyItems="center">
              <Box w="250px" h="270px">
                <Text>Imagem atual:</Text>
                <Image src={url} w="250px" h="250px" rounded="md" />
              </Box>
              <Box>
                <Text>Nova imagem:</Text>
                <Box w="250px" h="250px">
                  {thumbnail ? (
                    <Box rounded="md" borderWidth="1px" overflow="hidden">
                      <Image src={previewThumbnail} w="250px" h="250px" />
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
                    <InputFile alt={250} lar={250} cor={colorMode}>
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
              onClick={() => {}}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Drawer
        isOpen={drawerMoviment}
        placement="right"
        onClose={() => setDrawerMoviment(false)}
        size="xl"
        scrollBehavior="inside"
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Movimentação Financeira</DrawerHeader>

            <DrawerBody>
              <Grid templateColumns="1fr 150px 150px 150px" gap="15px">
                <FormControl>
                  <FormLabel>Selecione uma opção</FormLabel>
                  <Select
                    placeholder="Selecione uma opção de busca"
                    focusBorderColor={config.inputs}
                    onChange={(e) => handleSearch(e.target.value)}
                    value={typeSearch}
                  >
                    <option value={1}>Por Período</option>
                    <option value={2}>Por Mês</option>
                    <option value={3}>Por Ano</option>
                  </Select>
                </FormControl>
                {typeSearch === 1 ? (
                  <>
                    <FormControl>
                      <FormLabel>Período Inicial</FormLabel>
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        customInput={<CustomInputPicker />}
                        locale="pt_br"
                        dateFormat="dd/MM/yyyy"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Período Final</FormLabel>
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        customInput={<CustomInputPicker />}
                        locale="pt_br"
                        dateFormat="dd/MM/yyyy"
                      />
                    </FormControl>
                  </>
                ) : (
                  <>
                    <FormControl
                      isRequired
                      isDisabled={typeSearch === 3 ? true : false}
                    >
                      <FormLabel>Mês</FormLabel>
                      <Select
                        placeholder="Selecione um mês"
                        focusBorderColor={config.inputs}
                      >
                        <option value="Janeiro">Janeiro</option>
                        <option value="Fevereiro">Fevereiro</option>
                        <option value="Março">Março</option>
                        <option value="Abril">Abril</option>
                        <option value="Maio">Maio</option>
                        <option value="Junho">Junho</option>
                        <option value="Julho">Julho</option>
                        <option value="Agosto">Agosto</option>
                        <option value="Setembro">Setembro</option>
                        <option value="Outubro">Outubro</option>
                        <option value="Novembro">Novembro</option>
                        <option value="Dezembro">Dezembro</option>
                      </Select>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Ano</FormLabel>
                      <Select
                        placeholder="Selecione um ano"
                        focusBorderColor={config.inputs}
                      >
                        <option value={Ano - 1}>{Ano - 1}</option>
                        <option value={Ano}>{Ano}</option>
                        <option value={Ano + 1}>{Ano + 1}</option>
                        <option value={Ano + 2}>{Ano + 2}</option>
                        <option value={Ano + 3}>{Ano + 3}</option>
                      </Select>
                    </FormControl>
                  </>
                )}

                <FormControl>
                  <FormLabel color="transparent" userSelect="none">
                    Ano
                  </FormLabel>
                  <Button
                    isFullWidth
                    leftIcon={<FaSearch />}
                    colorScheme={config.buttons}
                    variant="outline"
                  >
                    Buscar
                  </Button>
                </FormControl>
              </Grid>

              <Divider mt={10} mb={10} />

              <Grid templateColumns="repeat(2, 1fr)" gap="15px">
                <Box borderWidth="1px" rounded="md" h="min-content">
                  <Flex p={2} align="center">
                    <Icon as={AiOutlineRise} mr={3} />
                    <Text fontWeight="700">Entradas</Text>
                  </Flex>
                  <Divider />
                  <Table size="sm">
                    <Thead fontWeight="700">
                      <Tr>
                        <Td w="60%">Data</Td>
                        <Td isNumeric>Valor</Td>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td w="60%">10/10/1000</Td>
                        <Td isNumeric>R$ 3000,00</Td>
                      </Tr>
                      <Tr>
                        <Td w="60%">10/10/1000</Td>
                        <Td isNumeric>R$ 3000,00</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Box>

                <Box borderWidth="1px" rounded="md" h="min-content">
                  <Flex p={2} align="center">
                    <Icon as={AiOutlineFall} mr={3} />
                    <Text fontWeight="700">Saídas</Text>
                  </Flex>
                  <Divider />
                  <Table size="sm">
                    <Thead fontWeight="700">
                      <Tr>
                        <Td w="60%">Data</Td>
                        <Td isNumeric>Valor</Td>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td w="60%">10/10/1000</Td>
                        <Td isNumeric>R$ 3000,00</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Box>
              </Grid>

              <Divider mt={10} mb={10} />

              <Box borderWidth="1px" rounded="md">
                <Table>
                  <Tbody>
                    <Tr>
                      <Td fontWeight="700" w="70%">
                        Total das Entradas
                      </Td>
                      <Td isNumeric color="green.400">
                        R$ 4000,00
                      </Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight="700" w="70%">
                        Total das Saídas
                      </Td>
                      <Td isNumeric color="red.400">
                        R$ 4000,00
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
}
