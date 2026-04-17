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
  produtividadeMedia?: number;
  variacaoProdutividade?: number;
  eficienciaHidrica?: number;
  variacaoUsoAgua?: number;
  custoPorHectare?: number;
  variacaoCusto?: number;
  areaColhida?: number;
  variacaoAreaColhida?: number;
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

export interface NotificacaoResponse {
  id: number;
  titulo: string;
  mensagem: string | null;
  tipo: string;
  lida: boolean;
  dataCriacao: string;
}

export interface InsumoResponse {
  id: number;
  nome: string;
  tipo: string;
  quantidade: number;
  unidade: string;
  precoUnitario: number;
  dataValidade: string | null;
  fornecedor: string | null;
  estoqueMinimo: number;
  ativo: boolean;
  estoqueBaixo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InsumoRequest {
  nome: string;
  tipo: string;
  quantidade: number;
  unidade: string;
  precoUnitario: number;
  dataValidade?: string;
  fornecedor?: string;
  estoqueMinimo?: number;
}

export interface MovimentoEstoqueResponse {
  id: number;
  tipo: string;
  quantidade: number;
  quantidadeAnterior: number | null;
  quantidadeAtual: number | null;
  motivo: string | null;
  responsavel: string | null;
  insumoId: number;
  insumoNome: string;
  createdAt: string;
}

export interface MovimentoEstoqueRequest {
  insumoId: number;
  tipo: string;
  quantidade: number;
  motivo?: string;
  responsavel?: string;
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    // Token expirado ou inválido (401) - limpa o token e redireciona para login
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new ApiError(401, 'Sua sessão expirou. Por favor, faça login novamente.');
    }

    const errorData = await response.json().catch(() => ({}));
    let errorMessage = errorData.message || errorData.error || 'Erro na requisição';

    // Suporte para erros de validação do Spring (Bean Validation)
    if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
      errorMessage = errorData.errors[0].defaultMessage || errorMessage;
    }

    throw new ApiError(response.status, errorMessage);
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
        credentials: 'include',
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
        credentials: 'include',
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

    logout: async (): Promise<void> => {
      await authenticatedFetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
      });
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

  notificacoes: {
    getAll: async (): Promise<NotificacaoResponse[]> => {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/notificacoes`);
      return response.json();
    },

    getNaoLidas: async (): Promise<NotificacaoResponse[]> => {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/notificacoes/nao-lidas`);
      return response.json();
    },

    getContagem: async (): Promise<{ quantidade: number }> => {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/notificacoes/contagem`);
      return response.json();
    },

    marcarComoLida: async (id: number): Promise<void> => {
      await authenticatedFetch(`${API_BASE_URL}/api/notificacoes/${id}/ler`, {
        method: 'PUT',
      });
    },

    marcarTodasComoLidas: async (): Promise<void> => {
      await authenticatedFetch(`${API_BASE_URL}/api/notificacoes/ler-todas`, {
        method: 'PUT',
      });
    },
  },

  insumos: {
    getAll: async (): Promise<InsumoResponse[]> => {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/insumos`);
      return response.json();
    },

    getById: async (id: number): Promise<InsumoResponse> => {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/insumos/${id}`);
      return response.json();
    },

    create: async (data: InsumoRequest): Promise<InsumoResponse> => {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/insumos`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.json();
    },

    update: async (id: number, data: InsumoRequest): Promise<InsumoResponse> => {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/insumos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
      return response.json();
    },

    delete: async (id: number): Promise<void> => {
      await authenticatedFetch(`${API_BASE_URL}/api/insumos/${id}`, {
        method: 'DELETE',
      });
    },

    getEstoqueBaixo: async (): Promise<InsumoResponse[]> => {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/insumos/estoque-baixo`);
      return response.json();
    },

    registrarMovimento: async (data: MovimentoEstoqueRequest): Promise<MovimentoEstoqueResponse> => {
      const response = await authenticatedFetch(`${API_BASE_URL}/api/insumos/movimento`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      return response.json();
    },

    getMovimentos: async (insumoId?: number, page: number = 0, size: number = 10): Promise<{ content: MovimentoEstoqueResponse[]; totalElements: number; totalPages: number; number: number }> => {
      const url = insumoId 
        ? `${API_BASE_URL}/api/insumos/${insumoId}/movimentos?page=${page}&size=${size}`
        : `${API_BASE_URL}/api/insumos/movimentos?page=${page}&size=${size}`;
      const response = await authenticatedFetch(url);
      return response.json();
    },
  },
};

export default api;
