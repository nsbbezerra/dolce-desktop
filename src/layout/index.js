import React, { useState, useEffect } from "react";
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
  Center,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  RadioGroup,
  Radio,
  Stack,
} from "@chakra-ui/react";
import Sider from "../components/sider";
import Header from "../components/header";
import { FaSave } from "react-icons/fa";
import Lottie from "react-lottie";
import serverAnimation from "../animations/server.json";
import config from "../configs/index";

import Routes from "../routes/index";

const remote = window.require("electron").remote;

export default function Layout() {
  const [modalRoute, setModalRoute] = useState(false);
  const [modalConfirmeRoute, setModalConfirmeRoute] = useState(false);
  const [route, setRoute] = useState("");
  const [port, setPort] = useState("");

  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [typeRoute, setTypeRoute] = useState("https");

  async function findRoute() {
    const tp = await localStorage.getItem("typert");
    const rt = await localStorage.getItem("route");
    const pt = await localStorage.getItem("port");
    if (!rt && !pt && !tp) {
      setModalRoute(true);
    } else {
      setModalRoute(false);
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
    if (port === "" || port === null || port === undefined || !port) {
      setModalTitle("Atenção");
      setModalMessage("Porta inválida");
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

  const serverAnimationOptions = {
    loop: true,
    autoplay: true,
    animationData: serverAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <>
      <Box w={"100vw"} h="100vh" maxH="100vh" maxW="100vw">
        <Header />
        <Grid templateColumns="60px 1fr" w="100%" h="91vh">
          <Box>
            <Sider />
          </Box>

          <Box p={2} overflow="hidden">
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
        closeOnEsc={false}
        closeOnOverlayClick={false}
        isCentered
        scrollBehavior="inside"
        size="lg"
      >
        <ModalOverlay />
        <ModalContent maxW="40rem">
          <ModalBody>
            <Flex align="center" justify="center">
              {modalRoute && (
                <Lottie
                  options={serverAnimationOptions}
                  height={200}
                  width={200}
                />
              )}
            </Flex>
            <Center>
              <Text textAlign="center" color="red.500">
                Não foi encontrada uma rota para o servidor, por favor
                configure-a abaixo:
              </Text>
            </Center>
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
                    onChange={(e) => setPort(e.target.value)}
                  />
                </InputGroup>
              </FormControl>
            </Grid>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
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
                <Button colorScheme="blue" onClick={() => closeApp()}>
                  Reiniciar Aplicação
                </Button>
              ) : (
                <Button
                  colorScheme="blue"
                  onClick={() => setModalConfirmeRoute(false)}
                >
                  OK
                </Button>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
