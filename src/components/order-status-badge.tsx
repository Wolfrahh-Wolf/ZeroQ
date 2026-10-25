import { Badge } from "@/components/ui/badge";
import type { MyOrder } from "@/lib/types";

const statusPresentation: Record<MyOrder["status"], { label: string; className: string }> = {
  ORDERED: { label: "Ordered", className: "border-[#FADA83] bg-[#FFF4CE] text-[#835C00]" },
  READY: { label: "Ready for pickup", className: "border-[#82C978] bg-[#DFF6DD] text-[#107C10]" },
  DELIVERED: { label: "Delivered", className: "border-[#83BFEC] bg-[#DEECF9] text-[#0078D4]" },
};

export function OrderStatusBadge({ status }: { status: MyOrder["status"] }) {
  const presentation = statusPresentation[status];
  return <Badge className={`border ${presentation.className}`}>{presentation.label}</Badge>;
}
