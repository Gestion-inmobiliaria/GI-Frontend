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
      comision: 0.01,
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

// Función genérica para cargar datos
const fetchData = async ({
  fetchFn,
  setData,
  setLoading,
  dataName,
}: {
  fetchFn: () => Promise<any>,
  setData: React.Dispatch<React.SetStateAction<any[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  dataName: string,
}) => {
  try {
    const response = await fetchFn();
    if (response.statusCode === 200 && Array.isArray(response.data)) {
      setData(response.data);
    } else {
      console.error(`⚠️ Formato inesperado en ${dataName}:`, response);
      setData([]);
    }
  } catch (error) {
    console.error(`❌ Error al obtener ${dataName}:`, error);
    setData([]);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchData({ fetchFn: getCategories, setData: setCategories, setLoading: setLoadingCategories, dataName: 'categorías' });
  fetchData({ fetchFn: getModalities, setData: setModalities, setLoading: setLoadingModalities, dataName: 'modalidades' });
  fetchData({ fetchFn: getSectors, setData: setSectors, setLoading: setLoadingSectors, dataName: 'sectores' });
}, []);

  // Sincronizar valores cuando 'state' esté listo
  useEffect(() => {
    // Solo resetea si hay id (modo edición) y hay datos de state
    if (id && state) {
      form.reset({
        descripcion: state.descripcion ?? '',
        precio: Number(state.precio) ?? 0,
        estado: state.estado as ESTADO ?? ESTADO.DISPONIBLE,
        area: Number(state.area) ?? 0,
        NroHabitaciones: Number(state.NroHabitaciones) ?? 0,
        NroBanos: Number(state.NroBanos) ?? 0,
        NroEstacionamientos: Number(state.NroEstacionamientos) ?? 0,
        comision: Number(state.comision) ?? 0,
        condicion_Compra: state.condicion_Compra ?? '',
        user: state.user?.id ?? '',
        category: state.category?.id ?? '',
        modality: state.modality?.id ?? '',
        sector: state.sector?.id ?? '',
        ubicacion: {
          direccion: state.ubicacion?.direccion ?? '',
          pais: state.ubicacion?.pais ?? '',
          ciudad: state.ubicacion?.ciudad ?? '',
          latitud: Number(state.ubicacion?.latitud) ?? 0,
          longitud: Number(state.ubicacion?.longitud) ?? 0,
        },
      });
    }
  }, [id, state]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
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
    error: (error) => {
     if (error?.errorMessages?.[0]) return error.errorMessages[0];
     if (typeof error === 'string') return error;
     return errorMessage;
    }
  })
}
const [searchLocation, setSearchLocation] = useState<{ pais: string; ciudad: string }>();

// Helper para obtener coordenadas válidas
const getInitialPosition = () => {
  const lat = form.getValues("ubicacion.latitud");
  const lng = form.getValues("ubicacion.longitud");
  if (
    typeof lat === "number" &&
    typeof lng === "number" &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat !== 0 &&
    lng !== 0
  ) {
    return [lat, lng] as [number, number];
  }
  return undefined;
};

return (
  <section className="flex-1 grid gap-6">
  <Form {...form}>
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6 mx-auto w-full"
    >
      {/* Header */}
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
        <h2 className="flex-1 text-xl font-semibold tracking-tight whitespace-nowrap sm:grow-0">
          {title}
        </h2>
        <div className="hidden md:flex items-center gap-2 ml-auto">
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

      {/* Dos columnas en cards */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Columna izquierda */}
        <Card>
          <CardHeader>
            <CardTitle>Detalles del Inmueble</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Descripción del inmueble" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="precio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />  

            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Área (m²)</FormLabel>
                  <FormControl>
                    <Input 
                    type="number"
                    step="0.01" 
                    {...field} 
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="NroHabitaciones"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de habitaciones</FormLabel>
                  <FormControl>
                    <Input 
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="NroBanos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de baños</FormLabel>
                  <FormControl>
                    <Input 
                    type="number" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                     />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="NroEstacionamientos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estacionamientos</FormLabel>
                  <FormControl>
                    <Input 
                    type="number" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                     />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={!editMode}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(ESTADO).map((estado) => (
                        <SelectItem key={estado} value={estado}>
                          {estado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comision"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comisión (0 a 1)</FormLabel>
                  <FormControl>
                    <Input 
                    type="number" 
                    step="0.01" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="condicion_Compra"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condición de Compra</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ej: al contado, crédito, etc."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Columna derecha */}
        <Card>
          <CardHeader>
            <CardTitle>Relaciones</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="user"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Usuario</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un usuario" />
                    </SelectTrigger>
                    <SelectContent>
                      {allUsers?.map((user: User) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loadingCategories}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="modality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modalidad</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loadingModalities}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una modalidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {modalities.map((modality) => (
                        <SelectItem key={modality.id} value={modality.id}>
                          {modality.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sector"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sector</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={loadingSectors}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {sectors.map((sector) => (
                        <SelectItem key={sector.id} value={sector.id}>
                          {sector.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>

      {/* Botones móviles */}
      <div className="flex justify-center gap-2 md:hidden">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate(PrivateRoutes.STATE)}
        >
          Descartar
        </Button>
        <Button type="submit" size="sm" disabled={isMutating}>
          {buttonText}
        </Button>
      </div>

      <Card className="w-full mt-4">
  <CardHeader>
    <CardTitle>Ubicación Geográfica</CardTitle>
    <CardDescription>
      Llena los campos de dirección y selecciona el punto exacto en el mapa.
    </CardDescription>
  </CardHeader>
  <CardContent className="grid gap-6">
    
    {/* Inputs: País y Ciudad */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="ubicacion.pais"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="pais">País</FormLabel>
            <FormControl>
              <Input {...field} id="pais" placeholder="Ej: Bolivia" />
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
            <FormLabel htmlFor="ciudad">Ciudad</FormLabel>
            <FormControl>
              <Input {...field} id="ciudad" placeholder="Ej: Santa Cruz" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>

    {/* Dirección completa */}
    <FormField
      control={form.control}
      name="ubicacion.direccion"
      render={({ field }) => (
        <FormItem>
          <FormLabel htmlFor="direccion">Dirección completa</FormLabel>
          <FormControl>
            <Input
              {...field}
              id="direccion"
              placeholder="Calle, número, zona, etc."
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button
  type="button"
  onClick={() => {
    const pais = form.getValues("ubicacion.pais");
    const ciudad = form.getValues("ubicacion.ciudad");
    if (pais && ciudad) {
      setSearchLocation({ pais, ciudad });
    } else {
      // Opcional: podrías mostrar un mensaje de error si falta algo
      console.log("Debes ingresar país y ciudad");
    }
  }}
>
  Buscar en el mapa
</Button>

    {/* Coordenadas en el mapa */}
    <div className="space-y-2">
      <FormLabel>Selecciona la ubicación en el mapa</FormLabel>
      <CoordinatePicker
  initialPosition={getInitialPosition()}
  onCoordinateChange={(lat, lng) => {
    form.setValue("ubicacion.latitud", lat);
    form.setValue("ubicacion.longitud", lng);
  }}
  searchLocation={searchLocation}
/>

      {/* Mensaje si no hay coordenadas seleccionadas */}
      {!(form.getValues("ubicacion.latitud") && form.getValues("ubicacion.longitud")) && (
        <p className="text-sm text-destructive">Selecciona un punto en el mapa.</p>
      )}
    </div>
   </CardContent>
   </Card>

    </form>
  </Form>
</section>
);
}
export default StateFormPage