import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      {/* Hero */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-red-700 mb-4">
          বাংলাদেশি থ্রি পিস ড্রেস AI
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          AI দিয়ে আপনার স্বপ্নের ড্রেস ডিজাইন করুন। মাপ দিন, ছবি দেখুন, অর্ডার করুন।
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/showcase"
            className="bg-red-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition"
          >
            ডিজাইন দেখুন
          </Link>
          <Link
            href="/generator"
            className="border-2 border-red-600 text-red-600 px-8 py-3 rounded-full font-semibold hover:bg-red-50 transition"
          >
            AI দিয়ে তৈরি করুন
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: "👗", title: "১০০+ ডিজাইন", desc: "বাংলাদেশি সেরা ডিজাইনারদের কালেকশন" },
          { icon: "🤖", title: "AI Try-On", desc: "আপনার ছবিতে ড্রেস পরে দেখুন" },
          { icon: "📦", title: "সহজ অর্ডার", desc: "bKash / SSLCommerz দিয়ে পেমেন্ট" },
        ].map((f) => (
          <div key={f.title} className="bg-white rounded-2xl shadow p-6 text-center">
            <div className="text-5xl mb-3">{f.icon}</div>
            <h3 className="text-xl font-bold mb-2">{f.title}</h3>
            <p className="text-gray-500">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
