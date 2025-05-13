import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { useEffect, useState, ChangeEvent } from 'react';
import { getOwnerById, updateOwner, createOwner, deleteOwner } from '../../services/OwnerService';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    ownerId: string | null;
    onUpdated?: () => void;
    onDelete?: (handle: () => Promise<boolean>) => void;
}

export default function OwnerModal({ isOpen, onClose, ownerId, onUpdated, onDelete }: Props) {
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [photo, setPhoto] = useState('');
    const [birthday, setBirthday] = useState('');
    const [imagePreview, setImagePreview] = useState('');

    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);


    useEffect(() => {
        if (!isOpen) return;

        setLoading(true);

        if (ownerId && ownerId != null && ownerId != '') {
            getOwnerById(ownerId)
                .then((data) => {
                    setName(data.name);
                    setAddress(data.address);
                    setPhoto(data.photo); // Base64
                    setBirthday(data.birthday?.substring(0, 10)); // ISO -> yyyy-mm-dd
                    setEditMode(false);
                })
                .finally(() => setLoading(false));
        } else {
            //Es un owner nuevo.
            handleRestartInfo();
        }
    }, [ownerId, isOpen]);

    const handleRestartInfo = () => {
        setEditMode(true);
        setName('');
        setAddress('');
        setPhoto(''); // Base64
        setImagePreview('');
        const today = new Date().toISOString().split('T')[0];
        setBirthday(today);
        setLoading(false);
    };

    const handleCloseModal = () => {
        handleRestartInfo();
        setEditMode(false);
        onClose()
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                setPhoto(result);
                setImagePreview(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (ownerId && ownerId != null && ownerId != '') {
            //Se actualiza la información del owner
            try {
                setSaving(true);
                await updateOwner(ownerId, {
                    name,
                    address,
                    birthday,
                    photo,
                });
                onUpdated?.();
                onClose();
            } catch (err) {
                console.error('Error al actualizar:', err);
            } finally {
                setSaving(false);
            }
        } else {
            //Se crea un nuevo owner
            try {
                setSaving(true);
                await createOwner({
                    name,
                    address,
                    birthday,
                    photo,
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

    const handleDelete = async () => {
        try {
            setDeleting(true);
            var response = await deleteOwner(ownerId);
            onClose();
            return response;
        } catch (err) {
            console.error('Error al borrar:', err);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="w-full max-w-md bg-white rounded-xl p-6 shadow-xl">
                    <DialogTitle className="text-xl font-semibold text-gray-800 mb-4">
                        {editMode ? 'Editar Owner' : 'Detalle del Owner'}
                    </DialogTitle>

                    {loading ? (
                        <div className="text-center text-gray-500 animate-pulse py-12">Cargando...</div>
                    ) : (
                        <div className="space-y-4">

                            {/* Imagen */}
                            <div className="flex flex-col items-center">
                                <img
                                    src={imagePreview || photo}
                                    alt=""
                                    className="w-32 h-32 object-cover rounded-full border"
                                />
                                {editMode && (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="mt-2 text-sm text-gray-600"
                                    />
                                )}
                            </div>

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

                            {/* Cumpleaños */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Cumpleaños</label>
                                {editMode ? (
                                    <input
                                        type="date"
                                        value={birthday}
                                        onChange={(e) => setBirthday(e.target.value)}
                                        className="w-full border rounded px-3 py-2 text-black"
                                    />
                                ) : (
                                    <p className="text-gray-800">{birthday}</p>
                                )}
                            </div>

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
                                    <button
                                        onClick={handleSave}
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        {saving ? "Guardando..." : "Guardar"}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </DialogPanel>
            </div>
        </Dialog>
    );
}