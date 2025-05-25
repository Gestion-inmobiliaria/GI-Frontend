interface EstadoBadgeProps {
  estado: string;
}

export const EstadoBadge: React.FC<EstadoBadgeProps> = ({ estado }) => {
  const estadoColors: Record<string, string> = {
    disponible: 'bg-green-100 text-green-800 border border-green-300',
    inactivo: 'bg-gray-500 text-white',
    reservado: 'bg-red-500 text-white',
    vendido: 'bg-green-500 text-white',
    alquilado: 'bg-green-500 text-white',
    anticretado: 'bg-green-500 text-white',
  };

  const colorClass = estadoColors[estado.toLowerCase()] ?? 'bg-muted text-muted-foreground';

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${colorClass}`}>
      {estado}
    </span>
  );
};
