import type { Artifact } from "./types";
import { nasaImage, src } from "./sources";

const PATHFINDER_SITE = { lat: 19.13, lon: -33.22 };

export const marsArtifacts: Artifact[] = [
  {
    id: "mars-pathfinder",
    number: 6,
    planet: "mars",
    officialName: "Mars Pathfinder Lander (Carl Sagan Memorial Station)",
    shortName: "Pathfinder Lander",
    missionName: "Mars Pathfinder",
    missionYear: 1997,
    category: "Robotic lander",
    coordinates: PATHFINDER_SITE,
    coordinateSystem: "Areocentric degrees, east-positive longitude (33.22° W shown as −33.22°)",
    coordinateAccuracy: "landing-site",
    coordinateNote: "Published landing-site coordinate. The lander did not move after coming to rest.",
    landingSite: "Ares Vallis, an ancient flood plain",
    status: "mission-ended",
    statusExplanation: "A robotic lander that stopped communicating in 1997. It was designed to stay on Mars.",
    purpose: "Demonstrate a low-cost way to land on Mars and deliver a rover.",
    teaser: "The bouncing lander that brought Mars back into the spotlight.",
    story: [
      {
        heading: "Landing by bouncing",
        text:
          "On 4 July 1997, Pathfinder plunged into the Martian atmosphere, slowed with a heat shield, parachute and rockets, then surrounded itself with airbags. It bounced like a giant beach ball about 15 times, as high as 15 metres, before rolling to a stop.",
      },
      {
        heading: "A flower opens",
        text:
          "When the airbags deflated, the tetrahedron-shaped lander opened three petals covered in solar cells, set itself upright and began photographing the rocky flood plain of Ares Vallis.",
      },
      {
        heading: "A new kind of mission",
        text:
          "Pathfinder was part of NASA's Discovery Program, designed to show that Mars missions could be faster and cheaper. Its success shaped the airbag landings of later rovers.",
      },
    ],
    scientificContribution:
      "From landing until its final data transmission on 27 September 1997, Pathfinder returned about 2.3 billion bits of information, including more than 16,500 lander images, 550 rover images, more than 15 chemical analyses of rocks and soil, and weather data.",
    eli10: {
      paragraphs: [
        "How do you land a spacecraft on a rocky planet without breaking it? Pathfinder wrapped itself in giant airbags and bounced!",
        "Then it opened up like a flower, took thousands of photos, and checked the weather on Mars every day.",
      ],
      comparison: "Like dropping an egg wrapped in bubble wrap, and the egg survives and starts taking pictures.",
      question: "What else could you protect with airbags if you were dropping it from very high up?",
    },
    scientist: [
      { heading: "Entry, descent and landing", text: "Direct entry from the interplanetary trajectory, parachute deceleration, airbag inflation about 100 m above the surface, and small rockets to slow the final descent before the bounces." },
      { heading: "Instruments", text: "The Imager for Mars Pathfinder (a stereo camera) and the Atmospheric Structure Instrument/Meteorology package measured landscape, atmosphere and weather." },
      { heading: "Planetary interior", text: "Radio tracking of the lander helped constrain the size of Mars's metallic core, estimated at between about 1,300 and 2,000 km in radius." },
    ],
    didYouKnow: [
      { front: "Why is it called the Carl Sagan Memorial Station?", back: "After landing, the lander was named in honour of astronomer Carl Sagan, who had died the year before." },
      { front: "What day did it land?", back: "On 4 July 1997." },
      { front: "How far did it roll after the first bounce?", back: "It came to rest about 1 km from where it first hit the ground, about two and a half minutes later." },
    ],
    timeline: [
      { date: "4 Dec 1996", label: "Launch", detail: "Delta II rocket from Cape Canaveral." },
      { date: "4 Jul 1997", label: "Airbag landing", detail: "Lands in Ares Vallis." },
      { date: "Jul 1997", label: "Sojourner deployed", detail: "The rover rolls down the lander's ramp on sol 2." },
      { date: "27 Sep 1997", label: "Final data transmission" },
    ],
    images: [
      nasaImage("PIA01121", "orig", "\"Sojourner Rover View of Pathfinder Lander\".", "1997-12-12", "NASA/JPL"),
      nasaImage("PIA01550", "small", "\"Pathfinder Landers — In Test and On Mars\".", "1999-06-22", "NASA/JPL"),
    ],
    thenNow: {
      then: nasaImage("PIA01121", "orig", "The lander seen by Sojourner in 1997.", "1997-12-12", "NASA/JPL"),
      changed: "CosmoSmriti does not yet include a verified later orbital image of the lander.",
      knownToday: "The lander remains at Ares Vallis, inactive since 1997.",
    },
    lastSignal: {
      available: true,
      date: "27 September 1997",
      context: "Pathfinder was designed for a primary mission of about one month and kept working for nearly three months.",
      whatHappened: "The final data transmission from Pathfinder was received on 27 September 1997.",
      afterward: "Later attempts to re-establish contact did not succeed, and the mission was ended. The lander's exact failure cause is not definitively known.",
    },
    components: [
      { name: "Airbags", purpose: "Cushion the landing.", how: "Large airbags inflated around the lander just before impact.", kid: "Giant bouncy cushions." },
      { name: "Petals & solar panels", purpose: "Right the lander and generate power.", how: "Three petals opened, turning the lander upright and exposing solar cells.", kid: "Flower petals that make electricity from sunlight." },
      { name: "Imager for Mars Pathfinder", purpose: "Photograph the landscape in stereo.", how: "A camera on a mast with filters for colour and 3D views.", kid: "The lander's eyes, seeing in 3D." },
      { name: "Weather mast", purpose: "Measure Martian weather.", how: "Sensors measured temperature, pressure and wind.", kid: "A weather station on Mars." },
    ],
    reconstruction: { kind: "pathfinder" },
    sources: [src.scienceMission("mars-pathfinder", "Mars Pathfinder"), src.nssdca("1996-068A", "Mars Pathfinder"), src.pathfinderSummary],
  },
  {
    id: "sojourner",
    number: 7,
    planet: "mars",
    officialName: "Sojourner Rover",
    shortName: "Sojourner",
    missionName: "Mars Pathfinder",
    missionYear: 1997,
    category: "Robotic rover",
    coordinates: PATHFINDER_SITE,
    coordinateSystem: "Areocentric degrees, east-positive longitude",
    coordinateAccuracy: "landing-site",
    coordinateNote:
      "Sojourner shares the Pathfinder landing site; it drove short distances around the lander. Its final exact position is not given here.",
    landingSite: "Ares Vallis (same site as the Pathfinder lander)",
    status: "mission-ended",
    statusExplanation: "A rover that could only talk to Earth through the lander. When the lander fell silent, contact with Sojourner was lost too.",
    purpose: "Prove that a small robot could drive on Mars and study rocks up close.",
    teaser: "The first wheeled vehicle to drive on another planet.",
    story: [
      {
        heading: "A rover the size of a microwave",
        text:
          "Sojourner was a six-wheeled, 10.6-kilogram rover that rode to Mars folded on one of Pathfinder's petals. On sol 2 it stood up to its full height of about 30 cm and rolled down a ramp onto Martian soil.",
      },
      {
        heading: "Meeting rocks",
        text:
          "Engineers drove it to rocks the team nicknamed Barnacle Bill, Yogi and others, where its Alpha Proton X-ray Spectrometer measured their chemistry.",
      },
      {
        heading: "Named by a student",
        text:
          "The name came from a student essay contest honouring Sojourner Truth, the 19th-century campaigner for abolition and women's rights.",
      },
    ],
    scientificContribution:
      "Sojourner showed that a rover could navigate Mars semi-autonomously and analyse rocks in place. Its chemistry measurements and close-up images helped scientists interpret Ares Vallis as a place shaped by ancient floods.",
    eli10: {
      paragraphs: [
        "Sojourner was a tiny robot car, about the weight of a large watermelon. It was the very first rover to drive on another planet.",
        "It couldn't talk to Earth by itself. It sent messages to the lander, and the lander passed them home, like passing a note through a friend.",
      ],
      comparison: "Like a remote-control car, except every command took minutes to reach it, so it had to avoid rocks on its own.",
      question: "Why would a rover on Mars need to make some decisions by itself?",
    },
    scientist: [
      { heading: "Mobility", text: "Six wheels on a rocker-bogie suspension let it climb over obstacles, a design idea carried into later Mars rovers." },
      { heading: "APXS", text: "The Alpha Proton X-ray Spectrometer, mounted on the rear, determined elemental composition of rocks and soil." },
      { heading: "Autonomy", text: "With signal delays of several minutes, the rover used onboard hazard detection to stop or steer around obstacles between commands." },
    ],
    didYouKnow: [
      { front: "How tall was Sojourner?", back: "About 30 cm (1 foot) when standing at full height." },
      { front: "How did it talk to Earth?", back: "Only through the Pathfinder lander, which relayed its data." },
      { front: "Why 'Sojourner'?", back: "To honour Sojourner Truth, chosen through a student essay contest." },
    ],
    timeline: [
      { date: "4 Jul 1997", label: "Arrives on Mars", detail: "Folded on the Pathfinder lander." },
      { date: "Sol 2, Jul 1997", label: "First drive", detail: "Rolls down the rear ramp onto the surface." },
      { date: "Jul 1997", label: "Rock science", detail: "Studies rocks including Barnacle Bill and Yogi." },
      { date: "27 Sep 1997", label: "Last data via the lander" },
    ],
    images: [
      nasaImage("PIA01551", "orig", "\"Newly Deployed Sojourner Rover\".", "1999-06-22", "NASA/JPL"),
      nasaImage("PIA00778", "orig", "\"Yogi in False Color\" — Sojourner in contact with the rock Yogi.", "1997-07-22", "NASA/JPL"),
    ],
    thenNow: {
      then: nasaImage("PIA01551", "orig", "Sojourner after deployment, 1997.", "1999-06-22", "NASA/JPL"),
      changed: "CosmoSmriti does not yet include a verified later image showing the rover.",
      knownToday: "Sojourner's final position and what it did after losing contact are not known.",
    },
    lastSignal: {
      available: true,
      date: "27 September 1997",
      context: "Sojourner had no direct link to Earth; everything went through the Pathfinder lander.",
      whatHappened: "The last data from the mission, relayed by the lander, arrived on 27 September 1997.",
      afterward: "When the lander fell silent, so did the rover's link. What Sojourner did afterward is unknown.",
    },
    components: [
      { name: "Rocker-bogie wheels", purpose: "Climb over rocks without tipping.", how: "Linked suspension kept all six wheels on the ground.", kid: "Wobbly legs that help it climb like a caterpillar." },
      { name: "APXS", purpose: "Find out what rocks are made of.", how: "Measured particles and X-rays coming back from a rock.", kid: "A science nose that 'sniffs' rocks." },
      { name: "Solar panel", purpose: "Power the rover.", how: "A flat solar panel on top supplied electricity.", kid: "A sun-hat that makes power." },
      { name: "Hazard cameras & lasers", purpose: "Avoid obstacles.", how: "Laser stripes and cameras detected rocks ahead.", kid: "Eyes that say 'watch out!'" },
    ],
    reconstruction: { kind: "sojourner" },
    sources: [src.scienceMission("mars-pathfinder", "Mars Pathfinder & Sojourner"), src.nssdca("1996-068A", "Mars Pathfinder (incl. Sojourner)"), src.pathfinderSummary],
  },
  {
    id: "spirit",
    number: 8,
    planet: "mars",
    officialName: "Spirit — Mars Exploration Rover A (Columbia Memorial Station)",
    shortName: "Spirit Rover",
    missionName: "Mars Exploration Rover",
    missionYear: 2004,
    category: "Robotic rover",
    coordinates: { lat: -14.5684, lon: 175.4726 },
    coordinateSystem: "Areocentric degrees, east-positive longitude",
    coordinateAccuracy: "landing-site",
    coordinateNote:
      "Spirit's landing-site coordinate. The rover drove 7.73 km before getting stuck, so its final resting place is a few kilometres away.",
    landingSite: "Gusev crater",
    status: "mission-ended",
    statusExplanation: "A rover that became stuck in soft soil and later fell silent. NASA ended contact attempts in 2011.",
    purpose: "Search rocks and soils for clues about past water on Mars.",
    teaser: "A rover that discovered its biggest clue by accident, dragging a broken wheel.",
    story: [
      {
        heading: "Into Gusev crater",
        text:
          "Spirit landed on 4 January 2004 (UTC) inside Gusev crater, which scientists suspected once held a lake. Like Pathfinder, it bounced down on airbags.",
      },
      {
        heading: "A broken wheel's gift",
        text:
          "After its right-front wheel stopped working, Spirit drove backward, dragging the wheel. The furrow it dug exposed bright, silica-rich soil, a sign that hot water or steam had once been present.",
      },
      {
        heading: "Stuck at Troy",
        text:
          "In 2009 Spirit broke through a crust into soft soil at a place called Troy. Despite months of attempts, it could not escape. Unable to tilt its solar panels toward the winter Sun, it fell silent in March 2010.",
      },
    ],
    scientificContribution:
      "Planned for 90 Martian days, Spirit operated for 6 years, 2 months and 19 days, more than 25 times its intended lifetime, and traveled 7.73 km. Its discoveries, including silica-rich deposits, revealed that Gusev had a watery and possibly hydrothermal past.",
    eli10: {
      paragraphs: [
        "Spirit was a robot geologist the size of a golf cart. It was supposed to work for about three months, but it kept going for more than six years!",
        "One of its wheels broke, so it drove backwards dragging it. That scraped the ground and uncovered white soil, a clue that hot water was once there.",
      ],
      comparison: "Like scuffing your shoe on a beach and discovering shells hidden under the sand.",
      question: "Can you think of a time a mistake led to a surprising discovery?",
    },
    scientist: [
      { heading: "Payload", text: "Pancam, Mini-TES (thermal emission spectrometer), Mössbauer spectrometer, APXS, Microscopic Imager and the Rock Abrasion Tool for grinding into rock surfaces." },
      { heading: "Silica deposits", text: "Nearly pure silica in soils near the Home Plate region indicates past hot springs or fumaroles, environments that can be favourable for microbes on Earth." },
      { heading: "Power and winter", text: "Spirit relied on solar power. Embedded at Troy with an unfavourable tilt, it could not gather enough energy to survive the Martian winter." },
    ],
    didYouKnow: [
      { front: "How heavy was Spirit?", back: "About 185 kg, about seven times heavier than Sojourner." },
      { front: "Did wind ever help Spirit?", back: "Yes. Gusts and dust devils sometimes cleaned dust off its solar panels, boosting power." },
      { front: "Who is the landing site named after?", back: "It was named Columbia Memorial Station, honouring the crew of Space Shuttle Columbia lost in 2003." },
    ],
    timeline: [
      { date: "10 Jun 2003", label: "Launch" },
      { date: "4 Jan 2004", label: "Lands in Gusev crater" },
      { date: "2005", label: "Climbs Husband Hill" },
      { date: "2007", label: "Silica discovery", detail: "Dragging wheel exposes silica-rich soil." },
      { date: "May 2009", label: "Stuck at Troy" },
      { date: "22 Mar 2010", label: "Last communication" },
      { date: "25 May 2011", label: "Mission declared complete" },
    ],
    images: [
      nasaImage("PIA03253", "medium", "\"Spirit Rover on Husband Hill\".", "2006-01-03", "NASA/JPL"),
      nasaImage("PIA12007", "small", "\"Spirit Wheels Digging into Soft Ground, Sol 1899\" (May 2009).", "2009-05-11", "NASA/JPL-Caltech"),
    ],
    thenNow: {
      then: nasaImage("PIA03253", "medium", "Spirit on Husband Hill, released January 2006.", "2006-01-03", "NASA/JPL"),
      now: nasaImage("PIA12007", "small", "Wheels sinking into soft ground at Troy, May 2009.", "2009-05-11", "NASA/JPL-Caltech"),
      changed: "These are different viewpoints from different years: an earlier view of the rover's climb and the rover's own view of its wheels stuck at Troy.",
      knownToday: "Spirit remains at Troy and has been silent since March 2010.",
    },
    lastSignal: {
      available: true,
      date: "22 March 2010",
      context: "Spirit was stuck in soft soil and entering Martian winter with little sunlight on its panels.",
      whatHappened: "Spirit's last communication with Earth was on 22 March 2010.",
      afterward: "NASA listened and sent commands for more than a year. On 25 May 2011 it ended efforts to contact the rover and declared the mission complete.",
    },
    components: [
      { name: "Pancam mast", purpose: "Take high-resolution colour panoramas.", how: "Two cameras on a mast about as tall as a person.", kid: "A tall neck with two eyes." },
      { name: "Robotic arm (IDD)", purpose: "Place instruments against rocks.", how: "A jointed arm carrying a microscope, spectrometers and a grinder.", kid: "An arm with a toolbox for a hand." },
      { name: "Rock Abrasion Tool", purpose: "Grind away the dusty outer layer of a rock.", how: "A rotating grinder exposed fresh rock for study.", kid: "A tiny sander that peeks inside rocks." },
      { name: "Solar arrays", purpose: "Power the rover.", how: "Wing-like panels converted sunlight into electricity.", kid: "Sun-catching wings." },
    ],
    reconstruction: { kind: "mer" },
    sources: [src.scienceMission("mer-spirit", "Spirit (MER-A)"), src.nssdca("2003-027A", "Spirit (MER-A)"), src.image("PIA12007", "Spirit Wheels Digging into Soft Ground")],
  },
  {
    id: "opportunity",
    number: 9,
    planet: "mars",
    officialName: "Opportunity — Mars Exploration Rover B (Challenger Memorial Station)",
    shortName: "Opportunity Rover",
    missionName: "Mars Exploration Rover",
    missionYear: 2004,
    category: "Robotic rover",
    coordinates: { lat: -1.9462, lon: -5.5266 },
    coordinateSystem: "Areocentric degrees (354.4734° E shown as −5.5266°)",
    coordinateAccuracy: "landing-site",
    coordinateNote:
      "Opportunity's landing site in Eagle crater. The rover later drove more than 45 km; its final resting place in Perseverance Valley on the rim of Endeavour crater is far from this point.",
    landingSite: "Meridiani Planum (Eagle crater)",
    status: "mission-ended",
    statusExplanation: "A rover silenced by a planet-wide dust storm in 2018. NASA declared the mission complete in 2019.",
    purpose: "Search for evidence of past water in the rocks of Meridiani Planum.",
    teaser: "The 90-day rover that ran a marathon and worked for nearly 15 years.",
    story: [
      {
        heading: "A hole in one",
        text:
          "Opportunity landed on 25 January 2004 (UTC) and rolled into a small crater, Eagle crater, where layered bedrock was right in front of it. The team called it an interplanetary hole in one.",
      },
      {
        heading: "Blueberries and water",
        text:
          "In the rocks it found tiny hematite-rich spheres nicknamed 'blueberries' and layering that showed the area had once been soaked in water.",
      },
      {
        heading: "A marathon on Mars",
        text:
          "Opportunity drove to larger and larger craters. In 2015 its odometer passed a marathon distance, 42.195 km, and it eventually traveled more than 45 km before the 2018 dust storm.",
      },
    ],
    scientificContribution:
      "Opportunity provided strong evidence that liquid water once existed at Meridiani Planum, and at Endeavour crater it studied rocks altered by water in more neutral conditions. It exceeded its planned lifetime by about 60 times.",
    eli10: {
      paragraphs: [
        "Opportunity was the twin of Spirit. It was supposed to work for three months, but it kept exploring for almost 15 years!",
        "It found little round pebbles called 'blueberries' that form in water. That told scientists Mars was once a much wetter place.",
      ],
      comparison: "It drove farther than a marathon, at a speed slower than a snail most of the time.",
      question: "What do you think made a robot designed for 90 days last so long?",
    },
    scientist: [
      { heading: "Sedimentary evidence", text: "Cross-bedded sulfate-rich sandstones and hematite concretions indicated deposition and alteration by water." },
      { heading: "Endeavour crater", text: "Reached in 2011; its older rim rocks offered evidence of water that was less acidic than at Meridiani's plains." },
      { heading: "Dust storm", text: "In June 2018 a planet-encircling dust storm blocked sunlight. The solar-powered rover could not generate enough power and fell silent." },
    ],
    didYouKnow: [
      { front: "Did Opportunity really say 'My battery is low and it's getting dark'?", back: "No. That famous line was a journalist's poetic summary of the final data. The rover sent engineering data, not words." },
      { front: "Whose record did it break?", back: "It beat the off-world driving record set by the Soviet Lunokhod 2 rover on the Moon." },
      { front: "Why 'Challenger Memorial Station'?", back: "The landing site honours the crew of Space Shuttle Challenger, lost in 1986." },
    ],
    timeline: [
      { date: "7 Jul 2003", label: "Launch" },
      { date: "25 Jan 2004", label: "Lands in Eagle crater" },
      { date: "2004", label: "Evidence of past water" },
      { date: "Aug 2011", label: "Reaches Endeavour crater" },
      { date: "Mar 2015", label: "Passes marathon distance" },
      { date: "10 Jun 2018", label: "Last communication" },
      { date: "13 Feb 2019", label: "Mission declared complete" },
    ],
    images: [
      nasaImage("PIA17759", "medium", "\"Self-Portrait by Opportunity Mars Rover in January 2014\".", "2014-01-23", "NASA/JPL-Caltech/Cornell/Arizona State Univ."),
      nasaImage("PIA19158", "medium", "\"Opportunity Marathon Journey\" — map of the route.", "2015-03-24", "NASA/JPL-Caltech/MSSS/NMMNHS"),
    ],
    thenNow: {
      then: nasaImage("PIA17759", "medium", "Self-portrait, January 2014.", "2014-01-23", "NASA/JPL-Caltech/Cornell/Arizona State Univ."),
      now: nasaImage("PIA21494", "medium", "\"Rover Landing Hardware at Eagle Crater, Mars\" — orbital view, 8 April 2017.", "2017-04-21", "NASA/JPL-Caltech/Univ. of Arizona"),
      changed: "The self-portrait shows the rover itself; the 2017 orbital image shows the landing platform it left in Eagle crater in 2004. Same mission, different objects and viewpoints.",
      knownToday: "The rover rests in Perseverance Valley, silent since June 2018. Its landing platform remains in Eagle crater.",
    },
    lastSignal: {
      available: true,
      date: "10 June 2018",
      context: "A planet-wide dust storm darkened the sky over Opportunity.",
      whatHappened: "NASA's last communication with Opportunity was on 10 June 2018. Its final data showed very low power under an extremely dusty sky.",
      afterward: "Engineers sent more than a thousand recovery commands over months. On 13 February 2019 NASA declared the mission complete.",
      myth: "\"My battery is low and it's getting dark\" is a widely shared paraphrase by a journalist, not a message the rover sent.",
    },
    components: [
      { name: "Pancam mast", purpose: "Stereo colour imaging.", how: "Two high-resolution cameras with filters.", kid: "The rover's eyes." },
      { name: "Robotic arm", purpose: "Close-up science.", how: "Microscopic Imager, APXS, Mössbauer and the Rock Abrasion Tool.", kid: "A science arm with four tools." },
      { name: "Rocker-bogie suspension", purpose: "Drive over rough terrain.", how: "Six wheels on linked arms stay in contact with the ground.", kid: "Bendy legs for bumpy roads." },
      { name: "Solar arrays", purpose: "Power.", how: "Panels charged batteries; dust and dust storms reduced their output.", kid: "Wings that catch sunlight." },
    ],
    reconstruction: { kind: "mer" },
    sources: [src.scienceMission("mer-opportunity", "Opportunity (MER-B)"), src.nssdca("2003-032A", "Opportunity (MER-B)"), src.image("PIA21494", "Rover Landing Hardware at Eagle Crater")],
  },
  {
    id: "phoenix",
    number: 10,
    planet: "mars",
    officialName: "Phoenix Mars Lander",
    shortName: "Phoenix Lander",
    missionName: "Phoenix",
    missionYear: 2008,
    category: "Robotic lander",
    coordinates: { lat: 68.22, lon: -125.75 },
    coordinateSystem: "Areocentric degrees (125.75° W shown as −125.75°)",
    coordinateAccuracy: "landing-site",
    coordinateNote: "Published landing-site coordinate, rounded. Phoenix was a stationary lander.",
    landingSite: "Vastitas Borealis (the 'Green Valley'), Martian arctic plains",
    status: "mission-ended",
    statusExplanation: "A stationary lander that was never designed to survive the Martian polar winter. It fell silent as winter arrived in 2008.",
    purpose: "Dig into the Martian arctic to study ice, soil chemistry and habitability.",
    teaser: "The lander that touched Martian water ice, and saw snow falling.",
    story: [
      {
        heading: "Landing on rockets",
        text:
          "On 25 May 2008 Phoenix entered the atmosphere at nearly 21,000 km/h and touched down on its legs using rocket thrusters, landing on the arctic plains of Vastitas Borealis. NASA's Mars Reconnaissance Orbiter photographed it hanging from its parachute.",
      },
      {
        heading: "Disappearing ice",
        text:
          "Phoenix's robotic arm dug a trench nicknamed Dodo-Goldilocks and exposed bright chunks. Over four days they vanished, turning straight from solid to gas: water ice.",
      },
      {
        heading: "Winter comes",
        text:
          "As the arctic autumn darkened, Phoenix lost solar power. Its last communication came on 2 November 2008. Orbital images in 2010 suggested ice had damaged its solar panels.",
      },
    ],
    scientificContribution:
      "Phoenix verified water ice just beneath the surface, confirmed water in a heated soil sample with its TEGA instrument, discovered perchlorate salts in the soil, and its laser instrument detected snow falling from Martian clouds.",
    eli10: {
      paragraphs: [
        "Phoenix landed near the north pole of Mars, a cold and icy place. It had a long arm with a scoop, like a digger at the beach.",
        "When it dug a trench, it found white stuff that slowly disappeared over a few days. That was ice. Phoenix had touched frozen water on Mars!",
      ],
      comparison: "Like dry ice at a party that seems to vanish into fog without melting into a puddle.",
      question: "Why would finding water be so exciting for future astronauts?",
    },
    scientist: [
      { heading: "Instruments", text: "Surface Stereo Imager, Robotic Arm Camera, MECA (microscopy and wet chemistry), TEGA (ovens and mass spectrometer) and a meteorological station with lidar." },
      { heading: "Perchlorate", text: "Perchlorate salts can be an energy source for some microbes on Earth and a potential resource for future explorers, but are also toxic at high levels." },
      { heading: "Sublimation", text: "In the thin, cold atmosphere, exposed water ice sublimates directly to vapour, which explains the vanishing chunks in the trench." },
    ],
    didYouKnow: [
      { front: "Why is it called Phoenix?", back: "Like the mythical bird reborn from ashes, it used hardware from an earlier, cancelled Mars lander project." },
      { front: "Did Phoenix see snow?", back: "Yes. Its laser instrument detected snow falling from clouds, though it evaporated before reaching the ground." },
      { front: "How long was its arm?", back: "About 2.35 metres, long enough to dig trenches around the lander." },
    ],
    timeline: [
      { date: "4 Aug 2007", label: "Launch" },
      { date: "25 May 2008", label: "Lands in the arctic" },
      { date: "19 Jun 2008", label: "Ice confirmed", detail: "Bright material in the trench sublimates." },
      { date: "31 Jul 2008", label: "Water confirmed by TEGA" },
      { date: "2 Nov 2008", label: "Last communication" },
      { date: "2010", label: "Seen from orbit", detail: "HiRISE images suggest ice-damaged solar panels." },
    ],
    images: [
      nasaImage("PIA10906", "orig", "\"Disappearing Ice\" — sublimation in the Dodo-Goldilocks trench over four days.", "2008-06-20", "NASA/JPL-Caltech/University of Arizona/Texas A&M University"),
      nasaImage("PIA11379", "orig", "\"Underneath the Phoenix Lander\".", "2008-10-29", "NASA/JPL-Caltech/University of Arizona"),
    ],
    thenNow: {
      then: nasaImage("PIA10906", "orig", "Ice in the trench, June 2008.", "2008-06-20", "NASA/JPL-Caltech/University of Arizona/Texas A&M University"),
      now: nasaImage("PIA12490", "small", "\"Phoenix Lander Amid Disappearing Spring Ice\" — HiRISE, 6 January 2010.", "2010-01-11", "NASA/JPL-Caltech/University of Arizona"),
      changed: "The 2008 image is the lander's view of its own trench; the 2010 image looks down from orbit at the lander, backshell and heat shield after winter.",
      knownToday: "Phoenix remains silent on the arctic plain. NASA's later listening attempts did not succeed.",
    },
    lastSignal: {
      available: true,
      date: "2 November 2008",
      context: "Shortening days and dust reduced solar power as the arctic winter approached.",
      whatHappened: "Phoenix's last communication was on 2 November 2008.",
      afterward: "NASA announced the end of the mission after failing to re-establish contact. Later listening campaigns did not hear from the lander.",
    },
    components: [
      { name: "Robotic arm & scoop", purpose: "Dig trenches and deliver samples.", how: "A 2.35 m arm with a scoop and rasp delivered soil to instruments on the deck.", kid: "A digger arm, like a sandcastle shovel." },
      { name: "TEGA ovens", purpose: "Heat soil and measure released gases.", how: "Small ovens heated samples; a mass spectrometer analysed the vapours.", kid: "Tiny ovens that bake dirt to see what comes out." },
      { name: "MECA wet chemistry lab", purpose: "Find out what dissolves out of the soil.", how: "Mixed soil with water and measured the chemistry.", kid: "Mixing dirt with water to test it, like a science fair." },
      { name: "Weather station & lidar", purpose: "Measure weather and clouds.", how: "A laser pointed upward to detect dust and ice in the atmosphere.", kid: "A laser that spotted snow!" },
    ],
    reconstruction: { kind: "phoenix" },
    sources: [src.scienceMission("phoenix", "Phoenix"), src.nssdca("2007-034A", "Phoenix Mars Lander"), src.image("PIA12490", "Phoenix Lander Amid Disappearing Spring Ice")],
  },
];
