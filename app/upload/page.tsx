// app/upload/page.tsx
import UploadClient from './uploadClient'

export default function UploadPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📸 Unggah Foto Makan Siang</h1>
      <p className="text-muted-foreground mb-6">
        Unggah foto makanan yang disediakan untuk makan siang hari ini. Sistem akan mengestimasi kandungan gizinya untuk memastikan kecukupan nutrisi siswa.
      </p>
      <UploadClient />
    </div>
  )
}
