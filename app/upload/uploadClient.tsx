'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Camera, ImagePlus, Loader2, Utensils } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function UploadPage() {
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [description, setDescription] = useState('')
  const router = useRouter()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0]
    if (selected) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selected)
      setFile(selected)
    }
  }

  const handleAnalyze = async () => {
    if (!file ) return
    setLoading(true)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('description', description)

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Gagal menganalisis')

      console.log('Hasil:', data.result)
        toast.success('Analisis berhasil!')
      // Redirect ke halaman histori
      router.push('/history')
    } catch (error: any) {
      alert(error.message || 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-md mx-auto px-4 py-5 space-y-4">
      <label className="relative w-full flex items-center justify-center border border-dashed border-gray-400 rounded-xl cursor-pointer hover:border-blue-400 transition-colors aspect-square overflow-hidden">

        {preview ? (
          <Image
  src={preview}
  alt="Preview"
  fill
  className="object-cover"
/>

        ) : (
          <>
            <ImagePlus size={40} strokeWidth={1.5} className="text-gray-400 mb-2 hidden md:block" />
            <Camera size={40} strokeWidth={1.5} className="text-gray-400 md:hidden" />
            <span className="mt-2 text-sm text-gray-400 text-center">
              Ketuk untuk ambil foto atau unggah makanan
            </span>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
        
      <input
        type="text"
        placeholder="Contoh: nasi, tempe, bayam rebus, jeruk"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border rounded px-3 py-2 text-sm"
      />
      <span className='text-muted-foreground text-xs'> Optional</span>

      <Button
        onClick={handleAnalyze}
        className="w-full"
        disabled={!preview || loading }
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Menganalisis...
          </>
        ) : (
          <>
            <Utensils className="mr-2 h-4 w-4" />
            Analisa Gizi
          </>
        )}
      </Button>
    </main>
  )
}
