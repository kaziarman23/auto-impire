import { NextResponse } from "next/server";
import Order from "@/app/models/orderList.model";
import TransactionList from "@/app/models/transactionList.model";

export async function POST(request) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());

  console.log("Payment Failed:", data);

  const { tran_id, amount, card_issuer, currency } = data;

  // Find the order by transaction ID
  const order = await Order.findOne({ transactionId: tran_id });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Update the order status
  order.paymentStatus = "Failed";
  order.orderStatus = "Failed";
  await order.save();

  // Create a transaction record for the failed payment
  await TransactionList.create({
    userId: order.buyerId,
    buyerName: order.buyerName,
    buyerEmail: order.buyerEmail,
    transactionId: tran_id,
    paymentStatus: "Failed",
    orderStatus: "Failed",
    brand: order.brand,
    carName: order.carName,
    modelName: order.modelName,
    amount,
    card_issuer,
    currency,
  });

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_BASEURL}/payments/fail`,
    302,
  );
}
