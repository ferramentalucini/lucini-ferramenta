
import { Hammer, Wrench } from "lucide-react";

export default function ContattiFerramenta() {
  return (
    <section
      id="contatti"
      className="w-full py-12 px-5 bg-antracite border-t border-cemento"
    >
      <div className="max-w-2xl mx-auto bg-bianco p-8 rounded-lg card-blocco flex flex-col items-center text-center shadow-lg ">
        <h2 className="font-oswald text-xl md:text-2xl font-bold text-verdesalvia mb-2 font-header flex items-center gap-2">
          <Hammer size={21} className="text-ruggine" />
          Contattaci
        </h2>
        <div className="text-cemento text-base font-lato mb-1">
          Ferramenta Lucini Srl<br />
          Via degli Artigiani 14, Como (CO)
        </div>
        <div className="flex flex-col gap-2 items-center mt-3">
          <div className="flex items-center text-antracite">
            <Wrench className="inline -mt-1 mr-1 text-senape" size={19} />
            <a
              href="mailto:info@ferramentalucini.it"
              className="underline text-ruggine hover:text-senape ml-1"
            >
              info@ferramentalucini.it
            </a>
          </div>
          <div className="text-antracite flex items-center">
            <Hammer className="inline -mt-1 mr-1 text-verdesalvia" size={18} />
            <span className="ml-1">031 1234567</span>
          </div>
        </div>
      </div>
    </section>
  );
}

