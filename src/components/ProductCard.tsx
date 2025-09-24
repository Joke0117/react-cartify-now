import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product, useStore } from '@/lib/store';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: 'Producto agregado',
      description: `${product.name} se agregó al carrito`,
    });
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-product hover:-translate-y-1 bg-card-gradient">
      <div className="relative aspect-square overflow-hidden">
        <Link to={`/product/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.onSale && discountPercentage > 0 && (
            <Badge className="bg-offer-gradient text-white font-semibold">
              -{discountPercentage}%
            </Badge>
          )}
          {product.featured && (
            <Badge variant="secondary" className="font-semibold">
              Destacado
            </Badge>
          )}
          {product.stock < 5 && (
            <Badge variant="destructive" className="font-semibold">
              ¡Últimas unidades!
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="icon" variant="secondary" className="h-8 w-8">
            <Heart className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="secondary" className="h-8 w-8" asChild>
            <Link to={`/product/${product.id}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Stock indicator */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg font-bold">
              Agotado
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="mb-2">
          <p className="text-sm text-muted-foreground">{product.brand}</p>
          <Link to={`/product/${product.id}`}>
            <h3 className="font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            ({product.reviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold bg-price-gradient bg-clip-text text-transparent">
            ${product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full transition-transform hover:scale-105"
          size="sm"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {product.stock === 0 ? 'Agotado' : 'Agregar al carrito'}
        </Button>
      </CardContent>
    </Card>
  );
};