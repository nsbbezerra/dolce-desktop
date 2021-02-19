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
  ModalBody,
  ModalCloseButton,
  HStack,
  Table,
  Thead,
  Tr,
  Td,
  Tbody,
} from "@chakra-ui/react";
import config from "../../../configs/index";
import {
  FaCheck,
  FaPlus,
  FaRulerCombined,
  FaSave,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import uniqid from "uniqid";
import HeaderApp from "../../../components/headerApp";

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
      <HeaderApp title="Cadastro de Tamanhos" icon={FaRulerCombined} />

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

        <Grid templateColumns="repeat(2, 1fr)" gap="15px">
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
        <Button leftIcon={<FaSave />} colorScheme="blue" size="lg">
          Salvar
        </Button>
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
