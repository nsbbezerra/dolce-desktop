import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Kbd,
  Switch,
  Table,
  Tbody,
  Td,
  Text,
  Thead,
  Tr,
  useToast,
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
  Textarea,
} from "@chakra-ui/react";
import useFetch from "../../hooks/useFetch";
import { useEmployee } from "../../context/Employee";
import api from "../../configs/axios";
import animationEmpty from "../../animations/empty.json";
import Lottie from "../../components/lottie";
import HeaderApp from "../../components/headerApp";
import { RiPriceTag2Fill } from "react-icons/ri";
import { mutate as mutateGlobal } from "swr";
import config from "../../configs";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaEdit, FaSave } from "react-icons/fa";
import Hotkeys from "react-hot-keys";

export default function ListSubCat() {
  const toast = useToast();
  const { employee } = useEmployee();

  const { data, mutate, error } = useFetch("/findSubCat");

  const [subCats, setSubCats] = useState([]);
  const [modalEdit, setModalEdit] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [idSubCat, setIdSubCat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  async function finderCatBySource(text) {
    setSearch(text);
    if (text === "") {
      await setSubCats(data);
    } else {
      let termos = await text.split(" ");
      let frasesFiltradas = await subCats.filter((frase) => {
        return termos.reduce((resultadoAnterior, termoBuscado) => {
          return resultadoAnterior && frase.name.includes(termoBuscado);
        }, true);
      });
      await setSubCats(frasesFiltradas);
    }
  }

  useEffect(() => {
    if (data) {
      setSubCats(data);
    }
  }, [data]);

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

  function handleEdit(id) {
    const result = subCats.find((obj) => obj.id === id);
    setName(result.name);
    setDescription(result.description);
    setIdSubCat(id);
    setModalEdit(true);
  }

  function capitalizeFirstLetter(string) {
    let splited = string.split(" ");
    let toJoin = splited.map((e) => {
      return e.charAt(0).toUpperCase() + e.slice(1);
    });
    let joined = toJoin.join(" ");
    return joined;
  }

  async function sendUpdate() {
    setLoading(true);
    try {
      const response = await api.put(
        `/subCat/${idSubCat}`,
        { name, description },
        { headers: { "x-access-token": employee.token } }
      );

      const updated = await data.map((sub) => {
        if (sub.id === idSubCat) {
          return {
            ...sub,
            name: response.data.subCat[0].name,
            description: response.data.subCat[0].description,
          };
        }
        return sub;
      });

      mutate(updated, false);
      mutateGlobal(`/subCat/${idSubCat}`, {
        id: idSubCat,
        name: response.data.subCat[0].name,
        description: response.data.subCat[0].description,
      });

      showToast(response.data.message, "success", "Sucesso");
      setLoading(false);
      setModalEdit(false);
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

  async function handleActive(id, value) {
    try {
      const response = await api.put(
        `/activeSubCat/${id}`,
        { active: value },
        { headers: { "x-access-token": employee.token } }
      );

      const updated = await data.map((sub) => {
        if (sub.id === id) {
          return { ...sub, active: response.data.sub_cat[0].active };
        }
        return sub;
      });

      mutate(updated, false);
      mutateGlobal(`/activeSubCat/${id}`, {
        id: id,
        active: response.data.sub_cat[0].active,
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
        <HeaderApp icon={RiPriceTag2Fill} title="Listagem de Sub-Categorias" />

        <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
          <FormControl>
            <FormLabel>
              Digite para Buscar <Kbd ml={3}>F3</Kbd>
            </FormLabel>
            <Input
              id="search"
              focusBorderColor={config.inputs}
              placeholder="Digite para Buscar"
              value={search}
              onChange={(e) =>
                finderCatBySource(capitalizeFirstLetter(e.target.value))
              }
            />
          </FormControl>
          <Divider mt={5} mb={5} />
          {subCats.length === 0 ? (
            <Flex justify="center" align="center" direction="column">
              <Lottie animation={animationEmpty} height={200} width={200} />
              <Text>Nenhuma Sub-Categoria para mostrar</Text>
            </Flex>
          ) : (
            <>
              <Table size="sm">
                <Thead fontWeight="700">
                  <Tr>
                    <Td w="5%">Ativo?</Td>
                    <Td w="42%">Nome</Td>
                    <Td w="42%">Categoria</Td>
                    <Td w="10%"></Td>
                  </Tr>
                </Thead>

                <Tbody>
                  {subCats.map((sub) => (
                    <Tr key={sub.id}>
                      <Td w="5%" textAlign="center">
                        <Switch
                          defaultIsChecked={sub.active}
                          size="sm"
                          colorScheme={config.switchs}
                          onChange={(e) =>
                            handleActive(sub.id, e.target.checked)
                          }
                        />
                      </Td>
                      <Td w="42%">{sub.name}</Td>
                      <Td w="42%">{sub.category_name}</Td>
                      <Td w="10%">
                        <Menu>
                          <MenuButton
                            as={Button}
                            rightIcon={<MdKeyboardArrowDown />}
                            colorScheme={config.buttons}
                            size="sm"
                            isFullWidth
                          >
                            Opções
                          </MenuButton>
                          <MenuList>
                            <MenuItem
                              icon={<FaEdit />}
                              onClick={() => handleEdit(sub.id)}
                            >
                              Editar Informações
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </>
          )}
        </Box>

        <Modal
          isOpen={modalEdit}
          onClose={() => setModalEdit(false)}
          size="xl"
          scrollBehavior="inside"
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Editar Informações</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>Nome</FormLabel>
                <Input
                  focusBorderColor={config.inputs}
                  placeholder="Nome"
                  value={name}
                  onChange={(e) =>
                    setName(capitalizeFirstLetter(e.target.value))
                  }
                />
              </FormControl>

              <FormControl mt={5}>
                <FormLabel>Descrição</FormLabel>
                <Textarea
                  rows={3}
                  value={description}
                  onChange={(e) =>
                    setDescription(capitalizeFirstLetter(e.target.value))
                  }
                  resize="none"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme={config.buttons}
                leftIcon={<FaSave />}
                isLoading={loading}
                onClick={() => sendUpdate()}
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
