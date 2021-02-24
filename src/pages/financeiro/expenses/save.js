import React from "react";
import {
  Grid,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Button,
  Select,
  Textarea,
  Divider,
} from "@chakra-ui/react";
import config from "../../../configs/index";
import { FaSave, FaSearch } from "react-icons/fa";
import InputMask from "react-input-mask";

export default function SaveExpenses() {
  return (
    <>
      <Grid templateColumns="repeat(2, 1fr)" gap="15px">
        <FormControl isRequired>
          <FormLabel>Forma de Pagamento</FormLabel>
          <HStack spacing={3}>
            <Input
              type="text"
              placeholder="Forma de Pagamento"
              focusBorderColor={config.inputs}
              isReadOnly
            />
            <Button
              leftIcon={<FaSearch />}
              colorScheme={config.buttons}
              variant="outline"
              w="110px"
            >
              Buscar
            </Button>
          </HStack>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Plano de Contas</FormLabel>
          <HStack spacing={3}>
            <Input
              type="text"
              placeholder="Plano de Contas"
              focusBorderColor={config.inputs}
              isReadOnly
            />
            <Button
              leftIcon={<FaSearch />}
              colorScheme={config.buttons}
              variant="outline"
              w="110px"
            >
              Buscar
            </Button>
          </HStack>
        </FormControl>
      </Grid>

      <Grid mt={3} templateColumns="1fr 200px 200px" gap="15px">
        <FormControl isRequired>
          <FormLabel>Identificação</FormLabel>
          <Input
            type="text"
            placeholder="Identificação"
            focusBorderColor={config.inputs}
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
        <FormControl isRequired>
          <FormLabel>Valor</FormLabel>
          <Input
            type="number"
            placeholder="Valor"
            focusBorderColor={config.inputs}
          />
        </FormControl>
      </Grid>

      <Grid mt={3} templateColumns="1fr 1fr" gap="15px">
        <FormControl isRequired>
          <FormLabel>Status do Pagamento</FormLabel>
          <Select
            placeholder="Selecione"
            variant="outline"
            focusBorderColor={config.inputs}
          >
            <option value="credit">Cancelado</option>
            <option value="debit">Aguardando</option>
            <option value="debit">Concluído</option>
          </Select>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Status da Movimentação</FormLabel>
          <Select
            placeholder="Selecione"
            variant="outline"
            focusBorderColor={config.inputs}
          >
            <option value="credit">Aguardando</option>
            <option value="debit">Concluído</option>
            <option value="debit">Cancelado</option>
          </Select>
        </FormControl>
      </Grid>

      <Grid templateColumns="1fr" gap="15px" mt={3}>
        <FormControl>
          <FormLabel>Descrição</FormLabel>
          <Textarea
            resize="none"
            focusBorderColor={config.inputs}
            placeholder="Descrição"
            rows={2}
          />
        </FormControl>
      </Grid>
      <Divider mt={5} mb={5} />
      <Button leftIcon={<FaSave />} colorScheme={config.buttons} size="lg">
        Salvar
      </Button>
    </>
  );
}
