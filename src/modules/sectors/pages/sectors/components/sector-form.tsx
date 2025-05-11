import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { PrivateRoutes } from '@/models/routes.model'
import { createSector, getSector, updateSector, getRealStates } from '@/services/sector.service'
import { Skeleton } from '@/components/ui/skeleton'

interface SectorFormProps {
  title: string
  buttonText: string
}

const sectorFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  adress: z.string().optional(),
  phone: z.string().optional(),
  realStateId: z.string().min(1, 'La inmobiliaria es requerida'), // Segun el backend la inmobiliaria es requerida 1. No null por defecto
})

type SectorFormValues = z.infer<typeof sectorFormSchema>

export default function SectorFormPage({ title, buttonText }: SectorFormProps) {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState(id ? true : false)
  const [realStates, setRealStates] = useState<Array<{ id: string, name: string }>>([])
  
  const form = useForm<SectorFormValues>({
    resolver: zodResolver(sectorFormSchema),
    defaultValues: {
      name: '',
      adress: '',
      phone: '',
      realStateId: '',
    },
  })

  // Cargar las inmobiliarias disponibles
  useEffect(() => {
    const fetchRealStates = async () => {
      try {
        const response = await getRealStates()
        if (response.statusCode === 200 && response.data) {
          setRealStates(response.data)
        } else {
          toast.error('Error al cargar las inmobiliarias')
          console.error('Respuesta del servidor:', response)
        }
      } catch (error) {
        toast.error('Error al cargar las inmobiliarias')
        console.error(error)
      }
    }
    
    fetchRealStates()
  }, [])

  useEffect(() => {
    const fetchSectorData = async () => {
      if (id) {
        try {
          const response = await getSector(id)
          if (response.statusCode === 200 && response.data) {
            const sector = response.data
            form.reset({
              name: sector.name || '',
              adress: sector.adress || '',
              phone: sector.phone || '',
              realStateId: sector.realState?.id || '',
            })
          } else {
            toast.error('Error al cargar los datos del sector')
            navigate(PrivateRoutes.SECTORS)
          }
        } catch (error) {
          toast.error('Error al cargar los datos del sector')
          console.error(error)
          navigate(PrivateRoutes.SECTORS)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchSectorData()
  }, [id, navigate, form])

  const onSubmit = async (data: SectorFormValues) => {
    try {
      let response
      if (id) {
        response = await updateSector(id, data)
      } else {
        response = await createSector(data)
      }

      console.log('Respuesta del servidor:', response)

      if (response.statusCode === 200 || response.statusCode === 201) {
        toast.success(id ? 'Sector actualizado correctamente' : 'Sector creado correctamente')
        navigate(PrivateRoutes.SECTORS)
      } else {
        toast.error(id ? 'Error al actualizar el sector' : 'Error al crear el sector')
        console.error('Error en la respuesta:', response)
      }
    } catch (error) {
      toast.error(id ? 'Error al actualizar el sector' : 'Error al crear el sector')
      console.error(error)
    }
  }

  if (loading) {
    return (
      <div className="container p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate(PrivateRoutes.SECTORS)} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-7 w-48 mb-2" />
            <Skeleton className="h-5 w-96" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate(PrivateRoutes.SECTORS)} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            Complete los campos para {id ? 'actualizar' : 'crear'} un sector
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre*</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del sector" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="adress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input placeholder="Dirección del sector" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input placeholder="Teléfono de contacto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="realStateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inmobiliaria*</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione una inmobiliaria" />
                        </SelectTrigger>
                        <SelectContent>
                          {realStates.map((realState) => (
                            <SelectItem key={realState.id} value={realState.id}>
                              {realState.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">{buttonText}</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
} 