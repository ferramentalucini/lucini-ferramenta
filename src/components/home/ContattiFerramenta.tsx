
import { Mail, Phone } from "lucide-react";

export default function ContattiFerramenta() {
  return (
    <section
      id="contatti"
      className="w-full py-14 px-5 bg-[#f9f6ef] border-b border-[#c1ad7a]"
    >
      <div className="max-w-2xl mx-auto bg-[#fcfaf5] p-8 rounded-md shadow-md border border-[#e0d1aa] flex flex-col items-center text-center">
        <h2 className="font-playfair text-xl md:text-2xl font-bold text-[#a0892c] mb-2">
          Contattaci
        </h2>
        <div className="text-[#6c613e] text-base font-sans mb-1">
          Ferramenta Lucini Srl<br />
          Via degli Artigiani 14, Como (CO)
        </div>
        <div className="flex flex-col gap-2 items-center mt-3">
          <div>
            <Mail className="inline -mt-1 mr-1 text-[#b08d37]" size={18} />
            <a
              href="mailto:info@ferramentalucini.it"
              className="underline text-[#b08d37] hover:text-[#7f6b30] ml-1"
            >
              info@ferramentalucini.it
            </a>
          </div>
          <div>
            <Phone className="inline -mt-1 mr-1 text-[#b08d37]" size={18} />
            <span className="ml-1">031 1234567</span>
          </div>
        </div>
      </div>
    </section>
  );
}
