import { Container } from "@/components/ui/Container";

export default function Loading() {
  return (
    <Container className="min-h-[50vh] py-16 sm:py-24">
      <p role="status" className="font-technical text-technical-label uppercase tracking-[0.1em] text-foreground-muted">
        Loading page…
      </p>
    </Container>
  );
}
