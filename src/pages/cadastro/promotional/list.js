import React, { useState, memo, useEffect, useMemo } from "react";
import {
  Table,
  Tbody,
  Td,
  Thead,
  Tr,
  Switch,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useToast,
  Flex,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Image,
  IconButton,
  useColorMode,
  FormControl,
  FormLabel,
  ModalFooter,
} from "@chakra-ui/react";
import Lottie from "../../../components/lottie";
import emptyAnimation from "../../../animations/empty.json";
import useFetch from "../../../hooks/useFetch";
import config from "../../../configs/index";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaImage, FaSave, FaTrash } from "react-icons/fa";
import { mutate as mutateGlobal } from "swr";
import { InputFile, File } from "../../../style/uploader";
import api from "../../../configs/axios";
import { useEmployee } from "../../../context/Employee";

function ListTags() {
  const toast = useToast();
  const { colorMode } = useColorMode();
  const { employee } = useEmployee();
  const { data, error, mutate } = useFetch("/tags");

  const [tags, setTags] = useState([]);
  const [modalBanner, setModalBanner] = useState(false);
  const [idTag, setIdTag] = useState(null);
  const [banner, setBanner] = useState("");
  const [loading, setLoading] = useState(false);

  const [thumbnail, setThumbnail] = useState(null);

  const previewThumbnail = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  async function removeThumbnail() {
    await URL.revokeObjectURL(thumbnail);
    setThumbnail(null);
  }

  useEffect(() => {
    if (data) {
      setTags(data);
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

  function handleBanner(id, banner) {
    setIdTag(id);
    setBanner(banner);
    setModalBanner(true);
  }

  async function saveBanner() {
    if (!thumbnail) {
      showToast("Insira uma imagem", "warning", "Atenção");
      return false;
    }

    setLoading(true);
    let dataBanner = new FormData();
    dataBanner.append("banner", thumbnail);

    try {
      const response = await api.put(`/updateTagBanner/${idTag}`, dataBanner, {
        headers: { "x-access-token": employee.token },
      });
      const updated = await data.map((bann) => {
        if (bann.id === idTag) {
          return { ...bann, banner: response.data.tags[0].banner };
        }
        return bann;
      });
      mutate(updated, false);
      mutateGlobal(`/updateTagBanner/${idTag}`, {
        id: idTag,
        banner: response.data.tags[0].banner,
      });
      showToast(response.data.message, "success", "Sucesso");
      setThumbnail(null);
      removeThumbnail();
      setModalBanner(false);
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
  }

  async function active(id, value) {
    try {
      const response = await api.put(
        `/updateTagInfo/${id}`,
        { active: value },
        { headers: { "x-access-token": employee.token } }
      );
      console.log(response);
      const updated = await data.map((bann) => {
        if (bann.id === idTag) {
          return { ...bann, active: response.data.tags[0].active };
        }
        return bann;
      });
      mutate(updated, false);
      mutateGlobal(`/updateTagInfo/${id}`, {
        id: idTag,
        active: response.data.tags[0].active,
      });
      showToast(response.data.message, "success", "Sucesso");
    } catch (error) {
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
  }

  return (
    <>
      {tags.length === 0 ? (
        <Flex justify="center" align="center" direction="column">
          <Lottie animation={emptyAnimation} height={200} width={200} />
          <Text>Nenhuma promoção para mostrar</Text>
        </Flex>
      ) : (
        <Table size="sm">
          <Thead>
            <Tr fontWeight="700">
              <Td w="5%">Ativo?</Td>
              <Td w="30%">Nome</Td>
              <Td isNumeric>Desconto</Td>
              <Td w="10%"></Td>
            </Tr>
          </Thead>

          <Tbody>
            {tags.map((tg) => (
              <Tr key={tg.id}>
                <Td w="5%">
                  <Switch
                    colorScheme={config.switchs}
                    size="sm"
                    defaultIsChecked={tg.active}
                    onChange={(e) => active(tg.id, e.target.checked)}
                  />
                </Td>
                <Td w="30%">{tg.name}</Td>
                <Td isNumeric>{parseFloat(tg.discount)}%</Td>
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
                        icon={<FaImage />}
                        onClick={() => handleBanner(tg.id, tg.banner)}
                      >
                        Alterar Banner
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Modal
        isOpen={modalBanner}
        onClose={() => setModalBanner(false)}
        size="xl"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxW="1150px">
          <ModalHeader>Alterar Banner</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={5}>
              <FormLabel>Banner Atual</FormLabel>
              <Flex justify="center" align="center">
                <Box w="1100px" h="300px" rounded="md" overflow="hidden">
                  <Image
                    src={`${config.url}/imagem/${banner}`}
                    w="1100px"
                    h="300px"
                    objectFit="cover"
                  />
                </Box>
              </Flex>
            </FormControl>

            <FormControl>
              <FormLabel>Novo Banner</FormLabel>
              <Flex justify="center" align="center">
                {thumbnail ? (
                  <Box w="1100px" h="300px" rounded="md" overflow="hidden">
                    <Image
                      src={previewThumbnail}
                      w="1100px"
                      h="300px"
                      objectFit="cover"
                    />
                    <IconButton
                      rounded="full"
                      icon={<FaTrash />}
                      colorScheme="red"
                      mt={-20}
                      ml={"540px"}
                      onClick={() => removeThumbnail()}
                    />
                  </Box>
                ) : (
                  <InputFile alt={300} lar={1100} cor={colorMode}>
                    <File
                      type="file"
                      onChange={(e) => setThumbnail(e.target.files[0])}
                    />
                    <FaImage style={{ fontSize: 50, marginBottom: 20 }} />
                    <Text>Insira uma imagem 1100x300 pixels, de até 500kb</Text>
                  </InputFile>
                )}
              </Flex>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme={config.buttons}
              leftIcon={<FaSave />}
              isLoading={loading}
              onClick={() => saveBanner()}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default memo(ListTags);
