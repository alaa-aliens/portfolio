/*
 * The UX layer of each case study: who it was for, what was in the way,
 * the flow before and after, constraints, references, structure, the system
 * and what I took away. Shown in the calm (professional) case study layout.
 * Keyed by project slug.
 */

export interface CaseStudyUX {
  glance: { problem: string; users: string; role: string; outcome: string };
  flow?: { before: string[]; after: string[] };
  users?: { who: string; context: string; needs: string[] }[];
  goals?: string[];
  constraints?: string[];
  research?: { title?: string; intro: string; refs: { name: string; take: string }[] };
  ia?: { intro: string; groups: { name: string; items: string[] }[] };
  system?: { type: { name: string; use: string }[]; colors: { name: string; hex?: string; use: string }[]; rules: string[] };
  learned?: string[];
}

export const CASE_UX: Record<string, CaseStudyUX> = {
  carseer: {
    glance: {
      problem: "The site buried the VIN field behind marketing pages, and the report read like a database dump. Buyers had to decode it instead of deciding.",
      users: "Used-car buyers checking one car or comparing a few, often on a phone next to the car. And dealers who check cars for a living.",
      role: "Product design: website and report redesign, a small set of brand tokens, every page at desktop and mobile.",
      outcome: "From VIN to report with nothing in between, and a report that opens with a verdict a worried person can read in a car park.",
    },
    flow: {
      before: [
        "Finds a car and wants to know if it's hiding something",
        "Lands on the site and hunts for where the VIN goes",
        "Picks a package without knowing what's inside",
        "Gets a 40-row table in 9pt",
        "Calls a friend who 'knows cars'",
      ],
      after: [
        "Types a VIN or plate on any page",
        "Sees the car it found",
        "Picks a package written for their situation",
        "Reads the verdict strip: accidents, odometer, title, recalls",
        "Saves it to My Garage to compare later",
      ],
    },
    users: [
      { who: "The nervous buyer", context: "Standing next to a used car, on a phone, deciding whether to trust the seller.", needs: ["A clear answer before the details", "Plain words instead of data fields", "Something readable on a small screen, outdoors"] },
      { who: "The shopper", context: "Weeks of looking, several candidates at once.", needs: ["Every checked car in one place", "Compare at a glance, not across a folder of PDFs"] },
      { who: "The dealer", context: "Checks cars every week as part of the job.", needs: ["A package for volume: \"I sell cars\"", "Business and API options without digging"] },
    ],
    goals: ["VIN to report with nothing in between", "A report a worried person understands the first time", "Every page designed for the phone, not squeezed onto it"],
    constraints: ["Search traffic lands on VIN and plate pages, not only the homepage", "Twelve pages, each designed at 1512 and again at 393", "A warm, orange brand, so orange had to mean something specific"],
    ia: {
      intro: "Twelve pages organised around one question: what's the car?",
      groups: [
        { name: "Check a car", items: ["Home, with the VIN or plate field first", "VIN decoding landing page", "Plate lookup landing page"] },
        { name: "The report", items: ["Verdict strip", "History as a timeline", "Report sample"] },
        { name: "Buy & keep", items: ["Pricing, by situation", "My Garage"] },
        { name: "For business", items: ["Business", "APIs"] },
      ],
    },
    system: {
      type: [{ name: "Inter", use: "One family for everything, from verdicts to fine print" }],
      colors: [
        { name: "Orange", hex: "#F97316", use: "Only for things you should look at" },
        { name: "Dark", hex: "#0D0D0D", use: "Text and dark sections" },
        { name: "Surface", hex: "#1A1A1A", use: "Cards on dark" },
        { name: "Warm white", hex: "#F5F4F0", use: "Page background" },
      ],
      rules: ["Orange has one job", "Verdict first, evidence second", "Packages are written for situations, not as feature grids", "The mobile menu is a full-screen sheet with the VIN field in it"],
    },
    learned: [
      "The website was the easy part. The report was the product, so it got its own brief.",
      "A short state document between rounds kept twelve pages consistent through many iterations.",
      "Small details, like carousel arrows sitting on each side of the cards, are what make a site feel designed.",
    ],
  },

  trackhawk: {
    glance: {
      problem: "Live tracking, the one job everyone opens the app for, was spread across many pages, behind a flat menu of a dozen items, with data shown raw.",
      users: "Dispatchers and owners watching fleets of trucks, trailers and generators. People who aren't tech people.",
      role: "UI lead: wireframes, information architecture and the UI system.",
      outcome: "One live-tracking page that holds up at 12, 40 or 100 units, and a menu that reads like the dispatcher's day.",
    },
    flow: {
      before: ["Dispatcher wants to know where truck 14 is", "Finds the map, but the unit's details live on another page", "Alerts, geofences and history are each on their own page", "By the time he's sure, the truck has moved"],
      after: ["Opens Live Tracking", "Picks truck 14 from the fleet list beside the map", "Its details, status and alerts open in the same view"],
    },
    users: [
      { who: "The dispatcher", context: "Watches the live map for most of the shift.", needs: ["Where a unit is, right now", "Its details without leaving the map", "Alerts that don't cry wolf"] },
      { who: "The owner or manager", context: "Checks in, rather than watching all day.", needs: ["The handful of numbers that matter, first", "The full table only when needed"] },
      { who: "The night shift", context: "Works while the office is dark.", needs: ["A dark theme that's as clear as the light one"] },
    ],
    goals: ["Minimal", "Easy access", "Group the data for people who aren't tech people"],
    constraints: ["No new features (the one exception: per-unit alert settings, because users kept asking)", "The same page must work for fleets of 12, 40 and 100 units", "Desktop only, for now", "A tracking product, not a delivery app: no delivery-lifecycle patterns"],
    research: {
      intro: "Two benchmarks sat next to the wireframes, with a borrow / adapt / skip verdict written next to every pattern we looked at.",
      refs: [
        { name: "Hapn", take: "Clarity of the live experience. Clear, and we could do better." },
        { name: "Samsara", take: "The closest product to Trackhawk, \"much like us\". Used to confirm structure." },
      ],
    },
    ia: {
      intro: "Same features, zero new ones. The flat menu became four groups.",
      groups: [
        { name: "Operations", items: ["Live tracking", "Alerts: overview and logs", "Maintenance"] },
        { name: "Management", items: ["Units", "Trackers", "Geofences", "Automations"] },
        { name: "Insights", items: ["History", "Reports"] },
        { name: "Settings", items: ["Account and preferences"] },
      ],
    },
    system: {
      type: [
        { name: "Archivo", use: "Display and numerals" },
        { name: "Inter", use: "Interface" },
        { name: "Geist Mono", use: "Machine data: coordinates, IMEIs" },
      ],
      colors: [
        { name: "Ink", use: "Primary buttons" },
        { name: "Orange", use: "Live, right now, and the active nav item" },
      ],
      rules: ["Orange means live, nothing else", "Light by default, with a dark theme for the night shift", "Report pages open with numbers, then the table", "Structure agreed in grey before any colour"],
    },
    learned: [
      "\"Don't add anything\" forced every improvement to come from arrangement, grouping and restraint.",
      "Designing for 100 units caught problems that 12 never would.",
      "Agreeing structure in grey boxes kept the meetings about structure, not about the blue.",
    ],
  },

  siba: {
    glance: {
      problem: "Studying ran through photos in a chat, quizzes made by hand and marked every evening. Nothing was saved, and nobody else could see progress.",
      users: "Two daughters of different ages, and the parents who stay in control of what they study.",
      role: "Product design, the character and sound, and the build.",
      outcome: "One place where each child studies a lesson in seven ways, and where a parent checks and publishes every lesson.",
    },
    flow: {
      before: ["The girls photograph their textbook pages", "I turn the pages into a summary and a quiz", "Send it over iMessage", "Mark every answer by hand at night", "Repeat for 2 kids, every subject, every week"],
      after: ["Either side uploads the pages", "A draft lesson is prepared", "The parent checks four sections and publishes", "The child studies: read, cards, match, order, mind map, listen, quiz", "Answers are scored, wrong ones reviewed, retries allowed"],
    },
    users: [
      { who: "Alma", context: "The older one. Reads everything, plays the piano.", needs: ["A reason to open it without being asked", "Progress she can see", "Her name, said by a friendly voice"] },
      { who: "Eleen", context: "The youngest tester, with her own early-years mode.", needs: ["The summary read aloud", "Tap, don't type", "No red, and never the word \"exam\""] },
      { who: "The parent", context: "Checks every lesson before it reaches a child.", needs: ["Each child's progress and what needs review, on one screen", "A review that can't be skipped by accident"] },
    ],
    goals: ["Each child studies in one place", "A parent stays in control of what's published", "Any subject, in Arabic or English"],
    constraints: [
      "Content language is independent of the interface language, right-to-left and left-to-right",
      "A web app you install on phone and iPad, with no app store",
      "Only a parent publishes, and there's no \"confidence is high, skip the review\" path",
      "One to four children per family",
    ],
    research: {
      title: "references",
      intro: "Before any screens, a competitive feature moodboard, and two products the kids already understood.",
      refs: [
        { name: "Brilliant", take: "Depth on buttons and blocks, badges, progress you can see" },
        { name: "Duolingo", take: "Streaks and points that make coming back feel like a game" },
      ],
    },
    ia: {
      intro: "Two sides of one app: the parent prepares, the child plays.",
      groups: [
        { name: "Parent", items: ["Home: each child's progress and what needs review", "Upload pages", "Review: four sections, four confirmations, then publish"] },
        { name: "Child", items: ["Home: today's lesson, weekly points, lesson list", "Lesson: seven study modes", "Quiz: scoring, wrong-answer review, retry"] },
      ],
    },
    system: {
      type: [{ name: "Rubik", use: "Rounded and friendly, in Arabic and English" }],
      colors: [
        { name: "Siba green", hex: "#0FA37F", use: "Brand and primary actions" },
        { name: "Gold", hex: "#E9A21B", use: "Points, and only points" },
        { name: "Ink", hex: "#14201C", use: "Text" },
      ],
      rules: ["Gold only ever means points", "Chunky buttons with real, solid-edge depth", "Amber, not red, for wrong answers in the young mode", "Sounds reward without startling: a soft \"hmm\", never a buzzer"],
    },
    learned: [
      "Every screen started as a question about one of two real people.",
      "The riskiest part isn't the interface, it's reading real textbook photos well, so that gets tested first.",
      "A study buddy beats a teacher: the character reacts, it never scolds.",
    ],
  },

  "siba-list": {
    glance: {
      problem: "An all-or-nothing allowance rule everyone thought was unfair, proofs lost in a chat, and an argument every Friday.",
      users: "Two daughters with their own phones and private lists, and a dad who approves the proof.",
      role: "Product design, rules design, the design system and the build.",
      outcome: "Points instead of checkmarks, a fair weekly ladder, proof attached to the task, and a Friday that stopped being an argument.",
    },
    flow: {
      before: ["The list lives in a chat", "Proof arrives as screenshots and voice notes, and gets lost", "\"30 minutes of piano\" means dad watching the clock", "Miss one thing, lose the whole allowance", "Friday: argue about what actually happened"],
      after: ["Today's list, with points per task", "Proof attached to the task; the music timer runs in the app", "Dad approves from a review queue (anything ignored for 48 hours approves itself)", "The week lands on a band of the ladder", "Friday payday shows the week and what she kept"],
    },
    users: [
      { who: "Alma", context: "Piano, coding, a language and reading, every week.", needs: ["A bad day that costs a little, not everything", "To see where her week is heading"] },
      { who: "Eleen", context: "Guitar, coding, a language and reading, on her own phone.", needs: ["Her own private list", "A timer that does the watching"] },
      { who: "Dad", context: "Approves proofs and payouts between everything else.", needs: ["One review queue instead of a chat", "Rules the app enforces so he doesn't have to"] },
    ],
    goals: ["Fair: one missed task shouldn't wipe out a week", "Proof that's easy to give and easy to check", "Friday without a negotiation"],
    constraints: ["The girls don't hold cash: points become money, play time or a reward", "Saturday to Friday week; the list closes at 8 PM, bedtime", "Each girl has her own phone and account", "The rules settled before any visual style"],
    research: {
      title: "explorations",
      intro: "Two directions were explored and rejected before landing on plain.",
      refs: [
        { name: "Four metaphors: runway, ladder, proof-first, receipt", take: "Too clever, wrong style, missing states, and the money wasn't on screen" },
        { name: "A child-psychology reframe", take: "Base plus bonus, non-money rewards, kids co-writing the rules. Nice ideas, not what this family needed" },
        { name: "Plain, modelled on shipped apps", take: "The direction that stayed: grounded and boring in the good way" },
      ],
    },
    ia: {
      intro: "Thirty numbered rules first, then two apps that share them.",
      groups: [
        { name: "Her app", items: ["Today", "Week", "Rewards", "Me"] },
        { name: "Dad's app", items: ["Home", "Review", "Requests", "More"] },
        { name: "Getting in", items: ["Parent creates each girl's account", "First-week setup"] },
      ],
    },
    system: {
      type: [{ name: "Rubik", use: "Borrowed from Siba, so the two apps feel like siblings" }],
      colors: [
        { name: "Brand green", hex: "#0FA37F", use: "Primary actions" },
        { name: "Gold", hex: "#E9A21B", use: "Points" },
        { name: "Ink", hex: "#14201C", use: "Text" },
      ],
      rules: ["A perfect week is 240 points; the band decides the share she keeps", "One free pass a week, usable after the fact", "100 points = JD 1; cashing out is a request", "Solid-edge depth, no blurred shadows"],
    },
    learned: [
      "Writing rules is slower than drawing screens, and it's where the real design was.",
      "A proportional cost keeps people trying. All-or-nothing teaches them to give up on Wednesday.",
      "Design the exception on purpose, or users will design it for you.",
    ],
  },
};
