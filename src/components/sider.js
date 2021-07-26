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
  FaReceipt,
  FaFileImport,
  FaImages,
  FaRulerCombined,
  FaShippingFast,
} from "react-icons/fa";
import {
  AiFillShop,
  AiFillBank,
  AiOutlineRise,
  AiOutlineFall,
} from "react-icons/ai";
import { RiPriceTag2Fill } from "react-icons/ri";
import { MdDashboard } from "react-icons/md";
import config from "../configs";
import { useEmployee } from "../context/Employee";

export default function Sider() {
  const { push } = useHistory();
  const { employee } = useEmployee();

  function routing(rt) {
    push(rt);
  }

  return (
    <Flex
      h="100%"
      w="60px"
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
        <MenuList shadow="lg">
          <MenuItem
            icon={<FaUserFriends />}
            onClick={() => routing("/listclients")}
          >
            Clientes
          </MenuItem>
          <MenuItem
            icon={<FaIdCard />}
            onClick={() => routing("/listemployee")}
          >
            Colaboradores
          </MenuItem>
          <MenuItem
            icon={<FaShippingFast />}
            onClick={() => routing("/listproviders")}
          >
            Fornecedores
          </MenuItem>
          <MenuDivider />
          <MenuItem
            icon={<FaShoppingBag />}
            onClick={() => routing("/listorders")}
            isDisabled
          >
            Pedidos
          </MenuItem>
        </MenuList>
      </Menu>

      <Menu placement="right-start">
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
        <MenuList shadow="lg">
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
            icon={<FaShippingFast />}
            onClick={() => routing("/providers")}
          >
            Fornecedores
          </MenuItem>
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
            icon={<RiPriceTag2Fill />}
            onClick={() => routing("/subCategories")}
          >
            Sub-Categorias
          </MenuItem>
          <MenuItem
            icon={<FaTag />}
            onClick={() => routing("/registerProducts")}
          >
            Produtos
          </MenuItem>
          <MenuItem
            icon={<FaRulerCombined />}
            onClick={() => routing("/sizes")}
          >
            Tamanhos
          </MenuItem>
          <MenuItem icon={<FaImages />} onClick={() => routing("/images")}>
            Galeria de Imagens
          </MenuItem>
          <MenuDivider />
          <MenuItem icon={<FaTags />} onClick={() => routing("/promotional")}>
            Criar Promoções
          </MenuItem>
          <MenuItem
            icon={<FaFileImport />}
            onClick={() => routing("/registerProducts")}
            isDisabled
          >
            Importar XML
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
        <MenuList shadow="lg">
          <MenuItem
            icon={<AiFillShop />}
            onClick={() => routing("/listdepartment")}
          >
            Departamentos
          </MenuItem>
          <MenuItem icon={<FaTags />} onClick={() => routing("/listcategory")}>
            Categorias
          </MenuItem>
          <MenuItem
            icon={<RiPriceTag2Fill />}
            onClick={() => routing("/listSubCategories")}
          >
            Sub-Categorias
          </MenuItem>
          <MenuItem icon={<FaTag />} onClick={() => routing("/listproduct")}>
            Produtos
          </MenuItem>
          <MenuDivider />
          <MenuItem icon={<FaBarcode />} isDisabled>
            Etiquetas
          </MenuItem>
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
        <MenuList shadow="lg">
          <MenuItem
            icon={<FaCalculator />}
            onClick={() => routing("/cashiermoviment")}
          >
            Gerenciar Caixa
          </MenuItem>
          <MenuItem
            icon={<FaFileAlt />}
            onClick={() => routing("/cashierreport")}
            isDisabled
          >
            Relatório de Caixa
          </MenuItem>
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
            isDisabled
          />
        </Tooltip>
        <MenuList shadow="lg">
          <MenuItem icon={<FaShoppingBag />} onClick={() => routing("/pdv")}>
            Venda de Produtos
          </MenuItem>
          <MenuItem
            icon={<FaClipboardList />}
            onClick={() => routing("/budget")}
          >
            Orçamentos
          </MenuItem>
          <MenuItem icon={<FaTools />} onClick={() => routing("/listorders")}>
            Gerenciar Pedidos
          </MenuItem>
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
        <MenuList shadow="lg">
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
          <MenuItem
            icon={<FaBarcode />}
            onClick={() => routing("/payments")}
            isDisabled
          >
            Gerenciar Pagamentos
          </MenuItem>
          <MenuItem
            icon={<FaPercentage />}
            onClick={() => routing("/comissions")}
            isDisabled
          >
            Gerenciar Comissões
          </MenuItem>
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
            isDisabled
          />
        </Tooltip>
        <MenuList shadow="lg">
          <MenuItem icon={<FaCashRegister />}>Fluxo de Caixa</MenuItem>
          <MenuItem icon={<FaBarcode />}>Pagamentos</MenuItem>
          <MenuItem icon={<FaSave />}>Cadastros</MenuItem>
          <MenuDivider />
          <MenuItem icon={<FaChartPie />}>Relatório Financeiro</MenuItem>
        </MenuList>
      </Menu>

      <Tooltip label="Notas Fiscais" hasArrow placement="top-start">
        <IconButton
          icon={<FaReceipt />}
          size="lg"
          fontSize="2xl"
          onClick={() => routing("/")}
          variant="ghost"
          mt={3}
          isDisabled
        />
      </Tooltip>
    </Flex>
  );
}
