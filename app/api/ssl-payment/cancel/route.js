import { NextResponse } from "next/server";
import Order from "@/app/models/orderList.model";
import TransactionList from "@/app/models/transactionList.model";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());

    console.log("Payment Canceled:", data);

    const { tran_id, amount, card_issuer, currency } = data;

    // Find the order by transaction ID
    const order = await Order.findOne({ transactionId: tran_id });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update order to canceled
    order.paymentStatus = "Canceled";
    order.orderStatus = "Canceled";
    await order.save();

    // Create a transaction record for the canceled payment
    await TransactionList.create({
      userId: order.buyerId,
      buyerName: order.buyerName,
      buyerEmail: order.buyerEmail,
      transactionId: tran_id,
      paymentStatus: "Canceled",
      orderStatus: "Canceled",
      brand: order.brand,
      carName: order.carName,
      modelName: order.modelName,
      amount,
      card_issuer,
      currency,
    });

    // Redirect to a cancel page
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASEURL}/payments/cancel`,
      302,
    );
  } catch (error) {
    console.error("Cancel Route Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
