import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/CarritoContext';
import { useDescuento } from '../context/DescuentoContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';

const Carrito = () => {
  const { 
    carrito, 
    eliminarDelCarrito, 
    actualizarCantidad, 
    vaciarCarrito, 
    obtenerTotal, 
    obtenerCantidadTotal 
  } = useCarrito();
  const { descuento } = useDescuento();
  
  const [codigoCupon, setCodigoCupon] = useState('');
  const [cuponAplicado, setCuponAplicado] = useState(null);

  const cupones = {
    'BIENVENIDO': { descuento: 10, minimo: 0 },
    'TECH20': { descuento: 20, minimo: 100 },
    'REGALO50': { descuento: 50, minimo: 200 }
  };

  const aplicarCupon = () => {
    const cupon = cupones[codigoCupon.toUpperCase()];
    if (cupon && obtenerTotal() >= cupon.minimo) {
      setCuponAplicado(cupon);
      // Toast success
      mostrarToast(`¡Cupón aplicado! ${cupon.descuento}% de descuento`, 'success');
    } else if (cupon) {
      mostrarToast(`Compra mínima de $${cupon.minimo} requerida`, 'error');
    } else {
      mostrarToast('Cupón inválido', 'error');
    }
    setCodigoCupon('');
  };

  const mostrarToast = (mensaje, tipo) => {
    const toastEl = document.createElement('div');
    const bgColor = tipo === 'success' ? 'bg-green-500' : 'bg-red-500';
    toastEl.className = `fixed top-4 right-4 ${bgColor} text-white p-4 rounded-lg shadow-lg z-50 transform transition-transform`;
    toastEl.textContent = mensaje;
    document.body.appendChild(toastEl);
    
    setTimeout(() => {
      toastEl.style.transform = 'translateX(100%)';
      setTimeout(() => document.body.removeChild(toastEl), 300);
    }, 3000);
  };

  const calcularDescuentoCupon = (total) => {
    if (!cuponAplicado) return 0;
    return (total * cuponAplicado.descuento) / 100;
  };

  const manejarWhatsAppCheckout = () => {
    const total = obtenerTotal();
    const descuentoCupon = calcularDescuentoCupon(total);
    const totalFinal = total - descuentoCupon;

    const productos = carrito.map(item => 
      `• ${item.title} (x${item.cantidad}) - $${(item.price * item.cantidad).toFixed(2)}`
    ).join('\n');

    const mensaje = `¡Hola! Quiero realizar esta compra:

🛒 *PRODUCTOS:*
${productos}

💰 *RESUMEN:*
Subtotal: $${total.toFixed(2)}
${descuento > 0 ? `Descuento general: -${descuento}%` : ''}
${cuponAplicado ? `Cupón ${cuponAplicado.descuento}%: -$${descuentoCupon.toFixed(2)}` : ''}
*TOTAL: $${totalFinal.toFixed(2)}*

¿Podrían confirmar la disponibilidad y proceder con el pedido?`;

    const numeroWhatsApp = "1234567890"; // Cambiar por el número real
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  if (carrito.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-24 w-24 text-gray-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h2>
          <p className="text-gray-600 mb-8">¡Agrega algunos productos increíbles!</p>
          <Link
            to="/producto"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold transition-colors text-lg"
          >
            <ArrowLeft className="h-5 w-5" />
            Continuar Comprando
          </Link>
        </div>
      </div>
    );
  }

  const total = obtenerTotal();
  const descuentoCupon = calcularDescuentoCupon(total);
  const totalFinal = total - descuentoCupon;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Carrito de Compras</h1>
            <p className="text-gray-600 mt-1">
              {obtenerCantidadTotal()} {obtenerCantidadTotal() === 1 ? 'producto' : 'productos'} en tu carrito
            </p>
          </div>
          <Link
            to="/producto"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Continuar comprando
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Productos */}
          <div className="lg:col-span-2 space-y-4">
            {carrito.map((item) => (
              <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-contain bg-gray-50 rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm capitalize">{item.category}</p>
                    <p className="text-lg font-bold text-gray-900 mt-2">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                      className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{item.cantidad}</span>
                    <button
                      onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                      className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-900">
                      ${(item.price * item.cantidad).toFixed(2)}
                    </p>
                    <button
                      onClick={() => eliminarDelCarrito(item.id)}
                      className="text-red-500 hover:text-red-700 mt-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Limpiar carrito */}
            <button
              onClick={vaciarCarrito}
              className="text-red-600 hover:text-red-700 font-medium"
            >
              Vaciar carrito
            </button>
          </div>

          {/* Resumen */}
          <div className="space-y-6">
            {/* Cupón */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Código de Descuento</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ingresa tu cupón"
                  value={codigoCupon}
                  onChange={(e) => setCodigoCupon(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={aplicarCupon}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Aplicar
                </button>
              </div>
              
              {cuponAplicado && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm font-medium">
                    ✅ Cupón aplicado: {cuponAplicado.descuento}% de descuento
                  </p>
                </div>
              )}

              <div className="mt-4 text-sm text-gray-600">
                <p className="font-medium mb-2">Cupones disponibles:</p>
                <ul className="space-y-1">
                  <li>• BIENVENIDO - 10% de descuento</li>
                  <li>• TECH20 - 20% (compra mín. $100)</li>
                  <li>• REGALO50 - 50% (compra mín. $200)</li>
                </ul>
              </div>
            </div>

            {/* Resumen del pedido */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Pedido</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                
                {descuento > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento general ({descuento}%)</span>
                    <span>Aplicado a productos</span>
                  </div>
                )}
                
                {cuponAplicado && (
                  <div className="flex justify-between text-green-600">
                    <span>Cupón ({cuponAplicado.descuento}%)</span>
                    <span>-${descuentoCupon.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Envío</span>
                  <span className="font-medium text-green-600">Gratis</span>
                </div>
                
                <hr className="my-4" />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${totalFinal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={manejarWhatsAppCheckout}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-6 rounded-xl font-semibold transition-colors text-lg mt-6"
              >
                💬 Finalizar Compra por WhatsApp
              </button>

              <div className="mt-4 text-center text-sm text-gray-600">
                <p>🔒 Compra 100% segura</p>
                <p>📱 Te contactaremos por WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrito;