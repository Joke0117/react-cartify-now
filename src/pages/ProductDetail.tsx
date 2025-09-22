import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Heart, Share2, ShoppingCart, Plus, Minus, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStore } from '@/lib/store';
import { toast } from '@/hooks/use-toast';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  
  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
          <Button onClick={() => navigate('/shop')}>Volver a la tienda</Button>
        </Card>
      </div>
    );
  }

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: 'Producto agregado',
      description: `${quantity}x ${product.name} agregado al carrito`,
    });
  };

  const handleWhatsAppPurchase = () => {
    const message = `Hola! Me interesa comprar: ${product.name} - Precio: $${product.price.toLocaleString()} - Cantidad: ${quantity}`;
    const phoneNumber = '1234567890'; // Reemplazar con el número real
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Inicio</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary">Tienda</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* Back Button */}
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-card">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <p className="text-muted-foreground mb-2">{product.brand}</p>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviews} reseñas)</span>
              </div>

              {/* Badges */}
              <div className="flex gap-2 mb-6">
                {product.onSale && discountPercentage > 0 && (
                  <Badge className="bg-offer-gradient text-white">
                    -{discountPercentage}% OFF
                  </Badge>
                )}
                {product.featured && (
                  <Badge variant="secondary">Destacado</Badge>
                )}
                {product.stock < 5 && product.stock > 0 && (
                  <Badge variant="destructive">¡Últimas {product.stock} unidades!</Badge>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold bg-price-gradient bg-clip-text text-transparent">
                  ${product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {product.originalPrice && (
                <p className="text-success font-medium">
                  Ahorras ${(product.originalPrice - product.price).toLocaleString()}
                </p>
              )}
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Descripción</h3>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <Separator />

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                product.stock > 10 ? 'bg-success' : 
                product.stock > 0 ? 'bg-warning' : 'bg-destructive'
              }`} />
              <span className="font-medium">
                {product.stock > 10 ? 'En stock' : 
                 product.stock > 0 ? `Solo quedan ${product.stock}` : 'Agotado'}
              </span>
            </div>

            {/* Quantity and Actions */}
            {product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium">Cantidad:</span>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Agregar al Carrito
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white border-green-500"
                    onClick={handleWhatsAppPurchase}
                  >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Comprar por WhatsApp
                  </Button>
                </div>
              </div>
            )}

            {/* Secondary Actions */}
            <div className="flex gap-4">
              <Button variant="outline" size="sm">
                <Heart className="mr-2 h-4 w-4" />
                Agregar a favoritos
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Compartir
              </Button>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="specs" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="specs">Especificaciones</TabsTrigger>
              <TabsTrigger value="reviews">Reseñas</TabsTrigger>
              <TabsTrigger value="shipping">Envío y Devoluciones</TabsTrigger>
            </TabsList>
            
            <TabsContent value="specs" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Especificaciones Técnicas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Marca:</span>
                        <span className="font-medium">{product.brand}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Categoría:</span>
                        <span className="font-medium">{product.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Calificación:</span>
                        <span className="font-medium">{product.rating}/5</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Reseñas de Clientes</h3>
                  <p className="text-muted-foreground">
                    Este producto tiene {product.reviews} reseñas con una calificación promedio de {product.rating}/5.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="shipping" className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">Información de Envío</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Envío Gratuito</h4>
                      <p className="text-muted-foreground">En compras mayores a $50. Tiempo de entrega: 2-5 días hábiles.</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Devoluciones</h4>
                      <p className="text-muted-foreground">30 días para devoluciones gratuitas. El producto debe estar en su empaque original.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Productos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} to={`/product/${relatedProduct.id}`}>
                  <Card className="group cursor-pointer">
                    <CardContent className="p-4">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full aspect-square object-cover rounded-lg mb-4 group-hover:scale-105 transition-transform"
                      />
                      <h3 className="font-medium mb-2 group-hover:text-primary transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-xl font-bold text-primary">
                        ${relatedProduct.price.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};