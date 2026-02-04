import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogOut, User, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCartItems } from "@/hooks/useEcommerce";
import { authService } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { CartModal } from "@/components/CartModal";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about" },
  { label: "Teas", href: "#products" },
  { label: "Process", href: "#process" },
  { label: "Orders", href: "/orders" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const { user, userProfile, loading } = useAuth();
  const { data: cartItems = [] } = useCartItems(user?.id || '');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    setIsMobileMenuOpen(false);
    if (href === "#") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLogout = async () => {
    try {
      await authService.signout();
      setIsUserMenuOpen(false);
      navigate("/");
      toast({ title: "Logged out successfully" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "bg-tea-forest/95 backdrop-blur-md shadow-lg" 
            : "bg-tea-forest/80 backdrop-blur-sm shadow-md"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              className="font-serif text-xl md:text-2xl font-bold text-tea-cream flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Link to="/" className="flex items-center gap-2">
                FOODISTICS <span className="text-tea-gold text-sm font-normal">× Swach Tea</span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => 
                link.href.startsWith('/') || link.href === '/' ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-tea-cream/80 hover:text-tea-gold transition-colors text-sm font-medium tracking-wide"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                    }}
                    className="text-tea-cream/80 hover:text-tea-gold transition-colors text-sm font-medium tracking-wide"
                  >
                    {link.label}
                  </a>
                )
              )}
              <Link to="/shop">
                <Button 
                  variant="gold-outline" 
                  size="sm"
                >
                  Shop
                </Button>
              </Link>

              {/* Auth Section */}
              <div className="flex items-center gap-3 border-l border-tea-cream/20 pl-8">
                {loading ? (
                  <div className="w-4 h-4 animate-spin rounded-full border-2 border-tea-gold border-t-transparent"></div>
                ) : user ? (
                  <>
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-tea-cream hover:text-tea-gold relative"
                        onClick={() => setIsCartModalOpen(true)}
                      >
                        <ShoppingCart size={20} />
                        {cartItems.length > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                            {cartItems.length}
                          </span>
                        )}
                      </Button>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="flex items-center gap-2 text-tea-cream hover:text-tea-gold transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-tea-gold/20 flex items-center justify-center">
                          <User size={18} />
                        </div>
                        <span className="text-sm font-medium">
                          {userProfile?.full_name || user?.email?.split("@")[0] || "User"}
                        </span>
                      </button>

                      {/* User Menu Dropdown */}
                      <AnimatePresence>
                        {isUserMenuOpen && (
                          <motion.div
                            className="absolute right-0 mt-2 w-48 bg-tea-forest/95 backdrop-blur-md rounded-lg shadow-lg border border-tea-cream/10 overflow-hidden"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <Link
                              to="/account"
                              className="block px-4 py-3 text-tea-cream hover:bg-tea-gold/10 transition-colors text-sm"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <div className="flex items-center gap-2">
                                <User size={16} />
                                My Account
                              </div>
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="w-full text-left px-4 py-3 text-tea-cream hover:bg-red-500/10 transition-colors text-sm border-t border-tea-cream/10"
                            >
                              <div className="flex items-center gap-2">
                                <LogOut size={16} />
                                Logout
                              </div>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                ) : (
                  <>
                    <Link to="/auth/signin">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-tea-cream hover:text-tea-gold"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/auth/signup">
                      <Button
                        variant="gold-outline"
                        size="sm"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Admin Button - Only for Admins */}
              {user && userProfile?.is_admin && (
                <Link to="/admin">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-tea-gold hover:text-tea-gold"
                  >
                    Admin
                  </Button>
                </Link>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-tea-cream p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Golden Divider Strip */}
        <div className="h-1 bg-gradient-to-r from-tea-gold/50 via-tea-gold to-tea-gold/50" />
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-tea-dark/95 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.nav
              className="absolute top-20 left-0 right-0 p-6 flex flex-col gap-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ delay: 0.1 }}
            >
              {navLinks.map((link, index) => 
                link.href.startsWith('/') || link.href === '/' ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-tea-cream text-2xl font-serif font-medium py-3 border-b border-tea-cream/10"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(link.href);
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-tea-cream text-2xl font-serif font-medium py-3 border-b border-tea-cream/10"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    {link.label}
                  </motion.a>
                )
              )}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-4 space-y-3"
              >
                <Link to="/shop" className="block">
                  <Button 
                    variant="gold" 
                    size="lg" 
                    className="w-full"
                  >
                    Shop
                  </Button>
                </Link>

                {/* Mobile Auth Section */}
                {loading ? (
                  <div className="w-full py-3 text-center">
                    <div className="inline-block w-4 h-4 animate-spin rounded-full border-2 border-tea-gold border-t-transparent"></div>
                  </div>
                ) : user ? (
                  <>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full text-tea-gold hover:text-tea-gold relative"
                      onClick={() => navigate('/checkout')}
                    >
                      <ShoppingCart size={20} className="mr-2" />
                      Cart {cartItems.length > 0 && `(${cartItems.length})`}
                    </Button>
                    <Link to="/account" className="block">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full text-tea-gold hover:text-tea-gold"
                      >
                        <User size={20} className="mr-2" />
                        Account
                      </Button>
                    </Link>
                    
                    {/* Admin Button for Mobile - Only for Admins */}
                    {userProfile?.is_admin && (
                      <Link to="/admin" className="block">
                        <Button 
                          variant="outline" 
                          size="lg" 
                          className="w-full text-tea-gold hover:text-tea-gold"
                        >
                          Admin Dashboard
                        </Button>
                      </Link>
                    )}
                    
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      size="lg"
                      className="w-full text-red-400 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut size={20} className="mr-2" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/auth/signin" className="block">
                      <Button
                        variant="outline"
                        size="lg"
                        className="w-full text-tea-gold hover:text-tea-gold"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/auth/signup" className="block">
                      <Button
                        variant="gold"
                        size="lg"
                        className="w-full"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Modal */}
      <CartModal isOpen={isCartModalOpen} onClose={() => setIsCartModalOpen(false)} />
    </>
  );
};

export default Navbar;
