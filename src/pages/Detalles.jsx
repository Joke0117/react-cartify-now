import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDescuento } from '../context/DescuentoContext';
import { useCarrito } from '../context/CarritoContext';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2 } from 'lucide-react';

const Detalles = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const { descuento } = useDescuento();
  const { agregarAlCarrito } = useCarrito();
  const [verMas, setVerMas] = useState(false);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    obtenerProducto();
  }, [id]);

  const obtenerProducto = async () => {
    try {
      setLoading(true);
      const datos = await fetch(`https://fakestoreapi.com/products/${id}`);
      const prod = await datos.json();
      setProducto(prod);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener producto:', error);
      setLoading(false);
    }
  };

  const precioConDescuento = (precio) => {
    return (precio - (precio * descuento) / 100).toFixed(2);
  };

  const manejarWhatsApp = () => {
    const mensaje = `¡Hola! Estoy interesado en este producto:
    
📱 ${producto.title}
💰 Precio: $${descuento > 0 ? precioConDescuento(producto.price) : producto.price.toFixed(2)}
🛒 Cantidad: ${cantidad}
${descuento > 0 ? `🎉 Con descuento del ${descuento}%` : ''}

¿Podrían darme más información?`;

    const numeroWhatsApp = "1234567890"; // Cambiar por el número real
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <h2 className="text-2xl font-semibold mt-4 text-gray-900">Cargando producto...</h2>
        </div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Producto no encontrado</h2>
          <Link to="/producto" className="text-blue-600 hover:text-blue-700">
            Volver a la tienda
          </Link>
        </div>
      </div>
    );
  }

  const descripcionCorta = producto.description.length > 150
    ? producto.description.slice(0, 150) + "..."
    : producto.description;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link
            to="/producto"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a productos
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600 capitalize">{producto.category}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Imagen del producto */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
              <img
                src={producto.image}
                alt={producto.title}
                className="w-full h-96 object-contain"
              />
            </div>
            
            {/* Badge de descuento */}
            {descuento > 0 && (
              <div className="bg-red-500 text-white px-4 py-2 rounded-lg inline-block font-semibold">
                🔥 {descuento}% de descuento aplicado
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            {/* Categoría */}
            <div className="text-blue-600 font-medium uppercase tracking-wide text-sm">
              {producto.category}
            </div>

            {/* Título */}
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
              {producto.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(producto.rating?.rate || 4.5)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="font-medium text-gray-900">
                  {producto.rating?.rate || 4.5}
                </span>
              </div>
              <span className="text-gray-600">
                ({producto.rating?.count || 0} reseñas)
              </span>
            </div>

            {/* Precio */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-gray-900">
                  ${descuento > 0 ? precioConDescuento(producto.price) : producto.price.toFixed(2)}
                </span>
                {descuento > 0 && (
                  <span className="text-2xl text-gray-500 line-through">
                    ${producto.price.toFixed(2)}
                  </span>
                )}
              </div>
              {descuento > 0 && (
                <div className="text-green-600 font-medium">
                  ¡Ahorras ${(producto.price - precioConDescuento(producto.price)).toFixed(2)}!
                </div>
              )}
            </div>

            {/* Descripción */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Descripción</h3>
              <p className="text-gray-700 leading-relaxed">
                {verMas ? producto.description : descripcionCorta}
              </p>
              {producto.description.length > 150 && (
                <button
                  onClick={() => setVerMas(!verMas)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {verMas ? "Ver menos" : "Ver más"}
                </button>
              )}
            </div>

            {/* Cantidad */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Cantidad</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <span className="w-16 text-center font-medium text-lg">{cantidad}</span>
                <button
                  onClick={() => setCantidad(cantidad + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Acciones */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    for(let i = 0; i < cantidad; i++) {
                      agregarAlCarrito({
                        id: producto.id,
                        title: producto.title,
                        price: descuento > 0 
                          ? parseFloat(precioConDescuento(producto.price))
                          : producto.price,
                        image: producto.image,
                        category: producto.category
                      });
                    }
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-lg"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Agregar al Carrito
                </button>

                <button className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>

                <button className="p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                  <Share2 className="h-5 w-5 text-gray-600" />
                </button>
              </div>

              <button
                onClick={manejarWhatsApp}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-xl font-semibold transition-colors text-lg"
              >
                💬 Comprar por WhatsApp
              </button>
            </div>

            {/* Información adicional */}
            <div className="bg-gray-100 rounded-xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Envío gratis</span>
                <span className="font-medium text-gray-900">En compras +$50</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Garantía</span>
                <span className="font-medium text-gray-900">2 años</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Entrega</span>
                <span className="font-medium text-gray-900">2-5 días hábiles</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detalles;