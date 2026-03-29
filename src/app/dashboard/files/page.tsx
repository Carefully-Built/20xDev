'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { FileCard, FileCardSkeleton, EmptyState, UploadButton } from './_components';

import type { FileWithUrl } from './_components';
import type { Id } from '@convex/_generated/dataModel';

import { PageLayout } from '@/components/layout';
import {
  useFilesByOrganization,
  useGenerateUploadUrl,
  useSaveFile,
  useDeleteFile,
  uploadFile,
} from '@/hooks/use-files';
import { useCurrentUserByOrganization } from '@/hooks/use-users';
import { useOrganization } from '@/providers';



const SKELETON_COUNT = 10;
const GRID_CLASSES = 'grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5';

export default function FilesPage(): React.ReactElement {
  const [isUploading, setIsUploading] = useState(false);
  const { organizationId } = useOrganization();
  const files = useFilesByOrganization(organizationId);
  const currentUser = useCurrentUserByOrganization(organizationId);
  const generateUploadUrl = useGenerateUploadUrl();
  const saveFile = useSaveFile();
  const deleteFile = useDeleteFile();

  const isLoading = files === undefined || currentUser === undefined || organizationId === null;

  const handleUpload = async (selectedFiles: FileList): Promise<void> => {
    if (!currentUser?._id || !organizationId) return;
    setIsUploading(true);
    try {
      await Promise.all(
        Array.from(selectedFiles).map((file) =>
          uploadFile({ file, organizationId, uploadedBy: currentUser._id, generateUploadUrl, saveFile })
        )
      );
      toast.success('Uploaded ' + String(selectedFiles.length) + ' file' + (selectedFiles.length > 1 ? 's' : ''));
    } catch {
      toast.error('Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id: Id<'files'>): void => {
    const file = files?.find((f: FileWithUrl) => f._id === id);
    toast.error(file ? `Delete "${file.name}"?` : 'Delete file?', {
      action: {
        label: 'Confirm',
        onClick: () => void deleteFile({ id }).then(() => toast.success('File deleted')),
      },
    });
  };

  const actions = (
    <UploadButton isUploading={isUploading} disabled={!currentUser} onFilesSelected={(f) => void handleUpload(f)} />
  );

  if (isLoading) {
    return (
      <PageLayout title="Files" actions={actions}>
        <div className={GRID_CLASSES}>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => <FileCardSkeleton key={i} />)}
        </div>
      </PageLayout>
    );
  }

  if (!files.length) {
    return (
      <PageLayout title="Files" actions={actions}>
        <EmptyState onUpload={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()} />
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Files" actions={actions}>
      <div className={GRID_CLASSES}>
        {files.map((file: FileWithUrl) => <FileCard key={file._id} file={file} onDelete={handleDelete} />)}
      </div>
    </PageLayout>
  );
}
