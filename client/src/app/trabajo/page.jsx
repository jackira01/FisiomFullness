import TrabajaConNosotrosClient from './client.jsx';

export const metadata = {
  title: 'Trabaja con nosotros',
  description: 'Formulario de petición de colaboracion/empleo',
};

const TrabajaConNosotros = () => {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-secondary-500 text-white py-14 px-auto">
        <div className="max-w-8xl mx-auto">
          <p className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-2">
            Únete al equipo
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Trabajá con{' '}
            <span className="text-primary-400">nosotros</span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-xl leading-relaxed">
            Sumate al equipo de{' '}
            <a
              href="/about"
              target="_blank"
              className="text-primary-400 underline underline-offset-2 hover:text-primary-300 transition-colors"
            >
              FisiomFullness
            </a>{' '}
            y ayudanos a transformar la salud de las personas. Enviá tu
            solicitud y nos pondremos en contacto.
          </p>
        </div>
      </section>

      {/* Form section */}
      <section className="py-12 px-auto">
        <div className="max-w-8xl mx-auto">
          <TrabajaConNosotrosClient />
        </div>
      </section>
    </main>
  );
};

export default TrabajaConNosotros;
