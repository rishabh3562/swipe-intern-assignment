import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DataTable } from '../DataTable';
import { RootState } from '../../store';
import { updateProduct } from '../../store/slices/productsSlice';
import { updateInvoiceProduct } from '../../store/slices/invoicesSlice';

const columns = [
  { key: 'name', header: 'Name', width: '25%' },
  { key: 'quantity', header: 'Quantity', width: '15%' },
  { key: 'unitPrice', header: 'Unit Price', width: '15%' },
  { key: 'tax', header: 'Tax', width: '15%' },
  { key: 'priceWithTax', header: 'Price with Tax', width: '15%' },
  { key: 'discount', header: 'Discount', width: '15%' },
];

export const ProductsTab: React.FC = () => {
  const dispatch = useDispatch();
  const products = useSelector((state: RootState) => state.products);

  const handleEdit = (product: any) => {
    dispatch(updateProduct({ ...product }));
    // Update related invoices
    dispatch(updateInvoiceProduct({ id: product.id, productName: product.name }));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Products</h2>
      <DataTable
        data={products}
        columns={columns}
        onEdit={handleEdit}
      />
    </div>
  );
};