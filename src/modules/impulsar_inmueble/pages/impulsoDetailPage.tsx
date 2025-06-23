import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetImpulso } from "../hooks/useImpulsar_State";
import Loading from "@/components/shared/loading";
import { EstadoBadgeImpulso } from "./impulso/components/estadoBadgeImpulso";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImpulsoStatus } from "../models/estadoImpulso.model";

// Íconos
import {
  Home,
  User,
  CalendarDays,
  AlarmClock,
  FileText,
  Ban,
} from "lucide-react";

const ImpulsoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { impulso, isLoading } = useGetImpulso(id ?? "");

  if (isLoading || !impulso) return <Loading />;

  const fecha = (value: string) =>
    new Date(value).toLocaleString("es-BO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Detalle del impulso</CardTitle>
          <CardDescription>Información completa del impulso</CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-white-700">
          <p className="flex items-center gap-2">
            <Home className="w-4 h-4 text-muted-foreground" />
            <strong>Inmueble:</strong> {impulso.state?.descripcion || "N/D"}
          </p>

          <p className="flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <strong>Responsable:</strong> {impulso.user?.name || "N/D"}
          </p>

          <p className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <strong>Inicio:</strong> {fecha(impulso.startDate)}
          </p>

          <p className="flex items-center gap-2">
            <AlarmClock className="w-4 h-4 text-muted-foreground" />
            <strong>Fin:</strong> {fecha(impulso.endDate)}
          </p>

          <p className="flex items-center gap-2">
            <strong>Estado:</strong> <EstadoBadgeImpulso estado={impulso.status} />
          </p>

          <p className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <strong>Razón del impulso:</strong> {impulso.razonAImpulsar || "N/D"}
          </p>

          {impulso.status === ImpulsoStatus.CANCELADO && (
            <p className="flex items-center gap-2 text-red-600">
              <Ban className="w-4 h-4" />
              <strong>Razón de cancelación:</strong>{" "}
              {impulso.razonACancelar || "Sin especificar"}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Volver
        </Button>
      </div>
    </div>
  );
};

export default ImpulsoDetailPage;
