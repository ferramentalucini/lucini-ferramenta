
import { Mail, Phone } from "lucide-react";

export default function ContattiFerramenta() {
  return (
    <section
      id="contatti"
      className="w-full py-12 px-5 bg-cemento border-b border-cemento"
    >
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-md shadow-rustic-card border-2 border-cemento flex flex-col items-center text-center">
        <h2 className="font-playfair text-xl md:text-2xl font-bold text-verdeFerramenta mb-2">
          Contattaci
        </h2>
        <div className="text-noce text-base font-sans mb-1">
          Ferramenta Lucini Srl<br />
          Via degli Artigiani 14, Como (CO)
        </div>
        <div className="flex flex-col gap-2 items-center mt-3">
          <div>
            <Mail className="inline -mt-1 mr-1 text-verdeFerramenta" size={18} />
            <a
              href="mailto:info@ferramentalucini.it"
              className="underline text-verdeFerramenta hover:text-noce ml-1"
            >
              info@ferramentalucini.it
            </a>
          </div>
          <div>
            <Phone className="inline -mt-1 mr-1 text-verdeFerramenta" size={18} />
            <span className="ml-1">031 1234567</span>
          </div>
        </div>
      </div>
    </section>
  );
}
