import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f5f5f5]">
      <div className="text-center px-4">
        <div className="text-[120px] font-extrabold text-[#f23030] leading-none mb-4">404</div>
        <h1 className="text-2xl font-bold text-[#1e1d1c] mb-3">Сторінку не знайдено</h1>
        <p className="text-[#666] mb-8 max-w-sm mx-auto">
          На жаль, сторінка, яку ви шукаєте, не існує або була переміщена.
        </p>
        <Link href="/">
          <button className="btn-red text-sm font-bold px-8 py-3 cursor-pointer">
            На головну
          </button>
        </Link>
      </div>
    </div>
  );
}
