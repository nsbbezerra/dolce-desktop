import React, { useState, useEffect } from "react";
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
  Input,
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
  Textarea,
  useColorMode,
  Image,
  Divider,
  useToast,
  Stack,
  Skeleton,
  Flex,
} from "@chakra-ui/react";
import config from "../../configs/index";
import HeaderApp from "../../components/headerApp";
import { AiFillShop } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaSave, FaEdit, FaImage } from "react-icons/fa";
import { InputFile, File } from "../../style/uploader";
import Hotkeys from "react-hot-keys";
import useFetch from "../../hooks/useFetch";
import Lottie from "../../components/lottie";
import emptyAnimation from "../../animations/empty.json";
import api from "../../configs/axios";

export default function DepartmentList() {
  const { colorMode } = useColorMode();
  const { data, error, mutate } = useFetch("/departments");
  const toast = useToast();

  const [modalInfo, setModalInfo] = useState(false);
  const [modalImage, setModalImage] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [findDep, setFindDep] = useState("");
  const [idDepartment, setIdDepartment] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    console.log(data);
    setDepartments(data);
  }, [data]);

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

  async function finderDepBySource(text) {
    setFindDep(text);
    if (text === "") {
      await setDepartments(data);
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

  function capitalizeFirstLetter(string) {
    let splited = string.split(" ");
    let toJoin = splited.map((e) => {
      return e.charAt(0).toUpperCase() + e.slice(1);
    });
    let joined = toJoin.join(" ");
    return joined;
  }

  function capitalizeOneLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async function handleDepartment(id) {
    const result = await departments.find((obj) => obj.id === id);
    setName(result.name);
    setDescription(result.description);
    setIdDepartment(result.id);
    setModalInfo(true);
  }

  async function handleThumbnail(id) {
    const result = await departments.find((obj) => obj.id === id);
    setUrl(result.thumbnail);
    setIdDepartment(result.id);
    setModalImage(true);
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
        <HeaderApp title="Gerenciar Departamentos" icon={AiFillShop} />

        <Box borderWidth="1px" shadow="md" rounded="md" p={3} mt="25px">
          <FormControl>
            <FormLabel>Pressione F3 para buscar</FormLabel>
            <Input
              id="search"
              type="text"
              placeholder="Digite para buscar"
              focusBorderColor={config.inputs}
              value={findDep}
              onChange={(e) =>
                finderDepBySource(capitalizeFirstLetter(e.target.value))
              }
            />
          </FormControl>
          <Divider mt={5} mb={5} />
          {!departments ? (
            <Stack mt={3}>
              <Skeleton height="30px" />
              <Skeleton height="30px" />
              <Skeleton height="30px" />
              <Skeleton height="30px" />
            </Stack>
          ) : (
            <>
              {departments.length === 0 ? (
                <Flex justify="center" align="center" direction="column">
                  <Lottie animation={emptyAnimation} height={200} width={200} />
                  <Text>Nenhum departamento para mostrar</Text>
                </Flex>
              ) : (
                <Table size="sm">
                  <Thead fontWeight="700">
                    <Tr>
                      <Td w="5%" textAlign="center">
                        Ativo?
                      </Td>
                      <Td w="25%">Nome</Td>
                      <Td w="70%">Descrição</Td>
                      <Td w="10%"></Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {departments.map((dep) => (
                      <Tr key={dep.id}>
                        <Td w="5%" textAlign="center">
                          <Switch
                            colorScheme={config.switchs}
                            defaultIsChecked={dep.active}
                          />
                        </Td>
                        <Td w="25%">{dep.name}</Td>
                        <Td w="70%">
                          <Text w="60vw" isTruncated noOfLines={1}>
                            {dep.description}
                          </Text>
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
                                onClick={() => handleDepartment(dep.id)}
                              >
                                Editar Informações
                              </MenuItem>
                              <MenuItem
                                icon={<FaImage />}
                                onClick={() => handleThumbnail(dep.id)}
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
          size="xl"
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
                  value={name}
                  onChange={(e) =>
                    setName(capitalizeFirstLetter(e.target.value))
                  }
                />
              </FormControl>
              <FormControl mt={5}>
                <FormLabel>Descrição</FormLabel>
                <Textarea
                  focusBorderColor={config.inputs}
                  value={description}
                  onChange={(e) =>
                    setDescription(capitalizeOneLetter(e.target.value))
                  }
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme={config.buttons} leftIcon={<FaSave />}>
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
                <Box w="250px" h="270px">
                  <Text>Nova imagem:</Text>
                  <InputFile alt={250} lar={250} cor={colorMode}>
                    <File type="file" />
                    <FaImage style={{ fontSize: 50, marginBottom: 20 }} />
                    <Text>Insira uma imagem 300x300 pixels, de até 500kb</Text>
                  </InputFile>
                </Box>
              </Grid>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme={config.buttons} leftIcon={<FaSave />}>
                Salvar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Hotkeys>
    </>
  );
}
