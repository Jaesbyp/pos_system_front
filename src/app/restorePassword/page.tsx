"use client";
import { IInputsForm } from "@/components/Input";
import React, { useState } from "react";
import ComboBox from "@/components/ComboBox";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  fetchResetPassword,
  fetchResetRequestPassword,
} from "@/store/api/userApi";
import { IResetPasswordData } from "@/store/interfaces/IUserResponses";
import { toast } from "react-hot-toast";

export default function page() {
  const [accountType, setAccountType] = useState("");
  const [typeSelected, setTypeSelected] = useState(false);

  const accountOptions = {
    Personal: "USER",
    Empresarial: "ENTERPRISE",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const userData: IInputsForm[] = [
    {
      name: "email",
      label: "Correo electrónico:",
      alertText: "Correo electrónico requerido",
      type: "email",
      placeholder: "Correo electrónico",
    },
    {
      name: "name",
      label: "Nombre:",
      alertText: "Nombre requerido",
      type: "text",
      placeholder: "Nombre",
    },
    {
      name: "dni",
      label: "Cédula: ",
      alertText: "Cédula requerida",
      type: "text",
      placeholder: "Cédula",
    },
    {
      name: "birthDate",
      label: "Fecha de Nacimiento: ",
      alertText: "Fecha de nacimiento requerida",
      type: "date",
      placeholder: "Fecha de nacimiento",
    },
    {
      name: "phoneNumber",
      label: "Número de celular:",
      alertText: "Número de celular requerido",
      type: "tel",
      placeholder: "Número de celular",
    },
  ];

  const enterpriseData: IInputsForm[] = [
    {
      name: "email",
      label: "Correo electrónico:",
      alertText: "Correo electrónico requerido",
      type: "email",
      placeholder: "Correo electrónico",
    },
    {
      name: "enterpriseName",
      label: "Nombre de la empresa:",
      alertText: "Nombre de empresa requerido",
      type: "text",
      placeholder: "Nombre de la empresa",
    },
    {
      name: "ruc",
      label: "RUC:",
      alertText: "Ruc requerido",
      type: "number",
      placeholder: "RUC",
    },
    {
      name: "fundationDate",
      label: "Fecha de Fundación: ",
      alertText: "Fecha de fundacion requerida",
      type: "date",
      placeholder: "Fecha de fundacion",
    },
    {
      name: "phoneNumber",
      label: "Número de celular:",
      alertText: "Número de celular requerido",
      type: "tel",
      placeholder: "Número de celular",
    },
  ];

  const handleAccountType = (selectedAccount: string) => {
    setAccountType(
      accountOptions[selectedAccount as keyof typeof accountOptions]
    );
    setTypeSelected(true);
  };

  const router = useRouter();

  const handleRestore = handleSubmit((data) => {
    let passwordResetData: IResetPasswordData;

    if (accountType === "USER") {
      passwordResetData = {
        email: data.email,
        name: data.name,
        dni_ruc: data.dni,
        originDate: data.birthDate,
        phoneNumber: data.phoneNumber,
        type: "CLIENT",
      };
    } else {
      passwordResetData = {
        email: data.email,
        name: data.enterpriseName,
        dni_ruc: data.ruc,
        originDate: data.fundationDate,
        phoneNumber: data.phoneNumber,
        type: "COMPANY",
      };
    }

    console.log({ passwordResetData });

    fetchResetRequestPassword(passwordResetData).then((userId) => {
      if (userId) {
        window.localStorage.setItem("resetPasswordToken", "token" + userId);
        toast.success("Usuario encontrado");
        router.push(`/restorePassword/${userId}`);
      } else {
        toast.error("No se pudo encontrar el usuario con los datos ingresados");
      }
    });
  });

  return (
    <div className="mx-auto my-0 max-w-screen-xl">
      <p className="mt-4">
        Necesitamos comprobar que eres tú, porfavor completa los siguientes
        campos:{" "}
      </p>

      <form className="flex flex-col gap-4 mt-8">
        <ComboBox
          options={["Empresarial", "Personal"]}
          label="Tipo de cuenta:"
          onChange={handleAccountType}
          defaultValue="Seleccione tipo de cuenta"
        />
        <div className="flex flex-col gap-2">
          {accountType === "USER" &&
            userData.map((formData, index) => (
              <div className="pb-4 block" key={index}>
                <label className="block pb-2 "> {formData.label}</label>
                <input
                  className="border border-solid border-gray-300 py-2 px-4 rounded-full w-full"
                  type={formData.type}
                  placeholder={formData.placeholder}
                  {...register(formData.name, {
                    required: formData.alertText,
                  })}
                />
                {errors[formData.name] && (
                  <span className="text-red-500">{formData.alertText}</span>
                )}
              </div>
            ))}
          {accountType === "ENTERPRISE" &&
            enterpriseData.map((formData, index) => (
              <div className="pb-4 block" key={index}>
                <label className="block pb-2 "> {formData.label}</label>
                <input
                  className="border border-solid border-gray-300 py-2 px-4 rounded-full w-full"
                  type={formData.type}
                  placeholder={formData.placeholder}
                  {...register(formData.name, {
                    required: formData.alertText,
                  })}
                />
                {errors[formData.name] && (
                  <span className="text-red-500">{formData.alertText}</span>
                )}
              </div>
            ))}
          {typeSelected && (
            <button
              className="bg-blue-500 text-white rounded-full py-2 px-4"
              onClick={handleRestore}
            >
              Enviar
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
