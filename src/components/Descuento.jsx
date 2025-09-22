import React from 'react';
import { useDescuento } from '../context/DescuentoContext';

const Descuento = () => {
  const { descuento, setDescuento } = useDescuento();

  const manejarCambio = (e) => {
    setDescuento(Number(e.target.value));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            🎉 Descuentos Especiales
          </h3>
          <p className="text-gray-600">
            Aplica un descuento a todos los productos
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <label htmlFor="descuentoSelect" className="text-sm font-medium text-gray-700">
            Descuento:
          </label>
          <select
            id="descuentoSelect"
            name="descuento"
            value={descuento}
            onChange={manejarCambio}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[140px]"
          >
            <option value="0">Sin descuento</option>
            <option value="10">10% OFF</option>
            <option value="20">20% OFF</option>
            <option value="30">30% OFF</option>
            <option value="50">50% OFF</option>
          </select>
        </div>
      </div>
      
      {descuento > 0 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-sm font-medium">
            ✅ Descuento del {descuento}% aplicado a todos los productos
          </p>
        </div>
      )}
    </div>
  );
};

export default Descuento;