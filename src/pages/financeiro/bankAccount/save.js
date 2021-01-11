import React from "react";
import {
  Grid,
  FormControl,
  FormLabel,
  Input,
  Button,
  Divider,
} from "@chakra-ui/react";
import { FaSave } from "react-icons/fa";

import config from "../../../configs/index";

export default function SaveBankAccount() {
  return (
    <>
      <Grid templateColumns={"60vw 1fr"} gap="15px">
        <FormControl isRequired>
          <FormLabel>Banco</FormLabel>
          <Input type="text" focusBorderColor={config.inputs} />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Valor Inicial</FormLabel>
          <Input type="number" focusBorderColor={config.inputs} />
        </FormControl>
      </Grid>
      <Divider mt={5} mb={5} />
      <Button leftIcon={<FaSave />} colorScheme="blue" size="lg">
        Cadastrar
      </Button>
    </>
  );
}
