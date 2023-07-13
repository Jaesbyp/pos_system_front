"use client";
import React from 'react'
import InputForm, { IInputsForm } from '@/components/Input'
import { InputText } from 'primereact/inputtext';
import { KeyFilterType } from 'primereact/keyfilter';
import { useForm } from 'react-hook-form';
import 'primeicons/primeicons.css';

export default function page() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const allForms: IInputsForm[] = [
    {
      name: 'name',
      label: 'Nombre',
      keyfilter: 'alpha',
      placeholder: 'Nombre del Usuario',
      alertText: '*El nombre es obligatorio',
      onChange: () => {},
    },
    {
      name: 'lastName',
      label: 'Apellido',
      keyfilter: 'alpha',
      placeholder: 'Apellido del Usuario',
      alertText: '*El apellido es obligatorio',
      onChange: () => {},
    },
    {
      name: 'email',
      label: 'Correo',
      keyfilter: 'email',
      placeholder: 'Correo electrónico',
      alertText: '*El correo es obligatorio',
      onChange: () => {},
    },
    {
      name: 'password',
      label: 'Contraseña',
      keyfilter: 'alphanum',
      placeholder: 'Contraseña',
      alertText: '*La contraseña es obligatoria',
      onChange: () => {},
    },
    ]
    
  return (
    <div >
        <i className="pi pi-user-plus" style={{ fontSize: '2rem' }}></i>
        {allForms.map((allForm, index) => (
            <div className="pb-4 block" key={index}>
                <label className="block pb-2">{allForm.label}</label>
                <InputText 
                    className="border border-solid border-gray-300 py-2 px-4 rounded-full w-full"
                    keyfilter={allForm.keyfilter as KeyFilterType}
                    placeholder={allForm.placeholder}
                    {...register(allForm.name, {
                        required: allForm.alertText,
                    })}/>
            </div>
        ))}
    </div>
  )
}
