import { isAxiosError } from "axios";
import { Note, NoteFormData, Task } from "../types";
import { Project } from "../types/index";
import api from "@/lib/axios";

type noteAPIType = {
  formData: NoteFormData;
  projectId: Project["_id"];
  taskId: Task["_id"];
  noteId: Note["_id"];
};

export async function createNote({
  formData,
  projectId,
  taskId,
}: Pick<noteAPIType, "projectId" | "taskId" | "formData">) {
  try {
    const url = `/projects/${projectId}/tasks/${taskId}/notes`;

    const { data } = await api.post<string>(url, formData);

    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data.error);
    }
  }
}

export async function deleteNote({
  projectId,
  taskId,
  noteId,
}: Pick<noteAPIType, "projectId" | "taskId" | "noteId">) {
  try {
    const url = `/projects/${projectId}/tasks/${taskId}/notes/${noteId}`;
    const { data } = await api.delete(url);
    return data
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data.error);
    }
  }
}
