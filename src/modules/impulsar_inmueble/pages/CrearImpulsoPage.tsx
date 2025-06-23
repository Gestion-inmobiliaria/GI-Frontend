import { PrivateRoutes } from "@/models";
import ImpulsoForm, { FormValues } from "./impulso/components/impulso-form";
import { useGetAllState } from "@/modules/state/hooks/useState";
import { useCreateImpulso } from "../hooks/useImpulsar_State";
import { useNavigate } from "react-router-dom";
import { useGetAllUser } from "@/modules/users/hooks/useUser";

const CrearImpulsoPage = () => {
  const { allStates } = useGetAllState();
  const { allUsers } = useGetAllUser();
  const { createImpulso, isMutating } = useCreateImpulso();
  const navigate = useNavigate();

  const onSubmit = async (data: FormValues) => {
    const formattedData = {
      ...data,
      property: data.state,
      user: data.user,
    };
    await createImpulso(formattedData);
    navigate(PrivateRoutes.IMPULSO);
  };

  return (
    <ImpulsoForm
      onSubmit={onSubmit}
      allStates={allStates}
      allUsers={allUsers} // Agrega esta nueva prop al componente
      isEdit={false}
      isMutating={isMutating}
    />
  );
};

export default CrearImpulsoPage;