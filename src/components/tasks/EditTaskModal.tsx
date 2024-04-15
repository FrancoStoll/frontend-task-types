import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useLocation, useNavigate } from "react-router-dom";
import { Task, TaskFormData } from "@/types/index";
import { SubmitHandler, useForm } from "react-hook-form";
import TaskForm from "./TaskForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateTask } from "@/api/TaskAPI";



interface Props {
  data: Task
}

export default function EditTaskModal({ data }: Props) {
  const navigate = useNavigate();
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  const editTask = queryParams.get('editTask')!

  const queryClient = useQueryClient();
  const initialValues = {
    name: data.name,
    description: data.description
  }
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TaskFormData>({
    defaultValues: {
      ...initialValues
    }
  })


  const mutation = useMutation({
    mutationFn: updateTask,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['project', location.pathname.split('/')[2]]
      })
      toast.success(data)
      reset()
      navigate(location.pathname, { replace: true })

    }
  })

  const onSubmit: SubmitHandler<TaskFormData> = (formData) => {
    mutation.mutate({
      projectId: location.pathname.split('/')[2],
      taskId: editTask,
      formData: formData,
    })
  }


  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => navigate(location.pathname, { replace: true })}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                <Dialog.Title
                  as="h3"
                  className="font-black text-4xl  my-5"
                >
                  Editar Tarea
                </Dialog.Title>

                <p className="text-xl font-bold">Realiza cambios a una tarea en {''}
                  <span className="text-fuchsia-600">este formulario</span>
                </p>

                <form
                  className="mt-10 space-y-3"
                  noValidate
                  onSubmit={handleSubmit(onSubmit)}
                >

                  <TaskForm errors={errors} register={register} />

                  <input
                    type="submit"
                    className=" bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
                    value='Guardar Tarea'
                  />
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}