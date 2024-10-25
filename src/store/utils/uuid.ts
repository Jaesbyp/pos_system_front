import { IInvoicePDF, IInvoiceResponse } from "../interfaces/IInvoices";

// generate a uuid
export const uuid = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export function round(num: number) {
  var m = Number((Math.abs(num) * 100).toPrecision(15));
  return (Math.round(m) / 100) * Math.sign(num);
}

export function invoiceResToPDF(invoice: IInvoiceResponse): IInvoicePDF | null {
  const calcTax = (totalWithoutTax: number, total: number) => {
    return ((total - totalWithoutTax) * 100) / totalWithoutTax;
  };

  if (invoice) {
    const invoicePDF: IInvoicePDF = {
      logo: "https://pos-products.s3.amazonaws.com/products/LogoAzul.png",
      from: invoice.branchName,
      to: String(invoice.customerId),
      currency: "usd",
      number: invoice.accessKey,
      items:
        invoice.sellingProducts?.map((sellingProduct) => {
          return {
            quantity: sellingProduct.quantity,
            name: sellingProduct.product.name,
            description: sellingProduct.product.description,
            unit_cost: sellingProduct.product.unitPrice,
          };
        }) || [],
      tax_title: "Taxes",
      header: "Factura",
      fields: {
        tax: `%`,
        discounts: String(invoice.totalDiscount),
      },

      tax: calcTax(invoice.totalWithoutTax, invoice.total),
      notes: "Gracias por preferirnos, te quiero mucho",
      terms: "No hay devoluciones",
    };
    return invoicePDF;
  }

  return null;
}
