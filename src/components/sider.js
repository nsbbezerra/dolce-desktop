import React from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Flex,
  Icon,
  Text,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import {
  FaBars,
  FaSave,
  FaUserFriends,
  FaMapMarkedAlt,
  FaTags,
  FaTag,
  FaTools,
  FaIdCard,
  FaShoppingBag,
  FaBoxOpen,
  FaCashRegister,
  FaFileAlt,
  FaCalculator,
  FaShoppingCart,
} from "react-icons/fa";
import { AiFillShop } from "react-icons/ai";
import { GiHistogram } from "react-icons/gi";

export default function Sider() {
  const { push } = useHistory();

  function routing(rt) {
    push(rt);
  }

  return (
    <Box
      h="100%"
      w="100%"
      shadow="lg"
      borderRightWidth="1px"
      maxH="100%"
      overflow="auto"
    >
      <Flex align="center" h="50px" pl={2}>
        <Icon as={FaBars} mr={3} />
        <Text fontWeight="700">Menu</Text>
      </Flex>

      <Accordion>
        <AccordionItem>
          <AccordionButton
            _expanded={{ bg: "yellow.400" }}
            _focus={{ outline: "none" }}
          >
            <Flex align="center" flex="1" textAlign="left" fontWeight="700">
              <FaTools style={{ marginRight: 10 }} />
              Administrativo
            </Flex>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel p={0}>
            <Flex p={2} direction="column" align="flex-start">
              <Button
                variant="solid"
                size="sm"
                isFullWidth
                leftIcon={<FaUserFriends />}
                _focus={{ outline: "none" }}
              >
                Clientes
              </Button>
              <Button
                variant="solid"
                size="sm"
                isFullWidth
                leftIcon={<FaIdCard />}
                _focus={{ outline: "none" }}
                mt={1}
              >
                Colaboradores
              </Button>
              <Button
                variant="solid"
                size="sm"
                isFullWidth
                leftIcon={<FaShoppingBag />}
                _focus={{ outline: "none" }}
                mt={1}
              >
                Pedidos
              </Button>
            </Flex>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionButton
            _expanded={{ bg: "yellow.400" }}
            _focus={{ outline: "none" }}
          >
            <Flex align="center" flex="1" textAlign="left" fontWeight="700">
              <FaSave style={{ marginRight: 10 }} />
              Cadastros
            </Flex>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel p={0}>
            <Flex p={2} direction="column" align="flex-start">
              <Button
                variant="solid"
                size="sm"
                isFullWidth
                leftIcon={<FaUserFriends />}
                _focus={{ outline: "none" }}
              >
                Clientes
              </Button>
              <Button
                variant="solid"
                size="sm"
                isFullWidth
                leftIcon={<FaIdCard />}
                _focus={{ outline: "none" }}
                mt={1}
              >
                Colaboradores
              </Button>
              <Button
                variant="solid"
                size="sm"
                isFullWidth
                leftIcon={<FaMapMarkedAlt />}
                mt={1}
                _focus={{ outline: "none" }}
              >
                Endereços
              </Button>
              <Button
                leftIcon={<AiFillShop />}
                variant="solid"
                size="sm"
                isFullWidth
                mt={1}
                _focus={{ outline: "none" }}
              >
                Departamentos
              </Button>
              <Button
                leftIcon={<FaTags />}
                variant="solid"
                size="sm"
                isFullWidth
                mt={1}
                _focus={{ outline: "none" }}
              >
                Categorias
              </Button>
              <Button
                leftIcon={<FaTag />}
                variant="solid"
                size="sm"
                isFullWidth
                mt={1}
                _focus={{ outline: "none" }}
              >
                Produtos
              </Button>
            </Flex>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionButton
            _expanded={{ bg: "yellow.400" }}
            _focus={{ outline: "none" }}
          >
            <Flex align="center" flex="1" textAlign="left" fontWeight="700">
              <FaBoxOpen style={{ marginRight: 10 }} />
              Gerenciar Produtos
            </Flex>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel p={0}>
            <Flex p={2} direction="column" align="flex-start">
              <Button
                leftIcon={<AiFillShop />}
                variant="solid"
                size="sm"
                isFullWidth
                mt={1}
                _focus={{ outline: "none" }}
              >
                Departamentos
              </Button>
              <Button
                leftIcon={<FaTags />}
                variant="solid"
                size="sm"
                isFullWidth
                mt={1}
                _focus={{ outline: "none" }}
              >
                Categorias
              </Button>
              <Button
                leftIcon={<FaTag />}
                variant="solid"
                size="sm"
                isFullWidth
                mt={1}
                _focus={{ outline: "none" }}
              >
                Produtos
              </Button>
            </Flex>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionButton
            _expanded={{ bg: "yellow.400" }}
            _focus={{ outline: "none" }}
          >
            <Flex align="center" flex="1" textAlign="left" fontWeight="700">
              <FaCashRegister style={{ marginRight: 10 }} />
              Caixa Diário
            </Flex>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel p={0}>
            <Flex p={2} direction="column" align="flex-start">
              <Button
                leftIcon={<FaCalculator />}
                variant="solid"
                size="sm"
                isFullWidth
                mt={1}
                _focus={{ outline: "none" }}
              >
                Movimentação de Caixa
              </Button>
              <Button
                leftIcon={<GiHistogram />}
                variant="solid"
                size="sm"
                isFullWidth
                mt={1}
                _focus={{ outline: "none" }}
              >
                Histórico de Caixa
              </Button>
              <Button
                leftIcon={<FaFileAlt />}
                variant="solid"
                size="sm"
                isFullWidth
                mt={1}
                _focus={{ outline: "none" }}
              >
                Relatório de Caixa
              </Button>
            </Flex>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionButton
            _expanded={{ bg: "yellow.400" }}
            _focus={{ outline: "none" }}
          >
            <Flex align="center" flex="1" textAlign="left" fontWeight="700">
              <FaShoppingCart style={{ marginRight: 10 }} />
              PDV
            </Flex>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel p={0}>
            <Flex p={2} direction="column" align="flex-start">
              <Button
                leftIcon={<FaCalculator />}
                variant="solid"
                size="sm"
                isFullWidth
                mt={1}
                _focus={{ outline: "none" }}
              >
                Movimentação de Caixa
              </Button>
              <Button
                leftIcon={<GiHistogram />}
                variant="solid"
                size="sm"
                isFullWidth
                mt={1}
                _focus={{ outline: "none" }}
              >
                Histórico de Caixa
              </Button>
              <Button
                leftIcon={<FaFileAlt />}
                variant="solid"
                size="sm"
                isFullWidth
                mt={1}
                _focus={{ outline: "none" }}
              >
                Relatório de Caixa
              </Button>
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
}
