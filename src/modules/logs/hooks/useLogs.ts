import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Log, LogListParams } from '../models/log.model'
import { getLogs } from '../services/logs.service'

export const useLogs = () => {
  const [queryParams, setQueryParams] = useState<LogListParams>({
    page: 1,
    limit: 10
  })
  
  const { data, isLoading, refetch } = useQuery<{ data?: Log[], countData?: number }>({
    queryKey: ['logs', queryParams],
    queryFn: async () => {
      try {
        const response = await getLogs(queryParams)
        return {
          data: response.data || [],
          countData: response.countData || 0
        }
      } catch (error) {
        toast.error('Error al cargar la bitácora')
        return { data: [], countData: 0 }
      }
    }
  })
  
  const handleSearch = (search: string) => {
    setQueryParams(prev => ({ ...prev, search, page: 1 }))
  }
  
  const handleDateFilter = (fromDate?: string, toDate?: string) => {
    setQueryParams(prev => ({ ...prev, fromDate, toDate, page: 1 }))
  }
  
  const handlePageChange = (page: number) => {
    setQueryParams(prev => ({ ...prev, page }))
  }
  
  return {
    logs: data?.data || [],
    totalLogs: data?.countData || 0,
    isLoading,
    queryParams,
    handleSearch,
    handleDateFilter,
    handlePageChange,
    refetch
  }
} 