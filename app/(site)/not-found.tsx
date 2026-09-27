import Link from "next/link";
import { btn, container } from "@/lib/ui";

export default function NotFound() {
  return (
    <div className={`${container} max-w-xl py-20 text-center`}>
      <p className="font-serif text-6xl font-bold text-orange">404</p>
      <h1 className="mt-3 font-serif text-3xl font-bold">This page has gone walkies</h1>
      <p className="mt-2 text-lg">It might have been adopted. Try one of these instead.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className={btn.primary}>Home</Link>
        <Link href="/adopt" className={btn.secondary}>Meet the animals</Link>
      </div>
    </div>
  );
}
