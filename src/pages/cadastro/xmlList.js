import { Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/table";
import React, { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";

import Lottie from "../../components/lottie";
import emptyAnimation from "../../animations/empty.json";

import HandleProducts from "../../components/products";
import { useToast } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/modal";
import config from "../../configs";
import { FaSave } from "react-icons/fa";

export default function ListXml() {
  const toast = useToast();
  const { data, error } = useFetch("/xmlimporter");

  const [products, setProducts] = useState([]);
  const [modalHandle, setModalHandle] = useState(false);
  const [productHandle, setProductHandle] = useState({});

  async function handleCloseModal() {
    const updated = await products.filter((obj) => obj.id !== productHandle.id);
    setProducts(updated);
    setModalHandle(false);
  }

  useEffect(() => {
    if (data) {
      setProducts(data);
      console.log(data);
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

  function handleSaveProduct(info) {
    setProductHandle(info);
    setModalHandle(true);
  }

  return (
    <>
      {products.length === 0 ? (
        <Flex justify="center" align="center" direction="column" p={10}>
          <Lottie animation={emptyAnimation} height={200} width={200} />
          <Text>Nenhum produto para mostrar</Text>
        </Flex>
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th w="20%">Fornecedor</Th>
              <Th w="20%">Produto</Th>
              <Th>SKU</Th>
              <Th>Cod. Barras</Th>
              <Th isNumeric w="12%">
                Custo (R$)
              </Th>
              <Th w="7%"></Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.map((prod) => (
              <Tr key={prod.id}>
                <Td w="20%">{prod.provider_fantasia || prod.provider_name}</Td>
                <Td w="20%">{prod.name}</Td>
                <Td>{prod.sku}</Td>
                <Td>{prod.barcode}</Td>
                <Td isNumeric w="12%">
                  {parseFloat(prod.cost_value).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </Td>
                <Td w="7%">
                  <Button
                    colorScheme={config.buttons}
                    size="xs"
                    leftIcon={<FaSave />}
                    onClick={() => handleSaveProduct(prod)}
                  >
                    Visualizar e Salvar
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <Modal
        isOpen={modalHandle}
        onClose={() => setModalHandle(false)}
        size="7xl"
        isCentered
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent h="95vh" maxW="95vw">
          <ModalHeader>Visualizar e Salvar</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={5}>
            {modalHandle && (
              <HandleProducts
                item={productHandle}
                onClosed={handleCloseModal}
                emitter={null}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
