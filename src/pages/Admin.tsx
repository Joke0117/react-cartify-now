import { useState } from 'react';
import { Plus, Edit, Trash2, Package, Users, ShoppingCart, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useStore, Product } from '@/lib/store';
import { toast } from '@/hooks/use-toast';

export const Admin = () => {
  const { products, addProduct, updateProduct, deleteProduct, cart, getCartTotal } = useStore();
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    originalPrice: '',
    description: '',
    category: '',
    brand: '',
    stock: '',
    image: '',
  });

  const categories = ['Smartphones', 'Laptops', 'Accesorios'];
  const totalProducts = products.length;
  const totalRevenue = getCartTotal();
  const lowStockProducts = products.filter(p => p.stock < 5).length;

  const resetForm = () => {
    setProductForm({
      name: '',
      price: '',
      originalPrice: '',
      description: '',
      category: '',
      brand: '',
      stock: '',
      image: '',
    });
    setIsEditMode(false);
    setEditingProduct(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const productData: Omit<Product, 'id' | 'rating' | 'reviews' | 'featured' | 'onSale'> = {
      name: productForm.name,
      price: parseFloat(productForm.price),
      originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : undefined,
      description: productForm.description,
      category: productForm.category,
      brand: productForm.brand,
      stock: parseInt(productForm.stock),
      image: productForm.image || '/placeholder.svg',
    };

    if (isEditMode && editingProduct) {
      updateProduct(editingProduct.id, {
        ...productData,
        rating: editingProduct.rating,
        reviews: editingProduct.reviews,
        featured: editingProduct.featured,
        onSale: editingProduct.onSale,
      });
      toast({
        title: 'Producto actualizado',
        description: 'El producto se actualizó correctamente',
      });
    } else {
      const newProduct: Product = {
        ...productData,
        id: Date.now().toString(),
        rating: 4.5,
        reviews: 0,
        featured: false,
        onSale: productData.originalPrice ? productData.price < productData.originalPrice : false,
      };
      addProduct(newProduct);
      toast({
        title: 'Producto agregado',
        description: 'El producto se agregó correctamente',
      });
    }

    resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice?.toString() || '',
      description: product.description,
      category: product.category,
      brand: product.brand,
      stock: product.stock.toString(),
      image: product.image,
    });
    setIsEditMode(true);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
    toast({
      title: 'Producto eliminado',
      description: 'El producto se eliminó correctamente',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Panel de Administración</h1>
          <p className="text-xl text-muted-foreground">
            Gestiona tu tienda desde aquí
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Productos</p>
                  <p className="text-3xl font-bold">{totalProducts}</p>
                </div>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Productos con Poco Stock</p>
                  <p className="text-3xl font-bold text-warning">{lowStockProducts}</p>
                </div>
                <Package className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Carritos Activos</p>
                  <p className="text-3xl font-bold">{cart.length > 0 ? 1 : 0}</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Valor en Carrito</p>
                  <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="orders">Pedidos</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="mt-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Gestión de Productos</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar Producto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {isEditMode ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                    </DialogTitle>
                  </DialogHeader>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Nombre</label>
                        <Input
                          value={productForm.name}
                          onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Marca</label>
                        <Input
                          value={productForm.brand}
                          onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Precio</label>
                        <Input
                          type="number"
                          value={productForm.price}
                          onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Precio Original (opcional)</label>
                        <Input
                          type="number"
                          value={productForm.originalPrice}
                          onChange={(e) => setProductForm({...productForm, originalPrice: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Categoría</label>
                        <Select 
                          value={productForm.category} 
                          onValueChange={(value) => setProductForm({...productForm, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Stock</label>
                        <Input
                          type="number"
                          value={productForm.stock}
                          onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">URL de Imagen</label>
                      <Input
                        value={productForm.image}
                        onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                        placeholder="/placeholder.svg"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Descripción</label>
                      <Textarea
                        value={productForm.description}
                        onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                        rows={3}
                        required
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="flex-1">
                        {isEditMode ? 'Actualizar' : 'Agregar'} Producto
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-sm text-muted-foreground">{product.brand}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">${product.price.toLocaleString()}</p>
                            {product.originalPrice && (
                              <p className="text-sm text-muted-foreground line-through">
                                ${product.originalPrice.toLocaleString()}
                              </p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={product.stock > 10 ? 'default' : 
                                   product.stock > 0 ? 'secondary' : 'destructive'}
                          >
                            {product.stock} unidades
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {product.featured && <Badge variant="secondary">Destacado</Badge>}
                            {product.onSale && <Badge className="bg-offer-gradient">En Oferta</Badge>}
                            {!product.featured && !product.onSale && <span className="text-muted-foreground">-</span>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Editar Producto</DialogTitle>
                                </DialogHeader>
                                
                                <form onSubmit={handleSubmit} className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium mb-2 block">Nombre</label>
                                      <Input
                                        value={productForm.name}
                                        onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium mb-2 block">Marca</label>
                                      <Input
                                        value={productForm.brand}
                                        onChange={(e) => setProductForm({...productForm, brand: e.target.value})}
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium mb-2 block">Precio</label>
                                      <Input
                                        type="number"
                                        value={productForm.price}
                                        onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                                        required
                                      />
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium mb-2 block">Precio Original (opcional)</label>
                                      <Input
                                        type="number"
                                        value={productForm.originalPrice}
                                        onChange={(e) => setProductForm({...productForm, originalPrice: e.target.value})}
                                      />
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium mb-2 block">Categoría</label>
                                      <Select 
                                        value={productForm.category} 
                                        onValueChange={(value) => setProductForm({...productForm, category: value})}
                                      >
                                        <SelectTrigger>
                                          <SelectValue placeholder="Seleccionar categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {categories.map((category) => (
                                            <SelectItem key={category} value={category}>
                                              {category}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium mb-2 block">Stock</label>
                                      <Input
                                        type="number"
                                        value={productForm.stock}
                                        onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                                        required
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium mb-2 block">URL de Imagen</label>
                                    <Input
                                      value={productForm.image}
                                      onChange={(e) => setProductForm({...productForm, image: e.target.value})}
                                      placeholder="/placeholder.svg"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium mb-2 block">Descripción</label>
                                    <Textarea
                                      value={productForm.description}
                                      onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                                      rows={3}
                                      required
                                    />
                                  </div>
                                  <div className="flex gap-2 pt-4">
                                    <Button type="submit" className="flex-1">
                                      Actualizar Producto
                                    </Button>
                                  </div>
                                </form>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(product.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Pedidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Sistema de Pedidos</h3>
                  <p className="text-muted-foreground mb-4">
                    Para gestionar pedidos reales, conecta tu base de datos con Supabase.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Los pedidos actuales se procesan a través de WhatsApp.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Productos por Categoría</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.map((category) => {
                      const count = products.filter(p => p.category === category).length;
                      const percentage = (count / totalProducts) * 100;
                      return (
                        <div key={category}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{category}</span>
                            <span className="text-sm text-muted-foreground">{count} productos</span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Estado del Inventario</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Productos en stock alto (&gt;10)</span>
                      <Badge>{products.filter(p => p.stock > 10).length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Productos con stock bajo (1-5)</span>
                      <Badge variant="secondary">{products.filter(p => p.stock >= 1 && p.stock <= 5).length}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Productos agotados</span>
                      <Badge variant="destructive">{products.filter(p => p.stock === 0).length}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};