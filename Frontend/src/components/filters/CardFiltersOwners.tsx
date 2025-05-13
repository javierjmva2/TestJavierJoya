import {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  } from "@headlessui/react";
import { OrderOption } from "../../types/OrderOption";
    
  interface Props {
    nameFilter: string;
    onNameChange: (value: string) => void;
    orderOptions: OrderOption[];
    selectedOrder: OrderOption;
    onOrderChange: (option: OrderOption) => void;
  }
  
  export default function CardFiltersOwners({
    nameFilter,
    onNameChange,
    orderOptions,
    selectedOrder,
    onOrderChange,
  }: Props) {
    return (
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full md:w-1/3">
          <label className="block text-md font-bold text-gray-700 mb-1">
            Filtros:
          </label>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="border px-3 py-2 rounded-md w-full text-black focus:outline-none focus:ring-2 focus:ring-gold"
            value={nameFilter}
            onChange={(e) => onNameChange(e.target.value)}
          />
        </div>
  
        <div className="w-full md:w-48">
          <label className="block text-md font-bold text-gray-700 mb-1">
            Orden:
          </label>
          <Listbox value={selectedOrder} onChange={onOrderChange}>
            <div className="relative">
              <ListboxButton className="border px-4 py-2 rounded-md w-full bg-white shadow text-black">
                {selectedOrder.name}
              </ListboxButton>
              <ListboxOptions className="absolute bg-white border mt-1 w-full rounded-md shadow z-10 text-black">
                {orderOptions.map((option) => (
                  <ListboxOption
                    key={option.value}
                    value={option}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                  >
                    {option.name}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            </div>
          </Listbox>
        </div>
      </div>
    );
  }