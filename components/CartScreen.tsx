import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Plus, Minus, BellRing } from 'lucide-react';
import { FirebaseService } from '../lib/firebase';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';

interface CartScreenProps {
  onBack: () => void;
}

const PreparingOrderModal = ({ orderStartTime }: { orderStartTime: number | null }) => {
    const totalDuration = 12 * 60; // 12 minutes in seconds

    const [timeLeft, setTimeLeft] = useState(() => {
        if (!orderStartTime) return totalDuration;
        const elapsedTime = Math.floor((Date.now() - orderStartTime) / 1000);
        return Math.max(0, totalDuration - elapsedTime);
    });

    const elapsedTime = useMemo(() => {
        if (!orderStartTime) return 0;
        return (Date.now() - orderStartTime) / 1000;
    }, [orderStartTime]);
    
    const remainingDuration = Math.max(0, totalDuration - elapsedTime);
    const initialPathLength = Math.min(1, elapsedTime / totalDuration);

    useEffect(() => {
        if (!orderStartTime) return;
        
        const timer = setInterval(() => {
            const currentElapsedTime = (Date.now() - orderStartTime) / 1000;
            const newTimeLeft = Math.max(0, totalDuration - currentElapsedTime);
            setTimeLeft(newTimeLeft);
        }, 1000);
        
        return () => clearInterval(timer);
    }, [orderStartTime]);

    const minutes = Math.ceil(timeLeft / 60);

    const getStatusText = () => {
        if (timeLeft <= 0) {
            return <>Finishing up...</>;
        }
        if (minutes <= 1) {
            return <>Ready in about a <strong>minute</strong>...</>;
        }
        return <>Estimated ready in ~<strong>{minutes} min</strong></>;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="bg-[#1a1a1a] border border-gray-800 rounded-3xl p-8 text-center text-white max-w-sm w-full shadow-2xl"
            >
                <div className="relative w-40 h-40 mx-auto mb-6">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        {/* Background circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            stroke="#333"
                            strokeWidth="5"
                            fill="transparent"
                        />
                        {/* Progress circle */}
                        <motion.circle
                            cx="50"
                            cy="50"
                            r="45"
                            stroke="hsl(var(--primary))"
                            strokeWidth="5"
                            fill="transparent"
                            strokeLinecap="round"
                            transform="rotate(-90 50 50)"
                            initial={{ pathLength: initialPathLength }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: remainingDuration, ease: 'linear' }}
                        />
                         {/* Bowl with steam icon */}
                         <g transform="translate(32, 35) scale(0.9)">
                            <path d="M4.6,18.9c0,0,0,0,0,0c-1.3,0-2.3-0.8-2.6-2c-0.1-0.2-0.1-0.4-0.1-0.6c0-0.1,0-0.2,0-0.3c0-0.1,0-0.1,0-0.2 c0-0.1,0-0.2,0.1-0.3c0-0.1,0.1-0.3,0.1-0.4c0-0.1,0.1-0.2,0.1-0.3c0.1-0.1,0.1-0.2,0.2-0.4c0.1-0.1,0.2-0.3,0.3-0.4 c0.1-0.1,0.2-0.2,0.3-0.3c0.1-0.1,0.2-0.2,0.3-0.3c0.2-0.2,0.4-0.4,0.6-0.5s0.4-0.3,0.6-0.4c0.2-0.1,0.5-0.2,0.7-0.3 c0.3-0.1,0.5-0.1,0.8-0.2c0.3,0,0.5-0.1,0.8-0.1c0.1,0,0.2,0,0.3,0c0.1,0,0.2,0,0.3,0c0.1,0,0.2,0,0.2,0h14c0.1,0,0.2,0,0.2,0 c0.1,0,0.2,0,0.3,0c0.1,0,0.2,0,0.3,0c0.3,0,0.5,0,0.8,0.1c0.3,0,0.5,0.1,0.8,0.2c0.3,0.1,0.5,0.2,0.7,0.3c0.2,0.1,0.4,0.2,0.6,0.4 c0.2,0.1,0.4,0.3,0.6,0.5c0.1,0.1,0.2,0.2,0.3,0.3c0.1,0.1,0.2,0.2,0.3,0.3c0.1,0.1,0.2,0.2,0.3,0.4c0.1,0.1,0.2,0.3,0.2,0.4 c0.1,0.1,0.1,0.2,0.1,0.3c0.1,0.1,0.1,0.2,0.1,0.4c0,0.1,0.1,0.3,0.1,0.4c0,0.1,0,0.2,0,0.3c0,0.1,0,0.1,0,0.2c0,0.1,0,0.2,0,0.3 c-0.1,1.5-1.4,2.6-2.9,2.6H4.6z M28.1,23.9c0,1.9-2.6,3.5-5.8,3.5s-5.8-1.6-5.8-3.5s2.6-3.5,5.8-3.5S28.1,22,28.1,23.9z" fill="#555"/>
                            <motion.path d="M10,8 Q12,6 14,8" stroke="#777" strokeWidth="1.5" strokeLinecap="round" fill="none" initial={{opacity: 0, y: 0}} animate={{opacity: [0,1,0], y: -10}} transition={{duration: 4, repeat: Infinity, ease: 'easeOut', delay: 0}}/>
                            <motion.path d="M16,8 Q18,6 20,8" stroke="#777" strokeWidth="1.5" strokeLinecap="round" fill="none" initial={{opacity: 0, y: 0}} animate={{opacity: [0,1,0], y: -12}} transition={{duration: 4, repeat: Infinity, ease: 'easeOut', delay: 1}}/>
                            <motion.path d="M22,8 Q24,6 26,8" stroke="#777" strokeWidth="1.5" strokeLinecap="round" fill="none" initial={{opacity: 0, y: 0}} animate={{opacity: [0,1,0], y: -10}} transition={{duration: 4, repeat: Infinity, ease: 'easeOut', delay: 2}}/>
                        </g>
                    </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gray-100">Your order is cooking!</h3>
                <p className="text-gray-400 mb-6 h-10 flex items-center justify-center">{getStatusText()}</p>
                <p className="text-xs text-gray-600 mt-6 px-4">
                    Feel free to use your phone, but please don't close this browser tab to receive updates.
                </p>
            </motion.div>
        </motion.div>
    );
};


export default function CartScreen({ onBack }: CartScreenProps) {
  const { cartItems, updateQuantity, getCartTotal, 
          checkoutState, setCheckoutState, 
          orderId, setOrderId, 
          orderStartTime, setOrderStartTime,
          resetOrderState, tableNumber } = useCart();
  const { subtotal, tax, grandTotal } = getCartTotal();
  
  const audioControl = useRef<{ context: AudioContext; oscillator: OscillatorNode; gainNode: GainNode } | null>(null);
  const notificationRef = useRef<Notification | null>(null);
  const vibrationIntervalRef = useRef<number | null>(null);

  const stopBeep = useCallback(() => {
    if (audioControl.current) {
      audioControl.current.oscillator.stop();
      audioControl.current.context.close().catch(e => console.error("Error closing audio context:", e));
      audioControl.current = null;
    }
  }, []);
  
  const stopVibration = useCallback(() => {
    if (vibrationIntervalRef.current) {
      clearInterval(vibrationIntervalRef.current);
      vibrationIntervalRef.current = null;
    }
    if ('vibrate' in navigator) {
      navigator.vibrate(0);
    }
  }, []);

  const handleStopAlarm = useCallback(() => {
    stopBeep();
    stopVibration();
    if (notificationRef.current) {
      notificationRef.current.close();
      notificationRef.current = null;
    }
    if (orderId) {
      FirebaseService.stopListening(orderId);
    }
    resetOrderState();
    onBack();
  }, [stopBeep, stopVibration, orderId, resetOrderState, onBack]);

  const startBeep = () => {
    if (audioControl.current || window.location.protocol !== 'https:') {
      if (window.location.protocol !== 'https:') {
        console.warn('AudioContext requires a secure context (HTTPS). Beeping will not work.');
      }
      return;
    }
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.type = 'sine';
    oscillator.frequency.value = 900;
    gainNode.gain.value = 0.2; // Keep volume reasonable

    oscillator.start();
    audioControl.current = { context, oscillator, gainNode };
  };

  const startContinuousVibration = useCallback(() => {
    if ('vibrate' in navigator) {
      stopVibration(); // Stop any previous vibrations
      // Start a continuous vibration pattern
      vibrationIntervalRef.current = window.setInterval(() => {
        navigator.vibrate(400); // Vibrate for 400ms
      }, 500); // Repeat every 500ms (400ms vibrate, 100ms pause)
    }
  }, [stopVibration]);

  const handleCheckout = async () => {
    if (checkoutState !== 'idle' || cartItems.length === 0) return;
    
    if (!tableNumber) {
      alert("Table number not found. Please scan the QR code on your table again.");
      return;
    }

    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 200]);
    }

    let permission = Notification.permission;
    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }

    if (permission === 'denied') {
      alert('Notification permission is required for order alerts. Please enable it in your browser settings.');
      return;
    }

    if (permission === 'granted') {
      setCheckoutState('pending');
      
      const orderData = {
          tableNumber: tableNumber,
          items: cartItems.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
          subtotal: subtotal,
          tax: tax,
          total: grandTotal,
      };

      try {
        const order = await FirebaseService.createOrder(orderData);
        setOrderId(order.orderId);
      } catch (error) {
        setCheckoutState('idle');
      }
    }
  };

  useEffect(() => {
    // This effect re-establishes the Firebase listener on page load if an order is in progress
    if (!orderId || (checkoutState !== 'pending' && checkoutState !== 'preparing')) {
      return;
    }

    FirebaseService.listenToOrder(orderId, (data) => {
      if (data) {
        if (data.status === 'preparing' && checkoutState !== 'preparing') {
          setCheckoutState('preparing');
          if (!orderStartTime) {
            setOrderStartTime(Date.now());
          }
        } else if (data.status === 'ready') {
          setCheckoutState('beeping');
          startBeep();
          startContinuousVibration();

          const notification = new Notification("Krishna's: Order Ready!", {
            body: 'Your order is ready for pickup. Please approach the counter.',
            icon: 'https://i.pinimg.com/1200x/9a/65/90/9a65906e09943ce49c876dbe7509af86.jpg',
            requireInteraction: true,
          });
          
          notificationRef.current = notification;
          notification.onclick = () => { handleStopAlarm(); window.focus(); };
          notification.onclose = () => { handleStopAlarm(); };
          
          FirebaseService.stopListening(orderId);
        }
      }
    });

    return () => {
      if (orderId) {
        FirebaseService.stopListening(orderId);
      }
      stopVibration();
    };
  }, [orderId, checkoutState, orderStartTime, setCheckoutState, setOrderStartTime, handleStopAlarm, startContinuousVibration, stopVibration]);

  return (
    <div className="flex justify-center w-full min-h-screen bg-black text-white">
      <div className="w-full max-w-sm flex flex-col h-screen">
        <header className="flex-shrink-0 z-10 bg-black/90 backdrop-blur-sm">
          <div className="flex justify-between items-center p-6 pt-10 pb-4">
            <button onClick={onBack} className="p-2 rounded-lg bg-[#111111] text-white" aria-label="Go back">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex flex-col items-center">
              <h2 className="text-xl font-bold">Cart</h2>
              {tableNumber && <span className="text-xs font-semibold text-gray-400">Table {tableNumber}</span>}
            </div>
            <div className="w-10"></div>
          </div>
        </header>

        <main className="flex-grow space-y-4 overflow-y-auto px-6 py-4 no-scrollbar">
          {cartItems.length === 0 && checkoutState === 'idle' ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Your cart is empty.</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.name} className="flex items-center bg-[#111111] rounded-xl p-3">
                <img alt={item.name} className="w-16 h-16 object-cover rounded-xl" src={item.imageUrl} />
                <div className="flex-grow ml-4">
                  <h3 className="font-semibold text-white">{item.name}</h3>
                  <p className="text-sm text-gray-400">{item.description}</p>
                  <p className="font-bold text-lg text-white mt-1">₹{item.price}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.name, item.quantity - 1)}
                    className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center"
                    aria-label={`Decrease quantity of ${item.name}`}
                    disabled={orderId !== null}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-bold text-lg text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.name, item.quantity + 1)}
                    className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center"
                    aria-label={`Increase quantity of ${item.name}`}
                    disabled={orderId !== null}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </main>

        <footer className="flex-shrink-0 z-10 bg-black/90 backdrop-blur-sm">
          {checkoutState === 'beeping' ? (
            <div className="p-6 pt-4">
              <div className="flex flex-col items-center justify-center text-center text-white mb-6">
                <BellRing size={48} className="text-red-500 animate-pulse mb-4" />
                <h3 className="text-2xl font-bold">Your Order is Ready!</h3>
                <p className="text-gray-400 mt-2">Please collect it from the counter.</p>
              </div>
              <button
                className="w-full py-4 rounded-lg bg-red-600 text-white font-bold text-lg"
                onClick={handleStopAlarm}
              >
                Turn Off Alarm
              </button>
            </div>
          ) : (
            <div className="p-6 pt-4">
              <div className="space-y-2 text-white mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-400">Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Tax (10%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <hr className="border-dashed border-gray-600 my-3" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Grand Total</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>
              <button
                className="w-full py-4 rounded-lg bg-white text-black font-bold text-lg disabled:opacity-50"
                disabled={!tableNumber || cartItems.length === 0 || checkoutState === 'pending' || checkoutState === 'preparing'}
                onClick={handleCheckout}
              >
                {!tableNumber
                  ? 'Invalid Table'
                  : checkoutState === 'pending' || checkoutState === 'preparing'
                  ? 'Waiting for Chef...'
                  : 'Checkout'}
              </button>
            </div>
          )}
        </footer>
      </div>
      <AnimatePresence>
          {checkoutState === 'preparing' && <PreparingOrderModal orderStartTime={orderStartTime} />}
      </AnimatePresence>
    </div>
  );
}