'use client';

import { type ChangeEvent, type DragEvent, useCallback, useRef, useState } from 'react';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import { alpha, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { FileCheck, FileText, Upload, X } from 'lucide-react';

import {
  COI_ACCEPTED_FILE_TYPES,
  COI_MAX_FILE_SIZE_BYTES,
  COI_MAX_FILE_SIZE_MB,
} from '../types/coi.types';

interface COIFileUploadProps {
  readonly onFileSelect: (file: File) => void;
  readonly isUploading: boolean;
  readonly uploadProgress?: number;
}

const ACCEPTED_EXTENSIONS = Object.values(COI_ACCEPTED_FILE_TYPES).flat().join(', ');
const ACCEPTED_MIME_TYPES = Object.keys(COI_ACCEPTED_FILE_TYPES);

function getBorderColor(isDragOver: boolean, error: string | null): string {
  if (isDragOver) {
    return 'primary.main';
  }
  if (error) {
    return 'error.main';
  }
  return 'divider';
}

function getFileIcon() {
  return <FileText size={28} />;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function COIFileUpload({ onFileSelect, isUploading, uploadProgress }: COIFileUploadProps) {
  const theme = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateFile = useCallback((file: File): string | null => {
    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      return `Invalid file type "${file.type}". Only PDF files are accepted.`;
    }
    if (file.size > COI_MAX_FILE_SIZE_BYTES) {
      return `File size (${formatFileSize(file.size)}) exceeds the ${COI_MAX_FILE_SIZE_MB}MB limit.`;
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    },
    [validateFile],
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        handleFile(droppedFile);
      }
    },
    [handleFile],
  );

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
      // Reset input so re-selecting same file triggers change
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [handleFile],
  );

  const handleRemoveFile = useCallback(() => {
    setSelectedFile(null);
    setError(null);
  }, []);

  const handleUpload = useCallback(() => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  }, [selectedFile, onFileSelect]);

  const handleBrowseClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
          Upload Certificate
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
          Upload an ACORD Certificate of Insurance (PDF) for automated verification.
        </Typography>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          onChange={handleInputChange}
          style={{ display: 'none' }}
          aria-label="Upload certificate file"
        />

        {/* Drop zone */}
        <Box
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={!selectedFile ? handleBrowseClick : undefined}
          sx={{
            border: '2px dashed',
            borderColor: getBorderColor(isDragOver, error),
            borderRadius: 2,
            p: { xs: 3, sm: 4 },
            textAlign: 'center',
            cursor: selectedFile ? 'default' : 'pointer',
            bgcolor: isDragOver ? alpha(theme.palette.primary.main, 0.04) : 'transparent',
            transition: 'all 0.2s ease',
            '&:hover': !selectedFile
              ? {
                  borderColor: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                }
              : {},
          }}
        >
          {!selectedFile ? (
            <>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 2,
                  color: 'primary.main',
                }}
              >
                <Upload size={24} />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                Drag & drop your certificate here
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                or click to browse files
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Chip label="PDF" size="small" variant="outlined" />
                <Chip label={`Max ${COI_MAX_FILE_SIZE_MB}MB`} size="small" variant="outlined" />
              </Box>
            </>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'center' }}>
              <Box sx={{ color: 'primary.main' }}>{getFileIcon()}</Box>
              <Box sx={{ textAlign: 'left', minWidth: 0 }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {selectedFile.name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {formatFileSize(selectedFile.size)}
                </Typography>
              </Box>
              {!isUploading && (
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  aria-label="Remove file"
                  sx={{ color: 'text.secondary' }}
                >
                  <X size={18} />
                </IconButton>
              )}
            </Box>
          )}
        </Box>

        {/* Error */}
        {error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : null}

        {/* Upload progress */}
        {isUploading ? (
          <Box sx={{ mt: 2 }}>
            <LinearProgress
              variant={uploadProgress !== undefined ? 'determinate' : 'indeterminate'}
              value={uploadProgress}
              sx={{
                borderRadius: 1,
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' },
              }}
            />
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}
            >
              Uploading and verifying certificate…
            </Typography>
          </Box>
        ) : null}

        {/* Submit button */}
        <Button
          variant="contained"
          fullWidth
          disabled={!selectedFile || isUploading}
          onClick={handleUpload}
          startIcon={<FileCheck size={18} />}
          sx={{
            mt: 3,
            py: 1.25,
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          {isUploading ? 'Verifying…' : 'Verify Certificate'}
        </Button>
      </CardContent>
    </Card>
  );
}
