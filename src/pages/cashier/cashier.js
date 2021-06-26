import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Grid,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  HStack,
  IconButton,
  Tooltip,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  ButtonGroup,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormLabel,
  InputGroup,
  Input,
  InputRightAddon,
  Textarea,
  FormControl,
  Center,
  Heading,
  Divider,
  Text,
  Icon,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from "@chakra-ui/react";
import config from "../../configs/index";
import HeaderApp from "../../components/headerApp";
import {
  FaBarcode,
  FaCashRegister,
  FaChartLine,
  FaCheck,
  FaLock,
  FaPrint,
  FaSave,
  FaClipboardList,
  FaTrash,
  FaPlus,
} from "react-icons/fa";
import { AiOutlineFall, AiOutlineRise } from "react-icons/ai";

import PrintMiddleware from "../../middlewares/print";
import PaymentMiddleware from "../../middlewares/payment";

import { useHistory, useParams } from "react-router-dom";

export default function Cashier() {
  const cancelRef = useRef();
  const { push } = useHistory();
  const { cash } = useParams();
  const [modalRevenue, setModalRevenue] = useState(false);
  const [modalExpense, setModalExpense] = useState(false);
  const [modalPrint, setModalPrint] = useState(false);
  const [modalPayment, setModalPayment] = useState(false);
  const [modalPayments, setModalPayments] = useState(false);
  const [modalFinish, setModalFinish] = useState(false);
  const [modalMoviment, setModalMoviment] = useState(false);
  const [modalCloseCashier, setModalCloseCashier] = useState(false);
  const [modalClose, setModalClose] = useState(false);

  function handlePayment() {
    setModalPayments(false);
    setModalPayment(true);
  }

  function handleCloseCashier() {
    setModalClose(false);
    setModalCloseCashier(true);
  }

  function routing(rt) {
    push(rt);
  }

  return (
    <>
      <HeaderApp title="Caixa Diário" icon={FaCashRegister} />
      <Grid
        templateRows="66.65vh 68px"
        gap="15px"
        mt="25px"
        h="76.65vh"
        maxH="76.65vh"
      >
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
          <Table size="sm">
            <Thead fontWeight="700">
              <Tr>
                <Td w="6%" textAlign="center">
                  Nº
                </Td>
                <Td>Cliente</Td>
                <Td w="7%" textAlign="center">
                  Data
                </Td>
                <Td isNumeric w="9%">
                  Valor Total
                </Td>
                <Td isNumeric w="5%">
                  Desconto
                </Td>
                <Td isNumeric w="9%">
                  Total a Pagar
                </Td>

                <Td w="8%"></Td>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td w="6%" textAlign="center">
                  1001
                </Td>
                <Td>Natanael dos Santos Bezerra</Td>
                <Td w="7%" textAlign="center">
                  10/10/1010
                </Td>
                <Td isNumeric w="9%">
                  R$ 300,00
                </Td>
                <Td isNumeric w="5%">
                  0%
                </Td>
                <Td isNumeric w="9%">
                  R$ 300,00
                </Td>
                <Td w="12%" textAlign="center">
                  <HStack spacing={2}>
                    <Tooltip label="Imprimir Pedido" hasArrow>
                      <IconButton
                        icon={<FaPrint />}
                        rounded="full"
                        size="sm"
                        onClick={() => setModalPrint(true)}
                        colorScheme={config.buttons}
                        variant="ghost"
                      />
                    </Tooltip>
                    <Tooltip label="Visualizar Pagamentos" hasArrow>
                      <IconButton
                        icon={<FaBarcode />}
                        rounded="full"
                        size="sm"
                        onClick={() => setModalPayments(true)}
                        colorScheme={config.buttons}
                        variant="ghost"
                      />
                    </Tooltip>

                    <Popover placement="bottom-end">
                      <PopoverTrigger>
                        <IconButton
                          icon={<FaClipboardList />}
                          size="sm"
                          rounded="full"
                          colorScheme={config.buttons}
                          variant="ghost"
                        />
                      </PopoverTrigger>
                      <PopoverContent _focus={{ outline: "none" }}>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Confirmação!</PopoverHeader>
                        <PopoverBody>
                          Deseja converter este pedido em orçamento?
                        </PopoverBody>
                        <PopoverFooter d="flex" justifyContent="flex-end">
                          <ButtonGroup size="sm">
                            <Button
                              variant="outline"
                              colorScheme={config.buttons}
                            >
                              Não
                            </Button>
                            <Button colorScheme={config.buttons}>Sim</Button>
                          </ButtonGroup>
                        </PopoverFooter>
                      </PopoverContent>
                    </Popover>

                    <Popover placement="bottom-end">
                      <PopoverTrigger>
                        <IconButton
                          colorScheme="red"
                          icon={<FaTrash />}
                          size="sm"
                          rounded="full"
                          variant="ghost"
                        />
                      </PopoverTrigger>
                      <PopoverContent _focus={{ outline: "none" }}>
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Confirmação!</PopoverHeader>
                        <PopoverBody>Deseja cancelar este pedido?</PopoverBody>
                        <PopoverFooter d="flex" justifyContent="flex-end">
                          <ButtonGroup size="sm">
                            <Button
                              variant="outline"
                              colorScheme={config.buttons}
                            >
                              Não
                            </Button>
                            <Button colorScheme={config.buttons}>Sim</Button>
                          </ButtonGroup>
                        </PopoverFooter>
                      </PopoverContent>
                    </Popover>

                    <Button
                      leftIcon={<FaCheck />}
                      colorScheme={config.buttons}
                      size="sm"
                      onClick={() => setModalFinish(true)}
                    >
                      Faturar
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
        <Flex
          h="68px"
          borderWidth="1px"
          shadow="md"
          rounded="md"
          align="center"
          pl={3}
          pr={3}
        >
          <Grid templateColumns="repeat(4, 1fr)" gap="15px" w="100%">
            <Button
              size="lg"
              colorScheme="green"
              leftIcon={<AiOutlineRise />}
              onClick={() => setModalRevenue(true)}
            >
              Efetuar Depósito
            </Button>
            <Button
              size="lg"
              colorScheme="red"
              leftIcon={<AiOutlineFall />}
              onClick={() => setModalExpense(true)}
            >
              Efetuar Retirada
            </Button>
            <Button
              size="lg"
              colorScheme="gray"
              leftIcon={<FaChartLine />}
              onClick={() => setModalMoviment(true)}
            >
              Movimentação do Caixa
            </Button>
            <Button
              size="lg"
              colorScheme="blue"
              leftIcon={<FaLock />}
              onClick={() => setModalClose(true)}
            >
              Fechar o Caixa
            </Button>
          </Grid>
        </Flex>
      </Grid>

      <Modal
        isOpen={modalRevenue}
        onClose={() => setModalRevenue(false)}
        isCentered
        scrollBehavior="inside"
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Depósito</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Valor do Depósito</FormLabel>
              <InputGroup size="lg">
                <Input focusBorderColor={config.inputs} />
                <InputRightAddon>R$</InputRightAddon>
              </InputGroup>
            </FormControl>
            <FormControl mt={3}>
              <FormLabel>Descrição</FormLabel>
              <Textarea focusBorderColor={config.inputs} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button leftIcon={<FaSave />} colorScheme={config.buttons}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalExpense}
        onClose={() => setModalExpense(false)}
        isCentered
        scrollBehavior="inside"
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Retirada</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Valor da Retirada</FormLabel>
              <InputGroup size="lg">
                <Input focusBorderColor={config.inputs} />
                <InputRightAddon>R$</InputRightAddon>
              </InputGroup>
            </FormControl>
            <FormControl mt={3}>
              <FormLabel>Descrição</FormLabel>
              <Textarea focusBorderColor={config.inputs} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button leftIcon={<FaSave />} colorScheme={config.buttons}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalFinish}
        onClose={() => setModalFinish(false)}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxW="70rem">
          <ModalHeader>Faturar Pedido</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
                  <Td isTruncated w="62%" maxW="62%">
                    Produto
                  </Td>
                  <Td w="7%" textAlign="center">
                    SKU
                  </Td>
                  <Td w="14%" isNumeric>
                    V. Uni
                  </Td>
                  <Td w="14%" isNumeric>
                    V. Tot
                  </Td>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td w="2%" textAlign="center">
                    10
                  </Td>
                  <Td isTruncated w="62%" maxW="62%">
                    <Text>
                      Camiseta Masculina Masculina Topper adasdasdasda
                    </Text>
                  </Td>
                  <Td w="7%" textAlign="center">
                    SJKD889
                  </Td>
                  <Td w="14%" isNumeric>
                    400,00
                  </Td>
                  <Td w="14%" isNumeric>
                    400,00
                  </Td>
                </Tr>
              </Tbody>
            </Table>

            <Grid templateColumns="1fr 1fr" gap="15px" mt={5}>
              <Box>
                <Center rounded="md" p={2} bg="rgba(160, 174, 192, 0.1)" mb={3}>
                  <Heading fontSize="sm">Resumo</Heading>
                </Center>
                <Box borderWidth="1px" rounded="md" h="123px">
                  <Flex p={3} align="center" justify="space-between" h={10}>
                    <Text>Valor Total</Text>
                    <Text fontWeight="700">R$ 400,00</Text>
                  </Flex>
                  <Divider />
                  <Flex p={3} align="center" justify="space-between" h={10}>
                    <Text>Desconto</Text>
                    <Text fontWeight="700">0%</Text>
                  </Flex>
                  <Divider />
                  <Flex p={3} align="center" justify="space-between" h={10}>
                    <Text>Total a Pagar</Text>
                    <Text fontWeight="700">R$ 400,00</Text>
                  </Flex>
                </Box>
              </Box>
              <Box>
                <Center rounded="md" p={2} bg="rgba(160, 174, 192, 0.1)" mb={3}>
                  <Heading fontSize="sm">Pagamento</Heading>
                </Center>
                <Box
                  borderWidth="1px"
                  rounded="md"
                  h="123px"
                  maxH="123px"
                  overflow="auto"
                >
                  <Table size="sm">
                    <Thead fontWeight="700">
                      <Tr>
                        <Td>Descrição</Td>
                        <Td w="12%" textAlign="center">
                          Vencimento
                        </Td>
                        <Td w="12%" textAlign="center">
                          Status
                        </Td>
                        <Td w="16%" isNumeric>
                          Valor
                        </Td>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td>Dinheiro</Td>
                        <Td w="12%" textAlign="center">
                          10/10/1010
                        </Td>
                        <Td w="12%" textAlign="center">
                          <Button variant="link" size="sm" colorScheme="green">
                            Confirmado
                          </Button>
                        </Td>
                        <Td w="16%" isNumeric>
                          R$ 400,00
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Dinheiro</Td>
                        <Td w="12%" textAlign="center">
                          10/10/1010
                        </Td>
                        <Td w="12%" textAlign="center">
                          <Button variant="link" size="sm" colorScheme="green">
                            Confirmado
                          </Button>
                        </Td>
                        <Td w="16%" isNumeric>
                          R$ 400,00
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Dinheiro</Td>
                        <Td w="12%" textAlign="center">
                          10/10/1010
                        </Td>
                        <Td w="12%" textAlign="center">
                          <Button variant="link" size="sm" colorScheme="green">
                            Confirmado
                          </Button>
                        </Td>
                        <Td w="20%" isNumeric>
                          R$ 400,00
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Dinheiro</Td>
                        <Td w="12%" textAlign="center">
                          10/10/1010
                        </Td>
                        <Td w="12%" textAlign="center">
                          <Button variant="link" size="sm" colorScheme="green">
                            Confirmado
                          </Button>
                        </Td>
                        <Td w="16%" isNumeric>
                          R$ 400,00
                        </Td>
                      </Tr>
                      <Tr>
                        <Td>Dinheiro</Td>
                        <Td w="12%" textAlign="center">
                          10/10/1010
                        </Td>
                        <Td w="12%" textAlign="center">
                          <Button variant="link" size="sm" colorScheme="green">
                            Confirmado
                          </Button>
                        </Td>
                        <Td w="20%" isNumeric>
                          R$ 400,00
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Box>
              </Box>
            </Grid>
          </ModalBody>
          <ModalFooter>
            <Button leftIcon={<FaCheck />} colorScheme={config.buttons}>
              Faturar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalMoviment}
        onClose={() => setModalMoviment(false)}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxW="70rem">
          <ModalHeader>Movimentações do Caixa</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(1, 1fr)" gap="15px">
              <Box borderWidth="1px" rounded="md" h="min-content">
                <Flex p={2} align="center">
                  <Icon as={AiOutlineRise} mr={3} />
                  <Text fontWeight="700">Depósitos</Text>
                </Flex>
                <Divider />
                <Table size="sm">
                  <Thead fontWeight="700">
                    <Tr>
                      <Td w="80%">Descrição</Td>
                      <Td textAlign="center">Data</Td>
                      <Td isNumeric>Valor</Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td w="80%">Descrição</Td>
                      <Td textAlign="center">Data</Td>
                      <Td isNumeric>Valor</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>

              <Box borderWidth="1px" rounded="md" h="min-content">
                <Flex p={2} align="center">
                  <Icon as={AiOutlineFall} mr={3} />
                  <Text fontWeight="700">Retiradas</Text>
                </Flex>
                <Divider />
                <Table size="sm">
                  <Thead fontWeight="700">
                    <Tr>
                      <Td w="80%">Descrição</Td>
                      <Td textAlign="center">Data</Td>
                      <Td isNumeric>Valor</Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td w="80%">Descrição</Td>
                      <Td textAlign="center">10/10/1000</Td>
                      <Td isNumeric>R$ 3000,00</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>
            </Grid>

            <Divider mt={5} mb={5} />

            <Box borderWidth="1px" rounded="md">
              <Table size="sm">
                <Tbody>
                  <Tr>
                    <Td fontWeight="700" w="70%">
                      Valor de Abertura
                    </Td>
                    <Td isNumeric>R$ 4000,00</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="700" w="70%">
                      Total das Entradas
                    </Td>
                    <Td isNumeric color="green.400">
                      R$ 4000,00
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="700" w="70%">
                      Total das Saídas
                    </Td>
                    <Td isNumeric color="red.400">
                      R$ 4000,00
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="700" w="70%">
                      Valor de Fechamento
                    </Td>
                    <Td isNumeric>R$ 4000,00</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button leftIcon={<FaPrint />} colorScheme={config.buttons}>
              Imprimir
            </Button>
          </ModalFooter>
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

      <Modal
        isOpen={modalPayments}
        onClose={() => setModalPayments(false)}
        isCentered
        scrollBehavior="inside"
        size="lg"
      >
        <ModalOverlay />
        <ModalContent maxW="50rem">
          <ModalHeader>Pagamentos</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table size="sm">
              <Thead fontWeight="700">
                <Tr>
                  <Td>Descrição</Td>
                  <Td w="12%" textAlign="center">
                    Vencimento
                  </Td>
                  <Td w="12%" textAlign="center">
                    Status
                  </Td>
                  <Td w="16%" isNumeric>
                    Valor
                  </Td>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Dinheiro</Td>
                  <Td w="12%" textAlign="center">
                    10/10/1010
                  </Td>
                  <Td w="12%" textAlign="center">
                    <Button variant="link" size="sm" colorScheme="green">
                      Confirmado
                    </Button>
                  </Td>
                  <Td w="16%" isNumeric>
                    R$ 400,00
                  </Td>
                </Tr>
                <Tr>
                  <Td>Dinheiro</Td>
                  <Td w="12%" textAlign="center">
                    10/10/1010
                  </Td>
                  <Td w="12%" textAlign="center">
                    <Button variant="link" size="sm" colorScheme="green">
                      Confirmado
                    </Button>
                  </Td>
                  <Td w="16%" isNumeric>
                    R$ 400,00
                  </Td>
                </Tr>
                <Tr>
                  <Td>Dinheiro</Td>
                  <Td w="12%" textAlign="center">
                    10/10/1010
                  </Td>
                  <Td w="12%" textAlign="center">
                    <Button variant="link" size="sm" colorScheme="green">
                      Confirmado
                    </Button>
                  </Td>
                  <Td w="20%" isNumeric>
                    R$ 400,00
                  </Td>
                </Tr>
                <Tr>
                  <Td>Dinheiro</Td>
                  <Td w="12%" textAlign="center">
                    10/10/1010
                  </Td>
                  <Td w="12%" textAlign="center">
                    <Button variant="link" size="sm" colorScheme="green">
                      Confirmado
                    </Button>
                  </Td>
                  <Td w="16%" isNumeric>
                    R$ 400,00
                  </Td>
                </Tr>
                <Tr>
                  <Td>Dinheiro</Td>
                  <Td w="12%" textAlign="center">
                    10/10/1010
                  </Td>
                  <Td w="12%" textAlign="center">
                    <Button variant="link" size="sm" colorScheme="green">
                      Confirmado
                    </Button>
                  </Td>
                  <Td w="20%" isNumeric>
                    R$ 400,00
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </ModalBody>
          <ModalFooter>
            <Popover placement="left">
              <PopoverTrigger>
                <Button leftIcon={<FaPlus />} colorScheme={config.buttons}>
                  Nova Forma de Pagamento
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Confirmação!</PopoverHeader>
                <PopoverBody>
                  Estes pagamentos serão excluídos e adicionados os novos ao
                  pedido, deseja continuar?
                </PopoverBody>
                <PopoverFooter d="flex" justifyContent="flex-end">
                  <ButtonGroup size="sm">
                    <Button variant="outline" colorScheme={config.buttons}>
                      Não
                    </Button>
                    <Button
                      colorScheme={config.buttons}
                      onClick={() => handlePayment()}
                    >
                      Sim
                    </Button>
                  </ButtonGroup>
                </PopoverFooter>
              </PopoverContent>
            </Popover>
          </ModalFooter>
        </ModalContent>
      </Modal>

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

      <AlertDialog
        motionPreset="slideInBottom"
        leastDestructiveRef={cancelRef}
        onClose={() => setModalClose(false)}
        isOpen={modalClose}
        isCentered
      >
        <AlertDialogOverlay />

        <AlertDialogContent>
          <AlertDialogHeader>Fechar o Caixa</AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Após o fechamento do caixa, não será mais possível fazer
            movimentações ou utilizá-lo, deseja prosseguir?
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              onClick={() => setModalClose(false)}
              colorScheme={config.buttons}
              variant="outline"
            >
              Não
            </Button>
            <Button
              colorScheme={config.buttons}
              ml={3}
              ref={cancelRef}
              onClick={() => handleCloseCashier()}
            >
              Sim
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Modal
        isOpen={modalCloseCashier}
        onClose={() => setModalCloseCashier(false)}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxW="50rem">
          <ModalHeader>Fechamento de Caixa</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="repeat(1, 1fr)" gap="15px">
              <Box borderWidth="1px" rounded="md" h="min-content">
                <Flex p={2} align="center">
                  <Icon as={AiOutlineRise} mr={3} />
                  <Text fontWeight="700">Depósitos</Text>
                </Flex>
                <Divider />
                <Table size="sm">
                  <Thead fontWeight="700">
                    <Tr>
                      <Td w="80%">Descrição</Td>
                      <Td textAlign="center">Data</Td>
                      <Td isNumeric>Valor</Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td w="80%">Descrição</Td>
                      <Td textAlign="center">Data</Td>
                      <Td isNumeric>Valor</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>

              <Box borderWidth="1px" rounded="md" h="min-content">
                <Flex p={2} align="center">
                  <Icon as={AiOutlineFall} mr={3} />
                  <Text fontWeight="700">Retiradas</Text>
                </Flex>
                <Divider />
                <Table size="sm">
                  <Thead fontWeight="700">
                    <Tr>
                      <Td w="80%">Descrição</Td>
                      <Td textAlign="center">Data</Td>
                      <Td isNumeric>Valor</Td>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td w="80%">Descrição</Td>
                      <Td textAlign="center">10/10/1000</Td>
                      <Td isNumeric>R$ 3000,00</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Box>
            </Grid>

            <Box borderWidth="1px" rounded="md" h="min-content" mt="15px">
              <Flex p={2} align="center">
                <Icon as={AiOutlineFall} mr={3} />
                <Text fontWeight="700">Resumo das Movimentações de Caixa</Text>
              </Flex>
              <Divider />
              <Table size="sm">
                <Tbody>
                  <Tr>
                    <Td fontWeight="700" w="70%">
                      Valor de Abertura
                    </Td>
                    <Td isNumeric>R$ 4000,00</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="700" w="70%">
                      Total das Entradas
                    </Td>
                    <Td isNumeric color="green.400">
                      R$ 4000,00
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="700" w="70%">
                      Total das Saídas
                    </Td>
                    <Td isNumeric color="red.400">
                      R$ 4000,00
                    </Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="700" w="70%">
                      Valor de Fechamento
                    </Td>
                    <Td isNumeric>R$ 4000,00</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>

            <Box borderWidth="1px" rounded="md" h="min-content" mt="15px">
              <Flex p={2} align="center">
                <Icon as={AiOutlineFall} mr={3} />
                <Text fontWeight="700">Resumo dos Pagamentos</Text>
              </Flex>
              <Divider />
              <Table size="sm">
                <Tbody>
                  <Tr>
                    <Td fontWeight="700" w="70%">
                      Total em Dinheiro
                    </Td>
                    <Td isNumeric>R$ 4000,00</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="700" w="70%">
                      Total em Cartão de Crédito
                    </Td>
                    <Td isNumeric>R$ 4000,00</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="700" w="70%">
                      Total em Cartão de Débito
                    </Td>
                    <Td isNumeric>R$ 4000,00</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="700" w="70%">
                      Total em Cheque
                    </Td>
                    <Td isNumeric>R$ 4000,00</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="700" w="70%">
                      Total em Duplicata
                    </Td>
                    <Td isNumeric>R$ 4000,00</Td>
                  </Tr>
                  <Tr>
                    <Td fontWeight="700" w="70%">
                      Total em Transferências
                    </Td>
                    <Td isNumeric>R$ 4000,00</Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              leftIcon={<FaPrint />}
              mr={3}
              colorScheme={config.buttons}
              variant="outline"
            >
              Imprimir Relatório
            </Button>
            <Button
              leftIcon={<FaCheck />}
              colorScheme={config.buttons}
              onClick={() => routing("/cashiermoviment")}
            >
              Concluir
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
