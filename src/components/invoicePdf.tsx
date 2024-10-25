import React from "react";
import {
  PDFViewer,
  Document,
  Page,
  Image,
  Text,
  View,
} from "@react-pdf/renderer";
import { IInvoiceResponse } from "@/store/interfaces/IInvoices";
import Logo from "../../public/images/LogoAzul.png";

const InvoicePDF = ({ rowData }: { rowData: IInvoiceResponse }) => {
  return (
    <PDFViewer>
      <Document>
        <Page>
          <View>
            <Image src={Logo.src} />
            <View style={{ marginLeft: 120 }}>
              <Text>Fecha de emisión: {rowData.emissionDate}</Text>
              <Text>Tipo de emisión: {rowData.emissionType}</Text>
              <Text>Total sin impuestos: {rowData.totalWithoutTax}</Text>
              <Text>Descuento total: {rowData.totalDiscount}</Text>
              <Text>Total: {rowData.total}</Text>
              <Text>Tipo de pago: {rowData.paymentType}</Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default InvoicePDF;
