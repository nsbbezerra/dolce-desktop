import React, { useState } from "react";
import {
  Grid,
  Box,
  Button,
  Select,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Tag,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Divider,
  Flex,
  Icon,
  Text,
} from "@chakra-ui/react";
import config from "../../configs/index";
import HeaderApp from "../../components/headerApp";
import { FaFileAlt, FaSearch, FaSearchPlus, FaPrint } from "react-icons/fa";
import { AiOutlineFall, AiOutlineRise } from "react-icons/ai";

export default function ReportCashier() {
  const [modalCloseCashier, setModalCloseCashier] = useState(false);
  return (
    <>
      <HeaderApp title="Relatório de Caixa" icon={FaFileAlt} />

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

          <Button leftIcon={<FaSearch />}>Buscar</Button>
        </Grid>

        <Table size="sm" mt="25px">
          <Thead fontWeight="700">
            <Tr>
              <Td>Colaborador</Td>
              <Td w="8%" textAlign="center">
                Status
              </Td>
              <Td w="13%" textAlign="center">
                Data Abertura
              </Td>

              <Td w="13%" textAlign="center">
                Data Fechamento
              </Td>
              <Td w="13%" isNumeric>
                Valor de Abertura
              </Td>
              <Td w="13%" isNumeric>
                Valor de Fechamento
              </Td>
              <Td w="12%"></Td>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Natanael dos Santos Bezerra</Td>
              <Td w="8%" textAlign="center">
                <Tag colorScheme="red">Fechado</Tag>
              </Td>
              <Td w="13%" textAlign="center">
                10/10/1010
              </Td>
              <Td w="13%" textAlign="center">
                10/10/1010
              </Td>
              <Td w="13%" isNumeric>
                R$ 0,00
              </Td>
              <Td w="13%" isNumeric>
                R$ 400,00
              </Td>
              <Td w="10%">
                <Button
                  size="sm"
                  colorScheme="blue"
                  leftIcon={<FaSearchPlus />}
                  onClick={() => setModalCloseCashier(true)}
                >
                  Visualizar e Imprimir
                </Button>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>

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
            <Button leftIcon={<FaPrint />} colorScheme="blue">
              Imprimir Relatório
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
