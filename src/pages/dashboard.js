import React from "react";
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
  Tfoot,
  Divider,
} from "@chakra-ui/react";

import { AiOutlineFall, AiOutlineZoomIn } from "react-icons/ai";
import {} from "react-icons/fa";
import {} from "react-icons/md";

export default function Dashboard() {
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
        <Box borderWidth="1px" rounded="md" shadow="md" overflow="hidden">
          <Flex borderBottomWidth="1px" h="35px" align="center" pl={3}>
            <Icon as={AiOutlineFall} mr={3} />
            <Heading size="sm">Contas a Pagar (Hoje)</Heading>
          </Flex>
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
          <Divider />
          <Flex p={2} justify="flex-end" w="100%">
            <Button size="sm" leftIcon={<AiOutlineZoomIn />}>
              Veja Mais
            </Button>
          </Flex>
        </Box>
        <Box borderWidth="1px" rounded="md" shadow="md">
          <Flex borderBottomWidth="1px" h="35px" align="center" pl={3}>
            <Icon as={AiOutlineFall} mr={3} />
            <Heading size="sm">Contas a Receber (Hoje)</Heading>
          </Flex>
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
      </Grid>
    </>
  );
}
