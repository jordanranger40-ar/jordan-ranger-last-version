"use server";
import React from "react";
import { getUserById } from "@/app/models/db/lib/services/users";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UpdateRoleForm from "@/components/users/updateUserForm";
import { updateUserRole } from "../(fetch)/updateUserRole";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

async function page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await getUserById(params.id);
  console.log(user);

  return (
    <main className="ml-7 mb-7">
      {/* Header */}
      <div className="flex flex-col justify-start items-start border-b border-gray-500 w-[80vw] mb-7">
        <h1 className="text-lg md:text-2xl font-bold"> Edit User</h1>
        <h2 className="text-base md:text-xl text-gray-400">
          {" "}
          Manage role for Admin
        </h2>
      </div>
      <div className=" h-full lg:h-[85vh] w-[80vw] flex flex-col lg:flex lg:flex-row gap-5 ">
        <Card className="w-full h-full">
          <CardHeader>
            <CardTitle className="text-base md:text-2xl mb-5">
              User Information
            </CardTitle>
            <CardDescription className="flex flex-row items-center gap-3 mb-7">
              <Avatar className="h-20 w-20 text-4xl">
                <AvatarFallback className="bg-[#676e32] text-white font-semibold ">
                  {user[0].email.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-base md:text-lg capitalize text-black font-bold">
                  {" "}
                  {user[0].first_name}
                </p>
                <p className="text-base md:text-lg">{user[0].email}</p>
                <p
                  className={`text-base md:text-lg uppercase  ${
                    user[0].role === "admin"
                      ? "text-[#8B0000] "
                      : "text-gray-800 "
                  }`}
                >
                  {user[0].role}
                </p>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-base md:text-2xl mb-5 font-bold">
              Account Details
            </p>
            <div className="flex flex-col lg:flex lg:flex-row lg:gap-40 gap-4 mb-12">
              <div>
                <p className="text-base text-gray-600"> Full Name</p>
                <p className="text-base">
                  {" "}
                  {user[0].first_name} {user[0].last_name}
                </p>
              </div>
              <div>
                <p className="text-base text-gray-600"> Email</p>
                <p className="text-base"> {user[0].email}</p>
              </div>
            </div>
            <div>
              <p className=" text-xs lg:text-base text-gray-600"> User ID</p>
              <p className="text-base"> {user[0].id}</p>
            </div>
          </CardContent>
        </Card>
        {/* Edit User Card */}
        <Card className="w-full h-full">
          <CardHeader>
            <CardTitle className="text-base md:text-2xl mb-2">
              Edit User Role
            </CardTitle>
            <CardDescription className="flex flex-col gap-3 mb-3">
              <p className="text-xs lg:text-base mb-5">
                Update the role for {user[0].first_name}. This will affect their
                permissions within the system.
              </p>
              <UpdateRoleForm
                userId={user[0].id}
                userRole={user[0].role}
                action={updateUserRole}
              />
            </CardDescription>
          </CardHeader>
          <CardContent>
            
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default page; 
