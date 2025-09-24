import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Import product images
import iphoneImage from '@/assets/iphone-15-pro.jpg';
import macbookImage from '@/assets/macbook-pro.jpg';
import airpodsImage from '@/assets/airpods-pro.jpg';
import galaxyImage from '@/assets/galaxy-s24.jpg';
import dellImage from '@/assets/dell-xps.jpg';
import sonyImage from '@/assets/sony-headphones.jpg';

// Mock coupons
const mockCoupons = [
  { code: 'BIENVENIDO', discount: 10, type: 'percentage', isActive: true },
  { code: 'TECH20', discount: 20, type: 'percentage', minAmount: 100, isActive: true },
  { code: 'REGALO50', discount: 50, type: 'fixed', minAmount: 200, isActive: true },
];

// Mock products
const mockProducts = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    price: 1200,
    originalPrice: 1299,
    description: 'El último iPhone con chip A17 Pro, cámara de 48MP y diseño en titanio.',
    image: iphoneImage,
    category: 'Smartphones',
    brand: 'Apple',
    stock: 15,
    rating: 4.8,
    reviews: 256,
    featured: true,
    onSale: true,
  },
  {
    id: '2',
    name: 'MacBook Pro 14"',
    price: 2200,
    description: 'Laptop profesional con chip M3, 16GB RAM y pantalla Liquid Retina XDR.',
    image: macbookImage,
    category: 'Laptops',
    brand: 'Apple',
    stock: 8,
    rating: 4.9,
    reviews: 180,
    featured: true,
  },
  {
    id: '3',
    name: 'AirPods Pro 2',
    price: 299,
    originalPrice: 349,
    description: 'Auriculares inalámbricos con cancelación activa de ruido.',
    image: airpodsImage,
    category: 'Accesorios',
    brand: 'Apple',
    stock: 25,
    rating: 4.7,
    reviews: 420,
    onSale: true,
  },
  {
    id: '4',
    name: 'Samsung Galaxy S24 Ultra',
    price: 1100,
    description: 'Smartphone premium con S Pen y cámara de 200MP.',
    image: galaxyImage,
    category: 'Smartphones',
    brand: 'Samsung',
    stock: 12,
    rating: 4.6,
    reviews: 312,
  },
  {
    id: '5',
    name: 'Dell XPS 15',
    price: 1800,
    description: 'Laptop ultradelgada con pantalla InfinityEdge 4K.',
    image: dellImage,
    category: 'Laptops',
    brand: 'Dell',
    stock: 6,
    rating: 4.5,
    reviews: 95,
    featured: true,
  },
  {
    id: '6',
    name: 'Sony WH-1000XM5',
    price: 399,
    description: 'Auriculares over-ear con la mejor cancelación de ruido del mercado.',
    image: sonyImage,
    category: 'Accesorios',
    brand: 'Sony',
    stock: 18,
    rating: 4.8,
    reviews: 278,
  },
];

export const useStore = create(
  persist(
    (set, get) => ({
      // Products
      products: mockProducts,
      setProducts: (products) => set({ products }),
      addProduct: (product) =>
        set((state) => ({ products: [...state.products, product] })),
      updateProduct: (id, updatedProduct) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updatedProduct } : p
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      // Cart
      cart: [],
      addToCart: (product, quantity = 1) =>
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === product.id);
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity }] };
        }),
      updateCartQuantity: (productId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        })),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        })),
      clearCart: () => set({ cart: [], appliedCoupon: null }),
      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getCartCount: () => {
        const { cart } = get();
        return cart.reduce((count, item) => count + item.quantity, 0);
      },

      // Coupons
      appliedCoupon: null,
      applyCoupon: (code) => {
        const coupon = mockCoupons.find(
          (c) => c.code.toLowerCase() === code.toLowerCase() && c.isActive
        );
        if (coupon) {
          const total = get().getCartTotal();
          if (coupon.minAmount && total < coupon.minAmount) {
            return false;
          }
          set({ appliedCoupon: coupon });
          return true;
        }
        return false;
      },
      removeCoupon: () => set({ appliedCoupon: null }),
      getDiscountAmount: () => {
        const { appliedCoupon } = get();
        if (!appliedCoupon) return 0;
        const total = get().getCartTotal();
        return appliedCoupon.type === 'percentage'
          ? (total * appliedCoupon.discount) / 100
          : appliedCoupon.discount;
      },
      getFinalTotal: () => {
        const total = get().getCartTotal();
        const discount = get().getDiscountAmount();
        return Math.max(0, total - discount);
      },

      // User
      user: null,
      setUser: (user) => set({ user }),

      // Filters
      selectedCategory: '',
      searchQuery: '',
      priceRange: [0, 3000],
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setPriceRange: (range) => set({ priceRange: range }),
    }),
    {
      name: 'techstore-storage',
      partialize: (state) => ({
        cart: state.cart,
        appliedCoupon: state.appliedCoupon,
        user: state.user,
      }),
    }
  )
);