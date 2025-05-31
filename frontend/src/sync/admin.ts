import { UPLOAD_CSV } from "@/api/mutation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUploadCSVSync = () => {
  return useMutation({
    mutationFn: UPLOAD_CSV,
    onSuccess: () => {
      toast.success("CSV uploaded successfully");
    },
    onError: () => {
      toast.error("Failed to upload CSV");
    },
  });
};
