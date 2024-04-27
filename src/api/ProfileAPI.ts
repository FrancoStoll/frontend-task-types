import { isAxiosError } from "axios";
import { UpdateCurrentUserPassowrd, UserProfileForm } from "../types";
import api from "@/lib/axios";





export async function updateProfile(formData: UserProfileForm) {
    try {
        const { data } = await api.put<string>('/auth/profile', formData)
        return data
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.error);
        }
    }
}

export async function changePassword(formData: UpdateCurrentUserPassowrd) {
    try {
        const { data } = await api.put<string>('/auth/update-password', formData)
        return data
    } catch (error) {
        if (isAxiosError(error)) {
            throw new Error(error.response?.data.error);
        }
    }
}
