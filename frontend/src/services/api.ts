interface RequestOptions extends RequestInit {
  body?: any;
}

const apiRequest = async (endpoint: string, options: RequestOptions = {}) => {
  const token = localStorage.getItem('token')
  
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json'
  }

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  if (!token && !endpoint.startsWith('/plans')) {
    throw new Error('No autorizado')
  }

  const response = await fetch(`/api${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    },
    body: options.body ? JSON.stringify(options.body) : undefined
  })

  if (response.status === 403) {
    localStorage.removeItem('token')
    throw new Error('Token expirado')
  }

  if (!response.ok) {
    throw new Error('Error en la petición')
  }

  return response.json()
}

export const api = {
  get: (endpoint: string) => apiRequest(endpoint),
  post: (endpoint: string, body: any) => apiRequest(endpoint, { method: 'POST', body }),
  put: (endpoint: string, body: any) => apiRequest(endpoint, { method: 'PUT', body }),
  delete: (endpoint: string) => apiRequest(endpoint, { method: 'DELETE' })
}