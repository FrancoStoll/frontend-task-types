import { addUserToProject } from "@/api/TeamAPi"
import { TeamMember } from "@/types/index"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"

type Props = {
  user: TeamMember,
  resetData: () => void
}

export const SearchResult = ({ user, resetData }: Props) => {

  const params = useParams();
  const projectId = params.projectId!
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addUserToProject,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      toast.success(data)
      resetData()
      queryClient.invalidateQueries({
        queryKey: ['projectTeam', projectId]
      })
    }
  })

  return (
    <>
      <p className="mt-10 text-center font-bold">Resultado:</p>
      <div className="flex justify-between items-center">
        <p>{user.name}</p>
        <button className="text-purple-600 hover:bg-purple-100 px-10 py-3 font-bold cursor-pointer"
          onClick={() => mutation.mutate({ projectId, id: user._id })}
        >
          Agregar al proyecto
        </button>
      </div>
    </>
  )
}