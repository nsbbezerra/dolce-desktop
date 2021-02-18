import React, { useState, useEffect, useMemo } from "react";
import {
  Flex,
  Box,
  Grid,
  Text,
  FormLabel,
  FormControl,
  Input,
  Textarea,
  Divider,
  Button,
  useColorMode,
  useToast,
  Image,
  IconButton,
  Tooltip,
  FormErrorMessage,
  Kbd,
  Icon,
} from "@chakra-ui/react";
import { FaSave, FaImage } from "react-icons/fa";
import { AiFillShop, AiOutlineClose, AiOutlineEnter } from "react-icons/ai";
import config from "../../configs";
import HeaderApp from "../../components/headerApp";
import { InputFile, File } from "../../style/uploader";
import api from "../../configs/axios";
import Hotkeys from "react-hot-keys";
import { useEmployee } from "../../context/Employee";

export default function Departamento() {
  const toast = useToast();
  const { colorMode } = useColorMode();
  const { employee } = useEmployee();

  const [validators, setValidators] = useState([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    if (thumbnail) {
      let size = thumbnail.size / 1024;
      let thumbname = thumbnail.name;
      if (thumbname.includes(" ")) {
        handleValidator("image", "Nome da imagem não pode conter espaços");
      }
      if (size > 500) {
        handleValidator(
          "image",
          "Imagem maior que 500kb, insira uma imagem menor"
        );
      }
    } else {
      setValidators([]);
    }
  }, [thumbnail]);

  function handleValidator(path, message) {
    let val = [];
    let info = { path: path, message: message };
    val.push(info);
    setValidators(val);
    if (path !== "image") {
      const inpt = document.getElementById(path);
      inpt.focus();
    }
  }

  const previewThumbnail = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  async function removeThumbnail() {
    await URL.revokeObjectURL(thumbnail);
    setThumbnail(null);
    setValidators([]);
  }

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom-right",
    });
  }

  async function register(e) {
    if (e) {
      e.preventDefault();
    }
    if (!thumbnail) {
      handleValidator("image", "Selecione uma imagem");
      return false;
    }
    if (thumbnail.name.includes(" ")) {
      handleValidator("image", "Nome da imagem não pode conter espaços");
      return false;
    }
    let size = thumbnail.size / 1024;
    if (size > 500) {
      handleValidator(
        "image",
        "Imagem maior que 500kb, insira uma imagem menor"
      );
    }
    if (!name || name === "") {
      handleValidator("name", "Insira um nome para este departamento");
      return false;
    }
    if (!description || description === "") {
      handleValidator(
        "description",
        "Insira uma descrição para este departamento"
      );
      return false;
    }
    setLoading(true);
    try {
      let data = new FormData();
      data.append("name", name);
      data.append("description", description);
      data.append("thumbnail", thumbnail);
      const response = await api.post("/departments", data, {
        headers: { "x-access-token": employee.token },
      });
      setLoading(false);
      showToast(response.data.message, "success", "Sucesso");
      setName("");
      setDescription("");
      setThumbnail(null);
      setValidators([]);
    } catch (error) {
      setLoading(false);
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
    if (keyName === "return") {
      register(e);
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

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <>
      <Hotkeys
        keyName="return, enter"
        onKeyDown={onKeyDown}
        allowRepeat
        filter={(event) => {
          return true;
        }}
      >
        <HeaderApp title="Cadastro de Departamentos" icon={AiFillShop} />

        <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
          <Grid templateColumns="250px 1fr" gap="15px">
            <FormControl
              isRequired
              isInvalid={
                validators.find((obj) => obj.path === "image") ? true : false
              }
            >
              <FormLabel>Imagem</FormLabel>
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
                      onChange={(event) => setThumbnail(event.target.files[0])}
                    />
                    <FaImage style={{ fontSize: 50, marginBottom: 20 }} />
                    <Text>Insira uma imagem 300x300 pixels, de até 500kb</Text>
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
              <FormControl
                isRequired
                isInvalid={
                  validators.find((obj) => obj.path === "name") ? true : false
                }
              >
                <FormLabel>Nome do Departamento</FormLabel>
                <Input
                  id="name"
                  placeholder="Nome"
                  focusBorderColor={config.inputs}
                  value={name}
                  onChange={(e) =>
                    setName(capitalizeAllFirstLetter(e.target.value))
                  }
                />
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "name")
                    ? validators.find((obj) => obj.path === "name").message
                    : ""}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id="desc"
                isRequired
                mt={3}
                isInvalid={
                  validators.find((obj) => obj.path === "description")
                    ? true
                    : false
                }
              >
                <FormLabel>Descrição do Departamento</FormLabel>
                <Textarea
                  id="description"
                  placeholder="Descrição"
                  focusBorderColor={config.inputs}
                  resize="none"
                  value={description}
                  onChange={(e) =>
                    setDescription(capitalizeFirstLetter(e.target.value))
                  }
                />
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "description")
                    ? validators.find((obj) => obj.path === "description")
                        .message
                    : ""}
                </FormErrorMessage>
              </FormControl>
              <Divider mt={5} mb={5} />
              <Flex justify="flex-end">
                <Button
                  leftIcon={<FaSave />}
                  colorScheme="blue"
                  size="lg"
                  isLoading={loading}
                  onClick={() => register()}
                >
                  Cadastrar{" "}
                  <Kbd ml={3} color="ButtonText">
                    <Icon as={AiOutlineEnter} />
                  </Kbd>
                </Button>
              </Flex>
            </Box>
          </Grid>
        </Box>
      </Hotkeys>
    </>
  );
}
