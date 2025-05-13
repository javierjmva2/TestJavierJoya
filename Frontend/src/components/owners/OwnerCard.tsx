import { OwnerSearch } from "../../types/OwnerSearch";

interface Props {
  owner: OwnerSearch;
  onView?: (owner: OwnerSearch) => void;
}

export default function OwnerCard({ owner, onView }: Props) {
  return (
    <div className="bg-white shadow-lg rounded-xl p-4 border hover:shadow-xl transition">
      <h3 className="text-lg font-bold text-gray-800">{owner.name}</h3>
      <p className="text-sm text-gray-500 mt-1">{owner.address}</p>
      <div className="mt-4 flex gap-2">
        <button
          className="bg-neutral-900 text-white px-3 py-1 rounded hover:bg-neutral-700 text-sm"
          onClick={() => onView?.(owner)}
        >
          Ver
        </button>        
      </div>
    </div>
  );
}