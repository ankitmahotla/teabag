import useSpaceStore from "@/store/space";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTeamSync } from "@/sync/teams";
import { useRouter } from "next/navigation";
import { Rocket } from "lucide-react";
import { useSessionStore } from "@/store/session";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().optional(),
});

export const CreateTeam = () => {
  const { user } = useSessionStore();
  const { spaceId } = useSpaceStore();
  const { mutate } = useCreateTeamSync(spaceId!, user?.id);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (spaceId) {
      mutate(
        {
          cohortId: spaceId,
          name: values.name,
          description: values.description,
        },
        {
          onSuccess: () => {
            form.reset();
            router.push("/");
          },
        },
      );
    }
  }

  return (
    <div className="min-h-[90vh] grid grid-cols-1 md:grid-cols-2 gap-x-8 max-w-6xl mx-auto">
      <div className="hidden md:flex items-center justify-end px-4">
        <div className="max-w-md text-center space-y-4">
          <Rocket className="w-12 h-12 mx-auto text-primary" />
          <h2 className="text-2xl font-semibold">Build your dream team</h2>
          <p className="text-muted-foreground">
            Create a team to collaborate on projects, share ideas, and work
            together efficiently.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-start p-6">
        <div className="w-full max-w-xl bg-background p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-2">Create a New Team</h1>
          <p className="text-muted-foreground mb-6">
            Enter the details below to start your team and collaborate with
            peers.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Query Handlers" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your team's goals..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Create Team
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};
