import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PrivateRoutes } from '@/models/routes.model'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeftIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { z } from 'zod'
import { useEffect } from 'react'
import { useCreateCategory, useGetCategory, useUpdateCategory } from '@/modules/inventory/hooks/useCategory'
import { Textarea } from '@/components/ui/textarea'
import { type IFormProps } from '@/models'
import { useHeader } from '@/hooks'

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().min(2).max(50),
  image_url: z.string()
})

const CategoryForm = ({ buttonText, title }: IFormProps) => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Inventario', path: PrivateRoutes.CATEGORY },
    { label: 'Categorias', path: PrivateRoutes.CATEGORY },
    { label: title }
  ])
  const { id } = useParams()
  const navigate = useNavigate()
  const { createCategory, isMutating, error } = useCreateCategory()
  const { updateCategory, error: errorUpdate } = useUpdateCategory()
  const { category } = useGetCategory(id)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: '',
      image_url: '',
      name: ''
    }
  })

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name ?? '',
        image_url: category.image_url ?? '',
        description: category.description
      })
    }
  }, [category, form])

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (id) {
      toast.promise(updateCategory({
        id,
        name: data.name,
        description: data.description,
        image_url: data.image_url
      }), {
        loading: 'Actualizando categoría...',
        success: () => {
          setTimeout(() => { navigate(PrivateRoutes.CATEGORY, { replace: true }) }, 1000)
          return 'Sucursal actualizada exitosamente'
        },
        error: 'Error al actualizar la categoría'
      })
    } else {
      toast.promise(createCategory({
        name: data.name,
        description: data.description,
        image_url: data.image_url
      }), {
        loading: 'Creando categoría...',
        success: () => {
          setTimeout(() => { navigate(PrivateRoutes.CATEGORY, { replace: true }) }, 1000)
          return 'Categoría creada exitosamente'
        },
        error: 'Error al crear la categoría'
      })
    }
  }

  let subscribe = true
  useEffect(() => {
    if (subscribe && (error ?? errorUpdate)) {
      const newError = error ?? errorUpdate
      toast.error(newError?.errorMessages[0])
    }
    return () => {
      subscribe = false
    }
  }, [error, errorUpdate])

  return (
    <>
      <section className="grid flex-1 items-start gap-4 lg:gap-6 w-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full flex flex-col gap-4 lg:gap-6">
            <div className="flex items-center gap-4">
              <Button type='button' onClick={() => { navigate(PrivateRoutes.CATEGORY) }} variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeftIcon className="h-4 w-4" />
                <span className="sr-only">Volver</span>
              </Button>
              <h2 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {title}
              </h2>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button type='button' onClick={() => { navigate(PrivateRoutes.CATEGORY) }} variant="outline" size="sm">
                  Descartar
                </Button>
                <Button type='submit' size="sm" disabled={isMutating}>{buttonText}</Button>
              </div>
            </div>
            <div className="flex flex-row lg:flex-col gap-4 lg:gap-6 justify-center" >
              <Card x-chunk="dashboard-07-chunk-0" className='w-full' >
                <CardHeader>
                  <CardTitle>{id ? 'Actualizar categoria' : 'Crear nuevo categoria'}</CardTitle>
                  <CardDescription>
                    {id ? 'Complete los datos para actualizar su categoria' : 'Complete los datos para crear un nueva categoria'}
                  </CardDescription>
                </CardHeader>
                <CardContent className='grid gap-4 w-full'>
                  <div className="grid gap-4 lg:gap-6 lg:grid-cols-2">
                    <div className="grid gap-4 lg:gap-6 lg:grid-cols-1">
                      <FormField
                        control={form.control}
                        name="name"
                        defaultValue=""
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                              <Input placeholder="Tienda..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="image_url"
                        defaultValue=""
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Url Imagen</FormLabel>
                            <FormControl>
                              <Input placeholder="categoria1.jpg..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      defaultValue=""
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descripcion</FormLabel>
                          <FormControl>
                            <Textarea placeholder="El usuario pordrá..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button onClick={() => { navigate(PrivateRoutes.CATEGORY) }} type='button' variant="outline" size="sm" >
                Cancelar
              </Button>
              <Button type='submit' size="sm" disabled={isMutating}>{buttonText}</Button>
            </div>
          </form>
        </Form>
      </section>
    </>
  )
}

export default CategoryForm
