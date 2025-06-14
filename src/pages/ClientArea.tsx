
const ClientArea = () => {
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow animate-fade-in">
      <h2 className="text-2xl font-semibold mb-4 text-[#b43434]">Area Clienti</h2>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <div className="font-bold mb-1">Carrello</div>
          <div className="h-12 bg-gray-50 border rounded mb-3 flex items-center justify-center text-gray-400">[vuoto]</div>
        </div>
        <div>
          <div className="font-bold mb-1">Preferiti</div>
          <div className="h-12 bg-gray-50 border rounded mb-3 flex items-center justify-center text-gray-400">[nessun preferito]</div>
        </div>
        <div className="col-span-2">
          <div className="font-bold mb-1">Ordini effettuati</div>
          <div className="h-12 bg-gray-50 border rounded mb-3 flex items-center justify-center text-gray-400">[nessun ordine]</div>
        </div>
        <div className="col-span-2">
          <div className="font-bold mb-1">Chat assistenza</div>
          <div className="h-12 bg-gray-50 border rounded flex items-center justify-center text-gray-400">[Non ancora disponibile]</div>
        </div>
      </div>
    </div>
  );
};

export default ClientArea;
