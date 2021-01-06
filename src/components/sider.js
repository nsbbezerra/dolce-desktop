import React from "react";
import { useHistory } from "react-router-dom";
import {
  Box,
  Flex,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import {
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
  FaClipboardList,
  FaChartPie,
  FaCreditCard,
  FaMoneyCheck,
  FaBarcode,
  FaPercentage,
} from "react-icons/fa";
import {
  AiFillShop,
  AiFillBank,
  AiOutlineRise,
  AiOutlineFall,
} from "react-icons/ai";
import { GiHistogram } from "react-icons/gi";
import { MdDashboard } from "react-icons/md";
import config from "../configs";

export default function Sider() {
  const { push } = useHistory();

  function routing(rt) {
    push(rt);
  }

  return (
    <Box
      h="100%"
      w="220px"
      shadow="lg"
      borderRightWidth="1px"
      maxH="100%"
      overflow="auto"
    >
      <Flex align="center" h="50px" pl={2} pr={2}>
        <Button
          leftIcon={<MdDashboard />}
          isFullWidth
          colorScheme={config.sider.btnHome}
          variant="ghost"
          _focus={{ outline: "none" }}
          onClick={() => routing("/")}
        >
          Dashboard
        </Button>
      </Flex>

      <Accordion>
        <AccordionItem>
          <AccordionButton _focus={{ outline: "none" }}>
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
          <AccordionButton _focus={{ outline: "none" }}>
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
                onClick={() => routing("/registerClient")}
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
                onClick={() => routing("/registerEmlpoyee")}
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
                onClick={() => routing("/registerAddress")}
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
                onClick={() => routing("/registerDepartment")}
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
                onClick={() => routing("/registerCategory")}
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
                onClick={() => routing("/registerProducts")}
              >
                Produtos
              </Button>
            </Flex>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionButton _focus={{ outline: "none" }}>
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
          <AccordionButton _focus={{ outline: "none" }}>
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
          <AccordionButton _focus={{ outline: "none" }}>
            <Flex align="center" flex="1" textAlign="left" fontWeight="700">
              <FaShoppingCart style={{ marginRight: 10 }} />
              Ponto de Venda
            </Flex>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel p={0}>
            <Flex p={2} direction="column" align="flex-start">
              <Button
                leftIcon={<FaShoppingBag />}
                variant="solid"
                size="sm"
                isFullWidth
                mt={1}
                _focus={{ outline: "none" }}
              >
                Venda de Produtos
              </Button>
              <Button
                leftIcon={<FaClipboardList />}
                variant="solid"
                size="sm"
                isFullWidth
                mt={1}
                _focus={{ outline: "none" }}
              >
                Listagem de Pedidos
              </Button>
              <Button
                leftIcon={<FaTools />}
                variant="solid"
                size="sm"
                isFullWidth
                mt={1}
                _focus={{ outline: "none" }}
              >
                Gerenciar Pedidos
              </Button>
            </Flex>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionButton _focus={{ outline: "none" }}>
            <Flex align="center" flex="1" textAlign="left" fontWeight="700">
              <FaChartPie style={{ marginRight: 10 }} />
              Financeiro
            </Flex>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel p={0}>
            <Flex p={2} direction="column" align="flex-start">
              <Button
                leftIcon={<AiFillBank />}
                variant="solid"
                size="sm"
                isFullWidth
                mt={1}
                _focus={{ outline: "none" }}
              >
                Contas Bancárias
              </Button>
              <Button
                leftIcon={<FaClipboardList />}
                variant="solid"
                size="sm"
                isFullWidth
                mt={1}
                _focus={{ outline: "none" }}
              >
                Plano de Contas
              </Button>
              <Button
                leftIcon={<FaCreditCard />}
                variant="solid"
                size="sm"
                isFullWidth
                mt={1}
                _focus={{ outline: "none" }}
              >
                Formas de Pagamento
              </Button>
              <Button
                leftIcon={<FaMoneyCheck />}
                variant="solid"
                size="sm"
                isFullWidth
                mt={1}
                _focus={{ outline: "none" }}
              >
                Gerenciar Cheques
              </Button>
              <Button
                leftIcon={<AiOutlineFall />}
                variant="solid"
                size="sm"
                isFullWidth
                mt={1}
                _focus={{ outline: "none" }}
              >
                Contas a Pagar
              </Button>
              <Button
                leftIcon={<AiOutlineRise />}
                variant="solid"
                size="sm"
                isFullWidth
                mt={1}
                _focus={{ outline: "none" }}
              >
                Contas a Receber
              </Button>
              <Button
                leftIcon={<FaBarcode />}
                variant="solid"
                size="sm"
                isFullWidth
                mt={1}
                _focus={{ outline: "none" }}
              >
                Gerenciar Pagamentos
              </Button>
              <Button
                leftIcon={<FaPercentage />}
                variant="solid"
                size="sm"
                isFullWidth
                mt={1}
                _focus={{ outline: "none" }}
              >
                Gerenciar Comissões
              </Button>
            </Flex>
          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <AccordionButton _focus={{ outline: "none" }}>
            <Flex align="center" flex="1" textAlign="left" fontWeight="700">
              <FaFileAlt style={{ marginRight: 10 }} />
              Relatórios
            </Flex>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel p={0}>
            <Flex p={2} direction="column" align="flex-start">
              <Button
                leftIcon={<FaCashRegister />}
                variant="solid"
                size="sm"
                isFullWidth
                mt={1}
                _focus={{ outline: "none" }}
              >
                Fluxo de Caixa
              </Button>
              <Button
                leftIcon={<FaBarcode />}
                variant="solid"
                size="sm"
                isFullWidth
                mt={1}
                _focus={{ outline: "none" }}
              >
                Pagamentos
              </Button>
              <Button
                leftIcon={<FaSave />}
                variant="solid"
                size="sm"
                isFullWidth
                mt={1}
                _focus={{ outline: "none" }}
              >
                Cadastros
              </Button>
              <Button
                leftIcon={<FaChartPie />}
                variant="solid"
                size="sm"
                isFullWidth
                mt={1}
                _focus={{ outline: "none" }}
              >
                Relatório Financeiro
              </Button>
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
}
