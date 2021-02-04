import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  Grid,
  Input,
  Text,
} from "@chakra-ui/react";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaSave, FaSearch } from "react-icons/fa";
import config from "../../../configs/index";
import InputMask from "react-input-mask";

export default function ListPlanAccount() {
  const [modalMov, setModalMov] = useState(false);
  const [modalInfo, setModalInfo] = useState(false);

  const [type, setType] = useState("");
  const [identification, setIdentification] = useState("");

  const initialRef = useRef();

  useEffect(() => {
    maskSelect(identification);
  }, [identification]);

  function maskSelect(item) {
    var filt = item.substr(0, 1);
    console.log(filt);
    if (filt === "1") {
      setType("credit");
    }
    if (filt === "2") {
      setType("debit");
    }
    if (
      filt === "3" ||
      filt === "4" ||
      filt === "5" ||
      filt === "6" ||
      filt === "7" ||
      filt === "8" ||
      filt === "9" ||
      filt === "0"
    ) {
      setIdentification("");
      setType("");
    }
  }

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
            <Td w="18%">Identificação</Td>
            <Td>Plano de Contas</Td>
            <Td textAlign="center" w="20%">
              Tipo de Movimentação
            </Td>
            <Td w="15%"></Td>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td w="18%">1.1.11</Td>
            <Td>Provimento de Internet</Td>
            <Td textAlign="center" w="20%">
              <Badge colorScheme="green" fontSize="lg" p={1}>
                Receita
              </Badge>
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
                  <MenuItem onClick={() => setModalInfo(true)}>
                    Alterar Dados
                  </MenuItem>
                  <MenuItem onClick={() => setModalMov(true)}>
                    Alterar Movimentação
                  </MenuItem>
                </MenuList>
              </Menu>
            </Td>
          </Tr>
          <Tr>
            <Td w="18%">1.1.11</Td>
            <Td>Provimento de Internet</Td>
            <Td textAlign="center" w="20%">
              <Badge colorScheme="red" fontSize="lg" p={1}>
                Despesa
              </Badge>
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
                  <MenuItem onClick={() => setModalInfo(true)}>
                    Alterar Dados
                  </MenuItem>
                  <MenuItem onClick={() => setModalMov(true)}>
                    Alterar Movimentação
                  </MenuItem>
                </MenuList>
              </Menu>
            </Td>
          </Tr>
        </Tbody>
      </Table>

      <Modal
        isOpen={modalMov}
        onClose={() => setModalMov(false)}
        isCentered
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Alterar Movimentação</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="1fr 1fr" gap="15px">
              <FormControl isRequired>
                <FormLabel>Identificação</FormLabel>
                <InputMask
                  mask="9.9.99"
                  className="mask-chakra"
                  placeholder="Identificação"
                  onChange={(e) => setIdentification(e.target.value)}
                  value={identification}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Tipo de Movimentação</FormLabel>
                <Select
                  placeholder="Selecione"
                  variant="outline"
                  focusBorderColor={config.inputs}
                  value={type}
                  isReadOnly
                >
                  <option value="credit">Receita</option>
                  <option value="debit">Despesa</option>
                </Select>
              </FormControl>
            </Grid>
            <Text fontSize="sm" color="red.400" mt={5}>
              As identificações dos Plano de Contas devem seguir uma regra:
              Inicie com o número (1) todas as RECEITAS; Inicie com o número (2)
              todas as DESPESAS
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" leftIcon={<FaSave />}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalInfo}
        onClose={() => setModalInfo(false)}
        isCentered
        size="xl"
        initialFocusRef={initialRef}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Alterar Informações</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Plano de Contas</FormLabel>
              <Input
                type="text"
                placeholder="Plano de Contas"
                focusBorderColor={config.inputs}
                ref={initialRef}
              />
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
