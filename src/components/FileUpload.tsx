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
import { Invoice } from '../types';

export const FileUpload: React.FC = () => {
  const dispatch = useDispatch();

  const processFile = async (file: File) => {
    try {
      let data;
      
      if (file.type.includes('image')) {
        console.log("data in image before await call",data);
        data = await extractDataFromImage(file);
        console.log("data in image await await call", data);

      } else if (file.type.includes('pdf')) {
        console.log("data in PDF before await call", data);

        data = await extractDataFromPDF(file);
        console.log("data in PDF await await call", data);
      } else if (file.type.includes('sheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const reader = new FileReader();
        const result = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target?.result);
          reader.readAsBinaryString(file);
        });
        
        const workbook = XLSX.read(result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        data = await processExcelData(excelData);
      } else {
        throw new Error('Unsupported file format');
      }

      if (data){
const inv: any={
  id: data.serial_number,
  serialNumber: data.serial_number,
  customerName: data.customer_name,
  // productName: data,
  quantity: data.product_details.length,
  tax: data.tax_amount,
  totalAmount: data.total_amount,
  date: data.date,
  

}
        dispatch(addInvoices([inv]));
      }
      if (data.product_details) {dispatch(addProducts(data.product_details));}
      if (data.customers){ dispatch(addCustomers(data.customers));}

      toast.success('File processed successfully');
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Error processing file. Please try again.');
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