import React from "react";
import {
  Box,
  Grid,
  Input,
  Button,
  HStack,
  InputGroup,
  InputRightElement,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Tooltip,
  InputLeftAddon,
  InputRightAddon,
} from "@chakra-ui/react";
import config from "../../configs/index";
import HeaderApp from "../../components/headerApp";
import {
  FaShoppingBag,
  FaSearch,
  FaTimes,
  FaExchangeAlt,
} from "react-icons/fa";

export default function Pdv() {
  return (
    <>
      <HeaderApp title="Ponto de Venda" icon={FaShoppingBag} />

      <Box
        shadow="md"
        rounded="md"
        borderWidth="1px"
        p={3}
        mt="25px"
        w="100%"
        h="90.5%"
      >
        <Grid templateColumns="1fr 1fr" gap="15px">
          <Box>
            <HStack spacing={2}>
              <Input
                focusBorderColor={config.inputs}
                placeholder="Selecione o Cliente"
              />
              <Button leftIcon={<FaSearch />} colorScheme="blue">
                Buscar
              </Button>
            </HStack>
            <InputGroup size="sm" mt={2}>
              <Input
                type="Text"
                placeholder="Endereço"
                focusBorderColor={config.inputs}
                isReadOnly
                pr="4.7rem"
              />
              <InputRightElement width="4.7rem" mr={-3}>
                <Tooltip label="Alterar Endereço" hasArrow>
                  <Button h="1.75rem" size="sm">
                    <FaExchangeAlt />
                  </Button>
                </Tooltip>
              </InputRightElement>
            </InputGroup>

            <Box borderWidth="1px" p={2} rounded="md" mt={3}>
              <Table size="sm">
                <Thead fontWeight="700">
                  <Tr>
                    <Td textAlign="center" w="2%">
                      Qtd
                    </Td>
                    <Td isTruncated>Produto</Td>
                    <Td textAlign="center" w="5%">
                      Uni.
                    </Td>
                    <Td isNumeric w="15%">
                      V. Uni.
                    </Td>
                    <Td isNumeric w="15%">
                      V. Tot.
                    </Td>
                    <Td w="2%"></Td>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td textAlign="center" w="2%">
                      1
                    </Td>
                    <Td isTruncated>Camiseta Masculina Tshirt</Td>
                    <Td textAlign="center" w="5%">
                      UN
                    </Td>
                    <Td isNumeric w="15%">
                      R$ 150,00
                    </Td>
                    <Td isNumeric w="15%">
                      R$ 150,00
                    </Td>
                    <Td w="2%">
                      <Button
                        size="sm"
                        variant="link"
                        colorScheme="red"
                        rounded="full"
                      >
                        <FaTimes />
                      </Button>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </Box>

            <Box borderWidth="1px" shadow="md" p={3} rounded="md" mt={2}>
              <Grid templateColumns="repeat(2, 1fr)" gap="15px">
                <InputGroup>
                  <InputLeftAddon children="Sub Total" />
                  <Input type="text" focusBorderColor={config.inputs} />
                </InputGroup>
                <InputGroup>
                  <InputLeftAddon children="Desconto" />
                  <Input type="text" focusBorderColor={config.inputs} />
                  <InputRightAddon children="%" />
                </InputGroup>
              </Grid>
              <Grid templateColumns="1fr" gap="15px" mt={"15px"}>
                <InputGroup>
                  <InputLeftAddon children="Total a Pagar" />
                  <Input type="text" focusBorderColor={config.inputs} />
                </InputGroup>
              </Grid>
            </Box>
          </Box>
          <Box></Box>
        </Grid>
      </Box>
    </>
  );
}
