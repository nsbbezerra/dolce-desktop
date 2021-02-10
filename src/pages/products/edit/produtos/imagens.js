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
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Wrap,
  WrapItem,
  Radio,
  RadioGroup,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Divider,
  Image,
  Center,
} from "@chakra-ui/react";

import { InputFile, File } from "../../../../style/uploader";
import { FaImage, FaSave, FaCheck, FaSearch, FaTimes } from "react-icons/fa";
import config from "../../../../configs";

export default function Images({ id }) {
  const { colorMode } = useColorMode();
  const [modalColor, setModalColor] = useState(false);
  return (
    <>
      <Grid templateColumns="1fr 200px 200px" gap="15px">
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
          <Input focusBorderColor={config.inputs} bg={`#debb4e`} isReadOnly />
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

      <Modal
        isOpen={modalColor}
        onClose={() => setModalColor(false)}
        size="xl"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Selecione uma Cor</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RadioGroup>
              <Wrap spacing={5}>
                <WrapItem>
                  <Radio colorScheme={config.switchs} value="1">
                    <Flex
                      borderWidth="1px"
                      rounded="md"
                      p={2}
                      align="center"
                      justify="center"
                      direction="column"
                    >
                      <Box w="100px" h="60px" bg="green.400" rounded="md" />
                      <Text mb={-1} mt={2}>
                        Verde
                      </Text>
                    </Flex>
                  </Radio>
                </WrapItem>
                <WrapItem>
                  <Radio colorScheme={config.switchs} value="2">
                    <Flex
                      borderWidth="1px"
                      rounded="md"
                      p={2}
                      align="center"
                      justify="center"
                      direction="column"
                    >
                      <Box w="100px" h="60px" bg="blue.400" rounded="md" />
                      <Text mb={-1} mt={2}>
                        Azul
                      </Text>
                    </Flex>
                  </Radio>
                </WrapItem>
                <WrapItem>
                  <Radio colorScheme={config.switchs} value="3">
                    <Flex
                      borderWidth="1px"
                      rounded="md"
                      p={2}
                      align="center"
                      justify="center"
                      direction="column"
                    >
                      <Box w="100px" h="60px" bg="yellow.400" rounded="md" />
                      <Text mb={-1} mt={2}>
                        Amarelo
                      </Text>
                    </Flex>
                  </Radio>
                </WrapItem>
                <WrapItem>
                  <Radio colorScheme={config.switchs} value="2">
                    <Flex
                      borderWidth="1px"
                      rounded="md"
                      p={2}
                      align="center"
                      justify="center"
                      direction="column"
                    >
                      <Box w="100px" h="60px" bg="pink.400" rounded="md" />
                      <Text mb={-1} mt={2}>
                        Rosa
                      </Text>
                    </Flex>
                  </Radio>
                </WrapItem>
              </Wrap>
            </RadioGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => setModalColor(false)}
              leftIcon={<FaCheck />}
            >
              Usar Esta Cor
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
