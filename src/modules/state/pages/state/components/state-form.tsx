import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PrivateRoutes } from '@/models/routes.model'
import {
  useCreateState,
  useGetState,
  useUpdateState
} from '@/modules/state/hooks/useState'
import { zodResolver } from '@hookform/resolvers/zod'
import {
//  CheckCheckIcon,
  ChevronLeftIcon,
//  ChevronsUpDownIcon
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
/*import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'*/
import { z } from 'zod'
import { toast } from 'sonner'
import { useHeader } from '@/hooks'
import { type IFormProps } from '@/models'
/*import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'*/
/*import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { cn } from '@/lib/utils'*/
import { ESTADO } from '@/modules/state/models/estado.model'
import { Textarea } from '@/components/ui/textarea'
//import { useGetAllUser} from '@/modules/users/hooks/useUser'



/*no pude hacer la api de google maps no tenia tarjertas para hacerlas */

const createUbicacionSchema = z.object({
    direccion: z
      .string({ required_error: 'La dirección es requerida' })
      .min(5, 'La dirección debe tener al menos 5 caracteres'),
  
    pais: z
      .string({ required_error: 'El país es requerido' })
      .min(2, 'El país debe tener al menos 2 caracteres'),
  
    ciudad: z
      .string({ required_error: 'La ciudad es requerida' })
      .min(2, 'La ciudad debe tener al menos 2 caracteres'),
  
    latitud: z
      .number({ required_error: 'La latitud es requerida' })
      .min(-90, 'La latitud mínima es -90')
      .max(90, 'La latitud máxima es 90'),
  
    longitud: z
      .number({ required_error: 'La longitud es requerida' })
      .min(-180, 'La longitud mínima es -180')
      .max(180, 'La longitud máxima es 180')
  });
  

const formSchema = z.object({
  descripcion: z
  .string({ required_error: 'La descripción es requerida' })
   .min(1,'La descripción no puede estar vacía'),

   precio: z
   .number({ required_error: 'El precio es requerido' })
   .positive('El precio debe ser un número positivo'),

   estado: z.enum([ESTADO.DISPONIBLE,ESTADO.OCUPADO], {
    message: 'El estado es requerido'
  }),
 
 area: z
   .number({ required_error: 'El área es requerida' })
   .positive('El área debe ser un número positivo'),

 NroHabitaciones: z
   .number({ required_error: 'El número de habitaciones debe ser un número' })
   .int('El número de habitaciones debe ser un número entero')
   .nonnegative('No puede ser negativo'),

 NroBanos: z
   .number({ required_error: 'El número de baños debe ser un número' })
   .int('El número de baños debe ser un número entero')
   .nonnegative('No puede ser negativo'),

 NroEstacionamientos: z
   .number({ required_error: 'El número de estacionamientos debe ser un número' })
   .int('El número de estacionamientos debe ser un número entero')
   .nonnegative('No puede ser negativo'),

   /*se agrego los campos de dueños 
    pero esta comentado por que todavia no hay dueños
  
  ci: z
      .number({ required_error: 'El carnet de identidad es requerido' })
      .int('El carnet de identidad debe ser un número entero')
      .positive('El carnet de identidad debe ser un número positivo')
      .min(1, 'El código es requerido'),
  name: z
      .string({ required_error: 'El nombre es requerido' })
      .min(3, 'El nombre debe tener al menos 3 caracteres')
      .max(100, 'El nombre debe tener menos de 100 caracteres'),

  telefono: z
  .number({ required_error: 'El telefono es requerida' })
  .positive('El telefono debe ser un número positivo'),
  */

  user: z.string().min(1, 'El usuario es requerido'),
  category: z.string().min(1, 'La categoria es requerida'),
  modality: z.string().min(1, 'La modalidad es requerida'),
  sector: z.string().min(1, 'El sector es requerido'),
  ubicacion: createUbicacionSchema 
});

const StateFormPage = ({ buttonText, title }: IFormProps) => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Inmueble', path: PrivateRoutes.STATE },
    { label: title }
  ])

  const { id } = useParams()
  console.log(id)
  const navigate = useNavigate()
  const { createState, isMutating } = useCreateState()
  const { updateState } = useUpdateState()
//  const { allUsers } = useGetAllUser() por alguna razon dice que devuelve un any
  const { state } = useGetState(id)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
     values: {
        descripcion: state?.descripcion ?? '',
        precio: state?.precio ?? 0,
        estado: state?.estado ?? ESTADO.DISPONIBLE,
        area: state?.area ?? 0,
        NroHabitaciones: state?.NroHabitaciones ?? 0,
        NroBanos: state?.NroBanos ?? 0,
        NroEstacionamientos: state?.NroEstacionamientos ?? 0,
        user: state?.user?.id ?? '',
        category: state?.category ?? '', //ponerle el id cuando este catagoria
        modality: state?.modality ?? '', //poner el id cuando este modalidad
        sector: state?.sector?.id ?? '',
         ubicacion: {
           direccion: state?.ubicacion?.direccion ?? '',
           pais: state?.ubicacion?.pais ?? '',
           ciudad: state?.ubicacion?.ciudad ?? '',
           latitud: state?.ubicacion?.latitud ?? 0,
           longitud: state?.ubicacion?.longitud ?? 0,
        },
    }
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log('Datos enviados:', data)
    if (id) {
      toast.promise(updateState({ id, ...data }), {
        loading: 'Actualizando Inmueble...',
        success: () => {
          setTimeout(() => {
            navigate(PrivateRoutes.STATE, { replace: true })
          }, 1000)
          return 'Inmueble actualizado exitosamente'
        },
        error(error) {
          return error.errorMessages[0] ?? 'Error al actualizar el Inmueble'
        }
      })
    } else {
      toast.promise(createState(data), {
        loading: 'Creando Inmueble...',
        success: () => {
          setTimeout(() => {
            navigate(PrivateRoutes.STATE, { replace: true })
          }, 1000)
          return 'Inmueble creado exitosamente'
        },
        error(error) {
          return error.errorMessages[0] ?? 'Error al crear el Inmueble'
        }
      })
    }
  }

  return (
    <section className="grid flex-1 items-start gap-4 lg:gap-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto w-full flex flex-col gap-4 lg:gap-6"
        >
          <div>
            <div className="flex items-center gap-4">
              <Button
                type="button"
                onClick={() => {
                  navigate(PrivateRoutes.STATE)
                }}
                variant="outline"
                size="icon"
                className="h-7 w-7"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span className="sr-only">Volver</span>
              </Button>
              <h2 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {title}
              </h2>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button
                  type="button"
                  onClick={() => {
                    navigate(PrivateRoutes.STATE)
                  }}
                  variant="outline"
                  size="sm"
                >
                  Descartar
                </Button>
                <Button type="submit" size="sm" disabled={isMutating}>
                  {buttonText}
                </Button>
              </div>
            </div>
          </div>

          {/* Contenido del formulario */}
      <div className="grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_350px] gap-4 lg:gap-6">
        {/* Sección principal */}
        <Card className="w-full">
          <CardHeader><CardTitle>Datos del Inmueble </CardTitle></CardHeader>
          <CardContent className="grid gap-4 lg:gap-6">

            {/* Inmueble */}
            <FormField control={form.control} name="descripcion" render={({ field }) => (
              <FormItem><FormLabel>Descripción</FormLabel>
                <FormControl><Textarea {...field} placeholder="Descripción del inmueble" /></FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="precio" render={({ field }) => (
                <FormItem><FormLabel>Precio</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="area" render={({ field }) => (
                <FormItem><FormLabel>Área (m²)</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField control={form.control} name="NroHabitaciones" render={({ field }) => (
                <FormItem><FormLabel>Habitaciones</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="NroBanos" render={({ field }) => (
                <FormItem><FormLabel>Baños</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="NroEstacionamientos" render={({ field }) => (
                <FormItem><FormLabel>Estacionamientos</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Dueño */}
            {/*
            <div className="grid grid-cols-3 gap-4">
              <FormField control={form.control} name="ci" render={({ field }) => (
                <FormItem><FormLabel>CI Dueño</FormLabel>
                  <FormControl><Input type="number" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="nombreDuenio" render={({ field }) => (
                <FormItem><FormLabel>Nombre Dueño</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="telefonoDuenio" render={({ field }) => (
                <FormItem><FormLabel>Teléfono</FormLabel>
                  <FormControl><Input type="tel" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>*/}
          </CardContent>
        </Card>

        {/* Sección derecha */}
        <Card className="w-full h-fit">
          <CardHeader><CardTitle>Asignacion</CardTitle></CardHeader>
          <CardContent className="grid gap-4 lg:gap-6">

            {/* Selects */}
            {/* 
            <FormField
              control={form.control}
              name="user"
              render={({ field }) => (
              <FormItem className="flex flex-col justify-between space-y-1 pt-1">
                <FormLabel className="leading-normal">Usuario *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                <FormControl>
                   <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                    'justify-between font-normal',
                    !field.value && 'text-muted-foreground'
                    )}
                  >
                {field.value ? (
                <span className="text-ellipsis whitespace-nowrap overflow-hidden">
                  {allUsers?.find((user) => user.id === field.value)?.name}
                </span>
                ) : (
                <span className="text-light-text-secondary dark:text-dark-text-secondary text-ellipsis whitespace-nowrap overflow-hidden">
                  Seleccionar usuario
                </span>
              )}
              <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Buscar usuario..." />
            <CommandList>
              <CommandEmpty>Usuario no encontrado.</CommandEmpty>
              <CommandGroup>
                {allUsers?.map((user) => (
                  <CommandItem
                    value={user.name}
                    key={user.id}
                    onSelect={() => {
                      form.setValue('user', user.id)
                      form.clearErrors('user')
                    }}
                  >
                    <CheckCheckIcon
                      className={cn(
                        'mr-2 h-4 w-4',
                        user.id === field.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {user.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="category"
  render={({ field }) => (
    <FormItem className="flex flex-col justify-between space-y-1 pt-1">
      <FormLabel className="leading-normal">Categoría *</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                'justify-between font-normal',
                !field.value && 'text-muted-foreground'
              )}
            >
              {field.value ? (
                <span className="text-ellipsis whitespace-nowrap overflow-hidden">
                  {allCategories?.find((category) => category.id === field.value)?.name}
                </span>
              ) : (
                <span className="text-light-text-secondary dark:text-dark-text-secondary text-ellipsis whitespace-nowrap overflow-hidden">
                  Seleccionar categoría
                </span>
              )}
              <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Buscar categoría..." />
            <CommandList>
              <CommandEmpty>Categoría no encontrada.</CommandEmpty>
              <CommandGroup>
                {allCategories?.map((category) => (
                  <CommandItem
                    value={category.name}
                    key={category.id}
                    onSelect={() => {
                      form.setValue('category', category.id)
                      form.clearErrors('category')
                    }}
                  >
                    <CheckCheckIcon
                      className={cn(
                        'mr-2 h-4 w-4',
                        categorty.id === field.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {category.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  )}
/>

<FormField
  control={form.control}
  name="modality"
  render={({ field }) => (
    <FormItem className="flex flex-col justify-between space-y-1 pt-1">
      <FormLabel className="leading-normal">Modalidad *</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                'justify-between font-normal',
                !field.value && 'text-muted-foreground'
              )}
            >
              {field.value ? (
                <span className="text-ellipsis whitespace-nowrap overflow-hidden">
                  {allModalities?.find((modality) => modality.id === field.value)?.name}
                </span>
              ) : (
                <span className="text-light-text-secondary dark:text-dark-text-secondary text-ellipsis whitespace-nowrap overflow-hidden">
                  Seleccionar modalidad
                </span>
              )}
              <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Buscar modalidad..." />
            <CommandList>
              <CommandEmpty>Modalidad no encontrada.</CommandEmpty>
              <CommandGroup>
                {allModalities?.map((modaltity) => (
                  <CommandItem
                    value={modality.name}
                    key={modality.id}
                    onSelect={() => {
                      form.setValue('modality', modality.id)
                      form.clearErrors('modality')
                    }}
                  >
                    <CheckCheckIcon
                      className={cn(
                        'mr-2 h-4 w-4',
                        modality.id === field.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {modality.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  )}
/>
<FormField
  control={form.control}
  name="sector"
  render={({ field }) => (
    <FormItem className="flex flex-col justify-between space-y-1 pt-1">
      <FormLabel className="leading-normal">Sector</FormLabel>
      <Popover>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                'justify-between font-normal',
                !field.value && 'text-muted-foreground'
              )}
            >
              {field.value ? (
                <span className="text-ellipsis whitespace-nowrap overflow-hidden">
                  {allSector?.find((sector) => sector.id === field.value)?.name}
                </span>
              ) : (
                <span className="text-light-text-secondary dark:text-dark-text-secondary text-ellipsis whitespace-nowrap overflow-hidden">
                  Seleccionar Sector
                </span>
              )}
              <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput placeholder="Buscar modalidad..." />
            <CommandList>
              <CommandEmpty>Sector no encontrada.</CommandEmpty>
              <CommandGroup>
                {allSector?.map((sector) => (
                  <CommandItem
                    value={sector.name}
                    key={sector.id}
                    onSelect={() => {
                      form.setValue('sector', sector.id)
                      form.clearErrors('sector')
                    }}
                  >
                    <CheckCheckIcon
                      className={cn(
                        'mr-2 h-4 w-4',
                        sector.id === field.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {sector.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  )}
/>

            {/* Ubicación 
            <FormField control={form.control} name="ubicacion" render={({ field }) => (
              <FormItem>
                <FormLabel>Ubicación</FormLabel>
                <FormControl>
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />*/}

            {/* Imágenes */}
            {/*
            <FormField control={form.control} name="imagenes" render={({ field }) => (
              <FormItem>
                <FormLabel>Imágenes</FormLabel>
                <FormControl>
                  <Input type="file" multiple onChange={(e) => field.onChange(e.target.files)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />*/}

          </CardContent>
        </Card>
      </div>

      {/* Botones móviles */}
      <div className="flex justify-center gap-2 md:hidden">
        <Button type="button" variant="outline" size="sm" onClick={() => navigate(PrivateRoutes.STATE)}>Descartar</Button>
        <Button type="submit" size="sm" disabled={isMutating}>{buttonText}</Button>
      </div>
    </form>
  </Form>
</section>
  )
}
export default StateFormPage