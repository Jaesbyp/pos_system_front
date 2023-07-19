"use client"
import { IInputsForm } from '@/store/types/IForms';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { KeyFilterType } from 'primereact/keyfilter';
import { Toast } from 'primereact/toast';
import React, { MouseEvent, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import ModifyCategoryDialog from '@/components/modifyCategoryDialog';
import { handleGetAllCategories } from '@/store/api/categoryApi';
import { ICategoryResponse } from '@/store/types/ICategory';

export default function page() {
    const toast = useRef<Toast>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [categories, setCategories] = useState<ICategoryResponse[]>([]);
    const [addVisible, setAddVisible] = useState(false);
    const [editVisible, setModifyVisible] = useState(false);
    const [category, setCategory] = useState<ICategoryResponse>();

    const {
        reset,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        handleGetAllCategories().then((res) => {
            if (res) {
                setCategories(res);
            }
        }
        )
    }, []);

    const columns = [
        { field: "id", header: "ID" },
        { field: "category", header: "Categoria" },
    ];

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }

    const filteredCategories = categories.filter((category) =>
        Object.values(category).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const handleModify = (category: any) => {
        setCategory(category);
        setModifyVisible(true);
    }

    const confirm = (
        event: MouseEvent<HTMLButtonElement>,
        category: any
    ) => {
        confirmPopup({
            target: event.currentTarget,
            message: '¿Está seguro que desea eliminar este usuario?',
            icon: 'pi pi-exclamation-triangle',
            acceptClassName: 'p-button-danger',
            accept() {
                accept(category);
            },
            reject,
        });
    }

    const accept = (category: any) => {
        toast.current?.show({
            severity: 'info',
            summary: 'SConfirmed',
            detail: 'You have accepted',
            life: 3000,
        });
        handleDelete(category);
    }

    const reject = () => {
        toast.current?.show({
            severity: 'info',
            summary: 'Rejected',
            detail: 'You have rejected',
            life: 3000,
        });
    }

    const handleDelete = (category: any) => {
        console.log(category);

    }
    const allForms: IInputsForm[] = [
        {
            name: 'name',
            label: 'Nombre',
            keyfilter: 'alpha',
            placeholder: 'Nombre de la categoria',
            alertText: '*El nombre es obligatorio',
        },
        {
            name: 'iva',
            label: 'IVA',
            keyfilter: 'alphanum',
            placeholder: 'IVA',
            alertText: '*El IVA es obligatorio',
        }

    ];

    const handleRegister = (data: any) => {
        console.log(data);
    }

    return (
        <div className='border p-4 border-opacity-5 bg-gray-700 w-full mx-16'>
            <div className='flex flex-col gap-6'>
                <h1 className='text-neutral-100 text-3xl text-center font-bold bg-jair py-3 border-2 border-slate-400 rounded-md'><span><i className="pi pi-search" style={{ fontSize: '1.5rem' }}></i></span> Listado de Categorias</h1>
                <div className='flex gap-4 justify-between'>
                    <div className='p-input-icon-left'>
                        <i className="pi pi-search" style={{ fontSize: '1.2rem' }}></i>
                        <InputText
                            type='search'
                            placeholder='Buscar'
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-96"
                        />
                    </div>
                    <Button label="Agregar Categoria" severity="info" raised icon="pi pi-plus" className="p-button-success" onClick={() => setAddVisible(true)} />
                </div>
                <DataTable
                    value={filteredCategories}
                    tableStyle={{ minWidth: '50rem' }}
                    className='centered-table'
                    paginator
                    rows={5}
                    rowsPerPageOptions={[5, 10, 15]}
                >
                    {columns.map((col, i) => {
                        if (col.field === 'actions') {
                            return (
                                <Column
                                    key={col.field}
                                    style={{ display: 'flex', justifyContent: 'center', textAlign: 'center' }}
                                    header={col.header}
                                    headerStyle={{ textAlign: 'center' }}
                                    body={(rowData) => (
                                        <div className="action-buttons flex gap-6">
                                            <Button icon="pi pi-pencil" severity="info" aria-label="User" onClick={() => handleModify(rowData)} />
                                            <Toast ref={toast} />
                                            <ConfirmPopup />
                                            <Button
                                                icon="pi pi-eraser"
                                                severity="danger"
                                                aria-label="Cancel"
                                                onClick={(e) => confirm(e, rowData)} />
                                        </div>
                                    )}
                                />
                            );

                        } else {
                            return (
                                <Column
                                    key={col.field}
                                    field={col.field}
                                    header={col.header}
                                    alignHeader={'center'}
                                    body={(rowData) => rowData[col.field] || '-'}
                                    style={{ textAlign: 'center' }}
                                />
                            );
                        }
                    }
                    )}
                </DataTable>

                {
                    category !== undefined && (
                        <ModifyCategoryDialog
                            toast={toast}
                            category={category}
                            onHide={() => {
                                reset();
                                setModifyVisible(false)
                            }
                            }
                            visible={editVisible}
                            setEditVisible={setModifyVisible}
                            setCategory={setCategory}

                        />
                    )
                }

                <Dialog
                    visible={addVisible}
                    style={{ width: '50vw' }}
                    onHide={() => {
                        reset();
                        setAddVisible(false)
                    }}
                >
                    <form className="px-16">
                        <h1 className="text-center font-bold text-3xl">Agregar un cliente</h1>
                        {allForms.map((form, i) => (
                            <div className="py-3 block mt-3" key={i} >
                                <span className="p-float-label">
                                    <InputText
                                        className="border border-solid border-gray-300 py-2 px-4 rounded-full w-full"
                                        keyfilter={form.keyfilter as KeyFilterType}
                                        placeholder={form.placeholder}
                                        {...register(form.name, {
                                            required: form.alertText,
                                        })} />
                                    <label className="block pb-2">{form.label}</label>
                                </span>
                                {errors[form.name] && (
                                    <small className="text-red-500">{form.alertText}</small>
                                )}
                            </div>
                        ))}

                        <div className="flex justify-center gap-4 py-4">
                            <Button
                                label="Agregar"
                                severity="info"
                                className="w-1/2"
                                onClick={handleRegister}
                            />
                        </div>
                    </form>
                    <div className="flex justify-center px-16">
                        <Button
                            label="Cancelar"
                            severity="danger"
                            className="w-1/2"
                            onClick={() => {
                                reset()
                                setAddVisible(false)
                            }} />
                    </div>
                </Dialog>
            </div>

        </div>
    )
}
