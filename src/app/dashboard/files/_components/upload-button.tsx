'use client';

import { T } from 'gt-next';
import { Upload, Loader2 } from 'lucide-react';
import { useRef } from 'react';

import { ResponsiveButton } from '@/components/layout';

interface UploadButtonProps {
  readonly isUploading: boolean;
  readonly disabled: boolean;
  readonly onFilesSelected: (files: FileList) => void;
}

export function UploadButton({
  isUploading,
  disabled,
  onFilesSelected,
}: UploadButtonProps): React.ReactElement {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = (): void => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files?.length) {
      onFilesSelected(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleChange}
      />
      <ResponsiveButton
        desktopLabel={isUploading ? <T>Uploading...</T> : <T>Upload Files</T>}
        mobileLabel={isUploading ? <T>Uploading...</T> : <T>Upload</T>}
        icon={isUploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
        onClick={handleClick}
        disabled={isUploading || disabled}
      />
    </>
  );
}
