import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTaskById, updateStatus } from "@/api/TaskAPI";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/utils";
import { statusTranslate } from "@/locales/es";
import { TaskStatus } from "@/types/index";



export default function TaskModalDetails() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get('viewTask')!

  const { data, isError, error } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTaskById({
      taskId: taskId,
      projectId: location.pathname.split('/')[2]
    }),
    enabled: !!taskId,
    retry: false
  })


  const mutation = useMutation({
    mutationFn: updateStatus,
    onError: (err) => {
      toast.error(err.message)
    },
    onSuccess: (data) => {
      toast.success(data)
      queryClient.invalidateQueries({ queryKey: ['project', location.pathname.split('/')[2]] })
      queryClient.invalidateQueries({ queryKey: ['task', taskId] })
      navigate(location.pathname, { replace: true })
    }
  })
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {

    mutation.mutate({
      projectId: location.pathname.split('/')[2],
      taskId: taskId,
      status: e.target.value as TaskStatus
    })


  }



  if (isError) {
    toast.error(error.message, { toastId: 'error' })
    return <Navigate to={`/projects/${location.pathname.split('/')[2]}`} />
  }


  if (data) return (
    <>
      <Transition appear show={!!taskId} as={Fragment}>
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
                  <p className='text-sm text-slate-400'>Agregada el: {formatDate(data.createdAt)}</p>
                  <p className='text-sm text-slate-400'>Última actualización: {formatDate(data.updatedAt)}</p>
                  <Dialog.Title
                    as="h3"
                    className="font-black text-4xl text-slate-600 my-5"
                  >
                    {data.name}
                  </Dialog.Title>
                  <p className='text-lg text-slate-500 mb-2'>Descripción: <br /> {data.description}</p>
                  <div className='my-5 space-y-3'>
                    <label className='font-bold'>Estado Actual: {data.status}</label>
                    <select
                      defaultValue={data.status}
                      className="w-full p-3 bg-white border border-gray-300"
                      onChange={handleChange}
                    >
                      {
                        Object.entries(statusTranslate).map(([key, value]) => (
                          <option key={key} value={key}>{value}</option>
                        ))
                      }
                    </select>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}