'use client';

import { Trash2, Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { FileTypeIcon } from './file-icon';
import { formatFileSize, isPreviewable } from './file-utils';

import type { FileWithUrl } from './file-utils';
import type { Id } from '@convex/_generated/dataModel';

interface FileCardProps {
  readonly file: FileWithUrl;
  readonly onDelete: (id: Id<'files'>) => void;
}

export function FileCard({ file, onDelete }: FileCardProps): React.ReactElement {
  const showPreview = isPreviewable(file.mimeType) && file.url;

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      {/* Preview area - fixed height, no scroll */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {showPreview && file.mimeType.startsWith('image/') ? (
          <img
            src={file.url ?? ''}
            alt={file.name}
            className="size-full object-cover"
          />
        ) : showPreview && file.mimeType === 'application/pdf' ? (
          <iframe
            src={`${file.url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            title={file.name}
            className="size-full pointer-events-none"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <FileTypeIcon mimeType={file.mimeType} />
          </div>
        )}
      </div>

      {/* File info + actions */}
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium" title={file.name}>
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)} • {new Date(file.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Actions - always visible */}
          <div className="flex shrink-0 gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="size-7" asChild>
                  <a href={file.url ?? '#'} download={file.name} target="_blank" rel="noopener noreferrer">
                    <Download className="size-3.5" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-7 text-destructive hover:text-destructive"
                  onClick={() => onDelete(file._id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
