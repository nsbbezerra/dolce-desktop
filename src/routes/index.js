import React from "react";
import { Route, Switch } from "react-router-dom";

import Dashboard from "../pages/dashboard";

export default function Routers() {
  return (
    <Switch>
      <Route path="/" exact>
        <Dashboard />
      </Route>
    </Switch>
  );
}
