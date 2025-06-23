import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useCancelarImpulso, useGetImpulso } from "../hooks/useImpulsar_State";
import Loading from "@/components/shared/loading";
import { EstadoBadgeImpulso } from "./impulso/components/estadoBadgeImpulso";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface CancelarFormValues {
  razonACancelar: string;
}

const CancelarImpulsoForm: React.FC = () => {
  const { id: impulsoId } = useParams(); // <-- obtenemos el ID desde la URL
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CancelarFormValues>();

  const { cancelarImpulso, isMutating } = useCancelarImpulso();
  const { impulso, isLoading } = useGetImpulso(impulsoId ?? "");

  const onSubmit = async (data: CancelarFormValues) => {
    try {
      await toast.promise(
        cancelarImpulso({ id: impulsoId!, razonACancelar: data.razonACancelar }),
        {
          loading: "Cancelando impulso...",
          success: "Impulso cancelado con éxito.",
          error: "Error al cancelar impulso.",
        }
      );
      navigate(-1); // volver a la página anterior tras éxito
    } catch (error) {
      // manejar error si es necesario
    }
  };

  if (!impulsoId) return <p className="text-red-500 text-center">ID no válido</p>;
  if (isLoading || !impulso) return <Loading />;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resumen del impulso</CardTitle>
          <CardDescription>Verifica la información antes de cancelar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-white-700">
          <p><strong>Inmueble:</strong> {impulso.state?.descripcion || "N/D"}</p>
          <p><strong>Responsable:</strong> {impulso.user?.name || "N/D"}</p>
          <p><strong>Inicio:</strong> {new Date(impulso.startDate).toLocaleString("es-BO")}</p>
          <p><strong>Fin:</strong> {new Date(impulso.endDate).toLocaleString("es-BO")}</p>
          <p className="flex items-center gap-2">
            <strong>Estado:</strong>
            {impulso.status ? <EstadoBadgeImpulso estado={impulso.status} /> : "N/D"}
          </p>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
        <div>
          <Label htmlFor="razonACancelar" className="text-base font-medium">
            ¿Por qué deseas cancelar este impulso?
          </Label>
          <Textarea
            id="razonACancelar"
            {...register("razonACancelar", {
              required: "La razón es obligatoria",
            })}
            placeholder="Ejemplo: Error en la promoción, cliente se retractó, etc."
            rows={5}
            className="w-full resize-none mt-2"
          />
          {errors.razonACancelar && (
            <p className="text-sm text-red-500 mt-1">
              {errors.razonACancelar.message}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-between">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => navigate(-1)}
          >
            Volver
          </Button>
          <Button
            type="submit"
            variant="destructive"
            disabled={isMutating}
            className="w-full sm:w-auto"
          >
            {isMutating ? "Cancelando..." : "Cancelar impulso"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CancelarImpulsoForm;
