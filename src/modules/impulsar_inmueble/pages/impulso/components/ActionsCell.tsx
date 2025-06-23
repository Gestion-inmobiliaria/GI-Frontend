import React from 'react';
import { Row } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Pencil, Trash, XCircle, Eye } from 'lucide-react'; // 👈 añadimos Eye

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

import { ImpulsarState } from '@/modules/impulsar_inmueble/models/impulso_state.model';
import { ImpulsoStatus } from '@/modules/impulsar_inmueble/models/estadoImpulso.model';
import { useDeleteImpulso } from '@modules/impulsar_inmueble/hooks/useImpulsar_State';
import { PrivateRoutes } from '@/models/routes.model';

interface ActionsCellProps {
  row: Row<ImpulsarState>;
  onRefresh: () => void;
}

export const ActionsCell: React.FC<ActionsCellProps> = ({ row, onRefresh }) => {
  const navigate = useNavigate();
  const { deleteImpulso } = useDeleteImpulso();

  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const impulso = row.original;

  const handleDelete = async () => {
    try {
      await toast.promise(deleteImpulso(impulso.id), {
        loading: 'Eliminando impulso...',
        success: 'Impulso eliminado',
        error: (err) => err.errorMessages?.[0] ?? 'No se pudo eliminar el impulso',
      });
      setIsDialogOpen(false);
      onRefresh();
    } catch {
      toast.error('Error al eliminar impulso');
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Acciones</DropdownMenuLabel>

          {/* NUEVO: Ver detalle */}
          <DropdownMenuItem onClick={() => navigate(PrivateRoutes.IMPULSO_DETAIL.replace(':id', impulso.id))}>
            <Eye className="mr-2 h-4 w-4" /> Ver detalle
          </DropdownMenuItem>

          {impulso.status === ImpulsoStatus.ACTIVO && (
            <>
              <DropdownMenuItem onClick={() => navigate(PrivateRoutes.IMPULSO_EDIT.replace(':id', impulso.id))}>
                <Pencil className="mr-2 h-4 w-4" /> Editar
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => navigate(PrivateRoutes.IMPULSO_CANCELAR.replace(':id', impulso.id))}>
                <XCircle className="mr-2 h-4 w-4" /> Cancelar
              </DropdownMenuItem>

              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmación solo para eliminar */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro de eliminar este impulso?</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="text-sm text-muted-foreground">
            Esta acción no se puede deshacer.
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};