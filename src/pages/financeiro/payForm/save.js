import React from "react";
import {
  Grid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Switch,
  Divider,
  Button,
} from "@chakra-ui/react";
import config from "../../../configs/index";
import { FaSave } from "react-icons/fa";

export default function PayFormSave() {
  return (
    <>
      <Grid templateColumns="1fr 250px 200px" gap="15px">
        <FormControl isRequired>
          <FormLabel>Forma de Pagamento</FormLabel>
          <Input
            type="text"
            placeholder="Forma de Pagamento"
            focusBorderColor={config.inputs}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Conta Bancária</FormLabel>
          <Select
            placeholder="Selecione"
            variant="outline"
            focusBorderColor={config.inputs}
          >
            <option value="credit">Receita</option>
            <option value="debit">Despesa</option>
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Status do Pagamento</FormLabel>
          <Select
            placeholder="Selecione"
            variant="outline"
            focusBorderColor={config.inputs}
          >
            <option value="credit">À Vista</option>
            <option value="debit">Parcelado</option>
          </Select>
        </FormControl>
      </Grid>
      <Grid mt={3} templateColumns="1fr 1fr 1fr 120px" gap="15px">
        <FormControl isRequired>
          <FormLabel>Nº max. de Parcelas</FormLabel>
          <Input
            type="number"
            placeholder="Nº max. de Parcelas"
            focusBorderColor={config.inputs}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Intervalo de Dias</FormLabel>
          <Input
            type="number"
            placeholder="Intervalo de Dias"
            focusBorderColor={config.inputs}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Tipo de Pagamento</FormLabel>
          <Select
            placeholder="Selecione"
            variant="outline"
            focusBorderColor={config.inputs}
          >
            <option value="credit">Dinheiro</option>
            <option value="credit">Boleto</option>
            <option value="debit">Cartão de Crédito</option>
            <option value="debit">Cartão de Débito</option>
            <option value="debit">Duplicata</option>
            <option value="debit">Transferência</option>
            <option value="debit">Cheque</option>
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Ativar no Site?</FormLabel>
          <Switch colorScheme={config.switchs} size="lg" />
        </FormControl>
      </Grid>
      <Divider mb={5} mt={5} />
      <Button leftIcon={<FaSave />} size="lg" colorScheme="blue">
        Salvar
      </Button>
    </>
  );
}
