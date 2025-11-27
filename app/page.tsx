import Link from "next/link";

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="card">
        <h1 className="text-3xl font-semibold">
          Marketing Digital via l?IA ? Qu?bec & Am?rique du Nord
        </h1>
        <p className="mt-3 text-white/80">
          ?tude concurrentielle cibl?e, configurateur de devis comp?titif,
          signature ?lectronique et paiements param?trables. Pens? pour la
          publicit? sur les r?seaux sociaux et l?automatisation de bout en bout.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/etude" className="btn btn-outline">
            Voir l??tude
          </Link>
          <Link href="/devis" className="btn btn-primary">
            Calculer un devis
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="card">
          <h3 className="font-semibold">Services les plus demand?s</h3>
          <ul className="mt-3 list-disc pl-5 text-sm text-white/80 space-y-1">
            <li>Publicit? Meta/Instagram pilot?e par IA</li>
            <li>SEO & Contenu g?n?ratif</li>
            <li>Automatisations CRM & Chatbots</li>
            <li>Cr?ation Landing Pages orient?es ROI</li>
          </ul>
        </div>
        <div className="card">
          <h3 className="font-semibold">Automatisation</h3>
          <p className="mt-3 text-sm text-white/80">
            De la collecte du cahier des charges ? la signature ?lectronique et
            au paiement, tout est fluide et tra?able.
          </p>
        </div>
        <div className="card">
          <h3 className="font-semibold">Tarifs comp?titifs</h3>
          <p className="mt-3 text-sm text-white/80">
            Notre moteur de calcul aligne vos offres sur le march? nord-am?ricain
            en optimisant co?t/valeur par service et r?gion.
          </p>
        </div>
      </section>
    </div>
  );
}

