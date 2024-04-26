import { deleteNote } from "@/api/NoteApi";
import { useAuth } from "@/hooks/useAuth";
import { Note } from "@/types/index";
import { formatDate } from "@/utils/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

type Props = {
  note: Note;
};

export const NoteDetails = ({ note }: Props) => {
  const { data, isLoading } = useAuth();

  const canDelete = useMemo(() => data?._id === note.createdBy._id, [data]);
  const params = useParams();
  const projectId = params.projectId!;
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteNote,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["task", note.task] });
    },
  });

  if (isLoading) return "Loading....";

  return (
    <div className="p-3 flex justify-between items-center">
      <div>
        <p>
          {note.content} por{" "}
          <span className="font-bold">{note.createdBy.name}</span>
        </p>
        <p className="text-xs text-slate-400">{formatDate(note.createdAt)}</p>
      </div>

      {canDelete && (
        <button
          onClick={() =>
            mutation.mutate({
              noteId: note._id,
              projectId: projectId,
              taskId: note.task,
            })
          }
          type="button"
          className="bg-red-500 rounded hover:bg-red-600 p-2 text-xs text-white font-bold cursor-pointer transition-colors"
        >
          Eliminar
        </button>
      )}
    </div>
  );
};
