import { NextResponse } from "next/server";
import connectDB from "@/app/database/connectDB";
import Order from "@/app/models/orderList.model";
import TransactionList from "@/app/models/transactionList.model";

export async function POST(request) {
  try {
    await connectDB();

    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());

    console.log("Payment Success:", data);

    const { tran_id, amount, card_issuer, currency } = data;

    // Find the order by transaction ID
    const order = await Order.findOne({ transactionId: tran_id });

    if (!order) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASEURL}/payments/failed`,
        302,
      );
    }

    // Update the order status
    order.paymentStatus = "Paid";
    order.orderStatus = "Processing";
    await order.save();

    // Create a new transaction record
    await TransactionList.create({
      userId: order.buyerId,
      buyerName: order.buyerName,
      buyerEmail: order.buyerEmail,
      transactionId: tran_id,
      paymentStatus: "Paid",
      orderStatus: "Processing",
      brand: order.brand,
      carName: order.carName,
      modelName: order.modelName,
      amount,
      card_issuer,
      currency,
    });

    // console.log("ok")
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASEURL}/payments/success`,
      302,
    );
  } catch (error) {
    console.error("Payment success handler error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASEURL}/payments/failed`,
      302,
    );
  }
}
