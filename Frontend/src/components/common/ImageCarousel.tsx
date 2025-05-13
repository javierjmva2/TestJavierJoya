import { useState, useEffect } from "react";
import { PropertyImage } from "../../types/PropertyImage";

interface ImageCarouselProps {
    images: PropertyImage[];
    editable?: boolean;
    onDelete?: (image: string) => void;
}

export default function ImageCarousel({ images, editable = false, onDelete }: ImageCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Se Ajusta el índice cuando se eliminan imágenes
    useEffect(() => {
        if (images.length === 0) {
            setCurrentIndex(0);
        } else if (currentIndex >= images.length) {
            setCurrentIndex(images.length - 1);
        }
    }, [images, currentIndex]);

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="relative w-full h-64 overflow-hidden rounded-md mb-4">
            {/* Mostrar mensaje cuando no hay imágenes cargadas de la propiedad*/}
            {images.length === 0 ? (
                <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-md">
                    <p className="text-gray-500">No hay imágenes disponibles</p>
                </div>
            ) : (
                <>
                    {/* Imagen actual */}
                    <img
                        src={`data:image/jpeg;charset=utf-8;base64,${images[currentIndex].file}`}
                        alt={`Imagen ${currentIndex + 1}`}
                        className="w-full h-full object-cover rounded-md transition-transform duration-300"
                    />

                    {/* Flechas de navegación */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/60 text-white rounded-full p-2"
                            >
                                ◀
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/60 text-white rounded-full p-2"
                            >
                                ▶
                            </button>
                        </>
                    )}

                    {/* Botón de eliminar */}
                    {editable && onDelete && (
                        <button
                            onClick={() => {
                                onDelete(images[currentIndex].file);
                                setCurrentIndex((prev) => Math.max(0, prev - 1));
                            }}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700"
                        >
                            ✕
                        </button>
                    )}

                    {/* Indicadores */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {images.map((_, index) => (
                            <span
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full cursor-pointer ${
                                    index === currentIndex ? "bg-amber-600" : "bg-gray-400"
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}