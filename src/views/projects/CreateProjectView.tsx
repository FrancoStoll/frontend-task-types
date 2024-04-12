import { Link, useNavigate } from "react-router-dom"
import { SubmitHandler, useForm } from 'react-hook-form'
import ProjectForm from "@/components/projects/ProjectForm"
import { useMutation } from '@tanstack/react-query'
import { createProject } from "@/api/ProjectAPI"
import { ProjectFormData } from "@/types/index"
import { toast } from "react-toastify"

export const CreateProjectView = () => {

  const navigate = useNavigate()

  const initialValues: ProjectFormData = {
    projectName: '',
    clientName: '',
    description: ''
  }

  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      ...initialValues
    }
  })
  const mutation = useMutation({
    mutationFn: createProject,
    onError: (err) => {
      toast.error(err.message)
    },
    onSuccess: (res) => {
      toast.success(res)
      navigate('/')
    }
  })
  const onSubmit: SubmitHandler<ProjectFormData> = (data) => {
    mutation.mutate(data)
  }


    


  return (
    <>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-black">Crear proyecto</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">Llena el siguiente formulario para crear un proyecto</p>
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

          <input disabled={!isValid} type="submit" value='Crear Proyecto' className={`${!isValid ? 'bg-gray-500' : 'bg-fuchsia-600'} hover:bg-fuchsia-700 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors`} />
        </form>
      </div>
    </>
  )
}

