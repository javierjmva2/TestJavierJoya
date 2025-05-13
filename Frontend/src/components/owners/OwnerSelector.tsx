import { useState, useEffect } from "react";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from "@headlessui/react";
import { OwnerList } from "../../types/OwnerList";

interface OwnerSelectorProps {
    owners: OwnerList[];
    selectedOwner: string | null;
    setSelectedOwner: (ownerId: string | null) => void;
    editMode: boolean;
}

export default function OwnerSelector({
    owners,
    selectedOwner,
    setSelectedOwner,
    editMode,
}: OwnerSelectorProps) {
    const [ownerSearch, setOwnerSearch] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    // Muestra todos si no hay búsqueda
    const filteredOwners = ownerSearch.trim()
        ? owners.filter((owner) =>
            owner.name.toLowerCase().includes(ownerSearch.toLowerCase())
        )
        : owners;

    // Actualiza el nombre en modo solo lectura
    useEffect(() => {
        const owner = owners.find((o) => o.id === selectedOwner);
        if (owner) {
            setDisplayName(owner.name);
            setOwnerSearch(owner.name);
        } else {
            setDisplayName("Sin dueño");
        }
    }, [selectedOwner, owners]);

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">Dueño</label>

            {editMode ? (
                 <Combobox value={selectedOwner} onChange={setSelectedOwner}>
                 <div className="relative">
                     {/* Campo de búsqueda */}
                     <input
                         type="text"
                         placeholder="Buscar dueño..."
                         value={ownerSearch}
                         onFocus={() => setIsOpen(true)}
                         onChange={(e) => setOwnerSearch(e.target.value)}
                         className="w-full border rounded px-3 py-2 text-black"
                     />

                     {/* Opciones del listado (Dueños) */}
                     {isOpen && filteredOwners.length > 0 && (
                         <ul className="absolute bg-white shadow-lg rounded-md mt-1 max-h-60 w-full overflow-auto z-10">
                             {filteredOwners.map((owner) => (
                                 <li
                                     key={owner.id}
                                     onClick={() => {
                                         setSelectedOwner(owner.id);
                                         setOwnerSearch(owner.name);
                                         setIsOpen(false); // Cierra el menú
                                     }}
                                     className="cursor-pointer select-none py-2 px-4 hover:bg-amber-600 hover:text-white"
                                 >
                                     {owner.name}
                                 </li>
                             ))}
                         </ul>
                     )}
                 </div>
             </Combobox>
            ) : (
                // Modo solo visualización
                <p className="text-gray-800">{displayName}</p>
            )}
        </div>
    );
}