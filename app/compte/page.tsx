"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { loadCahier, saveCahier, CahierDesCharges, loadSettings } from "@/components/Storage";
import services from "@/data/services.json";
import market from "@/data/competitors.json";
import Signature from "@/components/Signature";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function Compte() {
  const [cahier, setCahier] = useState<CahierDesCharges | null>(null);
  const [sig, setSig] = useState<string | null>(null);
  const [signedAt, setSignedAt] = useState<string | null>(null);
  const [settings, setSettings] = useState<{ paymentLink?: string }>({});
  const summaryRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCahier(loadCahier());
    setSettings(loadSettings());
  }, []);

  const byId = useMemo(() => new Map(services.map((s) => [s.id, s])), []);

  function multiplier() {
    const found = market.regionalAdjustments.find((r) => r.region === cahier?.region);
    return found ? found.multiplier : 1;
  }
  const totals = useMemo(() => {
    if (!cahier) return { setup: 0, monthly: 0, total: 0 };
    let setup = 0;
    let monthly = 0;
    const m = multiplier();
    for (const it of cahier.services) {
      const s = byId.get(it.id);
      if (!s) continue;
      const qty = Math.max(1, it.quantity ?? 1);
      setup += s.setupUSD * m * qty;
      monthly += s.monthlyUSD * m * qty;
    }
    const subtotal = setup + monthly;
    let discount = 0;
    if (subtotal > 6000) discount = 0.12;
    else if (subtotal > 3500) discount = 0.08;
    else if (subtotal > 2000) discount = 0.05;
    const total = Math.round((subtotal * (1 - discount)) * 100) / 100;
    return { setup, monthly, total };
  }, [cahier, byId]);

  function saveSignature() {
    if (!cahier) return;
    const now = new Date().toISOString();
    const updated: CahierDesCharges = { ...cahier, signedDataUrl: sig ?? undefined, signedAt: now };
    saveCahier(updated);
    setSignedAt(now);
    setCahier(updated);
    alert("Signature enregistr?e au cahier des charges.");
  }

  async function exportPDF() {
    if (!summaryRef.current) return;
    const canvas = await html2canvas(summaryRef.current, { backgroundColor: "#0b1220", scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth - 40;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 20, 20, imgWidth, Math.min(imgHeight, pageHeight - 40));
    pdf.save(`Cahier-${cahier?.companyName ?? "client"}.pdf`);
  }

  function goPay() {
    const link = cahier?.paymentLink || settings.paymentLink;
    if (link) window.open(link, "_blank");
    else alert("Aucun lien de paiement configur?. Ajoutez-en via Param?tres.");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Compte & Signature</h1>
      {!cahier ? (
        <div className="card">
          <div className="text-sm text-white/80">
            Aucun cahier des charges trouv?. Cr?ez-le via l?onglet Devis, puis revenez ici pour signer et payer.
          </div>
        </div>
      ) : (
        <>
          <div ref={summaryRef} className="card">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold">{cahier.companyName}</div>
                <div className="text-sm text-white/70">{cahier.contactEmail}</div>
                <div className="text-sm text-white/70">R?gion: {cahier.region}</div>
              </div>
              <div className="text-right">
                <div className="text-sm">Mise en place: ${totals.setup.toFixed(2)}</div>
                <div className="text-sm">Mensuel: ${totals.monthly.toFixed(2)}</div>
                <div className="text-lg font-semibold">Total 1er mois: ${totals.total.toFixed(2)}</div>
              </div>
            </div>
            <div className="mt-3 border-t border-white/10 pt-3">
              <div className="font-medium">Services</div>
              <ul className="mt-2 text-sm text-white/80 space-y-1">
                {cahier.services.map((it, idx) => {
                  const s = byId.get(it.id);
                  if (!s) return null;
                  return (
                    <li key={idx} className="flex justify-between">
                      <span>
                        {s.name} {it.quantity && it.quantity > 1 ? `? ${it.quantity}` : ""}
                      </span>
                      <span>
                        ${s.setupUSD} setup | {s.monthlyUSD > 0 ? `$${s.monthlyUSD}/mois` : "Sans abonnement"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            {cahier.notes && (
              <div className="mt-3">
                <div className="font-medium">Notes</div>
                <div className="text-sm text-white/80">{cahier.notes}</div>
              </div>
            )}
            {(cahier.signedDataUrl || sig) && (
              <div className="mt-4">
                <div className="text-sm text-white/80">Signature</div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sig ?? cahier.signedDataUrl ?? ""}
                  alt="Signature"
                  className="mt-2 h-16"
                />
                <div className="text-xs text-white/60">
                  {signedAt || cahier.signedAt ? `Sign? le ${new Date(signedAt || cahier.signedAt || "").toLocaleString()}` : ""}
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <div className="font-semibold">Signer le cahier des charges</div>
            <p className="mt-2 text-sm text-white/80">
              Signez ci-dessous pour valider le p?rim?tre et lancer la mise en ?uvre.
            </p>
            <div className="mt-3">
              <Signature onChange={setSig} />
            </div>
            <div className="mt-3 flex gap-2">
              <button className="btn btn-primary" onClick={saveSignature} disabled={!sig}>
                Enregistrer la signature
              </button>
              <button className="btn btn-outline" onClick={exportPDF}>
                Exporter en PDF
              </button>
              <button className="btn btn-outline" onClick={goPay}>
                Proc?der au paiement
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

