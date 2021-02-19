import React, { useState } from "react";
import {
  Box,
  Button,
  Grid,
  Text,
  useColorMode,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Divider,
  Image,
  Center,
  HStack,
  Tooltip,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
} from "@chakra-ui/react";
import HeaderApp from "../../../components/headerApp";
import { InputFile, File } from "../../../style/uploader";
import {
  FaImage,
  FaSave,
  FaCheck,
  FaSearch,
  FaTimes,
  FaImages,
} from "react-icons/fa";
import config from "../../../configs";

export default function Images({ id }) {
  const { colorMode } = useColorMode();
  const [modalColor, setModalColor] = useState(false);
  return (
    <>
      <HeaderApp title="Cadastro de Imagens" icon={FaImages} />

      <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
        <Grid templateColumns={"1fr 1fr"} gap="25px">
          <HStack spacing="15px">
            <FormControl isRequired>
              <FormLabel>Produto</FormLabel>
              <Input
                focusBorderColor={config.inputs}
                placeholder="Buscar Produtos"
                w="350px"
              />
            </FormControl>
            <FormControl>
              <FormLabel color="transparent" userSelect="none">
                D
              </FormLabel>
              <Button isFullWidth leftIcon={<FaSearch />}>
                Buscar Produto
              </Button>
            </FormControl>
          </HStack>
          <Grid templateColumns="1fr 120px 200px" gap="15px">
            <FormControl isRequired>
              <FormLabel>Nome da Cor</FormLabel>
              <Input
                focusBorderColor={config.inputs}
                placeholder="Nome da Cor"
                isReadOnly
              />
            </FormControl>

            <FormControl>
              <FormLabel>Demonstração</FormLabel>
              <Input
                focusBorderColor={config.inputs}
                bg={`#debb4e`}
                isReadOnly
              />
            </FormControl>
            <FormControl>
              <FormLabel color="transparent" userSelect="none">
                D
              </FormLabel>
              <Button
                isFullWidth
                leftIcon={<FaSearch />}
                onClick={() => setModalColor(true)}
              >
                Buscar Cor
              </Button>
            </FormControl>
          </Grid>
        </Grid>

        <Divider mt={5} mb={5} />

        <Grid templateColumns="300px 1fr" gap="15px">
          <Box>
            <InputFile alt={300} lar={300} cor={colorMode}>
              <File type="file" />
              <FaImage style={{ fontSize: 50, marginBottom: 20 }} />
              <Text>Insira uma imagem 300x300 pixels, de até 500kb</Text>
            </InputFile>
            <Button
              leftIcon={<FaSave />}
              colorScheme="blue"
              size="lg"
              mt={3}
              isFullWidth
            >
              Salvar Imagem
            </Button>
          </Box>

          <Box borderWidth="1px" rounded="md" p={3}>
            <Grid
              templateColumns="repeat(auto-fit, minmax(300px, 300px))"
              gap="15px"
              justifyContent="center"
            >
              <Box w="300px" p={2} shadow="md" rounded="md" borderWidth="1px">
                <Box w="100%" h="40px" bg="yellow.400" />
                <Center>
                  <Text>Amarelo</Text>
                </Center>
                <Divider mt={1} mb={2} />
                <Image
                  src="https://s2.glbimg.com/kJtPX5DTl6rDcZO5pYEQ4mVv7H8=/620x455/e.glbimg.com/og/ed/f/original/2019/05/30/gettyimages-824872662.jpg"
                  w="300px"
                  h="300px"
                  rounded="md"
                />

                <Button
                  leftIcon={<FaTimes />}
                  isFullWidth
                  colorScheme="red"
                  mt={3}
                >
                  Excluir Imagem
                </Button>
              </Box>
            </Grid>
          </Box>
        </Grid>
      </Box>

      <Modal
        isOpen={modalColor}
        onClose={() => setModalColor(false)}
        size="xl"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent pb={4}>
          <ModalHeader>Selecione uma Cor</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Table size="sm">
              <Thead fontWeight="700">
                <Tr>
                  <Td>Cor</Td>
                  <Td w="40%">Demonstração</Td>
                  <Td w="15%" isNumeric></Td>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Azul</Td>
                  <Td w="40%">
                    <Box bg="blue.500" w="100%" h="25px" rounded="md" />
                  </Td>
                  <Td w="15%" isNumeric>
                    <Tooltip label="Usar esta cor" hasArrow>
                      <IconButton
                        aria-label="Search database"
                        icon={<FaCheck />}
                        size="xs"
                        isRound
                        colorScheme="blue"
                      />
                    </Tooltip>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
