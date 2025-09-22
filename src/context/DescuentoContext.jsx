import React, { createContext, useContext, useState } from 'react';

const DescuentoContext = createContext();

export const useDescuento = () => useContext(DescuentoContext);

export const DescuentoProvider = ({ children }) => {
  const [descuento, setDescuento] = useState(0);

  return (
    <DescuentoContext.Provider value={{ descuento, setDescuento }}>
      {children}
    </DescuentoContext.Provider>
  );
};