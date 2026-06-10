"use client";

import dynamic from "next/dynamic";

const StickyScrollSection = dynamic(
  () => import("@/components/StickyScrollSection"),
  { ssr: false }
);

export default function StickyScrollSectionClient() {
  return <StickyScrollSection />;
}
