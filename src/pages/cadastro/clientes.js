import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  Icon,
  IconButton,
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
} from "@chakra-ui/react";
import { FaTimes, FaUserFriends, FaSave } from "react-icons/fa";
import config from "../../configs";

export default function SaveClient() {
  const [loading, setLoading] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [modalAddress, setModalAddress] = useState(false);

  function register(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setModalAddress(true);
    }, 3000);
  }

  function registerAddress() {
    setLoadingAddress(true);
    setTimeout(() => {
      setLoadingAddress(false);
      setModalAddress(false);
    }, 3000);
  }

  return (
    <>
      <Flex
        shadow="md"
        rounded="md"
        borderWidth="1px"
        pt={1}
        pb={1}
        pl={3}
        pr={2}
        justify="space-between"
        align="center"
      >
        <Flex>
          <Icon as={FaUserFriends} mr={3} />
          <Heading size="sm">Cadastro de Clientes</Heading>
        </Flex>
        <IconButton
          aria-label="Search database"
          icon={<FaTimes />}
          size="sm"
          rounded="xl"
          variant="ghost"
          colorScheme="red"
        />
      </Flex>

      <Box shadow="md" rounded="md" borderWidth="1px" p={3} mt="25px">
        <form onSubmit={register}>
          <Grid templateColumns="1fr 1fr 250px" gap="15px">
            <FormControl id="first-name" isRequired>
              <FormLabel>Nome</FormLabel>
              <Input
                placeholder="Nome completo"
                focusBorderColor={config.inputs}
              />
            </FormControl>
            <FormControl id="cpf" isRequired>
              <FormLabel>CPF</FormLabel>
              <Input
                placeholder="CPF"
                focusBorderColor={config.inputs}
                type="number"
                maxLength="11"
              />
            </FormControl>
            <FormControl id="gender" isRequired>
              <FormLabel>Genero</FormLabel>
              <Select
                placeholder="Selecione"
                variant="outline"
                focusBorderColor={config.inputs}
              >
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
              </Select>
            </FormControl>
          </Grid>
          <Grid templateColumns="1fr 1fr" gap="15px" mt={3}>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                placeholder="Email"
                focusBorderColor={config.inputs}
                type="email"
              />
            </FormControl>
            <FormControl id="phone" isRequired>
              <FormLabel>Telefone</FormLabel>
              <Input
                placeholder="00-00000-0000"
                focusBorderColor={config.inputs}
                type="tel"
                pattern="[0-9]{2}-[0-9]{5}-[0-9]{4}"
              />
            </FormControl>
          </Grid>

          <Grid templateColumns="1fr 1fr" gap="15px" mt={3}>
            <FormControl id="user" isRequired>
              <FormLabel>Usuário</FormLabel>
              <Input placeholder="Usuário" focusBorderColor={config.inputs} />
            </FormControl>
            <FormControl id="pass" isRequired>
              <FormLabel>Senha</FormLabel>
              <Input
                placeholder="Usuário"
                type="password"
                focusBorderColor={config.inputs}
              />
            </FormControl>
          </Grid>
          <Divider mt={5} mb={5} />
          <Button
            leftIcon={<FaSave />}
            colorScheme="blue"
            size="lg"
            type="submit"
            isLoading={loading}
          >
            Cadastrar
          </Button>
        </form>
      </Box>

      <Modal
        isOpen={modalAddress}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        isCentered
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Cadastrar Endereço</ModalHeader>
          <ModalBody>
            <Grid templateColumns="1fr 100px" gap="15px">
              <FormControl id="avenue" isRequired>
                <FormLabel>Logradouro</FormLabel>
                <Input
                  placeholder="Logradouro"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
              <FormControl id="number" isRequired>
                <FormLabel>Numero</FormLabel>
                <Input
                  placeholder="Numero"
                  focusBorderColor={config.inputs}
                  type="number"
                />
              </FormControl>
            </Grid>
            <Grid templateColumns="1fr" gap="15px" mt={3}>
              <FormControl id="comp">
                <FormLabel>Complemento</FormLabel>
                <Input
                  placeholder="Complemento"
                  focusBorderColor={config.inputs}
                />
              </FormControl>
            </Grid>
            <Grid templateColumns="1fr 1fr 100px" gap="15px" mt={3}>
              <FormControl id="cep" isRequired>
                <FormLabel>CEP</FormLabel>
                <Input
                  placeholder="000000-000"
                  focusBorderColor={config.inputs}
                  type="tel"
                  pattern="[0-9]{6}-[0-9]{3}"
                />
              </FormControl>
              <FormControl id="city" isRequired>
                <FormLabel>Cidade</FormLabel>
                <Input
                  placeholder="Cidade"
                  focusBorderColor={config.inputs}
                  type="text"
                />
              </FormControl>
              <FormControl id="uf" isRequired>
                <FormLabel>UF</FormLabel>
                <Select
                  placeholder="Selecione"
                  variant="outline"
                  focusBorderColor={config.inputs}
                >
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                </Select>
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
    </>
  );
}
