import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Flex,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Icon,
  IconButton,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  HStack,
  useRadio,
  useRadioGroup,
  Box,
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useColorMode,
  Text,
  Heading,
  Divider,
  Grid,
} from "@chakra-ui/react";
import {
  FaUserCircle,
  FaCog,
  FaPaintBrush,
  FaSave,
  FaTimes,
  FaSun,
  FaMoon,
} from "react-icons/fa";

import {
  AiOutlineCheck,
  AiOutlineDrag,
  AiOutlineLogout,
  AiOutlineReload,
  AiOutlineStop,
} from "react-icons/ai";
import { FiMinus, FiMaximize, FiX } from "react-icons/fi";
import config from "../configs";
import { GiShop } from "react-icons/gi";

import Icone from "../assets/logo.svg";
import Logo from "../assets/name-slug.png";

import { useHistory } from "react-router-dom";
import { useEmployee } from "../context/Employee";

const remote = window.require("electron").remote;

export default function HeaderApp() {
  const { push } = useHistory();
  const { employee } = useEmployee();

  const { setColorMode } = useColorMode();
  const cancelRef = useRef();
  const [modalTheme, setModalTheme] = useState(false);
  const [theme, setTheme] = useState("light");
  const [alert, setAlert] = useState(false);
  const [destak, setDestak] = useState("");
  const [alertLogout, setAlertLogout] = useState(false);

  const handleCloseWindow = useCallback(() => {
    const window = remote.getCurrentWindow();

    window.close();
  }, []);

  const handleMinimize = useCallback(() => {
    const window = remote.getCurrentWindow();

    window.minimize();
  }, []);

  const handleMaximize = useCallback(() => {
    const window = remote.getCurrentWindow();

    const { width: currentWidth, height: currentHeight } = window.getBounds();

    const { width: maxWidth, height: maxHeight } =
      remote.screen.getPrimaryDisplay().workAreaSize;

    const isMaximized =
      currentWidth === maxWidth && currentHeight === maxHeight;

    if (!isMaximized) {
      window.maximize();
    } else {
      window.unmaximize();
    }
  }, []);

  function RadioCard(props) {
    const { getInputProps, getCheckboxProps } = useRadio(props);

    const input = getInputProps();
    const checkbox = getCheckboxProps();

    return (
      <Box as="label">
        <input {...input} />
        <Box
          {...checkbox}
          cursor="pointer"
          borderRadius="xl"
          _checked={{
            borderColor: "gray.300",
            boxShadow: "0px 0px 0px 4px #CBD5E0",
          }}
          _focus={{
            boxShadow: "outline",
          }}
        >
          {props.children === "light" ? (
            <Flex
              w="260px"
              h="100px"
              rounded="xl"
              bg="white"
              borderWidth="1px"
              align="center"
              color="gray.800"
              justify="center"
              fontSize="4xl"
            >
              <Icon as={FaSun} mr={3} />
              <Text>Claro</Text>
            </Flex>
          ) : (
            <Flex
              w="260px"
              h="100px"
              rounded="xl"
              bg="gray.800"
              borderWidth="1px"
              align="center"
              color="white"
              justify="center"
              fontSize="4xl"
            >
              <Icon as={FaMoon} mr={3} />
              <Text>Escuro</Text>
            </Flex>
          )}
        </Box>
      </Box>
    );
  }

  function Example() {
    const options = ["light", "dark"];

    const { getRootProps, getRadioProps } = useRadioGroup({
      name: "framework",
      defaultValue: theme,
      onChange: (e) => setTheme(e),
    });

    const group = getRootProps();

    return (
      <HStack {...group}>
        {options.map((value) => {
          const radio = getRadioProps({ value });
          return (
            <RadioCard key={value} {...radio}>
              {value}
            </RadioCard>
          );
        })}
      </HStack>
    );
  }

  function RadioCardColors(props) {
    const { getInputProps, getCheckboxProps } = useRadio(props);

    const input = getInputProps();
    const checkbox = getCheckboxProps();

    return (
      <Box as="label">
        <input {...input} />
        <Box
          {...checkbox}
          cursor="pointer"
          borderRadius="md"
          _checked={{
            borderColor: "gray.300",
            boxShadow: "0px 0px 0px 3px #CBD5E0",
          }}
          _focus={{
            boxShadow: "outline",
          }}
        >
          <Box w="46px" h="30px" bg={`${props.children}.400`} rounded="md" />
        </Box>
      </Box>
    );
  }

  function ExampleColors() {
    const options = [
      "gray",
      "red",
      "orange",
      "yellow",
      "green",
      "teal",
      "blue",
      "cyan",
      "purple",
      "pink",
    ];

    const { getRootProps, getRadioProps } = useRadioGroup({
      name: "framework",
      defaultValue: destak,
      onChange: (e) => setDestak(e),
    });

    const group = getRootProps();

    return (
      <HStack {...group}>
        {options.map((value) => {
          const radio = getRadioProps({ value });
          return (
            <RadioCardColors key={value} {...radio}>
              {value}
            </RadioCardColors>
          );
        })}
      </HStack>
    );
  }

  async function findTheme() {
    const mode = await localStorage.getItem("mode");
    const destakColor = await localStorage.getItem("destak");
    setTheme(mode);
    setDestak(destakColor);
    await setColorMode(mode);
  }

  useEffect(() => {
    findTheme();
  }, []);

  async function setColor() {
    await localStorage.setItem("mode", theme);
    await localStorage.setItem("destak", destak);
    setModalTheme(false);
    setAlert(true);
  }

  function closeWindow() {
    remote.getCurrentWindow().reload();
  }

  function toogleDevTools() {
    remote.getCurrentWindow().toggleDevTools();
  }

  return (
    <>
      <Grid h="60px" bg={config.header.bg} templateColumns="1fr 2fr 1fr" pl={3}>
        <Flex h="60px" justify="flex-start" align="center">
          <Image
            userSelect="none"
            draggable={false}
            src={Icone}
            w="50px"
            h="50px"
            mr="15px"
          />

          <Text fontSize="md" userSelect="none">
            NKGEST - Gestor de Loja Virtual
          </Text>
        </Flex>

        <Flex align="center" justify="center">
          <Flex>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<Icon as={FaUserCircle} />}
              />
              <Input
                _focus={{
                  bg:
                    useColorMode().colorMode === "light"
                      ? "gray.100"
                      : "whiteAlpha.100",
                }}
                type="text"
                variant="filled"
                rounded="xl"
                w="300px"
                readOnly
                value={JSON.stringify(employee) !== "{}" ? employee.name : ""}
              />
            </InputGroup>
            <Tooltip label="Configurações do Tema" hasArrow>
              <IconButton
                aria-label="Search database"
                icon={<FaPaintBrush />}
                rounded="xl"
                ml={3}
                onClick={() => setModalTheme(true)}
              />
            </Tooltip>

            <Tooltip label="Configurações do Sistema" hasArrow>
              <IconButton
                aria-label="Search database"
                icon={<FaCog />}
                rounded="xl"
                ml={3}
                onClick={() => push("/configapp")}
              />
            </Tooltip>

            <Tooltip label="Informações da Empresa" hasArrow>
              <IconButton
                aria-label="Search database"
                icon={<GiShop />}
                rounded="xl"
                ml={3}
                onClick={() => toogleDevTools()}
              />
            </Tooltip>

            <Tooltip label="Logout" hasArrow>
              <IconButton
                aria-label="Search database"
                icon={<AiOutlineLogout />}
                rounded="xl"
                ml={3}
                onClick={() => setAlertLogout(true)}
              />
            </Tooltip>
          </Flex>
        </Flex>

        <Flex h="60px" justify="flex-end" align="startadm">
          <Tooltip label="Clique para arrastar" hasArrow>
            <IconButton
              aria-label="Search database"
              icon={<AiOutlineDrag />}
              size="sm"
              rounded="none"
              w="40px"
              fontSize="sm"
              variant="ghost"
              className="draggable"
            />
          </Tooltip>
          <Tooltip label="Minimizar" hasArrow>
            <IconButton
              aria-label="Search database"
              icon={<FiMinus />}
              size="sm"
              rounded="none"
              w="40px"
              fontSize="sm"
              onClick={() => handleMinimize()}
              borderBottomLeftRadius="md"
            />
          </Tooltip>
          <Tooltip label={"Maximizar"} hasArrow>
            <IconButton
              aria-label="Search database"
              icon={<FiMaximize />}
              size="sm"
              rounded="none"
              w="40px"
              fontSize="sm"
              onClick={() => handleMaximize()}
            />
          </Tooltip>
          <Tooltip label="Fechar" hasArrow>
            <IconButton
              aria-label="Search database"
              icon={<FiX />}
              size="sm"
              rounded="none"
              w="40px"
              fontSize="md"
              colorScheme="red"
              onClick={() => handleCloseWindow()}
            />
          </Tooltip>
        </Flex>
      </Grid>

      <Modal
        isOpen={modalTheme}
        onClose={() => setModalTheme(false)}
        size="xl"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Configurações do Tema</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Heading fontSize="sm" mb={2}>
              Modo do tema:
            </Heading>
            <Example />
            <Divider mt={5} mb={5} />
            <Heading fontSize="sm" mt={3} mb={2}>
              Cor de destaque:
            </Heading>
            <ExampleColors />
          </ModalBody>
          <ModalFooter>
            <Button
              leftIcon={<FaTimes />}
              colorScheme={config.buttons}
              variant="outline"
              mr={3}
              onClick={() => setModalTheme(false)}
            >
              Fechar
            </Button>
            <Button
              leftIcon={<FaSave />}
              colorScheme={config.buttons}
              onClick={() => setColor()}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={alert}
        leastDestructiveRef={cancelRef}
        onClose={() => setAlert(false)}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Alteração do Tema
            </AlertDialogHeader>

            <AlertDialogBody>
              Para que as alterações do tema tenham efeito reinicie a aplicação.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                colorScheme={config.buttons}
                variant="outline"
                onClick={() => setAlert(false)}
                leftIcon={<AiOutlineStop />}
              >
                Agora Não
              </Button>
              <Button
                colorScheme={config.buttons}
                onClick={() => closeWindow()}
                ml={3}
                leftIcon={<AiOutlineReload />}
              >
                Reiniciar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={alertLogout}
        onClose={() => setAlertLogout(false)}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Logout
            </AlertDialogHeader>

            <AlertDialogBody>Deseja fazer logout?</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                colorScheme={config.buttons}
                variant="outline"
                onClick={() => setAlertLogout(false)}
                leftIcon={<AiOutlineStop />}
              >
                Não
              </Button>
              <Button
                colorScheme={config.buttons}
                onClick={() => closeWindow()}
                ml={3}
                leftIcon={<AiOutlineCheck />}
              >
                Sim
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
