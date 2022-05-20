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
  useColorModeValue,
  Stack,
} from "@chakra-ui/react";
import {
  FaUserCircle,
  FaCog,
  FaPaintBrush,
  FaSave,
  FaSun,
  FaMoon,
} from "react-icons/fa";

import {
  AiOutlineCheck,
  AiOutlineLogout,
  AiOutlineReload,
  AiOutlineStop,
} from "react-icons/ai";
import config from "../configs";
import { GiShop } from "react-icons/gi";

import Icone from "../assets/icone.svg";

import { useHistory } from "react-router-dom";
import { useEmployee } from "../context/Employee";

export default function HeaderApp() {
  const { push } = useHistory();
  const { employee } = useEmployee();

  const { setColorMode, colorMode } = useColorMode();
  const cancelRef = useRef();
  const [modalTheme, setModalTheme] = useState(false);
  const [theme, setTheme] = useState("light");
  const [alert, setAlert] = useState(false);
  const [destak, setDestak] = useState("");
  const [alertLogout, setAlertLogout] = useState(false);

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
    setTheme(mode || colorMode);
    setDestak(destakColor || "blue");
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

  return (
    <>
      <Grid
        h="60px"
        bg={config.header.bg}
        templateColumns="1fr 2fr 1fr"
        pl={1}
        className="draggable"
        alignItems="center"
      >
        <HStack>
          <Flex
            h="50px"
            justify="center"
            align="center"
            rounded="full"
            bg={useColorModeValue("whiteAlpha.700", "whiteAlpha.300")}
            w="50px"
          >
            <Image userSelect="none" draggable={false} src={Icone} w="40px" />
          </Flex>
          <Stack spacing={-1} color="white">
            <Heading fontSize="2xl" mt={0} mb={0} fontWeight="bolder">
              NKGEST
            </Heading>
            <Text fontSize="sm">Sistema de Gestão Empresarial</Text>
          </Stack>
        </HStack>

        <Flex align="center" justify="center">
          <Flex>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<Icon as={FaUserCircle} color="white" />}
              />
              <Input
                _focus={{
                  bg:
                    useColorMode().colorMode === "light"
                      ? "whiteAlpha.500"
                      : "whiteAlpha.200",
                }}
                bg={
                  useColorMode().colorMode === "light"
                    ? "whiteAlpha.500"
                    : "whiteAlpha.200"
                }
                color="white"
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
                className="no-draggable"
                colorScheme="whiteAlpha"
                color="white"
              />
            </Tooltip>

            <Tooltip label="Configurações do Sistema" hasArrow>
              <IconButton
                aria-label="Search database"
                icon={<FaCog />}
                rounded="xl"
                ml={3}
                onClick={() => push("/configapp")}
                className="no-draggable"
                colorScheme="whiteAlpha"
                color="white"
              />
            </Tooltip>

            <Tooltip label="Informações da Empresa" hasArrow>
              <IconButton
                aria-label="Search database"
                icon={<GiShop />}
                rounded="xl"
                ml={3}
                onClick={() => {}}
                className="no-draggable"
                colorScheme="whiteAlpha"
                color="white"
              />
            </Tooltip>

            <Tooltip label="Logout" hasArrow>
              <IconButton
                aria-label="Search database"
                icon={<AiOutlineLogout />}
                rounded="xl"
                ml={3}
                onClick={() => setAlertLogout(true)}
                className="no-draggable"
                colorScheme="whiteAlpha"
                color="white"
              />
            </Tooltip>
          </Flex>
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
                onClick={() => window.location.reload()}
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
              Sair
            </AlertDialogHeader>

            <AlertDialogBody>Deseja sair?</AlertDialogBody>

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
                onClick={() => window.location.reload()}
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
