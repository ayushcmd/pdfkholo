import { useMemo, useState } from 'react'
import { FileText, Download, Trash2, Cloud } from 'lucide-react'
import ToolShell from '../../components/layout/ToolShell'
import FileDropzone from '../../components/ui/FileDropzone'
import { Alert, Spinner, SectionLabel } from '../../components/ui/index'
import { checkFileSize, formatBytes } from '../../lib/fileGuard'

type CloudConvertTask = {
  id: string
  name: string
  status: string
  result?: {
    form?: {
      url: string
      parameters: Record<string, string>
    }
    files?: Array<{ url: string }>
  }
  message?: string
  code?: string
}

type CloudConvertJob = {
  id: string
  status: string
  tasks: CloudConvertTask[]
}

export default function DocxToPdf() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState('')
  const [pdfUrl, setPdfUrl] = useState('')

  const apiKey = import.meta.env.VITE_CLOUDCONVERT_API_KEY as string

  const accept = useMemo(
    () => '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    []
  )

  const onDrop = (files: File[]) => {
    const f = files?.[0]
    if (!f) return

    const err = checkFileSize(f)
    if (err) {
      setError(err)
      return
    }

    const isDocx =
      f.name.toLowerCase().endsWith('.docx') ||
      f.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

    if (!isDocx) {
      setError('Please upload a valid .docx file.')
      return
    }

    setFile(f)
    setError('')
    setDone('')
    setPdfUrl('')
  }

  const clearFile = () => {
    setFile(null)
    setError('')
    setDone('')
    setPdfUrl('')
  }

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

  const waitForJob = async (jobId: string): Promise<CloudConvertJob> => {
    for (let i = 0; i < 45; i++) {
      const res = await fetch(`https://api.cloudconvert.com/v2/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${apiKey}` },
      })

      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || 'Failed to poll conversion job.')
      }

      const data = await res.json()
      const job: CloudConvertJob = data?.data

      if (job?.status === 'finished') return job

      if (job?.status === 'error') {
        const failedTask = job.tasks?.find((t) => t.status === 'error')
        throw new Error(
          failedTask?.message ||
            failedTask?.code ||
            'CloudConvert job failed.'
        )
      }

      await sleep(1500)
    }

    throw new Error('Conversion timed out. Please try again.')
  }

  const convert = async () => {
    if (!file) return

    if (!apiKey) {
      setError('Missing VITE_CLOUDCONVERT_API_KEY in .env')
      return
    }

    setLoading(true)
    setError('')
    setDone('')
    setPdfUrl('')

    try {
      // 1) Create job
      const createRes = await fetch('https://api.cloudconvert.com/v2/jobs', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tasks: {
            'import-my-file': {
              operation: 'import/upload',
            },
            'convert-my-file': {
              operation: 'convert',
              input: 'import-my-file',
              input_format: 'docx',
              output_format: 'pdf',
              optimize_print: true,
            },
            'export-my-file': {
              operation: 'export/url',
              input: 'convert-my-file',
              inline: false,
              archive_multiple_files: false,
            },
          },
          tag: 'docx-to-pdf',
        }),
      })

      if (!createRes.ok) {
        const txt = await createRes.text()
        throw new Error(txt || 'Failed to create conversion job.')
      }

      const created = await createRes.json()
      const job: CloudConvertJob = created?.data
      const importTask = job?.tasks?.find((t) => t.name === 'import-my-file')
      const uploadForm = importTask?.result?.form

      if (!uploadForm?.url) {
        throw new Error('Upload URL missing from CloudConvert response.')
      }

      // 2) Upload file
      const fd = new FormData()
      Object.entries(uploadForm.parameters || {}).forEach(([k, v]) => {
        fd.append(k, String(v))
      })
      fd.append('file', file)

      const uploadRes = await fetch(uploadForm.url, {
        method: 'POST',
        body: fd,
      })

      if (!uploadRes.ok) {
        const txt = await uploadRes.text()
        throw new Error(txt || 'File upload failed.')
      }

      // 3) Poll job status
      const finishedJob = await waitForJob(job.id)
      const exportTask = finishedJob.tasks?.find((t) => t.name === 'export-my-file')
      const url = exportTask?.result?.files?.[0]?.url

      if (!url) {
        throw new Error('PDF URL not found after conversion.')
      }

      setPdfUrl(url)
      setDone('Conversion complete. Click Download PDF.')
    } catch (e: any) {
      setError(e?.message || 'Conversion failed.')
    } finally {
      setLoading(false)
    }
  }

  const downloadPdf = () => {
    if (!pdfUrl) return
    window.open(pdfUrl, '_blank', 'noopener,noreferrer')
  }

  const options = (
    <div className="flex flex-col gap-4">
      <SectionLabel>How it works</SectionLabel>
      <div
        className="rounded-xl p-3 text-xs leading-relaxed"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          color: 'var(--text-2)',
          fontFamily: 'Dosis, sans-serif',
        }}
      >
        Upload DOCX → CloudConvert converts → Download final PDF.
      </div>
    </div>
  )

  return (
    <ToolShell
      title="DOCX to PDF"
      subtitle="Accurate conversion using CloudConvert"
      slug="docx-to-pdf"
      options={options}
    >
      <div className="flex flex-col gap-4">
        <FileDropzone
          onFiles={onDrop}
          accept={accept}
          multiple={false}
          label="Drop your .docx file here"
          helperText="Only .docx files are supported"
        />

        {file && (
          <div
            className="rounded-2xl p-3 flex items-center gap-3"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: 'rgba(245,158,11,0.12)', color: 'var(--accent)' }}
            >
              <FileText size={18} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: 'var(--text)', fontFamily: 'Dosis, sans-serif' }}>
                {file.name}
              </p>
              <p className="text-xs font-mono" style={{ color: 'var(--text-3)' }}>
                {formatBytes(file.size)}
              </p>
            </div>

            <button
              onClick={clearFile}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
              style={{ color: 'var(--text-3)', background: 'transparent' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#FBBF24')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-3)')}
              aria-label="Remove file"
              title="Remove file"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}

        <button
          onClick={convert}
          disabled={!file || loading}
          className="btn-primary flex items-center justify-center gap-2 px-4 py-2.5 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Spinner size={14} /> : <Cloud size={14} />}
          {loading ? 'Converting...' : 'Convert to PDF'}
        </button>

        <button
          onClick={downloadPdf}
          disabled={!pdfUrl || loading}
          className="btn-secondary flex items-center justify-center gap-2 px-4 py-2.5 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={14} />
          Download PDF
        </button>

        {!!error && <Alert kind="error" text={error} />}
        {!!done && <Alert kind="success" text={done} />}
      </div>
    </ToolShell>
  )
}