import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(req: NextRequest) {
  const session_id = req.nextUrl.searchParams.get("session_id");
  if (!session_id) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items.data.price.product"],
    });

    const items = (session.line_items?.data || []).map((item: any) => ({
      id: item.price.product.id,
      name: item.price.product.name,
      quantity: item.quantity,
      price: item.price.unit_amount,
      image: item.price.product.images?.[0] || null,
    }));

    return NextResponse.json({
      id: session.id,
      amount_total: session.amount_total,
      currency: session.currency,
      items,
      customer_email: session.customer_email,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unable to fetch session" }, { status: 500 });
  }
}