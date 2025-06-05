import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const TeamMembers = () => {
  return (
    <section>
      <h2 className="text-lg font-medium mb-3">Team Members</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {/* Replace this with real member data */}
        {["Alice", "Bob", "Charlie", "You"].map((name, index) => (
          <div
            key={index}
            className="p-3 border rounded-md text-center text-sm"
          >
            <Avatar className="mx-auto mb-2 h-10 w-10">
              <AvatarFallback>{name[0]}</AvatarFallback>
            </Avatar>
            <p>{name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
