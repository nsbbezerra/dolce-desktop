import React, { useState, useEffect } from "react";
import {
  Box,
  Center,
  Grid,
  Heading,
  FormLabel,
  FormControl,
  Input,
  Button,
  Divider,
  Select,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import config from "../../configs/index";
import HeaderApp from "../../components/headerApp";
import { FaCog, FaSave } from "react-icons/fa";

const remote = window.require("electron").remote;

export default function ConfigsApp() {
  const [route, setRoute] = useState("");
  const [port, setPort] = useState("");
  const [typeUrl, setTypeUrl] = useState("");
  const [modalConfirmeRoute, setModalConfirmeRoute] = useState(false);

  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

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
    await localStorage.setItem("typert", typeUrl);
    await localStorage.setItem("route", route);
    await localStorage.setItem("port", port);
    setModalConfirmeRoute(true);
  }

  async function findRoute() {
    const rt = await localStorage.getItem("route");
    const pt = await localStorage.getItem("port");
    const tp = await localStorage.getItem("typert");

    setRoute(rt);
    setPort(pt);
    setTypeUrl(tp);
  }

  useEffect(() => {
    findRoute();
  }, []);

  function closeApp() {
    remote.getCurrentWindow().reload();
  }

  return (
    <>
      <HeaderApp title="Configurações do Sistema" icon={FaCog} />

      <Grid templateColumns="repeat(3, 1fr)" gap="15px" mt="25px">
        <Box borderWidth="1px" rounded="md" shadow="md">
          <Center p={2}>
            <Heading fontSize="sm">Conexão com o Servidor</Heading>
          </Center>
          <Divider />
          <Box p={3}>
            <FormControl>
              <FormLabel>Rota (url):</FormLabel>
              <Input
                focusBorderColor={config.inputs}
                value={route}
                onChange={(e) => setRoute(e.target.value)}
              />
            </FormControl>
            <Grid templateColumns="1fr 1fr" mt={3} gap="15px">
              <FormControl>
                <FormLabel>Protocolo</FormLabel>
                <Select
                  value={typeUrl}
                  onChange={(e) => setTypeUrl(e.target.value)}
                  focusBorderColor={config.inputs}
                >
                  <option value="http">http</option>
                  <option value="https">https</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Porta</FormLabel>
                <Input
                  focusBorderColor={config.inputs}
                  value={port}
                  onChange={(e) => setPort(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Button
              leftIcon={<FaSave />}
              mt={3}
              colorScheme={config.buttons}
              onClick={() => saveRoute()}
            >
              Salvar
            </Button>
          </Box>
        </Box>
      </Grid>

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
              <Button colorScheme={config.buttons} onClick={() => closeApp()}>
                Reiniciar Aplicação
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
