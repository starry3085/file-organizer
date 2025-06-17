import React from 'react';
import { iconMap } from '../utils/category';

type FileInfo = {
  name: string;
  type: string;
  category: string;
  path: string;
};

type CategoryTableProps = {
  files: FileInfo[];
};

const CategoryTable: React.FC<CategoryTableProps> = ({ files }) => {
  if (files.length === 0) return null;
  return (
    <div style={{ maxHeight: 400, overflow: 'auto', border: '1px solid #e5e7eb', borderRadius: 8 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
        <thead style={{ background: '#f9fafb' }}>
          <tr>
            <th style={{ padding: 10, borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>文件名</th>
            <th style={{ padding: 10, borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>类型</th>
            <th style={{ padding: 10, borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>分类</th>
            <th style={{ padding: 10, borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>路径</th>
          </tr>
        </thead>
        <tbody>
          {files.map((f, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb' }}>
              <td style={{ padding: 10 }}>{f.name}</td>
              <td style={{ padding: 10 }}>{f.type || '-'}</td>
              <td style={{ padding: 10 }}>{iconMap[f.category] || iconMap['其他']} {f.category}</td>
              <td style={{ padding: 10, color: '#888' }}>{f.path}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable; 