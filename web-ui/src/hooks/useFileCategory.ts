import { useState } from 'react';
import { getFileCategory } from '../utils/category';

type FileInfo = {
  name: string;
  type: string;
  category: string;
  path: string;
};

export function useFileCategory() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const classifyFiles = (fileList: File[]) => {
    setLoading(true);
    setProgress(0);
    const total = fileList.length;
    const result = fileList.map((f, idx) => {
      setProgress(Math.round(((idx + 1) / total) * 100));
      return {
        name: f.name,
        type: f.type,
        category: getFileCategory(f.name),
        path: (f as File & { webkitRelativePath?: string }).webkitRelativePath || f.name,
      };
    });
    setFiles(result);
    setLoading(false);
  };

  return { files, loading, progress, classifyFiles };
} 