import React, { useEffect, useState } from "react";
import {
  Grid,
  Select,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
  FormLabel,
  FormControl,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  IconButton,
  ButtonGroup,
  useToast,
  Text,
  Kbd,
} from "@chakra-ui/react";
import config from "../../../configs/index";
import { FaSearch, FaTrash, FaSave } from "react-icons/fa";
import api from "../../../configs/axios";
import useFetch from "../../../hooks/useFetch";
import { useEmployee } from "../../../context/Employee";
import Lottie from "../../../components/lottie";
import emptyAnimation from "../../../animations/empty.json";
import searchAnimation from "../../../animations/search.json";
import * as dateFns from "date-fns";
import { mutate as mutateGlobal } from "swr";
import Hotkeys from "react-hot-keys";

export default function ListCheck() {
  const toast = useToast();
  const { employee } = useEmployee();
  const { data, error, mutate } = useFetch("/checks");

  const [modalSituation, setModalSituation] = useState(false);
  const [modalType, setModalType] = useState(false);

  const [checks, setChecks] = useState([]);
  const [situation, setSituation] = useState("");
  const [status, setStatus] = useState("");
  const [idCheck, setIdCheck] = useState(null);

  const [loadingSituation, setLoadingSituation] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [loadingDel, setLoadingDel] = useState(false);

  useEffect(() => {
    setChecks(data);
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

  async function handleCheck(id, modal) {
    const result = await checks.find((obj) => obj.id === id);
    setIdCheck(result.id);
    setSituation(result.situation);
    setStatus(result.status);
    if (modal === "situation") {
      setModalSituation(true);
    } else {
      setModalType(true);
    }
  }

  async function updateSituation() {
    setLoadingSituation(true);
    try {
      const response = await api.put(
        `/situation/${idCheck}`,
        {
          situation: situation,
        },
        {
          headers: { "x-access-token": employee.token },
        }
      );
      const updatedCheck = await data.map((chq) => {
        if (chq.id === idCheck) {
          return { ...chq, situation: response.data.cheks[0].situation };
        }
        return chq;
      });
      mutate(updatedCheck, false);
      mutateGlobal(`/situation/${idCheck}`, {
        id: idCheck,
        situation: response.data.cheks[0].situation,
      });
      showToast(response.data.message, "success", "Sucesso");
      setLoadingSituation(false);
      setModalSituation(false);
    } catch (error) {
      setLoadingSituation(false);
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

  async function updateStatus() {
    setLoadingStatus(true);
    try {
      const response = await api.put(
        `/stats/${idCheck}`,
        {
          status: status,
        },
        {
          headers: { "x-access-token": employee.token },
        }
      );
      const updatedCheck = await data.map((chq) => {
        if (chq.id === idCheck) {
          return { ...chq, status: response.data.cheks[0].status };
        }
        return chq;
      });
      mutate(updatedCheck, false);
      mutateGlobal(`/stats/${idCheck}`, {
        id: idCheck,
        status: response.data.cheks[0].status,
      });
      showToast(response.data.message, "success", "Sucesso");
      setLoadingStatus(false);
      setModalType(false);
    } catch (error) {
      setLoadingStatus(false);
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

  async function removeCheck(id) {
    setLoadingDel(true);
    try {
      const response = await api.delete(`/checks/${id}`, {
        headers: { "x-access-token": employee.token },
      });
      const removedChecks = await data.filter((obj) => obj.id !== id);
      setChecks(removedChecks);
      showToast(response.data.message, "success", "Sucesso");
    } catch (error) {
      setLoadingDel(false);
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

  function onKeyDown(keyName, e, handle) {
    if (keyName === "f3") {
      let input = document.getElementById("search");
      input.focus();
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
        <Grid templateColumns="1fr" gap="15px">
          <FormControl>
            <FormLabel>
              Digite para buscar <Kbd ml={3}>F3</Kbd>
            </FormLabel>
            <Input
              type="text"
              id="search"
              placeholder="Digite para buscar"
              focusBorderColor={config.inputs}
            />
          </FormControl>
        </Grid>

        {!checks ? (
          <Flex justify="center" align="center" direction="column">
            <Lottie animation={searchAnimation} height={200} width={200} />
            <Text>Buscando Informações</Text>
          </Flex>
        ) : (
          <>
            {checks.length === 0 ? (
              <Flex justify="center" align="center" direction="column">
                <Lottie animation={emptyAnimation} height={200} width={200} />
                <Text>Nenhum cheque para mostrar</Text>
              </Flex>
            ) : (
              <Table size="sm" mt="25px">
                <Thead fontWeight="700">
                  <Tr>
                    <Td isTruncated>Cliente</Td>
                    <Td isTruncated>Número</Td>
                    <Td>Situação</Td>
                    <Td>Status</Td>
                    <Td>Emissão</Td>
                    <Td>Vencimento</Td>
                    <Td isNumeric w="15%">
                      Valor
                    </Td>
                    <Td w="3%" textAlign="center"></Td>
                  </Tr>
                </Thead>
                <Tbody>
                  {checks.map((chq) => (
                    <Tr key={chq.id}>
                      <Td isTruncated>{chq.name_client}</Td>
                      <Td isTruncated>{chq.number}</Td>
                      <Td>
                        <Tooltip label="Clique para alterar" hasArrow>
                          {(chq.situation === "okay" && (
                            <Button
                              isTruncated
                              noOfLines={1}
                              variant="link"
                              colorScheme="green"
                              size="sm"
                              onClick={() => handleCheck(chq.id, "situation")}
                            >
                              Aprovado
                            </Button>
                          )) ||
                            (chq.situation === "waiting" && (
                              <Button
                                isTruncated
                                noOfLines={1}
                                variant="link"
                                colorScheme="yellow"
                                size="sm"
                                onClick={() => handleCheck(chq.id, "situation")}
                              >
                                Aguardando
                              </Button>
                            )) ||
                            (chq.situation === "refused" && (
                              <Button
                                isTruncated
                                noOfLines={1}
                                variant="link"
                                colorScheme="red"
                                size="sm"
                                onClick={() => handleCheck(chq.id, "situation")}
                              >
                                Recusado
                              </Button>
                            ))}
                        </Tooltip>
                      </Td>
                      <Td>
                        <Tooltip label="Clique para alterar" hasArrow>
                          {chq.status === "in_cash" ? (
                            <Button
                              isTruncated
                              noOfLines={1}
                              variant="link"
                              colorScheme={config.buttons}
                              size="sm"
                              onClick={() => handleCheck(chq.id, "status")}
                            >
                              À Vista
                            </Button>
                          ) : (
                            <Button
                              isTruncated
                              noOfLines={1}
                              variant="link"
                              colorScheme={config.buttons}
                              size="sm"
                              onClick={() => handleCheck(chq.id, "status")}
                            >
                              À Prazo
                            </Button>
                          )}
                        </Tooltip>
                      </Td>
                      <Td>
                        {dateFns.format(new Date(chq.emission), "dd/MM/yyyy")}
                      </Td>
                      <Td>
                        {dateFns.format(new Date(chq.due_date), "dd/MM/yyyy")}
                      </Td>
                      <Td isNumeric w="15%">
                        {parseFloat(chq.value).toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </Td>
                      <Td w="3%" textAlign="center">
                        <Popover placement="bottom-end">
                          <PopoverTrigger>
                            <IconButton
                              icon={<FaTrash />}
                              rounded="full"
                              size="xs"
                              colorScheme="red"
                            />
                          </PopoverTrigger>
                          <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader>Confirmação!</PopoverHeader>
                            <PopoverBody>
                              Deseja excluir este cheque?
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
                                  colorScheme="red"
                                  colorScheme={config.buttons}
                                  isLoading={loadingDel}
                                  onClick={() => removeCheck(chq.id)}
                                >
                                  Sim
                                </Button>
                              </ButtonGroup>
                            </PopoverFooter>
                          </PopoverContent>
                        </Popover>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </>
        )}

        <Modal
          isOpen={modalSituation}
          onClose={() => setModalSituation(false)}
          size="sm"
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Alterar Situação do Cheque</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Situação</FormLabel>
                <Select
                  id="situation"
                  placeholder="Selecione"
                  variant="outline"
                  focusBorderColor={config.inputs}
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                >
                  <option value="waiting">Aguardando</option>
                  <option value="okay">Aprovado</option>
                  <option value="refused">Recusado</option>
                </Select>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme={config.buttons}
                leftIcon={<FaSave />}
                isLoading={loadingSituation}
                onClick={() => updateSituation()}
              >
                Salvar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={modalType}
          onClose={() => setModalType(false)}
          size="sm"
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Alterar Status do Cheque</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Tipo de Cheque</FormLabel>
                <Select
                  id="status"
                  placeholder="Selecione"
                  variant="outline"
                  focusBorderColor={config.inputs}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="in_cash">À Vista</option>
                  <option value="parceled_out">À Prazo</option>
                </Select>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme={config.buttons}
                leftIcon={<FaSave />}
                isLoading={loadingStatus}
                onClick={() => updateStatus()}
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
