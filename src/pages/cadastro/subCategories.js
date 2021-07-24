import React, { useEffect, useState } from "react";
import {
  Box,
  Input,
  Textarea,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Kbd,
  Select,
  Divider,
  useToast,
  FormErrorMessage,
  Icon,
} from "@chakra-ui/react";
import HeaderApp from "../../components/headerApp";
import { useEmployee } from "../../context/Employee";
import api from "../../configs/axios";
import { RiPriceTag2Fill } from "react-icons/ri";
import useFetch from "../../hooks/useFetch";
import config from "../../configs/index";
import { FaSave } from "react-icons/fa";

export default function SubCategories() {
  const toast = useToast();
  const { data, error } = useFetch("/categories");
  const { employee } = useEmployee();

  const [categories, setCategories] = useState([]);

  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [validators, setValidators] = useState([]);

  function clear() {
    setCategory("");
    setName("");
    setDescription("");
  }

  function handleValidator(path, message) {
    let val = [];
    let info = { path: path, message: message };
    val.push(info);
    setValidators(val);
    if (path !== "image") {
      const inpt = document.getElementById(path);
      inpt.focus();
    }
    setTimeout(() => {
      setValidators([]);
    }, 4000);
  }

  useEffect(() => {
    if (data) {
      setCategories(data);
    }
  }, [data]);

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

  if (error) {
    if (error.message === "Network Error") {
      alert(
        "Sem conexão com o servidor, verifique sua conexão com a internet."
      );
    } else {
      const statusCode = error.response.status || 400;
      const typeError =
        error.response.data.message || "Ocorreu um erro ao buscar";
      const errorMesg = error.response.data.errorMessage || statusCode;
      const errorMessageFinal = `${typeError} + Cod: ${errorMesg}`;
      showToast(
        errorMessageFinal,
        "error",
        statusCode === 401 ? "Erro Autorização" : "Erro no Cadastro"
      );
    }
  }

  function capitalizeAllFirstLetter(string) {
    let splited = string.split(" ");
    let toJoin = splited.map((e) => {
      return e.charAt(0).toUpperCase() + e.slice(1);
    });
    let joined = toJoin.join(" ");
    return joined;
  }

  async function register(e) {
    if (e) {
      e.preventDefault();
    }
    if (category === "") {
      handleValidator("categories", "Este campo é obrigatório");
      return false;
    }
    if (name === "") {
      handleValidator("name", "Este campo é obrigatório");
      return false;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/subCat",
        { name, categories_id: category, description },
        { headers: { "x-access-token": employee.token } }
      );

      showToast(response.data.message, "success", "Sucesso");
      clear();
      setLoading(false);
    } catch (error) {
      setLoading(false);
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

  return (
    <>
      <HeaderApp title="Cadastro de Sub-Categorias" icon={RiPriceTag2Fill} />

      <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
        <Grid templateColumns="1fr 1fr" gap="20px" mb={3}>
          <FormControl
            isRequired
            isInvalid={
              validators.find((obj) => obj.path === "categories") ? true : false
            }
          >
            <FormLabel htmlFor="categories">Selecione uma Categoria</FormLabel>
            <Select
              id="categories"
              focusBorderColor={config.inputs}
              placeholder="Selecione uma Categoria"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option value={cat.id} key={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Select>
            <FormErrorMessage>
              {validators.find((obj) => obj.path === "categories")
                ? validators.find((obj) => obj.path === "categories").message
                : ""}
            </FormErrorMessage>
          </FormControl>
          <FormControl
            isRequired
            isInvalid={
              validators.find((obj) => obj.path === "name") ? true : false
            }
          >
            <FormLabel>Nome</FormLabel>

            <Input
              id="name"
              focusBorderColor={config.inputs}
              placeholder="Nome"
              value={name}
              onChange={(e) =>
                setName(capitalizeAllFirstLetter(e.target.value))
              }
            />

            <FormErrorMessage>
              {validators.find((obj) => obj.path === "name")
                ? validators.find((obj) => obj.path === "name").message
                : ""}
            </FormErrorMessage>
          </FormControl>
        </Grid>
        <FormControl>
          <FormLabel>Descrição</FormLabel>

          <Textarea
            focusBorderColor={config.inputs}
            placeholder="Descrição"
            rows={3}
            resize="none"
            value={description}
            onChange={(e) =>
              setDescription(capitalizeAllFirstLetter(e.target.value))
            }
          />
        </FormControl>
        <Divider mt={5} mb={5} />
        <Button
          leftIcon={<FaSave />}
          colorScheme={config.buttons}
          size="lg"
          isLoading={loading}
          onClick={() => register()}
        >
          Salvar{" "}
          <Kbd ml={3} color="ButtonText">
            F12
          </Kbd>
        </Button>
      </Box>
    </>
  );
}
