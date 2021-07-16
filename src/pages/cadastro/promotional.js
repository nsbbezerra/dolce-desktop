import React, { useState, useMemo } from "react";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
  useColorMode,
  useToast,
  FormErrorMessage,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
import HeaderApp from "../../components/headerApp";
import { FaImage, FaSave, FaTags, FaTrash } from "react-icons/fa";
import config from "../../configs";
import { InputFile, File } from "../../style/uploader";
import { useEmployee } from "../../context/Employee";
import api from "../../configs/axios";
import List from "./promotional/list";

export default function Promotional() {
  const { colorMode } = useColorMode();
  const { employee } = useEmployee();
  const toast = useToast();

  const [storeBanner, setStoreBanner] = useState(false);
  const [name, setName] = useState("");
  const [discount, setDiscount] = useState(0);
  const [thumbnail, setThumbnail] = useState(null);
  const [validators, setValidators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bannerLoading, setBannerLoading] = useState(false);
  const [idTag, setIdTag] = useState(0);

  function clear() {
    setStoreBanner(false);
    setName("");
    setDiscount(0);
    setThumbnail(null);
    removeThumbnail();
    setValidators([]);
    setIdTag(0);
  }

  function capitalizeAllFirstLetter(string) {
    let splited = string.split(" ");
    let toJoin = splited.map((e) => {
      return e.charAt(0).toUpperCase() + e.slice(1);
    });
    let joined = toJoin.join(" ");
    return joined;
  }

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom-right",
      duration: 8000,
      isClosable: true,
    });
  }

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

  async function register(e) {
    if (e) {
      e.preventDefault();
    }
    if (name === "") {
      handleValidator("name", "Este campo é obrigatório");
      return false;
    }
    if (discount === "") {
      handleValidator("discount", "Este campo é obrigatório");
      return false;
    }
    setLoading(true);

    try {
      const response = await api.post(
        "/tags",
        { name, discount },
        { headers: { "x-access-token": employee.token } }
      );
      setIdTag(response.data.info.id);
      showToast(response.data.message, "success", "Sucesso");
      setStoreBanner(true);
      setLoading(false);
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

  async function registerBanner() {
    if (!thumbnail) {
      showToast("Insira um banner para o cadastro", "warning", "Atenção");
      return false;
    }
    setBannerLoading(true);
    let data = new FormData();
    data.append("banner", thumbnail);
    try {
      const response = await api.put(`/tags/${idTag}`, data, {
        headers: { "x-access-token": employee.token },
      });

      clear();
      showToast(response.data.message, "success", "Sucesso");
      setBannerLoading(false);
    } catch (error) {
      setBannerLoading(false);
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
      <HeaderApp title="Criar Promoções" icon={FaTags} />

      <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
        <Tabs colorScheme={config.buttons} variant="enclosed">
          <TabList>
            <Tab>Cadastro</Tab>
            <Tab>Visualizar Promoções</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Grid templateColumns="4fr 1fr" gap="15px">
                <FormControl
                  isRequired
                  isInvalid={
                    validators.find((obj) => obj.path === "name") ? true : false
                  }
                >
                  <FormLabel>Nome da Promoção</FormLabel>
                  <Input
                    focusBorderColor={config.inputs}
                    placeholder="Nome da Promoção"
                    value={name}
                    id="name"
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
                  isRequired
                  isInvalid={
                    validators.find((obj) => obj.path === "discount")
                      ? true
                      : false
                  }
                >
                  <FormLabel>Total do Desconto</FormLabel>
                  <InputGroup>
                    <InputLeftAddon children="%" />
                    <Input
                      id="discount"
                      focusBorderColor={config.inputs}
                      placeholder="Total do Desconto"
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                    />
                    <FormErrorMessage>
                      {validators.find((obj) => obj.path === "discount")
                        ? validators.find((obj) => obj.path === "discount")
                            .message
                        : ""}
                    </FormErrorMessage>
                  </InputGroup>
                </FormControl>
              </Grid>

              <HStack mt={4} spacing={5}>
                <Button
                  colorScheme={config.buttons}
                  size="lg"
                  leftIcon={<FaSave />}
                  isLoading={loading}
                  onClick={() => register()}
                >
                  Salvar Informações
                </Button>
                <Button
                  colorScheme={config.buttons}
                  size="lg"
                  leftIcon={<FaTrash />}
                  variant="outline"
                  onClick={() => clear()}
                >
                  Limpar Tudo
                </Button>
              </HStack>

              <Divider mt={5} mb={5} />

              <Box>
                <FormControl>
                  <FormLabel>Banner da Promoção</FormLabel>
                  {storeBanner ? (
                    <Flex justify="center" align="center">
                      {thumbnail ? (
                        <Box
                          w="1100px"
                          h="300px"
                          rounded="md"
                          overflow="hidden"
                        >
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
                          <Text>
                            Insira uma imagem 1100x300 pixels, de até 500kb
                          </Text>
                        </InputFile>
                      )}
                    </Flex>
                  ) : (
                    <Center>
                      <Text>
                        Salve as informações para liberar o cadastro do banner!
                      </Text>
                    </Center>
                  )}
                </FormControl>

                <Button
                  colorScheme={config.buttons}
                  size="lg"
                  leftIcon={<FaSave />}
                  mt={3}
                  isDisabled={!storeBanner}
                  isLoading={bannerLoading}
                  onClick={() => registerBanner()}
                >
                  Salvar Banner
                </Button>
              </Box>
            </TabPanel>
            <TabPanel>
              <List />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </>
  );
}
