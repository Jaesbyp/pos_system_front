"use client";
import { useEffect, useState } from "react";
import Input, { IInputsForm } from "@/components/Input";
import Button from "@/components/Button";
import Navegador, { IOption } from "@/components/Nav";
import SecondaryButton from "@/components/secondaryButton";
import { useRouter } from "next/navigation";
import { fetchLogin } from "@/store/api/loginApi";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { UserRoles } from "@/store/types/IUserResponses";

function Login() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const formDatas: IInputsForm[] = [
        {
            name: "email",
            alertText: "El email es requerido",
            label: "Correo electrónico:",
            type: "email",
            placeholder: "email",
        },
        {
            name: "password",
            alertText: "La contraseña es requerida",
            label: "Contraseña:",
            type: "password",
            placeholder: "password",
        },
    ];

    useEffect(() => {
        const user = window.localStorage.getItem("user");
        const userData = user ? JSON.parse(user) : null;

        if (!user) {
            return;
        }

        if (userData.rol == UserRoles.ADMIN) {
            toast.success("Bienvenido administrador");
            toast.loading("Cargando...", { duration: 1500 });
            router.push(`/admin/`);
        }

        if (userData.rol == UserRoles.USER) {
            toast.success("Bienvenido usuario");
            toast.loading("Cargando...", { duration: 1500 });
            router.push(`/user/`);
        }
    }, []);

    const handleLogin = handleSubmit((data) => {
        try {
            fetchLogin(data.email, data.password).then((user) => {
                if (user) {
                    window.localStorage.setItem("user", JSON.stringify(user));

                    if (user.rol == UserRoles.ADMIN) {
                        toast.success("Bienvenido administrador");
                        toast.loading("Cargando...", { duration: 1500 });

                        router.push(`/admin/`);
                    } else if (user.rol == UserRoles.USER) {
                        toast.success("Bienvenido usuario");
                        toast.loading("Cargando...", { duration: 1500 });

                        router.push(`/user/`);
                    } else {
                        toast.error("Hubo un error al iniciar sesión");
                        router.push(`/`);
                    }
                } else {
                    toast.error("Usuario o contraseña incorrectos");
                    router.push("/");
                }
            });
        } catch (error) {
            toast.error("Error al iniciar sesión");
            console.log(error);
        }
    });

    const options: IOption[] = [
        { label: "Sobre Nosotros", redirect: "/about", type: "option" },
    ];

    return (
        <div className="bg-gray-900">
            <main className="h-screen flex justify-center items-center">
                <div className="w-full max-w-sm mx-auto overflow-hidden rounded-lg shadow-md bg-gray-800 ">
                    <div className="px-6 py-4">
                        <div className="flex justify-center mx-auto">
                            <img
                                className="w-auto h-7 sm:h-8"
                                src="https://merakiui.com/images/logo.svg"
                                alt="login-logo"
                            />
                        </div>

                        <h3 className="mt-3 text-xl font-medium text-center text-gray-200">
                            Bienvenido de vuelta
                        </h3>

                        <p className="my-1 text-center text-gray-400">
                            Iniciar sesión
                        </p>

                        <form>
                            {formDatas.map((formData, index) => (
                                <div className="pb-4 block" key={index}>
                                    <label className="block pb-2 text-gray-200">
                                        {" "}
                                        {formData.label}
                                    </label>
                                    <input
                                        className="block w-full px-4 py-2 mt-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
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

                            <div className="flex items-center justify-center mt-4">
                                {/*} <a
                                    href="#"
                                    className="text-sm text-gray-600 dark:text-gray-200 hover:text-gray-500"
                                >
                                    Forget Password?
                                </a>
                                */}

                                <button
                                    className="px-6 py-2 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                                    type="submit"
                                    onClick={handleLogin}
                                >
                                    Sign In
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </main>
        </div>
    );
}

export default Login;
