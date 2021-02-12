import React, { createContext, useState, useContext, useEffect } from "react";

const EmployeeContext = createContext();

export default function EmployeeProvider({ children }) {
  const [employee, setEmployee] = useState({});

  useEffect(() => {
    console.log("EMPLOYEE", employee);
  }, [employee]);

  return (
    <EmployeeContext.Provider value={{ employee, setEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployee() {
  const context = useContext(EmployeeContext);
  const { employee, setEmployee } = context;
  return { employee, setEmployee };
}
