// Since firebase is loaded from a script tag in index.html, it will be a global variable.
// We declare it here to satisfy TypeScript.
declare const firebase: any;

// Your Firebase Configuration
// IMPORTANT: Replace with your actual Firebase project configuration.
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "krishna-e9c59.firebaseapp.com",
  databaseURL: "https://krishna-e9c59-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "krishna-e9c59",
  storageBucket: "krishna-e9c59.firebasestorage.app",
  messagingSenderId: "1048468387337",
  appId: "1:1048468387337:web:95bd7281d40f8db4b02ad8",
  measurementId: "G-RXF4SNS526"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

console.log("Firebase connected!");

export const FirebaseService = {
  // Create new order
  async createOrder(orderData: any) {
    try {
      const ordersRef = database.ref('orders');
      const newOrderRef = ordersRef.push();
      
      const order = {
        tableNumber: orderData.tableNumber,
        items: orderData.items,
        subtotal: orderData.subtotal,
        tax: orderData.tax,
        total: orderData.total,
        orderId: newOrderRef.key,
        status: 'pending',
        timestamp: firebase.database.ServerValue.TIMESTAMP
      };
      
      await newOrderRef.set(order);
      console.log("Order created:", order.orderId);
      return order;
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to place order. Please try again.");
      throw error;
    }
  },
  
  // Listen for order status updates
  listenToOrder(orderId: string, callback: (data: any) => void) {
    const orderRef = database.ref('orders/' + orderId);
    
    orderRef.on('value', (snapshot: any) => {
      const data = snapshot.val();
      if (data) {
        console.log("Order update:", data);
        callback(data);
      }
    }, (error: any) => {
      console.error("Error listening to order updates:", error);
      alert("Failed to receive order updates. Please check your internet connection.");
    });
  },
  
  // Stop listening
  stopListening(orderId: string) {
    database.ref('orders/' + orderId).off();
  }
};
