import { useRef } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UploadCloud } from "lucide-react";
import { useUploadCSVSync } from "@/sync/admin";

type FormValues = {
  file: File | null;
};

export default function CsvUploadForm() {
  const { mutate, isPending } = useUploadCSVSync();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    defaultValues: {
      file: null,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    form.setValue("file", file, { shouldValidate: true });
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      mutate(formData);
      form.reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4" autoComplete="off">
        <FormField
          control={form.control}
          name="file"
          rules={{ required: "CSV file is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
              <input
                type="file"
                accept=".csv"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <Button
                type="button"
                disabled={isPending}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud size={16} className="mr-2" />
                {field.value ? field.value.name : "Upload CSV"}
              </Button>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
