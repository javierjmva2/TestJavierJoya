import api from '../api/Api';

interface LoginRequest {
    username: string;
    password: string;
}

export async function loginUser(credentials: LoginRequest): Promise<void> {
    const response = await api.post('/api/login', credentials);
    if (response.data.token)
        localStorage.setItem('jwt', response.data.token);
}