import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Grid,
  Button,
  Divider,
  Input,
  Stack,
  RadioGroup,
  Radio,
  Flex,
  Text,
  useToast,
  Tooltip,
  IconButton,
  useColorMode,
  Image,
  Select,
  Kbd,
} from "@chakra-ui/react";
import config from "../../configs/index";
import { useEmployee } from "../../context/Employee";
import HeaderApp from "../../components/headerApp";
import Hotkeys from "react-hot-keys";
import axios from "axios";
import MaskedInput from "react-text-mask";
import { FaShippingFast, FaImage, FaSave } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { InputFile, File } from "../../style/uploader";

export default function RegisterProvider() {
  const toast = useToast();
  const { colorMode } = useColorMode();

  const [typeContact, setTypeContact] = useState("1");
  const [validators, setValidators] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [comp, setComp] = useState("");
  const [district, setDistrict] = useState("");
  const [cep, setCep] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  function handleValidator(path, message) {
    let val = [];
    let info = { path: path, message: message };
    val.push(info);
    setValidators(val);
    if (path !== "image") {
      const inpt = document.getElementById(path);
      inpt.focus();
    }
  }

  function capitalizeFirstLetter(string) {
    let splited = string.split(" ");
    let toJoin = splited.map((e) => {
      return e.charAt(0).toUpperCase() + e.slice(1);
    });
    let joined = toJoin.join(" ");
    return joined;
  }

  const previewThumbnail = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : null;
  }, [thumbnail]);

  async function removeThumbnail() {
    await URL.revokeObjectURL(thumbnail);
    setThumbnail(null);
    setValidators([]);
  }

  return (
    <>
      <HeaderApp title="Cadastro de Fornecedores" icon={FaShippingFast} />
      <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
        <Grid templateColumns="250px 1fr" gap="25px">
          <Box>
            <FormControl
              isRequired
              isInvalid={
                validators.find((obj) => obj.path === "image") ? true : false
              }
            >
              <FormLabel>Logomarca</FormLabel>
              <Box w="250px" h="250px">
                {thumbnail ? (
                  <Box rounded="md" borderWidth="1px" overflow="hidden">
                    <Image src={previewThumbnail} w="250px" h="250px" />
                    <Flex justify="center" mt="-30px">
                      <Tooltip label="Remover Imagem" hasArrow>
                        <IconButton
                          icon={<AiOutlineClose />}
                          colorScheme="red"
                          rounded="full"
                          size="sm"
                          shadow="md"
                          onClick={() => removeThumbnail()}
                        />
                      </Tooltip>
                    </Flex>
                  </Box>
                ) : (
                  <InputFile alt={250} lar={250} cor={colorMode}>
                    <File
                      type="file"
                      onChange={(event) => setThumbnail(event.target.files[0])}
                    />
                    <FaImage style={{ fontSize: 50, marginBottom: 20 }} />
                    <Text>Insira uma imagem 300x300 pixels, de até 500kb</Text>
                  </InputFile>
                )}
              </Box>
              <FormErrorMessage>
                {validators.find((obj) => obj.path === "image")
                  ? validators.find((obj) => obj.path === "image").message
                  : ""}
              </FormErrorMessage>
            </FormControl>
          </Box>

          <Box>
            <Grid templateColumns="1fr" gap="15px">
              <FormControl isRequired>
                <FormLabel>Nome</FormLabel>
                <Input
                  placeholder="Nome"
                  id="name"
                  focusBorderColor={config.inputs}
                  value={name}
                  onChange={(e) =>
                    setName(capitalizeFirstLetter(e.target.value))
                  }
                />
              </FormControl>
            </Grid>

            <Grid mt={3} templateColumns="repeat(3, 1fr)" gap="15px">
              <FormControl isRequired>
                <FormLabel>CNPJ</FormLabel>
                <MaskedInput
                  mask={[
                    /[0-9]/,
                    /\d/,
                    ".",
                    /\d/,
                    /\d/,
                    /\d/,
                    ".",
                    /\d/,
                    /\d/,
                    /\d/,
                    "/",
                    /\d/,
                    /\d/,
                    /\d/,
                    /\d/,
                    "-",
                    /\d/,
                    /\d/,
                  ]}
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  placeholder="CNPJ"
                  id="cnpj"
                  render={(ref, props) => (
                    <Input
                      ref={ref}
                      {...props}
                      focusBorderColor={config.inputs}
                    />
                  )}
                />
              </FormControl>
              <FormControl>
                <FormLabel>
                  <Stack direction="row">
                    <Text>Contato:</Text>
                    <RadioGroup
                      value={typeContact}
                      onChange={(e) => setTypeContact(e)}
                      colorScheme={config.switchs}
                      ml={4}
                      fontSize="xs"
                    >
                      <Stack spacing={5} direction="row">
                        <Radio value="1">Comercial</Radio>
                        <Radio value="2">Celular</Radio>
                      </Stack>
                    </RadioGroup>
                  </Stack>
                </FormLabel>
                {typeContact === "1" ? (
                  <MaskedInput
                    mask={[
                      "(",
                      /[0-9]/,
                      /\d/,
                      ")",
                      " ",
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                      "-",
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                    ]}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Telefone"
                    id="contact"
                    render={(ref, props) => (
                      <Input
                        ref={ref}
                        {...props}
                        focusBorderColor={config.inputs}
                      />
                    )}
                  />
                ) : (
                  <MaskedInput
                    mask={[
                      "(",
                      /[0-9]/,
                      /\d/,
                      ")",
                      " ",
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                      "-",
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                    ]}
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="Telefone"
                    id="contact"
                    render={(ref, props) => (
                      <Input
                        ref={ref}
                        {...props}
                        focusBorderColor={config.inputs}
                      />
                    )}
                  />
                )}
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  placeholder="Email"
                  id="email"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
            </Grid>

            <Grid templateColumns="3fr 1fr" mt={3} gap="15px">
              <FormControl isRequired>
                <FormLabel>Logradouro</FormLabel>
                <Input
                  placeholder="Logradouro"
                  id="street"
                  focusBorderColor={config.inputs}
                  value={street}
                  onChange={(e) =>
                    setStreet(capitalizeFirstLetter(e.target.value))
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Número</FormLabel>
                <Input
                  placeholder="Número"
                  id="number"
                  focusBorderColor={config.inputs}
                  value={number}
                  onChange={(e) => setNumber(e.target.value.toUpperCase())}
                />
              </FormControl>
            </Grid>

            <Grid templateColumns="1fr 1fr" mt={3} gap="15px">
              <FormControl>
                <FormLabel>Complemento</FormLabel>
                <Input
                  placeholder="Complemento"
                  id="comp"
                  focusBorderColor={config.inputs}
                  value={comp}
                  onChange={(e) =>
                    setComp(capitalizeFirstLetter(e.target.value))
                  }
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Bairro</FormLabel>
                <Input
                  placeholder="Bairro"
                  id="district"
                  focusBorderColor={config.inputs}
                  value={district}
                  onChange={(e) =>
                    setDistrict(capitalizeFirstLetter(e.target.value))
                  }
                />
              </FormControl>
            </Grid>

            <Grid templateColumns="1fr 1fr 200px" mt={3} gap="15px">
              <FormControl>
                <FormLabel>CEP</FormLabel>
                <MaskedInput
                  mask={[
                    /[0-9]/,
                    /\d/,
                    ".",
                    /\d/,
                    /\d/,
                    /\d/,
                    "-",
                    /\d/,
                    /\d/,
                    /\d/,
                  ]}
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  placeholder="CEP"
                  id="cep"
                  render={(ref, props) => (
                    <Input
                      ref={ref}
                      {...props}
                      focusBorderColor={config.inputs}
                    />
                  )}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Cidade</FormLabel>
                <Input
                  placeholder="Cidade"
                  id="city"
                  focusBorderColor={config.inputs}
                  value={city}
                  onChange={(e) =>
                    setCity(capitalizeFirstLetter(e.target.value))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>UF</FormLabel>
                <Select
                  placeholder="Selecione"
                  variant="outline"
                  focusBorderColor={config.inputs}
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  <option value="AC">AC</option>
                  <option value="AL">AL</option>
                  <option value="AP">AP</option>
                  <option value="AM">AM</option>
                  <option value="BA">BA</option>
                  <option value="CE">CE</option>
                  <option value="DF">DF</option>
                  <option value="ES">ES</option>
                  <option value="GO">GO</option>
                  <option value="MA">MA</option>
                  <option value="MT">MT</option>
                  <option value="MS">MS</option>
                  <option value="MG">MG</option>
                  <option value="PA">PA</option>
                  <option value="PB">PB</option>
                  <option value="PR">PR</option>
                  <option value="PE">PE</option>
                  <option value="PI">PI</option>
                  <option value="RJ">RJ</option>
                  <option value="RN">RN</option>
                  <option value="RS">RS</option>
                  <option value="RO">RO</option>
                  <option value="RR">RR</option>
                  <option value="SC">SC</option>
                  <option value="SP">SP</option>
                  <option value="SE">SE</option>
                  <option value="TO">TO</option>
                </Select>
              </FormControl>
            </Grid>
          </Box>
        </Grid>

        <Divider mt={5} mb={5} />

        <Button colorScheme={config.buttons} leftIcon={<FaSave />} size="lg">
          Salvar{" "}
          <Kbd ml={3} color="ButtonText">
            F12
          </Kbd>
        </Button>
      </Box>
    </>
  );
}
