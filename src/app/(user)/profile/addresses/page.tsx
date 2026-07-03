"use client";

import { Suspense } from "react";
import AddressPageContent from "./AddressPageContent";

export default function AddressPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddressPageContent />
    </Suspense>
  );
}