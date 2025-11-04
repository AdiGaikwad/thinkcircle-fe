// src/lib/uploadAttachment.ts
import axios from "axios"
import domains from "@/app/data/domains"

/**
 * Upload a chat attachment for a specific group
 *
 * @param file - The file to upload
 * @param token - JWT auth token
 * @param groupId - Group ID to associate the file with
 * @param onProgress - Optional upload progress callback (0–100)
 * @returns Uploaded file metadata array from backend
 */
export async function uploadAttachment(
    file: File,
    token: string,
    groupId: string,
    profileId: string,
    onProgress?: (percent: number) => void
) {
    if (!groupId) throw new Error("Missing group ID")

    if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size exceeds 5MB limit.")
    }
    console.log(token)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("profileId", profileId)
    formData.append("imageTypes", JSON.stringify(["CHAT"])) // backend expects this array

    const response = await axios.post(`${domains.AUTH_HOST}/api/v1/group/attachments/${groupId}`, formData, {
        headers: {
            Authorization: `${token}`,
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
            const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 1))
            onProgress?.(percent)
        },
    })

    if (response.data?.success) {
        return response.data.files // array of uploaded file URLs or metadata
    } else {
        throw new Error(response.data?.message || "Upload failed")
    }
}
