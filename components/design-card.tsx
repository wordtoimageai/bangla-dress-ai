import Link from "next/link";

type Design = {
  id: string;
  title: string;
  images: string[];
  fabric: string;
  price_bdt: number;
  occasion?: string;
  color_palette?: string[];
};

export default function DesignCard({ design }: { design: Design }) {
Add components/design-card.tsx  return (
    <Link
      href={`/product/${design.id}`}
      className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition"
    >
      <div className="aspect-[3/4] bg-slate-100">
        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={design.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}
      </div>
      <div className="p-2">
        <h3 className="text-sm font-semibold line-clamp-2">{design.title}</h3>
        <p className="text-xs text-slate-500 mt-1">
          {design.fabric} • {design.occasion ?? "Daily"}
        </p>
        <p className="text-sm font-bold text-red-700 mt-1">
          ৳ {design.price_bdt}
        </p>
      </div>
    </Link>
  );
}
