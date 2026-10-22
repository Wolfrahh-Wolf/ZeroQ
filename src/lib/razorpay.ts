import Razorpay from "razorpay";

/**
 * Razorpay Server-Side Client Singleton
 *
 * Used exclusively in server-side API routes:
 *   - POST /api/orders         → razorpay.orders.create(...)
 *   - POST /api/payment/verify → HMAC-SHA256 signature verification
 *
 * IMPORTANT: Never import or expose this module to client components.
 * The RAZORPAY_KEY_SECRET must remain server-side only.
 *
 * Usage:
 *   import { razorpay } from "@/lib/razorpay"
 */

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error(
    "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in environment variables."
  );
}

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
