import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useState, ChangeEvent } from 'react';
import { uploadPropertyImage } from '../../services/PropertyService';
import { PropertyImage } from '../../types/PropertyImage';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    propertyId: string;
    onImageUploaded: (newImage: PropertyImage) => void;
}

export default function ImageUploadModal({ isOpen, onClose, propertyId, onImageUploaded }: Props) {
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);

            // Sube la imagen a tu backend
            const newImageUrl = await uploadPropertyImage(propertyId, formData);
            const propertyImage = {
                file: newImageUrl
            } as PropertyImage


            // Notifica al modal principal para que actualice el carrusel
            onImageUploaded(propertyImage);
            onClose();
        } catch (err) {
            console.error("Error al subir imagen:", err);
        } finally {
            setUploading(false);
            setPreviewUrl(null);
            setSelectedFile(null);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl">
                    <DialogTitle className="text-lg font-semibold text-gray-800 mb-4">
                        Subir nueva imagen
                    </DialogTitle>

                    {/* Previsualización */}
                    {previewUrl ? (
                        <div className="mb-4">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full h-64 object-cover rounded-md mb-2"
                            />
                            <button
                                onClick={() => setPreviewUrl(null)}
                                className="w-full bg-red-600 text-white py-2 rounded mb-4 hover:bg-red-700"
                            >
                                Quitar imagen
                            </button>
                        </div>
                    ) : (
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full mb-4"
                        />
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={uploading || !selectedFile}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                        >
                            {uploading ? "Subiendo..." : "Subir"}
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}