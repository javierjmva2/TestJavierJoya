import { useEffect, useState } from "react";
import { OrderOption } from "../../types/OrderOption";

interface PaginatedResponse<T> {
    items: T[];
    totalCount: number;
}

interface Props<T> {
    title: string;
    fetchData: (
        name: string,
        minPrice: number,
        maxPrice: number,
        orderBy: string,
        orderDirection: string,
        page: number,
        pageSize: number
    ) => Promise<PaginatedResponse<T>>;
    renderItem: (item: T) => React.ReactNode;
    FiltersComponent: React.ReactNode;
    nameFilter: string;
    minPriceFilter: number,
    maxPriceFilter: number,
    onNewItem?: () => void;
    reloadTrigger?: number;
    orderOption: OrderOption
}

export default function PaginatedCardList<T>({
    title,
    fetchData,
    renderItem,
    FiltersComponent,
    nameFilter,
    minPriceFilter,
    maxPriceFilter,
    onNewItem,
    reloadTrigger,
    orderOption
}: Props<T>) {
    const [items, setItems] = useState<T[]>([]);
    const [pageNumber, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const pageSize = 9;

    useEffect(() => {
        loadData();
    }, [pageNumber, nameFilter, reloadTrigger, minPriceFilter, maxPriceFilter, orderOption]);

    const loadData = async () => {
        setLoading(true);
        try {
            var orderByValue = orderOption.value.split('_')[0];
            var orderDirectionValue = orderOption.value.split('_')[1];
            const result = await fetchData(nameFilter, minPriceFilter, maxPriceFilter, orderByValue, orderDirectionValue, pageNumber, pageSize);
            setItems(result.items);
            setTotalPages(Math.ceil(result.totalCount / pageSize));
        } finally {
            setLoading(false);
        }
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, pageNumber - 2);
        let end = Math.min(totalPages, pageNumber + 2);

        if (pageNumber <= 3) end = Math.min(maxVisible, totalPages);
        else if (pageNumber + 2 >= totalPages) start = Math.max(1, totalPages - maxVisible + 1);

        if (start > 1) {
            pages.push(
                <button key={1} onClick={() => setPage(1)} className="px-3 py-1 bg-gray-300 rounded">
                    1
                </button>
            );
            if (start > 2) pages.push(<span key="startDots">...</span>);
        }

        for (let i = start; i <= end; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`px-3 py-1 rounded ${i === pageNumber ? "bg-amber-600 text-white" : "bg-gray-300"}`}
                >
                    {i}
                </button>
            );
        }

        if (end < totalPages) {
            if (end < totalPages - 1) pages.push(<span key="endDots">...</span>);
            pages.push(
                <button key={totalPages} onClick={() => setPage(totalPages)} className="px-3 py-1 bg-gray-300 rounded">
                    {totalPages}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="max-w-6xl mx-auto p-4 pt-0">
            <div className="flex items-center gap-4 mb-4">
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded" onClick={() => onNewItem?.()}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Nuevo</span>
                </button>
            </div>

            {FiltersComponent}

            {loading ? (
                <div className="text-center text-gray-500 py-12 text-lg animate-pulse">
                    Cargando datos...
                </div>
            ) : (
                <>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map(renderItem)}
                    </div>

                    <div className="mt-6 flex justify-center items-center gap-2 flex-wrap">
                        <button
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={pageNumber === 1}
                            className="px-3 py-1 bg-gray-400 rounded hover:bg-gray-600 disabled:opacity-50"
                        >
                            ← Anterior
                        </button>
                        {renderPageNumbers()}
                        <button
                            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                            disabled={pageNumber === totalPages}
                            className="px-3 py-1 bg-gray-400 rounded hover:bg-gray-600 disabled:opacity-50"
                        >
                            Siguiente →
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}