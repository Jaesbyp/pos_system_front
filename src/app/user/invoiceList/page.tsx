"use client";
import React from "react";
import Invoices from "@/components/allInvoice";
import PageContainer from "@/components/pages/page-container";

export default function page() {
  return (
    <PageContainer>
      <Invoices />
    </PageContainer>
  );
}
