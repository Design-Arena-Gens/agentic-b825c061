"use client";
import { useEffect, useState } from "react";
import { loadSettings, saveSettings } from "@/components/Storage";

export default function Parametres() {
  const [paymentLink, setPaymentLink] = useState("");

  useEffect(() => {
    const s = loadSettings();
    if (s.paymentLink) setPaymentLink(s.paymentLink);
  }, []);

  function save() {
    saveSettings({ paymentLink });
    alert("Param?tres enregistr?s localement.");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Param?tres</h1>
      <div className="card">
        <div className="font-medium">Lien de paiement (Stripe Payment Link, etc.)</div>
        <p className="mt-2 text-sm text-white/80">
          Collez un lien de paiement (ex: Stripe Payment Link). Il sera propos? aux clients lors de la signature.
        </p>
        <input
          value={paymentLink}
          onChange={(e) => setPaymentLink(e.target.value)}
          placeholder="https://pay.stripe.com/..."
          className="mt-3 w-full rounded border border-white/20 bg-transparent px-2 py-2"
        />
        <div className="mt-3">
          <button className="btn btn-primary" onClick={save}>
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

