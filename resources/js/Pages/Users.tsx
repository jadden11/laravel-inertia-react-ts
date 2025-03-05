import React, { useMemo, useState } from "react";
import { User } from "../types";
import DataTable from "@/Components/data-table";
import ColumnHeader from "@/Components/column-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { getAvatar, cn } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import {
  Edit,
  LockKeyhole,
  LockKeyholeOpen,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { router } from "@inertiajs/react";
import toast, { Toaster } from "react-hot-toast";
import ConfirmAlert from "@/Components/confirm-alert";
import AddUserSheet from "@/Components/add-user-sheet";
import EditUserSheet from "@/Components/edit-user-sheet";

type Props = {
  users: User[];
};

type AlertType = "delete" | "activate" | "block";

const Users = ({ users }: Props) => {
  const [openAlert, setOpenAlert] = useState(false);
  const [alertType, setAlertType] = useState<AlertType>();
  const [selectedUser, setSelectedUser] = useState<User>();
  const [openAddUserSheet, setOpenAddUserSheet] = useState(false);
  const [openEditUserSheet, setOpenEditUserSheet] = useState(false);

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "avatar",
        header: ({ column }) => <ColumnHeader column={column} title="Avatar" />,
        enableSorting: false,
        cell: ({ row }) => {
          const user = row.original;

          return (
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{getAvatar(user.name)}</AvatarFallback>
            </Avatar>
          );
        },
      },
      {
        header: ({ column }) => (
          <ColumnHeader column={column} title="Full name" />
        ),
        accessorKey: "name",
      },
      {
        header: ({ column }) => <ColumnHeader column={column} title="Email" />,
        accessorKey: "email", // Perbaikan dari "Email" ke "email"
      },
      {
        id: "status",
        header: ({ column }) => <ColumnHeader column={column} title="Status" />,
        accessorKey: "is_active",
        cell: ({ row }) => {
          const user = row.original;

          return (
            <div
              className={cn(
                "inline-block px-2 py-0.5 rounded-md",
                user.is_active
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              )}
            >
              {user.is_active ? "Active" : "Inactive"}
            </div>
          );
        },
      },
      {
        id: "actions",
        header: ({ column }) => (
          <ColumnHeader column={column} title="Actions" />
        ),
        enableSorting: false,
        cell: ({ row }) => {
          const user = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open Menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedUser(user);
                    setOpenEditUserSheet(true);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => presentAlert(user, "delete")}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    presentAlert(user, user.is_active ? "block" : "activate")
                  }
                >
                  {user.is_active ? <LockKeyhole /> : <LockKeyholeOpen />}
                  {user.is_active ? "Block" : "Activate"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    []
  );

  const presentAlert = (user: User, type: AlertType) => {
    setSelectedUser(user);
    setAlertType(type);
    setOpenAlert(true);
  };

  const handleDelete = () => {
    router.delete(route("users.destroy", selectedUser?.id), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        toast.success("User has been deleted successfully");
        setSelectedUser(undefined);
      },
    });
  };

  const handleUpdateStatus = () => {
    router.post(
      route("users.status", selectedUser?.id),
      { status: alertType },
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          toast.success(`User has been ${alertType}`);
          setSelectedUser(undefined);
        },
      }
    );
  };

  return (
    <div className="max-w-7xl mx-auto mt-10">
      <div className="flex justify-between items-end mb-5">
        <div>
          <h1 className="text-3xl font-bold">User</h1>
          <p className="text-muted-foreground font-medium text-sm">
            Users accounts management with file uploads
          </p>
        </div>
        <Button onClick={() => setOpenAddUserSheet(true)}>Create</Button>
      </div>
      <DataTable data={users} columns={columns} />

      <ConfirmAlert
        open={openAlert}
        onOpenChange={setOpenAlert}
        title={`Confirm ${alertType} User`}
        message={`Are you sure you want to ${alertType} this user?`}
        onConfirm={alertType === "delete" ? handleDelete : handleUpdateStatus}
      />

      <AddUserSheet
        open={openAddUserSheet}
        onOpenChange={setOpenAddUserSheet}
      />

      {selectedUser && openEditUserSheet && (
        <EditUserSheet
          selected={selectedUser}
          open={openEditUserSheet}
          onOpenChange={(openState) => {
            setSelectedUser(undefined);
            setOpenEditUserSheet(openState); // Perbaikan di sini
          }}
        />
      )}

      <Toaster />
    </div>
  );
};

export default Users;
