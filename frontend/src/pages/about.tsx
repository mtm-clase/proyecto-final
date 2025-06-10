import { Server, Cloud, Shield, Globe, Clock, Users } from "lucide-react"

export default function AboutUs() {
  return (
    <div className="bg-[#030712] min-h-screen text-gray-200">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-900 to-[#0f172a] py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Sobre NubeServ</h1>
            <p className="text-xl md:text-2xl text-gray-300">
              Potenciando el futuro digital con soluciones de infraestructura confiables y escalables
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">Nuestra Empresa</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-gray-300 mb-6">
                  Fundada en 2015, NubeServ se ha convertido en un líder en el mercado de infraestructura en la nube,
                  ofreciendo servicios de VPS, hosting dedicado y soluciones de almacenamiento para empresas de todos
                  los tamaños.
                </p>
                <p className="text-lg text-gray-300">
                  Nuestra misión es simple: proporcionar infraestructura de clase mundial con un soporte técnico
                  excepcional, permitiendo a nuestros clientes enfocarse en hacer crecer sus negocios sin preocuparse
                  por la tecnología que los sustenta.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg text-center">
                  <Server className="h-12 w-12 mx-auto mb-4 text-cyan-500" />
                  <h3 className="font-medium text-lg text-white">Servidores VPS</h3>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg text-center">
                  <Cloud className="h-12 w-12 mx-auto mb-4 text-purple-500" />
                  <h3 className="font-medium text-lg text-white">Cloud Hosting</h3>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg text-center">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-emerald-500" />
                  <h3 className="font-medium text-lg text-white">Seguridad</h3>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg text-center">
                  <Globe className="h-12 w-12 mx-auto mb-4 text-sky-500" />
                  <h3 className="font-medium text-lg text-white">CDN Global</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-4xl font-bold text-cyan-500">99.9%</p>
                <p className="text-gray-300 mt-2">Uptime Garantizado</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-cyan-500">15,000+</p>
                <p className="text-gray-300 mt-2">Clientes Activos</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-cyan-500">8</p>
                <p className="text-gray-300 mt-2">Centros de Datos</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-cyan-500">24/7</p>
                <p className="text-gray-300 mt-2">Soporte Técnico</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">Nuestros Valores</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Shield className="h-8 w-8 text-cyan-500" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-3 text-white">Confiabilidad</h3>
                <p className="text-gray-300 text-center">
                  Nos comprometemos a ofrecer servicios estables y seguros en los que nuestros clientes pueden confiar.
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Clock className="h-8 w-8 text-purple-500" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-3 text-white">Innovación</h3>
                <p className="text-gray-300 text-center">
                  Constantemente buscamos nuevas tecnologías y soluciones para mejorar nuestros servicios.
                </p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Users className="h-8 w-8 text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-3 text-white">Servicio al Cliente</h3>
                <p className="text-gray-300 text-center">
                  Nuestro equipo de soporte está disponible 24/7 para ayudar a resolver cualquier problema.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">Nuestro Equipo</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md">
                <img src="/placeholder.svg?height=300&width=400" alt="CEO" className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1 text-white">John Doe</h3>
                  <p className="text-cyan-500 mb-4">CEO & Fundador</p>
                  <p className="text-gray-300">
                    Con más de 15 años de experiencia en el sector tecnológico, John fundó NubeServ con la visión de
                    democratizar el acceso a infraestructura de calidad.
                  </p>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md">
                <img src="/placeholder.svg?height=300&width=400" alt="CTO" className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1 text-white">Alice Rodríguez</h3>
                  <p className="text-cyan-500 mb-4">CTO</p>
                  <p className="text-gray-300">
                    Alice lidera nuestro equipo de ingeniería, asegurando que nuestra infraestructura esté siempre a la
                    vanguardia tecnológica.
                  </p>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md">
                <img src="/placeholder.svg?height=300&width=400" alt="COO" className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1 text-white">Bob Sánchez</h3>
                  <p className="text-cyan-500 mb-4">COO</p>
                  <p className="text-gray-300">
                    Bob supervisa las operaciones diarias, asegurando que nuestros clientes reciban un servicio
                    excepcional.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">Nuestra Historia</h2>
            <div className="relative border-l-2 border-cyan-500 ml-6 md:ml-0 md:mx-auto md:max-w-3xl pl-8 md:pl-0">
              <div className="mb-12 md:grid md:grid-cols-2 md:gap-8 md:items-center">
                <div className="md:text-right md:pr-8 md:order-1">
                  <h3 className="text-xl font-semibold text-cyan-500">2015</h3>
                  <p className="mt-2 text-gray-300">Fundación de NubeServ con un pequeño equipo de 5 personas.</p>
                </div>
                <div className="absolute left-0 md:left-1/2 -translate-x-1/2 mt-1.5 w-4 h-4 rounded-full bg-cyan-500"></div>
              </div>
              <div className="mb-12 md:grid md:grid-cols-2 md:gap-8 md:items-center">
                <div className="md:pl-8 md:order-2">
                  <h3 className="text-xl font-semibold text-cyan-500">2017</h3>
                  <p className="mt-2 text-gray-300">Expansión a 3 centros de datos en América Latina.</p>
                </div>
                <div className="absolute left-0 md:left-1/2 -translate-x-1/2 mt-1.5 w-4 h-4 rounded-full bg-cyan-500"></div>
              </div>
              <div className="mb-12 md:grid md:grid-cols-2 md:gap-8 md:items-center">
                <div className="md:text-right md:pr-8 md:order-1">
                  <h3 className="text-xl font-semibold text-cyan-500">2019</h3>
                  <p className="mt-2 text-gray-300">Lanzamiento de nuestra plataforma de cloud computing.</p>
                </div>
                <div className="absolute left-0 md:left-1/2 -translate-x-1/2 mt-1.5 w-4 h-4 rounded-full bg-cyan-500"></div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8 md:items-center">
                <div className="md:pl-8 md:order-2">
                  <h3 className="text-xl font-semibold text-cyan-500">2023</h3>
                  <p className="mt-2 text-gray-300">
                    Alcanzamos 15,000 clientes y expandimos a 8 centros de datos globales.
                  </p>
                </div>
                <div className="absolute left-0 md:left-1/2 -translate-x-1/2 mt-1.5 w-4 h-4 rounded-full bg-cyan-500"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-gradient-to-r from-gray-900 to-[#0f172a] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">¿Listo para empezar?</h2>
            <p className="text-xl mb-8 text-gray-300">
              Únete a miles de empresas que confían en NubeServ para su infraestructura digital.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-lg font-medium text-lg transition-colors">
                Contactar Ventas
              </button>
              <button className="bg-transparent border-2 border-gray-300 hover:bg-gray-800 px-8 py-3 rounded-lg font-medium text-lg transition-colors">
                Ver Planes
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#030712] text-white py-12 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-6">NubeServ</h2>
              <p className="mb-8 text-gray-400">
                Av. Tecnológica 123, Ciudad Digital
                <br />
                contacto@nubeserv.com | +1 (555) 123-4567
              </p>
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} NubeServ. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

