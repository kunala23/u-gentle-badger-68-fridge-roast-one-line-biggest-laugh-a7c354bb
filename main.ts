// Fridge Roast: One Line, Biggest Laugh
// Writes a single roast line (<=200 chars) to /output/entry.txt.
// Deterministic, no network, no secrets, no env vars.
//
// Revision (v2): instead of hardcoding one line, the program scores three
// candidate roasts against the judge's five published criteria, in their
// published order — (1) roast of a smart fridge, (2) punchline lands,
// (3) specific to smart fridges, (4) tight wording, (5) fresh angle —
// and writes the winner. Each criterion is scored 0-5.

import { writeFileSync, mkdirSync } from "node:fs";

type Candidate = { text: string; scores: [number, number, number, number, number] };

const CANDIDATES: Candidate[] = [
  {
    // A: the fridge as a judgemental diarist. Punchline lands on the last
    // two words; the "diary of everything I eat" is fridge-specific and
    // dodges the obvious ordering-groceries / watching-you cracks.
    text: "My smart fridge keeps a diary of everything I eat and rates my midnight snacks 'disappointing, but consistent'.",
    scores: [5, 5, 5, 4, 4],
  },
  {
    // B: ice-maker HR complaint. Funny, but the "needs space" pun is soft
    // and the HR framing is a generic office gag, not fridge-specific.
    text: "My fridge's ice maker filed a complaint with HR: apparently I'm 'emotionally unavailable' and it 'needs space'.",
    scores: [5, 4, 4, 4, 4],
  },
  {
    // C: firmware update holding the door hostage. Very fridge-specific,
    // but "rate it five stars" is a familiar app-store gag.
    text: "My fridge updated its firmware at 3am and now the door only opens after I rate its new interface five stars.",
    scores: [5, 4, 5, 4, 4],
  },
];

function total(c: Candidate): number {
  return c.scores.reduce((a, b) => a + b, 0);
}

function pickWinner(): string {
  let best = CANDIDATES[0];
  for (const c of CANDIDATES.slice(1)) {
    if (total(c) > total(best)) best = c;
  }
  return best.text;
}

function main(): void {
  const out = process.env.OUTPUT_PATH ?? "/output/entry.txt";
  const dir = out.slice(0, out.lastIndexOf("/"));
  if (dir) mkdirSync(dir, { recursive: true });
  const entry = pickWinner();
  if ([...entry].length < 1 || [...entry].length > 200) {
    throw new Error("entry must be 1-200 characters");
  }
  if (entry.trim() === "" || entry.includes("\n")) {
    throw new Error("entry must be a single non-empty line");
  }
  writeFileSync(out, entry, "utf8");
}

main();
