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
  useCreateUser,
  useGetUser,
  useUpdateUser
} from '@/modules/users/hooks/useUser'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CheckCheckIcon,
  ChevronLeftIcon,
  ChevronsUpDownIcon
} from 'lucide-react'
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
import { useGetAllRole } from '@/modules/auth/hooks/useRole'
import { toast } from 'sonner'
import { useHeader } from '@/hooks'
import { type IFormProps } from '@/models'
import { GENDER } from '@/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  ci: z
    .number({ required_error: 'El carnet de identidad es requerido' })
    .int('El carnet de identidad debe ser un número entero')
    .positive('El carnet de identidad debe ser un número positivo')
    .min(1, 'El código es requerido'),
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre debe tener menos de 100 caracteres'),
  email: z
    .string({ required_error: 'El correo es requerido' })
    .email('Ingrese un correo valido')
    .max(100, 'El correo debe tener menos de 100 caracteres'),
  password: z
    .string({ required_error: 'La contraseña es requerida' })    
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(20, 'La contraseña debe tener menos de 20 caracteres'),
  gender: z.enum([GENDER.FEMENINO, GENDER.MASCULINO, GENDER.OTRO], {
    message: 'El genero es requerido'
  }),
  role: z.string().min(1, 'El rol es requerido'),
  phone: z.string().optional()
})

const UserFormPage = ({ buttonText, title }: IFormProps) => {
  useHeader([
    { label: 'Dashboard', path: PrivateRoutes.DASHBOARD },
    { label: 'Usuario', path: PrivateRoutes.USER },
    { label: title }
  ])
  const { id } = useParams()
  console.log(id)
  const navigate = useNavigate()
  const { createUser, isMutating } = useCreateUser()
  const { updateUser } = useUpdateUser()
  const { allRoles } = useGetAllRole()
  const { user } = useGetUser(id)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      ci: user?.ci ?? 0,
      email: user?.email ?? '',
      name: user?.name ?? '',
      password: user?.password ?? '',
      role: user?.role.id ?? '',
      gender: user?.gender ?? GENDER.OTRO,
      phone: user?.phone ?? undefined
    }
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log('Datos enviados:', data)
    if (id) {
      toast.promise(updateUser({ id, ...data }), {
        loading: 'Actualizando usuario...',
        success: () => {
          setTimeout(() => {
            navigate(PrivateRoutes.USER, { replace: true })
          }, 1000)
          return 'Usuario actualizado exitosamente'
        },
        error(error) {
          return error.errorMessages[0] ?? 'Error al actualizar el usuario'
        }
      })
    } else {
      toast.promise(createUser(data), {
        loading: 'Creando usuario...',
        success: () => {
          setTimeout(() => {
            navigate(PrivateRoutes.USER, { replace: true })
          }, 1000)
          return 'Usuario creado exitosamente'
        },
        error(error) {
          return error.errorMessages[0] ?? 'Error al crear el usuario'
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
                  navigate(PrivateRoutes.USER)
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
                    navigate(PrivateRoutes.USER)
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
          <div className="grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_350px] gap-4 lg:gap-6">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Datos personales</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 lg:gap-6">
                <div className="grid gap-4 lg:gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ingresa el nombre del usuario"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ci"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Carnet de Identidad</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="10360074..."
                            onChange={(e) => {
                              field.onChange(Number(e.target.value))
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-4 lg:gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo electrónico</FormLabel>
                        <FormControl>
                          <Input placeholder="user@example.com" {...field} />
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
                          <Input placeholder="77112200..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="************"
                          type="password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />                
              </CardContent>
            </Card>
            <Card className="w-full h-fit">
              <CardHeader>
                <CardTitle>Asignación</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 lg:gap-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-6 w-full">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="flex flex-col justify-between space-y-1 pt-1">
                        <FormLabel className="leading-normal">Rol *</FormLabel>
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
                                    {
                                      allRoles?.find(
                                        (role) => role.id === field.value
                                      )?.name
                                    }
                                  </span>
                                ) : (
                                  <span className="text-light-text-secondary dark:text-dark-text-secondary text-ellipsis whitespace-nowrap overflow-hidden">
                                    Seleccionar rol
                                  </span>
                                )}
                                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="p-0">
                            <Command>
                              <CommandInput placeholder="Seleccionar un rol..." />
                              <CommandList>
                                <CommandEmpty>Rol no encontrado.</CommandEmpty>
                                <CommandGroup>
                                  {allRoles?.map((role) => (
                                    <CommandItem
                                      value={role.name}
                                      key={role.id}
                                      onSelect={() => {
                                        form.setValue('role', role.id)
                                        form.clearErrors('role')
                                      }}
                                    >
                                      <CheckCheckIcon
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          role.id === field.value
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      {role.name}
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
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Género</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger aria-label="Selecciona el género">
                                <SelectValue placeholder="Seleccione el género" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value={GENDER.FEMENINO}>
                                Femenino
                              </SelectItem>
                              <SelectItem value={GENDER.MASCULINO}>
                                Masculino
                              </SelectItem>
                              <SelectItem value={GENDER.OTRO}>Otro</SelectItem>
                            </SelectContent>
                          </Select>
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
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                navigate(PrivateRoutes.USER)
              }}
            >
              Descartar
            </Button>
            <Button type="submit" size="sm" disabled={isMutating}>
              {buttonText}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  )
}

export default UserFormPage
