'use client'

import * as React from 'react'
import { FileText, Loader2, Upload } from 'lucide-react'

interface FileUploaderProps {
  isLoading: boolean
  loadingLabel: string
  fileName: string | null
  rowCount: number
  onFileSelect: (file: File) => void
}

export function FileUploader({
  isLoading,
  loadingLabel,
  fileName,
  rowCount,
  onFileSelect,
}: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  function handleDrop(e: React.DragEvent<HTMLButtonElement>) {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) onFileSelect(file)
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        disabled={isLoading}
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex w-72 items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-4 text-sm font-medium transition-colors ${
          isDragOver
            ? 'text-foreground border-[#FFD600] bg-[#FFD600]/5'
            : 'border-border bg-card text-muted-foreground hover:border-muted-foreground/30'
        } ${isLoading ? 'cursor-wait opacity-70' : ''}`}
      >
        {isLoading ? (
          <>
            {loadingLabel}
            <Loader2 className="h-4 w-4 animate-spin" />
          </>
        ) : fileName ? (
          <>
            <FileText className="h-4 w-4 shrink-0 text-emerald-600" />
            <span className="text-foreground max-w-[180px] truncate">{fileName}</span>
            <Upload className="h-4 w-4 shrink-0" />
          </>
        ) : (
          <>
            Upload file
            <Upload className="h-4 w-4" />
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFileSelect(file)
          // Allow re-selecting the same file
          e.target.value = ''
        }}
      />
      {fileName && !isLoading && (
        <span className="text-muted-foreground text-xs">
          {rowCount.toLocaleString()} rows loaded
        </span>
      )}
    </div>
  )
}
