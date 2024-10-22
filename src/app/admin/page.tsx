"use client";
import React, { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { UserRoles } from "@/store/types/IUserResponses";
import { Card } from "primereact/card";

function HomePageAdmin() {
  const router = useRouter();
  const header = (
    <img
      alt="Card"
      src="https://images.unsplash.com/photo-1664575262619-b28fef7a40a4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDIyfGFldTZyTC1qNmV3fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&w=600&q=60 "
      className="h-50"
    />
  );
  const footer = (
    <p className="m-0 flex justify-center">
      Bienvenido! Aquí podrás administrar tu empresa.
    </p>
  );

  useEffect(() => {
    const user = window.localStorage.getItem("user");
    const userData = user ? JSON.parse(user) : null;

    if (!user) {
      toast.error("Debes iniciar sesión primero");
      router.push("/user/");
    }

    if (userData.rol != UserRoles.ADMIN) {
      toast.error("No tienes permisos para acceder a esta página");
      router.push("/");
    }
  }, []);

  return (
    <main className="bg-primary-Jair w-11/12">
      <div className="card justify-center items-center bg-center flex h-screen">
        <Card
          header={header}
          footer={footer}
          className="w-3/6 shadow-md border-b-2 "
        >
          <h1 className="text-2xl font-bold text-center">{"POS SYSTEM"}</h1>
        </Card>
      </div>
    </main>
  );
}

export default HomePageAdmin;
