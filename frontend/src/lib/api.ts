export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface CulturaResponse {
  id: number;
  nome: string;
  area: number;
  status: string;
  dataPlantio: string;
  previsaoColheita: string | null;
  icone: string | null;
  progress: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CulturaRequest {
  nome: string;
  area: number;
  status?: string;
  dataPlantio: string;
  previsaoColheita?: string;
  icone?: string;
  progress?: number;
}

export interface TarefaResponse {
  id: number;
  titulo: string;
  descricao: string | null;
  prioridade: string;
  status: string;
  dataVencimento: string;
  culturaId: number | null;
  culturaNome: string | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export interface TarefaRequest {
  titulo: string;
  descricao?: string;
  prioridade?: string;
  status?: string;
  dataVencimento: string;
  culturaId?: number;
}

export interface PrecoMercadoResponse {
  id: number;
  produto: string;
  preco: number;
  unidade: string;
  variacao: number | null;
  dataAtualizacao: string;
  userId?: number;
}

export interface PrecoMercadoRequest {
  produto: string;
  preco: number;
  unidade?: string;
  variacao?: number;
}

export interface DashboardResponse {
  totalCulturas: number;
  totalTarefas: number;
  tarefasPendentes: number;
  tarefasEmAndamento: number;
  tarefasConcluidas: number;
  ultimasCulturas: CulturaResponse[];
  tarefasPendentesList: TarefaResponse[];
  atividadesRecentes: AtividadeRecenteResponse[];
}

export interface AtividadeRecenteResponse {
  tipo: string;
  titulo: string;
  descricao: string;
  culturaNome: string | null;
  area: string;
  data: string;
  icone: string;
  status: string;
  iconeTipo: string;
  corFundo: string;
}

export interface UsuarioResponse {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new ApiError(response.status, errorData.message || 'Erro na requisição');
  }

  return response;
}

export const api = {
  auth: {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Erro de login' }));
        throw new ApiError(response.status, error.message);
      }
      return response.json();
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Erro de registro' }));
        throw new ApiError(response.status, error.message);
      }
      return response.json();
    },

    getCurrentUser: async (): Promise<UsuarioResponse> => {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/auth/me`);
      return response.json();
    },
  },

  culturas: {
    getAll: async (): Promise<CulturaResponse[]> => {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/culturas`);
      return response.json();
    },

    getById: async (id: number): Promise<CulturaResponse> => {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/culturas/${id}`);
      return response.json();
    },

    create: async (data: CulturaRequest): Promise<CulturaResponse> => {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/culturas`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.json();
    },

    update: async (id: number, data: CulturaRequest): Promise<CulturaResponse> => {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/culturas/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return response.json();
    },

    delete: async (id: number): Promise<void> => {
      await authenticatedFetch(`${API_BASE_URL}/api/culturas/${id}`, {
        method: 'DELETE',
      });
    },
  },

  tarefas: {
    getAll: async (): Promise<TarefaResponse[]> => {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/tarefas`);
      return response.json();
    },

    getById: async (id: number): Promise<TarefaResponse> => {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/tarefas/${id}`);
      return response.json();
    },

    create: async (data: TarefaRequest): Promise<TarefaResponse> => {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/tarefas`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.json();
    },

    update: async (id: number, data: TarefaRequest): Promise<TarefaResponse> => {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/tarefas/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return response.json();
    },

    delete: async (id: number): Promise<void> => {
      await authenticatedFetch(`${API_BASE_URL}/api/tarefas/${id}`, {
        method: 'DELETE',
      });
    },
  },

  precos: {
    getAll: async (): Promise<PrecoMercadoResponse[]> => {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/precos`);
      return response.json();
    },

    getById: async (id: number): Promise<PrecoMercadoResponse> => {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/precos/${id}`);
      return response.json();
    },

    create: async (data: PrecoMercadoRequest): Promise<PrecoMercadoResponse> => {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/precos`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.json();
    },

    update: async (id: number, data: PrecoMercadoRequest): Promise<PrecoMercadoResponse> => {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/precos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return response.json();
    },

    delete: async (id: number): Promise<void> => {
      await authenticatedFetch(`${API_BASE_URL}/api/precos/${id}`, {
        method: 'DELETE',
      });
    },
  },

  dashboard: {
    getResumo: async (): Promise<DashboardResponse> => {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/dashboard/resumo`);
      return response.json();
    },
  },

  usuarios: {
    getAll: async (): Promise<UsuarioResponse[]> => {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/usuarios`);
      return response.json();
    },
  },
};

export default api;
