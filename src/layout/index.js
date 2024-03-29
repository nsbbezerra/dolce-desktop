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
  FormErrorMessage,
  Kbd,
  Icon,
  Tooltip,
  ModalCloseButton,
  ModalHeader,
  useToast,
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
import Hotkeys from "react-hot-keys";
import Routes from "../routes/index";

import { useEmployee } from "../context/Employee";

import api from "../configs/axios";

const remote = window.require("electron").remote;
const version = window.require("electron").remote.app.getVersion();

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
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const [wrongUser, setWrongUser] = useState(false);
  const [wrongPass, setWrongPass] = useState(false);

  const [wrongUserMessage, setWrongUserMessage] = useState("");
  const [wrongPassMessage, setWrongPassMessage] = useState("");

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

  useEffect(() => {
    setWrongUser(false);
  }, [user]);

  useEffect(() => {
    setWrongPass(false);
  }, [pass]);

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

  function onKeyDown(keyName, e, handle) {
    if (keyName === "return") {
      handleAuth(e);
    }
  }

  function closeApp() {
    remote.getCurrentWindow().reload();
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

  async function handleAuth(e) {
    if (e) {
      e.preventDefault();
    }
    if (user === "" || !user) {
      setWrongUser(true);
      setWrongUserMessage("Insira seu nome de usuário");
      return false;
    }
    if (pass === "" || !pass) {
      setWrongPass(true);
      setWrongPassMessage("Insira uma senha");
      return false;
    }
    setWrongPass(false);
    setWrongUser(false);
    setLoadingAuth(true);
    try {
      const response = await api.post("/employeeautenticate", {
        user: user,
        password: pass,
        vers: version,
      });
      setEmployee(response.data);
      setLoadingAuth(false);
      setModalAuth(false);
    } catch (error) {
      setLoadingAuth(false);
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
      if (typeError === "Senha Inválida") {
        setWrongPassMessage(typeError);
        setWrongPass(true);
        const input = document.getElementById("pass");
        input.focus();
      } else {
        setWrongUserMessage(typeError);
        setWrongUser(true);
        const input = document.getElementById("user");
        input.focus();
      }
      setLoadingAuth(false);
    }
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Hotkeys
        keyName="return, enter"
        onKeyDown={onKeyDown}
        allowRepeat
        filter={(event) => {
          return true;
        }}
      >
        <Box
          w={"100%"}
          h="100%"
          overflow="hidden"
          borderWidth="1px"
          borderColor={config.inputs}
        >
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
            <ModalBody>
              <Flex align="center" justify="center" mb={5}>
                <Lottie animation={authAnimation} height={120} width={120} />
              </Flex>

              <FormControl isInvalid={wrongUser}>
                <InputGroup size="lg">
                  <InputLeftElement
                    pointerEvents="none"
                    children={<FaUser />}
                  />
                  <Input
                    ref={initialRef}
                    type="text"
                    placeholder="Usuário"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    focusBorderColor={config.inputs}
                    id="user"
                  />
                </InputGroup>
                <FormErrorMessage>{wrongUserMessage}</FormErrorMessage>
              </FormControl>

              <FormControl mt={3} isInvalid={wrongPass}>
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none" children={<FaKey />} />
                  <Input
                    type={showPass === true ? "password" : "text"}
                    placeholder="Senha"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    focusBorderColor={config.inputs}
                    id="pass"
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
                <FormErrorMessage>{wrongPassMessage}</FormErrorMessage>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Text fontSize="xs" color="gray.600" mr={10}>
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
                onClick={() => handleAuth()}
              >
                Login
                <Kbd ml={3} color="ButtonText">
                  <Icon as={AiOutlineEnter} />
                </Kbd>
              </Button>
            </ModalFooter>
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
                    onClick={() => closeApp()}
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
      </Hotkeys>
    </div>
  );
}
