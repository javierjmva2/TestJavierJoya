import api from '../api/Api';
import { PagedResult } from "../types/PagedResult";
import { OwnerSearch } from "../types/OwnerSearch";
import { Owner } from '../types/Owner';
import { OwnerList } from '../types/OwnerList';

//Busqueda con filtros
const getFilteredOwners = async (
    name?: string,
    address?: string,
    orderBy: string = 'name',
    orderDirection: string = 'asc',
    pageNumber: number = 1,
    pageSize: number = 6
): Promise<PagedResult<OwnerSearch>> => {
    const token = localStorage.getItem('token');
    const response = await api.get('/api/owners', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
            name, address, orderBy, sortDescending: orderDirection == "desc", pageNumber, pageSize
        },
    });
    return response.data;
};

const getAllOrderedByName = async (): Promise<OwnerList[]> => {
    const token = localStorage.getItem('token');
    const response = await api.get('/api/owners/getAll', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};


//Actualización de owner
const updateOwner = async (id: string, data: Partial<Owner>) => {
    const token = localStorage.getItem('token');

    const response = await api.put(`/api/owners/${id}`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

//Creación de owner
const createOwner = async (data: Partial<Owner>) => {
    const token = localStorage.getItem('token');

    const response = await api.post(`/api/owners`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

//Borrado de owner
const deleteOwner = async (id: string | null) => {
    const token = localStorage.getItem('token');

    const response = await api.delete(`/api/owners/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

//Busqueda de owner por id
const getOwnerById = async (id: string): Promise<Owner> => {
    const token = localStorage.getItem('token');
    const response = await api.get(`api/owners/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export {
    getFilteredOwners,
    getAllOrderedByName,
    getOwnerById,
    updateOwner,
    createOwner,
    deleteOwner
}
