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
  const [modalEdit, setModalEdit] = useState(false);
  const [modalMoviment, setModalMoviment] = useState(false);
  const [modalPayment, setModalPayment] = useState(false);

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
