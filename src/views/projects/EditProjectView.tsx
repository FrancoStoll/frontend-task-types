import { getProjectById } from "@/api/ProjectAPI";
import { EditProjectForm } from "@/components/projects/EditProjectForm";
import { useQuery } from "@tanstack/react-query";
import { Navigate, useParams } from "react-router-dom"








export const EditProjectView = () => {

  const { projectId } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['editProject', projectId],
    queryFn: () => getProjectById(projectId!),
    retry: 2
  })


  if (isLoading) return 'Loading...'
  if (isError) return <Navigate to="/404" />


  if (data) return (
    <EditProjectForm data={data} projectId={projectId!}/>
  )
}
