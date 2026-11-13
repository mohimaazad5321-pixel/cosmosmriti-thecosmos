import type { Planet } from "./types";

/** Optional hidden discoveries scattered in the worlds. General, well-established facts. */
export interface HiddenMemory {
  id: string;
  planet: Planet;
  title: string;
  text: string;
  /** world-space position on the illustrative terrain */
  pos: [number, number];
}

export const hiddenMemories: HiddenMemory[] = [
  { id: "moon-earth-fixed", planet: "moon", title: "Earth stands still", pos: [-40, -30], text: "The Moon always shows the same face to Earth. Seen from the near side, Earth hangs in almost the same spot in the sky while it goes through phases." },
  { id: "moon-dust", planet: "moon", title: "Sticky moondust", pos: [55, 30], text: "Lunar soil, called regolith, is made of sharp, jagged grains. Apollo astronauts found it clung to suits and equipment." },
  { id: "moon-receding", planet: "moon", title: "The drifting Moon", pos: [10, 52], text: "Laser measurements using mirrors left by Apollo show the Moon is moving away from Earth by about 3.8 cm each year." },
  { id: "mars-sol", planet: "mars", title: "A longer day", pos: [-50, -15], text: "A day on Mars, called a sol, lasts about 24 hours and 39 minutes." },
  { id: "mars-gravity", planet: "mars", title: "Lighter steps", pos: [40, -30], text: "Gravity on Mars is about 38% of Earth's. A child who weighs 30 kg on Earth would feel like about 11 kg there." },
  { id: "mars-blue-sunset", planet: "mars", title: "Blue sunsets", pos: [12, 50], text: "Rovers have photographed Martian sunsets that look bluish around the Sun, because fine dust scatters blue light forward." },
];

export interface EraEvent {
  year: number;
  date: string;
  planet: Planet;
  title: string;
  text: string;
  artifactId?: string;
}

/** Mission Time Machine: milestones of Moon & Mars exploration. */
export const eraEvents: EraEvent[] = [
  { year: 1959, date: "Sep 1959", planet: "moon", title: "Luna 2 reaches the Moon", text: "The Soviet probe becomes the first human-made object to reach the Moon's surface, by impact." },
  { year: 1959, date: "Oct 1959", planet: "moon", title: "First look at the far side", text: "Luna 3 returns the first photographs of the Moon's far side." },
  { year: 1965, date: "Jul 1965", planet: "mars", title: "Mariner 4 flies past Mars", text: "The first successful Mars flyby returns the first close-up images of another planet, showing a cratered surface." },
  { year: 1966, date: "Feb 1966", planet: "moon", title: "First soft landing", text: "Luna 9 makes the first soft landing on the Moon and sends back images from the surface." },
  { year: 1969, date: "Jul 1969", planet: "moon", title: "Apollo 11 lands", text: "Humans walk on the Moon for the first time.", artifactId: "apollo-11-eagle" },
  { year: 1969, date: "Nov 1969", planet: "moon", title: "Apollo 12 sets up ALSEP", text: "A long-running lunar science station begins operating.", artifactId: "apollo-12-alsep" },
  { year: 1970, date: "Nov 1970", planet: "moon", title: "Lunokhod 1", text: "The Soviet Union lands the first remote-controlled robotic rover on the Moon." },
  { year: 1971, date: "Feb 1971", planet: "moon", title: "Apollo 14 at Fra Mauro", text: "A second ALSEP joins the lunar network.", artifactId: "apollo-14-alsep" },
  { year: 1971, date: "Jul 1971", planet: "moon", title: "First lunar rover drive", text: "Apollo 15's Lunar Roving Vehicle extends human exploration.", artifactId: "apollo-15-lrv" },
  { year: 1971, date: "Nov 1971", planet: "mars", title: "Mariner 9 orbits Mars", text: "The first spacecraft to orbit another planet maps Mars after a global dust storm clears." },
  { year: 1972, date: "Dec 1972", planet: "moon", title: "Apollo 17, the last landing", text: "The final Apollo crew leaves Challenger's descent stage behind.", artifactId: "apollo-17-challenger" },
  { year: 1976, date: "Jul 1976", planet: "mars", title: "Viking 1 lands", text: "NASA's first successful long-duration Mars lander begins sending images and data." },
  { year: 1997, date: "Jul 1997", planet: "mars", title: "Pathfinder bounces in", text: "An airbag landing in Ares Vallis.", artifactId: "mars-pathfinder" },
  { year: 1997, date: "Jul 1997", planet: "mars", title: "Sojourner rolls out", text: "The first wheeled vehicle on another planet.", artifactId: "sojourner" },
  { year: 2004, date: "Jan 2004", planet: "mars", title: "Spirit lands in Gusev", text: "The first of the twin Mars Exploration Rovers.", artifactId: "spirit" },
  { year: 2004, date: "Jan 2004", planet: "mars", title: "Opportunity lands at Meridiani", text: "The twin begins a nearly 15-year journey.", artifactId: "opportunity" },
  { year: 2008, date: "May 2008", planet: "mars", title: "Phoenix in the arctic", text: "A lander digs into Martian ice.", artifactId: "phoenix" },
  { year: 2009, date: "Jun 2009", planet: "moon", title: "Lunar Reconnaissance Orbiter", text: "LRO launches and later photographs the Apollo landing sites from orbit." },
  { year: 2012, date: "Aug 2012", planet: "mars", title: "Curiosity lands", text: "A car-sized rover begins exploring Gale crater." },
  { year: 2021, date: "Feb 2021", planet: "mars", title: "Perseverance & Ingenuity", text: "Perseverance lands in Jezero crater; in April, the Ingenuity helicopter makes the first powered flight on another planet." },
];

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  artifactId?: string;
}

export const quiz: QuizQuestion[] = [
  { id: "q1", question: "Which part of Apollo 11's lunar module stayed on the Moon?", options: ["The ascent stage", "The descent stage", "The command module", "Nothing stayed"], answer: 1, explanation: "The descent stage stayed behind and acted as the launch pad for the ascent stage.", artifactId: "apollo-11-eagle" },
  { id: "q2", question: "What is an ALSEP?", options: ["A single robot", "A rover", "A collection of science instruments", "A rocket engine"], answer: 2, explanation: "ALSEP was a package of several instruments connected to a central station.", artifactId: "apollo-12-alsep" },
  { id: "q3", question: "Why did the Apollo rover use woven wire wheels?", options: ["They looked cool", "Air-filled rubber tyres can't work well on the airless, extreme-temperature Moon", "They were cheaper", "To dig holes"], answer: 1, explanation: "With no air and extreme temperatures, a woven metal tyre was a better choice.", artifactId: "apollo-15-lrv" },
  { id: "q4", question: "How did Mars Pathfinder land?", options: ["On skis", "Bouncing on airbags", "Hanging from a crane", "On wheels"], answer: 1, explanation: "Pathfinder bounced about 15 times inside airbags before rolling to a stop.", artifactId: "mars-pathfinder" },
  { id: "q5", question: "How did Sojourner send data to Earth?", options: ["Directly by radio", "Through the Pathfinder lander", "By laser", "It stored it to bring home"], answer: 1, explanation: "Sojourner relayed everything through the lander.", artifactId: "sojourner" },
  { id: "q6", question: "What did Spirit's broken wheel uncover?", options: ["A fossil", "Silica-rich soil", "Gold", "A meteorite"], answer: 1, explanation: "Dragging the wheel exposed nearly pure silica, a clue to past hot water.", artifactId: "spirit" },
  { id: "q7", question: "Opportunity was designed for about 90 Martian days. How long did it work?", options: ["90 days", "1 year", "About 5 years", "Nearly 15 years"], answer: 3, explanation: "It landed in 2004 and last communicated in June 2018.", artifactId: "opportunity" },
  { id: "q8", question: "Did Opportunity send the message 'My battery is low and it's getting dark'?", options: ["Yes, those exact words", "No, it was a journalist's paraphrase"], answer: 1, explanation: "Rovers send engineering data, not sentences. The line was a poetic summary.", artifactId: "opportunity" },
  { id: "q9", question: "What did Phoenix find in its trench?", options: ["Water ice", "Liquid lakes", "Plants", "Lava"], answer: 0, explanation: "Bright chunks vanished over four days, showing they were water ice sublimating.", artifactId: "phoenix" },
  { id: "q10", question: "Which mission made the last crewed Moon landing of the 20th century?", options: ["Apollo 11", "Apollo 14", "Apollo 15", "Apollo 17"], answer: 3, explanation: "Apollo 17 landed in December 1972.", artifactId: "apollo-17-challenger" },
];

export interface DetectiveCase {
  id: string;
  title: string;
  clues: string[];
  options: string[]; // artifact ids
  answer: string;
  explanation: string;
}

export const detectiveCases: DetectiveCase[] = [
  { id: "d1", title: "The shape with four legs", clues: ["I have four legs and a rocket engine pointing down.", "My upper half flew away and left me behind.", "A plaque on my leg mentions 'peace'.", "I landed first."], options: ["apollo-11-eagle", "phoenix", "mars-pathfinder", "apollo-15-lrv"], answer: "apollo-11-eagle", explanation: "Eagle's descent stage: four legs, descent engine, and the famous plaque." },
  { id: "d2", title: "Many parts, one job", clues: ["I'm not one object. I'm a team.", "One of my members feels the ground shake.", "I was powered by heat from plutonium.", "I listened to the Moon until 1977, starting in 1969."], options: ["apollo-14-alsep", "apollo-12-alsep", "spirit", "sojourner"], answer: "apollo-12-alsep", explanation: "Apollo 12's ALSEP was deployed in November 1969, the earlier of the two featured stations." },
  { id: "d3", title: "The car with no roof", clues: ["I folded up to travel.", "My wheels are made of woven metal.", "My camera filmed a liftoff, steered from Earth.", "My first drive was in 1971."], options: ["opportunity", "apollo-15-lrv", "sojourner", "apollo-17-challenger"], answer: "apollo-15-lrv", explanation: "The Apollo 15 Lunar Roving Vehicle, the first car on the Moon." },
  { id: "d4", title: "The marathon runner", clues: ["I was designed to work for 90 sols.", "I found tiny round 'blueberries'.", "I drove more than 45 km.", "A dust storm silenced me in 2018."], options: ["spirit", "opportunity", "phoenix", "mars-pathfinder"], answer: "opportunity", explanation: "Opportunity drove beyond marathon distance before the 2018 dust storm." },
  { id: "d5", title: "The arctic digger", clues: ["I never moved after landing.", "I had a long arm with a scoop.", "Something I uncovered vanished in four days.", "I saw snow falling from clouds."], options: ["phoenix", "sojourner", "apollo-17-challenger", "spirit"], answer: "phoenix", explanation: "Phoenix dug up water ice near Mars's north pole." },
];
