import dynamic from "next/dynamic";

const PricingCalculator = dynamic(() => import("@/components/PricingCalculator"), {
  ssr: false
});

export default function Devis() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Calculateur de devis</h1>
      <PricingCalculator />
    </div>
  );
}

