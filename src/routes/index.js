import React from "react";
import { Route, Switch } from "react-router-dom";

import Dashboard from "../pages/dashboard";

/** CADASTROS */
import RegisterClientes from "../pages/cadastro/clientes";
import RegisterAddress from "../pages/cadastro/endereco";
import RegisterDepartment from "../pages/cadastro/departamento";

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
    </Switch>
  );
}
