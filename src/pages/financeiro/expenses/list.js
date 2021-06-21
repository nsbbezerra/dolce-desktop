import React, { useState } from "react";
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
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
} from "@chakra-ui/react";
import config from "../../../configs/index";
import { FaSave, FaSearch, FaSearchPlus, FaTrash } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import InputMask from "react-input-mask";

export default function ListExpenses() {
  const date = new Date();
  const year = date.getFullYear();
  const [find, setFind] = useState("1");

  const [modalEdit, setModalEdit] = useState(false);
  const [modalMoviment, setModalMoviment] = useState(false);
  const [modalPayment, setModalPayment] = useState(false);

  const [month, setMonth] = useState("");
  const [yearFind, setYearFind] = useState(year);
  const [initMonth, setInitMonth] = useState("");
  const [finalMonth, setFinalMonth] = useState("");

  return (
    <>
      <Grid templateColumns="1fr 1fr 200px" gap="15px">
        <Select
          placeholder="Selecione uma opção de busca"
          focusBorderColor={config.inputs}
          value={find}
          onChange={(e) => setFind(e.target.value)}
        >
          <option value={"1"}>Mês Atual</option>
          <option value={"2"}>Por Período</option>
          <option value={"3"}>Por Intervalo</option>
        </Select>

        {find === "1" && (
          <Input
            type="text"
            placeholder="Digite para buscar"
            focusBorderColor={config.inputs}
            isReadOnly
            isDisabled
          />
        )}

        {find === "2" && (
          <Grid templateColumns="1fr 1fr" gap="15px">
            <Select
              placeholder="Selecione um Mês"
              focusBorderColor={config.inputs}
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            >
              <option value="janeiro">Janeiro</option>
              <option value="fevereiro">Fevereiro</option>
              <option value="março">Março</option>
              <option value="abril">Abril</option>
              <option value="maio">Maio</option>
              <option value="junho">Junho</option>
              <option value="julho">Julho</option>
              <option value="agosto">Agosto</option>
              <option value="setembro">Setembro</option>
              <option value="outubro">Outubro</option>
              <option value="novembro">Novembro</option>
              <option value="dezembro">Dezembro</option>
            </Select>
            <Select
              placeholder="Selecione um Ano"
              focusBorderColor={config.inputs}
              value={yearFind}
              onChange={(e) => setYearFind(e.target.value)}
            >
              <option value={year - 1}>{year - 1}</option>
              <option value={year}>{year}</option>
              <option value={year + 1}>{year + 1}</option>
            </Select>
          </Grid>
        )}

        {find === "3" && (
          <Grid templateColumns="1fr 1fr 1fr" gap="15px">
            <Select
              placeholder="Mês Inicial"
              focusBorderColor={config.inputs}
              value={initMonth}
              onChange={(e) => setInitMonth(e.target.value)}
            >
              <option value="janeiro">Janeiro</option>
              <option value="fevereiro">Fevereiro</option>
              <option value="março">Março</option>
              <option value="abril">Abril</option>
              <option value="maio">Maio</option>
              <option value="junho">Junho</option>
              <option value="julho">Julho</option>
              <option value="agosto">Agosto</option>
              <option value="setembro">Setembro</option>
              <option value="outubro">Outubro</option>
              <option value="novembro">Novembro</option>
              <option value="dezembro">Dezembro</option>
            </Select>
            <Select
              placeholder="Mês Final"
              focusBorderColor={config.inputs}
              value={finalMonth}
              onChange={(e) => setFinalMonth(e.target.value)}
            >
              <option value="janeiro">Janeiro</option>
              <option value="fevereiro">Fevereiro</option>
              <option value="março">Março</option>
              <option value="abril">Abril</option>
              <option value="maio">Maio</option>
              <option value="junho">Junho</option>
              <option value="julho">Julho</option>
              <option value="agosto">Agosto</option>
              <option value="setembro">Setembro</option>
              <option value="outubro">Outubro</option>
              <option value="novembro">Novembro</option>
              <option value="dezembro">Dezembro</option>
            </Select>
            <Select
              placeholder="Selecione um Ano"
              focusBorderColor={config.inputs}
              value={yearFind}
              onChange={(e) => setYearFind(e.target.value)}
            >
              <option value={year - 1}>{year - 1}</option>
              <option value={year}>{year}</option>
              <option value={year + 1}>{year + 1}</option>
            </Select>
          </Grid>
        )}

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
            <Td>Identificação</Td>
            <Td w="10%" textAlign="center">
              Vencimento
            </Td>
            <Td w="12%" isNumeric>
              Valor
            </Td>
            <Td w="15%" textAlign="center">
              Status Pagamento
            </Td>
            <Td w="15%" textAlign="center">
              Status Movimentação
            </Td>
            <Td w="15%"></Td>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Pagamento dos boletos de roupas</Td>
            <Td w="10%" textAlign="center">
              10/10/1010
            </Td>
            <Td w="12%" isNumeric>
              R$ 4000,00
            </Td>
            <Td w="15%" textAlign="center">
              <Tooltip label="Clique para alterar" hasArrow>
                <Button
                  variant="link"
                  colorScheme="yellow"
                  size="sm"
                  onClick={() => setModalPayment(true)}
                >
                  Aguardando
                </Button>
              </Tooltip>
            </Td>
            <Td w="15%" textAlign="center">
              <Tooltip label="Clique para alterar" hasArrow>
                <Button
                  variant="link"
                  colorScheme="green"
                  size="sm"
                  onClick={() => setModalMoviment(true)}
                >
                  Concluído
                </Button>
              </Tooltip>
            </Td>
            <Td w="15%">
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
                    icon={<FaSearchPlus />}
                    onClick={() => setModalEdit(true)}
                  >
                    Visualizar e Editar
                  </MenuItem>
                  <MenuItem icon={<FaTrash />}>Excluir</MenuItem>
                </MenuList>
              </Menu>
            </Td>
          </Tr>
        </Tbody>
      </Table>

      <Modal
        isOpen={modalEdit}
        onClose={() => setModalEdit(false)}
        isCentered
        size="xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Informações</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid mt={3} templateColumns="1fr" gap="15px">
              <FormControl>
                <FormLabel>Identificação</FormLabel>
                <Input
                  type="text"
                  placeholder="Identificação"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
            </Grid>

            <Grid mt={3} templateColumns="repeat(2, 1fr)" gap="15px">
              <FormControl>
                <FormLabel>Vencimento</FormLabel>
                <InputMask
                  mask="99/99/9999"
                  className="mask-chakra"
                  placeholder="Vencimento"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Valor</FormLabel>
                <Input
                  type="number"
                  placeholder="Valor"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
            </Grid>

            <Grid templateColumns="1fr" gap="15px" mt={3}>
              <FormControl>
                <FormLabel>Descrição</FormLabel>
                <Textarea
                  resize="none"
                  focusBorderColor={config.inputs}
                  placeholder="Descrição"
                  rows={3}
                />
              </FormControl>
            </Grid>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme={config.buttons} leftIcon={<FaSave />}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalMoviment}
        onClose={() => setModalMoviment(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Status da Movimentação</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Status da Movimentação</FormLabel>
              <Select
                placeholder="Selecione"
                variant="outline"
                focusBorderColor={config.inputs}
              >
                <option value="credit">Aguardando</option>
                <option value="debit">Concluído</option>
                <option value="debit">Cancelado</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme={config.buttons} leftIcon={<FaSave />}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalPayment}
        onClose={() => setModalPayment(false)}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Status do Pagamento</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Status do Pagamento</FormLabel>
              <Select
                placeholder="Selecione"
                variant="outline"
                focusBorderColor={config.inputs}
              >
                <option value="credit">Cancelado</option>
                <option value="debit">Aguardando</option>
                <option value="debit">Concluído</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme={config.buttons} leftIcon={<FaSave />}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
