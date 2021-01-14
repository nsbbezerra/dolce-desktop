import React, { useState, useRef } from "react";
import {
  Input,
  Button,
  Grid,
  Select,
  Table,
  Thead,
  Tbody,
  Td,
  Tr,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Switch,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Divider,
  Box,
  Flex,
  Icon,
  Text,
} from "@chakra-ui/react";
import config from "../../../configs/index";
import { FaSave, FaSearch } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { AiOutlineRise, AiOutlineFall } from "react-icons/ai";

export default function ListBankAccount() {
  const initialRef = useRef();

  const [modalEdit, setModalEdit] = useState(false);
  const [drawerMoviment, setDrawerMoviment] = useState(false);
  const [typeSearch, setTypeSearch] = useState(1);

  const DataAtual = new Date();
  const Ano = DataAtual.getFullYear();

  function handleSearch(value) {
    setTypeSearch(parseInt(value));
  }

  return (
    <>
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

        <Button leftIcon={<FaSearch />}>Buscar</Button>
      </Grid>

      <Table size="sm" mt="25px">
        <Thead fontWeight="700">
          <Tr>
            <Td w="10%">Ativo?</Td>
            <Td w="40%">Conta Bancária</Td>
            <Td isNumeric>Valor</Td>
            <Td w="15%"></Td>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td w="10%">
              <Switch id="email-alerts" colorScheme={config.switchs} />
            </Td>
            <Td w="40%">Bando do Brasil</Td>
            <Td isNumeric>R$ 4000,00</Td>
            <Td w="15%">
              <Menu>
                <MenuButton
                  isFullWidth
                  as={Button}
                  rightIcon={<MdKeyboardArrowDown />}
                  size="sm"
                >
                  Opções
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => setDrawerMoviment(true)}>
                    Movimentação Financeira
                  </MenuItem>
                  <MenuItem onClick={() => setModalEdit(true)}>
                    Alterar Valor
                  </MenuItem>
                  <MenuItem>Excluir</MenuItem>
                </MenuList>
              </Menu>
            </Td>
          </Tr>
          <Tr>
            <Td w="10%">
              <Switch id="email-alerts" colorScheme={config.switchs} />
            </Td>
            <Td w="40%">Caixa Econômica</Td>
            <Td isNumeric>R$ 4000,00</Td>
            <Td w="15%">
              <Menu>
                <MenuButton
                  isFullWidth
                  as={Button}
                  rightIcon={<MdKeyboardArrowDown />}
                  size="sm"
                >
                  Opções
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => setDrawerMoviment(true)}>
                    Movimentação Financeira
                  </MenuItem>
                  <MenuItem onClick={() => setModalEdit(true)}>
                    Alterar Valor
                  </MenuItem>
                  <MenuItem>Excluir</MenuItem>
                </MenuList>
              </Menu>
            </Td>
          </Tr>
          <Tr>
            <Td w="10%">
              <Switch id="email-alerts" colorScheme={config.switchs} />
            </Td>
            <Td w="40%">Bando da Amazônia</Td>
            <Td isNumeric>R$ 4000,00</Td>
            <Td w="15%">
              <Menu>
                <MenuButton
                  isFullWidth
                  as={Button}
                  rightIcon={<MdKeyboardArrowDown />}
                  size="sm"
                >
                  Opções
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => setDrawerMoviment(true)}>
                    Movimentação Financeira
                  </MenuItem>
                  <MenuItem onClick={() => setModalEdit(true)}>
                    Alterar Valor
                  </MenuItem>
                  <MenuItem>Excluir</MenuItem>
                </MenuList>
              </Menu>
            </Td>
          </Tr>
        </Tbody>
      </Table>

      <Modal
        size="xl"
        isOpen={modalEdit}
        onClose={() => setModalEdit(false)}
        isCentered
        initialFocusRef={initialRef}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Alterar Valor</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="1fr 1fr" gap="15px">
              <FormControl>
                <FormLabel>Valor Atual</FormLabel>
                <Input
                  focusBorderColor={config.inputs}
                  isReadOnly
                  value="4000"
                  type="number"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Novo Valor</FormLabel>
                <Input
                  ref={initialRef}
                  focusBorderColor={config.inputs}
                  type="number"
                />
              </FormControl>
            </Grid>
          </ModalBody>

          <ModalFooter>
            <Button variant="solid" colorScheme="blue" leftIcon={<FaSave />}>
              Salvar Alteração
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Drawer
        isOpen={drawerMoviment}
        placement="right"
        onClose={() => setDrawerMoviment(false)}
        size="xl"
        scrollBehavior="inside"
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Movimentação Financeira</DrawerHeader>

            <DrawerBody>
              <Grid templateColumns="1fr 150px 150px 150px" gap="15px">
                <FormControl isRequired>
                  <FormLabel>Selecione uma opção</FormLabel>
                  <Select
                    placeholder="Selecione uma opção de busca"
                    focusBorderColor={config.inputs}
                    onChange={(e) => handleSearch(e.target.value)}
                    value={typeSearch}
                  >
                    <option value={1}>Por Período</option>
                    <option value={2}>Por Mês</option>
                    <option value={3}>Por Ano</option>
                  </Select>
                </FormControl>
                {typeSearch === 1 ? (
                  <>
                    <FormControl isRequired>
                      <FormLabel>Período Inicial</FormLabel>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Período Final</FormLabel>
                    </FormControl>
                  </>
                ) : (
                  <>
                    <FormControl
                      isRequired
                      isDisabled={typeSearch === 3 ? true : false}
                    >
                      <FormLabel>Mês</FormLabel>
                      <Select
                        placeholder="Selecione um mês"
                        focusBorderColor={config.inputs}
                      >
                        <option value="Janeiro">Janeiro</option>
                        <option value="Fevereiro">Fevereiro</option>
                        <option value="Março">Março</option>
                        <option value="Abril">Abril</option>
                        <option value="Maio">Maio</option>
                        <option value="Junho">Junho</option>
                        <option value="Julho">Julho</option>
                        <option value="Agosto">Agosto</option>
                        <option value="Setembro">Setembro</option>
                        <option value="Outubro">Outubro</option>
                        <option value="Novembro">Novembro</option>
                        <option value="Dezembro">Dezembro</option>
                      </Select>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Ano</FormLabel>
                      <Select
                        placeholder="Selecione um ano"
                        focusBorderColor={config.inputs}
                      >
                        <option value={Ano - 1}>{Ano - 1}</option>
                        <option value={Ano}>{Ano}</option>
                        <option value={Ano + 1}>{Ano + 1}</option>
                        <option value={Ano + 2}>{Ano + 2}</option>
                        <option value={Ano + 3}>{Ano + 3}</option>
                      </Select>
                    </FormControl>
                  </>
                )}

                <FormControl>
                  <FormLabel color="transparent" userSelect="none">
                    Ano
                  </FormLabel>
                  <Button isFullWidth leftIcon={<FaSearch />}>
                    Buscar
                  </Button>
                </FormControl>
              </Grid>

              <Divider mt={10} mb={10} />

              <Grid templateColumns="repeat(2, 1fr)" gap="15px">
                <Box borderWidth="1px" rounded="md" h="min-content">
                  <Flex p={2} align="center">
                    <Icon as={AiOutlineRise} mr={3} />
                    <Text fontWeight="700">Entradas</Text>
                  </Flex>
                  <Divider />
                  <Table size="sm">
                    <Thead fontWeight="700">
                      <Tr>
                        <Td w="60%">Data</Td>
                        <Td isNumeric>Valor</Td>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td w="60%">10/10/1000</Td>
                        <Td isNumeric>R$ 3000,00</Td>
                      </Tr>
                      <Tr>
                        <Td w="60%">10/10/1000</Td>
                        <Td isNumeric>R$ 3000,00</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Box>

                <Box borderWidth="1px" rounded="md" h="min-content">
                  <Flex p={2} align="center">
                    <Icon as={AiOutlineFall} mr={3} />
                    <Text fontWeight="700">Saídas</Text>
                  </Flex>
                  <Divider />
                  <Table size="sm">
                    <Thead fontWeight="700">
                      <Tr>
                        <Td w="60%">Data</Td>
                        <Td isNumeric>Valor</Td>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td w="60%">10/10/1000</Td>
                        <Td isNumeric>R$ 3000,00</Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Box>
              </Grid>

              <Divider mt={10} mb={10} />

              <Box borderWidth="1px" rounded="md">
                <Table>
                  <Tbody>
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
                  </Tbody>
                </Table>
              </Box>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
    </>
  );
}
