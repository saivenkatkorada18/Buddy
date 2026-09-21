import dotenv from 'dotenv';
import Razorpay from 'razorpay';

dotenv.config();

const key_id = process.env.RAZORPAY_KEY_ID || '';
const key_secret = process.env.RAZORPAY_KEY_SECRET || '';

console.log('==================================================');
console.log('⚡ TESTING RAZORPAY TEST CONNECTION');
console.log('==================================================');
console.log(`🔑 Razorpay Key ID     : ${key_id}`);
console.log(`🔒 Key Secret (Masked) : ${key_secret.substring(0, 6)}...`);

const rzp = new Razorpay({ key_id, key_secret });

async function testPayment() {
  try {
    const order = await rzp.orders.create({
      amount: 25000, // ₹250 in paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: { platform: 'BorrowBuddy Campus Network' },
    });

    console.log('\n🎉 RAZORPAY ORDER CREATED SUCCESSFULLY!');
    console.log(`📦 Order ID  : ${order.id}`);
    console.log(`💰 Amount    : ₹${Number(order.amount) / 100} ${order.currency}`);
    console.log(`📊 Status    : ${order.status}`);
    console.log('==================================================');
  } catch (error: any) {
    console.error('❌ Razorpay Error:', error?.error?.description || error.message || error);
  }
}

testPayment();
