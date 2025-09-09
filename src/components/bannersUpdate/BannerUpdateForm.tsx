import React, { useEffect, useState } from 'react';

const BannerList = () => {
    interface Banner {
        _id: string;
        Imagen?: { type: string; data: number[] };
        ImageApp?: { type: string; data: number[] };
        Mimetype?: string;
        MimetypeApp?: string;
        Link: string;
        position: number;
        Identifier: string;
    }

    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

    const [form, setForm] = useState({
        Imagen: null as File | null,
        ImageApp: null as File | null,
        Link: '',
        position: '',
        Identifier: '',
    });

    const bufferToBase64 = (buffer: number[]) => {
        const binary = Uint8Array.from(buffer).reduce((acc, byte) => acc + String.fromCharCode(byte), '');
        return btoa(binary);
    };
    const openDeleteModal = (id: string) => {
        setBannerToDelete(id);
        setShowDeleteModal(true);
    };
    const confirmDelete = async () => {
        if (!bannerToDelete) return;

        try {
            const res = await fetch(`http://localhost:3001/banners-services/${bannerToDelete}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchBanners();
                setShowDeleteModal(false);
                setBannerToDelete(null);
            }
        } catch (err) {
            console.error("Error en la solicitud:", err);
        }
    };

    const updateBanners = (data: Banner[]) => setBanners(data);

    const fetchBanners = () => {
        setLoading(true);
        fetch('http://localhost:3001/banners-services')
            .then(res => res.json())
            .then(data => updateBanners(data))
            .catch(err => console.error('Error al cargar banners:', err))
            .finally(() => setLoading(false));
    };

    // ---- CREAR ----
    const handleCreateBanner = async () => {
        const formData = new FormData();
        if (form.Imagen) formData.append('Imagen', form.Imagen);
        if (form.ImageApp) formData.append('ImageApp', form.ImageApp);
        formData.append('Link', form.Link);
        formData.append('position', form.position);
        formData.append('Identifier', form.Identifier);

        try {
            const res = await fetch('http://localhost:3001/banners-services', {
                method: 'POST',
                body: formData,
            });
            if (res.ok) {
                setShowCreateModal(false);
                fetchBanners();
            } else {
                console.error('Error al crear banner');
            }
        } catch (err) {
            console.error('Error en la solicitud:', err);
        }
    };

    // ---- EDITAR ----
    const handleOpenEdit = (banner: Banner) => {
        setEditingBanner(banner);
        setForm({
            Imagen: null,
            ImageApp: null,
            Link: banner.Link,
            position: banner.position.toString(),
            Identifier: banner.Identifier,
        });
        setShowEditModal(true);
    };

    const handleUpdateBanner = async () => {
        if (!editingBanner) return;

        // Validar cambios
        if (
            !form.Imagen &&
            !form.ImageApp &&
            form.Link === editingBanner.Link &&
            form.position === editingBanner.position.toString() &&
            form.Identifier === editingBanner.Identifier
        ) {
            alert('Debes modificar al menos un campo antes de actualizar.');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            if (form.Link) formData.append('Link', form.Link);
            if (form.position) formData.append('position', form.position);
            if (form.Identifier) formData.append('Identifier', form.Identifier);
            if (form.Imagen) formData.append('Imagen', form.Imagen);
            if (form.ImageApp) formData.append('ImageApp', form.ImageApp);

            const response = await fetch(`http://localhost:3001/banners-services/${editingBanner._id}`, {
                method: 'PATCH',
                body: formData,
            });

            if (!response.ok) throw new Error('Error al actualizar el banner');

            await response.json();
            fetchBanners();
            setShowEditModal(false);
            setEditingBanner(null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ---- ELIMINAR ----
    const handleDeleteBanner = async (id: string) => {
        const confirm = window.confirm('¿Estás seguro de que quieres eliminar este banner?');
        if (!confirm) return;

        try {
            const res = await fetch(`http://localhost:3001/banners-services/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) fetchBanners();
        } catch (err) {
            console.error('Error en la solicitud:', err);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    return (
        <div className="flex flex-col gap-6 p-4">
            {/* Botón superior */}
            <div className="flex justify-between items-center flex-wrap">
                <h2 className="text-xl font-semibold text-gray-800">Listado de Banners</h2>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-5 py-2 bg-green-700 text-white text-base rounded hover:bg-green-600 transition"
                >
                    Crear nuevo banner
                </button>
            </div>

            {/* Modal CREAR */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Nuevo Banner</h3>
                        <div className="flex flex-col gap-3">

                            {/* Imagen Web */}
                            <div>
                                <label
                                    htmlFor="createImagenWeb"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Imagen Web
                                </label>
                                <input
                                    id="createImagenWeb"
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setForm({ ...form, Imagen: e.target.files?.[0] || null })}
                                    className="border px-3 py-2 rounded w-full"
                                />
                            </div>

                            {/* Imagen App */}
                            <div>
                                <label
                                    htmlFor="createImagenApp"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Imagen App
                                </label>
                                <input
                                    id="createImagenApp"
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setForm({ ...form, ImageApp: e.target.files?.[0] || null })}
                                    className="border px-3 py-2 rounded w-full"
                                />
                            </div>

                            {/* Link */}
                            <div>
                                <label
                                    htmlFor="createLink"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Link
                                </label>
                                <input
                                    id="createLink"
                                    type="text"
                                    value={form.Link}
                                    onChange={e => setForm({ ...form, Link: e.target.value })}
                                    placeholder="Link"
                                    className="border px-3 py-2 rounded w-full"
                                />
                            </div>

                            {/* Posición */}
                            <div>
                                <label
                                    htmlFor="createPosition"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Posición
                                </label>
                                <input
                                    id="createPosition"
                                    type="number"
                                    value={form.position}
                                    onChange={e => setForm({ ...form, position: e.target.value })}
                                    placeholder="Posición"
                                    className="border px-3 py-2 rounded w-full"
                                />
                            </div>

                            {/* Identificador */}
                            <div>
                                <label
                                    htmlFor="createIdentifier"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Identificador
                                </label>
                                <input
                                    id="createIdentifier"
                                    type="text"
                                    value={form.Identifier}
                                    onChange={e => setForm({ ...form, Identifier: e.target.value })}
                                    placeholder="Identificador"
                                    className="border px-3 py-2 rounded w-full"
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleCreateBanner}
                                    className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600"
                                >
                                    Crear
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {/* Modal EDITAR */}
            {showEditModal && editingBanner && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                        <h3 className="text-lg font-semibold mb-4">Editar Banner</h3>
                        <div className="flex flex-col gap-3">

                            {/* Imagen Web */}
                            <div>
                                <label
                                    htmlFor="editImagenWeb"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Imagen Web
                                </label>
                                <input
                                    id="editImagenWeb"
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setForm({ ...form, Imagen: e.target.files?.[0] || null })}
                                    className="border px-3 py-2 rounded w-full"
                                />
                            </div>

                            {/* Imagen App */}
                            <div>
                                <label
                                    htmlFor="editImagenApp"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Imagen App
                                </label>
                                <input
                                    id="editImagenApp"
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setForm({ ...form, ImageApp: e.target.files?.[0] || null })}
                                    className="border px-3 py-2 rounded w-full"
                                />
                            </div>

                            {/* Link */}
                            <div>
                                <label
                                    htmlFor="editLink"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Link
                                </label>
                                <input
                                    id="editLink"
                                    type="text"
                                    value={form.Link}
                                    onChange={e => setForm({ ...form, Link: e.target.value })}
                                    placeholder="Link"
                                    className="border px-3 py-2 rounded w-full"
                                />
                            </div>

                            {/* Posición */}
                            <div>
                                <label
                                    htmlFor="editPosition"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Posición
                                </label>
                                <input
                                    id="editPosition"
                                    type="number"
                                    value={form.position}
                                    onChange={e => setForm({ ...form, position: e.target.value })}
                                    placeholder="Posición"
                                    className="border px-3 py-2 rounded w-full"
                                />
                            </div>

                            {/* Identificador */}
                            <div>
                                <label
                                    htmlFor="editIdentifier"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Identificador
                                </label>
                                <input
                                    id="editIdentifier"
                                    type="text"
                                    value={form.Identifier}
                                    onChange={e => setForm({ ...form, Identifier: e.target.value })}
                                    placeholder="Identificador"
                                    className="border px-3 py-2 rounded w-full"
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleUpdateBanner}
                                    className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600"
                                >
                                    {loading ? 'Guardando...' : 'Guardar cambios'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Modal Eliminar*/}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Confirmar Eliminación
                        </h3>
                        <p className="text-sm text-gray-600 mb-6">
                            Esta acción no es reversible, ¿estás seguro de que quieres eliminar el banner?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Renderizado de banners */}
            {banners.map(banner => {
                const id = banner._id;
                const imgBase64 = banner.Imagen?.data ? bufferToBase64(banner.Imagen.data) : null;
                const imgAppBase64 = banner.ImageApp?.data ? bufferToBase64(banner.ImageApp.data) : null;

                return (
                    <div key={id} className="border p-4 flex flex-col gap-6 rounded-md shadow-sm bg-white">
                        <div className="flex flex-wrap justify-center gap-4">
                            {imgBase64 && (
                                <div className="flex flex-col items-center">
                                    <span className="text-sm font-medium text-gray-600 mb-1">Imagen Web</span>
                                    <img
                                        src={`data:${banner.Mimetype};base64,${imgBase64}`}
                                        alt={`${banner.Identifier}-Web`}
                                        className="w-[384px] h-[384px] sm:w-64 sm:h-64 object-contain border rounded"
                                    />
                                </div>
                            )}

                            {imgAppBase64 && (
                                <div className="flex flex-col items-center">
                                    <span className="text-sm font-medium text-gray-600 mb-1">Imagen App</span>
                                    <img
                                        src={`data:${banner.MimetypeApp};base64,${imgAppBase64}`}
                                        alt={`${banner.Identifier}-App`}
                                        className="w-[384px] h-[384px] sm:w-64 sm:h-64 object-contain border rounded"
                                    />
                                </div>
                            )}

                        </div>

                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                            <div className="text-base text-gray-800 space-y-1">
                                <div><span className="font-semibold">ID:</span> {id}</div>
                                <div><span className="font-semibold">Link:</span> {banner.Link}</div>
                                <div><span className="font-semibold">Posición:</span> {banner.position}</div>
                                <div><span className="font-semibold">Identificador:</span> {banner.Identifier}</div>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:justify-end gap-2">
                                <button
                                    onClick={() => handleOpenEdit(banner)}
                                    className="px-5 py-2 bg-blue-700 text-white text-base rounded hover:bg-blue-600 transition"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => openDeleteModal(id)}
                                    className="px-5 py-2 bg-red-600 text-white text-base rounded hover:bg-red-500 transition"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default BannerList;
