import React from "react";
import { Route, Switch } from "react-router-dom";

import Dashboard from "../pages/dashboard";

/** ADMINISTRATIVO */
import ListClients from "../pages/admin/clients/index";
import ListEmployee from "../pages/admin/employee/index";
import ListOrders from "../pages/admin/orders/index";
import ListProviders from "../pages/admin/providers/index";

/** CADASTROS */
import RegisterClientes from "../pages/cadastro/clientes";
import RegisterAddress from "../pages/cadastro/endereco";
import RegisterEmployee from "../pages/cadastro/colaboradores";
import RegisterProducts from "../pages/cadastro/produtos/produtos";
import RegisterProvider from "../pages/cadastro/provider";
import MakePromotional from "../pages/cadastro/promotional";
import XmlImporter from "../pages/cadastro/xmlIndex";

/** ESTOQUE */
import ListProduct from "../pages/products/products";

/** CAIXA */
import CashierMoviment from "../pages/cashier/moviment";
import Cashier from "../pages/cashier/cashier";
import CashierReport from "../pages/cashier/report";

/** PONTO DE VENDA */
import Pdv from "../pages/pdv/pdv";
import Budget from "../pages/pdv/budget";

/** FINANCEIRO */
import BankAccount from "../pages/financeiro/bankAccount/index";
import PlanAccount from "../pages/financeiro/planAccount/index";
import PayForm from "../pages/financeiro/payForm/index";
import Check from "../pages/financeiro/check/index";
import Expenses from "../pages/financeiro/expenses/index";
import Revenues from "../pages/financeiro/revenues/index";
import Payments from "../pages/financeiro/payments/index";
import Comissions from "../pages/financeiro/comission/index";

/** CONFIGURAÇÕES */
import ConfigApp from "../pages/configs/app";

export default function Routers() {
  return (
    <Switch>
      <Route path="/" exact>
        <Dashboard />
      </Route>
      <Route path="/registerClient">
        <RegisterClientes />
      </Route>
      <Route path="/registerAddress">
        <RegisterAddress />
      </Route>
      <Route path="/registerEmlpoyee">
        <RegisterEmployee />
      </Route>
      <Route path="/registerProducts">
        <RegisterProducts />
      </Route>
      <Route path="/bankAccount">
        <BankAccount />
      </Route>
      <Route path="/planaccount">
        <PlanAccount />
      </Route>
      <Route path={"/payform"}>
        <PayForm />
      </Route>
      <Route path={"/check"}>
        <Check />
      </Route>
      <Route path="/expenses">
        <Expenses />
      </Route>
      <Route path="/revenues">
        <Revenues />
      </Route>
      <Route path="/payments">
        <Payments />
      </Route>
      <Route path="/comissions">
        <Comissions />
      </Route>
      <Route path="/listclients">
        <ListClients />
      </Route>
      <Route path="/listemployee">
        <ListEmployee />
      </Route>
      <Route path="/listorders">
        <ListOrders />
      </Route>
      <Route path="/pdv">
        <Pdv />
      </Route>
      <Route path="/budget">
        <Budget />
      </Route>
      <Route path="/cashiermoviment">
        <CashierMoviment />
      </Route>
      <Route path="/cashier/:cash">
        <Cashier />
      </Route>
      <Route path="/cashierreport">
        <CashierReport />
      </Route>
      <Route path="/listproduct">
        <ListProduct />
      </Route>
      <Route path="/configapp">
        <ConfigApp />
      </Route>
      <Route path="/providers">
        <RegisterProvider />
      </Route>
      <Route path="/listproviders">
        <ListProviders />
      </Route>
      <Route path="/promotional">
        <MakePromotional />
      </Route>
      <Route path="/xmlimporter">
        <XmlImporter />
      </Route>
    </Switch>
  );
}
