const crypto = require("node:crypto");
const PRO_PRICE = 49900;
const DAY = 86400000;
function validSignature(orderId, paymentId, signature, secret) {
  if (!secret || ![orderId,paymentId,signature].every(x => typeof x === "string") || !/^([a-f0-9]{64})$/i.test(signature)) return false;
  const expected = crypto.createHmac("sha256", secret).update(orderId + "|" + paymentId).digest();
  return crypto.timingSafeEqual(expected, Buffer.from(signature, "hex"));
}
function validPayment(payment, order) {
  return payment?.order_id === order.orderId && payment?.amount === PRO_PRICE && payment?.currency === "INR" && payment?.status === "captured" && order.amount === PRO_PRICE;
}
function dailyLimit(pro) { return pro ? 100 : 5; }
function dayKey(uid, now = new Date()) { return uid + ":" + now.toISOString().slice(0,10); }
module.exports = { PRO_PRICE, DAY, validSignature, validPayment, dailyLimit, dayKey };
