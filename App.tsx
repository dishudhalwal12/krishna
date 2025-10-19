import React, { useState, useEffect } from 'react';
import { ShaderAnimation } from './components/ui/ShaderAnimation';
import MenuItemCardDemo from './components/MenuItemCardDemo';
import CartScreen from './components/CartScreen';
import { CartProvider } from './context/CartContext';

type View = 'loading' | 'menu' | 'cart';

const LOCAL_STORAGE_KEY = 'krishna-restaurant-cart';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('loading');

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const localData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData) {
          const parsedData = JSON.parse(localData);
          // If cart has items OR an order is in progress, go directly to the cart
          if (parsedData?.cartItems?.length > 0 || (parsedData?.checkoutState && parsedData.checkoutState !== 'idle')) {
            setCurrentView('cart');
          } else {
            setCurrentView('menu');
          }
        } else {
          // No data in storage, default to menu
          setCurrentView('menu');
        }
      } catch (error) {
        console.error("Failed to determine initial view from localStorage", error);
        // On any error, default to menu
        setCurrentView('menu');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case 'loading':
        return (
          <main className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden">
            <ShaderAnimation />
            <h1 className="absolute pointer-events-none z-10 text-center text-5xl md:text-7xl leading-tight font-bold tracking-tighter text-white drop-shadow-lg">
              Welcome to<br />Krishna's
            </h1>
          </main>
        );
      case 'menu':
        return <MenuItemCardDemo onNavigateToCart={() => setCurrentView('cart')} />;
      case 'cart':
        return <CartScreen onBack={() => setCurrentView('menu')} />;
      default:
        return null;
    }
  };

  return (
    <CartProvider>
      {renderContent()}
    </CartProvider>
  );
}