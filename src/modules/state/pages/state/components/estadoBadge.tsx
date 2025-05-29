interface EstadoBadgeProps {
  estado: string;
}

export const EstadoBadge: React.FC<EstadoBadgeProps> = ({ estado }) => {
  let colorClass = '';
  switch (estado.toLowerCase()) {
    case 'disponible':
      colorClass = 'bg-white text-black border border-gray-300';
      break;
    case 'inactivo':
      colorClass = 'bg-gray-500 text-white';
      break;
    case 'reservado':
      colorClass = 'bg-red-500 text-white';
      break;
    case 'vendido':
    case 'alquilado':
    case 'anticretado':
     colorClass = 'bg-green-500 text-white';
     break;
    default:
      colorClass = 'bg-muted text-muted-foreground';
      break;
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorClass}`}>
      {estado}
    </span>
  );
};
