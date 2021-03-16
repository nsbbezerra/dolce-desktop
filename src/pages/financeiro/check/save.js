import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Button,
  Select,
  Textarea,
  Divider,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
  FormErrorMessage,
  SkeletonText,
  IconButton,
  Tooltip,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Text,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
} from "@chakra-ui/react";
import config from "../../../configs/index";
import { FaSave, FaSearch, FaCheck, FaCalendarAlt } from "react-icons/fa";
import InputMask from "react-input-mask";
import useFetch from "../../../hooks/useFetch";
import { useEmployee } from "../../../context/Employee";
import api from "../../../configs/axios";
import Lottie from "../../../components/lottie";
import emptyAnimation from "../../../animations/empty.json";
import pt_br from "date-fns/locale/pt-BR";
import DatePicker, { registerLocale } from "react-datepicker";

registerLocale("pt_br", pt_br);

export default function SaveCheck() {
  const toast = useToast();
  const { employee } = useEmployee();
  const { data, error } = useFetch("/clients");
  const initialRef = useRef();

  const [clients, setClients] = useState([]);
  const [modalClient, setModalClient] = useState(false);
  const [findClient, setFindClient] = useState("");
  const [clientId, setClientId] = useState(null);
  const [clientName, setClientName] = useState("");
  const [startDate, setStartDate] = useState(new Date());

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
    if (data) {
      setClients(data);
    }
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

  function handleFindClient(id) {
    const result = clients.find((obj) => obj.id === id);
    setClientId(result.id);
    setClientName(result.name);
    setModalClient(false);
  }

  async function finderClientsBySource(text) {
    setFindClient(text);
    if (text === "") {
      await setClients(data);
    } else {
      let termos = await text.split(" ");
      let frasesFiltradas = await clients.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.name.includes(termoBuscado);
        }, true);
      });
      await setClients(frasesFiltradas);
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

  const CustomInputPicker = ({ value, onClick }) => (
    <InputGroup>
      <InputLeftAddon>Data</InputLeftAddon>
      <Input focusBorderColor={config.inputs} value={value} onClick={onClick} />
      <InputRightElement pointerEvents="none" children={<FaCalendarAlt />} />
    </InputGroup>
  );

  return (
    <>
      <Grid templateColumns="1fr 300px 200px" gap="15px">
        <FormControl isRequired>
          <FormLabel>Selecione o Cliente</FormLabel>
          <HStack spacing={3}>
            <Input
              type="text"
              placeholder="Selecione o Cliente"
              focusBorderColor={config.inputs}
              isReadOnly
              value={clientName}
            />
            <Button
              leftIcon={<FaSearch />}
              colorScheme={config.buttons}
              variant="outline"
              w="110px"
              onClick={() => setModalClient(true)}
            >
              Buscar
            </Button>
          </HStack>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Número</FormLabel>
          <Input
            type="text"
            placeholder="Número"
            focusBorderColor={config.inputs}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Entidade</FormLabel>
          <Input
            type="text"
            placeholder="Entidade"
            focusBorderColor={config.inputs}
          />
        </FormControl>
      </Grid>

      <Grid mt={3} templateColumns="repeat(3, 1fr)" gap="15px">
        <FormControl isRequired>
          <FormLabel>Situação</FormLabel>
          <Select
            placeholder="Selecione"
            variant="outline"
            focusBorderColor={config.inputs}
          >
            <option value="credit">Aguardando</option>
            <option value="debit">Aprovado</option>
            <option value="debit">Recusado</option>
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Tipo de Cheque</FormLabel>
          <Select
            placeholder="Selecione"
            variant="outline"
            focusBorderColor={config.inputs}
          >
            <option value="credit">À Vista</option>
            <option value="debit">À Prazo</option>
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Valor do Cheque</FormLabel>
          <Input
            type="number"
            placeholder="Valor do Cheque"
            focusBorderColor={config.inputs}
          />
        </FormControl>
      </Grid>

      <Grid mt={3} templateColumns="repeat(2, 1fr)" gap="15px" w="40%">
        <FormControl isRequired>
          <FormLabel>Data da Emissão</FormLabel>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            customInput={<CustomInputPicker />}
            locale="pt_br"
            dateFormat="dd/MM/yyyy"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Vencimento</FormLabel>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            customInput={<CustomInputPicker />}
            locale="pt_br"
            dateFormat="dd/MM/yyyy"
          />
        </FormControl>
      </Grid>

      <Grid mt={3} templateColumns="1fr" gap="15px">
        <FormControl>
          <FormLabel>Observações</FormLabel>
          <Textarea resize="none" focusBorderColor={config.inputs} rows={2} />
        </FormControl>
      </Grid>

      <Divider mb={5} mt={5} />

      <Button size="lg" colorScheme={config.buttons} leftIcon={<FaSave />}>
        Salvar
      </Button>

      <Modal
        isOpen={modalClient}
        onClose={() => setModalClient(false)}
        size="xl"
        isCentered
        scrollBehavior="inside"
        initialFocusRef={initialRef}
      >
        <ModalOverlay />
        <ModalContent maxW="50rem">
          <ModalHeader>Buscar Cliente</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={5}>
            <Input
              ref={initialRef}
              placeholder="Digite um nome para buscar"
              focusBorderColor={config.inputs}
              value={findClient}
              onChange={(e) =>
                finderClientsBySource(capitalizeFirstLetter(e.target.value))
              }
            />
            {clients ? (
              <>
                {clients.length === 0 ? (
                  <Flex justify="center" align="center" direction="column">
                    <Lottie
                      animation={emptyAnimation}
                      height={200}
                      width={200}
                    />
                    <Text>Nenhum cliente para mostrar</Text>
                  </Flex>
                ) : (
                  <Table size="sm" variant="striped">
                    <Thead fontWeight="700">
                      <Tr>
                        <Td>Nome</Td>
                        <Td w="10%">Ações</Td>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {clients && (
                        <>
                          {clients.map((client) => (
                            <Tr key={client.id}>
                              <Td>{client.name}</Td>
                              <Td w="10%" textAlign="center">
                                <Tooltip label="Selecionar cliente" hasArrow>
                                  <IconButton
                                    aria-label="Search database"
                                    icon={<FaCheck />}
                                    size="xs"
                                    isRound
                                    colorScheme={config.buttons}
                                    onClick={() => handleFindClient(client.id)}
                                  />
                                </Tooltip>
                              </Td>
                            </Tr>
                          ))}
                        </>
                      )}
                    </Tbody>
                  </Table>
                )}
              </>
            ) : (
              <SkeletonText noOfLines={4} spacing="4" />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
