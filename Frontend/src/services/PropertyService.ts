import api from '../api/Api';
import { PagedResult } from "../types/PagedResult";
import { PropertySearch } from "../types/PropertySearch";
import { Property } from '../types/Property';

//Busqueda con filtros
const getFilteredProperties = async (
    name?: string,
    address?: string,
    minPrice?: number,
    maxPrice?: number,
    sortBy: string = 'name',
    orderDirection: string = 'asc',
    pageNumber: number = 1,
    pageSize: number = 6
): Promise<PagedResult<PropertySearch>> => {
    const token = localStorage.getItem('token');
    const response = await api.get('/api/properties', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
            name, address, minPrice, maxPrice, sortBy, sortDescending: orderDirection == "desc", pageNumber, pageSize
        },
    });
    return response.data;
};

//Carga de imagenes
const uploadPropertyImage = async (propertyId: string, formData: FormData) => {
    const token = localStorage.getItem("token");
    const response = await api.post(
        `api/properties/${propertyId}/images`,
        formData,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data.imageBase64;
};

//Borrado de imagen
const deletePropertyImage = async (propertyId: string | null, imageBase64: string) => {
    const token = localStorage.getItem("token");
    const response = await api.delete(
        `api/properties/${propertyId}/images`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            data: imageBase64
        }
    );
    return response.status === 204;
};

// //Actualización de la propiedad
const updateProperty = async (id: string, data: Partial<Property>) => {
    const token = localStorage.getItem('token');

    const response = await api.put(`/api/properties/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

// //Creación de la propiedad
const createProperty = async (data: Partial<Property>) => {
    const token = localStorage.getItem('token');

    const response = await api.post(`/api/properties`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

// //Borrado de owner
const deleteProperty = async (id: string | null) => {
    const token = localStorage.getItem('token');

    const response = await api.delete(`/api/properties/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

//Busqueda de property por id
const getPropertyById = async (id: string): Promise<Property> => {
    const token = localStorage.getItem('token');
    const response = await api.get(`api/properties/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export {
    getFilteredProperties,
    getPropertyById,
    uploadPropertyImage,
    deletePropertyImage,
    updateProperty,
    createProperty,
    deleteProperty
}
