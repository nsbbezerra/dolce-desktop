import React from "react";
import { useHistory } from "react-router-dom";
import {
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  IconButton,
  Tooltip,
  MenuDivider,
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
  FaBalanceScale,
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
    <Flex
      h="100%"
      w="75px"
      shadow="lg"
      borderRightWidth="1px"
      maxH="100%"
      overflow="auto"
      direction="column"
      align="center"
      p={3}
    >
      <Tooltip label="Dashboard" hasArrow placement="top-start">
        <IconButton
          icon={<MdDashboard />}
          size="lg"
          fontSize="2xl"
          colorScheme={config.sider.btnHome}
          _focus={{ outline: "none" }}
          onClick={() => routing("/")}
          variant="ghost"
        />
      </Tooltip>

      <Menu placement="right">
        <Tooltip label="Administrativo" hasArrow placement="top-start">
          <MenuButton
            mt={3}
            as={IconButton}
            aria-label="Options"
            icon={<FaTools />}
            size="lg"
            fontSize="2xl"
            variant="ghost"
          />
        </Tooltip>
        <MenuList>
          <MenuItem icon={<FaUserFriends />}>Clientes</MenuItem>
          <MenuItem icon={<FaIdCard />}>Colaboradores</MenuItem>
          <MenuItem icon={<FaShoppingBag />}>Pedidos</MenuItem>
        </MenuList>
      </Menu>

      <Menu placement="right">
        <Tooltip label="Cadastros" hasArrow placement="top-start">
          <MenuButton
            mt={3}
            as={IconButton}
            aria-label="Options"
            icon={<FaSave />}
            size="lg"
            fontSize="2xl"
            variant="ghost"
          />
        </Tooltip>
        <MenuList>
          <MenuItem
            icon={<FaUserFriends />}
            onClick={() => routing("/registerClient")}
          >
            Clientes
          </MenuItem>
          <MenuItem
            icon={<FaIdCard />}
            onClick={() => routing("/registerEmlpoyee")}
          >
            Colaboradores
          </MenuItem>
          <MenuItem
            icon={<FaMapMarkedAlt />}
            onClick={() => routing("/registerAddress")}
          >
            Endereços
          </MenuItem>
          <MenuDivider />
          <MenuItem
            icon={<AiFillShop />}
            onClick={() => routing("/registerDepartment")}
          >
            Departamentos
          </MenuItem>
          <MenuItem
            icon={<FaTags />}
            onClick={() => routing("/registerCategory")}
          >
            Categorias
          </MenuItem>
          <MenuItem
            icon={<FaTag />}
            onClick={() => routing("/registerProducts")}
          >
            Produtos
          </MenuItem>
        </MenuList>
      </Menu>

      <Menu placement="right">
        <Tooltip label="Gerenciar Produtos" hasArrow placement="top-start">
          <MenuButton
            mt={3}
            as={IconButton}
            aria-label="Options"
            icon={<FaBoxOpen />}
            size="lg"
            fontSize="2xl"
            variant="ghost"
          />
        </Tooltip>
        <MenuList>
          <MenuItem icon={<AiFillShop />}>Departamentos</MenuItem>
          <MenuItem icon={<FaTags />}>Categorias</MenuItem>
          <MenuItem icon={<FaTag />}>Produtos</MenuItem>
        </MenuList>
      </Menu>

      <Menu placement="right">
        <Tooltip label="Caixa Diário" hasArrow placement="top-start">
          <MenuButton
            mt={3}
            as={IconButton}
            aria-label="Options"
            icon={<FaCashRegister />}
            size="lg"
            fontSize="2xl"
            variant="ghost"
          />
        </Tooltip>
        <MenuList>
          <MenuItem icon={<FaCalculator />}>Movimentação de Caixa</MenuItem>
          <MenuItem icon={<GiHistogram />}>Histórico de Caixa</MenuItem>
          <MenuItem icon={<FaFileAlt />}>Relatório de Caixa</MenuItem>
        </MenuList>
      </Menu>

      <Menu placement="right">
        <Tooltip label="Ponto de Venda" hasArrow placement="top-start">
          <MenuButton
            mt={3}
            as={IconButton}
            aria-label="Options"
            icon={<FaShoppingCart />}
            size="lg"
            fontSize="2xl"
            variant="ghost"
          />
        </Tooltip>
        <MenuList>
          <MenuItem icon={<FaShoppingBag />}>Venda de Produtos</MenuItem>
          <MenuItem icon={<FaClipboardList />}>Orçamentos</MenuItem>
          <MenuItem icon={<FaTools />}>Gerenciar Pedidos</MenuItem>
        </MenuList>
      </Menu>

      <Menu placement="right">
        <Tooltip label="Financeiro" hasArrow placement="top-start">
          <MenuButton
            mt={3}
            as={IconButton}
            aria-label="Options"
            icon={<FaChartPie />}
            size="lg"
            fontSize="2xl"
            variant="ghost"
          />
        </Tooltip>
        <MenuList>
          <MenuItem
            icon={<AiFillBank />}
            onClick={() => routing("/bankAccount")}
          >
            Contas Bancárias
          </MenuItem>
          <MenuItem
            icon={<FaClipboardList />}
            onClick={() => routing("/planaccount")}
          >
            Plano de Contas
          </MenuItem>
          <MenuItem icon={<FaCreditCard />} onClick={() => routing("/payform")}>
            Formas de Pagamento
          </MenuItem>
          <MenuDivider />
          <MenuItem icon={<FaMoneyCheck />} onClick={() => routing("/check")}>
            Gerenciar Cheques
          </MenuItem>
          <MenuDivider />
          <MenuItem
            icon={<AiOutlineFall />}
            onClick={() => routing("/expenses")}
          >
            Contas a Pagar
          </MenuItem>
          <MenuItem
            icon={<AiOutlineRise />}
            onClick={() => routing("/revenues")}
          >
            Contas a Receber
          </MenuItem>
          <MenuDivider />
          <MenuItem icon={<FaBarcode />}>Gerenciar Pagamentos</MenuItem>
          <MenuItem icon={<FaPercentage />}>Gerenciar Comissões</MenuItem>
        </MenuList>
      </Menu>

      <Menu placement="right">
        <Tooltip label="Relatórios" hasArrow placement="top-start">
          <MenuButton
            mt={3}
            as={IconButton}
            aria-label="Options"
            icon={<FaFileAlt />}
            size="lg"
            fontSize="2xl"
            variant="ghost"
          />
        </Tooltip>
        <MenuList>
          <MenuItem icon={<FaCashRegister />}>Fluxo de Caixa</MenuItem>
          <MenuItem icon={<FaBarcode />}>Pagamentos</MenuItem>
          <MenuItem icon={<FaSave />}>Cadastros</MenuItem>
          <MenuDivider />
          <MenuItem icon={<FaChartPie />}>Relatório Financeiro</MenuItem>
        </MenuList>
      </Menu>

      <Tooltip label="Notas Fiscais" hasArrow placement="top-start">
        <IconButton
          icon={<FaBalanceScale />}
          size="lg"
          fontSize="2xl"
          onClick={() => routing("/")}
          variant="ghost"
          mt={3}
        />
      </Tooltip>
    </Flex>
  );
}
