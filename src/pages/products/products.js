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
  useColorMode,
  Image,
} from "@chakra-ui/react";
import config from "../../configs/index";
import HeaderApp from "../../components/headerApp";
import { MdKeyboardArrowDown } from "react-icons/md";
import {
  FaSave,
  FaSearch,
  FaEdit,
  FaImage,
  FaTag,
  FaBoxOpen,
  FaPaintBrush,
  FaImages,
} from "react-icons/fa";
import { InputFile, File } from "../../style/uploader";
import StarRatings from "react-star-ratings";

import Products from "./edit/produtos/produtos";
import Colors from "./edit/produtos/cores";
import Sizes from "./edit/produtos/tamanhos";
import Imagens from "./edit/produtos/imagens";

export default function CategoryList() {
  const { colorMode } = useColorMode();
  const [modalInfo, setModalInfo] = useState(false);
  const [modalImage, setModalImage] = useState(false);
  const [modalSize, setModalSize] = useState(false);
  const [modalColors, setModalColors] = useState(false);
  const [modalGerImg, setModalGerImg] = useState(false);

  return (
    <>
      <HeaderApp title="Gerenciar Produtos" icon={FaTag} />

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
              <Td w="5%" textAlign="center">
                Ativo?
              </Td>
              <Td w="5%" textAlign="center">
                Promo?
              </Td>
              <Td w="25%">Nome</Td>
              <Td w="15%" isNumeric>
                Valor de Custo
              </Td>
              <Td w="15%" isNumeric>
                Valor de Venda
              </Td>
              <Td w="15%" isNumeric>
                Valor Promocional
              </Td>
              <Td w="10%" textAlign="center">
                Avaliação
              </Td>
              <Td w="10%"></Td>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td w="5%" textAlign="center">
                <Switch colorScheme={config.switchs} />
              </Td>
              <Td w="5%" textAlign="center">
                <Switch colorScheme={config.switchs} />
              </Td>
              <Td w="25%">Nome</Td>
              <Td w="15%" isNumeric>
                Valor Venda
              </Td>
              <Td w="15%" isNumeric>
                Valor Venda
              </Td>
              <Td w="15%" isNumeric>
                Valor Promocional
              </Td>
              <Td w="10%" textAlign="center">
                <StarRatings
                  rating={2.403}
                  starDimension="15px"
                  starSpacing="2px"
                  starRatedColor={config.primary}
                />
              </Td>
              <Td w="10%">
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
                      icon={<FaEdit />}
                      onClick={() => setModalInfo(true)}
                    >
                      Editar Informações
                    </MenuItem>
                    <MenuItem
                      icon={<FaBoxOpen />}
                      onClick={() => setModalSize(true)}
                    >
                      Ajustar Estoque / Tamanhos
                    </MenuItem>
                    <MenuItem
                      icon={<FaPaintBrush />}
                      onClick={() => setModalColors(true)}
                    >
                      Gerenciar Cores
                    </MenuItem>
                    <MenuItem
                      icon={<FaImages />}
                      onClick={() => setModalGerImg(true)}
                    >
                      Gerenciar Imagens
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
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxW="90vw">
          <ModalHeader>Editar Informações</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{modalInfo === true && <Products />}</ModalBody>

          <ModalFooter>
            <Button colorScheme={config.buttons} leftIcon={<FaSave />}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalColors}
        onClose={() => setModalColors(false)}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxW="90vw" pb={4}>
          <ModalHeader>Alterar Cores</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{modalColors === true && <Colors />}</ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalSize}
        onClose={() => setModalSize(false)}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxW="90vw" pb={4}>
          <ModalHeader>Alterar Cores</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{modalSize === true && <Sizes />}</ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalGerImg}
        onClose={() => setModalGerImg(false)}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxW="90vw" pb={4}>
          <ModalHeader>Alterar Cores</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{modalGerImg === true && <Imagens />}</ModalBody>
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
            <Button colorScheme={config.buttons} leftIcon={<FaSave />}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
