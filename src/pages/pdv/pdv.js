import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Input,
  Button,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Tooltip,
  Flex,
  IconButton,
  Divider,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  ButtonGroup,
  Center,
  Heading,
  FormControl,
  FormLabel,
  Image,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Kbd,
} from "@chakra-ui/react";
import config from "../../configs/index";
import HeaderApp from "../../components/headerApp";
import {
  FaShoppingBag,
  FaSearch,
  FaTimes,
  FaPlus,
  FaSearchPlus,
  FaSave,
  FaCheck,
  FaTrash,
  FaPrint,
  FaCalendarAlt,
  FaUser,
} from "react-icons/fa";
import { MdKeyboardArrowUp } from "react-icons/md";
import DatePicker, { registerLocale } from "react-datepicker";
import Hotkeys from "react-hot-keys";
import pt_br from "date-fns/locale/pt-BR";

import PaymentMiddleware from "../../middlewares/payment";
import PrintMiddleware from "../../middlewares/print";

registerLocale("pt_br", pt_br);

export default function Pdv() {
  const [modalPayment, setModalPayment] = useState(false);
  const [modalPrint, setModalPrint] = useState(false);
  const [qtd, setQtd] = useState(1);
  const [startDate, setStartDate] = useState(new Date());

  useEffect(() => {
    console.log(qtd);
  }, [qtd]);

  function handleInput(id) {
    const inpt = document.getElementById(id);
    inpt.focus();
  }

  function onKeyDown(keyName, e, handle) {
    switch (keyName) {
      case "ctrl+p":
        setModalPrint(true);
        break;
      case "f6":
        handleInput("qtd");
        break;
      case "f12":
        setModalPayment(true);
        break;
      case "f3":
        handleInput("name");
        break;
      case "f7":
        handleInput("codebar");
        break;
      case "f8":
        handleInput("sku");
        break;
      case "f9":
        handleInput("discount");
        break;
      case "f10":
        handleInput("finalvalue");
        break;

      default:
        break;
    }
  }

  const CustomInputPicker = ({ value, onClick }) => (
    <InputGroup>
      <InputLeftAddon>Data</InputLeftAddon>
      <Input focusBorderColor={config.inputs} value={value} onClick={onClick} />
      <InputRightElement pointerEvents="none" children={<FaCalendarAlt />} />
    </InputGroup>
  );

  return (
    <>
      <Hotkeys
        keyName="f2, ctrl+p, f6, f3, f7, f8, f9, f10, f12, f1, f4, f5"
        onKeyDown={onKeyDown}
        allowRepeat
        filter={(event) => {
          return true;
        }}
      >
        <HeaderApp title="Ponto de Venda" icon={FaShoppingBag} />

        <Grid
          templateRows="62px 57vh 68px"
          gap="15px"
          mt="25px"
          h="76.65vh"
          maxH="76.65vh"
        >
          <Flex
            h="62px"
            p={2}
            shadow="md"
            borderWidth="1px"
            rounded="md"
            align="center"
            justify="flex-end"
          >
            <InputGroup mr={3}>
              <InputLeftAddon>Vendedor</InputLeftAddon>
              <Input focusBorderColor={config.inputs} />
              <InputRightElement pointerEvents="none" children={<FaUser />} />
            </InputGroup>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              customInput={<CustomInputPicker />}
              locale="pt_br"
              dateFormat="dd/MM/yyyy"
            />
          </Flex>
          <Grid templateColumns="repeat(2, 1fr)" gap="15px" h="100%">
            <Box
              borderWidth="1px"
              shadow="md"
              rounded="md"
              p={3}
              h="100%"
              minH="100%"
              maxH="100%"
              overflow="auto"
            >
              <Center rounded="md" p={2} bg="rgba(160, 174, 192, 0.1)" mb={3}>
                <Heading fontSize="sm">Informações do Pedido</Heading>
              </Center>
              <HStack spacing={3}>
                <Input
                  type="text"
                  placeholder="Nome do cliente"
                  focusBorderColor={config.inputs}
                  isReadOnly
                />
                <Tooltip label="Buscar Cliente" hasArrow>
                  <Button leftIcon={<FaSearch />} colorScheme="blue">
                    <Kbd color="ButtonText">F2</Kbd>
                  </Button>
                </Tooltip>
              </HStack>
              <HStack spacing={3} mt={3}>
                <Input
                  size="sm"
                  placeholder="Endereço do cliente"
                  focusBorderColor={config.inputs}
                  w="70%"
                />
                <Input
                  size="sm"
                  placeholder="Contato"
                  focusBorderColor={config.inputs}
                  w="30%"
                />
              </HStack>

              <Divider mt={3} mb={3} />

              <Table size="sm" maxW="100%">
                <Thead fontWeight="700">
                  <Tr>
                    <Td w="2%" textAlign="center">
                      Qtd
                    </Td>
                    <Td isTruncated>Produto</Td>
                    <Td w="7%" textAlign="center">
                      Cor
                    </Td>
                    <Td w="7%" textAlign="center">
                      Tamanho
                    </Td>
                    <Td w="14%" isNumeric>
                      V. Uni
                    </Td>
                    <Td w="14%" isNumeric>
                      V. Tot
                    </Td>
                    <Td w="1%"></Td>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td w="2%" textAlign="center">
                      10
                    </Td>
                    <Td isTruncated>
                      <Tooltip
                        label="Camiseta Masculina Masculina Topper adasdasdasda"
                        hasArrow
                      >
                        <Text fontSize="sm" isTruncated noOfLines={1} w="10vw">
                          Camiseta Masculina Masculina Topper adasdasdasda
                        </Text>
                      </Tooltip>
                    </Td>
                    <Td w="7%" textAlign="center">
                      <Box w="100%" h="20px" bg="yellow.400" rounded="md" />
                    </Td>
                    <Td w="7%" textAlign="center">
                      PP
                    </Td>
                    <Td w="14%" isNumeric>
                      400,00
                    </Td>
                    <Td w="14%" isNumeric>
                      400,00
                    </Td>
                    <Td w="1%">
                      <Tooltip label="Remover Item" hasArrow>
                        <Popover>
                          <PopoverTrigger>
                            <IconButton
                              colorScheme="red"
                              icon={<FaTimes />}
                              size="xs"
                              variant="link"
                            />
                          </PopoverTrigger>
                          <PopoverContent>
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader>Confirmação!</PopoverHeader>
                            <PopoverBody>Deseja remover este item?</PopoverBody>
                            <PopoverFooter d="flex" justifyContent="flex-end">
                              <ButtonGroup size="sm">
                                <Button variant="outline">Não</Button>
                                <Button colorScheme="blue">Sim</Button>
                              </ButtonGroup>
                            </PopoverFooter>
                          </PopoverContent>
                        </Popover>
                      </Tooltip>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
            <Box
              borderWidth="1px"
              shadow="md"
              rounded="md"
              p={3}
              h="100%"
              minH="100%"
              maxH="100%"
              overflow="auto"
            >
              <Center rounded="md" p={2} bg="rgba(160, 174, 192, 0.1)" mb={3}>
                <Heading fontSize="sm">Buscar Produtos</Heading>
              </Center>
              <Grid templateColumns="70px 1fr 130px 130px" gap="15px">
                <FormControl>
                  <FormLabel fontSize="sm" mb={0}>
                    Qtd <Kbd ml={1}>F6</Kbd>
                  </FormLabel>
                  <Input
                    type="number"
                    placeholder="Qtd"
                    focusBorderColor={config.inputs}
                    id="qtd"
                    value={qtd}
                    onChange={(e) => setQtd(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm" mb={0}>
                    Buscar por nome <Kbd ml={1}>F3</Kbd>
                  </FormLabel>

                  <Input
                    type="text"
                    placeholder="Digite o nome"
                    focusBorderColor={config.inputs}
                    id="name"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm" mb={0}>
                    Cod. de Barras <Kbd ml={1}>F7</Kbd>
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="Cod. Barras"
                    focusBorderColor={config.inputs}
                    id="codebar"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="sm" mb={0}>
                    SKU <Kbd ml={1}>F8</Kbd>
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="SKU"
                    focusBorderColor={config.inputs}
                    id="sku"
                  />
                </FormControl>
              </Grid>

              <Divider mt={3} mb={3} />

              <Grid
                templateColumns="repeat(auto-fit, minmax(165px, 165px))"
                gap="15px"
                justifyContent="center"
              >
                <Box borderWidth="1px" p={2} rounded="md" shadow="md">
                  <Image
                    src="https://a-static.mlcdn.com.br/1500x1500/camiseta-branca-lisa-100-algodao-torres-confeccoes/torresconfeccoes/51-195/5c4ae4b9c47d84d3af9d9f67dea33f60.jpg"
                    rounded="md"
                  />
                  <Text w="160px" isTruncated noOfLines={2} fontSize="sm" p={1}>
                    Camiseta Masculina asdlaskdjlaskdjalskdjjasdl asdasd asd
                    asdasdasdasds
                  </Text>
                  <HStack mt={2}>
                    <Heading fontSize="lg" w="80%">
                      R$ 20,00
                    </Heading>
                    <Tooltip label="Adicionar este item" hasArrow>
                      <IconButton
                        icon={<FaPlus />}
                        size="sm"
                        colorScheme="blue"
                      />
                    </Tooltip>
                  </HStack>
                </Box>
              </Grid>
            </Box>
          </Grid>

          <Flex
            h="68px"
            borderWidth="1px"
            shadow="md"
            rounded="md"
            align="center"
          >
            <Grid templateColumns="2fr 1fr" gap="15px">
              <Grid templateColumns="repeat(3, 1fr)" gap="10px" pl={3}>
                <InputGroup size="lg">
                  <InputLeftAddon>Liquido</InputLeftAddon>
                  <Input focusBorderColor={config.inputs} />
                </InputGroup>

                <InputGroup size="lg">
                  <InputLeftAddon>
                    Desconto <Kbd ml={1}>F9</Kbd>
                  </InputLeftAddon>
                  <Input focusBorderColor={config.inputs} id="discount" />
                </InputGroup>

                <InputGroup size="lg">
                  <InputLeftAddon>
                    Bruto <Kbd ml={1}>F10</Kbd>
                  </InputLeftAddon>
                  <Input focusBorderColor={config.inputs} id="finalvalue" />;
                </InputGroup>
              </Grid>
              <Grid templateColumns="1fr 2fr" gap="15px" pr={3}>
                <Menu placement="top">
                  <MenuButton
                    isFullWidth
                    as={Button}
                    rightIcon={<MdKeyboardArrowUp />}
                    colorScheme="blue"
                    size="lg"
                  >
                    Opções
                  </MenuButton>
                  <MenuList>
                    <MenuItem icon={<FaSearchPlus />} command="F1">
                      Buscar Orçamento
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem icon={<FaSave />} command="F4">
                      Salvar como Orçamento
                    </MenuItem>
                    <MenuItem
                      icon={<FaPrint />}
                      onClick={() => setModalPrint(true)}
                      command="Ctrl+P"
                    >
                      Imprimir Pedido
                    </MenuItem>
                    <MenuItem icon={<FaTrash />} command="F5">
                      Cancelar Pedido
                    </MenuItem>
                  </MenuList>
                </Menu>
                <Button
                  leftIcon={<FaCheck />}
                  colorScheme="green"
                  onClick={() => setModalPayment(true)}
                  size="lg"
                >
                  Finalizar Pedido{" "}
                  <Kbd color="ButtonText" ml={1}>
                    F12
                  </Kbd>
                </Button>
              </Grid>
            </Grid>
          </Flex>
        </Grid>

        <Modal
          isOpen={modalPayment}
          onClose={() => setModalPayment(false)}
          isCentered
          scrollBehavior="inside"
        >
          <ModalOverlay />
          <ModalContent maxW="60rem" pb={4}>
            <ModalHeader>Adicionar Forma de Pagamento</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {modalPayment === true && <PaymentMiddleware />}
            </ModalBody>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={modalPrint}
          onClose={() => setModalPrint(false)}
          isCentered
          scrollBehavior="inside"
          size="lg"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Imprimir</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={4}>
              {modalPrint === true && <PrintMiddleware />}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Hotkeys>
    </>
  );
}
