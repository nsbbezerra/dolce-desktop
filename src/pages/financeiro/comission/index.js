import React from "react";
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
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
} from "@chakra-ui/react";
import HeaderApp from "../../../components/headerApp";
import { FaPercentage, FaSearch } from "react-icons/fa";
import config from "../../../configs/index";

export default function Comissions() {
  return (
    <>
      <HeaderApp title="Gerenciar Comissões" icon={FaPercentage} />

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
              <Td w="10%" textAlign="center">
                Nº Venda
              </Td>
              <Td w="10%" textAlign="center">
                Data
              </Td>
              <Td w="10%" isNumeric>
                Valor
              </Td>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Natanael dos Santos Bezerra</Td>
              <Td w="10%" textAlign="center">
                1010
              </Td>
              <Td w="10%" textAlign="center">
                10/10/1010
              </Td>
              <Td w="10%" isNumeric>
                R$ 40,00
              </Td>
            </Tr>
          </Tbody>
        </Table>

        <Stat mt={5} ml={5}>
          <StatLabel>Total das Comissões</StatLabel>
          <StatNumber>R$ 40,00</StatNumber>
          <StatHelpText>
            <strong>Data do cálculo:</strong> 10/10/1010
          </StatHelpText>
        </Stat>
      </Box>
    </>
  );
}
