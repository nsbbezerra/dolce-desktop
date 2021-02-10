import React, { useState } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Text,
  Grid,
  Select,
  Input,
  Switch,
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
  useColorMode,
  Image,
} from "@chakra-ui/react";
import config from "../../configs/index";
import HeaderApp from "../../components/headerApp";
import { AiFillShop } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaSave, FaSearch, FaEdit, FaImage } from "react-icons/fa";
import { InputFile, File } from "../../style/uploader";

export default function DepartmentList() {
  const { colorMode } = useColorMode();
  const [modalInfo, setModalInfo] = useState(false);
  const [modalImage, setModalImage] = useState(false);

  return (
    <>
      <HeaderApp title="Gerenciar Departamentos" icon={AiFillShop} />

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
              <Td w="5%" textAlign="center">
                Ativo?
              </Td>
              <Td w="25%">Nome</Td>
              <Td w="70%">Descrição</Td>
              <Td w="10%"></Td>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td w="5%" textAlign="center">
                <Switch colorScheme={config.switchs} />
              </Td>
              <Td w="25%">Nome</Td>
              <Td w="70%">
                <Text w="60vw" isTruncated noOfLines={1}>
                  Descrição
                </Text>
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
                    <MenuItem
                      icon={<FaEdit />}
                      onClick={() => setModalInfo(true)}
                    >
                      Editar Informações
                    </MenuItem>
                    <MenuItem
                      icon={<FaImage />}
                      onClick={() => setModalImage(true)}
                    >
                      Alterar Imagem
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>

      <Modal
        isOpen={modalInfo}
        onClose={() => setModalInfo(false)}
        isCentered
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Informações</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Nome</FormLabel>
              <Input focusBorderColor={config.inputs} />
            </FormControl>
            <FormControl>
              <FormLabel>Nome</FormLabel>
              <Textarea focusBorderColor={config.inputs} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" leftIcon={<FaSave />}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalImage}
        onClose={() => setModalImage(false)}
        isCentered
        size="lg"
      >
        <ModalOverlay />
        <ModalContent maxW="650px">
          <ModalHeader>Alterar Imagem</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Grid templateColumns="1fr 1fr" gap="20px" justifyItems="center">
              <Box w="250px" h="270px">
                <Text>Imagem atual:</Text>
                <Image
                  src="https://s2.glbimg.com/kJtPX5DTl6rDcZO5pYEQ4mVv7H8=/620x455/e.glbimg.com/og/ed/f/original/2019/05/30/gettyimages-824872662.jpg"
                  w="250px"
                  h="250px"
                  rounded="md"
                />
              </Box>
              <Box w="250px" h="270px">
                <Text>Nova imagem:</Text>
                <InputFile alt={250} lar={250} cor={colorMode}>
                  <File type="file" />
                  <FaImage style={{ fontSize: 50, marginBottom: 20 }} />
                  <Text>Insira uma imagem 300x300 pixels, de até 500kb</Text>
                </InputFile>
              </Box>
            </Grid>
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
