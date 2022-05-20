import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  RadioGroup,
  Radio,
  Stack,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Kbd,
  Icon,
  Tooltip,
  ModalCloseButton,
  ModalHeader,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import Sider from "../components/sider";
import Header from "../components/header";
import { FaSave, FaUser, FaKey, FaServer } from "react-icons/fa";
import {
  AiOutlineLogin,
  AiFillEyeInvisible,
  AiFillEye,
  AiOutlineEnter,
} from "react-icons/ai";
import Lottie from "../components/lottie";
import serverAnimation from "../animations/server.json";
import authAnimation from "../animations/auth.json";
import config from "../configs/index";
import Routes from "../routes/index";

import { useEmployee } from "../context/Employee";
import { version } from "../../package.json";

import api from "../configs/axios";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function Layout() {
  const initialRef = useRef();
  const toast = useToast();
  const { setEmployee } = useEmployee();

  const [modalRoute, setModalRoute] = useState(false);
  const [modalConfirmeRoute, setModalConfirmeRoute] = useState(false);
  const [modalAuth, setModalAuth] = useState(false);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [showPass, setShowPass] = useState(true);
  const [route, setRoute] = useState("");
  const [port, setPort] = useState("");

  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [typeRoute, setTypeRoute] = useState("https");

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

  async function findRoute() {
    const tp = await localStorage.getItem("typert");
    const rt = await localStorage.getItem("route");
    const pt = await localStorage.getItem("port");
    if (!rt && !pt && !tp) {
      setModalRoute(true);
    } else {
      setTypeRoute(tp);
      setPort(pt);
      setRoute(rt);
      setModalRoute(false);
      setModalAuth(true);
    }
  }

  async function saveRoute() {
    if (route === "" || route === null || route === undefined || !route) {
      setModalTitle("Atenção");
      setModalMessage("Rota inválida");
      setModalConfirmeRoute(true);
      return false;
    }
    setModalTitle("Sucesso");
    setModalMessage(
      "Rota configurada, para que as alterações tenham efeito reinicie a aplicação"
    );
    setShowCloseButton(true);
    await localStorage.setItem("typert", typeRoute);
    await localStorage.setItem("route", route);
    await localStorage.setItem("port", port);
    setModalRoute(false);
    setModalConfirmeRoute(true);
  }

  useEffect(() => {
    findRoute();
  }, []);

  async function handleAuth(values) {
    try {
      const schema = Yup.object().shape({
        user: Yup.string().required("Insira seu usuário"),
        password: Yup.string().required("Insira sua senha"),
      });

      await schema.validate(values, {
        abortEarly: false,
      });

      setLoadingAuth(true);
      const response = await api.post("/employeeautenticate", {
        user: values.user,
        password: values.password,
        vers: version,
      });
      setEmployee(response.data);
      setLoadingAuth(false);
      setModalAuth(false);
    } catch (error) {
      setLoadingAuth(false);
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((error) => {
          showToast(error.message, "error", "Erro");
        });
      } else {
        if (error.response.data.warning) {
          showToast(error.response.data.message, "error", "Erro");
          return false;
        }
        if (error.message === "Network Error") {
          alert(
            "Sem conexão com o servidor, verifique sua conexão com a internet."
          );
          return false;
        }
        const typeError = error.response.data.message || "";
        showToast(typeError, "error", "Erro");
        setLoadingAuth(false);
      }
    }
  }

  const formik = useFormik({
    initialValues: {
      user: "",
      password: "",
    },
    onSubmit: (values) => {
      handleAuth(values);
    },
  });

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Box w={"100%"} h="100%" overflow="hidden">
        <Header />
        <Grid templateColumns="60px 1fr" w="100%" h="92vh" overflow="hidden">
          <Box>
            <Sider />
          </Box>

          <Box p={2} w="100%" overflow="hidden">
            <Box
              w="100%"
              h="100%"
              maxH="100%"
              maxW="100%"
              overflow="auto"
              p={3}
            >
              <Routes />
            </Box>
          </Box>
        </Grid>
      </Box>

      <Modal
        isOpen={modalRoute}
        onClose={() => setModalRoute(false)}
        isCentered
        scrollBehavior="inside"
        size="lg"
      >
        <ModalOverlay />
        <ModalContent maxW="40rem">
          <ModalHeader>Configuração da Rota para o Servidor</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex align="center" justify="center">
              <Lottie animation={serverAnimation} height={200} width={200} />
            </Flex>
            <Grid templateColumns="2fr 1fr" gap="15px" mt={5}>
              <FormControl>
                <FormLabel>
                  <Stack direction="row">
                    <Text mr={3}>Rota (url):</Text>
                    <RadioGroup
                      colorScheme={config.switchs}
                      value={typeRoute}
                      onChange={setTypeRoute}
                    >
                      <Stack direction="row">
                        <Radio value="http">http</Radio>
                        <Radio value="https">https</Radio>
                      </Stack>
                    </RadioGroup>
                  </Stack>
                </FormLabel>
                <InputGroup>
                  <InputLeftAddon>{`${typeRoute}://`}</InputLeftAddon>
                  <Input
                    focusBorderColor={config.inputs}
                    placeholder="Rota ou Url"
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                  />
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel>Porta</FormLabel>
                <InputGroup>
                  <InputLeftAddon>:</InputLeftAddon>
                  <Input
                    focusBorderColor={config.inputs}
                    placeholder="Porta"
                    value={port}
                    onChange={(e) => setPort(e.target.value)}
                  />
                </InputGroup>
              </FormControl>
            </Grid>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme={config.buttons}
              leftIcon={<FaSave />}
              onClick={() => {
                saveRoute();
              }}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalAuth}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        isCentered
        scrollBehavior="inside"
        size="sm"
        initialFocusRef={initialRef}
      >
        <ModalOverlay />

        <ModalContent>
          <form onSubmit={formik.handleSubmit}>
            <ModalBody>
              <Flex align="center" justify="center" mb={5}>
                <Lottie animation={authAnimation} height={120} width={120} />
              </Flex>

              <FormControl isRequired>
                <InputGroup size="lg">
                  <InputLeftElement
                    pointerEvents="none"
                    children={<FaUser />}
                  />
                  <Input
                    ref={initialRef}
                    type="text"
                    placeholder="Usuário"
                    name="user"
                    focusBorderColor={config.inputs}
                    id="user"
                    autoFocus
                    value={formik.values.user}
                    onChange={formik.handleChange}
                  />
                </InputGroup>
              </FormControl>

              <FormControl mt={3} isRequired>
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none" children={<FaKey />} />
                  <Input
                    type={showPass === true ? "password" : "text"}
                    placeholder="Senha"
                    focusBorderColor={config.inputs}
                    id="pass"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                  />
                  <InputRightElement
                    children={
                      <IconButton
                        rounded="full"
                        size="sm"
                        icon={
                          showPass === true ? (
                            <AiFillEye />
                          ) : (
                            <AiFillEyeInvisible />
                          )
                        }
                        onClick={() => setShowPass(!showPass)}
                      />
                    }
                  />
                </InputGroup>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Text
                fontSize="xs"
                color={useColorModeValue("gray.600", "gray.100")}
                mr={10}
              >
                Versão: {version}
              </Text>
              <Tooltip label="Configuração de rota do servidor" hasArrow>
                <IconButton
                  icon={<FaServer />}
                  colorScheme={config.buttons}
                  variant="outline"
                  size="lg"
                  fontSize="3xl"
                  mr={3}
                  onClick={() => setModalRoute(true)}
                />
              </Tooltip>
              <Button
                colorScheme={config.buttons}
                leftIcon={<AiOutlineLogin />}
                size="lg"
                isLoading={loadingAuth}
                type="submit"
              >
                Login
                <Kbd ml={3} color="ButtonText">
                  <Icon as={AiOutlineEnter} />
                </Kbd>
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={modalConfirmeRoute}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {modalTitle}
            </AlertDialogHeader>

            <AlertDialogBody>{modalMessage}</AlertDialogBody>

            <AlertDialogFooter>
              {showCloseButton === true ? (
                <Button
                  colorScheme={config.buttons}
                  onClick={() => window.location.reload()}
                >
                  Reiniciar Aplicação
                </Button>
              ) : (
                <Button
                  colorScheme={config.buttons}
                  onClick={() => setModalConfirmeRoute(false)}
                >
                  OK
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  );
}
