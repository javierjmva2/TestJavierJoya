import { useState } from "react";
import toast from 'react-hot-toast';
import { getFilteredOwners } from "../services/OwnerService";
import PaginatedCardList from "../components/common/PaginatedCardList"
import OwnerCard from "../components/owners/OwnerCard";
import CardFiltersOwners from "../components/filters/CardFiltersOwners";
import { OwnerSearch } from "../types/OwnerSearch";
import OwnerModal from "../components/owners/OwnerModal";

const orderOptions = [
    { name: "Nombre ascendente", value: "Name_asc" },
    { name: "Nombre descendente", value: "Name_desc" },
];

export default function Owners() {
    const [nameFilter, setNameFilter] = useState("");
    const [orderOption, setOrderOption] = useState(orderOptions[0]);
    const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reloadTrigger, setReloadTrigger] = useState(0);

    const handleOpenModal = (id: string) => {
        setSelectedOwnerId(id);
        setIsModalOpen(true);
    };
    return (
        <>
            <PaginatedCardList
                title="Dueños"
                fetchData={(name, minPrice, maxPrice, orderBy, orderDir, page, pageSize) =>
                    getFilteredOwners(name, undefined, orderBy, orderDir, page, pageSize)
                }
                renderItem={(owner: OwnerSearch) => (
                    <OwnerCard key={owner.id} owner={owner} onView={() => handleOpenModal?.(owner.id)} />
                )}
                FiltersComponent={
                    <CardFiltersOwners
                        nameFilter={nameFilter}
                        onNameChange={setNameFilter}
                        orderOptions={orderOptions}
                        selectedOrder={orderOption}
                        onOrderChange={setOrderOption}
                    />
                }
                nameFilter={nameFilter}
                minPriceFilter={0}
                maxPriceFilter={0}
                onNewItem={() => {
                    // Se abre el modal para crear un nuevo owner
                    handleOpenModal?.('');
                }}
                reloadTrigger={reloadTrigger}
                orderOption={orderOption}

            />
            <OwnerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                ownerId={selectedOwnerId}
                onUpdated={() => {
                    setReloadTrigger(prev => prev + 1);

                    if (selectedOwnerId && selectedOwnerId != null && selectedOwnerId != '') {
                        toast.success('Owner actualizado correctamente.');
                    } else {
                        toast.success('Se creó el Owner correctamente.');
                    }
                }}
                onDelete={async (handle) => {
                    var response = await handle?.();
                    if (!response) {
                        toast.error('No se puede eliminar, el owner tiene propiedades asignadas');
                        return;
                    }

                    setReloadTrigger(prev => prev + 1);
                    toast.success('Owner eliminado correctamente.');
                }}
            />
        </>
    );
}