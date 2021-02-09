import React from "react";
import {
  Grid,
  InputLeftAddon,
  InputGroup,
  Input,
  InputRightAddon,
  Box,
  Flex,
  Text,
  Divider,
  FormControl,
  FormLabel,
  Select,
  Center,
  Heading,
  Button,
  HStack,
} from "@chakra-ui/react";
import config from "../configs/index";
import { FaSave, FaCalculator } from "react-icons/fa";

export default function PaymentMiddleware() {
  return (
    <>
      <Grid templateColumns="1fr 1fr" gap="30px">
        <Box>
          <Center rounded="md" p={2} bg="rgba(160, 174, 192, 0.1)" mb={5}>
            <Heading fontSize="md">Pagamento Principal</Heading>
          </Center>
          <InputGroup size="lg">
            <InputLeftAddon>Valor</InputLeftAddon>
            <Input focusBorderColor={config.inputs} />
            <InputRightAddon>R$</InputRightAddon>
          </InputGroup>
          <Grid templateColumns="2fr 1fr" gap="15px" mt={3}>
            <FormControl isRequired>
              <FormLabel mb={0}>Forma de Pagamento</FormLabel>
              <Select
                placeholder="Selecione uma opção"
                focusBorderColor={config.inputs}
                size="lg"
              >
                <option value="option1">Todas as contas</option>
                <option value="option2">Buscar pelo nome</option>
                <option value="option3">Buscar ativas</option>
                <option value="option4">Buscar bloqueadas</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel mb={0}>Parcelas</FormLabel>
              <Select
                placeholder="Quantidade"
                focusBorderColor={config.inputs}
                size="lg"
              >
                <option value="option1">Todas as contas</option>
                <option value="option2">Buscar pelo nome</option>
                <option value="option3">Buscar ativas</option>
                <option value="option4">Buscar bloqueadas</option>
              </Select>
            </FormControl>
          </Grid>

          <Divider mb={5} mt={5} />

          <Center rounded="md" p={2} bg="rgba(160, 174, 192, 0.1)" mb={5}>
            <Heading fontSize="md">Pagamento Secundário</Heading>
          </Center>
          <InputGroup size="lg">
            <InputLeftAddon>Valor</InputLeftAddon>
            <Input focusBorderColor={config.inputs} />
            <InputRightAddon>R$</InputRightAddon>
          </InputGroup>
          <Grid templateColumns="2fr 1fr" gap="15px" mt={3}>
            <FormControl isRequired>
              <FormLabel mb={0}>Forma de Pagamento</FormLabel>
              <Select
                placeholder="Selecione uma opção"
                focusBorderColor={config.inputs}
                size="lg"
              >
                <option value="option1">Todas as contas</option>
                <option value="option2">Buscar pelo nome</option>
                <option value="option3">Buscar ativas</option>
                <option value="option4">Buscar bloqueadas</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel mb={0}>Parcelas</FormLabel>
              <Select
                placeholder="Quantidade"
                focusBorderColor={config.inputs}
                size="lg"
              >
                <option value="option1">Todas as contas</option>
                <option value="option2">Buscar pelo nome</option>
                <option value="option3">Buscar ativas</option>
                <option value="option4">Buscar bloqueadas</option>
              </Select>
            </FormControl>
          </Grid>
        </Box>
        <Box>
          <Center rounded="md" p={2} bg="rgba(160, 174, 192, 0.1)" mb={5}>
            <Heading fontSize="md">Resumo</Heading>
          </Center>
          <Box borderWidth="1px" rounded="md">
            <Flex p={3} align="center" justify="space-between" h={10}>
              <Text>Valor Total</Text>
              <Text fontWeight="700">R$ 400,00</Text>
            </Flex>
            <Divider />
            <Flex p={3} align="center" justify="space-between" h={10}>
              <Text>Desconto</Text>
              <Text fontWeight="700">0%</Text>
            </Flex>
            <Divider />
            <Flex p={3} align="center" justify="space-between" h={10}>
              <Text>Total a Pagar</Text>
              <Text fontWeight="700">R$ 400,00</Text>
            </Flex>
          </Box>
          <Box borderWidth="1px" rounded="md" mt={5}>
            <Grid templateColumns="2fr 1fr 1fr" gap="10px" p={2}>
              <Text>Dinheiro</Text>
              <Text fontWeight="700">R$ 200,00</Text>
              <Text>3x de R$100,00</Text>
            </Grid>
            <Grid templateColumns="2fr 1fr 1fr" gap="10px" p={2}>
              <Text>Dinheiro</Text>
              <Text fontWeight="700">R$ 200,00</Text>
              <Text>3x de R$100,00</Text>
            </Grid>
          </Box>
        </Box>
      </Grid>
      <Divider mt={5} mb={5} />
      <Flex justify="flex-end">
        <HStack spacing={3}>
          <Button leftIcon={<FaCalculator />} colorScheme="blue">
            Calcular Pagamento
          </Button>
          <Button leftIcon={<FaSave />} colorScheme="green">
            Salvar
          </Button>
        </HStack>
      </Flex>
    </>
  );
}
