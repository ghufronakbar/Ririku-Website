import { worksWith } from "@/content/site";

function Row() {
  return (
    <ul className="flex shrink-0 items-center">
      {worksWith.items.map((item) => (
        <li key={item} className="flex items-center">
          <span className="display px-6 text-[clamp(2rem,4.2vw,3.75rem)] whitespace-nowrap text-paper/85 transition-colors duration-300 hover:text-coral md:px-10">
            {item}
          </span>
          <span aria-hidden className="flex h-5 items-center gap-[3px] text-coral/70">
            <span className="h-2/5 w-[3px] rounded-full bg-current" />
            <span className="h-full w-[3px] rounded-full bg-current" />
            <span className="h-3/5 w-[3px] rounded-full bg-current" />
          </span>
        </li>
      ))}
    </ul>
  );
}

/** The players, sources and browsers Ririku works with, on an endless loop. */
export function WorksWith() {
  return (
    <section aria-label={worksWith.label} className="border-y border-paper/10 py-8 md:py-10">
      <div className="flex flex-col gap-5 md:flex-row md:items-center">
        <p className="kicker shrink-0 px-5 md:w-56 md:px-10">{worksWith.label}</p>
        <div className="mask-fade-x group flex min-w-0 flex-1 overflow-hidden">
          <div className="flex animate-marquee [--marquee-duration:45s] group-hover:[animation-play-state:paused]">
            <Row />
            <div aria-hidden className="flex">
              <Row />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
