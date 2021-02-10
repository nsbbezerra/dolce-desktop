import React, { useState } from "react";
import {
  Grid,
  Button,
  FormControl,
  FormLabel,
  Input,
  Divider,
  Wrap,
  WrapItem,
  Box,
  Center,
  IconButton,
  Tooltip,
  Text,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Radio,
  RadioGroup,
} from "@chakra-ui/react";
import config from "../../../../configs/index";
import { FaCheck, FaPlus, FaSave, FaSearch, FaTimes } from "react-icons/fa";
import uniqid from "uniqid";

export default function Tamanhos({ id }) {
  const [sizes, setSizes] = useState([]);
  const [sizeName, setSizeName] = useState("");
  const [color, setColor] = useState("");
  const [amount, setAmount] = useState(0);

  const [modalColor, setModalColor] = useState(false);

  function handleSize() {
    let info = {
      id: uniqid(),
      name: sizeName,
      amount: amount,
      product: id,
      color: color,
    };
    setSizes([...sizes, info]);
    setSizeName("");
    setColor("");
    setAmount(0);
  }

  function removeSize(id) {
    const index = sizes.filter((item) => item.id !== id);
    setSizes(index);
  }

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
      <Grid templateColumns="repeat(3, 1fr)" gap="15px">
        <FormControl isRequired>
          <FormLabel>Tamanho</FormLabel>
          <Input
            focusBorderColor={config.inputs}
            placeholder="Tamanho"
            value={sizeName}
            onChange={(e) => setSizeName(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Estoque</FormLabel>
          <Input
            focusBorderColor={config.inputs}
            placeholder="Estoque"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel color="transparent" userSelect="none">
            D
          </FormLabel>
          <Button
            isFullWidth
            leftIcon={<FaPlus />}
            onClick={() => handleSize()}
          >
            Adicionar Tamanho
          </Button>
        </FormControl>
      </Grid>

      {!!sizes.length && (
        <>
          <Divider mt={5} mb={5} />
          <Wrap spacing="15px">
            {sizes.map((clr) => (
              <WrapItem key={clr.id}>
                <Box w="160px" borderWidth="1px" rounded="md" p={2}>
                  <Flex direction="column" justify="center" align="center">
                    <Box w="140px" h="40px" rounded="md" bg="yellow.300" />
                    <Text>Amarelo</Text>
                  </Flex>
                  <Divider />
                  <Grid templateColumns="1fr 1fr" gap="10px" mt={2}>
                    <FormControl>
                      <FormLabel>Tamanho</FormLabel>
                      <Input
                        focusBorderColor={config.inputs}
                        value={clr.name}
                        isReadOnly
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>QTD</FormLabel>
                      <Input
                        focusBorderColor={config.inputs}
                        value={clr.amount}
                        isReadOnly
                      />
                    </FormControl>
                  </Grid>
                  <Center mt={3} mb={1}>
                    <Tooltip label="Remover Tamanho" hasArrow>
                      <IconButton
                        aria-label="Search database"
                        variant="link"
                        colorScheme="red"
                        icon={<FaTimes />}
                        ml={1}
                        onClick={() => removeSize(clr.id)}
                      />
                    </Tooltip>
                  </Center>
                </Box>
              </WrapItem>
            ))}
          </Wrap>
        </>
      )}
      <Divider mt={5} mb={5} />
      <Button
        leftIcon={<FaSave />}
        colorScheme="blue"
        size="lg"
        disabled={sizes.length ? false : true}
      >
        Salvar Tamanhos
      </Button>

      <Modal
        isOpen={modalColor}
        onClose={() => setModalColor(false)}
        size="xl"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxW="65rem">
          <ModalHeader>Selecione uma Cor</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <RadioGroup>
              <Wrap spacing={5}>
                <WrapItem>
                  <Radio colorScheme={config.switchs} value="1">
                    <Flex
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
