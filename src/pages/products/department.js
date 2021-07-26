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
  Flex,
  IconButton,
  Tooltip,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import config from "../../configs/index";
import HeaderApp from "../../components/headerApp";
import { AiFillShop, AiOutlineClose } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import {
  FaSave,
  FaEdit,
  FaImage,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { InputFile, File } from "../../style/uploader";
import Hotkeys from "react-hot-keys";
import useFetch from "../../hooks/useFetch";
import Lottie from "../../components/lottie";
import emptyAnimation from "../../animations/empty.json";
import api from "../../configs/axios";
import { useEmployee } from "../../context/Employee";
import { mutate as mutateGlobal } from "swr";
import searchAnimation from "../../animations/search.json";

export default function DepartmentList() {
  const { colorMode } = useColorMode();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState("0");
  const [searchText, setSearchText] = useState("");
  const { data, error, mutate } = useFetch(
    `/departmentsPagination/${page}/${searchText === "" ? "All" : searchText}`
  );
  const toast = useToast();
  const { employee } = useEmployee();

  const [modalInfo, setModalInfo] = useState(false);
  const [modalImage, setModalImage] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [idDepartment, setIdDepartment] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    if (data) {
      setDepartments(data.departments);
      handlePagination(data.count.count);
    }
  }, [data]);

  function handlePagination(num) {
    const divisor = parseFloat(num) / 10;
    if (divisor > parseInt(divisor) && divisor < parseInt(divisor) + 1) {
      setPages(parseInt(divisor) + 1);
    } else {
      setPages(parseInt(divisor));
    }
  }

  const previewThumbnail = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  async function removeThumbnail() {
    await URL.revokeObjectURL(thumbnail);
    setThumbnail(null);
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

  function onKeyDown(keyName, e, handle) {
    if (keyName === "f3") {
      const inpt = document.getElementById("search");
      inpt.focus();
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

  async function handleUpdateInfo() {
    if (name === "") {
      return false;
    }
    if (description === "") {
      return false;
    }
    setLoadingInfo(true);

    try {
      const response = await api.put(
        `/departments/${idDepartment}`,
        {
          name,
          description,
        },
        { headers: { "x-access-token": employee.token } }
      );
      const updatedDepartments = await data.departments.map((dep) => {
        if (dep.id === idDepartment) {
          return {
            ...dep,
            name: response.data.department[0].name,
            description: response.data.department[0].description,
          };
        }
        return dep;
      });

      let info = { departments: updatedDepartments, count: data.count };

      mutate(info, false);
      mutateGlobal(`/departments/${idDepartment}`, {
        id: idDepartment,
        name: response.data.department[0].name,
        description: response.data.department[0].description,
      });
      showToast(response.data.message, "success", "Sucesso");
      setLoadingInfo(false);
      setModalInfo(false);
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

  async function handleActive(value, id) {
    try {
      const response = await api.put(
        `/activeDepartment/${id}`,
        { active: value },
        { headers: { "x-access-token": employee.token } }
      );
      const updatedDepartments = await data.departments.map((dep) => {
        if (dep.id === id) {
          return {
            ...dep,
            active: response.data.department[0].active,
          };
        }
        return dep;
      });

      let info = { departments: updatedDepartments, count: data.count };

      mutate(info, false);
      mutateGlobal(`/activeDepartment/${id}`, {
        id: id,
        active: response.data.department[0].active,
      });
      showToast(response.data.message, "success", "Sucesso");
    } catch (error) {
      console.log("ERRO", error);
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

  async function handleUpdateImage() {
    if (!thumbnail) {
      return false;
    }
    setLoadingImage(true);
    try {
      let dataImage = new FormData();
      dataImage.append("thumbnail", thumbnail);
      const response = await api.put(
        `/departmentsChangeImage/${idDepartment}`,
        dataImage,
        { headers: { "x-access-token": employee.token } }
      );
      setThumbnail(null);
      removeThumbnail();
      const updatedDepartments = await data.departments.map((dep) => {
        if (dep.id === idDepartment) {
          return {
            ...dep,
            thumbnail: response.data.url,
            blobName: response.data.blobName,
          };
        }
        return dep;
      });

      let info = { departments: updatedDepartments, count: data.count };

      mutate(info, false);
      mutateGlobal(`/departmentsChangeImage/${idDepartment}`, {
        id: idDepartment,
        thumbnail: response.data.url,
        blobName: response.data.blobName,
      });
      showToast(response.data.message, "success", "Sucesso");
      setModalImage(false);
      setLoadingImage(false);
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
              value={searchText}
              onChange={(e) =>
                setSearchText(capitalizeFirstLetter(e.target.value))
              }
            />
          </FormControl>
          <Divider mt={5} mb={5} />
          {!departments ? (
            <Flex justify="center" align="center" direction="column">
              <Lottie animation={searchAnimation} height={200} width={200} />
              <Text>Buscando Informações</Text>
            </Flex>
          ) : (
            <>
              {departments.length === 0 ? (
                <Flex justify="center" align="center" direction="column">
                  <Lottie animation={emptyAnimation} height={200} width={200} />
                  <Text>Nenhum departamento para mostrar</Text>
                </Flex>
              ) : (
                <>
                  <Table size="sm">
                    <Thead fontWeight="700">
                      <Tr>
                        <Td w="5%" textAlign="center">
                          Ativo?
                        </Td>
                        <Td w="35%">Nome</Td>
                        <Td w="50%">Descrição</Td>
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
                              onChange={(e) =>
                                handleActive(e.target.checked, dep.id)
                              }
                              size="sm"
                            />
                          </Td>
                          <Td w="35%">{dep.name}</Td>
                          <Td w="50%">
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
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>

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
                      isDisabled={
                        parseInt(page) >= parseInt(pages) ? true : false
                      }
                    >
                      Próxima
                    </Button>
                  </Flex>
                </>
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
              <Button
                colorScheme={config.buttons}
                leftIcon={<FaSave />}
                isLoading={loadingInfo}
                onClick={() => handleUpdateInfo()}
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
                onClick={() => handleUpdateImage()}
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
