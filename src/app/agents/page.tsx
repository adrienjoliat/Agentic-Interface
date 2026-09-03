import { BasketballCourt, type CourtAgent } from "@/components/basketball-court";
import { PageHeader } from "@/components/ui";

const roster: CourtAgent[] = [
  {
    player: "curry",
    name: "Stephen Curry",
    number: "30",
    role: "Orchestrator",
    status: "online",
    model: "GPT-5.6 Sol",
    load: 72,
    missions: 12,
    active: true,
    heightCm: 188,
    frames: {
      active: [
        "/assets/players/curry/1.png",
        "/assets/players/curry/2.png",
        "/assets/players/curry/3.png",
        "/assets/players/curry/4.png",
      ],
      bench: "/assets/players/curry/bench.png",
    },
  },
  {
    player: "jordan",
    name: "Michael Jordan",
    number: "23",
    role: "Research",
    status: "online",
    model: "GPT-5.6 Sol",
    load: 48,
    missions: 8,
    active: true,
    heightCm: 198,
    frames: {
      active: [
        "/assets/players/jordan/1.png",
        "/assets/players/jordan/2.png",
        "/assets/players/jordan/3.png",
        "/assets/players/jordan/4.png",
      ],
      bench: "/assets/players/jordan/bench.png",
    },
  },
  {
    player: "kobe",
    name: "Kobe Bryant",
    number: "24",
    role: "Builder",
    status: "busy",
    model: "GPT-5.6 Terra",
    load: 86,
    missions: 17,
    active: true,
    heightCm: 198,
    frames: {
      active: [
        "/assets/players/kobe/1.png",
        "/assets/players/kobe/2.png",
        "/assets/players/kobe/3.png",
        "/assets/players/kobe/4.png",
      ],
      bench: "/assets/players/kobe/bench.png",
    },
  },
  {
    player: "lebron",
    name: "LeBron James",
    number: "6",
    role: "QA & Review",
    status: "online",
    model: "GPT-5.6 Sol",
    load: 64,
    missions: 5,
    active: false,
    heightCm: 206,
    frames: {
      active: [
        "/assets/players/lebron/1.png",
        "/assets/players/lebron/2.png",
        "/assets/players/lebron/3.png",
        "/assets/players/lebron/4.png",
      ],
      bench: "/assets/players/lebron/bench.png",
    },
  },
];

export default function AgentsPage() {
  return (
    <>
      <PageHeader
        eyebrow="ROSTER / 004"
        title="Agent roster"
        description="Active agents take the court. Inactive agents sit on the bench."
        action="+ Draft agent"
      />

      <BasketballCourt agents={roster} />
    </>
  );
}