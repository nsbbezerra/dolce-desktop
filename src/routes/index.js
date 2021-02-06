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

/** FINANCEIRO */
import BankAccount from "../pages/financeiro/bankAccount/index";
import PlanAccount from "../pages/financeiro/planAccount/index";
import PayForm from "../pages/financeiro/payForm/index";
import Check from "../pages/financeiro/check/index";
import Expenses from "../pages/financeiro/expenses/index";
import Revenues from "../pages/financeiro/revenues/index";
import Payments from "../pages/financeiro/payments/index";
import Comissions from "../pages/financeiro/comission/index";

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
    </Switch>
  );
}
