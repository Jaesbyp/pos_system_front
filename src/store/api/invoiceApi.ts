import config from "../../../config/serverConfig";
import {
  IInvoiceCreate,
  IInvoicePDF,
  IInvoiceResponse,
} from "../interfaces/IInvoices";
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";

export const handleGetInvoice = async (invoiceId: number) => {
  try {
    const response = await fetch(
      `${config.API_REST_BASE_URL}/invoices/${invoiceId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log("No se encontro la factura.");
      return;
    }
    const data = await response.json();
    const invoiceData: IInvoiceResponse = data;

    if (!invoiceData) {
      console.log("Error al obtener la factura.");
      return;
    }

    return invoiceData;
  } catch (error) {
    console.log({ error });
  }
};

export const handleGetAllInvoices = async () => {
  try {
    const response = await fetch(`${config.API_REST_BASE_URL}/invoices`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.log("No se pudo obtener las facturas.");
      return;
    }
    const data = await response.json();
    const invoicesData: IInvoiceResponse[] = data;

    if (!invoicesData) {
      console.log("Error al obtener las facturas.");
      return;
    }

    return invoicesData;
  } catch (error) {
    console.log({ error });
  }
};

export const handleCreateInvoice = async (invoice: IInvoiceCreate) => {
  try {
    const response = await fetch(
      `${config.API_REST_BASE_URL}/invoices/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoice),
      }
    );

    if (!response.ok) {
      console.log("No se pudo crear la factura.");
      return;
    }
    const data = await response.json();
    const invoiceData: IInvoiceResponse = data;

    if (!invoiceData) {
      console.log("Error al crear la factura.");
      return;
    }

    return invoiceData;
  } catch (error) {
    console.log({ error });
  }
};

export const handleUpdateInvoiceValues = async (invoiceId: number) => {
  try {
    const response = await fetch(
      `${config.API_REST_BASE_URL}/invoices/${invoiceId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log("No se pudo actualizar los valores de la factura.");
      return;
    }
    const data = await response.json();
    const invoiceData: IInvoicePDF = data;

    if (!invoiceData) {
      console.log("Error al actualizar los valores de la factura.");
      return;
    }

    return invoiceData;
  } catch (error) {
    console.log({ error });
  }
};

export const handleCreatePDF = async (
  invoice: IInvoicePDF,
  fileName: string
) => {
  try {
    const postData = JSON.stringify(invoice);
    // Haz la solicitud a tu endpoint en Next.js
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: postData,
      duplex: "half",
    };

    const response = await fetch(
      "http://localhost:3000/api/createPDF",
      options
    );

    if (!response.ok) {
      console.log("No se pudo crear el PDF.");
      return;
    }

    return response;
  } catch (error) {
    console.log({ error });
  }
};

export const handleGenerateXML = async (invoiceId: number) => {
  try {
    const response = await fetch(
      `${config.API_REST_BASE_URL}/invoices/generate/${invoiceId}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      console.log("No se pudo generar el XML.");
      return;
    }
    const data = await response.text();
    const xmlData: string = data;

    if (!xmlData) {
      console.log("Error al generar el XML.");
      return;
    }

    return xmlData;
  } catch (error) {
    console.log({ error });
  }
};
