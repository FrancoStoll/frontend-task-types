import { Project, ProjectFormData } from "@/types/index"
import { SubmitHandler, useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import ProjectForm from "./ProjectForm"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateProject } from "@/api/ProjectAPI"
import { toast } from "react-toastify"

type EditProjectFormProps = {
  data: ProjectFormData,
  projectId: Project['_id']
}

export const EditProjectForm = ({ data, projectId }: EditProjectFormProps) => {

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateProject,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      // queryClient.invalidateQueries({ queryKey: ['projects'] })
      queryClient.invalidateQueries({ queryKey: ['editProject', projectId] })
      toast.success(data)
      navigate('/')
    }
  })


  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      projectName: data.projectName,
      clientName: data.clientName,
      description: data.description
    }
  })

  const onSubmit: SubmitHandler<ProjectFormData> = (formData) => {
    const data = {
      formData,
      projectId
    }
    mutation.mutate(data)

  }

  return (
    <>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-black">Editar proyecto</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">Llena el siguiente formulario para editar el proyecto</p>
        <nav className="my-5">
          <Link className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors" to='/'>
            Volver a proyectos
          </Link>
        </nav>
        <form noValidate className="mt-10 bg-white shadow-lg p-10 rounded-lg" onSubmit={handleSubmit(onSubmit)}>


          <ProjectForm
            register={register}
            errors={errors}

          />

          <input disabled={!isValid} type="submit" value='Editar Proyecto' className={`${!isValid ? 'bg-gray-500' : 'bg-fuchsia-600'} hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors`} />
        </form>
      </div>
    </>
  )
}