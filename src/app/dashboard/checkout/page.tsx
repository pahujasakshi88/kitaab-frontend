"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useBook } from "@/hooks/useGuest";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import {
  useAddresses,
  useCreateAddress,
  useDeleteAddress,
} from "@/hooks/useAddresses";
import { usePlaceOrder, useCancelOrder } from "@/hooks/useOrders";
import { useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user.service";
import { deliveryFeeFor } from "@/lib/delivery";
const loadRazorpay = () =>
  new Promise<boolean>((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
const errMsg = (e: any) =>
  e?.response?.data?.message || e?.message || "Something went wrong";

const input =
  "w-full rounded-lg border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] px-3 py-2 text-sm outline-none focus:border-[color:var(--c-c66a45)]";

const emptyForm = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
};

function CheckoutContent() {
  const router = useRouter();
  const { data: cart, isLoading: cartLoading } = useCart();
  const params = useSearchParams();
  const buyId = params.get("buy") || "";
  const buyQty = Math.max(1, Number(params.get("qty")) || 1);
  const isDirect = !!buyId;
  const { data: buyBook, isLoading: bookLoading } = useBook(buyId);
  const { data: addresses = [], isLoading: addrLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const deleteAddress = useDeleteAddress();
  const place = usePlaceOrder();
  const cancelOrder = useCancelOrder();
  const qc = useQueryClient();
  const [payMethod, setPayMethod] = useState<"cod" | "online">("cod");
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");

  const items: any[] = isDirect
    ? buyBook
      ? [{ book: buyBook, quantity: buyQty }]
      : []
    : cart?.items || [];
  const total: number = isDirect
    ? (buyBook?.price || 0) * buyQty
    : cart?.total || 0;
  const deliveryFee = deliveryFeeFor(total);
  const grandTotal = total + deliveryFee;
  // user ne kuch nahi chuna to default (ya pehla) address
  const defaultId =
    addresses.find((a: any) => a.isDefault)?._id || addresses[0]?._id;
  const addressId =
    selected && addresses.some((a: any) => a._id === selected)
      ? selected
      : defaultId;

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const saveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    createAddress.mutate(form, {
      onSuccess: (a: any) => {
        setSelected(a._id);
        setForm(emptyForm);
        setShowForm(false);
      },
      onError: (err) => setFormError(errMsg(err)),
    });
  };

    const placeOrder = async () => {
      if (!addressId) return;
      setPayError("");
      const base = isDirect
        ? { addressId, bookId: buyId, quantity: buyQty }
        : { addressId };

      // Cash on Delivery
      if (payMethod === "cod") {
        place.mutate(
          { ...base, paymentMethod: "cod" },
          {
            onSuccess: (res: any) =>
              router.replace(`/dashboard/orders/${res.order._id}?placed=1`),
          },
        );
        return;
      }

      // Online (Razorpay)
      const loaded = await loadRazorpay();
      if (!loaded) {
        setPayError("Could not load Razorpay. Check your internet and retry.");
        return;
      }

      place.mutate(
        { ...base, paymentMethod: "online" },
        {
          onSuccess: (res: any) => {
            const { order, razorpay } = res;
            let paid = false;
            setPaying(true);

            const rzp = new (window as any).Razorpay({
              key: razorpay.keyId,
              amount: razorpay.amount,
              currency: razorpay.currency,
              order_id: razorpay.orderId,
              name: "Kitaab",
              description: `Order #${order.orderNumber}`,
              prefill: {
                contact: addresses.find((a: any) => a._id === addressId)?.phone,
              },
              theme: { color: "#8a4a2b" },
              handler: async (r: any) => {
                paid = true;
                try {
                  await userService.verifyPayment({
                    orderId: order._id,
                    razorpayOrderId: r.razorpay_order_id,
                    razorpayPaymentId: r.razorpay_payment_id,
                    razorpaySignature: r.razorpay_signature,
                  });
                  qc.invalidateQueries({ queryKey: ["cart"] });
                  qc.invalidateQueries({ queryKey: ["orders"] });
                  router.replace(`/dashboard/orders/${order._id}?placed=1`);
                } catch (e) {
                  setPaying(false);
                  setPayError(errMsg(e));
                }
              },
              modal: {
                ondismiss: () => {
                  if (paid) return;
                  setPaying(false);
                  cancelOrder.mutate(order._id); // stock wapas
                  setPayError("Payment cancelled. Your order was not placed.");
                },
              },
            });

            rzp.on("payment.failed", (resp: any) => {
              setPayError(
                resp?.error?.description || "Payment failed. Please try again.",
              );
            });
            rzp.open();
          },
        },
      );
    };

  if (cartLoading || addrLoading)
    return <p className="p-10 text-center">Loading...</p>;

  if (items.length === 0 && !place.isSuccess) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl bg-[color:var(--c-white)] p-12 text-center">
        <p className="text-[color:var(--c-77716a)]">Your cart is empty.</p>
        <Link href="/dashboard/books" className="mt-4 inline-block underline">
          Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-serif text-3xl font-semibold">Checkout</h1>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {/* Address */}
          <section className="rounded-2xl border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Delivery Address</h2>
              {!showForm && addresses.length < 5 && (
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-1 text-sm text-[color:var(--c-c66a45)]"
                >
                  <Plus size={14} /> Add New Address
                </button>
              )}
            </div>

            {addresses.length === 0 && !showForm && (
              <p className="text-sm text-[color:var(--c-77716a)]">
                Add a delivery address to continue.
              </p>
            )}

            <div className="space-y-3">
              {addresses.map((a: any) => (
                <label
                  key={a._id}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${
                    addressId === a._id
                      ? "border-[color:var(--c-c66a45)] bg-[color:var(--c-fbf4ee)]"
                      : "border-[color:var(--c-e5ded3)]"
                  }`}
                >
                  <input
                    type="radio"
                    checked={addressId === a._id}
                    onChange={() => setSelected(a._id)}
                    className="mt-1"
                  />
                  <div className="flex-1 text-sm">
                    <p className="font-medium">
                      {a.fullName}{" "}
                      {a.isDefault && (
                        <span className="ml-1 rounded bg-[color:var(--c-f1e3d3)] px-1.5 py-0.5 text-[10px] text-[color:var(--c-8a4a2b)]">
                          Default
                        </span>
                      )}
                    </p>
                    <p className="text-[color:var(--c-77716a)]">
                      {a.line1}
                      {a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} -{" "}
                      {a.pincode}
                    </p>
                    <p className="text-[color:var(--c-77716a)]">+91 {a.phone}</p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      if (confirm("Delete this address?"))
                        deleteAddress.mutate(a._id);
                    }}
                    className="text-[color:var(--c-77716a)] hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </label>
              ))}
            </div>

            {showForm && (
              <form
                onSubmit={saveAddress}
                className="mt-4 grid gap-3 sm:grid-cols-2"
              >
                {formError && (
                  <p className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700 sm:col-span-2">
                    {formError}
                  </p>
                )}
                <input
                  required
                  placeholder="Full name"
                  value={form.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                  className={input}
                />
                <input
                  required
                  placeholder="Mobile (10 digits)"
                  maxLength={10}
                  value={form.phone}
                  onChange={(e) =>
                    set("phone", e.target.value.replace(/\D/g, ""))
                  }
                  className={input}
                />
                <input
                  required
                  placeholder="House no, street"
                  value={form.line1}
                  onChange={(e) => set("line1", e.target.value)}
                  className={`${input} sm:col-span-2`}
                />
                <input
                  placeholder="Area, landmark (optional)"
                  value={form.line2}
                  onChange={(e) => set("line2", e.target.value)}
                  className={`${input} sm:col-span-2`}
                />
                <input
                  required
                  placeholder="City"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  className={input}
                />
                <input
                  required
                  placeholder="State"
                  value={form.state}
                  onChange={(e) => set("state", e.target.value)}
                  className={input}
                />
                <input
                  required
                  placeholder="Pincode"
                  maxLength={6}
                  value={form.pincode}
                  onChange={(e) =>
                    set("pincode", e.target.value.replace(/\D/g, ""))
                  }
                  className={input}
                />
                <div className="flex justify-end gap-3 sm:col-span-2">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="rounded-full border border-[color:var(--c-e5ded3)] px-5 py-2 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createAddress.isPending}
                    className="rounded-full bg-[#8a4a2b] px-6 py-2 text-sm font-medium text-white disabled:opacity-50"
                  >
                    {createAddress.isPending ? "Saving..." : "Save Address"}
                  </button>
                </div>
              </form>
            )}
          </section>

          {/* Payment */}
          <section className="rounded-2xl border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] p-6">
            <h2 className="mb-4 font-semibold">Payment Method</h2>
            <div className="space-y-2 text-sm">
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 ${
                  payMethod === "cod"
                    ? "border-[color:var(--c-c66a45)] bg-[color:var(--c-fbf4ee)]"
                    : "border-[color:var(--c-e5ded3)]"
                }`}
              >
                <input
                  type="radio"
                  checked={payMethod === "cod"}
                  onChange={() => setPayMethod("cod")}
                />{" "}
                Cash on Delivery
              </label>
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 ${
                  payMethod === "online"
                    ? "border-[color:var(--c-c66a45)] bg-[color:var(--c-fbf4ee)]"
                    : "border-[color:var(--c-e5ded3)]"
                }`}
              >
                <input
                  type="radio"
                  checked={payMethod === "online"}
                  onChange={() => setPayMethod("online")}
                />{" "}
                Pay Online (UPI / Card / Net Banking)
              </label>
            </div>
          </section>
        </div>

        {/* Summary */}
        <aside className="h-fit rounded-2xl border border-[color:var(--c-e5ded3)] bg-[color:var(--c-white)] p-6 lg:sticky lg:top-6">
          <h2 className="font-semibold">Order Summary</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.book._id} className="flex justify-between gap-3">
                <span className="truncate text-[color:var(--c-77716a)]">
                  {i.book.title} × {i.quantity}
                </span>
                <span>₹{i.book.price * i.quantity}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-[color:var(--c-e5ded3)] pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-[color:var(--c-77716a)]">Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[color:var(--c-77716a)]">Delivery</span>
              <span className="text-green-700">Free</span>
            </div>
            <div className="flex justify-between pt-2 text-base font-semibold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[color:var(--c-77716a)]">Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[color:var(--c-77716a)]">Delivery</span>
              {deliveryFee ? (
                <span>₹{deliveryFee}</span>
              ) : (
                <span className="text-green-700">Free</span>
              )}
            </div>
            <div className="flex justify-between pt-2 text-base font-semibold">
              <span>Total</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>

          {payError && (
            <p className="mt-4 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">
              {payError}
            </p>
          )}
          {place.isError && (
            <p className="mt-4 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">
              {errMsg(place.error)}
            </p>
          )}

          <button
            onClick={placeOrder}
            disabled={!addressId || place.isPending || paying}
            className="mt-5 w-full rounded-full bg-[#8a4a2b] py-3 text-sm font-medium text-white hover:bg-[#6f3a21] disabled:opacity-50"
          >
            {place.isPending
              ? "Please wait..."
              : payMethod === "online"
                ? "Pay & Place Order"
                : "Place Order"}{" "}
          </button>
          {!addressId && (
            <p className="mt-2 text-center text-xs text-[color:var(--c-77716a)]">
              Select or add an address first
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
export default function CheckoutPage() {
  return (
    <Suspense fallback={<p className="p-10 text-center">Loading...</p>}>
      <CheckoutContent />
    </Suspense>
  );
}