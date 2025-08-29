import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import Header from "@/components/Header";
import CartSidebar from "@/components/CartSidebar";
import Footer from "@/components/Footer";
import Index from "@/pages/Index";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Collections from "@/pages/Collections";
import About from "@/pages/About";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import Wishlist from "@/pages/Wishlist";
import Contact from "@/pages/Contact";
import CheckoutInfo from "@/pages/CheckoutInfo";
import OrderSummary from "@/pages/OrderSummary";
import Invoice from "@/pages/Invoice";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/collections" element={<Collections />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/checkout-info" element={<CheckoutInfo />} />
                    <Route path="/order-summary" element={<OrderSummary />} />
                    <Route path="/invoice" element={<Invoice />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
                <CartSidebar />
              </div>
            </BrowserRouter>
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
