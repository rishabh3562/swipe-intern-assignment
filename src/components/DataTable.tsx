import React from 'react';
import { Edit2 } from 'lucide-react';

interface Column {
  key: string;
  header: string;
  width?: string;
}

interface DataTableProps {
  data: any[];
  columns: Column[];
  onEdit?: (item: any) => void;
}


export const DataTable: React.FC<DataTableProps> = ({ data, columns, onEdit }) => {
  console.log('DataTable render');
  console.log('data:', data);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
            {onEdit && <th scope="col" className="relative px-6 py-3" />}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr
              key={item.id || index}
              className={item.status === 'incomplete' ? 'bg-red-50' : undefined}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {item[column.key]}
                </td>
              ))}
              {onEdit && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEdit(item)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};