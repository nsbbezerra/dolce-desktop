import React, { useState } from "react";
import {
  Grid,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  Divider,
  Wrap,
  WrapItem,
  Box,
  Text,
  Center,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import config from "../../../configs/index";
import { FaPlus, FaSave, FaTimes } from "react-icons/fa";

export default function Cores({ id }) {
  const [colorHex, setColorHex] = useState("fff");
  const [colors, setColors] = useState([]);
  const [colorName, setColorName] = useState("");

  function handleColor() {
    let info = { name: colorName, hexDecimal: colorHex };
    setColors([...colors, info]);
    setColorName("");
    setColorHex("fff");
  }

  return (
    <>
      <Grid templateColumns="repeat(4, 1fr)" gap="15px">
        <FormControl isRequired>
          <FormLabel>Nome da Cor</FormLabel>
          <Input
            focusBorderColor={config.inputs}
            placeholder="Nome da Cor"
            value={colorName}
            onChange={(e) => setColorName(e.target.value)}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Hexadecimal</FormLabel>
          <InputGroup>
            <InputLeftAddon children="#" />
            <Input
              type="text"
              borderLeftRadius="0"
              value={colorHex}
              onChange={(e) => setColorHex(e.target.value)}
              focusBorderColor={config.inputs}
            />
          </InputGroup>
        </FormControl>
        <FormControl>
          <FormLabel>Demonstração</FormLabel>
          <Input
            focusBorderColor={config.inputs}
            bg={`#${colorHex}`}
            isReadOnly
          />
        </FormControl>
        <FormControl>
          <FormLabel color="transparent" userSelect="none">
            D
          </FormLabel>
          <Button
            isFullWidth
            leftIcon={<FaPlus />}
            onClick={() => handleColor()}
          >
            Adicionar Cor
          </Button>
        </FormControl>
      </Grid>

      {!!colors.length && (
        <>
          <Divider mt={5} mb={5} />
          <Wrap spacing="15px">
            {colors.map((clr) => (
              <WrapItem key={clr.hexDecimal}>
                <Box w="140px">
                  <Box
                    w="140px"
                    h="60px"
                    bg={`#${clr.hexDecimal}`}
                    rounded="md"
                  />
                  <Center>
                    <Text>{clr.name}</Text>
                    <Tooltip label="Remover Cor" hasArrow>
                      <IconButton
                        aria-label="Search database"
                        variant="link"
                        colorScheme="red"
                        icon={<FaTimes />}
                        ml={1}
                      />
                    </Tooltip>
                  </Center>
                </Box>
              </WrapItem>
            ))}
          </Wrap>
        </>
      )}
    </>
  );
}
