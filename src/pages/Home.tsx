
import { useRef } from "react";

const products = [
  {
    title: "Trapano Bosch",
    desc: "Potente e compatto per lavori precisi e veloci.",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Martello Stanley",
    desc: "Affidabilità e resistenza per ogni lavoro.",
    img: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Set cacciaviti Wera",
    desc: "Tutto ciò che serve per avvitare in tranquillità.",
    img: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Chiavi a brugola Beta",
    desc: "Per lavori di precisione e qualità.",
    img: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=400&q=80",
  },
  {
    title: "Metro Stanley",
    desc: "Preciso ed ergonomico, sempre a portata di mano.",
    img: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=400&q=80",
  },
];

export default function Home() {
  // Riferimenti per lo scroll
  const inizioRef = useRef<HTMLDivElement>(null);
  const prodottiRef = useRef<HTMLDivElement>(null);
  const contattiRef = useRef<HTMLDivElement>(null);

  const handleScroll = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex flex-col">
      {/* Header fisso */}
      <header className="sticky top-0 left-0 z-50 bg-white shadow-lg w-full flex items-center justify-between px-8 py-4">
        <span className="text-xl md:text-3xl font-extrabold text-[#b43434] tracking-tight select-none">FerramentaPro</span>
        <nav className="flex gap-4 md:gap-8">
          <button onClick={() => handleScroll(inizioRef)} className="text-sm md:text-base text-[#b43434] font-semibold hover:underline transition">Inizio</button>
          <button onClick={() => handleScroll(prodottiRef)} className="text-sm md:text-base text-[#b43434] font-semibold hover:underline transition">Prodotti</button>
          <button onClick={() => handleScroll(contattiRef)} className="text-sm md:text-base text-[#b43434] font-semibold hover:underline transition">Contatti</button>
        </nav>
      </header>

      {/* Contenuto */}
      <main className="flex-1 w-full mx-auto">
        {/* Inizio */}
        <section ref={inizioRef} className="w-full max-w-6xl mx-auto pt-20 md:pt-32 pb-16 px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#b43434] mb-4 drop-shadow-lg">FerramentaPro</h1>
          <p className="text-lg md:text-2xl text-gray-700 max-w-2xl mx-auto">
            Il tuo punto di riferimento per ogni esigenza di ferramenta.<br/>
            Prodotti di qualità, assistenza rapida, passione nel lavoro.
          </p>
        </section>

        {/* Prodotti */}
        <section ref={prodottiRef} className="w-full max-w-6xl mx-auto py-10 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#b43434] mb-6 text-center">I nostri prodotti</h2>
          <div className="grid md:grid-cols-5 sm:grid-cols-2 grid-cols-1 gap-7">
            {products.map((p) => (
              <div key={p.title} className="rounded-xl shadow-md border bg-[#faf9f7] hover-scale transition overflow-hidden flex flex-col">
                <img src={p.img} alt={p.title} className="w-full h-36 object-cover" />
                <div className="p-4 flex-1 flex flex-col">
                  <div className="font-bold text-[#b43434] text-[19px] mb-2">{p.title}</div>
                  <div className="text-gray-600 text-sm flex-1">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <a
              href="/prodotti"
              className="bg-[#b43434] text-white font-semibold px-7 py-2 rounded-md shadow-md hover:bg-[#932a2a] transition active:scale-95 text-base"
            >
              Tutti i prodotti
            </a>
          </div>
        </section>

        {/* Contatti */}
        <section ref={contattiRef} className="w-full max-w-4xl mx-auto py-16 px-4 flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#b43434] mb-6 text-center">Contatti</h2>
          <div className="bg-white rounded-xl shadow-lg border p-8 w-full flex flex-col items-center">
            <div className="text-lg font-semibold mb-2">FerramentaPro Srl</div>
            <div className="text-gray-800 text-base">Via Utensili 10, Udine</div>
            <div className="text-gray-800 text-base">Email: <a href="mailto:info@ferramentapro.it" className="underline text-[#b43434]">info@ferramentapro.it</a></div>
            <div className="text-gray-800 text-base">Tel: 0432 000000</div>
            <div className="mt-4 text-sm text-gray-400">Powered by Lovable</div>
          </div>
        </section>
      </main>
    </div>
  );
}
