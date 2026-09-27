import Link from "next/link";

export function Nav() {
  return <header className="border-b border-slate-200 bg-white"><nav className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-4"><Link href="/" className="mr-auto text-lg font-bold tracking-tight text-slate-900">ResumeFit</Link><Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-950">Home</Link><Link href="/history" className="text-sm font-medium text-slate-600 hover:text-slate-950">History</Link><Link href="/reliability" className="text-sm font-medium text-slate-600 hover:text-slate-950">Reliability Check</Link></nav></header>;
}
