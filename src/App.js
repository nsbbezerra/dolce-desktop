import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./style/theme";
import LayoutApp from "./layout/index";
import { BrowserRouter as Router } from "react-router-dom";
import "./style/calendar.css";
import "react-datepicker/dist/react-datepicker.css";

/** HOOKS */
import EmployeeProvider from "./context/Employee";

function App() {
  return (
    <EmployeeProvider>
      <Router>
        <ChakraProvider theme={theme} resetCSS={true}>
          <LayoutApp />
        </ChakraProvider>
      </Router>
    </EmployeeProvider>
  );
}

export default App;
