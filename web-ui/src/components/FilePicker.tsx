import React, { useRef } from 'react';

type FilePickerProps = {
  onFilesChange: (files: File[]) => void;
};

const FilePicker: React.FC<FilePickerProps> = ({ onFilesChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handlePickFolder = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.click();
    }
  };

  const handleDirChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files ? Array.from(e.target.files) : [];
    onFilesChange(fileList);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        multiple
        style={{ display: 'none' }}
        onChange={handleDirChange}
        {...{ webkitdirectory: 'true', directory: 'true' }}
      />
      <button
        style={{
          padding: '10px 28px',
          fontSize: 16,
          borderRadius: 8,
          border: 'none',
          background: '#2563eb',
          color: '#fff',
          cursor: 'pointer',
          fontWeight: 600,
          boxShadow: '0 2px 8px #e0e7ef',
        }}
        onClick={handlePickFolder}
      >
        选择文件夹
      </button>
    </div>
  );
};

export default FilePicker; 