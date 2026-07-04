import Image from "next/image";
import Container from "@/components/ui/Container";
import Eyebrow from "@/components/ui/Eyebrow";

export default function PageHero({
  eyebrow,
  title,
  description,
  image,
}: {
  eyebrow: string;
  title: string;
  description: string;
  image?: string;
}) {
  return (
    <div className="relative overflow-hidden border-b border-white/10 bg-ink py-24 md:py-32">
      {image && (
        <>
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-35"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40"
            aria-hidden
          />
        </>
      )}
      <div className="bg-grid absolute inset-0 opacity-30" aria-hidden />
      <Container className="relative">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-6 max-w-2xl text-balance font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          {title}
        </h1>
        <p className="mt-5 max-w-lg text-white/75">{description}</p>
      </Container>
    </div>
  );
}
