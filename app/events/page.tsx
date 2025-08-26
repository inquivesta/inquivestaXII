"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FadeIn } from "@/components/ui/fade-in"
import { HyperText } from "@/components/ui/hyper-text"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  ExternalLink,
  Share2,
  MapPin,
  Trophy,
  Zap,
  Search,
  Filter,
  LayoutGrid,
  UserCheck,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Event {
  id: string
  name: string
  day: "Day 1" | "Day 2" | "Day 3" | "TBA"
  date: string // e.g., "Feb 15, 2026"
  time: string
  description: string
  detailedDescription: string
  image: string
  category: "Competition" | "Workshop" | "Exhibition" | "Talk" | "Performance" | "Sports Competition" | "Cultural Competition" | "Science Event" | "Engineering Event"
  venue: string
  prizes: string
  registrationLink: string
  socialLink: string
  maxParticipants?: string
  duration: string
  teamSize: string // e.g., "3-4 members", "Individual", "1 member + 1 substitute"
}

const events: Event[] = [
  // {
  //   id: "3v3-basketball",
  //   name: "3V3 Basketball",
  //   day: "TBA", // "Day 1", // Event spans Day 1 & 2, using Day 1 as primary
  //   date: "TBA", // "Feb 15, 2026",
  //   time: "10:00 AM - 06:00 PM",
  //   description: "Three players, one hoop, ten minutes to think and outplay - where instinct and science collide.",
  //   detailedDescription: "Grab your squad and step into the spotlight at Inquivesta's 3v3 Basketball Showdown - the game where speed, teamwork and grit decide it all.\n\nThis isn't a marathon - it's three players, one hoop, ten minutes to think and outplay. Quick passes, bold shots, and relentless energy will be your only allies. No benches to hide behind, no second chances - just you, your teammates, and the clock.\n\nThink you've got the hustle, the reflexes, and the chemistry to dominate the court?\n\n• Played in knockout format with a cap of 16 teams - only the sharpest teams make it to the finals.\n• Game will be controlled by up to 2 referees, table officials and a sports supervisor.\n\nRules at a Glance:\n• Fast-paced half-court play\n• Each match runs for 10 minutes or until a team reaches 21 points\n• In case of a tie, overtime is sudden death - first to score 2 points win\n• Standard FIBA 3v3 scoring and foul rules apply\n• Matches will begin promptly as per schedule and teams are supposed to be present 10 mins before their slot\n• Respect the game, respect the players",
  //   image: "/events/3v3_basketball/3v3_basketball.jpg",
  //   category: "Sports Competition",
  //   venue: "Basketball Court",
  //   prizes: "Winner: ₹6000 + medals, Runners up: ₹3200 + medals, 2nd Runners up: ₹1600 + medals",
  //   registrationLink: "#",
  //   socialLink: "https://www.instagram.com/iiserkbasketball?igsh=MTU0bTVlcmYweWhjNA==",
  //   maxParticipants: "64", // 16 teams * 4 players each
  //   duration: "8 hours",
  //   teamSize: "3 players + 1 substitute",
  // },
  {
    id: "beat-the-drop",
    name: "Beat the Drop",
    day: "TBA", // "Day 2",
    date: "TBA", // "Feb 16, 2026",
    time: "TBA", // "09:00 AM - 02:00 PM",
    description: "Teams design a contraption to prevent an egg from cracking when dropped from a height.",
    detailedDescription: "Get ready for an egg-citing challenge of innovation, engineering, and problem-solving! Teams will build a contraption to protect an egg from a perilous drop using provided materials, each with assigned costs.\n\nGENERAL RULES:\n• Teams can have a minimum of 2 members and a maximum of 4 members\n• A team is eliminated if visible cracks appear on the eggs after the completion of a round\n• Teams that are eliminated cannot compete in subsequent rounds\n• Each team will be provided a list of materials and their cost 15 minutes before the event begins\n• Each team will be given 10 minutes to obtain the materials they want\n• Each team will be given 1 hour to build their contraption and 10 minutes to submit it\n• The contraption must allow access to the egg without modification before each round begins\n• Teams will be provided a 10-minute time limit to make modifications between rounds\n• Teams that fail to submit their contraption within the stipulated time will be disqualified\n\nMATERIAL GUIDELINES:\n• Materials will be preassigned a fixed cost decided by the Event Organizers\n• The list of materials and their cost will be disclosed on the day of the event\n• Each team can only use materials purchased by them in the contraption\n• Teams using materials not purchased by them will be disqualified\n• There will be an upper bound to how many materials of the same kind can be purchased\n\nSCORING GUIDELINES:\n• Points will be awarded to a team if their contraption survives at least the first round\n• Points are calculated using: Let X = your contraption cost, UB = most expensive surviving contraption cost\n• For the first round: Points = 1.1 × UB - X\n• For the second round: Points = 1.5 × UB - X\n• For the third round: Points = 2 × UB - X\n• The team with the highest points wins regardless of the round their contraption survives\n\nTIE-BREAKER PROCEDURE:\n• The contraption that survives the greatest number of rounds wins\n• The contraption that is the least expensive wins\n• If still tied, judges will decide based on logic and innovation behind the design\n• The most innovative design will be decided by judges among contraptions that survive at least the first round\n\nFINAL NOTES:\n• All players are expected to play fairly - unfair play results in disqualification with no refund\n• Points awarded will be unbiased and fair - questioning procedures will be in vain\n• We encourage players to find the perfect way to break the economy of the game\n• The motive is to gain more points, not just win more rounds\n• This event is designed to motivate creativity and critical thinking\n• Have fun while playing, do not foster regrets or jealousy",
    image: "/events/beat_the_drop/beat_the_drop.png",
    category: "Science Event",
    venue: "TBA", // "LHC Cafeteria",
    prizes: "TBA", // "First Place: ₹3000, Second Place: ₹2000, Third Place: ₹1000, Most Innovative Design: ₹2000",
    registrationLink: "#",
    socialLink: "#",
    maxParticipants: "#", // Teams of 2-4 members
    duration: "5 hours",
    teamSize: "2-4 members",
  },
  {
    id: "botprix",
    name: "Botprix",
    day: "TBA", // "Day 3",
    date: "TBA", // "Feb 17, 2026",
    time: "TBA", // "09:00 AM - 06:00 PM",
    description: "Engineer efficient bots to navigate a challenging racetrack with hurdles and time penalties!",
    detailedDescription: "Botprix is a competition for creative minds to engineer efficient and innovative solutions in the form of bots to navigate a predefined racetrack comprising hurdles of various kinds. The races will be timed, and whoever finishes fastest takes home the prize!\n\nPARTICIPATION:\nNo matter whether you're a student at IISER Kolkata, a different college or even a robotics-lover from a school - you're welcome to participate! Just make a team of 3-4 members, and you're good to go, no registration fees! But hurry up - only 35 teams will be taken on a first come first serve basis!\n\nFORMAT:\nYou will have to come and set up your bots, with some time for calibration and testing, followed by actual driving on a predefined racetrack. The races will be timed. The racetrack will have various sections (the details of which will be intimated 2 months before the race), and each can be skipped if the driver feels so, along with an associated time penalty depending on the difficulty of the section skipped. After all the races are done, the results will be declared based on the time taken by each bot, along with felicitation of winners.\n\nTIMELINE:\n9:00am - 10:00am - Reporting\n10:00am - 11:00am - Slot allotment and bot calibration and testing begins\n11:00am - 4:30pm - Races take place\n4:30pm - 5:00pm - Break\n5:00pm - 6:00pm - Declaration of winners and felicitation ceremony\n\nRULES AND REGULATIONS:\nParticipants must bring their own bots, with the following restrictions:\n• Bots (exclusive of controller weight) should not weigh more than 5kg\n• Should not use batteries of more than 18 volts\n• Bot dimensions should be within 30cm × 30cm × 30cm (with ~5% tolerance)\n• Both wired and wireless modes of communication can be used to control the bot\n• Bot may have any mechanism to enable it to traverse the hurdles and perform the tasks but these mechanisms should follow the above size restrictions\n• Any damage caused to the arena by the robot will lead to immediate penalization and may cause elimination\n• Wires connecting the robot to the external power source must remain slack throughout the run\n• Participants with complete ready-made robo-kits or robots with internal combustion engines will strictly not be allowed\n• In case of any dispute, the judgement of the Botprix organising committee shall be final and binding\n\nPRIZES AND REWARDS:\nAll participants will receive a Certificate of Appreciation (via email), while the winner, runners-up and 2nd runners-up will receive Certificates of Excellence (on the spot) along with cash prizes. All participants will receive some surprise rewards for every section of the racetrack crossed!",
    image: "/events/botprix/botprix.png",
    category: "Engineering Event",
    venue: "TBA", // "LHC Canteen Area",
    prizes: "TBA", // "1st Position: ₹5,000, 2nd Position: ₹3,000, 3rd Position: ₹2,000",
    registrationLink: "#",
    socialLink: "https://www.instagram.com/inquivesta_iiserk/",
    maxParticipants: "140", // 35 teams * 4 members max
    duration: "9 hours",
    teamSize: "3-4 members",
  },
  {
    id: "bullseye",
    name: "Bullseye",
    day: "TBA", // "Day 1", // Day 1/2 TBD, using Day 1
    date: "TBA", // "Feb 15, 2026",
    time: "TBA", // "TBD",
    description: "Not your regular archery competition — a fun, hands-on event blending aim, creativity, and problem-solving.",
    detailedDescription: "Bullseye is not your regular archery competition — it's a fun, hands-on event blending aim, creativity, and problem-solving.\n\nEVENT COMPONENTS:\n\n• Workshop: Physics of Archery\nIntroduces participants to the science of archery — projectile motion, aerodynamics, center of mass, and stability. Includes a hands-on demo to design a simple bow, and instructions to balance arrows effectively.\n\n• ArrowCraft (Build Your Own Arrow)\nParticipants will use simple materials like paper, straws, feathers, and tape to build their own arrows. Each arrow will be tested for flight stability, distance, and design explanation.\n\n• Target Tac-Toe (Archery Tic-Tac-Toe)\nA giant 3×3 board will act as the game grid. Participants take turns shooting arrows to claim cells. First to get three in a row wins the round.\n\n• Cup Knockdown Challenge\nPaper cups will be stacked like bowling pins. Participants aim to knock down as many as possible within the time limit, testing power, momentum, and accuracy.\n\nELIGIBILITY:\nOpen to all IISER Kolkata students and participants from other schools/colleges.\n\nREGISTRATION:\nThrough Google Form (spot registration allowed on a first-come, first-serve basis).",
    image: "/events/bulls_eye/bulls_eye.jpg",
    category: "Science Event",
    venue: "TBA", // "Football/Athletics Ground",
    prizes: "TBA", // "TBD",
    registrationLink: "#",
    socialLink: "#",
    maxParticipants: "#",
    duration: "TBD",
    teamSize: "Individual",
  },
  // {
  //   id: "chess-tournament",
  //   name: "Chess",
  //   day: "TBA", // "Day 3",
  //   date: "TBA", // "Feb 15, 2026",
  //   time: "10:00 AM - 06:30 PM",
  //   description: "Join us for an exciting Chess Tournament where strategy, patience, and skill collide on the 64 squares.",
  //   detailedDescription: "Step into the world of strategy and intellect at the Inquivesta One-Day Inter-College Chess Tournament 2025. Open to students from colleges across India, this rapid-format Swiss League tournament promises intense battles of the mind, guided by official FIDE rules.\n\nWith fair play, inclusivity, and sportsmanship at its core, the event offers participants the thrill of competition and a platform to connect, learn, and grow. 6 rounds of competition with attractive prizes, trophies, and participation certificates.",
  //   image: "/placeholder-logo.png",
  //   category: "Competition",
  //   venue: "SAC Building 1st floor",
  //   prizes: "₹35,000 Prize Pool",
  //   registrationLink: "#",
  //   socialLink: "https://instagram.com/chess.club_iiserk",
  //   maxParticipants: "#",
  //   duration: "8.5 hours",
  //   teamSize: "Individual",
  // },
  {
    id: "clash-of-coins",
    name: "Clash of Coins",
    day: "TBA", // "Day 2",
    date: "TBA", // "Feb 16, 2026",
    time: "TBA", // "10:00 AM - 06:30 PM",
    description: "An exciting carrom tournament featuring both singles and doubles categories.",
    detailedDescription: "Clash of Coins is a comprehensive carrom tournament featuring both singles and doubles categories, conducted in accordance with AICF rules.\n\nMATCH FORMAT:\n• All matches, for both singles and doubles categories, shall follow a knockout format\n• In the event of an insufficient number of participants, a round-robin format shall be adopted to ensure fair and comprehensive competition\n\nMATCH RULES:\n• All matches shall be conducted in accordance with the rules established by AICF, except where such rules are explicitly amended or superseded by these regulations\n• Official AICF rules available at: https://www.indiancarrom.co.in/laws-of-carrom\n• For all matches up to and including the quarter-finals: matches shall be played up to 25 points, or for a maximum duration of 25 minutes, whichever occurs first\n• From the semi-finals onward: matches shall be played up to 25 points, or for a maximum duration of 5 boards, whichever occurs first\n• Players/teams reporting more than 10 minutes late will forfeit the match\n\nTIE-BREAKER RULES:\n• In the event of a tie at the end of a match, an additional board shall be played\n• The player or team winning this extra board shall be declared the winner of the match",
    image: "/events/clash_of_coins/clash_of_coins.png",
    category: "Sports Competition",
    venue: "TBA", // "Carrom room (If necessary, Yoga room)",
    prizes: "TBA", // "Doubles - 1st: ₹4,000, 2nd: ₹2,000, 3rd: ₹1,000; Singles - 1st: ₹1,500, 2nd: ₹1,000, 3rd: ₹500",
    registrationLink: "#",
    socialLink: "https://instagram.com/iiserk_carrom.club",
    maxParticipants: "#",
    duration: "8.5 hours",
    teamSize: "Individual/Doubles (2 members for doubles category)",
  },
  {
    id: "csi",
    name: "Crime Scene Investigation (CSI)",
    day: "TBA", // "Day 2",
    date: "TBA", // "Feb 16, 2026",
    time: "TBA", // "09:30 AM - 05:30 PM",
    description: "Step into the shoes of a detective and crack a thrilling mystery using science, logic, and teamwork.",
    detailedDescription: "CSI is one of the legacy events of Inquivesta. It's an immersive, science-themed mystery challenge where participants act as detectives. Teams investigate a staged crime scene, analyze realistic clues, and reconstruct the sequence of events. Clues involve logical puzzles, coded messages, mock forensic samples, and situational analysis. The event blends storytelling and real-world forensic principles for an unforgettable detective experience.",
    image: "/events/csi/csi.png",
    category: "Science Event",
    venue: "TBA", // "Around Campus (starting point: LHC)",
    prizes: "TBA", // "Prize pool: ₹20,000+",
    registrationLink: "#",
    socialLink: "https://www.instagram.com/csi_deduce?igsh=dnJmN3gyN25hMmox",
    maxParticipants: "#",
    duration: "8 hours",
    teamSize: "Teams"
  },
  // {
  //   id: "nukkad-natak",
  //   name: "Nukkad Natak",
  //   day: "TBA", // "Day 1",
  //   date: "TBA", // "Feb 15, 2026",
  //   time: "TBA", // "03:00 PM",
  //   description: "A stage play performed in open areas to spread awareness about social issues directly to the audience.",
  //   detailedDescription: "Nukkad natak is a stage play which is performed by a group of participants in an open areas preferably a market place or on streets which helps in spreading awareness about a particular issue directly to the general audience.\n\nNukkad natak is generally performed by a group of skilled dramatists who are fluent in voice acting, choreography, screenplay, creative writing along with being able to write catchy slogans/dialogues which hits the audience like a truck. It's generally performed by a group of 10-15 people.\n\nIn IISER K and in general vicinity there is a very vibrant drama culture, so we expect this edition's nukkad natak to be a successful one.",
  //   image: "/events/drama_events/drama_2.jpeg",
  //   category: "Performance",
  //   venue: "TBA", // "LHC courtyard or mess water tank",
  //   prizes: "TBA", // "Prize pool: ₹10,000",
  //   registrationLink: "#",
  //   socialLink: "https://www.instagram.com/",
  //   maxParticipants: "#",
  //   duration: "3 hours",
  //   teamSize: "10-15 members"
  // },
  {
    id: "drama-lama",
    name: "Drama Lama",
    day: "TBA", // "Day 3",
    date: "TBA", // "Feb 15, 2026",
    time: "TBA", // "05:00 PM",
    description: "A fun drama event with light-hearted games like mad ads, dumb charades, and acting scenes with a twist.",
    detailedDescription: "Drama lama will be a fun drama event which will include light hearted drama related games similar to mad ads, dumb charades acting out different scenes but with a twist and such things.\n\nBeing a part of drama lama will help the 'not so interested in doing serious drama' people to get introduced to the drama culture.\n\nThe participants will be divided into groups of three and people will just act their hearts out…enjoy!!!!",
    image: "/events/drama_events/drama_1.jpeg",
    category: "Performance",
    venue: "TBA", // "TBD",
    prizes: "TBA", // "Prize pool: ₹3,300",
    registrationLink: "#",
    socialLink: "https://www.instagram.com/",
    maxParticipants: "#",
    duration: "2 hours",
    teamSize: "Groups of 3"
  },
  {
    id: "fashion-fusion",
    name: "Fashion Fusion",
    day: "TBA", // "Day 1",
    date: "TBA", // "Feb 15, 2026",
    time: "TBA", // "03:00 PM",
    description: "A student community driven fashion walk open to all. NO RULES, NO LIMITS, just pure creativity on the runway.",
    detailedDescription: "Are you ready to shine on the runway? Fashion Fusion is the grand fashion walk of our college fest where style meets confidence. It's not just about clothes — it's about attitude, creativity, and the courage to express yourself.\n\nCome dressed in anything you love — retro classics, trendy streetwear, ethnic elegance, quirky fits, sports wear, or even cosplay. There are no limits, no rules. This stage belongs to everyone who dares to flaunt their unique choices.\n\nFrom retro glam to street chic, cosplay to classic, bring any vibe, any style, and own the spotlight. Only question: Have you got the guts to be mr./miss fashionista?",
    image: "/events/fashion_fusion/fashion_fusion.jpg",
    category: "Performance",
    venue: "TBA",
    prizes: "TBA", // "Prize pool: ₹8,000",
    registrationLink: "#",
    socialLink: "#",
    maxParticipants: "#",
    duration: "3 hours",
    teamSize: "Individual"
  },
  {
    id: "get-set-spike",
    name: "Get-Set-Spike",
    day: "TBA", // "Day 1",
    date: "TBA", // "Feb 15, 2026",
    time: "TBA", // "09:00 AM - 04:00 PM",
    description: "A fast, mixed-gender 3×3 volleyball knockout that brings together teams for high-energy rallies and community spirit.",
    detailedDescription: "Get-Set-Spike is a 3×3 Volleyball Knockout tournament designed for fast-paced, high-energy competition.\n\nTEAM COMPOSITION:\n• Each team fields 3 players on court (up to 2 substitutes)\n• Every roster must include at least one male and one female\n• The tournament accepts 16 teams total and is open to IISER-K and other college teams\n\nTOURNAMENT FORMAT:\n• This is a single-elimination (knockout) event — one loss and the team is out\n• Matches up to the semifinals are best of 3 sets, each set played to 15 points using rally scoring\n• The final is played as three sets to 25/25/15 points respectively, with standard rally scoring\n• Substitutions are not allowed, and teams receive a short warm-up before their match\n\nOFFICIATING:\n• An experienced external referee will officiate each match and their on-court decision is final\n• Match timings and rules will be circulated to teams and sponsors before the event\n\nExpect fast, high-intensity rallies and quick rotations — bring clear communication, energy, and fair play.",
    image: "/events/get_set_spike/get_set_spike.jpg",
    category: "Sports Competition",
    venue: "TBA", // "IISER-K outdoor volleyball court",
    prizes: "TBA", // "Total ₹9,500 — 1st: ₹5,000; 2nd: ₹3,000; 3rd: ₹1,500 (Not Confirmed)",
    registrationLink: "#",
    socialLink: "#",
    maxParticipants: "80", // 16 teams * 5 players each
    duration: "7 hours",
    teamSize: "3 players + 2 substitutes (mixed gender)"
  },
  {
    id: "headshot",
    name: "HEADSHOT",
    day: "TBA", // "Day 2",
    date: "TBA", // "Feb 15, 2026",
    time: "TBA", // "10:00 AM - 06:30 PM",
    description: "A premier E-sports gaming event testing players' reflexes, precision, and decision-making under pressure.",
    detailedDescription: "Headshot is a premier E-sports gaming event hosted as part of Inquivesta, the annual science and cultural festival organized by IISER Kolkata.\n\nHeadshot is a competitive gaming tournament designed to test players' reflexes, precision, and decision-making under pressure. In this event, participants will engage in fast-paced, skill-based matches where accuracy and quick thinking are the key.\n\nTOURNAMENT FORMAT:\n• The format includes team-based matchups\n• Matches will be held in popular titles, such as Valorant, BGMI, etc.\n• Players will compete on a level playing field with standardized equipment and pre-installed game clients\n• The primary focus of the competition will be on accuracy and overall tactical performance\n• Each match will be scored objectively, allowing fair comparison across players or teams\n• Live projections of the matches may also be shown to create an engaging spectator experience",
    image: "/events/headshot/headshot.png",
    category: "Competition",
    venue: "TBA", // "LHC G02, G07 & G08",
    prizes: "TBA", // "Prize Pool: ₹25,000+",
    registrationLink: "#",
    socialLink: "https://www.instagram.com/headshot_inq?igsh=MWIyajM5OHNqdjB5bg==",
    maxParticipants: "#",
    duration: "8.5 hours",
    teamSize: "Teams (varies by game)"
  },
  {
    id: "inquicon",
    name: "Inquicon",
    day: "TBA", // "Day 2",
    date: "TBA", // "Feb 15, 2026",
    time: "TBA", // "09:30 AM - 05:00 PM",
    description: "A high-energy celebration of anime, manga, gaming, and cosplay with performances, competitions, and prizes.",
    detailedDescription: "Inquicon brings IISER-K's fandom community together with four flagship events:\n\nEVENT LINEUP:\n• Karaoke Musical Performance — a lively opening act by the Inquicon team to kick off the celebration\n• Pokémon Showdown Tournament — a competitive 6v6 Pokémon battle, projected live with commentary and audience hype\n• Cosplay Performance — showcase your character on stage, with prizes for best performances and audience-voted Mesmerizers\n• Chitrakatha Prize Distribution — awarding winners of IISER-K's Manga Contest (Best Storyline & Best Plot)\n\nEVENT TIMELINE:\n• Karaoke Musical Performance: 9:30 AM\n• Chitrakatha Prize Distribution: 10:00 – 10:30 AM\n• Pokémon Showdown Tournament: 10:40 AM – 1:30 PM\n• Cosplay Performance: 2:00 – 5:00 PM\n\nPRIZE BREAKDOWN:\n• Pokémon Showdown: Winner ₹2,000 + merch; Runner-up ₹1,000 + merch; MVP ₹1,000 + merch\n• Cosplay: 1st Prize ₹3,000 + merch; 2nd Prize ₹2,000 + merch; Mesmerizer (Male) ₹1,000 + merch; Mesmerizer (Female) ₹1,000 + merch\n• Chitrakatha: Best Plot ₹1,000 + merch; Best Art ₹1,000 + merch",
    image: "/events/inquicon/inquicon_w_t.png",
    category: "Cultural Competition",
    venue: "TBA", // "RNT Auditorium",
    prizes: "TBA", // "Total Prize Pool: ₹30,000 (cash + accessories)",
    registrationLink: "#",
    socialLink: "https://www.instagram.com/anicon3.o",
    maxParticipants: "#",
    duration: "7.5 hours",
    teamSize: "Individual/Teams (varies by event)"
  },
  {
    id: "junkyard-wars",
    name: "Junkyard Wars",
    day: "TBA", // "Day 2",
    date: "TBA", // "Feb 15, 2026",
    time: "TBA", // "10:00 AM - 06:00 PM",
    description: "Build working machines from random scrap materials to perform specified tasks - imagination rules the world!",
    detailedDescription: "JUNKYARD WARS: IMAGINATION RULES THE WORLD.\n\nThe participants will be given random scrap materials (The only inventory) out of which you have to build a working model (machines) which can perform the specified task. It's a test of your dexterity and intuitive thought process. The competition aims to test how quick and creative one can be at the same time and solve a problem. That's what JUNKYARD WARS is about.\n\nGENERAL POINTS:\n1. TEAM SIZE = 2-4 MEMBERS\n2. MACHINE SHOULD BE BUILT WITHIN THE TIME LIMIT\n3. JUDGE DECISION IS THE FINAL DECISION\n4. USE OF ANY OUTSIDE ITEM IS PROHIBITED EXCEPT MARKER & SCALE\n5. THE COMPLETE RULEBOOK WILL BE PROVIDED LATER",
    image: "/events/junkyard_wars/junkyard_wars.png",
    category: "Engineering Event",
    venue: "TBA", // "Lecture Hall Complex",
    prizes: "TBA", // "1st: ₹7,000, 2nd: ₹4,000, 3rd: ₹2,000",
    registrationLink: "#",
    socialLink: "#",
    maxParticipants: "#",
    duration: "8 hours",
    teamSize: "2-4 members"
  },
  // {
  //   id: "lost",
  //   name: "L.O.S.T. (Launch of Syntax Termination)",
  //   day: "TBA", // "Day 3",
  //   date: "TBA", // "Feb 15, 2026",
  //   time: "09:30 AM - 10:30 AM",
  //   description: "A high-stakes treasure hunt across campus where you must outsmart an AI system that has seized control.",
  //   detailedDescription: "L.O.S.T. isn't just a game — it's the story of humanity's last stand.\n\nParticipants enter a dystopian world where an advanced AI has taken over, shutting down systems and rewriting human control. Your mission is to infiltrate its defenses: uncover hidden clues across campus, decrypt corrupted files, and piece together the fragments of malware that can terminate its reign.\n\nEvery clue will challenge you with logic puzzles, code-breaking, cryptic trails, and tech-driven mysteries, all rooted in the theme of survival against machines. Teams must combine speed, reasoning, and collaboration to reconstruct the AI's weakness and upload the kill switch before time runs out.\n\nOnly the sharpest minds will survive the machine uprising. Will you rewrite the end, or become another lost cause?\n\nDecode, decrypt, and survive — before humanity is completely overwritten.",
  //   image: "/events/lost/lost.jpg",
  //   category: "Competition",
  //   venue: "Entire Campus",
  //   prizes: "Prize Pool: ₹8,000",
  //   registrationLink: "#",
  //   socialLink: "#",
  //   maxParticipants: "#",
  //   duration: "1 hour",
  //   teamSize: "Teams"
  // },
  {
    id: "masquerade",
    name: "Masquerade",
    day: "TBA", // "Day 1",
    date: "TBA", // "Feb 15, 2026",
    time: "TBA", // "06:00 PM",
    description: "In 1912, love and dreams sank with the Titanic. But in 2025, the spirit rises again for one last night of magic.",
    detailedDescription: "The year was 1912, when love, dreams and destiny were lost to the depths of the sea. Yet tonight, in 2025, the spirit of the Titanic calls again – summoning lovers, dreamers, and wanderers to one another night of magic before the world crumbled and the night fades away.\n\nThis masquerade is not just a ball, but a second chance – where the elegance of the past meets the daring glow of the future. This time, behind every hidden face is a yearning — for a reunion, or a first-time spark, for seekers who crave moments without judgement.\n\nA night where masks free us from the whispers of 'vo mahaule wali aunty dekhegi toh kya bolegi' — and only the magic of the moment remains. It's not about guts to get on the floor, its about whose elegance touch ZINGs you.\n\nBehind the mask lies a reunion or a new story to origin. No judgements, no boundaries – just style, mystery and a chance to live the night where even the cupid's grace blesses us all.",
    image: "/events/masquerade/masquerade.jpg",
    category: "Performance",
    venue: "TBA", // "Circular paved pathway in front of RNT",
    prizes: "TBA", // "N/A",
    registrationLink: "#",
    socialLink: "#",
    maxParticipants: "#",
    duration: "4 hours",
    teamSize: "Individual"
  },
  {
    id: "photon",
    name: "Photon",
    day: "TBA", // "Day 1",
    date: "TBA", // "Feb 15, 2026",
    time: "TBA", // "02:00 PM - 04:00 PM",
    description: "Capture the world the way you see it, and win! Tell us a story with it, and win again!",
    detailedDescription: "Photon is an annual event held during the Inquivesta Science Fest. The event consists of two competitions: A themed-photography competition and a photostory competition.\n\nTHEMED-PHOTOGRAPHY COMPETITION:\n• A theme is given to the participants, on which they can submit up to 3 photos coherent with the subject\n• Photographs will be judged based on their technical sophistication, connection to the theme, interpretation of the theme, and artistic merit\n\nPHOTO STORY COMPETITION:\n• Contestants are given the liberty to choose the theme they want\n• Contestants are required to submit 5-7 photos in a series with a short write-up of up to 250 words\n• Whatever the theme might be, photos are required to have a sequential consistency\n• Submissions will be judged on the basis of storytelling, aesthetics of the photos, creativity, and presentation of the photo story\n\nSUBMISSION PROCESS:\n• Submissions are online through a Google form\n• Contestants are required to submit in PDF format for photo story and in JPEG or PNG format for themed photography\n• Submissions will be judged by a professional photographer from outside\n• Winners will be announced on the final day of the Inquivesta Fest\n\nExciting prizes await you!",
    image: "/events/photon/photon.png",
    category: "Competition",
    venue: "TBA", // "LHC Ground/Cafeteria area",
    prizes: "TBA", // "TBD",
    registrationLink: "#",
    socialLink: "https://www.instagram.com/pixel.iiser_kolkata",
    maxParticipants: "#",
    duration: "2 hours",
    teamSize: "Individual"
  },
  {
    id: "powerlifting",
    name: "Powerlifting",
    day: "TBA", // "Day 1",
    date: "TBA", // "Feb 15, 2026",
    time: "TBA", // "09:00 AM - 07:00 PM",
    description: "Experiment your limits: Lift! The first ever men's powerlifting event at Inquivesta.",
    detailedDescription: "Welcome to the first ever men's powerlifting event at Inquivesta!\n\nThe Inquivesta Powerlifting event is a strength-based competition that tests participants across three core lifts: the squat, bench press, and deadlift! It will feature five weight categories, with each lifter getting three attempts per lift. The highest successful lift in each category will be added to determine the lifter's total score. The event is open to male students of IISER Kolkata and other institutions.\n\nWEIGHT CLASSES:\n• Category 1: ≤ 59 kg\n• Category 2: 59.1 – 66 kg\n• Category 3: 66.1 – 74 kg\n• Category 4: 74.1 – 83 kg\n• Category 5: > 83 kg\n\nRULES AND EQUIPMENT:\n• This event shall follow the standard raw (unequipped) powerlifting norms inspired by IPF regulations\n• Equipment Allowed: Lifting belts, chalk, and wrist wraps\n• Not Allowed: Supportive suits/shirts, knee wraps (only sleeves allowed if needed)\n• Scoring: Total lift (kg) = Best Squat + Best Bench Press + Best Deadlift\n• Judging: A panel of referees (2 student judges + certified trainer)\n\nSCHEDULE:\nDAY 1 (09:00–19:00)\n09:00–10:00 – Weight Ins\n10:00–12:30 – Bench Press (Categories 1, 2)\n12:30–13:30 – Lunch Break\n13:30–15:30 – Bench Press (Categories 3, 4)\n15:30–16:00 – Snack Break\n16:00–18:15 – Squat (Categories 1, 2, 3)\n18:15–19:00 – Squat (Categories 4, 5 remaining)\n\nDAY 2 (09:00–19:00)\n09:00–11:00 – Deadlift (Categories 3, 4, 5)\n11:00–12:30 – Deadlift (Categories 1, 2)\n12:30–13:30 – Lunch Break\n13:30–15:30 – Bench Press (Category 5)/Deadlift buffer\n15:30–16:00 – Snack Break\n16:00–19:00 – Squat & Deadlift buffer/Extra lifts",
    image: "/events/powelifting/powerlifting.png",
    category: "Sports Competition",
    venue: "TBA", // "Gymnasium, IISER Kolkata",
    prizes: "TBA", // "Grand total: ₹20,000 (₹2,400/₹1,000/₹600 per category)",
    registrationLink: "#",
    socialLink: "#",
    maxParticipants: "#",
    duration: "2 days",
    teamSize: "Individual"
  },
  {
    id: "serum-z",
    name: "SERUM-Z",
    day: "TBA", // "Day 1",
    date: "TBA", // "Feb 15, 2026",
    time: "TBA", // "02:00 PM - 05:00 PM",
    description: "A real-time zombie survival simulation combining thrill, strategy, and science in an interactive escape game.",
    detailedDescription: "Zombie Escape is designed to bring together thrill, strategy, and science in an interactive survival game. It aims to engage students in a high-energy, problem-solving scenario under pressure, simulating a zombie apocalypse with real-time decision-making and critical thinking.\n\nGAME CONCEPT:\nSerum-Z is a real-time simulation game where participants play either as survivors or zombies. Survivors must collect scattered clues around the venue to assemble an antidote while avoiding contact with the zombies. Zombies aim to infect survivors by tagging them.\n\nGAME OBJECTIVES:\n• All survivors are infected, OR\n• Someone solves the final puzzle and finds the antidote\n• It's a test of teamwork, stealth, logic, and speed\n\nEVENT SCHEDULE:\n14:00–14:30 – Rules and briefing\n14:30–16:30 – Game rounds\n16:30–17:00 – Prize distribution\n\nGAME FORMAT:\n• Participants will be divided randomly into survivors and zombies\n• Game zones will include safe houses, clue spots, and infection zones\n• Game Masters will supervise and moderate play\n\nWINNER SELECTION:\n• If any survivor solves the final clue and escapes – Survivor wins\n• If all survivors are infected – Zombie infecting most people wins\n• Special mention – Most dramatic death or zombie infecting many people\n\nELIGIBILITY:\n• Open to all IISER Kolkata students and visitors from other colleges\n• Teams of 1-4 players per team\n\nTERMS AND CONDITIONS:\n• Physical contact beyond tagging is prohibited\n• No clue destruction or hiding\n• Once tagged, participants must report to Game Masters",
    image: "/events/serum_z/serumz.jpg",
    category: "Competition",
    venue: "TBA", // "Around the campus/LHC",
    prizes: "TBA", // "Winner: ₹5,000 + Certificate, Last Survivor: ₹2,000 + Certificate",
    registrationLink: "#",
    socialLink: "#",
    maxParticipants: "#",
    duration: "3 hours",
    teamSize: "1-4 members per team"
  },
  {
    id: "smash7",
    name: "Smash 7",
    day: "TBA", // "Day 1",
    date: "TBA", // "Feb 15, 2026",
    time: "TBA", // "09:00 AM - 05:00 PM",
    description: "A fast-paced 7-over tennis ball box cricket league combining thrill, strategy, and inclusivity.",
    detailedDescription: "Smash7 is a high-energy 7-over box cricket tournament where 7-player teams battle it out in fast-paced, action-packed matches. Open to IISER Kolkata, colleges, and schools, the league blends strategy, teamwork, and thrill with short boundaries and quick play.\n\nTOURNAMENT FORMAT:\n• 7-over tennis ball box cricket\n• 7-player teams\n• League stages followed by playoffs\n• Professional umpiring\n• Prizes for champions and top performers\n\nSCHEDULE:\nDay 1:\n9:00 AM – 12:00 Noon → 3 matches\n2:00 PM – 5:00 PM → 3 matches\n\nDay 2:\n9:00 AM – 12:00 Noon → 3 matches\n2:00 PM – 5:00 PM → 3 matches\n\nDay 3:\n2:00 PM – 3:00 PM → Semi Final 1\n3:00 PM – 4:00 PM → Semi Final 2\n4:00 PM – 5:00 PM → Final\n\nSmash7 promises an unforgettable sporting highlight of Inquivesta with fast-paced action, strategic gameplay, and competitive spirit!",
    image: "/events/smash7/smash7_b.png",
    category: "Sports Competition",
    venue: "TBA", // "IISER Kolkata Cricket Ground",
    prizes: "TBA", // "Total cash prize pool: ₹14,000 + Special Awards",
    registrationLink: "#",
    socialLink: "#",
    maxParticipants: "#",
    duration: "3 days (8 hours each)",
    teamSize: "7 players per team"
  },
  {
    id: "soulbeats",
    name: "Soulbeats",
    day: "TBA", // "Day 2",
    date: "TBA", // "Feb 15, 2026",
    time: "TBA", // "10:00 AM - 06:00 PM",
    description: "An exhilarating dance fest designed to ignite passion, foster creativity, and celebrate the art of dance in all its forms.",
    detailedDescription: "Inquivesta Soulbeats is an exhilarating dance fest designed to ignite passion, foster creativity, and celebrate the art of dance in all its forms.\n\nEVENT COMPONENTS:\n\nX-PRESS (Theme: Innovation):\n• Stage dance competition with pre-rehearsed performances\n• Category is open - solo, duet, or group dance performances\n• Performance duration: 3-8 minutes\n• Audio must be provided 3 days before the event\n• Maximum 10 members per group\n• No spot registrations accepted\n• Proper costume required, green room provided\n• Time slots will be allotted for each performance\n\nSURVIVAL OF THE FITTEST:\n• On-spot dance battle competition\n• Category is open\n• Participants perform to random songs (approximately 1 minute per song)\n• Only 30 participants selected (first come, first serve)\n• Multi-round elimination format\n• Tests ability to think on feet and adapt quickly\n\nWORKSHOP SESSION:\n• Dance mini-workshop instructed by guest judges\n• Opportunity to learn from experienced dancers\n• Direct interaction with professional judges\n• Open to all dance enthusiasts\n\nSCHEDULE:\nDAY 1:\nSession 1: 10 am – 1 pm: X-press\nLunch Break: 1 pm – 2 pm\nSession 2: 2:30pm – 3 pm: Result Declaration and Prize Distribution\nSession 3: 3 pm – 5:30 pm: Survival of the Fittest\nSession 4: 5:30 pm - 6 pm: Result Declaration and Prize Distribution\n\nDAY 2:\nSession 5: 10am - 1pm: Workshop Session\n\nELIGIBILITY:\n• Anyone above 10 years of age is eligible to participate\n• Registration through Google Form required",
    image: "/events/soulbeats/soulbeats.png",
    category: "Cultural Competition",
    venue: "TBA", // "LHC 107",
    prizes: "TBA", // "X-PRESS: 1st ₹10,000, 2nd ₹8,000, 3rd ₹5,000; SURVIVAL: 1st ₹8,000, 2nd ₹5,000, 3rd ₹2,000",
    registrationLink: "#",
    socialLink: "#",
    maxParticipants: "#",
    duration: "2 days",
    teamSize: "Individual/Groups (max 10 members)"
  },
  {
    id: "spin-it-to-win-it",
    name: "Spin It to Win It",
    day: "TBA", // "Day 2",
    date: "TBA", // "Feb 15, 2026",
    time: "TBA", // "02:00 PM - 06:00 PM",
    description: "Spin, Strategize, and Conquer – Where Science Meets Beyblade Battle!",
    detailedDescription: "Welcome, Beyblade warriors and physics fanatics! Get ready for SPIN IT TO WIN IT, the ultimate Beyblade showdown at INQUIVESTA XII! This isn't just any spinning-top battle—it's where science, strategy, and pure adrenaline collide.\n\nONLINE QUALIFICATION:\nWe kick off with an online quiz to pick the top 16 bladers. You'll be tested on your knowledge of angular velocity, moment of inertia, gyroscopic stability, friction, energy transfer, and spin dynamics… but all through images of Beyblades in action. Can you spot which one will spin longer? Or which combo will dominate the stadium?\n\nTOURNAMENT FORMAT:\nOnce the top 16 are selected, each blader gets to choose a Beyblade from our stock of Attack, Defense, Stamina, and Balance types. You'll battle using that one Bey through rounds 16→8→4.\n\nSEMI-FINALS:\nWhen only 4 bladers remain, you'll be handed three new Beyblades and the chance to customize one Bey from 15 different parts—mix, match, and unleash your ultimate creation.\n\nFINALS:\nExpect sparks, fire effects, and pure Beyblade mania. The faster your Bey spins, the more flames erupt in the stadium—just like in the anime!\n\nAUDIENCE PARTICIPATION:\nLive MCQs will test your predictive skills: guess how the next round will end—Ring Out? Burst Finish? Survivor Finish? Draw? Every correct answer scores points, every wrong guess costs you. The audience Beyblade master with the highest points wins a Beyblade-themed keychain!\n\nThis is SPIN IT TO WIN IT—where every spin tells a story and every clash teaches the science behind the chaos. Are you ready to dominate the Beyblade arena?",
    image: "/events/spin_it_to_win_it/spin_it_to_win_it.png",
    category: "Competition",
    venue: "TBA", // "LHC Cafeteria Area",
    prizes: "TBA", // "TBD",
    registrationLink: "#",
    socialLink: "#",
    maxParticipants: "16 (from online quiz)",
    duration: "4 hours",
    teamSize: "Individual"
  },
  // {
  //   id: "spotlight",
  //   name: "Spotlight",
  //   day: "TBA", // "Day 1",
  //   date: "TBA", // "Feb 15, 2026",
  //   time: "08:00 PM",
  //   description: "When the lights dim and the stage glows, it's your time to shine! The ultimate talent showcase of the fest.",
  //   detailedDescription: "Spotlight is the ultimate talent showcase of the fest — where voices soar, feet move to the beat, and music comes alive.\n\nWhether it's singing, dancing, or playing a musical instrument, this is the stage for every hidden star. When the lights dim and the stage glows, it's your time to shine!\n\nThis is your moment to showcase your talent in front of the entire fest audience. From soulful melodies to electrifying dance moves, from acoustic performances to instrumental mastery — Spotlight welcomes all forms of artistic expression.\n\nStep into the limelight and let your talent illuminate the night. This is where memories are made and stars are born.",
  //   image: "/events/spotlight/spotlight.jpg",
  //   category: "Performance",
  //   venue: "RNT Auditorium",
  //   prizes: "Prize pool: ₹10,000",
  //   registrationLink: "#",
  //   socialLink: "#",
  //   maxParticipants: "#",
  //   duration: "3 hours",
  //   teamSize: "Individual/Groups"
  // },
  // {
  //   id: "squid-games",
  //   name: "Squid Games",
  //   day: "TBA", // "Day 3",
  //   date: "TBA", // "Feb 15, 2026",
  //   time: "03:30 PM - 06:00 PM",
  //   description: "It's the ultimate survival game of Inquivesta, as you have seen it on Netflix. Not everyone makes it to the end… will you?",
  //   detailedDescription: "Think you've got what it takes to be the last one standing? Step into the arena and compete in a high-energy, elimination-style showdown inspired by the hit series Squid Game!\n\nYou'll face five thrilling mini-games designed to push your reflexes, strategy, and coordination to the limit:\n\n🚦 RED LIGHT, GREEN LIGHT\nFreeze on time or be eliminated!\n\n🤝 MINGLE\nFind your match before time runs out.\n\n🏃 PENTATHLON\nOutpace and outsmart the competition (Five Secret Mini-Games👀)\n\n🔮 MARBLES\nWin with skill, luck, or cunning.\n\n🎈 BALLOON STOMP\nProtect your balloon, pop everyone else's!\n\nStarting with 50–75 participants, the competition heats up round by round until only one ultimate champion remains.\n\n⚡ Expect fast-paced action, intense rivalries, and non-stop excitement that'll keep both players and the crowd on the edge of their seats.\n\nAre you ready to play… or will you be eliminated? See you at the arena.",
  //   image: "/events/squid_game/squid_game.png",
  //   category: "Competition",
  //   venue: "TBD",
  //   prizes: "Prize pool: ₹10,000",
  //   registrationLink: "#",
  //   socialLink: "https://www.instagram.com/squidgames.inquivesta_",
  //   maxParticipants: "50-75",
  //   duration: "2.5 hours",
  //   teamSize: "Individual"
  // },
  {
    id: "thrust",
    name: "THRUST",
    day: "TBA", // "Day 3",
    date: "TBA", // "Feb 15, 2026",
    time: "TBA", // "11:00 AM - 04:30 PM",
    description: "Pressure builds, water sprays, and rockets soar! The ultimate test of engineering in water bottle rocketry.",
    detailedDescription: "Ready to build, launch, and dominate? Inquivesta's THRUST is your chance to turn a simple 1-liter bottle into a high-flying, liquid-fueled rocket!\n\nUnleash your inner engineer as you design and build a masterpiece from everyday materials like cardboard, tape, and glue. Work with your team of up to three to compete in three thrilling levels:\n\nLEVEL 1: MAXIMUM RANGE AND AIR TIME\nChallenge for the longest distance and flight duration\n\nLEVEL 2: PAYLOAD TEST\nCarry a ping-pong ball and maintain performance\n\nLEVEL 3: TARGET CHALLENGE\nHigh-stakes precision challenge for top teams\n\nIt's a fast-paced battle of science and creativity. The team with the highest score after the first two levels will secure a cash prize of ₹500.\n\nEVENT DETAILS:\n• Team Size: Up to 3 members\n• Eligibility: Students of IISER Kolkata, other colleges, and schools\n• What to Bring: Just a 1-liter water bottle per team\n• What We Provide: Cardboard, thermocol, adhesives (glue-gun, liquid glue, cello-tape), thermocol cutter, pencils, and scales\n\nGet ready for liftoff!",
    image: "/events/thrust/thrust.png",
    category: "Engineering Event",
    venue: "TBA", // "SAC + Open ground (TBD)",
    prizes: "TBA", // "Champion: ₹4,000, 1st Runner-up: ₹2,500, 2nd Runner-up: ₹1,500, Level completion: ₹500",
    registrationLink: "#",
    socialLink: "#",
    maxParticipants: "#",
    duration: "5.5 hours",
    teamSize: "Up to 3 members"
  },
  {
    id: "inquivesta-cube-open",
    name: "Inquivesta Cube Open 2026",
    day: "TBA", // "Day 2",
    date: "TBA", // "Feb 15, 2026",
    time: "TBA", // "TBD",
    description: "Compete, Connect, and Cube at an official WCA event with exciting prizes at IISER Kolkata's annual fest.",
    detailedDescription: "Inquivesta Cube Open 2026 is an official World Cube Association (WCA) competition, open to all participants.\n\nEVENT DETAILS:\n• Events will include a variety of categories such as 2x2, 3x3, Megaminx, and more\n• Competitors must register in advance for their chosen events\n• The competition will be supervised by an official WCA Delegate, ensuring fair and accurate results\n\nAs part of Inquivesta XII, IISER Kolkata's annual fest, the event will feature an exciting prize pool and coupons for winners. Full event list and sponsors will be announced soon.\n\nStay tuned and keep checking the official WCA competition page for the latest updates and announcements.\n\nHappy Cubing :-)",
    image: "/events/inquivesta_cube_open/inquivesta_cube_open.svg",
    category: "Competition",
    venue: "TBA", // "LHC 108 or MN Saha",
    prizes: "TBA", // "Prize Pool: ₹10,000",
    registrationLink: "#",
    socialLink: "https://www.instagram.com/rubik_club_iiserk/",
    maxParticipants: "#",
    duration: "TBD",
    teamSize: "Individual"
  },
]

const categoryIcons = {
  Competition: Trophy,
  Workshop: Zap,
  Exhibition: Users,
  Talk: Users,
  Performance: Users,
  "Sports Competition": Trophy,
  "Cultural Competition": Trophy,
  "Science Event": Zap,
  "Engineering Event": Zap,
}

const categoryColors = {
  Competition: "from-[#F8BBD9] to-[#F8C471]",
  Workshop: "from-[#A8D8EA] to-[#85C1E9]",
  Exhibition: "from-[#ABEBC6] to-[#82E0AA]",
  Talk: "from-[#B8A7D9] to-[#D2B4DE]",
  Performance: "from-[#F4D03F] to-[#F8C471]",
  "Sports Competition": "from-[#F8BBD9] to-[#F8C471]",
  "Cultural Competition": "from-[#B8A7D9] to-[#D2B4DE]",
  "Science Event": "from-[#A8D8EA] to-[#85C1E9]",
  "Engineering Event": "from-[#ABEBC6] to-[#82E0AA]",
}

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedDay, setSelectedDay] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "calendar">("grid") // New state for view mode

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory
    const matchesDay = selectedDay === "all" || event.day === selectedDay

    return matchesSearch && matchesCategory && matchesDay
  })

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white border-8 border-[#D2B997]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#1A1A1A]/90 backdrop-blur-md border-b border-[#D2B997]/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center space-x-2 text-[#D2B997] hover:text-[#B8A7D9] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-depixel-small">Back to Home</span>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <Image src="/ball_a.png" alt="INQUIVESTA XII" width={60} height={60} className="h-10 w-auto" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <FadeIn>
            <div className="text-center mb-12">
              <HyperText
                className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#F8C471] to-[#F7DC6F] bg-clip-text text-transparent font-futura"
                text="EVENTS & COMPETITIONS"
              />
              <p className="text-[#D2B997] text-lg font-depixel-body mb-8">LIMITLESS CHOICES</p>
            </div>
          </FadeIn>

          {/* Filters and View Mode Toggle */}
          <FadeIn delay={0.2}>
            <div className="bg-[#2A2A2A]/50 rounded-lg border border-[#D2B997]/30 p-6 mb-12">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D2B997] w-4 h-4" />
                  <Input
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-[#1A1A1A] border-[#D2B997]/30 text-white placeholder-[#D2B997]/60 font-depixel-small"
                  />
                </div>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                    <SelectContent className="bg-[#2A2A2A] border-[#D2B997]/30 text-white font-depixel-small">
                    <SelectItem value="all" className="text-white hover:bg-[#D2B997]/20 font-depixel-small">All Categories</SelectItem>
                    <SelectItem value="Competition" className="text-white hover:bg-[#D2B997]/20 font-depixel-small">Competition</SelectItem>
                    <SelectItem value="Sports Competition" className="text-white hover:bg-[#D2B997]/20 font-depixel-small">Sports Competition</SelectItem>
                    <SelectItem value="Cultural Competition" className="text-white hover:bg-[#D2B997]/20 font-depixel-small">Cultural Competition</SelectItem>
                    <SelectItem value="Engineering Event" className="text-white hover:bg-[#D2B997]/20 font-depixel-small">Engineering Event</SelectItem>
                    <SelectItem value="Science Event" className="text-white hover:bg-[#D2B997]/20 font-depixel-small">Science Event</SelectItem>
                    <SelectItem value="Workshop" className="text-white hover:bg-[#D2B997]/20 font-depixel-small">Workshop</SelectItem>
                    <SelectItem value="Exhibition" className="text-white hover:bg-[#D2B997]/20 font-depixel-small">Exhibition</SelectItem>
                    <SelectItem value="Talk" className="text-white hover:bg-[#D2B997]/20 font-depixel-small">Talk</SelectItem>
                    <SelectItem value="Performance" className="text-white hover:bg-[#D2B997]/20 font-depixel-small">Performance</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={selectedDay} onValueChange={setSelectedDay}>
                  <SelectTrigger className="bg-[#1A1A1A] border-[#D2B997]/30 text-white font-depixel-small">
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2A2A2A] border-[#D2B997]/30 text-white">
                    <SelectItem value="all" className="text-white hover:bg-[#D2B997]/20 font-depixel-small">All Days</SelectItem>
                    <SelectItem value="Day 1" className="text-white hover:bg-[#D2B997]/20 font-depixel-small">Day 1</SelectItem>
                    <SelectItem value="Day 2" className="text-white hover:bg-[#D2B997]/20 font-depixel-small">Day 2</SelectItem>
                    <SelectItem value="Day 3" className="text-white hover:bg-[#D2B997]/20 font-depixel-small">Day 3</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                    setSelectedDay("all")
                  }}
                  variant="outline"
                  className="border-[#D2B997] text-[#D2B997] hover:bg-[#D2B997]/10 bg-transparent font-depixel-small"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
              <div className="flex justify-end gap-2">
              </div>
            </div>
          </FadeIn>

          {/* Events Display */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event, index) => {
                const IconComponent = categoryIcons[event.category]

                return (
                  <FadeIn key={event.id} delay={index * 0.1}>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Card
                          className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-[#D2B997]/30 bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] backdrop-blur-sm overflow-hidden"
                          onClick={() => setSelectedEvent(event)}
                        >
                          <CardContent className="p-0">
                            <div className="relative">
                              <Image
                                src={event.image || "/placeholder.svg"}
                                alt={event.name}
                                width={300}
                                height={300}
                                className="w-full h-68 object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-transparent" />

                              {/* Category Badge */}
                              <div className="absolute top-4 left-4">
                                <Badge
                                  className={cn("bg-gradient-to-r text-white border-0 font-depixel-small", categoryColors[event.category])}
                                >
                                  <IconComponent className="w-3 h-3 mr-1" />
                                  {event.category}
                                </Badge>
                              </div>

                              {/* Day Badge */}
                              <div className="absolute top-4 right-4">
                                <Badge className="bg-[#2A2A2A]/60 text-[#D2B997] border-[#D2B997]/30 font-depixel-small">
                                  {event.day}
                                </Badge>
                              </div>
                            </div>

                            <div className="p-6 space-y-4 bg-gradient-to-b from-[#2A2A2A] to-[#1A1A1A]">
                              <div>
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#A8D8EA] transition-colors font-depixel-body">
                                  {event.name}
                                </h3>
                                <p className="text-[#D2B997]/80 text-sm leading-relaxed font-depixel-small">{event.description}</p>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center text-[#D2B997] text-sm font-depixel-small">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  {event.date}
                                </div>
                                <div className="flex items-center text-[#D2B997] text-sm font-depixel-small">
                                  <Clock className="w-4 h-4 mr-2" />
                                  {event.time}
                                </div>
                                <div className="flex items-center text-[#D2B997] text-sm font-depixel-small">
                                  <MapPin className="w-4 h-4 mr-2" />
                                  {event.venue}
                                </div>
                              </div>

                              <div className="pt-2 border-t border-[#D2B997]/20 font-depixel-body">
                                <p className="text-[#F4D03F] text-sm font-semibold">{event.prizes}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </DialogTrigger>

                      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-hide bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] border-[#D2B997]/30">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#A8D8EA] to-[#B8A7D9] bg-clip-text text-transparent font-depixel-body">
                            {event.name}
                          </DialogTitle>
                        </DialogHeader>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="relative">
                              <Image
                                src={event.image || "/placeholder.svg"}
                                alt={event.name}
                                width={400}
                                height={400}
                                className="w-full h-68 object-cover rounded-lg border border-[#D2B997]/30"
                              />
                              <div className="absolute top-4 left-4 flex gap-2">
                                <Badge
                                  className={cn("bg-gradient-to-r text-white border-0 font-depixel-small", categoryColors[event.category])}
                                >
                                  <IconComponent className="w-3 h-3 mr-1" />
                                  {event.category}
                                </Badge>
                                <Badge className="bg-[#2A2A2A]/60 text-[#D2B997] border-[#D2B997]/30 font-depixel-small">
                                  {event.day}
                                </Badge>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center text-[#D2B997] font-depixel-small">
                                <Calendar className="w-5 h-5 mr-3" />
                                <span>{event.date}</span>
                              </div>
                              <div className="flex items-center text-[#D2B997] font-depixel-small">
                                <Clock className="w-5 h-5 mr-3" />
                                <span>
                                  {event.time} ({event.duration})
                                </span>
                              </div>
                              <div className="flex items-center text-[#D2B997] font-depixel-small">
                                <MapPin className="w-5 h-5 mr-3" />
                                <span>{event.venue}</span>
                              </div>
                              {event.maxParticipants && event.maxParticipants !== "#" && event.maxParticipants !== "" && (
                                <div className="flex items-center text-[#D2B997] font-depixel-small">
                                  <Users className="w-5 h-5 mr-3" />
                                  <span>Max {event.maxParticipants} participants</span>
                                </div>
                              )}
                              <div className="flex items-center text-[#D2B997] font-depixel-small">
                                <UserCheck className="w-5 h-5 mr-3" />
                                <span>Team Size: {event.teamSize}</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h4 className="text-lg font-bold text-white mb-5 font-depixel-body">About This Event</h4>
                              <p className="text-[#D2B997]/80 text-xs leading-relaxed whitespace-pre-line font-depixel-small">{event.detailedDescription}</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                              <div className="p-4 bg-gradient-to-br from-[#2A2A2A]/30 to-[#3A3A3A]/30 rounded-lg border border-[#D2B997]/20">
                                <h5 className="text-[#D2B997] font-semibold mb-1 font-depixel-body">Duration</h5>
                                <p className="text-white font-depixel-small">{event.duration}</p>
                              </div>
                            </div>

                            <div className="p-4 bg-gradient-to-r from-[#F4D03F]/30 to-[#F8C471]/30 rounded-lg border border-[#F4D03F]/30">
                              <h5 className="text-[#F4D03F] font-semibold mb-1 font-depixel-body">Prizes & Rewards</h5>
                              <p className="text-[#F8C471] font-depixel-small">{event.prizes}</p>
                            </div>

                            <div className="flex gap-3 pt-4">
                              <Button className="flex-1 bg-gradient-to-r from-[#A8D8EA] to-[#85C1E9] hover:from-[#7FB3D3] hover:to-[#6BB6FF] text-[#1A1A1A] font-depixel-body">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Register Now
                              </Button>
                              <Button
                                variant="outline"
                                className="border-[#D2B997] text-[#D2B997] hover:bg-[#D2B997]/10 bg-transparent font-depixel-body"
                              >
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </FadeIn>
                )
              })}
            </div>
          ) : (
            <div>
              <p className="text-center text-[#D2B997] text-lg font-depixel-body">
                Calendar view is under construction.
              </p>
            </div>
          )}

          {/* No Results */}
          {filteredEvents.length === 0 && viewMode === "grid" && (
            <div className="text-center py-12">
              <div className="text-[#D2B997] text-lg font-depixel-body mb-4">No events found matching your criteria</div>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                  setSelectedDay("all")
                }}
                className="bg-gradient-to-r from-[#A8D8EA] to-[#85C1E9] hover:from-[#7FB3D3] hover:to-[#6BB6FF] text-[#1A1A1A] font-depixel-body"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
