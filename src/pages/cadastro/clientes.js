import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Grid,
  Input,
  Select,
  FormControl,
  FormLabel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  FormErrorMessage,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Text,
} from "@chakra-ui/react";
import { FaUserFriends, FaSave } from "react-icons/fa";
import config from "../../configs";
import HeaderApp from "../../components/headerApp";
import InputMask from "react-input-mask";
import * as yup from "yup";

import { useEmployee } from "../../context/Employee";
import api from "../../configs/axios";

export default function SaveClient() {
  const { employee } = useEmployee();

  const [loading, setLoading] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [modalAddress, setModalAddress] = useState(false);
  const [validators, setValidators] = useState([]);
  const [modalCaution, setModalCaution] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalErroMessage, setModalErroMessage] = useState("");

  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [comp, setComp] = useState("");
  const [bairro, setBairro] = useState("");
  const [cep, setCep] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  function clear() {
    setName("");
    setCpf("");
    setGender("");
    setEmail("");
    setContact("");
    setUser("");
    setStreet("");
    setNumber("");
    setComp("");
    setBairro("");
    setCep("");
    setCity("");
    setState();
  }
  const schemaClient = yup.object().shape({
    name: yup.string().required("O Nome é obrigatório"),
    cpf: yup.string().required("O CPF é obrigatório"),
    gender: yup.string().required("O Gênero é obrigatório"),
    email: yup.string().email("Digite um email válido"),
    contact: yup.string().required("O Telefone é obrigatório"),
    user: yup.string().required("O nome de usuário é obrigatório"),
    password: yup.string().required("A senha é obrigatória"),
  });

  const schemaAddress = yup.object().shape({
    street: yup.string().required("O nome da Rua/Avenida é obrigatório"),
    number: yup.string().required("O número é obrigatório"),
    comp: yup.string(),
    bairro: yup.string().required("O bairro é obrigatório"),
    cep: yup.string().required("O Cep é obrigatório"),
    city: yup.string().required("A Cidade é obrigatória"),
    state: yup.string().required("O estado é obrigatório"),
  });

  async function register() {
    setLoading(true);
    await schemaClient
      .validate(
        {
          name: name,
          cpf: cpf,
          gender: gender,
          email: email,
          contact: contact,
          user: user,
          password: password,
        },
        { abortEarly: false }
      )
      .catch(function (err) {
        var val = [];
        err.inner.forEach((e) => {
          const info = { path: e.path, message: e.message };
          val.push(info);
        });
        console.log("INNER", err.inner.length);
        setValidators(val);
        if (err.inner.length === 0) {
          saveClient();
          return false;
        }
        setLoading(false);
      });
  }

  async function saveClient() {
    try {
      const response = await api.post(
        "/clients",
        {
          name,
          gender,
          cpf,
          email,
          contact,
          user,
        },
        { headers: { "x-access-token": employee.token } }
      );
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      console.log(error.response.data);
      const typeError =
        error.response.data.message || "Ocorreu um erro ao salvar";
    }
  }

  async function registerAddress() {
    setLoadingAddress(true);
    setTimeout(() => {
      setLoadingAddress(false);
      setModalAddress(false);
    }, 3000);
  }

  return (
    <>
      <HeaderApp title="Cadastro de Clientes" icon={FaUserFriends} />

      <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
        <Grid templateColumns="1fr 1fr 250px" gap="15px">
          <FormControl
            id="first-name"
            isRequired
            isInvalid={
              validators.find((obj) => obj.path === "name") ? true : false
            }
          >
            <FormLabel>Nome</FormLabel>
            <Input
              placeholder="Nome completo"
              focusBorderColor={config.inputs}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <FormErrorMessage>
              {validators.find((obj) => obj.path === "name")
                ? validators.find((obj) => obj.path === "name").message
                : ""}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            id="cpf"
            isRequired
            isInvalid={
              validators.find((obj) => obj.path === "cpf") ? true : false
            }
          >
            <FormLabel>CPF</FormLabel>
            <InputMask
              mask="999.999.999-99"
              className="mask-chakra"
              placeholder="CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
            <FormErrorMessage>
              {validators.find((obj) => obj.path === "cpf")
                ? validators.find((obj) => obj.path === "cpf").message
                : ""}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            id="gender"
            isRequired
            isInvalid={
              validators.find((obj) => obj.path === "gender") ? true : false
            }
          >
            <FormLabel>Genero</FormLabel>
            <Select
              placeholder="Selecione"
              variant="outline"
              focusBorderColor={config.inputs}
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="masc">Masculino</option>
              <option value="fem">Femenino</option>
            </Select>
            <FormErrorMessage>
              {validators.find((obj) => obj.path === "gender")
                ? validators.find((obj) => obj.path === "gender").message
                : ""}
            </FormErrorMessage>
          </FormControl>
        </Grid>
        <Grid templateColumns="1fr 1fr" gap="15px" mt={3}>
          <FormControl
            id="email"
            isInvalid={
              validators.find((obj) => obj.path === "email") ? true : false
            }
          >
            <FormLabel>Email</FormLabel>
            <Input
              placeholder="Email"
              focusBorderColor={config.inputs}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormErrorMessage>
              {validators.find((obj) => obj.path === "email")
                ? validators.find((obj) => obj.path === "email").message
                : ""}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            id="phone"
            isRequired
            isInvalid={
              validators.find((obj) => obj.path === "contact") ? true : false
            }
          >
            <FormLabel>Telefone</FormLabel>
            <InputMask
              mask="(99) 99999-9999"
              className="mask-chakra"
              placeholder="Telefone"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
            />
            <FormErrorMessage>
              {validators.find((obj) => obj.path === "contact")
                ? validators.find((obj) => obj.path === "contact").message
                : ""}
            </FormErrorMessage>
          </FormControl>
        </Grid>

        <Grid templateColumns="1fr 1fr" gap="15px" mt={3}>
          <FormControl
            id="user"
            isRequired
            isInvalid={
              validators.find((obj) => obj.path === "user") ? true : false
            }
          >
            <FormLabel>Usuário</FormLabel>
            <Input
              placeholder="Usuário"
              focusBorderColor={config.inputs}
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
            <FormErrorMessage>
              {validators.find((obj) => obj.path === "user")
                ? validators.find((obj) => obj.path === "user").message
                : ""}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            id="pass"
            isRequired
            isInvalid={
              validators.find((obj) => obj.path === "password") ? true : false
            }
          >
            <FormLabel>Senha</FormLabel>
            <Input
              placeholder="Usuário"
              type="password"
              focusBorderColor={config.inputs}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormErrorMessage>
              {validators.find((obj) => obj.path === "password")
                ? validators.find((obj) => obj.path === "password").message
                : ""}
            </FormErrorMessage>
          </FormControl>
        </Grid>
        <Divider mt={5} mb={5} />
        <Button
          leftIcon={<FaSave />}
          colorScheme="blue"
          size="lg"
          isLoading={loading}
          onClick={() => register()}
        >
          Cadastrar
        </Button>
      </Box>

      <Modal
        isOpen={modalAddress}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        isCentered
        size="xl"
      >
        <ModalOverlay />
        <ModalContent maxW="70rem">
          <ModalHeader>Cadastrar Endereço</ModalHeader>
          <ModalBody>
            <Grid templateColumns="1fr 100px" gap="15px">
              <FormControl
                id="avenue"
                isRequired
                isInvalid={
                  validators.find((obj) => obj.path === "street") ? true : false
                }
              >
                <FormLabel>Logradouro</FormLabel>
                <Input
                  placeholder="Logradouro"
                  focusBorderColor={config.inputs}
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "street")
                    ? validators.find((obj) => obj.path === "street").message
                    : ""}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id="number"
                isRequired
                isInvalid={
                  validators.find((obj) => obj.path === "number") ? true : false
                }
              >
                <FormLabel>Numero</FormLabel>
                <Input
                  placeholder="Numero"
                  focusBorderColor={config.inputs}
                  type="text"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                />
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "number")
                    ? validators.find((obj) => obj.path === "number").message
                    : ""}
                </FormErrorMessage>
              </FormControl>
            </Grid>
            <Grid templateColumns="1fr 1fr" gap="15px" mt={3}>
              <FormControl id="comp">
                <FormLabel>Complemento</FormLabel>
                <Input
                  placeholder="Complemento"
                  focusBorderColor={config.inputs}
                  value={comp}
                  onChange={(e) => setComp(e.target.value)}
                />
              </FormControl>
              <FormControl
                id="bairro"
                isRequired
                isInvalid={
                  validators.find((obj) => obj.path === "bairro") ? true : false
                }
              >
                <FormLabel>Bairro</FormLabel>
                <Input
                  placeholder="Bairro"
                  focusBorderColor={config.inputs}
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                />
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "bairro")
                    ? validators.find((obj) => obj.path === "bairro").message
                    : ""}
                </FormErrorMessage>
              </FormControl>
            </Grid>
            <Grid templateColumns="1fr 1fr 100px" gap="15px" mt={3}>
              <FormControl
                id="cep"
                isRequired
                isInvalid={
                  validators.find((obj) => obj.path === "cep") ? true : false
                }
              >
                <FormLabel>CEP</FormLabel>
                <InputMask
                  mask="99.999-999"
                  className="mask-chakra"
                  placeholder="CEP"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                />
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "cep")
                    ? validators.find((obj) => obj.path === "cep").message
                    : ""}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id="city"
                isRequired
                isInvalid={
                  validators.find((obj) => obj.path === "city") ? true : false
                }
              >
                <FormLabel>Cidade</FormLabel>
                <Input
                  placeholder="Cidade"
                  focusBorderColor={config.inputs}
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "city")
                    ? validators.find((obj) => obj.path === "city").message
                    : ""}
                </FormErrorMessage>
              </FormControl>
              <FormControl
                id="uf"
                isRequired
                isInvalid={
                  validators.find((obj) => obj.path === "state") ? true : false
                }
              >
                <FormLabel>UF</FormLabel>
                <Select
                  placeholder="Selecione"
                  variant="outline"
                  focusBorderColor={config.inputs}
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
                <FormErrorMessage>
                  {validators.find((obj) => obj.path === "state")
                    ? validators.find((obj) => obj.path === "state").message
                    : ""}
                </FormErrorMessage>
              </FormControl>
            </Grid>
          </ModalBody>

          <ModalFooter>
            <Button
              leftIcon={<FaSave />}
              colorScheme="blue"
              isLoading={loadingAddress}
              onClick={() => registerAddress()}
            >
              Cadastrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <AlertDialog
        isOpen={modalCaution}
        onClose={() => setModalCaution(false)}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {modalTitle}
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text>{modalMessage}</Text>
              <Text color="red.500">
                {modalErroMessage || modalErroMessage !== ""
                  ? `Erro: ${modalErroMessage}`
                  : ""}
              </Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                colorScheme="blue"
                onClick={() => setModalCaution(false)}
                ml={3}
              >
                Fechar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
