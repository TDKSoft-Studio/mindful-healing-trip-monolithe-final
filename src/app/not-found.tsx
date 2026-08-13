import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <h1 className="font-heading text-brand-brown text-3xl font-semibold">
        Page introuvable
      </h1>
      <p className="text-brand-brown/80 max-w-md">
        La page que vous cherchez n&apos;existe pas ou plus.
      </p>
      <Link
        href="/"
        className="text-brand-ocean underline underline-offset-4 hover:no-underline"
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
