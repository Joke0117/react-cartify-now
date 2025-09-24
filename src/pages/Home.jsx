import { ArrowRight, Truck, Shield, CreditCard, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/ProductCard';
import { useStore } from '@/lib/store';
import { Link } from 'react-router-dom';
import heroBanner from '@/assets/hero-banner.jpg';

export const Home = () => {
  const { products } = useStore();
  
  const featuredProducts = products.filter(p => p.featured).slice(0, 3);
  const onSaleProducts = products.filter(p => p.onSale).slice(0, 4);

  const categories = [
    { name: 'Smartphones', count: products.filter(p => p.category === 'Smartphones').length },
    { name: 'Laptops', count: products.filter(p => p.category === 'Laptops').length },
    { name: 'Accesorios', count: products.filter(p => p.category === 'Accesorios').length },
  ];

  const features = [
    { icon: Truck, title: 'Envío Gratis', description: 'En compras mayores a $50' },
    { icon: Shield, title: 'Garantía', description: '2 años en todos los productos' },
    { icon: CreditCard, title: 'Pagos Seguros', description: 'Múltiples formas de pago' },
    { icon: Star, title: 'Soporte 24/7', description: 'Atención al cliente siempre' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBanner})` }}
        />
        <div className="absolute inset-0 bg-hero-gradient/80" />
        
        <div className="relative container px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              La Tecnología 
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Que Necesitas
              </span>
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Descubre los últimos productos tecnológicos con los mejores precios 
              y envío gratis. Calidad garantizada.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
                <Link to="/shop">
                  Explorar Tienda
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary">
                Ver Ofertas
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-secondary/30">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-card bg-card-gradient">
                <CardContent className="pt-8 pb-6">
                  <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Explora por Categorías
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link key={index} to={`/shop?category=${category.name}`}>
                <Card className="group cursor-pointer transition-all duration-300 hover:shadow-product hover:-translate-y-2 bg-card-gradient">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {category.count} productos disponibles
                    </p>
                    <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Ver Productos
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Productos Destacados</h2>
            <p className="text-xl text-muted-foreground">
              Los productos más populares seleccionados especialmente para ti
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link to="/shop">
                Ver Todos los Productos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* On Sale Products */}
      <section className="py-16">
        <div className="container px-4">
          <div className="text-center mb-12">
            <Badge className="text-lg px-4 py-2 mb-4 bg-offer-gradient">
              🔥 OFERTAS ESPECIALES
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Productos en Oferta</h2>
            <p className="text-xl text-muted-foreground">
              Aprovecha estos descuentos por tiempo limitado
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {onSaleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-hero-gradient">
        <div className="container px-4 text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h2 className="text-3xl font-bold mb-4">
              Mantente al Día con las Últimas Ofertas
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Suscríbete a nuestro newsletter y recibe descuentos exclusivos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Tu email"
                className="flex-1 px-4 py-3 rounded-lg border-0 text-gray-900"
              />
              <Button size="lg" variant="secondary" className="px-8">
                Suscribirse
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};