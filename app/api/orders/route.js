import { NextResponse } from "next/server";
import connectDB from "@/app/database/connectDB";
import OrderList from "@/app/models/orderList.model";

// GET: Fetch all orders
export async function GET(request) {
  try {
    await connectDB();

    // querying the all cars
    const cars = await OrderList.find({});

    // sending a successfull response
    return NextResponse.json(cars, { status: 200 });
  } catch (error) {
    // sending an errorI response
    console.error("Error fetching cars data:", error);
    return NextResponse.json(
      { message: "Failed to fetch cars" },
      { status: 500 },
    );
  }
}

// POST: Create a orderList
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();

    // validation
    if (!body) {
      return NextResponse.json(
        { message: "Missing required order data fields" },
        { status: 400 },
      );
    }

    const newOrderList = new OrderList({
      buyerId: body.buyerId,
      buyerName: body.buyerName,
      buyerEmail: body.buyerEmail,
      brand: body.brand,
      carName: body.carName,
      modelName: body.modelName,
      price: body.price,
      image: body.image,
      paymentStatus: body.paymentStatus,
      orderStatus: body.orderStatus,
      transactionId: body.transactionId,
    });

    await newOrderList.save();

    // sending a successfull response
    return NextResponse.json(newOrderList, { status: 201 });
  } catch (error) {
    // sending an error response
    console.error("Error creating a OrderList data:", error);
    return NextResponse.json(
      { message: "Failed to create OrderList" },
      { status: 500 },
    );
  }
}

// PATCH: Update order status
export async function PATCH(request) {
  try {
    await connectDB();
    const body = await request.json();

    const { id, orderStatus } = body;

    if (!id || !orderStatus) {
      return NextResponse.json(
        { message: "Missing required fields: id and orderStatus" },
        { status: 400 },
      );
    }

    // "Pending" added — matches your actual data
    const VALID_STATUSES = ["Pending", "Processing", "Delivered", "Cancelled"];
    if (!VALID_STATUSES.includes(orderStatus)) {
      return NextResponse.json(
        {
          message: `Invalid orderStatus. Must be one of: ${VALID_STATUSES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const updatedOrder = await OrderList.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true },
    );

    if (!updatedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json(
      { message: "Failed to update order status" },
      { status: 500 },
    );
  }
}
