/**
 * Telegram Notification Service
 * Sends order notifications to admin via Telegram
 */

// Replace these with your actual Telegram bot token and admin chat ID
const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_ADMIN_CHAT_ID = import.meta.env.VITE_TELEGRAM_ADMIN_CHAT_ID || '';

const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

export interface OrderNotificationData {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  itemCount: number;
  items: Array<{
    productName: string;
    quantity: number;
    price: number;
  }>;
}

/**
 * Send order notification to Telegram
 */
export const sendOrderNotificationToTelegram = async (orderData: OrderNotificationData) => {
  try {
    // Skip if bot token or chat ID not configured
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_ADMIN_CHAT_ID) {
      console.warn('Telegram bot not configured');
      return false;
    }

    // Format the order message
    const itemsList = orderData.items
      .map((item) => `• ${item.productName} x${item.quantity} - ₹${item.price * item.quantity}`)
      .join('\n');

    const message = `
🎉 <b>NEW ORDER RECEIVED!</b>

📦 <b>Order Details:</b>
Order ID: <code>${orderData.orderId}</code>
Order Number: <code>${orderData.orderNumber}</code>

👤 <b>Customer Info:</b>
Name: ${orderData.customerName}
Email: ${orderData.customerEmail}

📋 <b>Items Ordered:</b>
${itemsList}

💰 <b>Total Amount:</b> ₹${orderData.totalAmount.toFixed(0)}
🛍️ <b>Total Items:</b> ${orderData.itemCount}

⏰ <b>Time:</b> ${new Date().toLocaleString('en-IN')}

<i>Please process this order on the admin dashboard</i>
    `.trim();

    // Send message to Telegram
    const response = await fetch(TELEGRAM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_ADMIN_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      console.error('Failed to send Telegram notification:', response.statusText);
      return false;
    }

    const result = await response.json();
    if (result.ok) {
      console.log('Telegram notification sent successfully');
      return true;
    } else {
      console.error('Telegram API error:', result.description);
      return false;
    }
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    return false;
  }
};

/**
 * Send a test message to Telegram
 */
export const sendTestTelegramMessage = async (testMessage: string) => {
  try {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_ADMIN_CHAT_ID) {
      console.error('Telegram credentials not configured');
      return false;
    }

    const response = await fetch(TELEGRAM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_ADMIN_CHAT_ID,
        text: testMessage,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      console.error('Failed to send test message:', response.statusText);
      return false;
    }

    const result = await response.json();
    return result.ok;
  } catch (error) {
    console.error('Error sending test message:', error);
    return false;
  }
};
