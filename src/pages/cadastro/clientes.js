import React, { useState } from "react";
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
  useToast,
} from "@chakra-ui/react";
import { FaUserFriends, FaSave } from "react-icons/fa";
import config from "../../configs";
import HeaderApp from "../../components/headerApp";
import MaskedInput from "react-text-mask";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useEmployee } from "../../context/Employee";
import api from "../../configs/axios";

export default function SaveClient() {
  const { employee } = useEmployee();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [modalAddress, setModalAddress] = useState(false);

  const [idClient, setIdClient] = useState(null);

  const [type, setType] = useState("person");

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom",
      duration: 8000,
      isClosable: true,
    });
  }

  async function register(values) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Insira o nome"),
        gender: Yup.string(),
        type: Yup.string(),
        cpf: Yup.string().required("Insira um CPF ou CNPJ"),
        email: Yup.string().email("Insira um email válido"),
        socialName: Yup.string(),
        stateRegistration: Yup.string(),
        municipalRegistration: Yup.string(),
        contact: Yup.string().required("Insira um telefone de contato"),
      });

      await schema.validate(values, {
        abortEarly: false,
      });

      setLoading(true);

      const response = await api.post(
        "/clients",
        {
          name: values.name,
          gender: values.gender,
          type: type,
          cpf: values.cpf,
          email: values.email,
          contact: values.contact,
          socialName: values.socialName,
          stateRegistration: values.stateRegistration,
          municipalRegistration: values.municipalRegistration,
        },
        { headers: { "x-access-token": employee.token } }
      );
      setIdClient(response.data.client);
      setLoading(false);
      showToast(response.data.message, "success", "Sucesso");
      setModalAddress(true);
    } catch (error) {
      setLoading(false);
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((err) => {
          showToast(err.message, "error", "Erro");
        });
      } else {
        if (error.message === "Network Error") {
          alert(
            "Sem conexão com o servidor, verifique sua conexão com a internet."
          );
          return false;
        }
        const statusCode = error.response.status || 400;
        const typeError =
          error.response.data.message || "Ocorreu um erro ao salvar";
        const errorMesg = error.response.data.errorMessage || statusCode;
        const errorMessageFinal = `${typeError} + Cod: ${errorMesg}`;
        showToast(
          errorMessageFinal,
          "error",
          statusCode === 401 ? "Erro Autorização" : "Erro no Cadastro"
        );
      }
    }
  }

  async function registerAddress(values) {
    try {
      const schema = Yup.object().shape({
        street: Yup.string().required("Insira o nome da rua"),
        number: Yup.string().required("Insira o número"),
        comp: Yup.string(),
        bairro: Yup.string().required("Insira o bairro"),
        cep: Yup.string().required("Insira o CEP"),
        city: Yup.string().required("Insira a cidade"),
        state: Yup.string().required("Insira o estado"),
      });

      await schema.validate(values, {
        abortEarly: false,
      });

      setLoadingAddress(true);

      const response = await api.post(
        "/address",
        {
          client_id: idClient,
          street: values.street,
          number: values.number,
          comp: values.comp,
          bairro: values.bairro,
          cep: values.cep,
          city: values.city,
          state: values.state,
        },
        { headers: { "x-access-token": employee.token } }
      );
      showToast(response.data.message, "success", "Sucesso");
      setModalAddress(false);
      setLoadingAddress(false);
      formik.resetForm({
        values: {
          name: "",
          gender: "masc",
          type: "",
          cpf: "",
          email: "",
          socialName: "",
          stateRegistration: "",
          municipalRegistration: "",
          contact: "",
        },
      });
      formikAddress.resetForm({
        values: {
          street: "",
          number: "",
          comp: "",
          bairro: "",
          cep: "",
          city: "",
          state: "",
        },
      });
    } catch (error) {
      setLoadingAddress(false);
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((err) => {
          showToast(err.message, "error", "Erro");
        });
      } else {
        if (error.message === "Network Error") {
          alert(
            "Sem conexão com o servidor, verifique sua conexão com a internet."
          );
          return false;
        }
        const statusCode = error.response.status || 400;
        const typeError =
          error.response.data.message || "Ocorreu um erro ao salvar";
        const errorMesg = error.response.data.errorMessage || statusCode;
        const errorMessageFinal = `${typeError} + Cod: ${errorMesg}`;
        showToast(
          errorMessageFinal,
          "error",
          statusCode === 401 ? "Erro Autorização" : "Erro no Cadastro"
        );
      }
    }
  }

  const formik = useFormik({
    initialValues: {
      name: "",
      gender: "masc",
      type: "",
      cpf: "",
      email: "",
      socialName: "",
      stateRegistration: "",
      municipalRegistration: "",
      contact: "",
    },
    onSubmit: (values) => {
      register(values);
    },
  });

  const formikAddress = useFormik({
    initialValues: {
      street: "",
      number: "",
      comp: "",
      bairro: "",
      cep: "",
      city: "",
      state: "",
    },
    onSubmit: (values) => {
      registerAddress(values);
    },
  });

  return (
    <>
      <HeaderApp title="Cadastro de Clientes" icon={FaUserFriends} />

      <form onSubmit={formik.handleSubmit}>
        <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
          <Grid
            templateColumns={
              type === "person" ? "150px 2fr 1fr 150px" : "150px 2fr 1fr"
            }
            gap="15px"
          >
            <FormControl isRequired>
              <FormLabel>Tipo</FormLabel>
              <Select
                id="type"
                name="type"
                placeholder="Selecione"
                variant="outline"
                focusBorderColor={config.inputs}
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="company">Pessoa Jurídica</option>
                <option value="person">Pessoa Física</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>
                {type === "person" ? "Nome Completo" : "Nome Fantasia"}
              </FormLabel>
              <Input
                placeholder={
                  type === "person" ? "Nome Completo" : "Nome Fantasia"
                }
                focusBorderColor={config.inputs}
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                autoFocus
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>{type === "person" ? "CPF" : "CNPJ"}</FormLabel>
              <Input
                as={MaskedInput}
                mask={
                  type === "person"
                    ? [
                        /[0-9]/,
                        /\d/,
                        /\d/,
                        ".",
                        /\d/,
                        /\d/,
                        /\d/,
                        ".",
                        /\d/,
                        /\d/,
                        /\d/,
                        "-",
                        /\d/,
                        /\d/,
                      ]
                    : [
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
                      ]
                }
                name="cpf"
                placeholder={type === "person" ? "CPF" : "CNPJ"}
                value={formik.values.cpf}
                onChange={formik.handleChange}
              />
            </FormControl>
            {type === "person" && (
              <FormControl id="gender" isRequired>
                <FormLabel>Genero</FormLabel>
                <Select
                  id="gender"
                  name="gender"
                  placeholder="Selecione"
                  variant="outline"
                  focusBorderColor={config.inputs}
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                >
                  <option value="masc">Masculino</option>
                  <option value="fem">Femenino</option>
                </Select>
              </FormControl>
            )}
          </Grid>

          {type === "company" && (
            <Grid templateColumns="2fr 1fr 1fr" gap="15px" mt={3}>
              <FormControl>
                <FormLabel>Razão Social</FormLabel>
                <Input
                  id="socialName"
                  placeholder="Razão Social"
                  focusBorderColor={config.inputs}
                  name="socialName"
                  value={formik.values.socialName}
                  onChange={formik.handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Inscrição Estadual</FormLabel>
                <Input
                  id="stateRegistration"
                  placeholder="Inscrição Estadual"
                  focusBorderColor={config.inputs}
                  name="stateRegistration"
                  value={formik.values.stateRegistration}
                  onChange={formik.handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Inscrição Municipal</FormLabel>
                <Input
                  id="stateRegistration"
                  placeholder="Inscrição Municipal"
                  focusBorderColor={config.inputs}
                  name="municipalRegistration"
                  value={formik.values.municipalRegistration}
                  onChange={formik.handleChange}
                />
              </FormControl>
            </Grid>
          )}

          <Grid templateColumns="1fr 1fr" gap="15px" mt={3}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                id="email"
                placeholder="Email"
                focusBorderColor={config.inputs}
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Telefone</FormLabel>
              <Input
                as={MaskedInput}
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
                name="contact"
                value={formik.values.contact}
                onChange={formik.handleChange}
                placeholder="Telefone"
              />
            </FormControl>
          </Grid>

          <Divider mt={5} mb={5} />
          <Button
            leftIcon={<FaSave />}
            colorScheme={config.buttons}
            size="lg"
            isLoading={loading}
            type="submit"
          >
            Cadastrar
          </Button>
        </Box>
      </form>

      <Modal
        isOpen={modalAddress}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        isCentered
        size="xl"
      >
        <ModalOverlay />
        <ModalContent maxW="70rem">
          <form onSubmit={formikAddress.handleSubmit}>
            <ModalHeader>Cadastrar Endereço</ModalHeader>
            <ModalBody>
              <Grid templateColumns="1fr 100px" gap="15px">
                <FormControl isRequired>
                  <FormLabel>Logradouro</FormLabel>
                  <Input
                    placeholder="Logradouro"
                    focusBorderColor={config.inputs}
                    value={formikAddress.values.street}
                    onChange={formikAddress.handleChange}
                    name="street"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Numero</FormLabel>
                  <Input
                    placeholder="Numero"
                    focusBorderColor={config.inputs}
                    type="text"
                    value={formikAddress.values.number}
                    onChange={formikAddress.handleChange}
                    name="number"
                  />
                </FormControl>
              </Grid>
              <Grid templateColumns="1fr 1fr" gap="15px" mt={3}>
                <FormControl id="comp">
                  <FormLabel>Complemento</FormLabel>
                  <Input
                    placeholder="Complemento"
                    focusBorderColor={config.inputs}
                    value={formikAddress.values.comp}
                    onChange={formikAddress.handleChange}
                    name="comp"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Bairro</FormLabel>
                  <Input
                    name="bairro"
                    placeholder="Bairro"
                    focusBorderColor={config.inputs}
                    value={formikAddress.values.bairro}
                    onChange={formikAddress.handleChange}
                  />
                </FormControl>
              </Grid>
              <Grid templateColumns="1fr 1fr 100px" gap="15px" mt={3}>
                <FormControl isRequired>
                  <FormLabel>CEP</FormLabel>
                  <Input
                    as={MaskedInput}
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
                    value={formikAddress.values.cep}
                    onChange={formikAddress.handleChange}
                    placeholder="CEP"
                    name="cep"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Cidade</FormLabel>
                  <Input
                    placeholder="Cidade"
                    focusBorderColor={config.inputs}
                    type="text"
                    value={formikAddress.values.city}
                    onChange={formikAddress.handleChange}
                    name="city"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>UF</FormLabel>
                  <Select
                    placeholder="Selecione"
                    variant="outline"
                    focusBorderColor={config.inputs}
                    value={formikAddress.values.state}
                    onChange={formikAddress.handleChange}
                    name="state"
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
            </ModalBody>

            <ModalFooter>
              <Button
                leftIcon={<FaSave />}
                colorScheme={config.buttons}
                isLoading={loadingAddress}
                type="submit"
              >
                Cadastrar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
