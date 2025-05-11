import React from "react";
import { useRouter } from "next/router";

export default function Failure() {
  const router = useRouter();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <h1 style={{ color: '#d32f2f' }}>Payment Failed</h1>
      <p>Unfortunately, your payment or subscription could not be completed.</p>
      <button
        style={{ marginTop: 24, padding: '10px 24px', fontSize: 16, background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
        onClick={() => router.push('/pricing')}
      >
        Back to Pricing
      </button>
    </div>
  );
} 