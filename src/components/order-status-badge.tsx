import { Badge } from "@/components/ui/badge";
import type { MyOrder } from "@/lib/types";

const statusPresentation: Record<MyOrder["status"], { label: string; className: string }> = {
  ORDERED: {
    label: "Ordered",
    className: "border-[#FADA83] bg-[#FFF4CE] text-[#835C00] dark:border-[#7a5c00] dark:bg-[#3a2f00] dark:text-[#fad24d]",
  },
  READY: {
    label: "Ready for pickup",
    className: "border-[#82C978] bg-[#DFF6DD] text-[#107C10] dark:border-[#2d7a3a] dark:bg-[#0d3314] dark:text-[#6fcf97]",
  },
  DELIVERED: {
    label: "Delivered",
    className: "border-[#83BFEC] bg-[#DEECF9] text-[#0078D4] dark:border-[#1a6fb5] dark:bg-[#052c4a] dark:text-[#479ef5]",
  },
};

export function OrderStatusBadge({ status }: { status: MyOrder["status"] }) {
  const presentation = statusPresentation[status];
  return <Badge className={`border ${presentation.className}`}>{presentation.label}</Badge>;
}
