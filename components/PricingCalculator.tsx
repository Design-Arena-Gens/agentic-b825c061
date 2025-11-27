"use client";
import { useEffect, useMemo, useState } from "react";
import servicesData from "@/data/services.json";
import market from "@/data/competitors.json";
import { saveCahier, loadCahier, CahierDesCharges } from "./Storage";

type Region = "Qu?bec" | "Canada (hors QC)" | "USA";

type Service = {
  id: string;
  name: string;
  setupUSD: number;
  monthlyUSD: number;
  kpis: string[];
  description: string;
};

function getRegionMultiplier(region: Region): number {
  const found = market.regionalAdjustments.find((r) => r.region === region);
  return found ? found.multiplier : 1;
}

export function calculateTotals(
  selected: Array<{ id: string; quantity?: number }>,
  region: Region
) {
  const byId = new Map(servicesData.map((s) => [s.id, s as Service]));
  const m = getRegionMultiplier(region);
  let setup = 0;
  let monthly = 0;
  for (const item of selected) {
    const s = byId.get(item.id);
    if (!s) continue;
    const qty = Math.max(1, item.quantity ?? 1);
    setup += s.setupUSD * m * qty;
    monthly += s.monthlyUSD * m * qty;
  }
  // discount tiers for competitiveness
  const subtotal = setup + monthly;
  let discount = 0;
  if (subtotal > 6000) discount = 0.12;
  else if (subtotal > 3500) discount = 0.08;
  else if (subtotal > 2000) discount = 0.05;
  const total = Math.round((subtotal * (1 - discount)) * 100) / 100;
  return {
    setup: Math.round(setup * 100) / 100,
    monthly: Math.round(monthly * 100) / 100,
    discount,
    total
  };
}

export default function PricingCalculator() {
  const [region, setRegion] = useState<Region>("Qu?bec");
  const [selected, setSelected] = useState<Array<{ id: string; quantity?: number }>>([]);
  const [companyName, setCompanyName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const existing = loadCahier();
    if (existing) {
      setRegion(existing.region);
      setSelected(existing.services);
      setCompanyName(existing.companyName);
      setContactEmail(existing.contactEmail);
      setNotes(existing.notes ?? "");
    }
  }, []);

  const totals = useMemo(() => calculateTotals(selected, region), [selected, region]);

  function toggleService(id: string) {
    setSelected((prev) => {
      const found = prev.find((p) => p.id === id);
      if (found) return prev.filter((p) => p.id !== id);
      return [...prev, { id, quantity: 1 }];
    });
  }
  function setQuantity(id: string, qty: number) {
    setSelected((prev) => prev.map((p) => (p.id === id ? { ...p, quantity: qty } : p)));
  }
  function save() {
    const cahier: CahierDesCharges = {
      companyName,
      contactEmail,
      region,
      services: selected,
      notes
    };
    saveCahier(cahier);
    alert("Cahier des charges sauvegard? localement.");
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="card md:col-span-2">
        <h2 className="text-xl font-semibold">S?lection des services</h2>
        <div className="mt-4 grid gap-3">
          {servicesData.map((s) => {
            const active = selected.some((p) => p.id === s.id);
            return (
              <div key={s.id} className="rounded-lg border border-white/10 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-white/70">{s.description}</div>
                    <div className="mt-1 text-xs text-white/60">
                      Mise en place: ${s.setupUSD} | Mensuel: ${s.monthlyUSD}
                    </div>
                  </div>
                  <button
                    className={`btn ${active ? "btn-outline" : "btn-primary"}`}
                    onClick={() => toggleService(s.id)}
                  >
                    {active ? "Retirer" : "Ajouter"}
                  </button>
                </div>
                {active && (
                  <div className="mt-3 flex items-center gap-2">
                    <label className="text-sm text-white/80">Quantit?</label>
                    <input
                      type="number"
                      min={1}
                      className="w-20 rounded border border-white/20 bg-transparent px-2 py-1"
                      value={selected.find((p) => p.id === s.id)?.quantity ?? 1}
                      onChange={(e) => setQuantity(s.id, Math.max(1, Number(e.target.value)))}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold">Param?tres & Devis</h2>
        <div className="mt-3 space-y-3 text-sm">
          <div>
            <label className="block text-white/80">R?gion</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as Region)}
              className="mt-1 w-full rounded border border-white/20 bg-transparent px-2 py-1"
            >
              <option className="bg-[#0b1220]">Qu?bec</option>
              <option className="bg-[#0b1220]">Canada (hors QC)</option>
              <option className="bg-[#0b1220]">USA</option>
            </select>
          </div>
          <div>
            <label className="block text-white/80">Soci?t?</label>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="mt-1 w-full rounded border border-white/20 bg-transparent px-2 py-1"
              placeholder="Nom de l?entreprise"
            />
          </div>
          <div>
            <label className="block text-white/80">Email</label>
            <input
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="mt-1 w-full rounded border border-white/20 bg-transparent px-2 py-1"
              placeholder="contact@exemple.com"
            />
          </div>
          <div>
            <label className="block text-white/80">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded border border-white/20 bg-transparent px-2 py-1"
              placeholder="Besoins, objectifs, contraintes?"
            />
          </div>

          <div className="mt-4 rounded-lg border border-white/10 p-3">
            <div className="text-sm">Mise en place estim?e</div>
            <div className="text-2xl font-semibold">${totals.setup.toFixed(2)}</div>
            <div className="mt-2 text-sm">Mensuel estim?</div>
            <div className="text-2xl font-semibold">${totals.monthly.toFixed(2)}</div>
            {totals.discount > 0 && (
              <div className="mt-2 text-xs text-emerald-300">
                Remise comp?titive appliqu?e: {(totals.discount * 100).toFixed(0)}%
              </div>
            )}
            <div className="mt-3 text-sm">Total (1er mois)</div>
            <div className="text-3xl font-bold">${totals.total.toFixed(2)}</div>
          </div>

          <button className="btn btn-primary w-full" onClick={save}>
            Sauvegarder le cahier des charges
          </button>
        </div>
      </div>
    </div>
  );
}

