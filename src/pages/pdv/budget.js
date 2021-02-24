import React, { useState } from "react";
import {
  Box,
  Grid,
  Select,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Checkbox,
  MenuItem,
  MenuDivider,
  Menu,
  MenuButton,
  MenuList,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  InputGroup,
  InputLeftAddon,
  HStack,
  Divider,
  Text,
  Center,
  Heading,
} from "@chakra-ui/react";
import config from "../../configs/index";
import {
  FaSearch,
  FaShoppingBag,
  FaPrint,
  FaClipboardList,
  FaTrash,
  FaCheck,
} from "react-icons/fa";
import HeaderApp from "../../components/headerApp";
import { MdKeyboardArrowDown } from "react-icons/md";

import PaymentMiddleware from "../../middlewares/payment";
import PrintMiddleware from "../../middlewares/print";

export default function Budget() {
  const [modalPdv, setModalPdv] = useState(false);
  const [modalPayment, setModalPayment] = useState(false);
  const [modalPrint, setModalPrint] = useState(false);

  function handleFinalize() {
    setModalPdv(false);
    setModalPayment(true);
  }

  return (
    <>
      <HeaderApp title="Orçamentos" icon={FaClipboardList} />

      <Box borderWidth="1px" shadow="md" rounded="md" p={3} mt="25px">
        <Grid templateColumns="1fr 1fr 200px" gap="15px">
          <Select
            placeholder="Selecione uma opção de busca"
            focusBorderColor={config.inputs}
          >
            <option value="option1">Todas as contas</option>
            <option value="option2">Buscar pelo nome</option>
            <option value="option3">Buscar ativas</option>
            <option value="option4">Buscar bloqueadas</option>
          </Select>

          <Input
            type="text"
            placeholder="Digite para buscar"
            focusBorderColor={config.inputs}
          />

          <Button
            leftIcon={<FaSearch />}
            colorScheme={config.buttons}
            variant="outline"
          >
            Buscar
          </Button>
        </Grid>

        <Table size="sm" mt="25px">
          <Thead fontWeight="700">
            <Tr>
              <Td w="2%" textAlign="center"></Td>
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
              <Td w="2%" textAlign="center">
                <Checkbox defaultIsChecked colorScheme={config.switchs} />
              </Td>
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

              <Td w="8%">
                <Menu>
                  <MenuButton
                    isFullWidth
                    as={Button}
                    rightIcon={<MdKeyboardArrowDown />}
                    size="sm"
                    colorScheme={config.buttons}
                  >
                    Opções
                  </MenuButton>
                  <MenuList>
                    <MenuItem
                      icon={<FaPrint />}
                      onClick={() => setModalPrint(true)}
                    >
                      Imprimir Orçamento
                    </MenuItem>

                    <MenuItem
                      icon={<FaShoppingBag />}
                      onClick={() => setModalPdv(true)}
                    >
                      Converter em Pedido
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem icon={<FaTrash />}>Excluir Orçamento</MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          </Tbody>
        </Table>

        <Button
          leftIcon={<FaShoppingBag />}
          colorScheme={config.buttons}
          size="lg"
          mt={5}
          onClick={() => setModalPdv(true)}
        >
          Gerar Pedido Único
        </Button>
      </Box>

      <Modal
        isOpen={modalPdv}
        onClose={() => setModalPdv(false)}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxW="95vw" minH="95vh" overflow="hidden">
          <ModalHeader>Ponto de Venda</ModalHeader>
          <ModalCloseButton />
          <ModalBody overflow="hidden">
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
          </ModalBody>
          <ModalFooter>
            <Grid templateColumns="3fr 1fr" gap="15px">
              <Grid templateColumns="repeat(3, 1fr)" gap="10px" pl={3}>
                <InputGroup size="lg">
                  <InputLeftAddon>Total</InputLeftAddon>
                  <Input focusBorderColor={config.inputs} />
                </InputGroup>

                <InputGroup size="lg">
                  <InputLeftAddon>Desconto</InputLeftAddon>
                  <Input focusBorderColor={config.inputs} />
                </InputGroup>

                <InputGroup size="lg">
                  <InputLeftAddon>Total a Pagar</InputLeftAddon>
                  <Input focusBorderColor={config.inputs} />
                </InputGroup>
              </Grid>
              <Grid templateColumns="1fr" gap="15px" pr={3}>
                <Button
                  leftIcon={<FaCheck />}
                  colorScheme={config.buttons}
                  onClick={() => handleFinalize()}
                  size="lg"
                >
                  Finalizar Pedido
                </Button>
              </Grid>
            </Grid>
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
    </>
  );
}
