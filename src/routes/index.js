import React from "react";
import { Route, Switch } from "react-router-dom";

import Dashboard from "../pages/dashboard";

/** CADASTROS */
import RegisterClientes from "../pages/cadastro/clientes";

export default function Routers() {
  return (
    <Switch>
      <Route path="/" exact>
        <Dashboard />
      </Route>
      <Route path="/registerClient">
        <RegisterClientes />
      </Route>
    </Switch>
  );
}
