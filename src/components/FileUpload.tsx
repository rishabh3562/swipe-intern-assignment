import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addInvoices } from '../store/slices/invoicesSlice';
import { addProducts } from '../store/slices/productsSlice';
import { addCustomers } from '../store/slices/customersSlice';
import { extractDataFromImage, extractDataFromPDF, processExcelData } from '../services/aiService';
import * as XLSX from 'xlsx';

interface FileUploadProps {
  onUploadStart: () => void;
  onUploadComplete: () => void;
}
export const FileUpload: React.FC<FileUploadProps> = ({ onUploadStart, onUploadComplete }) => {
  const dispatch = useDispatch();

  const formatProductNames = (productDetails: any[]) => {
    const productNames = productDetails.map((product: any) => product.name);

    // if (productNames.length > maxLength) {
    //   return `${productNames.slice(0, maxLength).join(", ")}...`;
    // }

    return productNames.join(", ");
  };
  const processFile = async (file: File) => {
    onUploadStart();
    try {
      let data;

      if (file.type.includes('image')) {
        // console.log("data in image before await call", data);
        data = await extractDataFromImage(file);
        // console.log("data in image await await call", data);

      } else if (file.type.includes('pdf')) {
        // console.log("data in PDF before await call", data);

        data = await extractDataFromPDF(file);
        // console.log("data in PDF await await call", data);
      } 
      else if (file.type.includes('sheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const reader = new FileReader();
        const result = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target?.result);
          reader.readAsBinaryString(file);
        });

        const workbook = XLSX.read(result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        // console.log("data in excel before await call", data);
        data = await processExcelData(excelData);

        // console.log("data in excel after await call", data);
      } else {
        throw new Error('Unsupported file format');
      }

      if (data) {
        const inv: any = {
          id: data.serial_number,
          serialNumber: data.serial_number,
          customerName: data.customer_name,
          productName: formatProductNames(data.product_details),
          quantity: data.product_details.length,
          tax: data.tax_amount,
          totalAmount: data.total_amount,
          date: data.date,
        };
        dispatch(addInvoices([inv]));
      }

      if (data.product_details) {
        const some: any = data.product_details.map((product: any, index: number) => {
          // Calculate GST amount based on the given logic
          const tax_by_calc = product.GST_amount
            ? product.GST_amount
            : product.GST_percentage
              ? (product.GST_percentage * product.unit_price * product.quantity) / 100
              : 0;

          return {
            id: `${data.serial_number}-${index}`, // Unique key
            serialNumber: data.serial_number,
            customerName: data.customer_name,
            productName: product.name,
            quantity: product.quantity,
            unitPrice: product.unit_price,
            GSTPercentage: product.GST_percentage || 0,
            GSTAmount: tax_by_calc,
            totalAmount: product.quantity * product.unit_price + tax_by_calc - (product.discount || 0),
            discount: product.discount || 0,
            date: data.date,
          };
        });

        dispatch(addProducts(some));
      }

      
      // Address parsing helper function
      const parseAddress = (address: string | null): string => {
        if (!address) return "N/A"; // Fallback if address is null
        return address.replace(/\n/g, ", ").trim(); // Replace newlines with commas
      };
      if (data) {
        const customers: any = [
          {
            serialNumber: data.serial_number,
            customerName: data.customer_name,
            phoneNumber: data.customer_phone_number || "N/A", // Default to "N/A" if null
            address: parseAddress(data.customer_address),
            totalAmount: data.total_amount,
            bankDetails: {
              bankName: data.bank_details?.bank_name || "N/A",
              accountNumber: data.bank_details?.account_number || "N/A",
              IFSCCode: data.bank_details?.IFSC_code || "N/A",
              branch: data.bank_details?.branch || "N/A",
              beneficiaryName: data.bank_details?.beneficiary_name || "N/A",
              UPI: data.bank_details?.UPI || "N/A",
            },
            taxableAmount: data.taxable_amount,
            taxAmount:data.tax_amount,
            lastPurchaseDate: data.date,
          },
        ];

        dispatch(addCustomers(customers));
      }

      // Address parsing helper function
 


      toast.success('File processed successfully');
    } catch (error) {
      // console.error('Error processing file:', error);
      toast.error('Error processing file. Please try again.');
    }finally{

      onUploadComplete();// End upload
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(processFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        {isDragActive
          ? 'Drop the files here...'
          : 'Drag & drop files here, or click to select files'}
      </p>
      <p className="mt-1 text-xs text-gray-500">
        Supports PDF, Images (PNG, JPG), and Excel files (XLSX, XLS)
      </p>
    </div>
  );
};