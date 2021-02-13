import React, { useEffect, useState, useRef } from "react";
import {
  IconButton,
  Box,
  Grid,
  FormControl,
  Input,
  Select,
  FormLabel,
  Button,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Table,
  Tbody,
  Thead,
  Tr,
  Td,
  Tooltip,
  useToast,
  SkeletonText,
  Kbd,
  Icon,
} from "@chakra-ui/react";
import { FaMapMarkedAlt, FaSave, FaSearch, FaCheck } from "react-icons/fa";
import config from "../../configs";
import Headerapp from "../../components/headerApp";
import InputMask from "react-input-mask";
import useFetch from "../../hooks/useFetch";
import Hotkeys from "react-hot-keys";
import { AiOutlineEnter } from "react-icons/ai";

export default function Endereco() {
  const toast = useToast();
  const { data, error } = useFetch("/clients");
  const initialRef = useRef();

  const [modalClient, setModalClient] = useState(false);
  const [clients, setClients] = useState([]);
  const [findClient, setFindClient] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientName, setClientName] = useState("");

  useEffect(() => {
    setClients(data);
  }, [data]);

  useEffect(() => {
    finderClientsBySource(findClient);
  }, [findClient]);

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom-right",
    });
  }

  async function finderClientsBySource(text) {
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

  if (error) {
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

  function capitalizeFirstLetter(string) {
    let splited = string.split(" ");
    let toJoin = splited.map((e) => {
      return e.charAt(0).toUpperCase() + e.slice(1);
    });
    let joined = toJoin.join(" ");
    return joined;
  }

  function handleFindClient(id) {
    const result = clients.find((obj) => obj._id === id);
    setClientId(result._id);
    setClientName(result.name);
    setModalClient(false);
  }

  function onKeyDown(keyName, e, handle) {
    if (keyName === "f3") {
      setModalClient(true);
    }
  }

  return (
    <>
      <Hotkeys keyName="f3" onKeyDown={onKeyDown} allowRepeat>
        <Headerapp title="Cadastro de Endereços" icon={FaMapMarkedAlt} />

        <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
          <Grid templateColumns="1fr 200px" gap="15px">
            <Input
              placeholder="Cliente"
              focusBorderColor={config.inputs}
              isReadOnly
              value={clientName}
            />
            <Button
              leftIcon={<FaSearch />}
              onClick={() => setModalClient(true)}
            >
              Buscar Cliente{" "}
              <Kbd ml={3} color="ButtonText">
                F3
              </Kbd>
            </Button>
          </Grid>
          <Divider mt={5} mb={5} />
          <Grid templateColumns="1fr 100px" gap="15px">
            <FormControl id="avenue" isRequired>
              <FormLabel>Logradouro</FormLabel>
              <Input
                placeholder="Logradouro"
                focusBorderColor={config.inputs}
              />
            </FormControl>
            <FormControl id="number" isRequired>
              <FormLabel>Numero</FormLabel>
              <Input
                placeholder="Numero"
                focusBorderColor={config.inputs}
                type="number"
              />
            </FormControl>
          </Grid>
          <Grid templateColumns="1fr" gap="15px" mt={3}>
            <FormControl id="comp">
              <FormLabel>Complemento</FormLabel>
              <Input
                placeholder="Complemento"
                focusBorderColor={config.inputs}
              />
            </FormControl>
          </Grid>
          <Grid templateColumns="1fr 1fr 180px" gap="15px" mt={3}>
            <FormControl id="cep" isRequired>
              <FormLabel>CEP</FormLabel>
              <InputMask
                mask="99.999-999"
                className="mask-chakra"
                placeholder="CEP"
              />
            </FormControl>
            <FormControl id="city" isRequired>
              <FormLabel>Cidade</FormLabel>
              <Input
                placeholder="Cidade"
                focusBorderColor={config.inputs}
                type="text"
              />
            </FormControl>
            <FormControl id="uf" isRequired>
              <FormLabel>UF</FormLabel>
              <Select
                placeholder="Selecione"
                variant="outline"
                focusBorderColor={config.inputs}
              >
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
            </FormControl>
          </Grid>
          <Divider mt={5} mb={5} />
          <Button leftIcon={<FaSave />} colorScheme="blue" size="lg">
            Cadastrar{" "}
            <Kbd ml={3} color="ButtonText">
              <Icon as={AiOutlineEnter} />
            </Kbd>
          </Button>
        </Box>

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
                  setFindClient(capitalizeFirstLetter(e.target.value))
                }
              />
              <Box p={2} borderWidth="1px" rounded="md" mt={3}>
                {clients ? (
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
                            <Tr key={client._id}>
                              <Td>{client.name}</Td>
                              <Td w="10%" textAlign="center">
                                <Tooltip label="Selecionar cliente" hasArrow>
                                  <IconButton
                                    aria-label="Search database"
                                    icon={<FaCheck />}
                                    size="xs"
                                    isRound
                                    colorScheme="blue"
                                    onClick={() => handleFindClient(client._id)}
                                  />
                                </Tooltip>
                              </Td>
                            </Tr>
                          ))}
                        </>
                      )}
                    </Tbody>
                  </Table>
                ) : (
                  <SkeletonText noOfLines={4} spacing="4" />
                )}
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Hotkeys>
    </>
  );
}
