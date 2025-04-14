import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, BarChart3, ChevronRight, CreditCard, Home, Shield, Smartphone, Users, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import PlanCard from './components/planCard'
import { AppConfig } from '@/config'
import { useGetAllResource } from '@/hooks/useApiResource'
import { ENDPOINTS } from '@/utils'

const LandingPage = () => {
  const { allResource: plans } = useGetAllResource({
    endpoint: ENDPOINTS.PLAN
  })
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-sm dark:bg-dark-bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-primary font-bold text-xl">{AppConfig.APP_TITLE}</span>
              </Link>
            </div>
            <div className="flex items-center">
              {/* {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
              ) : ( */}
              <div className="flex space-x-4">
                <Link to="/login">
                  <Button variant="ghost">Iniciar Sesión</Button>
                </Link>
                <Link to="/register">
                  <Button variant="default">Registrarse</Button>
                </Link>
              </div>
              {/* )} */}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background pt-20 pb-32 dark:bg-gradient-to-b dark:from-primary/10 dark:to-dark-bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 dark:text-dark-text-primary">
              Software de gestión inmobiliaria para la era digital
            </h1>
            <p className="text-xl text-gray-600 mb-10 dark:text-dark-text-secondary">
              Optimiza tu agencia inmobiliaria con nuestra plataforma todo en uno.
              Gestiona propiedades, clientes y pagos con tecnología blockchain.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Empezar ahora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href='#pricing'>
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Ver planes
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* Curved divider */}
        <div className="absolute bottom-0 left-0 right-0 h-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="absolute w-full h-full"
            preserveAspectRatio="none"
          >
            <path
              fill="#151518"
              fillOpacity="1"
              d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-dark-bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 dark:text-dark-text-primary">
              Todo lo que necesitas para tu negocio inmobiliario
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-dark-text-secondary">
              Nuestra plataforma ofrece todas las herramientas necesarias para gestionar
              tu negocio inmobiliario de manera eficiente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={Home}
              title="Gestión de propiedades"
              description="Organiza y gestiona todas tus propiedades desde un único lugar, con imágenes, detalles y seguimiento completo."
              color="bg-blue-500"
            />
            <FeatureCard
              icon={BarChart3}
              title="Análisis y reportes"
              description="Obtén insights valiosos con nuestros reportes detallados sobre ventas, rendimiento y tendencias del mercado."
              color="bg-purple-500"
            />
            <FeatureCard
              icon={Users}
              title="Gestión de clientes"
              description="Administra contactos, intereses y seguimiento de clientes potenciales de manera eficiente."
              color="bg-green-500"
            />
            <FeatureCard
              icon={CreditCard}
              title="Pagos con cripto"
              description="Acepta pagos con criptomonedas, ofreciendo flexibilidad y seguridad en las transacciones."
              color="bg-amber-500"
            />
            <FeatureCard
              icon={Shield}
              title="Seguridad avanzada"
              description="Protege la información de tus clientes y propiedades con nuestra plataforma segura y cumplimiento GDPR."
              color="bg-red-500"
            />
            <FeatureCard
              icon={Smartphone}
              title="100% Responsive"
              description="Accede y gestiona tu negocio desde cualquier dispositivo, con una interfaz adaptada a móviles y tablets."
              color="bg-indigo-500"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-gray-50 dark:bg-dark-bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 dark:text-dark-text-primary">
              Planes que se adaptan a tu negocio
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto dark:text-dark-text-secondary">
              Elige el plan que mejor se adapte a las necesidades de tu agencia inmobiliaria.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans?.map((plan: any, index: number) => (
              <PlanCard key={plan.id} plan={plan} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16 dark:bg-dark-bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6 dark:text-dark-text-primary">
              Únete a las inmobiliarias líderes del futuro
            </h2>
            <p className="text-xl text-white/80 mb-10 dark:text-dark-text-secondary">
              Potencia tu negocio inmobiliario con tecnología blockchain y gestión avanzada.
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="group">
                Empieza tu prueba gratuita
                <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 dark:bg-dark-bg-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">{AppConfig.APP_TITLE}</h3>
              <p className="text-gray-400">
                Software de gestión inmobiliaria con tecnología blockchain.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Empresa</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Nosotros</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Clientes</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Recursos</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Documentación</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Guías</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Términos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacidad</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} {AppConfig.APP_TITLE}. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  color: string
}

const FeatureCard = ({ icon: Icon, title, description, color }: FeatureCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color} mb-2`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
