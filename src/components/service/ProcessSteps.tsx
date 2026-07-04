import Container from "@/components/ui/Container";

export type Step = { title: string; description: string };

export default function ProcessSteps({
  title,
  steps,
}: {
  title: string;
  steps: Step[];
}) {
  return (
    <section className="border-b border-white/10 bg-ink py-20 md:py-24">
      <Container>
        <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2">
          {steps.map((step, i) => (
            <div key={step.title} className="flex gap-5">
              <span className="font-data text-2xl font-medium text-signal">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
