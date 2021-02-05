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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Checkbox,
  HStack,
  Divider,
} from "@chakra-ui/react";
import HeaderApp from "../../../components/headerApp";
import {
  FaBarcode,
  FaPercentage,
  FaReceipt,
  FaSearch,
  FaSearchPlus,
} from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { RiFileSearchFill } from "react-icons/ri";
import { GiReceiveMoney } from "react-icons/gi";
import { AiFillProfile } from "react-icons/ai";
import config from "../../../configs/index";

export default function Payments() {
  return (
    <>
      <HeaderApp title="Gerenciar Pagamentos" icon={FaBarcode} />

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
              <Td w="5%" textAlign="center"></Td>
              <Td>Cliente</Td>
              <Td>Forma de Pagamento</Td>
              <Td w="7%" textAlign="center">
                Nº Venda
              </Td>
              <Td w="10%" textAlign="center">
                Vencimento
              </Td>
              <Td w="12%" textAlign="center">
                Status
              </Td>
              <Td isNumeric w="12%">
                Valor
              </Td>
              <Td w="10%"></Td>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td w="5%" textAlign="center">
                <Checkbox defaultIsChecked colorScheme={config.switchs} />
              </Td>
              <Td>Natanael dos Santos Bezerra</Td>
              <Td>Dinheiro</Td>
              <Td w="7%" textAlign="center">
                1001
              </Td>
              <Td w="10%" textAlign="center">
                10/10/1010
              </Td>
              <Td w="12%" textAlign="center">
                <Tooltip label="Clique para alterar" hasArrow>
                  <Button variant="link" colorScheme="yellow" size="sm">
                    Aguardando
                  </Button>
                </Tooltip>
              </Td>
              <Td isNumeric w="12%">
                R$ 4000,00
              </Td>
              <Td w="10%">
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
                    <MenuItem icon={<FaSearchPlus />}>
                      Mais Informações
                    </MenuItem>
                    <MenuItem icon={<RiFileSearchFill />}>
                      Verificar Pagamento
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem icon={<FaBarcode />}>Emitir Boleto</MenuItem>
                    <MenuItem icon={<AiFillProfile />}>
                      Visualizar Comprovante
                    </MenuItem>
                    <MenuItem icon={<FaReceipt />}>Emitir Recibo</MenuItem>
                    <MenuDivider />
                    <MenuItem icon={<FaPercentage />}>Calcular Juros</MenuItem>
                    <MenuItem icon={<GiReceiveMoney />}>Negociar</MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          </Tbody>
        </Table>

        <Divider mt={5} mb={5} />

        <HStack spacing={3}>
          <Button leftIcon={<GiReceiveMoney />} colorScheme="blue" size="lg">
            Negociar Vários
          </Button>
        </HStack>
      </Box>
    </>
  );
}
