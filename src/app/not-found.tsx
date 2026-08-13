import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex flex-1 items-center justify-center py-24"
    >
      <Container className="flex flex-col items-center gap-4 text-center">
        <h1 className="font-heading text-foreground text-3xl font-semibold">
          Page introuvable
        </h1>
        <p className="text-muted-foreground max-w-md">
          La page que vous cherchez n&apos;existe pas ou plus.
        </p>
        <Button href="/">Retour à l&apos;accueil</Button>
      </Container>
    </main>
  );
}
