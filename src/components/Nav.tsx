import React from "react";
import logo from "../../public/images/PostLogo5.webp";
import Option from "./Option";
import Link from "next/link";
import { UrlObject } from "url";
import Button from "@/components/Button";
import "../app/globals.css";

type Url = string | UrlObject;
export interface IOption {
  label: string;
  redirect?: string | Url | (() => void);
  type: "button" | "option" | "image";
}

function Navegador({
  options,
  imageRedirect,
}: {
  options: IOption[];
  imageRedirect: string;
}) {
  return (
    <div className="flex py-1 bg-jair">
      <div className="flex-1 ml-12">
        <div className="flex justify-start w-2/6">
          <Link href={imageRedirect}>
            <img className=" h-32" src={logo.src} alt="logo" />
          </Link>
        </div>
      </div>

      <div className="flex-1 flex justify-end gap-x-4 mr-12 items-center">
        {options.map((option, index) => {
          if (option.type === "button") {
            return (
              <div
                className="h-5/6 flex items-center justify-center gap-6 hover:bg-blue-600 my-4 rounded-md"
                key={index}
              >
                <Button
                  texto={option.label as string}
                  key={option.label as string}
                  onclick={option.redirect as () => {}}
                />
              </div>
            );
          }

          if (option.type === "option") {
            return (
              <div
                className="h-5/6 flex items-center justify-center gap-6 hover:border-green-500  hover:text-blue-400 px-4 my-4 rounded-md"
                key={index}
              >
                <Option
                  opcion={option.label}
                  redirect={option.redirect as string}
                />
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}

export default Navegador;
