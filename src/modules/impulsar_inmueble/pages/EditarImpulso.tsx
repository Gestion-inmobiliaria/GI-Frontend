import { PrivateRoutes } from "@/models";
import ImpulsoForm, { FormValues } from "./impulso/components/impulso-form";
import Loading from "@/components/shared/loading";
import { useNavigate, useParams } from "react-router-dom";
import { useGetAllState } from "@/modules/state/hooks/useState";
import { useGetImpulso, useUpdateImpulso } from "../hooks/useImpulsar_State";
import { useGetAllUser } from "@/modules/users/hooks/useUser";

const EditarImpulsoPage = () => {
  const { id } = useParams();
  const { impulso, isLoading } = useGetImpulso(id);
  const { updateImpulso, isMutating } = useUpdateImpulso();
  const { allStates } = useGetAllState();
  const { allUsers } = useGetAllUser();
  const navigate = useNavigate();

  const formatDateTimeLocal = (dateString: string | undefined) => {
    if (!dateString) return '';

    // 🛡️ Evita doble parseo si ya está en formato correcto
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateString)) {
      return dateString;
    }

    const date = new Date(dateString);
    const pad = (n: number) => String(n).padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  if (isLoading || !impulso) return <Loading />;

  const defaultValues: FormValues = {
    startDate: formatDateTimeLocal(impulso.startDate),
    endDate: formatDateTimeLocal(impulso.endDate),
    razonAImpulsar: impulso.razonAImpulsar,
    state: impulso.state.id,
    user: impulso.user.id,
  };

  const onSubmit = async (data: FormValues) => {
    const now = new Date();
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    if (end <= now) {
      alert("La fecha de fin no puede ser menor o igual a la fecha y hora actual.");
      return;
    }

    if (end <= start) {
      alert("La fecha de fin no puede ser menor o igual a la fecha de inicio.");
      return;
    }

    const formattedData = {
      ...data,
      id: id!,
      property: data.state, // Backend espera 'property'
    };

    await updateImpulso(formattedData);
    navigate(PrivateRoutes.IMPULSO);
  };

  return (
    <ImpulsoForm
      defaultValues={defaultValues}
      onSubmit={onSubmit}
      allStates={allStates}
      allUsers={allUsers}
      isEdit={true}
      isMutating={isMutating}
    />
  );
};

export default EditarImpulsoPage;
