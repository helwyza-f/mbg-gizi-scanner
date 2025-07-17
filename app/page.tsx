import Link from "next/link"


export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center flex-col text-center px-4 py-10 space-y-6">
      <h1 className="text-4xl font-bold text-green-700">GiziCek</h1>
      <p className="max-w-xl text-gray-700">
        Aplikasi untuk mengevaluasi nilai gizi dari <strong>makan siang program makan bergizi gratis di sekolah</strong>. 
        Cukup unggah foto makanannya, kami bantu analisa kandungan gizinya.
      </p>
      <Link
        href="/upload"
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-lg shadow-md"
      >
        Unggah Foto Makanan
      </Link>
    </main>
  );
}

