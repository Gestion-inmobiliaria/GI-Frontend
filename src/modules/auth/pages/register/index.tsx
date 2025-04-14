import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import Loading from '@/components/shared/loading'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ENDPOINTS, GENDER } from '@/utils'
import { useEffect } from 'react'
import { useCreateResource } from '@/hooks/useApiResource'
import { toast } from 'sonner'
import { useAuth } from '@/hooks'

const formSchema = z.object({
  ci: z.string().min(1, { message: 'Campo requerido' }),
  name: z.string().min(1, { message: 'Campo requerido' }),
  email: z
    .string()
    .min(1, { message: 'Campo requerido' })
    .email('Formato de correo inválido'),
  password: z
    .string()
    .min(1, { message: 'Campo requerido' })
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
  phone: z.string().min(1, { message: 'Campo requerido' }),
  gender: z.enum(['masculino', 'femenino'], {
    errorMap: () => ({ message: 'Campo requerido' })
  }),
  nameRealState: z.string().min(1, { message: 'Campo requerido' }),
  confirmPassword: z.string()
    .min(1, { message: 'Campo requerido' })
    .min(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
})
const RegisterPage = (): JSX.Element => {
  const { createResource: register, error, isMutating } = useCreateResource({ endpoint: ENDPOINTS.AUTH + '/register' })
  const { signWithEmailPassword } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ci: '',
      name: '',
      email: '',
      password: '',
      phone: '',
      gender: 'masculino',
      nameRealState: '',
      confirmPassword: ''
    }
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    toast.promise(
      register({
        ci: data.ci,
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        gender: data.gender,
        nameRealState: data.nameRealState
      }),
      {
        loading: 'Creando cuenta...',
        success: () => {
          void signWithEmailPassword({
            email: data.email,
            password: data.password
          })
          form.reset()
          return 'Cuenta creada con éxito'
        },
        error: (error) => {
          return error.message
        }
      }
    )
  }

  useEffect(() => {
    if (form.formState.errors.confirmPassword) {
      form.setError('confirmPassword', {
        message: 'Las contraseñas no coinciden'
      })
    }
    if (form.getValues('password') !== form.getValues('confirmPassword')) {
      form.setError('confirmPassword', {
        message: 'Las contraseñas no coinciden'
      })
    } else {
      form.clearErrors('confirmPassword')
    }
  }, [form.watch('confirmPassword')])

  return (
    <div className="w-full min-h-[100dvh] grid lg:min-h-[100dvh]">
      <div className="flex items-center justify-center py-12 z-10">
        <div className="mx-auto grid gap-6 px-4">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
              Crear cuenta
            </h1>
            <p className="text-balance text-muted-foreground">
              Regístrate para acceder a la plataforma de gestión inmobiliaria
            </p>
          </div>
          <div className="grid gap-4">
            {error && <div className="text-red-500 text-center">{error.errorMessages.toString()}</div>}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className='md:min-w-[620px] w-full'>
                <div className='grid gap-4 md:grid-cols-2 '>
                  <div className='flex flex-col gap-4'>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre completo</FormLabel>
                          <FormControl>
                            <Input
                              id="text"
                              type="text"
                              required
                              placeholder="Tu nombre"
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
                          <FormLabel>Carnet de identidad</FormLabel>
                          <FormControl>
                            <Input
                              id="ci"
                              type="text"
                              placeholder="Tu carnet de identidad"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <>
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
                                  {/* <SelectItem value={GENDER.OTRO}>Otro</SelectItem> */}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        </>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <>
                          <FormItem>
                            <FormLabel>Teléfono</FormLabel>
                            <FormControl>
                              <Input
                                id="phone"
                                type="tel"
                                placeholder="Tu teléfono"
                                required
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        </>
                      )}
                    />
                  </div>
                  <div className='flex flex-col gap-4 w-full'>
                    <FormField
                      control={form.control}
                      name="nameRealState"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de la inmobiliaria</FormLabel>
                          <FormControl>
                            <Input
                              id="nameRealState"
                              type="text"
                              placeholder="Tu inmobiliaria"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo electrónico</FormLabel>
                          <FormControl>
                            <Input
                              id="email"
                              type="email"
                              required
                              placeholder="tu@ejemplo.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contraseña</FormLabel>
                          <FormControl>
                            <Input
                              id="password"
                              type="password"
                              placeholder="Tu contraseña"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* confirmar contraseña */}
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar contraseña</FormLabel>
                          <FormControl>
                            <Input
                              id="confirmPassword"
                              type="password"
                              placeholder="Confirma tu contraseña"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={isMutating}
                  className="w-full mt-4"
                >
                  {isMutating ? <Loading /> : 'Iniciar sesión'}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
