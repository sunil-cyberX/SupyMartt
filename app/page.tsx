"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingBag,
  Heart,
  Search,
  Trash2,
  Plus,
  Minus,
  ChevronRight,
  Sparkles,
  CheckCircle,
  MapPin,
  X,
  Percent,
  Languages,
  CreditCard,
  Truck,
  ArrowLeft,
  Send,
  Star,
  Info,
  BadgePercent,
  ChevronDown
} from "lucide-react";
import { products, Product } from "@/lib/products";

// Define CartItem and Order structures
interface CartItem {
  product: Product;
  quantity: number;
}

interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  address: typeof initialAddress;
  paymentMethod: string;
  date: string;
  status: string;
}

const initialAddress = {
  name: "",
  phone: "",
  addressLine: "",
  pincode: "",
  city: "",
  state: "",
};

export default function Home() {
  // --- STATE ---
  const [lang, setLang] = useState<"en" | "hi">("en");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(25000);
  const [sortBy, setSortBy] = useState("popular");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Checkout states
  const [checkoutStep, setCheckoutStep] = useState<"browse" | "address" | "payment" | "confirmed">("browse");
  const [shippingAddress, setShippingAddress] = useState(initialAddress);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);

  // Pincode and Coupons
  const [pincodeInput, setPincodeInput] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState<{ text: string; isAvailable: boolean } | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // AI Assistant Chat States
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; role: "user" | "assistant"; content: string; timestamp: Date }>>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- LOCAL STORAGE PERSISTENCE ---
  useEffect(() => {
    // Load data from localStorage
    const savedCart = localStorage.getItem("ab_cart");
    const savedWishlist = localStorage.getItem("ab_wishlist");
    const savedAddress = localStorage.getItem("ab_address");
    const savedOrders = localStorage.getItem("ab_orders");
    const savedLang = localStorage.getItem("ab_lang");

    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    if (savedAddress) setShippingAddress(JSON.parse(savedAddress));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedLang) setLang(savedLang as "en" | "hi");

    // Initialize AI Chat with welcome message
    setChatMessages([
      {
        id: "welcome-msg",
        role: "assistant",
        content: savedLang === "hi" 
          ? "नमस्ते! मैं आपका अपनाबाज़ार एआई सहायक हूँ। 🙏 मैं आपको सबसे बेहतरीन डील्स खोजने और प्रोडक्ट्स का चुनाव करने में मदद कर सकता हूँ। आप मुझसे हिंदी, इंग्लिश या हिंग्लिश में बात कर सकते हैं!"
          : "Namaste! I am your ApnaBazaar AI Assistant. 🙏 I can help you search the catalog, compare items, find details, and recommend the best products. Ask me anything in English, Hindi, or Hinglish!",
        timestamp: new Date()
      }
    ]);
  }, []);

  useEffect(() => {
    localStorage.setItem("ab_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("ab_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("ab_address", JSON.stringify(shippingAddress));
  }, [shippingAddress]);

  useEffect(() => {
    localStorage.setItem("ab_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("ab_lang", lang);
  }, [lang]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isChatLoading]);

  // --- DICTIONARY FOR BILINGUAL SUPPORT ---
  const t = {
    appName: lang === "en" ? "ApnaBazaar" : "अपनाबाज़ार",
    tagline: lang === "en" ? "Aapka Apna Indian Market" : "आपका अपना इंडियन मार्केट",
    searchPlaceholder: lang === "en" ? "Search for mobiles, fashion, electronics..." : "मोबाइल, कपड़े, इलेक्ट्रॉनिक्स आदि खोजें...",
    categories: lang === "en" ? "Categories" : "श्रेणियाँ",
    sortByLabel: lang === "en" ? "Sort By" : "क्रमबद्ध करें",
    all: lang === "en" ? "All Products" : "सभी प्रोडक्ट्स",
    electronics: lang === "en" ? "Electronics" : "इलेक्ट्रॉनिक्स",
    fashion: lang === "en" ? "Fashion" : "फैशन और कपड़े",
    kitchen: lang === "en" ? "Home & Kitchen" : "होम और किचन",
    grocery: lang === "en" ? "Grocery" : "राशन और ग्रोसरी",
    books: lang === "en" ? "Books" : "किताबें",
    cartTitle: lang === "en" ? "Your Shopping Cart" : "आपकी कार्ट",
    wishlistTitle: lang === "en" ? "My Wishlist" : "मेरी विशलिस्ट",
    emptyCart: lang === "en" ? "Your cart is empty!" : "आपकी कार्ट खाली है!",
    emptyWishlist: lang === "en" ? "Your wishlist is empty!" : "आपकी विशलिस्ट खाली है!",
    addToCart: lang === "en" ? "Add to Cart" : "कार्ट में जोड़ें",
    addedToCart: lang === "en" ? "Added to Cart" : "कार्ट में जोड़ा गया",
    buyNow: lang === "en" ? "Buy Now" : "अभी खरीदें",
    originalPrice: lang === "en" ? "Original Price" : "मूल मूल्य",
    discount: lang === "en" ? "Discount" : "छूट",
    deliveryCheck: lang === "en" ? "Delivery & Pincode" : "डिलीवरी और पिनकोड",
    pincodePlaceholder: lang === "en" ? "Enter 6-digit pin code" : "6-अंकीय पिनकोड दर्ज करें",
    checkBtn: lang === "en" ? "Check" : "जांचें",
    applyCoupon: lang === "en" ? "Apply Coupon" : "कूपन लागू करें",
    couponPlaceholder: lang === "en" ? "Enter code (e.g., FESTIVE20)" : "कोड दर्ज करें (जैसे, FESTIVE20)",
    couponBtn: lang === "en" ? "Apply" : "लागू करें",
    orderSummary: lang === "en" ? "Order Summary" : "ऑर्डर सारांश",
    subtotal: lang === "en" ? "Subtotal" : "उपयोग",
    shipping: lang === "en" ? "Delivery Charges" : "डिलीवरी शुल्क",
    totalPrice: lang === "en" ? "Total Amount" : "कुल राशि",
    proceedToCheckout: lang === "en" ? "Proceed to Checkout" : "चेकआउट के लिए आगे बढ़ें",
    shippingAddressTitle: lang === "en" ? "Shipping Address" : "शिपिंग पता",
    fullName: lang === "en" ? "Full Name" : "पूरा नाम",
    phone: lang === "en" ? "Mobile Number" : "मोबाइल नंबर",
    addressLine: lang === "en" ? "House No, Area, Street Name" : "मकान नंबर, इलाका, सड़क का नाम",
    city: lang === "en" ? "City" : "शहर",
    state: lang === "en" ? "State" : "राज्य",
    paymentTitle: lang === "en" ? "Select Payment Method" : "भुगतान का तरीका चुनें",
    cod: lang === "en" ? "Cash on Delivery (COD)" : "कैश ऑन डिलीवरी (COD)",
    upi: lang === "en" ? "UPI (Scan & Pay)" : "UPI (स्कैन और भुगतान)",
    card: lang === "en" ? "Credit / Debit Card" : "क्रेडिट / डेबिट कार्ड",
    paySecurely: lang === "en" ? "Pay & Place Order" : "भुगतान करें और ऑर्डर रखें",
    orderSuccess: lang === "en" ? "Order Placed Successfully!" : "ऑर्डर सफलतापूर्वक रख दिया गया!",
    orderSuccessMsg: lang === "en" ? "Thank you for shopping at ApnaBazaar! Your delivery is being scheduled." : "अपनाबाज़ार में खरीदारी करने के लिए धन्यवाद! आपकी डिलीवरी शेड्यूल की जा रही है।",
    ordersHistory: lang === "en" ? "Order History" : "ऑर्डर इतिहास",
    backToHome: lang === "en" ? "Back to Shopping" : "शॉपिंग पर वापस जाएं",
    aiAssistantTitle: lang === "en" ? "ApnaBazaar AI Sahayak" : "अपनाबाज़ार एआई सहायक",
    aiAssistantSubtitle: lang === "en" ? "Ask me anything - recommendations, comparisons, specs!" : "मुझसे कुछ भी पूछें - डील्स, तुलना, या जानकारी!",
    askAiBtn: lang === "en" ? "Chat with AI Assistant" : "एआई सहायक से बात करें",
    reviews: lang === "en" ? "Customer Reviews" : "ग्राहक समीक्षा",
    specs: lang === "en" ? "Specifications" : "तकनीकी विवरण",
    productDetail: lang === "en" ? "Product Details" : "प्रोडक्ट की जानकारी",
    fastDelivery: lang === "en" ? "Fast Delivery" : "तेज डिलीवरी",
    freeShipping: lang === "en" ? "Free Shipping over ₹499" : "₹499 से ऊपर मुफ्त डिलीवरी",
    features: lang === "en" ? "Key Highlights" : "मुख्य विशेषताएं",
  };

  // --- ACTIONS ---
  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const toggleWishlist = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      return [...prev, productId];
    });
  };

  // Pincode delivery checking simulation
  const handleCheckPincode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincodeInput)) {
      setPincodeStatus({
        text: lang === "en" ? "⚠️ Invalid Pincode! Must be exactly 6 digits." : "⚠️ अमान्य पिनकोड! ठीक 6 अंक होने चाहिए।",
        isAvailable: false,
      });
      return;
    }

    if (pincodeInput.startsWith("11") || pincodeInput.startsWith("12") || pincodeInput.startsWith("13") || pincodeInput.startsWith("20")) {
      setPincodeStatus({
        text: lang === "en" 
          ? "🚀 Fast 1-Day Delivery Available! Delivery by Tomorrow." 
          : "🚀 सुपरफास्ट 1-दिन की डिलीवरी! कल तक पहुंच जाएगा।",
        isAvailable: true,
      });
    } else if (pincodeInput.startsWith("40") || pincodeInput.startsWith("56") || pincodeInput.startsWith("70") || pincodeInput.startsWith("60")) {
      setPincodeStatus({
        text: lang === "en" 
          ? "⚡ 2-Day Express Delivery Available! Delivery by Thursday." 
          : "⚡ 2-दिन की एक्सप्रेस डिलीवरी! परसों तक पहुंच जाएगा।",
        isAvailable: true,
      });
    } else {
      setPincodeStatus({
        text: lang === "en" 
          ? "📦 Standard Home Delivery Available (3-5 Days)." 
          : "📦 मानक होम डिलीवरी उपलब्ध है (3-5 दिन)।",
        isAvailable: true,
      });
    }
  };

  // Coupon application logic
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = couponInput.trim().toUpperCase();
    const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    if (cleanCode === "WELCOME10") {
      setAppliedCoupon("WELCOME10");
      setDiscountAmount(cartSubtotal * 0.1);
      setCouponInput("");
    } else if (cleanCode === "FESTIVE20") {
      setAppliedCoupon("FESTIVE20");
      setDiscountAmount(cartSubtotal * 0.2);
      setCouponInput("");
    } else if (cleanCode === "BUMPER50" && cartSubtotal >= 2000) {
      setAppliedCoupon("BUMPER50");
      setDiscountAmount(cartSubtotal * 0.5);
      setCouponInput("");
    } else if (cleanCode === "BUMPER50" && cartSubtotal < 2000) {
      alert(lang === "en" ? "BUMPER50 requires a minimum order of ₹2,000" : "BUMPER50 के लिए न्यूनतम ₹2,000 का ऑर्डर आवश्यक है");
    } else {
      alert(lang === "en" ? "Invalid Coupon Code!" : "अमान्य कूपन कोड!");
    }
  };

  // Calculate cart prices
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const activeDiscount = appliedCoupon ? discountAmount : 0;
  const shippingFee = cartSubtotal > 499 || cartSubtotal === 0 ? 0 : 49;
  const cartTotal = Math.max(0, cartSubtotal - activeDiscount + shippingFee);

  // Auto-recalculate coupon discount when cart updates
  useEffect(() => {
    if (appliedCoupon === "WELCOME10") {
      setDiscountAmount(cartSubtotal * 0.1);
    } else if (appliedCoupon === "FESTIVE20") {
      setDiscountAmount(cartSubtotal * 0.2);
    } else if (appliedCoupon === "BUMPER50" && cartSubtotal >= 2000) {
      setDiscountAmount(cartSubtotal * 0.5);
    } else {
      setAppliedCoupon(null);
      setDiscountAmount(0);
    }
  }, [cartSubtotal, appliedCoupon]);

  // Place order simulation
  const handlePlaceOrder = () => {
    if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.addressLine || !shippingAddress.pincode) {
      alert(lang === "en" ? "Please fill all required fields in shipping address." : "कृपया शिपिंग पते में सभी आवश्यक फ़ील्ड भरें।");
      return;
    }

    const newOrder: Order = {
      id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      items: [...cart],
      subtotal: cartSubtotal,
      discount: activeDiscount,
      shipping: shippingFee,
      total: cartTotal,
      address: { ...shippingAddress },
      paymentMethod: paymentMethod,
      date: new Date().toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      status: lang === "en" ? "Preparing for dispatch" : "पैकिंग शुरू हो गई है",
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCheckoutStep("confirmed");
  };

  // --- GEMINI AI ASSISTANT CONVERSATION SYSTEM ---
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsgText = chatInput;
    setChatInput("");

    // Append user message
    const userMessage = {
      id: "msg-" + Date.now(),
      role: "user" as const,
      content: userMsgText,
      timestamp: new Date(),
    };
    const updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);
    setIsChatLoading(true);

    try {
      // Call our secure server-side API route
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      const data = await response.json();
      if (response.ok && data.reply) {
        setChatMessages((prev) => [
          ...prev,
          {
            id: "msg-" + Date.now() + "-reply",
            role: "assistant",
            content: data.reply,
            timestamp: new Date(),
          },
        ]);
      } else {
        throw new Error(data.error || "Server responded with an error");
      }
    } catch (err: any) {
      console.error(err);
      setChatMessages((prev) => [
        ...prev,
        {
          id: "msg-err-" + Date.now(),
          role: "assistant",
          content: lang === "hi"
            ? "क्षमा करें, सर्वर से संपर्क करने में असमर्थ। कृपया सुनिश्चित करें कि आपके Secrets में GEMINI_API_KEY सेट है। ⚙️"
            : "Sorry, I am having trouble connecting to the network right now. Please ensure your GEMINI_API_KEY is configured in Settings > Secrets. ⚙️",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Parse message content to extract `[PRODUCT_ID: prod-X]` and strip them from the displayed text
  const parseMessageContent = (content: string) => {
    const regex = /\[PRODUCT_ID:\s*(prod-\d+)\]/gi;
    const matches = [...content.matchAll(regex)];
    const productIds = matches.map((m) => m[1].toLowerCase());
    
    // Clean string by removing the brackets tag
    let cleanedText = content.replace(regex, "");
    
    // Also support markdown bolding conversion simply
    return { cleanedText, productIds };
  };

  // Filter & sort products
  const filteredProducts = products.filter((prod) => {
    const matchesCategory = selectedCategory === "All" || prod.category === selectedCategory;
    const matchesPrice = prod.price <= priceRange;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.nameHindi.includes(searchQuery) ||
      prod.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.descriptionHindi.includes(searchQuery);

    return matchesCategory && matchesPrice && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return b.reviewsCount - a.reviewsCount; // popular
  });

  return (
    <div id="app-root" className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
      
      {/* --- TOP HEADER BANNER (BILINGUAL TOGGLE & ANNOUNCEMENTS) --- */}
      <div id="promo-ticker" className="bg-slate-900 text-white text-xs py-2 px-4 flex justify-between items-center z-10 sticky top-0 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-medium tracking-wide">
            {lang === "en" ? "🎉 FESTIVE BAZAAR LIVE: Use code 'FESTIVE20' for 20% off!" : "🎉 फेस्टिवल बाजार लाइव: 20% छूट के लिए 'FESTIVE20' कोड लगाएं!"}
          </span>
        </div>
        <button
          id="lang-toggle-btn"
          onClick={() => setLang((prev) => (prev === "en" ? "hi" : "en"))}
          className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded border border-slate-700 transition font-medium cursor-pointer"
        >
          <Languages className="w-3.5 h-3.5 text-indigo-400" />
          <span>{lang === "en" ? "हिन्दी" : "English"}</span>
        </button>
      </div>

      {/* --- MAIN HEADER NAV --- */}
      <header id="main-navbar" className="bg-white border-b border-slate-200 sticky top-8 z-20 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo & Search */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div 
              id="app-logo-container" 
              className="flex items-center space-x-2.5 cursor-pointer"
              onClick={() => {
                setCheckoutStep("browse");
                setSelectedCategory("All");
                setSearchQuery("");
              }}
            >
              <div className="bg-indigo-600 text-white p-2 rounded-xl shadow-md flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center">
                  {t.appName}
                  <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded ml-1.5 uppercase border border-indigo-100">
                    India 🇮🇳
                  </span>
                </h1>
                <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{t.tagline}</p>
              </div>
            </div>

            {/* Mobile Actions: Wishlist and Cart Icons */}
            <div className="flex items-center space-x-3 md:hidden">
              <button
                id="mob-wishlist-toggle"
                onClick={() => setIsWishlistOpen(true)}
                className="p-2 text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-lg relative"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </button>
              <button
                id="mob-cart-toggle"
                onClick={() => setIsCartOpen(true)}
                className="p-2 text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-slate-200 rounded-lg relative"
              >
                <ShoppingBag className="w-5 h-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cart.reduce((s, i) => s + i.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar Component */}
          <div className="w-full md:max-w-xl flex-1 relative">
            <div className="relative">
              <input
                id="search-input-field"
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 focus:bg-white text-slate-900 rounded-xl border border-transparent focus:border-indigo-400 outline-none transition text-sm shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  id="search-clear-btn"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation Links / Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              id="wishlist-toggle-desktop"
              onClick={() => setIsWishlistOpen(true)}
              className="flex items-center space-x-2 px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50/50 rounded-xl transition border border-slate-200 hover:border-indigo-200 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>{t.wishlistTitle}</span>
              {wishlist.length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {wishlist.length}
                </span>
              )}
            </button>

            <button
              id="cart-toggle-desktop"
              onClick={() => setIsCartOpen(true)}
              className="flex items-center space-x-2 px-3.5 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-indigo-600 rounded-xl transition shadow-sm cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t.cartTitle}</span>
              <span className="bg-indigo-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </button>

            {orders.length > 0 && (
              <button
                id="orders-toggle-desktop"
                onClick={() => {
                  setCheckoutStep("browse");
                  // Scroll to order history (defined further down)
                  document.getElementById("orders-history-section")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-xs text-indigo-600 font-bold hover:underline"
              >
                {t.ordersHistory} ({orders.length})
              </button>
            )}
          </div>

        </div>
      </header>

      {/* --- HERO SLIDER / MAIN BANNER --- */}
      {checkoutStep === "browse" && !searchQuery && (
        <section id="hero-banner" className="max-w-7xl mx-auto px-4 md:px-6 pt-6">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-700 via-purple-700 to-slate-900 text-white p-8 md:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl z-10 text-center md:text-left">
              <span className="inline-block bg-amber-400 text-slate-950 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full tracking-wider animate-bounce">
                {lang === "en" ? "FESTIVE SELECTION" : "त्योहारों की खास पसंद"}
              </span>
              <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
                {lang === "en" ? "Apne Ghar Layein" : "अपने घर लाएं"}{" "}
                <span className="text-yellow-400 font-serif italic">Khushiyan</span>
              </h2>
              <p className="text-slate-100 text-sm md:text-base max-w-md">
                {lang === "en" 
                  ? "Explore best quality items at unbeatable Indian prices with lightning-fast delivery and expert advice from our AI assistant."
                  : "बेजोड़ भारतीय कीमतों पर सर्वोत्तम गुणवत्ता वाले प्रोडक्ट्स की खोज करें। हमारे एआई असिस्टेंट से लें खरीदारी की सलाह।"}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
                <button
                  id="hero-chat-ai-btn"
                  onClick={() => setIsAiOpen(true)}
                  className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow transition text-sm flex items-center space-x-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-indigo-700 animate-spin" />
                  <span>{lang === "en" ? "Talk to AI Assistant" : "एआई सहायक से पूछें"}</span>
                </button>
                <button
                  id="hero-deals-btn"
                  onClick={() => {
                    setPriceRange(5000);
                    setSelectedCategory("Electronics");
                  }}
                  className="bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-2.5 rounded-xl transition text-sm border border-white/20"
                >
                  {lang === "en" ? "Under ₹5,000 Store" : "₹5,000 के अंदर का स्टोर"}
                </button>
              </div>
            </div>

            {/* Visual Decorative Widget */}
            <div className="relative w-full max-w-[280px] h-[200px] bg-white/5 rounded-2xl border border-white/10 p-4 flex flex-col justify-between overflow-hidden shadow-2xl">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/30 rounded-full blur-2xl"></div>
              <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl"></div>
              
              <div className="flex justify-between items-start z-10">
                <BadgePercent className="w-10 h-10 text-yellow-400" />
                <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded font-bold">ACTIVE</span>
              </div>
              <div className="z-10">
                <p className="text-slate-300 text-xs">{lang === "en" ? "Special Promo Code" : "विशेष कूपन कोड"}</p>
                <h3 className="text-2xl font-black text-white tracking-wider">FESTIVE20</h3>
                <p className="text-yellow-400 text-xs font-semibold mt-1">
                  {lang === "en" ? "Flat 20% Instant Discount!" : "फ्लैट 20% तत्काल छूट!"}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* --- BROWSE / SHOP SECTION --- */}
      <main id="primary-content" className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        
        {checkoutStep === "browse" ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* 1. FILTER CONTROLS SIDEBAR */}
            <aside id="filter-sidebar" className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200 space-y-6 shadow-sm h-fit">
              <div>
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                  <span>{lang === "en" ? "Filters" : "फिल्टर्स"}</span>
                  <button
                    id="reset-filters"
                    onClick={() => {
                      setSelectedCategory("All");
                      setPriceRange(25000);
                      setSortBy("popular");
                      setSearchQuery("");
                    }}
                    className="text-xs text-indigo-600 font-semibold hover:underline"
                  >
                    {lang === "en" ? "Reset All" : "रीसेट करें"}
                  </button>
                </h3>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.categories}</label>
                <div className="flex flex-col space-y-1.5">
                  {["All", "Electronics", "Fashion", "Home & Kitchen", "Books", "Grocery"].map((cat) => (
                    <button
                      id={`cat-filter-${cat.replace(/\s+/g, "-")}`}
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition font-medium flex items-center justify-between ${
                        selectedCategory === cat
                          ? "bg-indigo-50 text-indigo-700 font-semibold"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <span>
                        {cat === "All" && t.all}
                        {cat === "Electronics" && t.electronics}
                        {cat === "Fashion" && t.fashion}
                        {cat === "Home & Kitchen" && t.kitchen}
                        {cat === "Books" && t.books}
                        {cat === "Grocery" && t.grocery}
                      </span>
                      {selectedCategory === cat && <ChevronRight className="w-4 h-4 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <span>{lang === "en" ? "Max Price" : "अधिकतम बजट"}</span>
                  <span className="text-indigo-600 font-mono text-sm">₹{priceRange.toLocaleString("en-IN")}</span>
                </div>
                <input
                  id="price-range-slider"
                  type="range"
                  min="200"
                  max="25000"
                  step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>₹200</span>
                  <span>₹10,000</span>
                  <span>₹25,000+</span>
                </div>
              </div>

              {/* Sorting Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.sortByLabel}</label>
                <select
                  id="sort-by-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm px-3 py-2.5 rounded-xl outline-none border border-transparent focus:border-indigo-400 transition"
                >
                  <option value="popular">{lang === "en" ? "Most Popular" : "लोकप्रियता"}</option>
                  <option value="price-low">{lang === "en" ? "Price: Low to High" : "कीमत: कम से ज्यादा"}</option>
                  <option value="price-high">{lang === "en" ? "Price: High to Low" : "कीमत: ज्यादा से कम"}</option>
                  <option value="rating">{lang === "en" ? "Top Rated" : "सर्वश्रेष्ठ रेटिंग"}</option>
                </select>
              </div>

              {/* Pin Code Delivery Check In Filter Sidebar */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-3">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
                  <Truck className="w-4 h-4 text-indigo-600" />
                  <span>{t.deliveryCheck}</span>
                </div>
                <form id="pincode-form" onSubmit={handleCheckPincode} className="flex gap-1.5">
                  <input
                    id="pincode-sidebar-input"
                    type="text"
                    maxLength={6}
                    placeholder={t.pincodePlaceholder}
                    value={pincodeInput}
                    onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ""))}
                    className="flex-1 bg-white text-xs px-2.5 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500"
                  />
                  <button
                    id="pincode-check-btn"
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-2 rounded-lg font-bold transition cursor-pointer"
                  >
                    {t.checkBtn}
                  </button>
                </form>
                {pincodeStatus && (
                  <p className={`text-[11px] leading-tight font-medium ${pincodeStatus.isAvailable ? "text-emerald-600" : "text-rose-500"}`}>
                    {pincodeStatus.text}
                  </p>
                )}
              </div>

              {/* AI Banner Sidebar */}
              <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 text-white p-4 rounded-xl shadow-md text-center space-y-2">
                <Sparkles className="w-6 h-6 text-yellow-400 mx-auto animate-pulse" />
                <h4 className="text-xs font-bold">{lang === "en" ? "Need Shopping Advice?" : "शॉपिंग में सहायता चाहिए?"}</h4>
                <p className="text-[10px] text-indigo-100">
                  {lang === "en" ? "Ask ApnaBazaar AI Assistant anytime!" : "अपनाबाज़ार एआई सहायक से तुरंत सलाह लें!"}
                </p>
                <button
                  id="sidebar-chat-ai-btn"
                  onClick={() => setIsAiOpen(true)}
                  className="w-full bg-white text-indigo-950 font-bold text-xs py-2 rounded-lg hover:bg-yellow-400 transition cursor-pointer"
                >
                  {t.askAiBtn}
                </button>
              </div>
            </aside>

            {/* 2. PRODUCT LISTING */}
            <section id="products-listing" className="lg:col-span-3 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    {selectedCategory === "All" ? t.all : (lang === "en" ? selectedCategory : sortedProducts[0]?.categoryHindi || selectedCategory)}
                    <span className="text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full font-semibold">
                      {sortedProducts.length} Items
                    </span>
                  </h3>
                </div>
              </div>

              {sortedProducts.length === 0 ? (
                <div id="no-products-view" className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4 shadow-sm">
                  <Info className="w-12 h-12 text-slate-300 mx-auto" />
                  <h4 className="text-lg font-bold text-slate-700">
                    {lang === "en" ? "No products found matching your filters!" : "आपके फिल्टर्स से मेल खाता कोई प्रोडक्ट नहीं मिला!"}
                  </h4>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">
                    {lang === "en" 
                      ? "Try searching for something else or clearing the filters to see ApnaBazaar's entire collection."
                      : "अपनाबाज़ार की पूरी रेंज देखने के लिए दूसरे कीवर्ड खोजें या फिल्टर्स रीसेट करें।"}
                  </p>
                  <button
                    id="no-prod-reset-btn"
                    onClick={() => {
                      setSelectedCategory("All");
                      setPriceRange(25000);
                      setSearchQuery("");
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition cursor-pointer"
                  >
                    {lang === "en" ? "Clear Filters" : "फिल्टर्स हटाएँ"}
                  </button>
                </div>
              ) : (
                <div id="products-grid" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedProducts.map((prod, idx) => {
                    const discountPercent = Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100);
                    const isInWish = wishlist.includes(prod.id);
                    const isInCart = cart.find((item) => item.product.id === prod.id);

                    return (
                      <motion.div
                        id={`product-card-${prod.id}`}
                        key={prod.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: Math.min(idx * 0.05, 0.4) }}
                        onClick={() => setSelectedProduct(prod)}
                        className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col h-full cursor-pointer relative"
                      >
                        {/* Discount Badge */}
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md z-10 shadow">
                          {discountPercent}% OFF
                        </div>

                        {/* Wishlist Button */}
                        <button
                          id={`wishlist-btn-${prod.id}`}
                          onClick={(e) => toggleWishlist(prod.id, e)}
                          className="absolute top-3 right-3 p-1.5 bg-white/95 hover:bg-white rounded-full text-slate-500 hover:text-rose-500 shadow-sm z-10 transition border border-slate-100 cursor-pointer"
                        >
                          <Heart className={`w-4 h-4 ${isInWish ? "fill-rose-500 text-rose-500" : ""}`} />
                        </button>

                        {/* Image Container */}
                        <div className="bg-slate-100 h-48 relative overflow-hidden flex items-center justify-center">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="object-contain max-h-full max-w-full group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Body Details */}
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div className="space-y-1">
                            {/* Category Tag */}
                            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                              {lang === "en" ? prod.category : prod.categoryHindi}
                            </p>
                            {/* Name */}
                            <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition line-clamp-2 text-sm">
                              {lang === "en" ? prod.name : prod.nameHindi}
                            </h4>
                            {/* Rating */}
                            <div className="flex items-center space-x-1">
                              <div className="flex items-center text-amber-400">
                                <Star className="w-3.5 h-3.5 fill-current" />
                              </div>
                              <span className="text-xs font-bold text-slate-800">{prod.rating}</span>
                              <span className="text-[11px] text-slate-400 font-medium">({prod.reviewsCount})</span>
                            </div>
                          </div>

                          {/* Price & Buy Actions */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <div>
                              <div className="flex items-baseline space-x-1.5">
                                <span className="text-lg font-extrabold text-slate-900">₹{prod.price.toLocaleString("en-IN")}</span>
                                <span className="text-xs text-slate-400 line-through">₹{prod.originalPrice.toLocaleString("en-IN")}</span>
                              </div>
                              <p className="text-[10px] text-emerald-600 font-bold">{t.freeShipping}</p>
                            </div>

                            <button
                              id={`add-to-cart-btn-${prod.id}`}
                              onClick={(e) => handleAddToCart(prod, e)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition flex items-center space-x-1 cursor-pointer ${
                                isInCart
                                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                  : "bg-slate-900 hover:bg-indigo-600 text-white shadow"
                              }`}
                            >
                              <Plus className="w-3 h-3" />
                              <span>{isInCart ? `${t.addedToCart} (${isInCart.quantity})` : t.addToCart}</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </section>

          </div>
        ) : (
          /* --- INTEGRATED CHECKOUT STEPS VIEW --- */
          <div id="checkout-process-flow" className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-md space-y-6">
            
            {/* Step Breadcrumbs */}
            <div className="flex items-center justify-center space-x-2 md:space-x-4 border-b border-slate-100 pb-4">
              <span className={`text-sm font-bold ${checkoutStep === "address" ? "text-indigo-600" : "text-slate-400"}`}>
                1. {t.shippingAddressTitle}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
              <span className={`text-sm font-bold ${checkoutStep === "payment" ? "text-indigo-600" : "text-slate-400"}`}>
                2. {t.paymentTitle}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300" />
              <span className={`text-sm font-bold ${checkoutStep === "confirmed" ? "text-indigo-600" : "text-slate-400"}`}>
                3. {lang === "en" ? "Order Placed" : "ऑर्डर पूर्ण"}
              </span>
            </div>

            {checkoutStep === "address" && (
              <div id="checkout-step-address" className="space-y-4">
                <div className="flex items-center space-x-2">
                  <button
                    id="back-to-cart-btn"
                    onClick={() => setCheckoutStep("browse")}
                    className="p-1.5 hover:bg-slate-100 rounded-lg"
                  >
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <h3 className="text-lg font-bold text-slate-900">{t.shippingAddressTitle}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">{t.fullName} *</label>
                    <input
                      id="addr-fullname"
                      type="text"
                      required
                      placeholder="e.g. Sunil Yadav"
                      value={shippingAddress.name}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">{t.phone} *</label>
                    <input
                      id="addr-phone"
                      type="text"
                      required
                      placeholder="e.g. 9876543210"
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value.replace(/\D/g, "") })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-600">{t.addressLine} *</label>
                    <input
                      id="addr-line"
                      type="text"
                      required
                      placeholder="e.g. Flat 302, Sector 15"
                      value={shippingAddress.addressLine}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Pincode *</label>
                    <input
                      id="addr-pincode"
                      type="text"
                      maxLength={6}
                      required
                      placeholder="e.g. 110001"
                      value={shippingAddress.pincode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value.replace(/\D/g, "") })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">{t.city} *</label>
                    <input
                      id="addr-city"
                      type="text"
                      required
                      placeholder="e.g. New Delhi"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-slate-600">{t.state} *</label>
                    <input
                      id="addr-state"
                      type="text"
                      required
                      placeholder="e.g. Delhi"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    id="proceed-to-payment-btn"
                    onClick={() => {
                      if (!shippingAddress.name || !shippingAddress.phone || !shippingAddress.addressLine || !shippingAddress.pincode) {
                        alert(lang === "en" ? "Please fill all required shipping details" : "कृपया सभी आवश्यक विवरण भरें");
                        return;
                      }
                      setCheckoutStep("payment");
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2.5 rounded-xl shadow transition cursor-pointer"
                  >
                    {lang === "en" ? "Continue to Payment" : "भुगतान के लिए आगे बढ़ें"}
                  </button>
                </div>
              </div>
            )}

            {checkoutStep === "payment" && (
              <div id="checkout-step-payment" className="space-y-6">
                <div className="flex items-center space-x-2">
                  <button
                    id="back-to-address-btn"
                    onClick={() => setCheckoutStep("address")}
                    className="p-1.5 hover:bg-slate-100 rounded-lg"
                  >
                    <ArrowLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <h3 className="text-lg font-bold text-slate-900">{t.paymentTitle}</h3>
                </div>

                {/* Option list */}
                <div className="space-y-3">
                  {/* COD */}
                  <label className="flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50/20 border border-slate-200 rounded-xl cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="pmethod"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="accent-indigo-600 h-4.5 w-4.5"
                      />
                      <div>
                        <p className="font-bold text-slate-800 text-sm">{t.cod}</p>
                        <p className="text-xs text-slate-500">{lang === "en" ? "Pay with cash at your doorstep." : "घर पर कैश भुगतान करें।"}</p>
                      </div>
                    </div>
                    <MapPin className="w-5 h-5 text-indigo-500" />
                  </label>

                  {/* UPI */}
                  <label className="flex flex-col p-4 bg-slate-50 hover:bg-indigo-50/20 border border-slate-200 rounded-xl cursor-pointer gap-4">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="pmethod"
                          value="upi"
                          checked={paymentMethod === "upi"}
                          onChange={() => setPaymentMethod("upi")}
                          className="accent-indigo-600 h-4.5 w-4.5"
                        />
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{t.upi}</p>
                          <p className="text-xs text-slate-500">{lang === "en" ? "Scan QR Code or enter UPI ID to pay instantly." : "क्यूआर कोड स्कैन करें या यूपीआई आईडी दर्ज करें।"}</p>
                        </div>
                      </div>
                      <Sparkles className="w-5 h-5 text-indigo-500" />
                    </div>

                    {paymentMethod === "upi" && (
                      <div className="pl-7 pt-2 border-t border-slate-200 space-y-3">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm text-center">
                            {/* Simulated QR Code */}
                            <div className="w-24 h-24 bg-slate-200 flex items-center justify-center border-2 border-slate-300 rounded font-bold text-slate-600 text-[10px] select-none uppercase tracking-wider">
                              QR SCAN CODE
                            </div>
                            <span className="text-[10px] text-slate-500 font-bold block mt-1">APNABAZAAR@UPI</span>
                          </div>
                          <div className="flex-1 space-y-1.5 w-full">
                            <label className="text-xs font-bold text-slate-600">{lang === "en" ? "Or Enter UPI ID" : "या यूपीआई आईडी दर्ज करें"}</label>
                            <input
                              type="text"
                              placeholder="e.g. name@paytm"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </label>

                  {/* CARD */}
                  <label className="flex flex-col p-4 bg-slate-50 hover:bg-indigo-50/20 border border-slate-200 rounded-xl cursor-pointer gap-4">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="pmethod"
                          value="card"
                          checked={paymentMethod === "card"}
                          onChange={() => setPaymentMethod("card")}
                          className="accent-indigo-600 h-4.5 w-4.5"
                        />
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{t.card}</p>
                          <p className="text-xs text-slate-500">{lang === "en" ? "Secure transactions with 256-bit encryption." : "256-बिट एन्क्रिप्शन के साथ सुरक्षित लेनदेन।"}</p>
                        </div>
                      </div>
                      <CreditCard className="w-5 h-5 text-indigo-500" />
                    </div>

                    {paymentMethod === "card" && (
                      <div className="pl-7 pt-2 border-t border-slate-200 grid grid-cols-2 gap-3">
                        <div className="col-span-2 space-y-1">
                          <label className="text-xs font-bold text-slate-600">{lang === "en" ? "Card Number" : "कार्ड नंबर"}</label>
                          <input
                            type="text"
                            maxLength={16}
                            placeholder="e.g. 4321 8765 2341 9087"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-600">CVV</label>
                          <input
                            type="password"
                            maxLength={3}
                            placeholder="***"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-indigo-500"
                          />
                        </div>
                      </div>
                    )}
                  </label>
                </div>

                {/* Secure checkout cost footer */}
                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <p className="text-xs text-indigo-700 font-semibold">{lang === "en" ? "Total Payable Amount:" : "कुल देय राशि:"}</p>
                    <p className="text-2xl font-black text-indigo-950">₹{cartTotal.toLocaleString("en-IN")}</p>
                  </div>

                  <button
                    id="final-place-order-btn"
                    onClick={handlePlaceOrder}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-8 py-3.5 rounded-xl shadow-md transition flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <CheckCircle className="w-5 h-5 text-yellow-400" />
                    <span>{t.paySecurely}</span>
                  </button>
                </div>
              </div>
            )}

            {checkoutStep === "confirmed" && (
              <div id="checkout-step-confirmed" className="text-center p-8 space-y-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-900">{t.orderSuccess}</h2>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">{t.orderSuccessMsg}</p>
                </div>

                {/* Invoice specs */}
                {orders.length > 0 && (
                  <div className="max-w-md mx-auto p-4 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Order Receipt</p>
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-600">Order ID:</span>
                      <span className="font-mono font-bold text-indigo-600">{orders[0].id}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-600">Date:</span>
                      <span className="font-medium text-slate-800">{orders[0].date}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-600">Total Paid:</span>
                      <span className="font-bold text-slate-900">₹{orders[0].total.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-xs border-t border-slate-200 pt-1.5 mt-1">
                      <span className="font-semibold text-slate-600">Delivery Status:</span>
                      <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
                        {orders[0].status}
                      </span>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex justify-center gap-4">
                  <button
                    id="back-to-home-btn"
                    onClick={() => setCheckoutStep("browse")}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-2.5 rounded-xl transition cursor-pointer text-sm"
                  >
                    {t.backToHome}
                  </button>
                  <button
                    id="confirmed-ai-btn"
                    onClick={() => {
                      setCheckoutStep("browse");
                      setIsAiOpen(true);
                    }}
                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold px-6 py-2.5 rounded-xl transition text-sm flex items-center space-x-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{lang === "en" ? "Ask AI for accessories" : "एआई से एक्सेसरीज पूछें"}</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* --- DYNAMIC USER ORDERS HISTORY TABLE --- */}
        {checkoutStep === "browse" && orders.length > 0 && (
          <section id="orders-history-section" className="mt-12 max-w-7xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">{t.ordersHistory}</h3>
            <div className="space-y-4">
              {orders.map((ord) => (
                <div id={`order-card-${ord.id}`} key={ord.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="text-slate-500 font-semibold mr-1">Order ID:</span>
                      <span className="font-mono font-bold text-indigo-600">{ord.id}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold mr-1">Date:</span>
                      <span className="text-slate-800 font-medium">{ord.date}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 font-semibold mr-1">Status:</span>
                      <span className="text-indigo-600 font-bold">{ord.status}</span>
                    </div>
                    <div className="font-bold text-slate-900">
                      Total: ₹{ord.total.toLocaleString("en-IN")}
                    </div>
                  </div>

                  <div className="border-t border-slate-200/60 pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Items ordered</p>
                      {ord.items.map((it) => (
                        <div key={it.product.id} className="flex justify-between text-xs text-slate-700">
                          <span>{lang === "en" ? it.product.name : it.product.nameHindi} x {it.quantity}</span>
                          <span className="font-semibold text-slate-800">₹{(it.product.price * it.quantity).toLocaleString("en-IN")}</span>
                        </div>
                      ))}
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Delivery Details</p>
                      <p className="font-bold text-slate-800">{ord.address.name} ({ord.address.phone})</p>
                      <p className="line-clamp-1">{ord.address.addressLine}, {ord.address.city}, {ord.address.pincode}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* --- FOOTER COLO-BASED STATS ACCENTS (Anti AI Slop Clean Visual Footer) --- */}
      <footer id="app-footer" className="bg-white border-t border-slate-200 py-10 text-center text-slate-400 text-xs">
        <p className="font-semibold text-slate-500">🇮🇳 {lang === "en" ? "Proudly built for ApnaBazaar Users" : "शान से बनाया गया भारतवासियों के लिए"}</p>
        <p className="mt-2 text-slate-400">© 2026 ApnaBazaar E-Commerce India. All Rights Reserved.</p>
      </footer>

      {/* --- PRODUCT DETAIL MODAL DRAWER --- */}
      <AnimatePresence>
        {selectedProduct && (
          <div id="product-detail-backdrop" className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              id="product-detail-modal"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  {lang === "en" ? selectedProduct.category : selectedProduct.categoryHindi}
                </span>
                <button
                  id="close-detail-modal"
                  onClick={() => setSelectedProduct(null)}
                  className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-full transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto p-6 space-y-6 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Photo Left */}
                  <div className="bg-slate-50 p-6 rounded-2xl flex items-center justify-center border border-slate-100">
                    <img
                      src={selectedProduct.image}
                      alt={selectedProduct.name}
                      className="object-contain max-h-64 max-w-full"
                    />
                  </div>

                  {/* Pricing/Name Right */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-slate-900 leading-snug">
                        {lang === "en" ? selectedProduct.name : selectedProduct.nameHindi}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-amber-400">
                          <Star className="w-4 h-4 fill-current" />
                        </div>
                        <span className="text-sm font-bold text-slate-800">{selectedProduct.rating} / 5</span>
                        <span className="text-xs text-slate-400">({selectedProduct.reviewsCount} verified reviews)</span>
                      </div>
                    </div>

                    <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                      <p className="text-[10px] text-slate-500 uppercase font-bold">{lang === "en" ? "Offer Price" : "विशेष सेल कीमत"}</p>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-2xl font-black text-indigo-950">₹{selectedProduct.price.toLocaleString("en-IN")}</span>
                        <span className="text-sm text-slate-400 line-through">₹{selectedProduct.originalPrice.toLocaleString("en-IN")}</span>
                        <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded font-bold">
                          {Math.round(((selectedProduct.originalPrice - selectedProduct.price) / selectedProduct.originalPrice) * 100)}% Off
                        </span>
                      </div>
                      <p className="text-[10px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        {t.freeShipping}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <button
                        id="modal-add-to-cart"
                        onClick={() => {
                          handleAddToCart(selectedProduct);
                          setIsCartOpen(true);
                          setSelectedProduct(null);
                        }}
                        className="flex-1 bg-slate-900 hover:bg-indigo-600 text-white font-bold py-3 rounded-xl transition shadow flex items-center justify-center space-x-2 cursor-pointer text-sm"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>{t.addToCart}</span>
                      </button>
                      <button
                        id="modal-wishlist-toggle"
                        onClick={() => toggleWishlist(selectedProduct.id)}
                        className={`p-3 border rounded-xl transition cursor-pointer ${
                          wishlist.includes(selectedProduct.id)
                            ? "border-rose-200 bg-rose-50 text-rose-500"
                            : "border-slate-200 hover:bg-slate-50 text-slate-500"
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${wishlist.includes(selectedProduct.id) ? "fill-rose-500" : ""}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{t.productDetail}</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {lang === "en" ? selectedProduct.description : selectedProduct.descriptionHindi}
                  </p>
                </div>

                {/* Highlights */}
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{t.features}</h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600 list-disc list-inside pl-1">
                    {selectedProduct.features.map((feat, i) => (
                      <li key={i}>{feat}</li>
                    ))}
                  </ul>
                </div>

                {/* Specs */}
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{t.specs}</h4>
                  <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
                    {selectedProduct.specs.map((spec, i) => (
                      <div key={i} className="flex text-xs divide-x divide-slate-100">
                        <div className="w-1/3 p-2.5 bg-slate-50 font-bold text-slate-600">{spec.key}</div>
                        <div className="w-2/3 p-2.5 text-slate-800">{spec.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews */}
                <div className="space-y-3 border-t border-slate-100 pt-4">
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{t.reviews}</h4>
                  <div className="space-y-3">
                    {selectedProduct.reviews.map((rev, i) => (
                      <div key={i} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800">{rev.user}</span>
                          <span className="text-[10px] text-slate-400">{rev.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, idx) => (
                            <Star
                              key={idx}
                              className={`w-3 h-3 ${idx < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                            />
                          ))}
                        </div>
                        <p className="text-slate-600 text-xs italic">"{rev.comment}"</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- CART DRAWER OVERLAY --- */}
      <AnimatePresence>
        {isCartOpen && (
          <div id="cart-drawer-backdrop" className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end">
            <motion.div
              id="cart-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl border-l border-slate-200"
            >
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-extrabold text-slate-900 text-base">{t.cartTitle}</h3>
                  <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-bold">
                    {cart.reduce((s, i) => s + i.quantity, 0)} Items
                  </span>
                </div>
                <button
                  id="close-cart-drawer"
                  onClick={() => setIsCartOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-slate-500 text-sm font-semibold">{t.emptyCart}</p>
                    <button
                      id="cart-start-shopping"
                      onClick={() => setIsCartOpen(false)}
                      className="bg-indigo-600 text-white text-xs px-4 py-2 rounded-xl hover:bg-indigo-700 transition font-bold"
                    >
                      {lang === "en" ? "Explore Catalog" : "कैटलॉग देखें"}
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div id={`cart-item-${item.product.id}`} key={item.product.id} className="flex gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/60 items-center justify-between">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 rounded-lg object-contain bg-white border p-1"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-950 truncate">
                          {lang === "en" ? item.product.name : item.product.nameHindi}
                        </h4>
                        <p className="text-xs text-indigo-600 font-bold mt-0.5">₹{item.product.price.toLocaleString("en-IN")}</p>
                        
                        {/* Stepper */}
                        <div className="flex items-center space-x-2 mt-1.5">
                          <button
                            id={`qty-minus-${item.product.id}`}
                            onClick={() => handleUpdateQuantity(item.product.id, -1)}
                            className="p-1 bg-white hover:bg-slate-200 rounded-md border text-slate-600 transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold font-mono px-1.5">{item.quantity}</span>
                          <button
                            id={`qty-plus-${item.product.id}`}
                            onClick={() => handleUpdateQuantity(item.product.id, 1)}
                            className="p-1 bg-white hover:bg-slate-200 rounded-md border text-slate-600 transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <button
                        id={`delete-cart-item-${item.product.id}`}
                        onClick={() => handleRemoveFromCart(item.product.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 bg-white hover:bg-rose-50 rounded-lg border border-slate-200/50 transition cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Sticky bottom checkout calculations */}
              {cart.length > 0 && (
                <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-4">
                  {/* Coupon section */}
                  <form id="drawer-coupon-form" onSubmit={handleApplyCoupon} className="flex gap-1.5">
                    <input
                      id="drawer-coupon-input"
                      type="text"
                      placeholder={t.couponPlaceholder}
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-white text-xs px-2.5 py-2 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 uppercase font-bold"
                    />
                    <button
                      id="drawer-coupon-submit"
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-lg font-bold transition cursor-pointer"
                    >
                      {t.couponBtn}
                    </button>
                  </form>

                  {appliedCoupon && (
                    <div className="flex justify-between items-center text-xs bg-emerald-50 text-emerald-700 p-2 rounded-lg border border-emerald-200">
                      <div className="flex items-center space-x-1">
                        <Percent className="w-3.5 h-3.5" />
                        <span className="font-bold">{appliedCoupon} Applied!</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                        <button
                          id="remove-coupon-btn"
                          onClick={() => {
                            setAppliedCoupon(null);
                            setDiscountAmount(0);
                          }}
                          className="text-slate-400 hover:text-slate-600 font-black cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Pricing Breakdown */}
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>{t.subtotal}</span>
                      <span className="font-semibold text-slate-800">₹{cartSubtotal.toLocaleString("en-IN")}</span>
                    </div>
                    {appliedCoupon && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>{t.discount}</span>
                        <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>{t.shipping}</span>
                      <span className="font-semibold text-slate-800">
                        {shippingFee === 0 ? (
                          <span className="text-emerald-600 font-bold">FREE</span>
                        ) : (
                          `₹${shippingFee}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-slate-900 border-t border-slate-200/60 pt-2">
                      <span>{t.totalPrice}</span>
                      <span className="text-indigo-600">₹{cartTotal.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    id="drawer-proceed-checkout"
                    onClick={() => {
                      setIsCartOpen(false);
                      setCheckoutStep("address");
                    }}
                    className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-extrabold text-sm py-3 rounded-xl transition shadow flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>{t.proceedToCheckout}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- WISHLIST DRAWER OVERLAY --- */}
      <AnimatePresence>
        {isWishlistOpen && (
          <div id="wishlist-drawer-backdrop" className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end">
            <motion.div
              id="wishlist-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl border-l border-slate-200"
            >
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <h3 className="font-extrabold text-slate-900 text-base">{t.wishlistTitle}</h3>
                  <span className="bg-rose-100 text-rose-700 text-xs px-2 py-0.5 rounded-full font-bold">
                    {wishlist.length} Items
                  </span>
                </div>
                <button
                  id="close-wishlist-drawer"
                  onClick={() => setIsWishlistOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {wishlist.length === 0 ? (
                  <div className="text-center py-16 space-y-4">
                    <Heart className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-slate-500 text-sm font-semibold">{t.emptyWishlist}</p>
                    <button
                      id="wishlist-start-shopping"
                      onClick={() => setIsWishlistOpen(false)}
                      className="bg-indigo-600 text-white text-xs px-4 py-2 rounded-xl hover:bg-indigo-700 transition font-bold"
                    >
                      {lang === "en" ? "Explore Catalog" : "कैटलॉग देखें"}
                    </button>
                  </div>
                ) : (
                  wishlist.map((id) => {
                    const prod = products.find((p) => p.id === id);
                    if (!prod) return null;
                    return (
                      <div id={`wish-item-${prod.id}`} key={prod.id} className="flex gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/60 items-center justify-between">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-12 h-12 rounded-lg object-contain bg-white border p-1"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-950 truncate">
                            {lang === "en" ? prod.name : prod.nameHindi}
                          </h4>
                          <p className="text-xs text-indigo-600 font-bold mt-0.5">₹{prod.price.toLocaleString("en-IN")}</p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            id={`wish-add-cart-${prod.id}`}
                            onClick={() => {
                              handleAddToCart(prod);
                              toggleWishlist(prod.id);
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] px-2 py-1.5 rounded-lg font-bold transition cursor-pointer"
                          >
                            Add
                          </button>
                          <button
                            id={`wish-delete-${prod.id}`}
                            onClick={() => toggleWishlist(prod.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 bg-white hover:bg-rose-50 rounded-lg border border-slate-200/50 transition cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- FLOATING AI ASSISTANT BUTTON --- */}
      {!isAiOpen && (
        <motion.button
          id="floating-ai-assistant-btn"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsAiOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-full shadow-2xl flex items-center space-x-2 group cursor-pointer transition-all hover:scale-105 border border-indigo-500"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
          <span className="text-xs font-bold max-w-0 group-hover:max-w-[120px] overflow-hidden transition-all duration-300 ease-out whitespace-nowrap">
            {lang === "en" ? "Ask AI Assistant" : "एआई सहायक से पूछें"}
          </span>
        </motion.button>
      )}

      {/* --- AI ASSISTANT CONVERSATION SIDE DRAWER --- */}
      <AnimatePresence>
        {isAiOpen && (
          <div id="ai-assistant-backdrop" className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 flex justify-end">
            <motion.div
              id="ai-assistant-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="bg-indigo-950 text-slate-100 w-full max-w-md h-full flex flex-col shadow-2xl border-l border-indigo-900"
            >
              
              {/* AI Drawer Header */}
              <div className="p-4 border-b border-indigo-900 flex items-center justify-between bg-indigo-900">
                <div className="flex items-center space-x-2">
                  <div className="bg-yellow-400 p-1.5 rounded-xl text-slate-950">
                    <Sparkles className="w-5 h-5 text-indigo-950" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-white">{t.aiAssistantTitle}</h3>
                    <p className="text-[10px] text-indigo-200">{lang === "en" ? "Live recommendations" : "लाइव डील्स और सलाह"}</p>
                  </div>
                </div>
                
                <button
                  id="close-ai-drawer"
                  onClick={() => setIsAiOpen(false)}
                  className="p-1 text-indigo-300 hover:text-white bg-indigo-800 hover:bg-indigo-700 rounded-full transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                
                {chatMessages.map((msg) => {
                  const isUser = msg.role === "user";
                  const { cleanedText, productIds } = parseMessageContent(msg.content);

                  return (
                    <div id={`chat-msg-${msg.id}`} key={msg.id} className={`flex flex-col ${isUser ? "items-end" : "items-start"} space-y-1`}>
                      
                      {/* Speaker title */}
                      <span className="text-[10px] text-indigo-300 font-bold px-1 uppercase">
                        {isUser ? (lang === "en" ? "You" : "आप") : (lang === "en" ? "AI Sahayak" : "एआई सहायक")}
                      </span>

                      {/* Msg bubble */}
                      <div className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed whitespace-pre-wrap ${
                        isUser 
                          ? "bg-indigo-600 text-white rounded-tr-sm" 
                          : "bg-slate-900 text-slate-100 rounded-tl-sm border border-indigo-900"
                      }`}>
                        {cleanedText}
                      </div>

                      {/* If there are embedded products detected in message */}
                      {!isUser && productIds.length > 0 && (
                        <div className="space-y-2 mt-2 w-full max-w-[85%]">
                          {productIds.map((id) => {
                            const foundProduct = products.find((p) => p.id === id);
                            if (!foundProduct) return null;
                            const isInCart = cart.find((item) => item.product.id === foundProduct.id);

                            return (
                              <div
                                id={`ai-product-card-${foundProduct.id}`}
                                key={foundProduct.id}
                                className="bg-slate-900 hover:bg-slate-800 border border-indigo-900 p-2.5 rounded-xl flex items-center gap-2.5 transition"
                              >
                                <img
                                  src={foundProduct.image}
                                  alt={foundProduct.name}
                                  className="w-10 h-10 object-contain bg-white rounded-lg p-0.5"
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-[11px] font-bold text-white truncate">
                                    {lang === "en" ? foundProduct.name : foundProduct.nameHindi}
                                  </h4>
                                  <p className="text-[10px] text-yellow-400 font-extrabold">₹{foundProduct.price.toLocaleString("en-IN")}</p>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <button
                                    id={`ai-add-cart-${foundProduct.id}`}
                                    onClick={() => handleAddToCart(foundProduct)}
                                    className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-[10px] px-2 py-1 rounded-md transition"
                                  >
                                    {isInCart ? `Add (${isInCart.quantity})` : "Add"}
                                  </button>
                                  <button
                                    id={`ai-view-prod-${foundProduct.id}`}
                                    onClick={() => setSelectedProduct(foundProduct)}
                                    className="text-[9px] text-indigo-300 hover:text-white underline font-bold"
                                  >
                                    View
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* AI Thinking animation loader */}
                {isChatLoading && (
                  <div className="flex flex-col items-start space-y-1">
                    <span className="text-[10px] text-indigo-300 font-bold px-1 uppercase">
                      AI Sahayak
                    </span>
                    <div className="bg-slate-900 p-4 rounded-2xl rounded-tl-sm border border-indigo-900 text-xs flex items-center space-x-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-bounce"></span>
                      <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-bounce delay-75"></span>
                      <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-bounce delay-150"></span>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Chat Input form */}
              <div className="p-4 border-t border-indigo-900 bg-indigo-950">
                <form id="chat-input-form" onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    id="chat-user-input"
                    type="text"
                    placeholder={lang === "en" ? "Ask AI e.g., smart watch suggestions..." : "एआई से पूछें जैसे, बेस्ट मोबाइल..."}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 bg-indigo-900 text-slate-100 placeholder-indigo-300 text-xs px-3.5 py-3 rounded-xl border border-transparent focus:border-yellow-400 outline-none transition"
                  />
                  <button
                    id="chat-submit-btn"
                    type="submit"
                    className="bg-yellow-400 hover:bg-yellow-300 text-indigo-950 p-3 rounded-xl transition cursor-pointer flex items-center justify-center font-bold"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <p className="text-[9px] text-indigo-400 text-center mt-2 font-medium">
                  {lang === "en" 
                    ? "Tip: Try asking 'Which phone has a 200MP camera?'" 
                    : "सुझाव: पूछें 'कौन से फ़ोन में 200MP कैमरा है?'"}
                </p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
