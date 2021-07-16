import React, { useState, memo, useEffect } from "react";
import {
  Table,
  Tbody,
  Td,
  Thead,
  Tr,
  Switch,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useToast,
  Flex,
  Text,
} from "@chakra-ui/react";
import Lottie from "../../../components/lottie";
import emptyAnimation from "../../../animations/empty.json";
import useFetch from "../../../hooks/useFetch";
import config from "../../../configs/index";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaEdit, FaImage } from "react-icons/fa";
import { mutate as mutateGlobal } from "swr";

function ListTags() {
  const toast = useToast();
  const { data, error, mutate } = useFetch("/tags");

  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (data) {
      setTags(data);
      console.log(data);
    }
  }, [data]);

  function showToast(message, status, title) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "bottom-right",
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

  return (
    <>
      {tags.length === 0 ? (
        <Flex justify="center" align="center" direction="column">
          <Lottie animation={emptyAnimation} height={200} width={200} />
          <Text>Nenhuma promoção para mostrar</Text>
        </Flex>
      ) : (
        <Table size="sm">
          <Thead>
            <Tr fontWeight="700">
              <Td w="5%">Ativo?</Td>
              <Td w="30%">Nome</Td>
              <Td isNumeric>Desconto</Td>
              <Td w="10%"></Td>
            </Tr>
          </Thead>

          <Tbody>
            {tags.map((tg) => (
              <Tr key={tg.id}>
                <Td w="5%">
                  <Switch
                    colorScheme={config.switchs}
                    size="sm"
                    defaultIsChecked={tg.active}
                  />
                </Td>
                <Td w="30%">{tg.name}</Td>
                <Td isNumeric>{parseFloat(tg.discount)}%</Td>
                <Td w="10%">
                  <Menu>
                    <MenuButton
                      as={Button}
                      rightIcon={<MdKeyboardArrowDown />}
                      colorScheme={config.buttons}
                      size="sm"
                      isFullWidth
                    >
                      Opções
                    </MenuButton>
                    <MenuList>
                      <MenuItem icon={<FaEdit />}>Editar Informações</MenuItem>
                      <MenuItem icon={<FaImage />}>Alterar Banner</MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </>
  );
}

export default memo(ListTags);
