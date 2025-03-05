import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/Components/ui/sheet";
import { DialogProps } from "@radix-ui/react-dialog";
import { useForm } from "@inertiajs/react";
import FormError from "./form-error";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { FormEvent } from "react";
import toast from "react-hot-toast";
import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getAvatar } from "@/lib/utils";
type FormType = {
  name: string;
  email: string;
  image: File | undefined;
};

type Props = DialogProps & {
  selected: User;
};

const EditUserSheet = ({ onOpenChange, selected, ...props }: Props) => {
  if (!selected) return null; // Hindari error jika selected undefined

  const { data, setData, post, errors, reset, processing } = useForm<FormType>({
    name: selected?.name || "",
    email: selected?.email || "",
    image: undefined,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    post(route("users.update", selected.id), {
      onSuccess: () => {
        toast.success("user has been saved successfully");
        reset();
        onOpenChange?.(false);
      },
    });
  };
  return (
    <Sheet onOpenChange={onOpenChange} {...props}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Update User: {selected.name}</SheetTitle>
          <SheetDescription />
        </SheetHeader>

        <Avatar className="w-20 h-20 mt-5">
          <AvatarImage src={selected.avatar} />
          <AvatarFallback>{getAvatar(selected.name)}</AvatarFallback>
        </Avatar>

        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <Label>Full Name</Label>
            <Input
              value={data.name}
              onChange={(e) => setData("name", e.target.value)}
            />
            <FormError error={errors.name} />
          </div>

          <div className="space-y-1">
            <Label>Email address</Label>
            <Input
              value={data.email}
              type="email"
              onChange={(e) => setData("email", e.target.value)}
            />
            <FormError error={errors.email} />
          </div>

          <div className="space-y-1">
            <Label>Profile Image</Label>
            <Input
              type="file"
              onChange={(e) => setData("image", e.target.files?.[0])}
            />
            <FormError error={errors.image} />
          </div>

          <Button disabled={processing}>
            {processing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {!processing ? "Update" : "Updating..."}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default EditUserSheet;
