

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// The full shape of a menu item
export interface MenuItem {
  imageUrl: string;
  name: string;
  rating: number;
  price: number;
  description: string;
}

// The shape of an item in the cart
export interface CartItem {
  imageUrl: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
}

// The persisted state of the entire order process
interface OrderState {
  cartItems: CartItem[];
  checkoutState: 'idle' | 'pending' | 'preparing' | 'beeping';
  orderId: string | null;
  orderStartTime: number | null; // Timestamp when 'preparing' starts
  tableNumber: number | null;
}

interface CartContextType extends OrderState {
  addToCart: (item: MenuItem) => void;
  updateQuantity: (itemName: string, quantity: number) => void;
  getCartTotal: () => { subtotal: number; tax: number; grandTotal: number };
  getCartItemCount: () => number;
  setCheckoutState: (state: OrderState['checkoutState']) => void;
  setOrderId: (id: string | null) => void;
  setOrderStartTime: (time: number | null) => void;
  resetOrderState: () => void;
}


const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'krishna-restaurant-cart';

const defaultState: OrderState = {
  cartItems: [],
  checkoutState: 'idle',
  orderId: null,
  orderStartTime: null,
  tableNumber: null,
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<OrderState>(() => {
    try {
      const localData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localData) {
        const parsedData = JSON.parse(localData);
        // Ensure all keys from defaultState are present to avoid errors with old data structures
        return { ...defaultState, ...parsedData };
      }
      return defaultState;
    } catch (error) {
      console.error("Failed to load order state from localStorage", error);
      return defaultState;
    }
  });

  useEffect(() => {
    // This effect runs once on mount to get the table number from the URL
    const params = new URLSearchParams(window.location.search);
    const table = params.get('table');
    if (table && !isNaN(parseInt(table, 10))) {
      setState(prevState => ({ ...prevState, tableNumber: parseInt(table, 10) }));
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save order state to localStorage", error);
    }
  }, [state]);

  const addToCart = (item: MenuItem) => {
    if ('vibrate' in navigator) {
      navigator.vibrate([80, 40, 80]);
    }
    setState(prevState => {
      const existingItem = prevState.cartItems.find(i => i.name === item.name);
      let newCartItems: CartItem[];
      if (existingItem) {
        newCartItems = prevState.cartItems.map(i =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        const { rating, ...rest } = item;
        newCartItems = [...prevState.cartItems, { ...rest, quantity: 1 }];
      }
      return { ...prevState, cartItems: newCartItems };
    });
  };

  const updateQuantity = (itemName: string, quantity: number) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
    setState(prevState => {
      let newCartItems: CartItem[];
      if (quantity <= 0) {
        newCartItems = prevState.cartItems.filter(i => i.name !== itemName);
      } else {
        newCartItems = prevState.cartItems.map(i =>
          i.name === itemName ? { ...i, quantity } : i
        );
      }
      return { ...prevState, cartItems: newCartItems };
    });
  };

  const getCartItemCount = () => {
    return state.cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartTotal = () => {
    const subtotal = state.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const tax = subtotal * 0.10;
    const grandTotal = subtotal + tax;
    return { subtotal, tax, grandTotal };
  };
  
  const setCheckoutState = (checkoutState: OrderState['checkoutState']) => {
    setState(prevState => ({ ...prevState, checkoutState }));
  };

  const setOrderId = (orderId: string | null) => {
    setState(prevState => ({ ...prevState, orderId }));
  };

  const setOrderStartTime = (orderStartTime: number | null) => {
    setState(prevState => ({ ...prevState, orderStartTime }));
  };

  const resetOrderState = () => {
    // We create a new object to avoid mutating the defaultState constant
    // but preserve the table number for the session
    setState(prevState => ({
      ...defaultState,
      tableNumber: prevState.tableNumber,
    }));
  };
  
  const value = {
    ...state,
    addToCart,
    updateQuantity,
    getCartTotal,
    getCartItemCount,
    setCheckoutState,
    setOrderId,
    setOrderStartTime,
    resetOrderState,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};