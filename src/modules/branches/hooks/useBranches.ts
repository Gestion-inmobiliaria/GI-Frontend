import { useCallback, useState } from 'react'
import { branchService } from '../services/branch.service'
import { IBranch } from '../interfaces/branch.interface'
import { useNotification } from '@/hooks'
import { QueryParams } from '@/models/query.model'
import { PaginatedResponse } from '@/models/response.model'

export const useBranches = () => {
  const [branches, setBranches] = useState<IBranch[]>([])
  const [selectedBranch, setSelectedBranch] = useState<IBranch | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [totalBranches, setTotalBranches] = useState<number>(0)
  const { showError, showSuccess } = useNotification()

  const getBranches = useCallback(async (params?: QueryParams): Promise<PaginatedResponse<IBranch>> => {
    setLoading(true)
    try {
      const response = await branchService.getAll(params)
      setBranches(response.data)
      setTotalBranches(response.countData)
      return response
    } catch (error: any) {
      showError(error.message || 'Error al obtener las sucursales')
      return { data: [], countData: 0 }
    } finally {
      setLoading(false)
    }
  }, [showError])

  const getBranchById = useCallback(async (id: string): Promise<IBranch | null> => {
    setLoading(true)
    try {
      const branch = await branchService.getById(id)
      setSelectedBranch(branch)
      return branch
    } catch (error: any) {
      showError(error.message || 'Error al obtener la sucursal')
      return null
    } finally {
      setLoading(false)
    }
  }, [showError])

  const createBranch = useCallback(async (branch: Partial<IBranch>): Promise<IBranch | null> => {
    setLoading(true)
    try {
      const createdBranch = await branchService.create(branch)
      showSuccess('Sucursal creada con éxito')
      return createdBranch
    } catch (error: any) {
      showError(error.message || 'Error al crear la sucursal')
      return null
    } finally {
      setLoading(false)
    }
  }, [showError, showSuccess])

  const updateBranch = useCallback(async (id: string, branch: Partial<IBranch>): Promise<IBranch | null> => {
    setLoading(true)
    try {
      const updatedBranch = await branchService.update(id, branch)
      showSuccess('Sucursal actualizada con éxito')
      return updatedBranch
    } catch (error: any) {
      showError(error.message || 'Error al actualizar la sucursal')
      return null
    } finally {
      setLoading(false)
    }
  }, [showError, showSuccess])

  const deleteBranch = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true)
    try {
      await branchService.delete(id)
      showSuccess('Sucursal eliminada con éxito')
      return true
    } catch (error: any) {
      showError(error.message || 'Error al eliminar la sucursal')
      return false
    } finally {
      setLoading(false)
    }
  }, [showError, showSuccess])

  return {
    branches,
    selectedBranch,
    loading,
    totalBranches,
    getBranches,
    getBranchById,
    createBranch,
    updateBranch,
    deleteBranch
  }
} 