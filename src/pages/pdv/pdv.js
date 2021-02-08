import React from "react";
import {
  Box,
  Grid,
  Input,
  Button,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Tooltip,
  Flex,
  IconButton,
  Divider,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  ButtonGroup,
  Center,
  Heading,
  FormControl,
  FormLabel,
  Image,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import config from "../../configs/index";
import HeaderApp from "../../components/headerApp";
import { FaShoppingBag, FaSearch, FaTimes, FaPlus } from "react-icons/fa";

export default function Pdv() {
  return (
    <>
      <HeaderApp title="Ponto de Venda" icon={FaShoppingBag} />

      <Grid
        templateRows="66.65vh 68px"
        gap="15px"
        mt="25px"
        h="76.65vh"
        maxH="76.65vh"
      >
        <Grid templateColumns="repeat(2, 1fr)" gap="15px" h="100%">
          <Box
            borderWidth="1px"
            shadow="md"
            rounded="md"
            p={3}
            h="100%"
            minH="100%"
            maxH="100%"
            overflow="auto"
          >
            <Center rounded="md" p={2} bg="rgba(160, 174, 192, 0.1)" mb={3}>
              <Heading fontSize="sm">Informações do Pedido</Heading>
            </Center>
            <HStack spacing={3}>
              <Input
                type="text"
                placeholder="Nome do cliente"
                focusBorderColor={config.inputs}
                isReadOnly
              />
              <Tooltip label="Buscar Cliente" hasArrow>
                <IconButton icon={<FaSearch />} colorScheme="blue" />
              </Tooltip>
            </HStack>
            <HStack spacing={3} mt={3}>
              <Input
                size="sm"
                placeholder="Endereço do cliente"
                focusBorderColor={config.inputs}
                w="70%"
              />
              <Input
                size="sm"
                placeholder="Contato"
                focusBorderColor={config.inputs}
                w="30%"
              />
            </HStack>

            <Divider mt={3} mb={3} />

            <Table size="sm" maxW="100%">
              <Thead fontWeight="700">
                <Tr>
                  <Td w="2%" textAlign="center">
                    Qtd
                  </Td>
                  <Td isTruncated w="62%" maxW="62%">
                    Produto
                  </Td>
                  <Td w="7%" textAlign="center">
                    SKU
                  </Td>
                  <Td w="14%" isNumeric>
                    V. Uni
                  </Td>
                  <Td w="14%" isNumeric>
                    V. Tot
                  </Td>
                  <Td w="1%"></Td>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td w="2%" textAlign="center">
                    10
                  </Td>
                  <Td isTruncated w="62%" maxW="62%">
                    <Text fontSize="sm" isTruncated noOfLines={1} w="17vw">
                      Camiseta Masculina Masculina Topper adasdasdasda
                    </Text>
                  </Td>
                  <Td w="7%" textAlign="center">
                    SJKD889
                  </Td>
                  <Td w="14%" isNumeric>
                    400,00
                  </Td>
                  <Td w="14%" isNumeric>
                    400,00
                  </Td>
                  <Td w="1%">
                    <Tooltip label="Remover Item" hasArrow>
                      <Popover>
                        <PopoverTrigger>
                          <IconButton
                            colorScheme="red"
                            icon={<FaTimes />}
                            size="xs"
                            variant="link"
                          />
                        </PopoverTrigger>
                        <PopoverContent>
                          <PopoverArrow />
                          <PopoverCloseButton />
                          <PopoverHeader>Confirmação!</PopoverHeader>
                          <PopoverBody>Deseja remover este item?</PopoverBody>
                          <PopoverFooter d="flex" justifyContent="flex-end">
                            <ButtonGroup size="sm">
                              <Button variant="outline">Não</Button>
                              <Button colorScheme="blue">Sim</Button>
                            </ButtonGroup>
                          </PopoverFooter>
                        </PopoverContent>
                      </Popover>
                    </Tooltip>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
          <Box
            borderWidth="1px"
            shadow="md"
            rounded="md"
            p={3}
            h="100%"
            minH="100%"
            maxH="100%"
            overflow="auto"
          >
            <Center rounded="md" p={2} bg="rgba(160, 174, 192, 0.1)" mb={3}>
              <Heading fontSize="sm">Buscar Produtos</Heading>
            </Center>
            <Grid templateColumns="70px 1fr 130px 130px" gap="15px">
              <FormControl>
                <FormLabel fontSize="sm">Qtd</FormLabel>
                <Input
                  type="number"
                  placeholder="Qtd"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">Buscar por nome</FormLabel>
                <Input
                  type="text"
                  placeholder="Digite o nome"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">Cod. de Barras</FormLabel>
                <Input
                  type="text"
                  placeholder="Cod. Barras"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm">SKU</FormLabel>
                <Input
                  type="text"
                  placeholder="SKU"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
            </Grid>

            <Divider mt={3} mb={3} />

            <Grid
              templateColumns="repeat(auto-fit, minmax(185px, 185px))"
              gap="15px"
              justifyContent="center"
            >
              <Box
                borderWidth="1px"
                p={2}
                rounded="md"
                cursor="pointer"
                shadow="md"
              >
                <Image
                  src="https://a-static.mlcdn.com.br/1500x1500/camiseta-branca-lisa-100-algodao-torres-confeccoes/torresconfeccoes/51-195/5c4ae4b9c47d84d3af9d9f67dea33f60.jpg"
                  rounded="md"
                />
                <Text w="180px" isTruncated noOfLines={2} fontSize="sm" p={1}>
                  Camiseta Masculina asdlaskdjlaskdjalskdjjasdl asdasd asd
                  asdasdasdasds
                </Text>
                <HStack mt={2}>
                  <Heading fontSize="lg" w="80%">
                    R$ 20,00
                  </Heading>
                  <Tooltip label="Adicionar este item" hasArrow>
                    <IconButton
                      icon={<FaPlus />}
                      size="sm"
                      colorScheme="blue"
                    />
                  </Tooltip>
                </HStack>
              </Box>
            </Grid>
          </Box>
        </Grid>

        <Flex
          h="68px"
          borderWidth="1px"
          shadow="md"
          rounded="md"
          align="center"
        >
          <Grid templateColumns="1fr 1fr" gap="15px">
            <Grid templateColumns="repeat(3, 1fr)" gap="10px" pl={3} pr={3}>
              <FormControl>
                <FormLabel fontSize="xs" mb={0} fontWeight="700">
                  Valor
                </FormLabel>
                <InputGroup>
                  <InputLeftAddon>R$</InputLeftAddon>
                  <Input focusBorderColor={config.inputs} />
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="xs" mb={0} fontWeight="700">
                  Desconto
                </FormLabel>
                <InputGroup>
                  <InputLeftAddon>%</InputLeftAddon>
                  <Input focusBorderColor={config.inputs} />
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="xs" mb={0} fontWeight="700">
                  Total a Pagar
                </FormLabel>
                <InputGroup>
                  <InputLeftAddon>R$</InputLeftAddon>
                  <Input focusBorderColor={config.inputs} />
                </InputGroup>
              </FormControl>
            </Grid>
          </Grid>
        </Flex>
      </Grid>
    </>
  );
}
