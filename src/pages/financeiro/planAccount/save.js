import React, { useState, useEffect } from "react";
import {
  Grid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  Divider,
  Button,
} from "@chakra-ui/react";
import InputMask from "react-input-mask";
import config from "../../../configs/index";
import { FaSave } from "react-icons/fa";

export default function PlanAccountSave() {
  const [type, setType] = useState("");
  const [identification, setIdentification] = useState("");

  useEffect(() => {
    maskSelect(identification);
  }, [identification]);

  function maskSelect(item) {
    var filt = item.substr(0, 1);
    console.log(filt);
    if (filt === "1") {
      setType("credit");
    }
    if (filt === "2") {
      setType("debit");
    }
    if (
      filt === "3" ||
      filt === "4" ||
      filt === "5" ||
      filt === "6" ||
      filt === "7" ||
      filt === "8" ||
      filt === "9" ||
      filt === "0"
    ) {
      setIdentification("");
      setType("");
    }
  }

  return (
    <>
      <Grid templateColumns={"150px 1fr 200px"} gap={"15px"}>
        <FormControl isRequired>
          <FormLabel>Identificação</FormLabel>
          <InputMask
            mask="9.9.99"
            className="mask-chakra"
            placeholder="Identificação"
            onChange={(e) => setIdentification(e.target.value)}
            value={identification}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Plano de Contas</FormLabel>
          <Input
            type="text"
            placeholder="Plano de Contas"
            focusBorderColor={config.inputs}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Tipo de Movimentação</FormLabel>
          <Select
            placeholder="Selecione"
            variant="outline"
            focusBorderColor={config.inputs}
            value={type}
            isReadOnly
          >
            <option value="credit">Receita</option>
            <option value="debit">Despesa</option>
          </Select>
        </FormControl>
      </Grid>
      <Text fontSize="sm" color="red.400" mt={3} mb={5}>
        As identificações dos Plano de Contas devem seguir uma regra: Inicie com
        o número (1) todas as RECEITAS; Inicie com o número (2) todas as
        DESPESAS
      </Text>
      <Divider mb={5} />
      <Button leftIcon={<FaSave />} size="lg" colorScheme={config.buttons}>
        Salvar
      </Button>
    </>
  );
}
