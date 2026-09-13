import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { OwnerVerification } from "@/components/editor/OwnerVerification";

export const metadata: Metadata = { title: "Owner Access", robots: { index: false, follow: false } };

export default function OwnerPage() {
  return <Container className="py-20 sm:py-28"><OwnerVerification /></Container>;
}
