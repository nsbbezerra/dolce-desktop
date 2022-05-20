import React, { memo } from "react";
import {
  Box,
  Grid,
  Stat,
  StatNumber,
  StatLabel,
  Flex,
  Icon,
  Heading,
  Table,
  Thead,
  Tbody,
  Td,
  Tr,
  Button,
} from "@chakra-ui/react";
import {
  AiOutlineFall,
  AiOutlinePieChart,
  AiOutlineRise,
  AiOutlineZoomIn,
} from "react-icons/ai";
import { FaBarcode, FaGlobe } from "react-icons/fa";
import config from "../configs/index";
import { useHistory } from "react-router-dom";

function Dashboard() {
  const { push } = useHistory();

  function routing(rt) {
    push(rt);
  }

  return (
    <>
      <Grid templateColumns="repeat(3, 1fr)" gap={"25px"}>
        <Box borderWidth="1px" rounded="md" p={3} shadow="md">
          <Stat>
            <StatLabel>Clientes Cadastrados</StatLabel>
            <StatNumber>1200</StatNumber>
          </Stat>
        </Box>
        <Box borderWidth="1px" rounded="md" p={3} shadow="md">
          <Stat>
            <StatLabel>Produtos Cadastrados</StatLabel>
            <StatNumber>1200</StatNumber>
          </Stat>
        </Box>
        <Box borderWidth="1px" rounded="md" p={3} shadow="md">
          <Stat>
            <StatLabel>Vendas Realizadas</StatLabel>
            <StatNumber>1200</StatNumber>
          </Stat>
        </Box>
      </Grid>

      <Grid templateColumns="repeat(2, 1fr)" gap="25px" mt="25px">
        <Box
          borderWidth="1px"
          rounded="md"
          shadow="md"
          overflow="hidden"
          h="285px"
        >
          <Flex borderBottomWidth="1px" h="35px" align="center" pl={3}>
            <Icon as={AiOutlineFall} mr={3} />
            <Heading size="sm">Contas a Pagar (Hoje)</Heading>
          </Flex>
          <Box h="200px">
            <Table size="sm" variant="striped">
              <Thead fontWeight="700">
                <Tr>
                  <Td w="60%">Descrição</Td>
                  <Td w="20%">Data</Td>
                  <Td w="20%" isNumeric>
                    Valor
                  </Td>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td w="60%" isTruncated>
                    Pagamento de Boletos
                  </Td>
                  <Td w="20%">10/10/2010</Td>
                  <Td w="20%" isNumeric>
                    R$ 20,00
                  </Td>
                </Tr>
                <Tr>
                  <Td w="60%" isTruncated>
                    Pagamento de Boletos
                  </Td>
                  <Td w="20%">10/10/2010</Td>
                  <Td w="20%" isNumeric>
                    R$ 20,00
                  </Td>
                </Tr>
                <Tr>
                  <Td w="60%" isTruncated>
                    Pagamento de Boletos
                  </Td>
                  <Td w="20%">10/10/2010</Td>
                  <Td w="20%" isNumeric>
                    R$ 20,00
                  </Td>
                </Tr>
                <Tr>
                  <Td w="60%" isTruncated>
                    Pagamento de Boletos
                  </Td>
                  <Td w="20%">10/10/2010</Td>
                  <Td w="20%" isNumeric>
                    R$ 20,00
                  </Td>
                </Tr>
                <Tr>
                  <Td w="60%" isTruncated>
                    Pagamento de Boletos
                  </Td>
                  <Td w="20%">10/10/2010</Td>
                  <Td w="20%" isNumeric>
                    R$ 20,00
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>

          <Flex p={2} justify="flex-end" w="100%">
            <Button
              size="sm"
              colorScheme={config.buttons}
              leftIcon={<AiOutlineZoomIn />}
              onClick={() => routing("/expenses")}
            >
              Veja Mais
            </Button>
          </Flex>
        </Box>
        <Box borderWidth="1px" rounded="md" shadow="md" h="285px">
          <Flex borderBottomWidth="1px" h="35px" align="center" pl={3}>
            <Icon as={AiOutlineRise} mr={3} />
            <Heading size="sm">Contas a Receber (Hoje)</Heading>
          </Flex>
          <Box h="200px">
            <Table size="sm" variant="striped">
              <Thead fontWeight="700">
                <Tr>
                  <Td w="60%">Descrição</Td>
                  <Td w="20%">Data</Td>
                  <Td w="20%" isNumeric>
                    Valor
                  </Td>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td w="60%" isTruncated>
                    Pagamento de Boletos
                  </Td>
                  <Td w="20%">10/10/2010</Td>
                  <Td w="20%" isNumeric>
                    R$ 20,00
                  </Td>
                </Tr>
                <Tr>
                  <Td w="60%" isTruncated>
                    Pagamento de Boletos
                  </Td>
                  <Td w="20%">10/10/2010</Td>
                  <Td w="20%" isNumeric>
                    R$ 20,00
                  </Td>
                </Tr>
                <Tr>
                  <Td w="60%" isTruncated>
                    Pagamento de Boletos
                  </Td>
                  <Td w="20%">10/10/2010</Td>
                  <Td w="20%" isNumeric>
                    R$ 20,00
                  </Td>
                </Tr>

                <Tr>
                  <Td w="60%" isTruncated>
                    Pagamento de Boletos
                  </Td>
                  <Td w="20%">10/10/2010</Td>
                  <Td w="20%" isNumeric>
                    R$ 20,00
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>

          <Flex p={2} justify="flex-end" w="100%">
            <Button
              size="sm"
              colorScheme={config.buttons}
              leftIcon={<AiOutlineZoomIn />}
              onClick={() => routing("/revenues")}
            >
              Veja Mais
            </Button>
          </Flex>
        </Box>
      </Grid>

      <Box borderWidth="1px" rounded="md" shadow="md" mt="25px">
        <Flex borderBottomWidth="1px" h="35px" align="center" pl={3}>
          <Icon as={FaBarcode} mr={3} />
          <Heading size="sm">Status de Pagamentos</Heading>
        </Flex>
        <Flex align="center" justify="center" p={2}></Flex>
      </Box>

      <Grid templateColumns="repeat(2, 1fr)" gap="25px">
        <Box borderWidth="1px" rounded="md" shadow="md" mt="25px">
          <Flex borderBottomWidth="1px" h="35px" align="center" pl={3}>
            <Icon as={AiOutlinePieChart} mr={3} />
            <Heading size="sm">Balanço Mensal</Heading>
          </Flex>
          <Flex align="center" justify="center" p={2}></Flex>
        </Box>

        <Box borderWidth="1px" rounded="md" shadow="md" mt="25px">
          <Flex borderBottomWidth="1px" h="35px" align="center" pl={3}>
            <Icon as={FaGlobe} mr={3} />
            <Heading size="sm">Vendas Realizadas no Site</Heading>
          </Flex>
          <Flex align="center" justify="center" p={2}></Flex>
        </Box>
      </Grid>
    </>
  );
}

export default memo(Dashboard);
