import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import Producto from './pages/Producto';
import Contacto from './pages/Contacto';
import Detalles from './pages/Detalles';
import Home from './pages/Home';
import Carrito from './pages/Carrito';
import NotFound from './pages/NotFound';
import { DescuentoProvider } from './context/DescuentoContext';
import { CarritoProvider } from './context/CarritoContext';

function App() {
  return (
    <DescuentoProvider>
      <CarritoProvider>
        <Router>
          <AppContent />
        </Router>
      </CarritoProvider>
    </DescuentoProvider>
  );
}

const AppContent = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1">
      <Routes>
        <Route path="/producto/:id" element={<Detalles />} />
        <Route path="/" element={<Home />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/producto" element={<Producto />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
    <Footer />
  </div>
);

export default App;