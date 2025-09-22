import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Eye, Heart } from 'lucide-react';
import { useCarrito } from '../context/CarritoContext';
import { useDescuento } from '../context/DescuentoContext';

export const ProductCard = ({ product }) => {
  const { agregarAlCarrito } = useCarrito();
  const { descuento } = useDescuento();

  const precioConDescuento = (precio) => {
    return (precio - (precio * descuento) / 100).toFixed(2);
  };

  const precioFinal = descuento > 0 ? precioConDescuento(product.price) : product.price;

  return (
    <div className="group relative bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Badge de descuento */}
      {descuento > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold">
          -{descuento}%
        </div>
      )}

      {/* Quick Actions */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
          <Heart className="h-4 w-4 text-gray-600" />
        </button>
        <Link
          to={`/producto/${product.id}`}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
        >
          <Eye className="h-4 w-4 text-gray-600" />
        </Link>
      </div>

      {/* Imagen del producto */}
      <div className="aspect-square p-6 bg-gray-50 group-hover:bg-gray-100 transition-colors">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Contenido del producto */}
      <div className="p-6">
        {/* Categoría */}
        <p className="text-sm text-gray-500 mb-2 capitalize">{product.category}</p>

        {/* Título */}
        <Link to={`/producto/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating?.rate || 4.5)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            ({product.rating?.count || 0})
          </span>
        </div>

        {/* Precio */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold text-gray-900">
            ${precioFinal}
          </span>
          {descuento > 0 && (
            <span className="text-lg text-gray-500 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Botón de agregar al carrito */}
        <button
          onClick={() => agregarAlCarrito({
            id: product.id,
            title: product.title,
            price: parseFloat(precioFinal),
            image: product.image,
            category: product.category
          })}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 group"
        >
          <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
};