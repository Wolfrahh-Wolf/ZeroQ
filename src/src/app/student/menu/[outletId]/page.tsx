// Phase 2 — Menu Page (Grouped Grid, Category Filters, Search, Sticky Desktop Cart & Mobile Floating Bar)
"use client";
import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Minus, Plus, ShoppingCart, Search, Utensils, Check, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import type { MenuItem } from "@/lib/types";

export default function MenuPage({ params }: { params: Promise<{ outletId: string }> }) {
  const { outletId } = use(params);
  const router = useRouter();
  const { state, dispatch, totalItems, totalAmount } = useCart();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [outletName, setOutletName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch(`/api/outlets/${outletId}/menu`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // Get outlet name from outlets API
    fetch("/api/outlets")
      .then((r) => r.json())
      .then((outlets: { outlet_id: number; name: string }[]) => {
        const found = outlets.find((o) => o.outlet_id === Number(outletId));
        if (found) {
          setOutletName(found.name);
          dispatch({ type: "SET_OUTLET", outletId: found.outlet_id, outletName: found.name });
        }
      })
      .catch(console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outletId]);

  // Unique categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => {
      if (i.category) set.add(i.category);
    });
    return ["ALL", ...Array.from(set)];
  }, [items]);

  // Filtered items based on Category & Search
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchCat = selectedCategory === "ALL" || item.category === selectedCategory;
      const matchSearch = !searchQuery.trim() ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  // Grouped by Category for display
  const grouped = useMemo(() => {
    const map: Record<string, MenuItem[]> = {};
    filteredItems.forEach((item) => {
      const cat = item.category ?? "General";
      if (!map[cat]) map[cat] = [];
      map[cat].push(item);
    });
    return map;
  }, [filteredItems]);

  function getQty(itemId: number) {
    return state.items.find((i) => i.item_id === itemId)?.quantity ?? 0;
  }

  function add(item: MenuItem) {
    dispatch({
      type: "ADD",
      item: { item_id: item.item_id, name: item.name, price: item.price, quantity: 1, outlet_id: Number(outletId) },
    });
  }

  function increment(itemId: number) {
    dispatch({ type: "INCREMENT", itemId });
  }

  function decrement(itemId: number) {
    const qty = getQty(itemId);
    if (qty <= 1) dispatch({ type: "REMOVE", itemId });
    else dispatch({ type: "DECREMENT", itemId });
  }

  return (
    <main className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto pb-32 lg:pb-16">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 fade-in">
        <div className="flex items-center gap-3">
          <Link
            href="/student/outlets"
            className="p-2.5 rounded-xl glass-card text-slate-400 hover:text-slate-100 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
              <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">Taking Orders</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">{outletName || "Menu"}</h1>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl glass-card w-full sm:w-72">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search food, beverages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-sm text-slate-100 outline-none w-full placeholder-slate-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="text-xs text-slate-500 hover:text-slate-300">
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar fade-in">
        {categories.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                active
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400"
                  : "glass-card text-slate-400 hover:text-slate-200 hover:bg-white/5"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Main Content Layout: Grid on Left (8/12), Sticky Cart on Right (4/12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Menu Items Area */}
        <div className="lg:col-span-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass-card h-44 shimmer" />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="glass-card p-12 text-center fade-in">
              <Utensils size={36} className="text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm font-medium">No dishes found matching your selection.</p>
              <button
                onClick={() => { setSelectedCategory("ALL"); setSearchQuery(""); }}
                className="mt-4 px-4 py-2 text-xs font-semibold text-indigo-400 underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="space-y-10 fade-in">
              {Object.entries(grouped).map(([category, catItems]) => (
                <section key={category}>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                      {category}
                    </h2>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400 font-medium">
                      {catItems.length}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {catItems.map((item) => {
                      const qty = getQty(item.item_id);
                      return (
                        <div
                          key={item.item_id}
                          className={`glass-card p-5 flex flex-col justify-between transition-all relative overflow-hidden group ${
                            qty > 0 ? "border-indigo-500/50 shadow-lg shadow-indigo-500/10" : ""
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="font-semibold text-slate-100 text-base group-hover:text-white transition-colors">
                                {item.name}
                              </h3>
                              <span className="text-base font-bold text-indigo-400 whitespace-nowrap">
                                ₹{item.price}
                              </span>
                            </div>
                            {item.description && (
                              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                                {item.description}
                              </p>
                            )}
                          </div>

                          {/* Stepper or Add Button */}
                          <div className="pt-2 flex items-center justify-between border-t border-white/5 mt-auto">
                            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">
                              {item.category}
                            </span>

                            {qty === 0 ? (
                              <button
                                id={`item-add-${item.item_id}`}
                                onClick={() => add(item)}
                                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/30"
                              >
                                <Plus size={14} /> Add
                              </button>
                            ) : (
                              <div className="flex items-center gap-2 bg-indigo-950/60 border border-indigo-500/40 rounded-xl p-1">
                                <button
                                  id={`item-qty-dec-${item.item_id}`}
                                  onClick={() => decrement(item.item_id)}
                                  className="w-6 h-6 rounded-lg flex items-center justify-center text-indigo-300 hover:bg-indigo-800/50 transition-colors"
                                >
                                  <Minus size={12} />
                                </button>
                                <span className="w-5 text-center text-xs font-bold text-white">
                                  {qty}
                                </span>
                                <button
                                  id={`item-qty-inc-${item.item_id}`}
                                  onClick={() => increment(item.item_id)}
                                  className="w-6 h-6 rounded-lg flex items-center justify-center text-indigo-300 hover:bg-indigo-800/50 transition-colors"
                                >
                                  <Plus size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Sticky Cart Sidebar (Hidden on mobile, visible on lg+) */}
        <div className="hidden lg:block lg:col-span-4">
          <div className="sticky top-8 glass-card p-6 flex flex-col justify-between max-h-[calc(100vh-6rem)] overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={18} className="text-indigo-400" />
                  <h2 className="text-lg font-bold text-slate-100">My Tray</h2>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold text-indigo-300 bg-indigo-500/20">
                  {totalItems} items
                </span>
              </div>

              {state.items.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-slate-500">
                    <ShoppingCart size={22} />
                  </div>
                  <p className="text-sm font-medium text-slate-300">Your tray is empty</p>
                  <p className="text-xs text-slate-500 mt-1">Add items from the menu to pre-order</p>
                </div>
              ) : (
                <div className="space-y-3.5 mb-6 max-h-72 overflow-y-auto pr-1">
                  {state.items.map((item) => (
                    <div key={item.item_id} className="flex items-center justify-between gap-3 p-2 rounded-xl bg-white/[0.02]">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-200 truncate">{item.name}</p>
                        <p className="text-xs text-indigo-400">₹{item.price * item.quantity} (₹{item.price} each)</p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-lg p-0.5">
                        <button
                          onClick={() => decrement(item.item_id)}
                          className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-4 text-center text-xs font-bold text-slate-100">{item.quantity}</span>
                        <button
                          onClick={() => increment(item.item_id)}
                          className="w-5 h-5 flex items-center justify-center text-slate-400 hover:text-white"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {state.items.length > 0 && (
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span className="font-semibold text-slate-200">₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Canteen Pre-order Fee</span>
                    <span className="text-emerald-400 font-semibold">FREE (₹0)</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-sm font-bold text-slate-200">Total to Pay</span>
                  <span className="text-xl font-extrabold text-white">₹{totalAmount}</span>
                </div>

                <button
                  onClick={() => router.push("/student/checkout")}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Bottom Cart Bar for Mobile (< lg) */}
      {totalItems > 0 && (
        <div className="lg:hidden fixed bottom-6 inset-x-4 z-40 max-w-xl mx-auto fade-in">
          <button
            id="view-cart-btn"
            onClick={() => router.push("/student/checkout")}
            className="w-full glass-card p-4 flex items-center justify-between shadow-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.95), rgba(139,92,246,0.95))",
              borderColor: "rgba(255,255,255,0.2)",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center">
                <ShoppingCart size={18} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-xs text-indigo-100 font-medium">{totalItems} item{totalItems > 1 ? "s" : ""}</p>
                <p className="text-base font-bold text-white">₹{totalAmount}</p>
              </div>
            </div>
            <span className="font-bold text-sm text-white flex items-center gap-1.5">
              View Cart →
            </span>
          </button>
        </div>
      )}
    </main>
  );
}
