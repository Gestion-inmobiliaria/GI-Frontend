import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import {ChevronLeftIcon,} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { z } from 'zod'
import { toast } from 'sonner'
import { useHeader } from '@/hooks'
import { type IFormProps } from '@/models'
import { ESTADO } from '@/modules/state/models/estado.model'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useState } from 'react'
import { useGetAllUser } from '@/modules/users/hooks/useUser'
import { getModalities } from '@/services/modality.service'
import { getCategories } from '@/services/category.service'
import { getSectors } from '@/services/sector.service'
import { User } from '@/modules/users/models/user.model'
import { Category } from '@/models/category.model'
import { Modality } from '@/models/modality.model'
import { Sector } from './stateLista'
import { CoordinatePicker } from './state-maps'

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

   estado: z.enum([
    ESTADO.DISPONIBLE,
    ESTADO.RESERVADO,
    ESTADO.VENDIDO,
    ESTADO.ALQUILADO,
    ESTADO.ANTICRETADO],{
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

  comision: z
   .number({ required_error: 'la comision es requerido' })
   .min(0.01, 'la comision debe ser mayor a 0')
   .max(1, 'la comision no puede ser mayor a 1')
   .positive('la comsion debe ser un número positivo'),

  condicion_Compra: z
   .string({ required_error: 'La condicion de compra es requerida' })
   .min(1,'La condicion de compra no puede estar vacía'),

//relaciones 
  user: z.string().min(1, 'El usuario es requerido'),
  category: z.string().min(1, 'La categoria es requerida'),
  modality: z.string().min(1, 'La modalidad es requerida'),
  sector: z.string().min(1, 'El sector es requerido'),

  //ubicacion  
  ubicacion: createUbicacionSchema 
});

const StateFormPage = ({ buttonText, title }: IFormProps) => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Inmueble', path: PrivateRoutes.STATE },
    { label: title },
  ]);

  const { id } = useParams();
  const navigate = useNavigate();
  const { createState, isMutating } = useCreateState();
  const { updateState } = useUpdateState();
  const { allUsers, isLoading} = useGetAllUser(); 
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [modalities, setModalities] = useState<Modality[]>([]);
  const [loadingModalities, setLoadingModalities] = useState(true);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loadingSectors, setLoadingSectors] = useState(true);
  const editMode = Boolean(id);
//const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

  const { state } = useGetState(id as string );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      descripcion: '',
      precio: 0,
      estado: ESTADO.DISPONIBLE,
      area: 0,
      NroHabitaciones: 0,
      NroBanos: 0,
      NroEstacionamientos: 0,
      comision: 0,
      condicion_Compra: '',
      user: '',
      category: '',
      modality: '',
      sector: '',
      ubicacion: {
        direccion: '',
        pais: '',
        ciudad: '',
        latitud: 0,
        longitud: 0,
      },
    },
  });

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      if (response.statusCode === 200 && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        console.error("Formato de respuesta inesperado:", response);
        setCategories([]);
      }
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  fetchCategories();
}, []);

useEffect(() => {
  const fetchModalities = async () => {
    try {
      const response = await getModalities();
      // Asegúrate de que response.data contiene el array de modalidades
      if (response.statusCode === 200 && Array.isArray(response.data)) {
        setModalities(response.data);
      } else {
        console.error("Formato de respuesta inesperado:", response);
        setModalities([]);
      }
    } catch (error) {
      console.error("Error al obtener modalidades:", error);
      setModalities([]);
    } finally {
      setLoadingModalities(false);
    }
  };

  fetchModalities();
}, []);

useEffect(() => {
  const fetchSectors = async () => {
    try {
      const response = await getSectors();
      // Asegúrate de que response.data contiene el array de sectores
      if (response.statusCode === 200 && Array.isArray(response.data)) {
        setSectors(response.data);
      } else {
        console.error("Formato de respuesta inesperado:", response);
        setSectors([]);
      }
    } catch (error) {
      console.error("Error al obtener sectores:", error);
      setSectors([]);
    } finally {
      setLoadingSectors(false);
    }
  };

  fetchSectors();
}, []);

  // Sincronizar valores cuando 'state' esté listo
  useEffect(() => {
    if (state) {
      form.reset({
        descripcion: state.descripcion ?? '',
        precio: state.precio ?? 0,
//        estado: ESTADO[state?.estado?.toUpperCase() as keyof typeof ESTADO] ?? ESTADO.DISPONIBLE,
        area: state.area ?? 0,
        NroHabitaciones: state.NroHabitaciones ?? 0,
        NroBanos: state.NroBanos ?? 0,
        NroEstacionamientos: state.NroEstacionamientos ?? 0,
        comision: state.comision ?? 0,
        condicion_Compra: state.condicion_Compra ?? '',
        user: state.user?.id ?? '',
        category: state.category?.id ?? '',
        modality: state.modality?.id ?? '',
        sector: state.sector?.id ?? '',
        ubicacion: {
          direccion: state.ubicacion?.direccion ?? '',
          pais: state.ubicacion?.pais ?? '',
          ciudad: state.ubicacion?.ciudad ?? '',
          latitud: state.ubicacion?.latitud ?? 0,
          longitud: state.ubicacion?.longitud ?? 0,
        },
      });
    }
  }, [state, form]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log('Datos enviados:', data)
    const request =id
    ? updateState({ id, ...data })
    : createState(data)
    const loadingMessage = id ?'Actualizando Inmueble...':'Creando Inmueble...'
    const successMessage = id ? 'Inmueble actualizado exitosamente': 'Inmueble creado exitosamente' 
    const errorMessage = id ? 'Error al actualizar el Inmueble': 'Error al crear el Inmueble'

    toast.promise(request, {
    loading: loadingMessage,
    success: () => {
      setTimeout(() => {
        navigate(PrivateRoutes.STATE, { replace: true })
      }, 1000)
      return successMessage
    },
    error: (error) => error?.errorMessages?.[0] ?? errorMessage
  })
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
                onClick={() => navigate(PrivateRoutes.STATE)}
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
                  onClick={() => navigate(PrivateRoutes.STATE)}
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

          <div className="grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_350px] gap-4 lg:gap-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Datos del Inmueble</CardTitle>
              </CardHeader>

              <CardContent className="grid gap-6">
                <FormField control={form.control} name="descripcion" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Breve descripción del inmueble" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

              {/* Precio y Área */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField control={form.control} name="precio" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio</FormLabel>
                      <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                       </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="area" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Área (m²)</FormLabel>
                      <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

              {/* Habitaciones, Baños, Estacionamientos */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField control={form.control} name="NroHabitaciones" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Habitaciones</FormLabel>
                      <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="NroBanos" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Baños</FormLabel>
                      <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                 <FormField control={form.control} name="NroEstacionamientos" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estacionamientos</FormLabel>
                      <FormControl><Input type="number" {...field} value={field.value ?? ''} onChange={(e) => field.onChange(e.target.valueAsNumber)} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

              {/* Comisión y Estado */}
<div className="grid grid-cols-2 gap-4">
  {editMode && (
    <FormField control={form.control} name="estado" render={({ field }) => (
      <FormItem>
        <FormLabel>Estado</FormLabel>
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona el estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="disponible">Disponible</SelectItem>
              <SelectItem value="reservado">Reservado</SelectItem>
              <SelectItem value="vendido">Vendido</SelectItem>
              <SelectItem value="alquilado">Alquilado</SelectItem>
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    )} />
  )}

  <FormField control={form.control} name="comision" render={({ field }) => (
    <FormItem>
      <FormLabel>Comisión (%)</FormLabel>
      <FormControl>
        <Input
          type="number"
          step="0.01"
          min="0"
          max="1"
          {...field}
          value={field.value ?? ''}
          onChange={e => {
        const value = e.target.value;
        field.onChange(value === '' ? '' : parseFloat(value));
          }}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )} />
</div>
              {/* Condiciones de compra */}
              <FormField control={form.control} name="condicion_Compra" render={({ field }) => (
                <FormItem>
                  <FormLabel>Condiciones de Compra</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Ej. se requiere anticipo del 30%" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </CardContent>
          </Card>
        </div>
     {/* Agente encargado */}
<Card className="w-full">
  <CardHeader>
    <CardTitle>Información del Inmueble</CardTitle>
  </CardHeader>

  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Agente encargado */}
    <FormField control={form.control} name="user" render={({ field }) => (
      <FormItem>
        <FormLabel>Agente</FormLabel>
        <FormControl>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={isLoading || allUsers.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder={isLoading ? "Cargando usuarios..." : "Selecciona un agente"} />
            </SelectTrigger>
            <SelectContent>
              {allUsers?.map((user: User) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    )} />

    {/* Categoría del inmueble */}
    <FormField control={form.control} name="category" render={({ field }) => (
      <FormItem>
        <FormLabel>Categoría</FormLabel>
        <FormControl>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={loadingCategories}
          >
            <SelectTrigger>
              <SelectValue 
                placeholder={
                  loadingCategories 
                    ? "Cargando categorías..." 
                    : categories.length === 0 
                      ? "No hay categorías disponibles" 
                      : "Selecciona una categoría"
                } 
              />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    )} />

    {/* Modalidad del inmueble */}
    <FormField control={form.control} name="modality" render={({ field }) => (
      <FormItem>
        <FormLabel>Modalidad</FormLabel>
        <FormControl>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={loadingModalities}
          >
            <SelectTrigger>
              <SelectValue 
                placeholder={
                  loadingModalities 
                    ? "Cargando modalidades..." 
                    : modalities.length === 0 
                      ? "No hay modalidades disponibles" 
                      : "Selecciona una modalidad"
                } 
              />
            </SelectTrigger>
            <SelectContent>
              {modalities.map((mod) => (
                <SelectItem key={mod.id} value={mod.id}>
                  {mod.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    )} />

    {/* Sector del inmueble */}
    <FormField control={form.control} name="sector" render={({ field }) => (
      <FormItem>
        <FormLabel>Sector</FormLabel>
        <FormControl>
          <Select
            onValueChange={field.onChange}
            value={field.value}
            disabled={loadingSectors}
          >
            <SelectTrigger>
              <SelectValue 
                placeholder={
                  loadingSectors 
                    ? "Cargando sectores..." 
                    : sectors.length === 0 
                      ? "No hay sectores disponibles" 
                      : "Selecciona un sector"
                } 
              />
            </SelectTrigger>
            <SelectContent>
              {sectors.map((sec) => (
                <SelectItem key={sec.id} value={sec.id}>
                  {sec.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
        <FormMessage />
      </FormItem>
    )} />
  </CardContent>
</Card>

<Card className="w-full mt-4">
  <CardHeader>
    <CardTitle>Ubicación Geográfica</CardTitle>
    <CardDescription>Primero llena los datos de dirección, luego selecciona en el mapa.</CardDescription>
  </CardHeader>
  <CardContent className="grid gap-4">
    {/* Inputs: País y Ciudad */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="ubicacion.pais"
        render={({ field }) => (
          <FormItem>
            <FormLabel>País</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="ubicacion.ciudad"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ciudad</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>

    {/* Input: Dirección completa */}
    <FormField
      control={form.control}
      name="ubicacion.direccion"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Dirección Completa</FormLabel>
          <FormControl>
            <Input {...field} placeholder="Calle, número, zona, etc." />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    {/* Mapa */}
    <div>
      <FormLabel>Selecciona las coordenadas en el mapa</FormLabel>
      <CoordinatePicker 
        initialPosition={
          form.getValues('ubicacion.latitud') && form.getValues('ubicacion.longitud')
            ? [form.getValues('ubicacion.latitud'), form.getValues('ubicacion.longitud')]
            : undefined
        }
        onCoordinateChange={(lat, lng) => {
          form.setValue('ubicacion.latitud', lat);
          form.setValue('ubicacion.longitud', lng);
        }}
      />
    </div>
  </CardContent>
</Card>

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