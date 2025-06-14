import { useEffect, useRef } from "react";
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
import { Spinner } from "../spinner";

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

  const file = form.watch("file");

  const onSubmit = (data: FormValues) => {
    if (!data.file) return;

    const formData = new FormData();
    formData.append("file", data.file);

    mutate(formData);
    form.reset();
  };

  useEffect(() => {
    if (file) {
      form.handleSubmit(onSubmit)();
    }
  }, [file, form]);

  if (isPending) return <Spinner />;

  return (
    <Form {...form}>
      <form className="space-y-4">
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
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  field.onChange(file);
                }}
              />
              <Button
                type="button"
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
