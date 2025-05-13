import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useEffect, useState, ChangeEvent } from 'react';
import { getPropertyById, deletePropertyImage, deleteProperty, updateProperty, createProperty } from '../../services/PropertyService';
import { getAllOrderedByName } from '../../services/OwnerService';
import { PropertyImage } from '../../types/PropertyImage';
import ImageUploadModal from './ImageUploadModal';
import ImageCarousel from '../common/ImageCarousel';
import OwnerSelector from '../owners/OwnerSelector';
import { OwnerList } from '../../types/OwnerList';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    propertyId: string | null;
    onUpdated?: () => void;
    onDelete?: (handle: () => Promise<boolean>) => void;
}

export default function PropertyModal({ isOpen, onClose, propertyId, onUpdated, onDelete }: Props) {
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [price, setPrice] = useState(0);

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [images, setImages] = useState<PropertyImage[]>([]);
    const [showImageUploadModal, setShowImageUploadModal] = useState(false);

    const [owners, setOwners] = useState<OwnerList[]>([]);
    const [selectedOwner, setSelectedOwner] = useState<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        setLoading(true);

        //Se carga el listado de dueños
        getAllOrderedByName().then((data) => {
            setOwners(data);

            if (propertyId && propertyId != null && propertyId != '') {
                getPropertyById(propertyId)
                    .then((data) => {
                        setName(data.name);
                        setAddress(data.address);
                        setPrice(data.price);
                        setImages(data.images || []);
                        setSelectedOwner(data.idOwner);
                        setEditMode(false);
                    })
                    .finally(() => setLoading(false));
            } else {
                //Es un owner nuevo.
                handleRestartInfo();
            }
        });


    }, [propertyId, isOpen]);

    const handleRestartInfo = () => {
        setEditMode(true);
        setName('');
        setAddress('');
        setLoading(false);
    };

    const handleCloseModal = () => {
        handleRestartInfo();
        setEditMode(false);
        onClose()
    };

    const handleDeleteImage = async (imageBase64: string) => {
        try {
            const success = await deletePropertyImage(propertyId, imageBase64);
            if (success) {
                setImages((prev) => prev.filter((img) => img.file !== imageBase64));
            }
        } catch (err) {
            console.error("Error al eliminar imagen:", err);
        }
    };
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);
            var response = await deleteProperty(propertyId);
            onClose();
            return response;
        } catch (err) {
            console.error('Error al borrar:', err);
        } finally {
            setDeleting(false);
        }
    };


    const handleSave = async () => {
        if (propertyId && propertyId != null && propertyId != '') {
            //Se actualiza la información de la propiedad
            try {
                setSaving(true);
                await updateProperty(propertyId, {
                    name,
                    address,
                    price,
                    images,
                    idOwner: selectedOwner
                });
                onUpdated?.();
                onClose();
            } catch (err) {
                console.error('Error al actualizar:', err);
            } finally {
                setSaving(false);
            }
        } else {
            //Se crea una nueva propiedad
            try {
                setSaving(true);
                await createProperty({
                    name,
                    address,
                    price,
                    images,
                    idOwner: selectedOwner
                });
                onUpdated?.();
                onClose();
            } catch (err) {
                console.error('Error al insertar:', err);
            } finally {
                setSaving(false);
            }
        }
    };

    return (
        <>
            <Dialog open={isOpen} onClose={onClose} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl">
                        <DialogTitle className="text-xl font-semibold text-gray-800 mb-4">
                            {editMode ? 'Editar Propiedad' : 'Detalle de la propiedad'}
                        </DialogTitle>

                        {loading ? (
                            <div className="text-center text-gray-500 animate-pulse py-12">Cargando...</div>
                        ) : (
                            <div className="space-y-4">
                                {/* Dueño */}
                                <OwnerSelector
                                    owners={owners}
                                    selectedOwner={selectedOwner}
                                    setSelectedOwner={setSelectedOwner}
                                    editMode={editMode}
                                />

                                {/* Nombre */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full border rounded px-3 py-2 text-black"
                                        />
                                    ) : (
                                        <p className="text-gray-800">{name}</p>
                                    )}
                                </div>

                                {/* Dirección */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Dirección</label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="w-full border rounded px-3 py-2 text-black"
                                        />
                                    ) : (
                                        <p className="text-gray-800">{address}</p>
                                    )}
                                </div>

                                {/* Precio.. con formato de pesos colombianos*/}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Precio</label>
                                    {editMode ? (
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(parseInt(e.target.value))}
                                            className="w-full border rounded px-3 py-2 text-black"
                                        />
                                    ) : (
                                        <p className="text-gray-800">{formatPrice(price)}</p>
                                    )}
                                </div>

                                {/* Carrusel de imágenes */}
                                <ImageCarousel
                                    images={images}
                                    editable={editMode}
                                    onDelete={handleDeleteImage}
                                />

                                {/* Botones */}
                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        onClick={() => { handleCloseModal() }}
                                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                    >
                                        Cerrar
                                    </button>


                                    {!editMode ? (
                                        <>
                                            <button
                                                onClick={() => onDelete?.(handleDelete)}
                                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-amber-700"
                                            >
                                                {deleting ? "Eliminando..." : "Eliminar"}
                                            </button>
                                            <button
                                                onClick={() => setEditMode(true)}
                                                className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
                                            >
                                                Editar
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => setShowImageUploadModal(true)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                Subir nueva imagen
                                            </button>
                                            <button
                                                onClick={handleSave}
                                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                            >
                                                {saving ? "Guardando..." : "Guardar"}
                                            </button>
                                        </>

                                    )}
                                </div>
                            </div>
                        )}
                    </DialogPanel>
                </div>
            </Dialog>
            <ImageUploadModal
                isOpen={showImageUploadModal}
                onClose={() => setShowImageUploadModal(false)}
                propertyId={propertyId || ""}
                onImageUploaded={(newImage) => setImages((prev) => [...prev, newImage])}
            />
        </>
    );
}