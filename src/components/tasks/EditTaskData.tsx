import { getTaskById } from "@/api/TaskAPI";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useLocation } from "react-router-dom"
import EditTaskModal from "./EditTaskModal";


export const EditTaskData = () => {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search)
  const taskId = queryParams.get('editTask')!

  console.log()

  const { data, isError } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTaskById({
      projectId: location.pathname.split('/')[2],
      taskId: taskId,
    }),
    enabled: !!taskId,
    retry: 1
  })



  if (isError) return <Navigate to={'/404'} />
  if (data) return (
    <EditTaskModal data={data} />
  )
}