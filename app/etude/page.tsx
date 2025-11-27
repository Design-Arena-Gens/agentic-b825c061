import data from "@/data/competitors.json";

export const dynamic = "force-static";

export default function Etude() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">?tude concurrentielle (Qu?bec & Am?rique du Nord)</h1>
      <div className="card">
        <div className="text-sm text-white/70">
          Mise ? jour: {data.updatedAt} ? R?gion: {data.region} ? Focalis?e:{" "}
          {data.focus}
        </div>
        <h2 className="mt-4 font-semibold">Synth?se</h2>
        <p className="mt-2 text-sm text-white/80">
          Les services les plus demand?s se concentrent sur la performance publicitaire
          sociale, la production de contenu assist?e par IA et l?automatisation des
          parcours de conversion. Les fourchettes tarifaires observ?es confirment un
          positionnement comp?titif en-dessous des m?dianes am?ricaines pour le Qu?bec
          (multiplicateur ? {data.regionalAdjustments.find(r => r.region === "Qu?bec")?.multiplier}).
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="card">
          <h3 className="font-semibold">Segments & fourchettes mensuelles</h3>
          <ul className="mt-3 space-y-3 text-sm">
            {data.segments.map((s) => (
              <li key={s.name} className="rounded border border-white/10 p-3">
                <div className="font-medium">{s.name}</div>
                <div className="text-white/70">
                  ${s.priceRangeMonthlyUSD[0]} ? ${s.priceRangeMonthlyUSD[1]} / mois
                </div>
                <div className="mt-2 text-white/80">
                  <span className="text-white/60">Top services:</span>{" "}
                  {s.topServices.join(", ")}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="card">
          <h3 className="font-semibold">Benchmarks par service</h3>
          <ul className="mt-3 space-y-3 text-sm">
            {data.serviceBenchmarks.map((b) => (
              <li key={b.service} className="flex items-center justify-between rounded border border-white/10 p-3">
                <div>
                  <div className="font-medium">{b.service}</div>
                  <div className="text-white/70 text-xs">Setup m?dian / Mensuel m?dian</div>
                </div>
                <div className="text-right">
                  <div>${b.medianSetupUSD}</div>
                  <div className="text-white/70">${b.medianMonthlyUSD}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold">Top 5 services ? offrir</h3>
        <ol className="mt-3 list-decimal pl-6 text-sm text-white/80 space-y-1">
          {data.mostDemanded.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}

