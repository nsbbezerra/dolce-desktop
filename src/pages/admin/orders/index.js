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
  Tooltip,
  MenuItem,
  MenuDivider,
  Menu,
  MenuButton,
  MenuList,
  Tag,
} from "@chakra-ui/react";
import config from "../../../configs/index";
import {
  FaSearch,
  FaShoppingBag,
  FaPrint,
  FaClipboardList,
  FaBarcode,
} from "react-icons/fa";
import HeaderApp from "../../../components/headerApp";
import { MdKeyboardArrowDown } from "react-icons/md";
import { AiOutlineStop } from "react-icons/ai";

export default function ListOrders() {
  return (
    <>
      <HeaderApp title="Gerenciar Pedidos" icon={FaShoppingBag} />

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
              <Td w="6%" textAlign="center">
                Origem
              </Td>
              <Td w="11%" textAlign="center">
                Status Pagamento
              </Td>
              <Td w="11%" textAlign="center">
                Status Site
              </Td>
              <Td w="11%" textAlign="center">
                Status PDV
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
              <Td w="6%" textAlign="center">
                <Tag colorScheme="blue">SITE</Tag>
              </Td>
              <Td w="11%" textAlign="center">
                <Tooltip label="Clique para alterar" hasArrow>
                  <Button size="sm" variant="link" colorScheme="yellow">
                    Aguardando
                  </Button>
                </Tooltip>
              </Td>
              <Td w="11%" textAlign="center">
                <Tooltip label="Clique para alterar" hasArrow>
                  <Button size="sm" variant="link" colorScheme="green">
                    Em Separação
                  </Button>
                </Tooltip>
              </Td>
              <Td w="11%" textAlign="center">
                <Tooltip label="Clique para alterar" hasArrow>
                  <Button size="sm" variant="link" colorScheme="green">
                    Em Separação
                  </Button>
                </Tooltip>
              </Td>
              <Td w="8%">
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
                    <MenuItem icon={<FaPrint />}>Imprimir Pedido</MenuItem>
                    <MenuDivider />
                    <MenuItem icon={<FaBarcode />}>
                      Visualizar Pagamentos
                    </MenuItem>
                    <MenuItem icon={<FaClipboardList />}>
                      Converter em Orçamento
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem icon={<AiOutlineStop />}>
                      Cancelar Pedido
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </>
  );
}
