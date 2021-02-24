import React from "react";
import { Route, Switch } from "react-router-dom";

import Dashboard from "../pages/dashboard";

/** ADMINISTRATIVO */
import ListClients from "../pages/admin/clients/index";
import ListEmployee from "../pages/admin/employee/index";
import ListOrders from "../pages/admin/orders/index";

/** CADASTROS */
import RegisterClientes from "../pages/cadastro/clientes";
import RegisterAddress from "../pages/cadastro/endereco";
import RegisterDepartment from "../pages/cadastro/departamento";
import RegisterCategory from "../pages/cadastro/categoria";
import RegisterEmployee from "../pages/cadastro/colaboradores";
import RegisterProducts from "../pages/cadastro/produtos/produtos";
import RegisterColors from "../pages/cadastro/produtos/cores";
import RegisterSizes from "../pages/cadastro/produtos/tamanhos";
import RegisterImages from "../pages/cadastro/produtos/imagens";
import RegisterList from "../pages/cadastro/produtos/details";

/** ESTOQUE */
import ListDepartment from "../pages/products/department";
import ListCategory from "../pages/products/category";
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
      <Route path="/registerDepartment">
        <RegisterDepartment />
      </Route>
      <Route path="/registerCategory">
        <RegisterCategory />
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
      <Route path="/cashier">
        <Cashier />
      </Route>
      <Route path="/cashierreport">
        <CashierReport />
      </Route>
      <Route path="/listdepartment">
        <ListDepartment />
      </Route>
      <Route path="/listcategory">
        <ListCategory />
      </Route>
      <Route path="/listproduct">
        <ListProduct />
      </Route>
      <Route path="/configapp">
        <ConfigApp />
      </Route>
      <Route path="/colors">
        <RegisterColors />
      </Route>
      <Route path="/sizes">
        <RegisterSizes />
      </Route>
      <Route path="/images">
        <RegisterImages />
      </Route>
      <Route path={"/details"}>
        <RegisterList />
      </Route>
    </Switch>
  );
}
