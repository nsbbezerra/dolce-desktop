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
  AiOutlineLogout,
  AiOutlineReload,
  AiOutlineStop,
} from "react-icons/ai";
import { FiMinus, FiMaximize, FiX } from "react-icons/fi";
import config from "../configs";
import { GiShop } from "react-icons/gi";

import Icone from "../assets/icon-black.png";
import Logo from "../assets/name-slug.png";

const remote = window.require("electron").remote;

export default function HeaderApp() {
  const { setColorMode } = useColorMode();
  const cancelRef = useRef();
  const [modalTheme, setModalTheme] = useState(false);
  const [theme, setTheme] = useState("light");
  const [alert, setAlert] = useState(false);

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

    const {
      width: maxWidth,
      height: maxHeight,
    } = remote.screen.getPrimaryDisplay().workAreaSize;

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
            borderColor: "yellow.300",
            boxShadow: "0px 0px 0px 4px #ecc94b",
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

  async function findTheme() {
    const mode = await localStorage.getItem("mode");
    setTheme(mode);
    await setColorMode(mode);
  }

  useEffect(() => {
    findTheme();
  }, []);

  async function setColor() {
    await localStorage.setItem("mode", theme);
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
      <Flex
        h="60px"
        bg={config.header.bg}
        justify="space-between"
        align="center"
        pr={5}
        pl={3}
        borderBottomWidth="1px"
      >
        <Flex h="60px" w="220px" justify="center" align="center">
          <Image src={Icone} w="45px" h="45px" mr="10px" />
          <Image src={Logo} w="140px" />
        </Flex>

        <Flex w="80%" justify="flex-end" align="center">
          <Flex>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<Icon as={FaUserCircle} />}
              />
              <Input
                type="text"
                variant="filled"
                rounded="xl"
                w="300px"
                readOnly
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
              />
            </Tooltip>

            <Tooltip label="Informações da Empresa" hasArrow>
              <IconButton
                aria-label="Search database"
                icon={<GiShop />}
                rounded="xl"
                ml={3}
              />
            </Tooltip>

            <Tooltip label="Logout" hasArrow>
              <IconButton
                aria-label="Search database"
                icon={<AiOutlineLogout />}
                rounded="xl"
                ml={3}
                onClick={() => toogleDevTools()}
              />
            </Tooltip>
          </Flex>
        </Flex>

        <Flex h="60px" justify="center" align="center" ml={3}>
          <Tooltip label="Minimizar" hasArrow>
            <IconButton
              aria-label="Search database"
              icon={<FiMinus />}
              rounded="xl"
              ml={3}
              size="xs"
              variant="ghost"
              onClick={() => handleMinimize()}
            />
          </Tooltip>
          <Tooltip label={"Maximizar"} hasArrow>
            <IconButton
              aria-label="Search database"
              icon={<FiMaximize />}
              rounded="xl"
              ml={3}
              size="xs"
              variant="ghost"
              onClick={() => handleMaximize()}
            />
          </Tooltip>
          <Tooltip label="Fechar" hasArrow>
            <IconButton
              aria-label="Search database"
              icon={<FiX />}
              rounded="xl"
              ml={3}
              size="xs"
              colorScheme="red"
              onClick={() => handleCloseWindow()}
            />
          </Tooltip>
        </Flex>
      </Flex>

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
            <Example />
          </ModalBody>
          <ModalFooter>
            <Button
              leftIcon={<FaTimes />}
              colorScheme="red"
              mr={3}
              onClick={() => setModalTheme(false)}
            >
              Fechar
            </Button>
            <Button
              leftIcon={<FaSave />}
              colorScheme="blue"
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
                colorScheme="red"
                onClick={() => setAlert(false)}
                leftIcon={<AiOutlineStop />}
              >
                Agora Não
              </Button>
              <Button
                colorScheme="blue"
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
    </>
  );
}
