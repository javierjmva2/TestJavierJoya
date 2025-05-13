import { useState } from "react";
import toast from 'react-hot-toast';
import { getFilteredProperties } from "../services/PropertyService";
import PaginatedCardList from "../components/common/PaginatedCardList"
import PropertyCard from "../components/properties/PropertyCard";
import CardFiltersProperties from "../components/filters/CardFiltersProperties";
import { PropertySearch } from "../types/PropertySearch";
import PropertyModal from "../components/properties/PropertyModal";
import { OrderOption } from "../types/OrderOption";


const orderOptions: OrderOption[] = [
    { name: "Nombre ascendente", value: "Name_asc" },
    { name: "Nombre descendente", value: "Name_desc" },
    { name: "Precio ascendente", value: "Price_asc" },
    { name: "Precio descendente", value: "Price_desc" },
];
export default function Properties() {
    const [nameFilter, setNameFilter] = useState("");
    const [minPriceFilter, setMinPrice] = useState(0);
    const [maxPriceFilter, setMaxPrice] = useState(0);
    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reloadTrigger, setReloadTrigger] = useState(0);

    const [selectedOrder, setSelectedOrder] = useState<OrderOption>(orderOptions[0]);

    const handleOpenModal = (id: string) => {
        setSelectedPropertyId(id);
        setIsModalOpen(true);
    };
    return (
        <>
            <PaginatedCardList
                title="Propiedades"
                fetchData={(name, minPrice, maxPrice, orderBy, orderDir, page, pageSize) =>
                    getFilteredProperties(name, undefined, minPrice, maxPrice, orderBy, orderDir, page, pageSize)
                }
                renderItem={(property: PropertySearch) => (
                    <PropertyCard key={property.id} property={property} onView={() => handleOpenModal?.(property.id)} />
                )}
                FiltersComponent={
                    <CardFiltersProperties
                        nameFilter={nameFilter}
                        onNameChange={setNameFilter}
                        orderOptions={orderOptions}
                        selectedOrder={selectedOrder}
                        onOrderChange={setSelectedOrder}
                        minPrice={minPriceFilter}
                        maxPrice={maxPriceFilter}
                        onMinPriceChange={setMinPrice}
                        onMaxPriceChange={setMaxPrice}
                    />
                }
                nameFilter={nameFilter}
                minPriceFilter={minPriceFilter}
                maxPriceFilter={maxPriceFilter}
                onNewItem={() => {
                    // Se abre el modal para crear una nueva propiedad
                    handleOpenModal?.('');
                }}
                reloadTrigger={reloadTrigger}
                orderOption={selectedOrder}

            />
            <PropertyModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                propertyId={selectedPropertyId}
                onUpdated={() => {
                    setReloadTrigger(prev => prev + 1);
                    
                    if (selectedPropertyId && selectedPropertyId != null && selectedPropertyId != '') {
                        toast.success('Propiedad actualizada correctamente.');
                    } else {
                        toast.success('Se creó la propiedad correctamente.');
                    }
                }}
                onDelete={async (handle) => {
                    var response = await handle?.();
                    if (!response) {
                        toast.error('No se puede eliminar, contacte con el administrador');
                        return;
                    }

                    setReloadTrigger(prev => prev + 1);
                    toast.success('Propiedad eliminada correctamente.');
                }}
            />
        </>
    );
}