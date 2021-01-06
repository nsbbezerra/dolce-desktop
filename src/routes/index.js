import React from "react";
import { Route, Switch } from "react-router-dom";

import Dashboard from "../pages/dashboard";

/** CADASTROS */
import RegisterClientes from "../pages/cadastro/clientes";
import RegisterAddress from "../pages/cadastro/endereco";
import RegisterDepartment from "../pages/cadastro/departamento";
import RegisterCategory from "../pages/cadastro/categoria";
import RegisterEmployee from "../pages/cadastro/colaboradores";
import RegisterProducts from "../pages/cadastro/produtos";

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
    </Switch>
  );
}
