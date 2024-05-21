import axios, { AxiosInstance } from 'axios'

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

const setAuthToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = `Token ${token}`
  } else {
    delete axiosInstance.defaults.headers.common['Authorization']
  }
}

export const getLogout = async () => {
  setAuthToken(localStorage.getItem('token'))
  await axiosInstance.post('/auth/token/logout/')
}

export const getFiles = async () => {
  setAuthToken(localStorage.getItem('token'))
  const response = await axiosInstance.get('/api/v1/filelist/')
  return response.data
}

export const uploadFile = async (file: File) => {
  setAuthToken(localStorage.getItem('token'))
  const formData = new FormData()
  formData.append('file', file)

  const response = await axiosInstance.post('/api/v1/filelist/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}

export const deleteFile = async (fileId: number): Promise<void> => {
  const response = await axiosInstance.delete(`/api/v1/filedelete/${fileId}/`)
  return response.data
}

export const updateFileInfo = async ({ fileId, newName, newComment }: { fileId: number, newName: string, newComment: string }) : Promise<TypeFile> => {
  const response = await axiosInstance.patch(`/api/v1/filelist/${fileId}/`, { name: newName, comment: newComment })
  return response.data
}