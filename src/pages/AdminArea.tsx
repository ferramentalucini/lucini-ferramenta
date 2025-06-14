
const AdminArea = ({ userRole }: { userRole: string }) => {
  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow animate-fade-in">
      <h2 className="text-2xl font-semibold mb-4 text-[#b43434]">Pannello di Amministrazione</h2>
      <div className="text-gray-700 mb-6">
        Sei loggato come <span className="font-bold">{userRole}</span>.
      </div>
      <ol className="list-decimal pl-8 mb-5 space-y-2">
        {userRole === "Super Amministratore" && (
          <li>Gestione permessi degli amministratori</li>
        )}
        {(userRole === "Amministratore" || userRole === "Super Amministratore") && (
          <li>Pubblicazione Modifiche (Mod. Approva/Rifiuta)</li>
        )}
        {(userRole === "Moderato" ||
          userRole === "Amministratore" ||
          userRole === "Super Amministratore") && (
          <li>Editor prodotti (crea/modifica/richiedi approvazione)</li>
        )}
        <li>
          Chat interna staff
          <span className="text-xs text-gray-400 ml-2">(prossimamente)</span>
        </li>
        <li>Gestione prodotti/categorie</li>
        <li>Visualizza richieste approvazione</li>
      </ol>
      <div className="text-gray-400 text-sm">
        Funzionalità avanzate saranno attivate con Supabase ⚡
      </div>
    </div>
  );
};

export default AdminArea;
