import type { Artifact } from "./types";
import { nasaImage, src } from "./sources";

const ALSEP_SHUTDOWN = {
  available: true,
  date: "30 September 1977",
  context:
    "The Apollo 12, 14, 15, 16 and 17 ALSEP stations formed a network that radioed lunar measurements to Earth for years after the astronauts went home.",
  whatHappened:
    "On 30 September 1977 NASA commanded the remaining ALSEP stations to stop operating, ending the network's scientific data return. The decision was driven by budget and operations limits, not by the instruments suddenly failing.",
  afterward:
    "The hardware is still on the surface. It is inactive equipment, not a working spacecraft. The separate laser ranging retroreflectors left by Apollo 11, 14 and 15 are passive mirrors and are still used by observatories on Earth.",
};

export const moonArtifacts: Artifact[] = [
  {
    id: "apollo-11-eagle",
    number: 1,
    planet: "moon",
    officialName: "Apollo 11 Lunar Module Eagle — Descent Stage",
    shortName: "Eagle Descent Stage",
    missionName: "Apollo 11",
    missionYear: 1969,
    category: "Crewed lander (descent stage)",
    coordinates: { lat: 0.6741, lon: 23.473 },
    coordinateSystem: "Mean Earth / polar axis, planetocentric degrees",
    coordinateAccuracy: "orbital-measured",
    coordinateNote:
      "Lander position as measured in Lunar Reconnaissance Orbiter imagery, rounded to four decimals. Positions in this 3D world are scaled for exploration and are not to map scale.",
    landingSite: "Tranquility Base, Mare Tranquillitatis (Sea of Tranquility)",
    status: "left-by-design",
    statusExplanation:
      "Deliberately left behind. The descent stage was designed to stay on the Moon and act as the launch platform for the ascent stage that carried the crew back to lunar orbit.",
    purpose: "Land two astronauts safely on the Moon and serve as their launch pad home.",
    teaser: "The base of the first crewed spacecraft to land on another world.",
    story: [
      {
        heading: "Twelve minutes to Tranquility",
        text:
          "On 20 July 1969, Neil Armstrong and Buzz Aldrin rode the lunar module Eagle down toward the Sea of Tranquility while Michael Collins orbited above in Columbia. Program alarms flashed on the computer, and Armstrong took manual control to steer past a field of boulders, touching down with only a small margin of fuel.",
      },
      {
        heading: "A spacecraft in two halves",
        text:
          "Eagle was built as two stages. The lower descent stage held the landing engine, fuel tanks, four legs and equipment stowage. The upper ascent stage held the crew cabin and its own small rocket.",
      },
      {
        heading: "Why it stayed",
        text:
          "On 21 July the ascent stage fired its engine and lifted off, using the descent stage as a launch pad. Leaving the heavy lower half behind was part of the plan from the start. Its legs, engine bell and a commemorative plaque remain at Tranquility Base today.",
      },
    ],
    scientificContribution:
      "Apollo 11 proved that people could land on the Moon, work there and return safely. The crew collected about 21.5 kg of lunar samples and deployed early experiments, including a laser ranging retroreflector that is still used to measure the Earth–Moon distance.",
    eli10: {
      paragraphs: [
        "Imagine a spaceship shaped like a two-storey house. The bottom floor had legs and a big rocket to slow down and land gently. The top floor was where the astronauts sat.",
        "When it was time to go home, the top floor blasted off and the bottom floor stayed behind as a launch pad. That bottom floor is still sitting on the Moon right where it landed in 1969.",
      ],
      comparison: "It's like a booster seat you leave behind: it got you up there, and carrying it home would make the trip much harder.",
      question: "Why do you think it was smarter to leave the heavy bottom half on the Moon?",
    },
    scientist: [
      {
        heading: "Descent propulsion",
        text:
          "The descent stage carried a throttleable rocket engine, so the crew could slow down and hover during the final approach. Throttling was essential for a controlled landing.",
      },
      {
        heading: "Landing gear and contact sensing",
        text:
          "Four legs with footpads absorbed touchdown loads. Probes extending below the footpads signalled first surface contact to the crew ('contact light').",
      },
      {
        heading: "Mission architecture",
        text:
          "Lunar-orbit rendezvous kept the landing vehicle small: only the lunar module went down, and only its ascent stage came back up. Staging meant the ascent engine did not have to lift the landing hardware.",
      },
    ],
    didYouKnow: [
      { front: "What is written on Eagle's leg?", back: "A plaque reads: \"Here men from the planet Earth first set foot upon the Moon, July 1969 A.D. We came in peace for all mankind.\"" },
      { front: "How long did the first moonwalk last?", back: "About two and a half hours. Armstrong stepped onto the surface at 02:56 UTC on 21 July 1969." },
      { front: "Is anything from Apollo 11 still working?", back: "Yes, in a way. The laser ranging retroreflector is a passive mirror array that observatories still bounce lasers off today." },
    ],
    timeline: [
      { date: "16 Jul 1969", label: "Launch", detail: "Saturn V lifts off from Kennedy Space Center." },
      { date: "20 Jul 1969", label: "Eagle lands", detail: "Touchdown at Tranquility Base, 20:17 UTC." },
      { date: "21 Jul 1969", label: "First step", detail: "Armstrong steps onto the Moon at 02:56 UTC." },
      { date: "21 Jul 1969", label: "Ascent stage lifts off", detail: "The descent stage remains on the surface." },
      { date: "24 Jul 1969", label: "Splashdown", detail: "The crew returns safely to Earth." },
      { date: "2009", label: "Seen from orbit", detail: "NASA's Lunar Reconnaissance Orbiter images the site." },
    ],
    images: [
      nasaImage("as11-40-5902", "medium", "Buzz Aldrin walks near a leg of the lunar module. Photo by Neil Armstrong.", "1969-07-20"),
      nasaImage("KSC-as11-40-5964", "medium", "Aldrin sets up the solar wind experiment near Eagle, surrounded by bootprints.", "1969-07-20"),
    ],
    thenNow: {
      then: nasaImage("as11-40-5902", "medium", "On the surface, 20 July 1969.", "1969-07-20"),
      now: nasaImage("PIA12909", "small", "\"Apollo 11: Second Look\" — Lunar Reconnaissance Orbiter view of the landing site.", "2009-09-29"),
      changed:
        "The 1969 photo was taken on the ground; the 2009 view looks straight down from orbit, so they are different viewpoints. From orbit the descent stage appears as a small bright object with its shadow.",
      knownToday:
        "The descent stage remains where it landed. Orbital images also show disturbed soil from the astronauts' activity.",
    },
    lastSignal: {
      available: false,
      context: "The descent stage had no independent radio for the mission; the crew's communications travelled through the ascent stage and the command module.",
      whatHappened:
        "Its last documented role was acting as the launch platform when Eagle's ascent stage lifted off on 21 July 1969.",
      afterward: "There is no 'final signal' to report for this artifact, so CosmoSmriti does not invent one.",
    },
    components: [
      { name: "Descent engine", purpose: "Slow the lunar module and control the landing.", how: "A throttleable rocket engine let the crew vary thrust, hover and descend gently.", kid: "A rocket you can turn up and down like a volume knob.", anchor: [0, 0.95, 0], nasaAnchor: [0, 0.75, 0] },
      { name: "Landing legs & footpads", purpose: "Support the spacecraft on uneven ground.", how: "Four legs absorbed the impact of touchdown and spread the weight across wide footpads.", kid: "Four sturdy legs, like a table that can land.", anchor: [1.77, 0.15, 1.77], nasaAnchor: [2.75, 0.25, 0] },
      { name: "Surface contact probes", purpose: "Tell the crew they had touched the surface.", how: "Long probes under the footpads triggered a 'contact light' when they brushed the ground.", kid: "Feelers that said 'we're almost down!'", anchor: [-1.77, 0.1, 1.77] },
      { name: "Commemorative plaque", purpose: "Mark the first crewed landing.", how: "A stainless steel plaque mounted on a leg, signed by the crew and the US President.", kid: "A message to anyone who visits in the future.", anchor: [1.5, 1.9, 0] },
    ],
    reconstruction: {
      kind: "lm-descent",
      nasaModel: {
        id: "apollo-lunar-module",
        descentStageOnly: true,
        note: "NASA's generic Apollo Lunar Module model, not a scan of Eagle itself. Only the lower half, the descent stage, is shown here, because the upper ascent stage carried the crew back to orbit.",
      },
    },
    sources: [
      src.missionPage(11),
      src.alsj(11),
      src.nssdca("1969-059C", "Apollo 11 Lunar Module Eagle"),
      src.image("PIA12909", "Apollo 11: Second Look"),
      src.lroc,
      src.nasa3d("Apollo Lunar Module", "https://science.nasa.gov/3d-resources/apollo-lunar-module/"),
    ],
  },
  {
    id: "apollo-12-alsep",
    number: 2,
    planet: "moon",
    officialName: "Apollo 12 ALSEP — Apollo Lunar Surface Experiments Package",
    shortName: "Apollo 12 ALSEP",
    missionName: "Apollo 12",
    missionYear: 1969,
    category: "Scientific instrument collection",
    coordinates: { lat: -3.0124, lon: -23.4216 },
    coordinateSystem: "Mean Earth / polar axis, planetocentric degrees",
    coordinateAccuracy: "landing-site",
    coordinateNote:
      "Coordinate of the Apollo 12 lunar module landing site. The ALSEP was set up a short walk away, so this is an approximate location for the instruments.",
    landingSite: "Oceanus Procellarum (Ocean of Storms), near Surveyor 3",
    status: "instruments-switched-off",
    statusExplanation:
      "A collection of instruments, not one object. It was deliberately deployed to stay on the Moon and radio data home, and was later switched off by NASA.",
    purpose: "Leave a long-running science station on the Moon after the astronauts departed.",
    teaser: "A tiny science station that listened to the Moon for nearly eight years.",
    story: [
      {
        heading: "Struck by lightning",
        text:
          "Apollo 12 launched on 14 November 1969 into a rainy sky and was struck by lightning twice during ascent. The crew and flight controllers recovered the spacecraft's systems, and the mission continued to the Moon.",
      },
      {
        heading: "A pinpoint landing",
        text:
          "Pete Conrad and Alan Bean landed the lunar module Intrepid in the Ocean of Storms on 19 November, within walking distance of Surveyor 3, a robotic lander that had arrived in 1967. Hitting such a precise target showed that later missions could aim for scientifically interesting places.",
      },
      {
        heading: "Setting up a station",
        text:
          "During their first moonwalk, Bean and Conrad unpacked and deployed the ALSEP: a central radio station, a nuclear power generator and several instruments, linked by cables and spread out on the surface.",
      },
    ],
    scientificContribution:
      "Apollo 12's seismometer recorded moonquakes and meteoroid impacts and, together with later stations, helped reveal the Moon's internal layers. When the lunar module's ascent stage was deliberately crashed into the Moon, the seismometer recorded vibrations that continued for close to an hour, showing the Moon's crust carries seismic waves very differently from Earth's.",
    eli10: {
      paragraphs: [
        "ALSEP was not one machine. It was a little science camp: a group of instruments, each with its own job, connected to a central box that talked to Earth by radio.",
        "One instrument felt tiny shakes in the ground. Another measured magnetism. Others measured the gas and particles flowing from the Sun. A small nuclear power unit kept everything running day and night.",
      ],
      comparison: "Think of a weather station in your schoolyard, but on the Moon, run by remote control from a quarter of a million miles away.",
      question: "If you could leave one instrument on the Moon, what would you want it to measure?",
    },
    scientist: [
      {
        heading: "Instrument suite",
        text:
          "Apollo 12's ALSEP included a Passive Seismic Experiment, Lunar Surface Magnetometer, Solar Wind Spectrometer, Suprathermal Ion Detector with a Cold Cathode Gauge, and a dust detector, all reporting through the Central Station.",
      },
      {
        heading: "Power",
        text:
          "A SNAP-27 radioisotope thermoelectric generator, fuelled with plutonium-238, converted decay heat into electricity, so the station could keep working through the two-week lunar night.",
      },
      {
        heading: "Artificial moonquake",
        text:
          "Crashing the spent ascent stage at a known time and place gave seismologists a controlled source, letting them study how waves travel through the lunar crust.",
      },
    ],
    didYouKnow: [
      { front: "Why didn't Apollo 12 send colour TV from the surface?", back: "The colour TV camera was damaged early in the first moonwalk when it was pointed toward the Sun." },
      { front: "Did the crew visit another spacecraft?", back: "Yes. On their second moonwalk Conrad and Bean walked to Surveyor 3 and brought some of its parts back to Earth for study." },
      { front: "How long did the station work?", back: "From November 1969 until NASA switched the ALSEP network off on 30 September 1977." },
    ],
    timeline: [
      { date: "14 Nov 1969", label: "Launch", detail: "Lightning strikes the rocket twice during ascent." },
      { date: "19 Nov 1969", label: "Landing & ALSEP deployment", detail: "Intrepid lands; the crew deploys ALSEP on the first moonwalk." },
      { date: "20 Nov 1969", label: "Visit to Surveyor 3", detail: "Second moonwalk; later the ascent stage is crashed for a seismic test." },
      { date: "24 Nov 1969", label: "Splashdown" },
      { date: "30 Sep 1977", label: "Network switched off", detail: "NASA ends ALSEP operations." },
    ],
    images: [
      nasaImage("as12-47-6919", "medium", "Alan Bean deploys ALSEP components during the first Apollo 12 moonwalk.", "1969-11-19"),
      nasaImage("as12-47-6918", "medium", "Three components of the deployed Apollo 12 ALSEP, photographed by Bean.", "1969-11-19"),
    ],
    thenNow: {
      then: nasaImage("as12-47-6919", "medium", "Deploying ALSEP, 19 November 1969.", "1969-11-19"),
      now: nasaImage("PIA12922", "small", "\"Apollo 12 Second Look: Midday on the Ocean of Storms\" — Lunar Reconnaissance Orbiter view of the landing site.", "2009-11-04", "NASA/GSFC/Arizona State University"),
      changed:
        "The 1969 photo was taken on the ground; the 2009 view looks straight down from orbit. At this scale the station is only a few bright pixels, so CosmoSmriti does not point to a specific spot in the image.",
      knownToday:
        "The Lunar Reconnaissance Orbiter Camera team has imaged every Apollo landing site, including Apollo 12's. The station remains where it was deployed and has been switched off since 1977.",
    },
    lastSignal: ALSEP_SHUTDOWN,
    components: [
      { name: "Central Station", purpose: "Collect data from every instrument and talk to Earth.", how: "Received commands from Earth and transmitted instrument measurements by radio.", kid: "The camp's walkie-talkie and brain.", anchor: [0, 0.6, 0] },
      { name: "Passive Seismometer", purpose: "Detect moonquakes and impacts.", how: "Extremely sensitive sensors recorded tiny ground motions.", kid: "A super-sensitive ear pressed to the ground.", anchor: [2.3, 0.35, 1.4] },
      { name: "Lunar Surface Magnetometer", purpose: "Measure magnetic fields at the surface.", how: "Sensors on three arms measured field strength and direction.", kid: "A compass that measures how strong magnetism is.", anchor: [1.8, 0.6, -1.8] },
      { name: "SNAP-27 power generator", purpose: "Provide steady electrical power.", how: "Converted heat from radioactive decay into electricity.", kid: "A battery that keeps warm and never needs sunlight.", anchor: [-2.6, 0.85, 0.8] },
    ],
    reconstruction: { kind: "alsep" },
    sources: [src.missionPage(12), src.alsj(12), src.nssdca("1969-099C", "Apollo 12 Lunar Module"), src.apolloIndex, src.lroc, src.image("PIA12922", "Apollo 12 Second Look: Midday on the Ocean of Storms")],
  },
  {
    id: "apollo-14-alsep",
    number: 3,
    planet: "moon",
    officialName: "Apollo 14 ALSEP — Apollo Lunar Surface Experiments Package",
    shortName: "Apollo 14 ALSEP",
    missionName: "Apollo 14",
    missionYear: 1971,
    category: "Scientific instrument collection",
    coordinates: { lat: -3.6453, lon: -17.4714 },
    coordinateSystem: "Mean Earth / polar axis, planetocentric degrees",
    coordinateAccuracy: "landing-site",
    coordinateNote:
      "Coordinate of the Apollo 14 lunar module landing site. The ALSEP was deployed nearby, so this marks the instruments' approximate location.",
    landingSite: "Fra Mauro highlands",
    status: "instruments-switched-off",
    statusExplanation:
      "A collection of instruments deliberately deployed to operate after the crew left. Switched off with the rest of the ALSEP network in 1977.",
    purpose: "Extend lunar science with new experiments in the Fra Mauro highlands.",
    teaser: "The station that turned the Moon into a two-point listening network.",
    story: [
      {
        heading: "The target Apollo 13 never reached",
        text:
          "Fra Mauro had been the destination of Apollo 13 before its oxygen tank failure. Apollo 14 took on the target, landing there on 5 February 1971 with Alan Shepard and Edgar Mitchell aboard the lunar module Antares.",
      },
      {
        heading: "Science on the first moonwalk",
        text:
          "On their first moonwalk, the crew deployed the ALSEP. With the Apollo 12 station already operating, the Moon now had more than one seismic listening post.",
      },
      {
        heading: "A geology hike",
        text:
          "On the second moonwalk, Shepard and Mitchell pulled a two-wheeled cart, the Modular Equipment Transporter, toward the rim of Cone crater, collecting samples on the way.",
      },
    ],
    scientificContribution:
      "Apollo 14's instruments added a second seismic station and active seismic measurements of the shallow subsurface, plus measurements of charged particles and the extremely thin lunar atmosphere. The crew returned about 42 kg of samples from the Fra Mauro region.",
    eli10: {
      paragraphs: [
        "If you hear a sound with one ear, it's hard to tell where it came from. With two ears, your brain can work it out. Scientists wanted the Moon to have more than one 'ear'.",
        "Apollo 14 left a second science camp on the Moon. Now scientists had multiple stations listening to moonquakes, which made it easier to work out where they came from.",
      ],
      comparison: "Like two friends standing in different places, both listening for the same thunderclap.",
      question: "How could tapping the ground and listening to echoes tell you what's underneath?",
    },
    scientist: [
      {
        heading: "Instrument suite",
        text:
          "Apollo 14's ALSEP included a Passive Seismic Experiment, an Active Seismic Experiment, a Suprathermal Ion Detector, a Cold Cathode Gauge and a Charged Particle Lunar Environment Experiment.",
      },
      {
        heading: "Active seismology",
        text:
          "Mitchell used a hand-held 'thumper' to fire small charges along a line of geophones. Timing the arrival of the waves revealed the thickness of the loose surface layer.",
      },
      {
        heading: "Not part of ALSEP",
        text:
          "A laser ranging retroreflector was also left at Fra Mauro. It is a passive mirror array, separate from the ALSEP, and is still used by observatories today.",
      },
    ],
    didYouKnow: [
      { front: "Did someone play golf on the Moon?", back: "Yes. Alan Shepard attached a golf club head to a sample-collecting tool and hit golf balls at the end of the second moonwalk." },
      { front: "Who was Alan Shepard?", back: "In 1961 he became the first American in space. Ten years later he walked on the Moon as Apollo 14's commander." },
      { front: "What did the cart carry?", back: "The Modular Equipment Transporter carried tools, cameras and sample bags, a bit like a garden cart." },
    ],
    timeline: [
      { date: "31 Jan 1971", label: "Launch" },
      { date: "5 Feb 1971", label: "Landing & ALSEP", detail: "Antares lands at Fra Mauro; ALSEP deployed on the first moonwalk." },
      { date: "6 Feb 1971", label: "Cone crater traverse", detail: "Second moonwalk with the hand-pulled cart." },
      { date: "9 Feb 1971", label: "Splashdown" },
      { date: "30 Sep 1977", label: "Network switched off", detail: "NASA ends ALSEP operations." },
    ],
    images: [
      nasaImage("as14-67-09361", "medium", "Two ALSEP components deployed by the Apollo 14 crew on their first moonwalk.", "1971-02-05"),
      nasaImage("as14-67-09379", "medium", "Close-up of the Apollo 14 ALSEP Central Station.", "1971-02-05"),
    ],
    thenNow: {
      then: nasaImage("as14-67-09379", "medium", "ALSEP Central Station, 5 February 1971.", "1971-02-05"),
      now: nasaImage("PIA12889", "orig", "\"LROC First Look at the Apollo Landing Sites\" — the Apollo 14 site, with the ALSEP and the descent stage of Antares labelled by NASA.", "2009-07-17", "NASA/GSFC/Arizona State University"),
      changed:
        "The 1971 photo is a close-up on the ground; the 2009 image looks down from orbit, where the whole station is a tiny bright speck. The labels and the 100-metre scale bar are part of NASA's image.",
      knownToday: "The ALSEP and the descent stage are still where the crew left them. The station was switched off in 1977.",
    },
    lastSignal: ALSEP_SHUTDOWN,
    components: [
      { name: "Central Station", purpose: "Coordinate the instruments and radio data to Earth.", how: "Distributed power and relayed measurements and commands.", kid: "The science camp's control box.", anchor: [0, 0.6, 0] },
      { name: "Active Seismic Experiment", purpose: "Study the layers just below the surface.", how: "Small charges created vibrations measured by a line of geophones.", kid: "Tapping the ground and listening for the echo.", anchor: [2.2, 0.15, -1.4] },
      { name: "Charged Particle Lunar Environment Experiment", purpose: "Measure electrons and protons hitting the Moon.", how: "Detectors counted charged particles arriving at the surface.", kid: "A counter for tiny space particles.", anchor: [1.5, 0.45, 1.3] },
      { name: "Cold Cathode Gauge", purpose: "Measure the Moon's extremely thin atmosphere.", how: "Measured gas pressure far lower than anything natural on Earth.", kid: "Checks how close to 'nothing' the Moon's air is.", anchor: [-1.4, 0.4, -1.5] },
    ],
    reconstruction: { kind: "alsep-a14" },
    sources: [src.missionPage(14), src.alsj(14), src.nssdca("1971-008C", "Apollo 14 Lunar Module"), src.apolloIndex, src.lroc, src.image("PIA12889", "LROC First Look at the Apollo Landing Sites")],
  },
  {
    id: "apollo-15-lrv",
    number: 4,
    planet: "moon",
    officialName: "Apollo 15 Lunar Roving Vehicle (LRV-1)",
    shortName: "Lunar Roving Vehicle",
    missionName: "Apollo 15",
    missionYear: 1971,
    category: "Crewed surface vehicle",
    coordinates: { lat: 26.1322, lon: 3.6339 },
    coordinateSystem: "Mean Earth / polar axis, planetocentric degrees",
    coordinateAccuracy: "landing-site",
    coordinateNote:
      "Coordinate of the Apollo 15 lunar module landing site. The rover was parked near the lunar module at the end of the mission; this is not its exact parking position.",
    landingSite: "Hadley–Apennine",
    status: "left-by-design",
    statusExplanation:
      "Deliberately left behind. The rover was designed for one-way use; bringing it home was never planned. Its last job was televising the crew's liftoff.",
    purpose: "Let astronauts travel much farther from the lunar module and carry more tools and samples.",
    teaser: "The first car driven on the Moon.",
    story: [
      {
        heading: "Folded like origami",
        text:
          "The Lunar Roving Vehicle travelled to the Moon folded up and strapped to the side of the lunar module Falcon. On the surface, Dave Scott and Jim Irwin pulled straps that let it unfold and drop into place.",
      },
      {
        heading: "Driving Hadley",
        text:
          "Over three moonwalks in July and August 1971, the crew drove 27.8 km in about three hours of driving, reaching up to 5 km from the lunar module beneath the Apennine mountains and along Hadley Rille.",
      },
      {
        heading: "One last broadcast",
        text:
          "Before leaving, the crew parked the rover with its TV camera facing the lunar module. Flight controllers in Houston operated the camera remotely to televise Falcon's ascent stage lifting off.",
      },
    ],
    scientificContribution:
      "The rover turned short walks into geology field trips. Apollo 15 collected about 77 kg of samples, including the anorthosite sample nicknamed the 'Genesis Rock', which helped scientists understand the Moon's early crust.",
    eli10: {
      paragraphs: [
        "Walking in a spacesuit is tiring and slow. The rover was an electric car that let astronauts zoom across the Moon to see far more places.",
        "It had four wire-mesh wheels instead of rubber tyres, because rubber could not cope with the Moon's temperatures and there is no air to fill a tyre.",
      ],
      comparison: "Like swapping walking for a bike on a long school trip: you see far more before the bell rings.",
      question: "Why would wheels made of woven wire work better than rubber tyres on the Moon?",
    },
    scientist: [
      {
        heading: "Mobility",
        text:
          "Each wheel had its own 0.25 hp electric motor driving through a harmonic drive, with front and rear steering. Two 36-volt silver-zinc batteries (non-rechargeable) powered everything.",
      },
      {
        heading: "Mass and capacity",
        text:
          "The LRV had a mass of about 210 kg and could carry about 490 kg of astronauts, tools and samples. The frame was about 3.1 m long with a 2.3 m wheelbase.",
      },
      {
        heading: "Wheels",
        text:
          "Tyres of woven zinc-coated steel strands, 81.8 cm across, with titanium chevrons for grip, replaced pneumatic tyres that could not work in a vacuum.",
      },
    ],
    didYouKnow: [
      { front: "How did astronauts steer it?", back: "With a T-shaped hand controller between the seats: push forward to go, pull back to slow, tilt left or right to turn." },
      { front: "How many rovers are on the Moon?", back: "Three Apollo rovers were driven on the Moon: on Apollo 15, 16 and 17. All three are still there." },
      { front: "What happened when Scott dropped a hammer and a feather?", back: "On the last moonwalk he dropped them together, and with no air resistance they hit the ground at the same time, as Galileo predicted." },
    ],
    timeline: [
      { date: "26 Jul 1971", label: "Launch" },
      { date: "30 Jul 1971", label: "Landing at Hadley", detail: "Falcon touches down beside the Apennine mountains." },
      { date: "31 Jul 1971", label: "First lunar drive", detail: "The rover is unfolded and driven on the first moonwalk." },
      { date: "2 Aug 1971", label: "Liftoff televised", detail: "The rover's remotely operated camera shows the ascent." },
      { date: "7 Aug 1971", label: "Splashdown" },
    ],
    images: [
      nasaImage("as15-86-11603", "medium", "Jim Irwin works at the Lunar Roving Vehicle on the first Apollo 15 moonwalk.", "1971-07-31"),
      nasaImage("7022585", "medium", "The Apollo 15 Lunar Roving Vehicle on the Moon.", "1971-08-01"),
    ],
    thenNow: {
      then: nasaImage("as15-86-11603", "medium", "At work with the rover, 31 July 1971.", "1971-07-31"),
      now: nasaImage("GSFC_20171208_Archive_e001054", "small", "\"Soaring Over Lunar Mt. Hadley\" — Lunar Reconnaissance Orbiter oblique view toward Hadley Rille (date is NASA's archive date).", "2017-12-08", "NASA/Goddard/Arizona State University"),
      changed:
        "This orbital view shows the landscape around Hadley Base, between the Apennine mountains and Hadley Rille. The rover itself is far too small to see at this scale; the image shows where it is, not the rover.",
      knownToday: "The rover remains parked near the landing site at Hadley. LROC close-up images of the site are available through the Evidence Center.",
    },
    lastSignal: {
      available: true,
      date: "2 August 1971",
      context: "The rover carried a TV camera that flight controllers on Earth could point remotely.",
      whatHappened:
        "Its final documented job was televising the liftoff of the ascent stage of Falcon, operated from Mission Control in Houston.",
      afterward:
        "The rover was left parked at Hadley. It has non-rechargeable batteries and is inactive. CosmoSmriti does not have a verified record of its last individual transmission, so none is shown.",
    },
    components: [
      { name: "Wire-mesh wheels", purpose: "Grip loose lunar soil without air-filled tyres.", how: "Woven zinc-coated steel strands with titanium chevron treads.", kid: "Wheels made of metal 'fabric', like a springy basket.", anchor: [1.15, 0.41, 1.0] },
      { name: "Hub motors", purpose: "Drive each wheel independently.", how: "An electric motor on every wheel; if one failed, the others kept going.", kid: "Every wheel has its own little engine.", anchor: [-1.15, 0.41, -0.95] },
      { name: "Hand controller", purpose: "Steer, accelerate and brake.", how: "A single T-shaped stick between the seats controlled all motors.", kid: "A joystick, like a video game!", anchor: [0.3, 0.95, 0] },
      { name: "High-gain antenna & TV camera", purpose: "Send live TV and voice to Earth.", how: "A mesh dish antenna; Houston could aim the camera remotely.", kid: "A satellite dish so Earth could watch.", anchor: [1.25, 2.2, 0] },
    ],
    reconstruction: { kind: "lrv" },
    sources: [src.missionPage(15), src.alsj(15), src.lrv, src.nssdca("1971-063C", "Apollo 15 Lunar Module"), src.lroc, src.image("GSFC_20171208_Archive_e001054", "Soaring Over Lunar Mt. Hadley")],
  },
  {
    id: "apollo-17-challenger",
    number: 5,
    planet: "moon",
    officialName: "Apollo 17 Lunar Module Challenger — Descent Stage",
    shortName: "Challenger Descent Stage",
    missionName: "Apollo 17",
    missionYear: 1972,
    category: "Crewed lander (descent stage)",
    coordinates: { lat: 20.1908, lon: 30.7717 },
    coordinateSystem: "Mean Earth / polar axis, planetocentric degrees",
    coordinateAccuracy: "orbital-measured",
    coordinateNote:
      "Lander position as measured in Lunar Reconnaissance Orbiter imagery, rounded to four decimals.",
    landingSite: "Taurus–Littrow valley",
    status: "left-by-design",
    statusExplanation:
      "Deliberately left behind as the launch platform for the last Apollo crew's ascent stage.",
    purpose: "Land the final Apollo crew and support the longest stay on the Moon.",
    teaser: "The last place humans launched from the Moon.",
    story: [
      {
        heading: "The final landing",
        text:
          "On 11 December 1972, Gene Cernan and geologist Harrison Schmitt landed Challenger in the Taurus–Littrow valley while Ronald Evans orbited in America. Schmitt was the first professional scientist to walk on the Moon.",
      },
      {
        heading: "Three days in the valley",
        text:
          "The crew spent about 75 hours on the surface and over 22 hours outside on three moonwalks, driving a rover between boulders, craters and mountains. Near Shorty crater, Schmitt spotted orange soil.",
      },
      {
        heading: "Leaving the last base",
        text:
          "On 14 December 1972, Challenger's ascent stage lifted off, filmed by the rover's camera. The descent stage remains with a plaque that reads in part: \"Here man completed his first exploration of the Moon, December 1972 A.D.\"",
      },
    ],
    scientificContribution:
      "Apollo 17 returned about 110 kg of samples, the most of any Apollo mission. The orange soil turned out to be tiny beads of volcanic glass, evidence of ancient fire-fountain eruptions on the Moon.",
    eli10: {
      paragraphs: [
        "Apollo 17 was the last time people visited the Moon in the 20th century. One of the explorers was a rock expert, a geologist, who knew exactly what to look for.",
        "He found orange dirt! Scientists later learned it was made of tiny glass beads sprayed out by volcanoes long, long ago.",
      ],
      comparison: "Like bringing a fossil expert on a dinosaur dig: you find things everyone else would walk past.",
      question: "Why might it help to send a scientist, not only pilots, to explore another world?",
    },
    scientist: [
      { heading: "Landing site selection", text: "Taurus–Littrow offered both ancient highland material and younger volcanic deposits, so one site could sample very different geology." },
      { heading: "Volcanic glass", text: "The orange soil is composed of small glass beads formed during explosive volcanic eruptions, valuable for understanding the Moon's interior." },
      { heading: "Descent stage as heritage", text: "Like Apollo 11's, Challenger's descent stage contained the landing engine and legs and served as the launch platform for the ascent stage." },
    ],
    didYouKnow: [
      { front: "Was this a night launch?", back: "Yes. Apollo 17 was the first crewed US launch to lift off at night, on 7 December 1972." },
      { front: "How far did Apollo 17's rover travel?", back: "About 35.9 km across three drives, the farthest of the three Apollo rovers." },
      { front: "Can you see the descent stage today?", back: "Yes. NASA's Lunar Reconnaissance Orbiter has photographed it from orbit, along with rover tracks." },
    ],
    timeline: [
      { date: "7 Dec 1972", label: "Night launch" },
      { date: "11 Dec 1972", label: "Challenger lands", detail: "Touchdown in the Taurus–Littrow valley." },
      { date: "12 Dec 1972", label: "Orange soil", detail: "Discovered at Shorty crater on the second moonwalk." },
      { date: "14 Dec 1972", label: "Final lunar liftoff", detail: "The descent stage remains." },
      { date: "19 Dec 1972", label: "Splashdown" },
      { date: "2009", label: "Seen from orbit", detail: "LRO resolves the descent stage." },
    ],
    images: [
      nasaImage("S72-55421", "medium", "Challenger's ascent stage lifts off, from the rover's colour TV transmission.", "1972-12-14"),
      nasaImage("S72-55169", "medium", "Replica of the plaque left on Challenger's descent stage.", "1972-12-13"),
    ],
    thenNow: {
      then: nasaImage("S72-55421", "medium", "Liftoff seen by the rover's TV camera, 14 December 1972.", "1972-12-14"),
      now: nasaImage("PIA12920", "small", "\"Exploring the Apollo 17 Site\" — LRO view of the descent stage.", "2009-10-28"),
      changed:
        "The 1972 view is from a TV camera on the surface; the 2009 view looks down from orbit. They are different viewpoints of the same site.",
      knownToday: "The descent stage remains in place; orbital images also show tracks from the astronauts and rover.",
    },
    lastSignal: {
      available: false,
      context: "The descent stage had no radio of its own during the mission.",
      whatHappened: "Its last documented role was serving as the launch platform on 14 December 1972.",
      afterward: "There is no artifact-specific final signal, so CosmoSmriti does not invent one.",
    },
    components: [
      { name: "Descent engine", purpose: "Control the landing.", how: "Throttleable rocket engine for braking and hovering.", kid: "The rocket that made a soft landing.", anchor: [0, 0.95, 0], nasaAnchor: [0, 0.75, 0] },
      { name: "Landing legs", purpose: "Hold the lander level on the surface.", how: "Four crushable legs absorbed landing shock.", kid: "Legs with built-in cushions.", anchor: [1.77, 0.15, 1.77], nasaAnchor: [2.75, 0.25, 0] },
      { name: "Equipment bays", purpose: "Carry tools, experiments and the folded rover.", how: "Storage compartments around the descent stage.", kid: "Cupboards on the outside of the spaceship.", anchor: [0, 1.9, 1.5], nasaAnchor: [1.45, 1.4, 1.45] },
      { name: "Plaque", purpose: "Mark the end of Apollo's lunar exploration.", how: "A plaque mounted on the descent stage.", kid: "A goodbye note on the Moon.", anchor: [1.5, 1.9, 0] },
    ],
    reconstruction: {
      kind: "lm-descent",
      nasaModel: {
        id: "apollo-lunar-module",
        descentStageOnly: true,
        note: "NASA's generic Apollo Lunar Module model, not a scan of Challenger. Apollo 17 flew an upgraded lunar module that carried the rover, so some details differ. Only the descent stage is shown, because the ascent stage lifted off.",
      },
    },
    sources: [
      src.missionPage(17),
      src.alsj(17),
      src.nssdca("1972-096C", "Apollo 17 Lunar Module Challenger"),
      src.image("PIA12920", "Exploring the Apollo 17 Site"),
      src.lrv,
      src.nasa3d("Apollo Lunar Module", "https://science.nasa.gov/3d-resources/apollo-lunar-module/"),
    ],
  },
];
