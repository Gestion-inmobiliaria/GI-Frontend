import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { State } from "@/modules/state/models/state.model";
import { useGetAllUser } from "@/modules/users/hooks/useUser";
import { User } from "@/modules/users/models/user.model";

export interface FormValues {
  startDate: string;
  endDate: string;
  razonAImpulsar: string;
  state: string;
  user: string;
}

interface ImpulsoFormProps {
  defaultValues?: Partial<FormValues>;
  onSubmit: (data: FormValues) => void | Promise<void>;
  isEdit?: boolean;
  allStates: State[];
  allUsers: User[];
  isMutating?: boolean;
}

const ImpulsoForm: React.FC<ImpulsoFormProps> = ({
  defaultValues,
  onSubmit,
  isEdit = false,
  allStates,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues,
  });
  const navigate = useNavigate();
  const { allUsers } = useGetAllUser();

  // Watch dates to validate
  const start = watch("startDate");
  const end = watch("endDate");

  const validateDates = (): boolean => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (!start || !end) return true;

    if (endDate <= now) {
      setError("endDate", { type: "manual", message: "La fecha de fin no puede ser hoy o anterior" });
      return false;
    }
    if (endDate <= startDate) {
      setError("endDate", { type: "manual", message: "La fecha de fin debe ser mayor a la de inicio" });
      return false;
    }
    return true;
  };

  const onFormSubmit = async (data: FormValues) => {
    if (!validateDates()) return;
    await onSubmit(data);
  };

  return (
    <Card className="max-w-2xl mx-auto p-4">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{isEdit ? "Editar impulso" : "Nuevo impulso"}</CardTitle>
        <CardDescription>Completa los siguientes campos</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
          {/* Fecha de inicio */}
          <div>
            <Label>Fecha de inicio</Label>
            <Input
              type="datetime-local"
              {...register("startDate", { required: "La fecha de inicio es obligatoria" })}
            />
            {errors.startDate && (
              <span className="text-sm text-red-500">{errors.startDate.message}</span>
            )}
          </div>

          {/* Fecha de fin */}
          <div>
            <Label>Fecha de fin</Label>
            <Input
              type="datetime-local"
              {...register("endDate", { required: "La fecha de fin es obligatoria" })}
            />
            {errors.endDate && (
              <span className="text-sm text-red-500">{errors.endDate.message}</span>
            )}
          </div>

          {/* Razón */}
          <div>
            <Label>Razón de impulso</Label>
            <Textarea
              {...register("razonAImpulsar", { required: "La razón es obligatoria" })}
              className="resize-none"
            />
            {errors.razonAImpulsar && (
              <span className="text-sm text-red-500">{errors.razonAImpulsar.message}</span>
            )}
          </div>

          {/* Inmueble */}
          <div>
            <Label>Inmueble</Label>
            <select
              {...register("state", { required: "Debes seleccionar un inmueble" })}
              defaultValue={defaultValues?.state || ""}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none"
            >
              <option value="">Selecciona un inmueble</option>
              {allStates.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.descripcion}
                </option>
              ))}
            </select>
            {errors.state && (
              <span className="text-sm text-red-500">{errors.state.message}</span>
            )}
          </div>

          {/* Usuario */}
          <div>
            <Label>Agente (Usuario)</Label>
            <select
              {...register("user", { required: "Debes seleccionar un usuario" })}
              defaultValue={defaultValues?.user || ""}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none"
            >
              <option value="">Selecciona un usuario</option>
              {allUsers.map((u: User) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
            {errors.user && (
              <span className="text-sm text-red-500">{errors.user.message}</span>
            )}
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-2">
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting
              ? isEdit
                ? "Actualizando..."
                : "Creando..."
              : isEdit
              ? "Actualizar impulso"
              : "Registrar impulso"}
          </Button>
          </div>
        </form>
         {/* Botón Volver (separado abajo del formulario) */}
        <div className="mt-4">
         <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
          className="w-full"
         >
          Volver
        </Button>
       </div>
      </CardContent>
    </Card>
  );
};
export default ImpulsoForm;