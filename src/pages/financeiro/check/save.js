import React from "react";
import {
  Grid,
  FormControl,
  FormLabel,
  Input,
  HStack,
  Button,
  Select,
  Textarea,
  Divider,
} from "@chakra-ui/react";
import config from "../../../configs/index";
import { FaSave, FaSearch } from "react-icons/fa";
import InputMask from "react-input-mask";

export default function SaveCheck() {
  return (
    <>
      <Grid templateColumns="1fr 300px 200px" gap="15px">
        <FormControl isRequired>
          <FormLabel>Selecione o Cliente</FormLabel>
          <HStack spacing={3}>
            <Input
              type="text"
              placeholder="Selecione o Cliente"
              focusBorderColor={config.inputs}
              isReadOnly
            />
            <Button leftIcon={<FaSearch />} colorScheme="blue" w="110px">
              Buscar
            </Button>
          </HStack>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Número</FormLabel>
          <Input
            type="text"
            placeholder="Número"
            focusBorderColor={config.inputs}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Entidade</FormLabel>
          <Input
            type="text"
            placeholder="Entidade"
            focusBorderColor={config.inputs}
          />
        </FormControl>
      </Grid>

      <Grid mt={3} templateColumns="repeat(3, 1fr)" gap="15px">
        <FormControl isRequired>
          <FormLabel>Situação</FormLabel>
          <Select
            placeholder="Selecione"
            variant="outline"
            focusBorderColor={config.inputs}
          >
            <option value="credit">Aguardando</option>
            <option value="debit">Aprovado</option>
            <option value="debit">Recusado</option>
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Tipo de Cheque</FormLabel>
          <Select
            placeholder="Selecione"
            variant="outline"
            focusBorderColor={config.inputs}
          >
            <option value="credit">À Vista</option>
            <option value="debit">À Prazo</option>
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Valor do Cheque</FormLabel>
          <Input
            type="number"
            placeholder="Valor do Cheque"
            focusBorderColor={config.inputs}
          />
        </FormControl>
      </Grid>

      <Grid mt={3} templateColumns="repeat(2, 1fr)" gap="15px">
        <FormControl isRequired>
          <FormLabel>Data da Emissão</FormLabel>
          <InputMask
            mask="99/99/9999"
            className="mask-chakra"
            placeholder="Data da Emissão"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Vencimento</FormLabel>
          <InputMask
            mask="99/99/9999"
            className="mask-chakra"
            placeholder="Vencimento"
          />
        </FormControl>
      </Grid>

      <Grid mt={3} templateColumns="1fr" gap="15px">
        <FormControl>
          <FormLabel>Observações</FormLabel>
          <Textarea resize="none" focusBorderColor={config.inputs} rows={2} />
        </FormControl>
      </Grid>

      <Divider mb={5} mt={5} />

      <Button size="lg" colorScheme="blue" leftIcon={<FaSave />}>
        Salvar
      </Button>
    </>
  );
}
