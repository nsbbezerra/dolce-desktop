import React from "react";
import {
  Box,
  Grid,
  FormControl,
  FormLabel,
  Input,
  Button,
  Select,
  HStack,
  Switch,
  InputGroup,
  InputLeftAddon,
  Divider,
} from "@chakra-ui/react";
import HeaderApp from "../../components/headerApp";
import { FaIdCard, FaSave } from "react-icons/fa";
import config from "../../configs/index";
import InputMask from "react-input-mask";

export default function Colaboradores() {
  return (
    <>
      <HeaderApp title="Cadastro de Colaboradores" icon={FaIdCard} />

      <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
        <Grid templateColumns="1fr 200px 200px" gap="15px">
          <FormControl id="first-name" isRequired>
            <FormLabel>Nome</FormLabel>
            <Input
              placeholder="Nome completo"
              focusBorderColor={config.inputs}
            />
          </FormControl>
          <FormControl id="phone" isRequired>
            <FormLabel>Telefone</FormLabel>
            <InputMask
              mask="(99) 99999-9999"
              className="mask-chakra"
              placeholder="Telefone"
            />
          </FormControl>
          <FormControl id="gender" isRequired>
            <FormLabel>Genero</FormLabel>
            <Select
              placeholder="Selecione"
              variant="outline"
              focusBorderColor={config.inputs}
            >
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </Select>
          </FormControl>
        </Grid>
        <Grid templateColumns="1fr 1fr" gap="15px" mt={3}>
          <Box borderWidth="1px" rounded="md" p={3}>
            <FormControl as="fieldset">
              <FormLabel as="legend" fontWeight="700">
                Permissões
              </FormLabel>

              <HStack spacing="24px">
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="total" mb="0">
                    Total
                  </FormLabel>
                  <Switch id="total" colorScheme={config.switchs} />
                </FormControl>
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="sales" mb="0">
                    Vendas
                  </FormLabel>
                  <Switch id="sales" colorScheme={config.switchs} />
                </FormControl>
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="cashier" mb="0">
                    Caixa
                  </FormLabel>
                  <Switch id="cashier" colorScheme={config.switchs} />
                </FormControl>
              </HStack>
            </FormControl>
          </Box>
          <Box borderWidth="1px" rounded="md" p={3}>
            <FormControl as="fieldset">
              <HStack spacing="24px">
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="total" mb="0">
                    Colaborador Comissionado?
                  </FormLabel>
                  <Switch id="total" colorScheme={config.switchs} />
                </FormControl>
                <FormControl id="comission">
                  <FormLabel>Porcentagem</FormLabel>
                  <InputGroup>
                    <InputLeftAddon children="%" />
                    <Input
                      type="number"
                      borderLeftRadius="0"
                      placeholder="Porcentagem"
                      focusBorderColor={config.inputs}
                    />
                  </InputGroup>
                </FormControl>
              </HStack>
            </FormControl>
          </Box>
        </Grid>

        <Divider mt={5} mb={5} />
        <Button leftIcon={<FaSave />} colorScheme="blue" size="lg">
          Cadastrar
        </Button>
      </Box>
    </>
  );
}
