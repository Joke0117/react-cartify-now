import { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, MessageCircle, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/lib/store';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

export const Cart = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    getCartTotal,
    getCartCount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getDiscountAmount,
    getFinalTotal
  } = useStore();
  
  const [couponCode, setCouponCode] = useState('');

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      toast({
        title: 'Producto eliminado',
        description: 'El producto fue eliminado del carrito',
      });
    } else {
      updateCartQuantity(productId, newQuantity);
    }
  };

  const handleApplyCoupon = () => {
    if (applyCoupon(couponCode)) {
      toast({
        title: 'Cupón aplicado',
        description: `Cupón "${couponCode}" aplicado correctamente`,
      });
      setCouponCode('');
    } else {
      toast({
        title: 'Cupón inválido',
        description: 'El cupón ingresado no es válido o no cumple los requisitos',
        variant: 'destructive',
      });
    }
  };

  const handleWhatsAppCheckout = () => {
    const cartItems = cart.map(item => 
      `${item.name} (${item.quantity}x) - $${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');
    
    const discountText = appliedCoupon ? `\nDescuento (${appliedCoupon.code}): -$${getDiscountAmount().toLocaleString()}` : '';
    const message = `Hola! Quiero realizar esta compra:\n\n${cartItems}\n\nSubtotal: $${getCartTotal().toLocaleString()}${discountText}\nTotal: $${getFinalTotal().toLocaleString()}`;
    
    const phoneNumber = '1234567890'; // Reemplazar con el número real
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container px-4 py-16">
          <Card className="max-w-md mx-auto text-center p-8">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
            <p className="text-muted-foreground mb-6">
              Agrega algunos productos para comenzar tu compra
            </p>
            <Button size="lg" asChild>
              <Link to="/shop">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Ir a la Tienda
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const subtotal = getCartTotal();
  const discount = getDiscountAmount();
  const total = getFinalTotal();

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Carrito de Compras</h1>
          <p className="text-xl text-muted-foreground">
            {getCartCount()} {getCartCount() === 1 ? 'producto' : 'productos'} en tu carrito
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product Image */}
                    <div className="w-full sm:w-32 aspect-square rounded-lg overflow-hidden bg-muted">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-muted-foreground">{item.brand}</p>
                          {item.onSale && (
                            <Badge className="mt-1 bg-offer-gradient">En Oferta</Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Cantidad:</span>
                          <div className="flex items-center border rounded-lg">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="h-8 w-8"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="px-3 py-1 font-medium">{item.quantity}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                              className="h-8 w-8"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">
                            ${(item.price * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ${item.price.toLocaleString()} c/u
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Clear Cart */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  clearCart();
                  toast({
                    title: 'Carrito vaciado',
                    description: 'Todos los productos fueron eliminados del carrito',
                  });
                }}
              >
                Vaciar Carrito
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Coupon */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Cupón de Descuento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                    <div>
                      <p className="font-medium text-success">
                        Cupón "{appliedCoupon.code}" aplicado
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Descuento: {appliedCoupon.type === 'percentage' 
                          ? `${appliedCoupon.discount}%` 
                          : `$${appliedCoupon.discount}`}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeCoupon}
                    >
                      Quitar
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Código de cupón"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    />
                    <Button onClick={handleApplyCoupon} disabled={!couponCode}>
                      Aplicar
                    </Button>
                  </div>
                )}
                
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">Cupones disponibles:</p>
                  <ul className="space-y-1">
                    <li>• BIENVENIDO - 10% de descuento</li>
                    <li>• TECH20 - 20% en compras +$100</li>
                    <li>• REGALO50 - $50 en compras +$200</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toLocaleString()}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Descuento:</span>
                      <span>-${discount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-muted-foreground">
                    <span>Envío:</span>
                    <span>{subtotal >= 50 ? 'Gratis' : '$10'}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span className="bg-price-gradient bg-clip-text text-transparent">
                    ${(total + (subtotal >= 50 ? 0 : 10)).toLocaleString()}
                  </span>
                </div>

                {subtotal < 50 && (
                  <p className="text-sm text-muted-foreground">
                    Agrega ${(50 - subtotal).toLocaleString()} más para envío gratis
                  </p>
                )}

                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                    onClick={handleWhatsAppCheckout}
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Finalizar Compra por WhatsApp
                  </Button>
                  
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full"
                    asChild
                  >
                    <Link to="/shop">
                      Continuar Comprando
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};