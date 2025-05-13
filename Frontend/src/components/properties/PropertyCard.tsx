import { PropertySearch } from "../../types/PropertySearch";

interface Props {
    property: PropertySearch;
    onView?: (property: PropertySearch) => void;
}

export default function PropertyCard({ property, onView }: Props) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="bg-white shadow-lg rounded-xl p-4 border hover:shadow-xl transition">
            <h3 className="text-lg font-bold text-gray-800">{property.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{property.address}</p>
            <p className="text-sm text-gray-500 mt-1">{formatPrice(property.price)}</p>
            <div className="mt-4 flex gap-2">
                <button
                    className="bg-neutral-900 text-white px-3 py-1 rounded hover:bg-neutral-700 text-sm"
                    onClick={() => onView?.(property)}
                >
                    Ver
                </button>
            </div>
        </div>
    );
}