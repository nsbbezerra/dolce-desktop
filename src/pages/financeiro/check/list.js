import React from "react";
import {
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
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import config from "../../../configs/index";
import { FaSearch } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";

export default function ListCheck() {
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
            <Td isTruncated>Cliente</Td>
            <Td isTruncated>Número</Td>
            <Td>Situação</Td>
            <Td>Tipo</Td>
            <Td>Emissão</Td>
            <Td>Vencimento</Td>
            <Td isNumeric w="15%">
              Valor
            </Td>
            <Td w="15%"></Td>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td isTruncated>Natanael dos Santos Bezerra</Td>
            <Td isTruncated>1312989123 91283791827 98172983172</Td>
            <Td>
              <Tooltip label="Clique para alterar" hasArrow>
                <Button
                  isTruncated
                  noOfLines={1}
                  variant="link"
                  colorScheme="yellow"
                  size="sm"
                >
                  Aguardando
                </Button>
              </Tooltip>
            </Td>
            <Td>
              <Tooltip label="Clique para alterar" hasArrow>
                <Button
                  isTruncated
                  noOfLines={1}
                  variant="link"
                  colorScheme="blue"
                  size="sm"
                >
                  À Vista
                </Button>
              </Tooltip>
            </Td>
            <Td>10/10/1010</Td>
            <Td>10/10/1010</Td>
            <Td isNumeric w="15%">
              R$ 4000,00
            </Td>
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
                  <MenuItem>Editar</MenuItem>
                  <MenuItem>Excluir</MenuItem>
                </MenuList>
              </Menu>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </>
  );
}
