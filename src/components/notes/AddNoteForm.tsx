import { NoteFormData } from "@/types/index";
import { SubmitHandler, useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/api/NoteApi";
import { toast } from "react-toastify";
import { useLocation, useParams } from "react-router-dom";

const AddNoteForm = () => {
  const initialValues: NoteFormData = {
    content: "",
  };
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: initialValues,
  });
  const params = useParams();
  const location = useLocation();
  const paramsUrl = new URLSearchParams(location.search);
  const taskId = paramsUrl.get("viewTask")!;
  const mutation = useMutation({
    mutationFn: createNote,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      reset();
    },
  });

  const onSubmit: SubmitHandler<NoteFormData> = (data) => {
    mutation.mutate({
      formData: data,
      projectId: params.projectId!,
      taskId: taskId,
    });
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="flex flex-col gap-2">
        <label className="font-bold" htmlFor="content">
          Crear Nota
        </label>
        <input
          type="text"
          id="content"
          placeholder="Contenido de la nota"
          className="w-full p-3 border border-gray-300"
          {...register("content", {
            required: "El contenido de la nota es obligatorio",
          })}
        />
        {errors.content && (
          <ErrorMessage>{errors.content.message}</ErrorMessage>
        )}
      </div>

      <input
        type="submit"
        value="Crear Nota"
        className="bg-fuchsia-600 hover:bg-fuchsia-900 w-full p-2 font-black cursor-pointer text-white"
      />
    </form>
  );
};
export default AddNoteForm;
