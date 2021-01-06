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
} from "@chakra-ui/react";
import * as Recharts from "recharts/umd/Recharts";
import {
  AiOutlineFall,
  AiOutlinePieChart,
  AiOutlineRise,
  AiOutlineZoomIn,
} from "react-icons/ai";
import { FaBarcode, FaGlobe } from "react-icons/fa";
import {} from "react-icons/md";

const LineChart = Recharts.LineChart;
const Line = Recharts.Line;
const XAxis = Recharts.XAxis;
const YAxis = Recharts.YAxis;
const CartesianGrid = Recharts.CartesianGrid;
const Tooltip = Recharts.Tooltip;
const Legend = Recharts.Legend;
const Responsive = Recharts.ResponsiveContainer;

export default function Dashboard() {
  const data = [
    {
      name: "Janeiro 2021",
      Entradas: 4000,
      Saidas: 2400,
    },
    {
      name: "Fevereiro 2021",
      Entradas: 3000,
      Saidas: 1398,
    },
    {
      name: "Março 2021",
      Entradas: 2000,
      Saidas: 9800,
    },
    {
      name: "Abril 2021",
      Entradas: 2780,
      Saidas: 3908,
    },
    {
      name: "Maio 2021",
      Entradas: 1890,
      Saidas: 4800,
    },
    {
      name: "Junho 2021",
      Entradas: 2390,
      Saidas: 3800,
    },
    {
      name: "Julho 2021",
      Entradas: 3490,
      Saidas: 4300,
    },
  ];

  const dataTwo = [
    {
      name: "Janeiro 2021",
      Vendas: 4000,
    },
    {
      name: "Fevereiro 2021",
      Vendas: 3000,
    },
    {
      name: "Março 2021",
      Vendas: 2000,
    },
    {
      name: "Abril 2021",
      Vendas: 2780,
    },
    {
      name: "Maio 2021",
      Vendas: 1890,
    },
    {
      name: "Junho 2021",
      Vendas: 2390,
    },
    {
      name: "Julho 2021",
      Vendas: 3490,
    },
  ];

  const dataThree = [
    {
      name: "Janeiro 2021",
      Recebidos: 4000,
      Devidos: 2400,
    },
    {
      name: "Fevereiro 2021",
      Recebidos: 3000,
      Devidos: 1398,
    },
    {
      name: "Março 2021",
      Recebidos: 2000,
      Devidos: 9800,
    },
    {
      name: "Abril 2021",
      Recebidos: 2780,
      Devidos: 3908,
    },
    {
      name: "Maio 2021",
      Recebidos: 1890,
      Devidos: 4800,
    },
    {
      name: "Junho 2021",
      Recebidos: 2390,
      Devidos: 3800,
    },
    {
      name: "Julho 2021",
      Recebidos: 3490,
      Devidos: 4300,
    },
  ];

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
            <Button size="sm" leftIcon={<AiOutlineZoomIn />}>
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
            <Button size="sm" leftIcon={<AiOutlineZoomIn />}>
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
        <Flex align="center" justify="center" p={2}>
          <div style={{ width: "100%", height: 300 }}>
            <Responsive>
              <LineChart
                data={dataThree}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Recebidos" stroke="#38A169" />
                <Line type="monotone" dataKey="Devidos" stroke="#E53E3E" />
              </LineChart>
            </Responsive>
          </div>
        </Flex>
      </Box>

      <Grid templateColumns="repeat(2, 1fr)" gap="25px">
        <Box borderWidth="1px" rounded="md" shadow="md" mt="25px">
          <Flex borderBottomWidth="1px" h="35px" align="center" pl={3}>
            <Icon as={AiOutlinePieChart} mr={3} />
            <Heading size="sm">Balanço Mensal</Heading>
          </Flex>
          <Flex align="center" justify="center" p={2}>
            <div style={{ width: "100%", height: 300 }}>
              <Responsive>
                <LineChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Entradas" stroke="#38A169" />
                  <Line type="monotone" dataKey="Saidas" stroke="#E53E3E" />
                </LineChart>
              </Responsive>
            </div>
          </Flex>
        </Box>

        <Box borderWidth="1px" rounded="md" shadow="md" mt="25px">
          <Flex borderBottomWidth="1px" h="35px" align="center" pl={3}>
            <Icon as={FaGlobe} mr={3} />
            <Heading size="sm">Vendas Realizadas no Site</Heading>
          </Flex>
          <Flex align="center" justify="center" p={2}>
            <div style={{ width: "100%", height: 300 }}>
              <Responsive>
                <LineChart
                  data={dataTwo}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Vendas" stroke="#38A169" />
                </LineChart>
              </Responsive>
            </div>
          </Flex>
        </Box>
      </Grid>
    </>
  );
}
