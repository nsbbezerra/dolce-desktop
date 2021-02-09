import React, { useEffect, useState } from "react";
import {
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Radio,
  RadioGroup,
  Flex,
  HStack,
  useRadio,
  useRadioGroup,
  Text,
  Image,
  Center,
  Divider,
  Button,
  Stack,
  ModalHeader,
} from "@chakra-ui/react";
import config from "../configs/index";
import { FaPrint } from "react-icons/fa";

import Thermal from "../assets/termal.png";
import Matricial from "../assets/matricial.png";
import Tonner from "../assets/tonner.png";

export default function PrinterMiddleware() {
  const [modalPrint, setModalPrint] = useState(false);
  const [printType, setPrintType] = useState("");

  useEffect(() => {
    console.log(printType);
  }, [printType]);

  function RadioCard(props) {
    const { getInputProps, getCheckboxProps } = useRadio(props);

    const input = getInputProps();
    const checkbox = getCheckboxProps();

    return (
      <Box as="label">
        <input {...input} />
        <Box
          {...checkbox}
          cursor="pointer"
          borderWidth="1px"
          borderRadius="md"
          _checked={{
            bg: "gray.200",
            color: "gray.800",
            borderColor: "gray.200",
          }}
          _focus={{
            boxShadow: "outline",
          }}
          px={5}
          py={3}
        >
          {props.children === "thermal" && (
            <>
              <Flex justify="center" w="65px" h="65px">
                <Image src={Thermal} alt="Termal" w="65px" h="65px" />
              </Flex>
              <Center mt={2}>Cupom</Center>
            </>
          )}
          {props.children === "matricial" && (
            <>
              <Flex justify="center" w="65px" h="65px">
                <Image src={Matricial} alt="Termal" w="65px" h="65px" />
              </Flex>
              <Center mt={2}>Matricial</Center>
            </>
          )}
          {props.children === "normal" && (
            <>
              <Flex justify="center" w="65px" h="65px">
                <Image src={Tonner} alt="Termal" w="65px" h="65px" />
              </Flex>
              <Center mt={2}>Normal</Center>
            </>
          )}
        </Box>
      </Box>
    );
  }

  function PrintRadio() {
    const options = ["thermal", "matricial", "normal"];

    const { getRootProps, getRadioProps } = useRadioGroup({
      name: "framework",
      defaultValue: printType,
      onChange: setPrintType,
    });

    const group = getRootProps();

    return (
      <HStack {...group}>
        {options.map((value) => {
          const radio = getRadioProps({ value });
          return (
            <RadioCard key={value} {...radio}>
              {value}
            </RadioCard>
          );
        })}
      </HStack>
    );
  }

  return (
    <>
      <Box>
        <Text mb={3}>Selecione uma opção de impressão:</Text>
        <Flex justify="center">
          <PrintRadio />
        </Flex>
        {printType !== "normal" && (
          <>
            <Divider mt={5} mb={3} />
            <Box>
              <Text mb={3}>Selecione uma impressora:</Text>
              <RadioGroup defaultValue="1">
                <Stack>
                  <Radio value="1" colorScheme={config.switchs}>
                    <HStack spacing={5}>
                      <FaPrint /> <Text>Epson L3150</Text>
                    </HStack>
                  </Radio>
                  <Radio value="2" colorScheme={config.switchs}>
                    <HStack spacing={5}>
                      <FaPrint /> <Text>Epson L395</Text>
                    </HStack>
                  </Radio>
                  <Radio value="3" colorScheme={config.switchs}>
                    <HStack spacing={5}>
                      <FaPrint /> <Text>Brother DCP - 2540 Dw</Text>
                    </HStack>
                  </Radio>
                </Stack>
              </RadioGroup>
            </Box>
          </>
        )}

        <Flex justify="flex-end" mt={5}>
          <Button
            leftIcon={<FaPrint />}
            colorScheme="blue"
            onClick={() => setModalPrint(true)}
          >
            Imprimir
          </Button>
        </Flex>
      </Box>

      <Modal
        isOpen={modalPrint}
        onClose={() => setModalPrint(false)}
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent maxW="95vw" minH="95vh" pb={4} p={0} overflow="hidden">
          <ModalHeader>Imprimir</ModalHeader>
          <ModalCloseButton />
          <ModalBody p={0} overflow="hidden">
            <Box h="87vh">
              <embed
                src="http://www.jucerr.rr.gov.br/manuais/pdf-a.pdf"
                width="100%"
                height="100%"
                type="application/pdf"
              />
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
