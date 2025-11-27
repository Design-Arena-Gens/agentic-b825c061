import services from "@/data/services.json";

export const dynamic = "force-static";

export default function Services() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Catalogue des services IA Marketing</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {services.map((s) => (
          <div key={s.id} className="card">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold">{s.name}</div>
                <div className="mt-1 text-sm text-white/80">{s.description}</div>
              </div>
              <div className="text-right text-sm">
                <div className="font-medium">${s.setupUSD} setup</div>
                <div className="text-white/70">
                  {s.monthlyUSD > 0 ? `$${s.monthlyUSD}/mois` : "Sans abonnement"}
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-white/70">
              KPIs: {s.kpis.join(", ")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

