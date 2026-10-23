import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { OutletPublic } from "@/lib/types";

export function OutletCard({ outlet }: { outlet: OutletPublic }) {
  return (
    <Link href={`/dashboard/${outlet.slug}`} className="group block overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-fluent-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fluent-brand-primary">
      <div className="relative aspect-square overflow-hidden bg-fluent-neutral-bg-3">
        <Image src="/assets/outlets/outlet-placeholder.svg" alt={`${outlet.name} outlet`} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />
        <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-fluent-text-primary backdrop-blur"><MapPin className="h-3 w-3 text-fluent-brand-primary" /> Campus outlet</span>
      </div>
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0">
          <h2 className="font-semibold text-fluent-text-primary">{outlet.name}</h2>
          <p className="mt-1 line-clamp-2 text-sm text-fluent-text-secondary">{outlet.description ?? "Browse today's menu and pre-order your favourites."}</p>
        </div>
        <ArrowUpRight className="mt-0.5 h-5 w-5 shrink-0 text-fluent-text-secondary transition group-hover:text-fluent-brand-primary" aria-hidden="true" />
      </div>
    </Link>
  );
}
