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
  MenuItem,
  MenuList,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  RadioGroup,
  Radio,
  Stack,
  FormLabel,
  FormControl,
  HStack,
  Textarea,
} from "@chakra-ui/react";
import config from "../../../configs/index";
import { FaSearch, FaTrash, FaSave, FaSearchPlus } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import InputMask from "react-input-mask";

export default function ListCheck() {
  const [modalSituation, setModalSituation] = useState(false);
  const [modalType, setModalType] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);

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
                  onClick={() => setModalSituation(true)}
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
                  onClick={() => setModalType(true)}
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
        isOpen={modalSituation}
        onClose={() => setModalSituation(false)}
        size="xl"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Alterar Situação do Cheque</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RadioGroup defaultValue="2">
              <Stack spacing={8} direction="row">
                <Radio size="lg" colorScheme="yellow" value="1">
                  Aguardando
                </Radio>
                <Radio size="lg" colorScheme="green" value="2">
                  Aprovado
                </Radio>
                <Radio size="lg" colorScheme="red" value="3">
                  Recusado
                </Radio>
              </Stack>
            </RadioGroup>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" leftIcon={<FaSave />}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalEdit}
        onClose={() => setModalEdit(false)}
        size="xl"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Cheque</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="1fr 1fr" gap="15px">
              <FormControl>
                <FormLabel>Número</FormLabel>
                <Input
                  type="text"
                  placeholder="Número"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Entidade</FormLabel>
                <Input
                  type="text"
                  placeholder="Entidade"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
            </Grid>

            <Grid mt={3} templateColumns="repeat(1, 1fr)" gap="15px">
              <FormControl>
                <FormLabel>Valor do Cheque</FormLabel>
                <Input
                  type="number"
                  placeholder="Valor do Cheque"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
            </Grid>

            <Grid mt={3} templateColumns="repeat(2, 1fr)" gap="15px">
              <FormControl>
                <FormLabel>Data da Emissão</FormLabel>
                <InputMask
                  mask="99/99/9999"
                  className="mask-chakra"
                  placeholder="Data da Emissão"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Vencimento</FormLabel>
                <InputMask
                  mask="99/99/9999"
                  className="mask-chakra"
                  placeholder="Vencimento"
                />
              </FormControl>
            </Grid>

            <Grid mt={3} templateColumns="1fr" gap="15px">
              <FormControl>
                <FormLabel>Observações</FormLabel>
                <Textarea
                  resize="none"
                  focusBorderColor={config.inputs}
                  rows={2}
                />
              </FormControl>
            </Grid>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" leftIcon={<FaSave />}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalType}
        onClose={() => setModalType(false)}
        size="sm"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Alterar Tipo do Cheque</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Tipo de Cheque</FormLabel>
              <Select
                placeholder="Selecione"
                variant="outline"
                focusBorderColor={config.inputs}
              >
                <option value="credit">À Vista</option>
                <option value="debit">À Prazo</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" leftIcon={<FaSave />}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
