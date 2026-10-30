import { Check, Copy } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { toast } from 'sonner'
import type { JsonValue } from '../types/api'

const TOKEN = /("(?:\\.|[^\\"])*"(\s*:)?|\b(?:true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g

function highlight(json: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let last = 0
  let key = 0
  for (const match of json.matchAll(TOKEN)) {
    const index = match.index ?? 0
    if (index > last) nodes.push(json.slice(last, index))
    const token = match[0]
    let className = 'text-warning'
    if (token.startsWith('"')) className = match[2] ? 'text-accent' : 'text-success'
    else if (token === 'true' || token === 'false' || token === 'null') className = 'text-muted italic'
    nodes.push(
      <span key={key++} className={className}>
        {token}
      </span>,
    )
    last = index + token.length
  }
  if (last < json.length) nodes.push(json.slice(last))
  return nodes
}

interface Props {
  value: JsonValue
  label: string
}

/** Pretty-printed, syntax-highlighted JSON with a copy button. */
export function JsonViewer({ value, label }: Props) {
  const [copied, setCopied] = useState(false)
  const text = JSON.stringify(value, null, 2)

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('JSON copiado al portapapeles')
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error('No se pudo copiar', { description: 'Tu navegador bloqueó el acceso al portapapeles.' })
    }
  }

  return (
    <div className="relative rounded-md border border-line bg-bg">
      <button
        type="button"
        onClick={copy}
        aria-label={`Copiar ${label}`}
        className="absolute right-2 top-2 inline-flex items-center gap-1.5 rounded-sm border border-line bg-surface px-2 py-1 text-xs font-medium text-muted transition hover:text-fg active:scale-95"
      >
        {copied ? <Check className="size-3.5 text-success" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
        {copied ? 'Copiado' : 'Copiar'}
      </button>
      <pre className="max-h-72 overflow-auto p-3 pr-24 font-mono text-xs leading-relaxed">
        <code>{highlight(text)}</code>
      </pre>
    </div>
  )
}
