import GeometryExplorer3D from '../components/GeometryExplorer3D';

export default function GeometryExplorer3DView() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Explorador de Formas 3D
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Visualiza y manipula formas geométricas tridimensionales interactivamente.
            Explora cubos, esferas y cilindros con controles de rotación, escala y color.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-6">
          <GeometryExplorer3D />
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Rotación
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Usa el mouse para rotar la vista. Activa la rotación automática para ver la forma girar continuamente.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Escala
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Ajusta el tamaño de la forma usando el control deslizante. Desde 0.1x hasta 3x el tamaño original.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Formas
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Cambia entre cubo, esfera y cilindro para explorar diferentes geometrías tridimensionales.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}