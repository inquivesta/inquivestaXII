"use client"

import { useState, useEffect } from "react"
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
  day: "Day 1" | "Day 2" | "Day 3" | "Day 1 & 2" | "Day 2 & 3" | "Day 1, 2 & 3" | "TBA"
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
  ruleBook?: string // Optional link to rule book
}

const events: Event[] = [
  {
    id: "eureka-zurekaa",
    name: "Eureka-Zurekaa",
    day: "TBA",
    date: "Jan 20 - Feb 6, 2026 (Submission) | Feb 08, 2026 (Award Ceremony)",
    time: "Submission: Ongoing | Award Ceremony: TBD",
    description: "An exciting academic research competition celebrating Scientific Research. Showcase publications and posters to gain expert feedback and connect with researchers.",
    detailedDescription: "Eureka-Zurekaa is an exciting academic research competition that celebrates Scientific Research and recognizes outstanding researchers. It's the perfect platform to turn your scientific ideas into eye-catching posters, showcase publications, gain expert feedback, and connect with a professional network of researchers. Both the Best Publication Award and Best Poster Award competitions will be held online on Zurekaa's website. The submission period is from January 20, 2026, to February 6, 2026.\n\nCONTACT:\nAnamika (9122404968)\nAnshika (9799737303)\n\nEVENT DETAILS:\nEntire event is online with award ceremony at IISER Kolkata Campus (offline)\n\nAWARDS:\n• Best Publication Award\n• Best Poster Award\n\n📋 INSTRUCTIONS:\nhttps://drive.google.com/file/d/16Rq-QwsCSbBAY2sGndjrXkVumCXknwB8/view?usp=sharing",
    image: "/events/zureka.png",
    category: "Science Event",
    venue: "Online (Award Ceremony: IISER Kolkata Campus)",
    prizes: "Prize Pool: ₹56,000",
    registrationLink: "https://www.zurekaa.com/",
    ruleBook: "https://drive.google.com/file/d/16Rq-QwsCSbBAY2sGndjrXkVumCXknwB8/view?usp=sharing",
    socialLink: "#",
    maxParticipants: "Open",
    duration: "Ongoing",
    teamSize: "Individual / Small Teams",
  },
  {
    id: "beat-the-drop",
    name: "Beat the Drop",
    day: "Day 2",
    date: "Feb 07, 2026",
    time: "11:00 AM - 04:00 PM",
    description: "Teams design a contraption to prevent an egg from cracking when dropped from a height.",
    detailedDescription: "Get ready for an egg-citing challenge of innovation, engineering, and problem-solving! Teams will build a contraption to protect an egg from a perilous drop using provided materials, each with assigned costs.",
    image: "/events/beat_the_drop/beat_the_drop.png",
    category: "Science Event",
    venue: "LHC Cafeteria, Room 210",
    prizes: "Prize Pool: ₹10,000",
    registrationLink: "/events/registration/beat-the-drop",
    socialLink: "#",
    maxParticipants: "Teams of 2-4 members",
    ruleBook: "https://drive.google.com/file/d/1WorG1MSaC6hW_0vlexkSGsgikPcLE6eL/view?usp=sharing",
    duration: "5 hours",
    teamSize: "2-4 members",
  },
  {
    id: "botprix",
    name: "Botprix",
    day: "Day 2",
    date: "Feb 07, 2026",
    time: "10:00 AM - 05:00 PM",
    description: "Engineer efficient bots to navigate a challenging racetrack with hurdles and time penalties!",
    detailedDescription: "Botprix is a competition for creative minds to engineer efficient and innovative solutions in the form of bots to navigate a predefined racetrack comprising hurdles of various kinds. The races will be timed, and whoever finishes fastest takes home the prize!\n\nPARTICIPATION:\nNo matter whether you're a student at IISER Kolkata, a different college or even a robotics-lover from a school - you're welcome to participate! Just make a team of 2-4 members, and you're good to go, no registration fees! But hurry up - only 35 teams will be taken on a first come first serve basis!\n\nFORMAT:\nYou will have to come and set up your bots, with some time for calibration and testing, followed by actual driving on a predefined racetrack. The races will be timed. The racetrack will have various sections (the details of which will be intimated 2 months before the race), and each can be skipped if the driver feels so, along with an associated time penalty depending on the difficulty of the section skipped. After all the races are done, the results will be declared based on the time taken by each bot, along with felicitation of winners.\n\nTIMELINE:\n9:00am - 10:00am - Reporting\n10:00am - 11:00am - Slot allotment and bot calibration and testing begins\n11:00am - 4:30pm - Races take place\n4:30pm - 5:00pm - Break\n5:00pm - 6:00pm - Declaration of winners and felicitation ceremony\n\nRULES AND REGULATIONS:\nParticipants must bring their own bots, with the following restrictions:\n• Bots (exclusive of controller weight) should not weigh more than 5kg\n• Should not use batteries of more than 18 volts\n• Bot dimensions should be within 30cm × 30cm × 30cm (with ~5% tolerance)\n• Both wired and wireless modes of communication can be used to control the bot\n• Bot may have any mechanism to enable it to traverse the hurdles and perform the tasks but these mechanisms should follow the above size restrictions\n• Any damage caused to the arena by the robot will lead to immediate penalization and may cause elimination\n• Wires connecting the robot to the external power source must remain slack throughout the run\n• Participants with complete ready-made robo-kits or robots with internal combustion engines will strictly not be allowed\n• In case of any dispute, the judgement of the Botprix organising committee shall be final and binding\n\nPRIZES AND REWARDS:\nAll participants will receive a Certificate of Appreciation (via email), while the winner, runners-up and 2nd runners-up will receive Certificates of Excellence (on the spot) along with cash prizes. All participants will receive some surprise rewards for every section of the racetrack crossed!",
    image: "/events/botprix/botprix.png",
    category: "Engineering Event",
    venue: "Beside Room 107",
    prizes: "Prize Pool: ₹10,000",
    registrationLink: "/events/registration/botprix",
    socialLink: "https://www.instagram.com/inquivesta_iiserk/",
    maxParticipants: "140", // 35 teams * 4 members max
    duration: "9 hours",
    teamSize: "2-3 members",
  },
  {
    id: "art-in-a-culture",
    name: "Art in a Culture",
    day: "Day 1",
    date: "Feb 06, 2026",
    time: "02:00 PM - 06:00 PM",
    description: "Create living art by designing patterns on petri dishes and letting bacterial cultures grow into beautiful masterpieces!",
    detailedDescription: "Art in a Culture is a unique fusion of science and creativity where participants transform petri dishes into canvases for living art!\n\nTHE CONCEPT:\nParticipants will design intricate patterns and drawings on agar plates using bacterial cultures. As the bacteria grow over time, your designs come to life, creating stunning biological artwork that showcases the beauty of microbiology.\n\nEVENT FORMAT:\n• Participants will be provided with sterile petri dishes containing agar medium\n• Use bacterial cultures of different colors to paint your designs\n• Designs will be incubated and judged based on creativity, technique, and final result\n• Learn about aseptic techniques and microbial art\n\nJUDGING CRITERIA:\n• Creativity and originality of design\n• Technical execution and precision\n• Final aesthetic appeal after incubation\n• Scientific understanding demonstrated\n\nELIGIBILITY:\n• Open to all students from IISER Kolkata and other institutions\n• No prior microbiology experience required\n• Individual participation\n\nMaterials and safety equipment will be provided. Come explore the artistic side of science!",
    image: "/events/art/art.jpg",
    category: "Science Event",
    venue: "DBS Teaching Lab",
    prizes: "Prize Pool: ₹5,000",
    registrationLink: "/events/registration/art-in-a-culture",
    socialLink: "#",
    maxParticipants: "#",
    duration: "4 hours",
    teamSize: "Individual"
  },
  {
    id: "bullseye",
    name: "Bullseye",
    day: "Day 3",
    date: "Feb 08, 2026",
    time: "10:00 AM - 12:00 PM & 01:00 PM - 05:00 PM",
    description: "Not your regular archery competition — a fun, hands-on event blending aim, creativity, and problem-solving.",
    detailedDescription: "Bullseye is not your regular archery competition — it's a fun, hands-on event blending aim, creativity, and problem-solving.\n\nEVENT COMPONENTS:\n\n• DartShot: A precision-based dartboard challenge where participants test their focus and control by aiming for the highest score. Each participant gets limited throws to hit specific target zones, combining accuracy, consistency, and quick reflexes.\n\n• Target Tac-Toe (Archery Tic-Tac-Toe)\nA giant 3×3 board will act as the game grid. Participants take turns shooting arrows to claim cells. First to get three in a row wins the round.\n\n• Cup Knockdown Challenge\nPaper cups will be stacked like bowling pins. Participants aim to knock down as many as possible within the time limit, testing power, momentum, and accuracy.\n\nELIGIBILITY:\nOpen to all IISER Kolkata students and participants from other schools/colleges.\n\nREGISTRATION:\nThrough Google Form (spot registration allowed on a first-come, first-serve basis).",
    image: "/events/bulls_eye/bulls_eye.jpg",
    category: "Sports Competition",
    venue: "Athletics Ground",
    prizes: "Prize Pool: ₹8,000",
    registrationLink: "/events/registration/bullseye",
    socialLink: "#",
    maxParticipants: "#",
    duration: "TBD",
    teamSize: "Individual",
  },
  // {
  //   id: "chess-tournament",
  //   name: "Mastermind (Chess)",
  //   day: "Day 2",
  //   date: "Feb 07, 2026",
  //   time: "10:00 AM - 06:00 PM",
  //   description: "Join us for an exciting Chess Tournament where strategy, patience, and skill collide on the 64 squares.",
  //   detailedDescription: "Step into the world of strategy and intellect at the Inquivesta One-Day Inter-College Chess Tournament 2025. Open to students from colleges across India, this rapid-format Swiss League tournament promises intense battles of the mind, guided by official FIDE rules.\n\nWith fair play, inclusivity, and sportsmanship at its core, the event offers participants the thrill of competition and a platform to connect, learn, and grow. 6 rounds of competition with attractive prizes, trophies, and participation certificates.",
  //   image: "/events/chess/chess.svg",
  //   category: "Competition",
  //   venue: "Chess Room, Yoga Room, Carrom Room",
  //   prizes: "Prize Pool: ₹30,000",
  //   registrationLink: "#",
  //   socialLink: "https://instagram.com/chess.club_iiserk",
  //   maxParticipants: "#",
  //   duration: "8.5 hours",
  //   teamSize: "Individual",
  // },
  {
    id: "inquizzitive",
    name: "Inquizzitive",
    day: "Day 2 & 3",
    date: "Feb 07-08, 2026",
    time: "10:00 AM - 12:00 PM & 01:00 PM - 03:00 PM",
    description: "A thrilling quiz competition testing knowledge, quick thinking, and teamwork.",
    detailedDescription: "Inquizzitive is a fast-paced quiz event that puts your knowledge, logic, and quick thinking to the test. From brain-twisting trivia to fun, unexpected challenges, participants will compete across a wide range of topics in an exciting battle of wits. Whether you’re a pop-culture pro, a science whiz, or just love a good challenge, Inquizzitive promises teamwork, strategy, and plenty of surprises. Think fast, trust your instincts, and prove how inquizzitive you really are!",
    image: "/events/quiz/quiz.jpg",
    category: "Competition",
    venue: "Room G06",
    prizes: "Prize Pool: ₹30,000",
    registrationLink: "/events/registration/inquizzitive",
    socialLink: "#",
    maxParticipants: "150",
    duration: "5 hours",
    teamSize: "1-3 members"
  },
  {
    id: "csi",
    name: "Crime Scene Investigation (CSI)",
    day: "Day 1 & 2",
    date: "Feb 07-08, 2026",
    time: "09:30 AM - 05:30 PM (both days)",
    description: "Unleash your inner detective! A thrilling 2-day competition testing analytical thinking, teamwork, and Sherlock-level investigative skills.",
    detailedDescription: "Unleash your inner detective!\n\nCSI is a thrilling competition testing your analytical thinking, teamwork, and Sherlock level investigative skills. Step into the shoes of a forensic investigator as your team works through a series of realistic crime scenes, gathering evidence, solving clues, and answering intricate questionnaires to uncover the truth behind the crimes.\n\nOnly the sharpest minds will make it to the final round — do you have what it takes?!\n\nPARTICIPATION:\nWhether you're a student of IISER Kolkata or from another institution, if you love mystery, logic, and teamwork — this event is for you!\n• Form a team of 1 to 4 members\n• Registration fee: ₹120 per team\n• Hurry — only the first 50 teams to register will be accepted!\n\nSCHEDULE:\n🕤 9:30 AM – 5:30 PM (Both Days)\n• Teams must report on time\n• Break time: 12:00 PM – 2:00 PM\n\nDAY 1:\n• 4 crime scenes\n• Top 25% of the teams (based on scores) advance to the next level for Day 2\n\nDAY 2:\n• More complex scenes and in-depth analysis\n• Final round to determine the ultimate detective team\n\nFORMAT:\n• Each team will be given a fixed time to evaluate each scene — no extensions will be granted\n• Only two/four teams (in registration order) will enter a scene at a time\n• Participants must not displace or tamper with any props in the scene\n• After completing the investigation of each scene, a questionnaire will be uploaded immediately for that team\n• Questionnaires will contain a mix of objective and subjective questions to evaluate reasoning, deduction, and accuracy\n• Teams will analyze the clues, discuss, and submit answers to a mix of objective and subjective questionnaires\n• Points will be awarded based on accuracy, reasoning, and attention to details\n\nPRIZE MONEY:\nTotal prize pool: ₹20,000",
    image: "/events/csi/csi.png",
    category: "Science Event",
    venue: "LHC",
    prizes: "Prize Pool: ₹20,000",
    registrationLink: "/events/registration/csi",
    socialLink: "https://www.instagram.com/csi_deduce?igsh=dnJmN3gyN25hMmox",
    maxParticipants: "50 teams",
    duration: "2 days",
    teamSize: "1-4 members"
  },
  {
    id: "nukkad-natak",
    name: "Nukkad Natak",
    day: "Day 1",
    date: "Feb 06, 2026",
    time: "03:00 PM - 05:30 PM",
    description: "A stage play performed in open areas to spread awareness about social issues directly to the audience.",
    detailedDescription: "Nukkad natak is a stage play which is performed by a group of participants in an open areas preferably a market place or on streets which helps in spreading awareness about a particular issue directly to the general audience.\n\nNukkad natak is generally performed by a group of skilled dramatists who are fluent in voice acting, choreography, screenplay, creative writing along with being able to write catchy slogans/dialogues which hits the audience like a truck.\n\nIn IISER K and in general vicinity there is a very vibrant drama culture, so we expect this edition's nukkad natak to be a successful one.\n\n📋 RULES & REGULATIONS:\n\n1. Teams are expected to perform at an open-air venue, on a stage with an audience on 3 sides.\n\n2. The permitted team limit is 3-15 participants excluding 2 instrumentalists.\n\n3. Time limit shall be 15 minutes, exceeding which will lead to cut of marks.\n\n4. The play should be in Hindi/English.\n\n5. Usage of fire, water or smoke is not allowed. Any props, if used, must be cleared off by the participants after the performance within the time limit.\n\n6. Any instance of vulgarity or disturbing content of any order will lead to forceful halt of performance and immediate disqualification.\n\n7. Only live music is allowed. Teams will have to bring their own instruments.\n\n8. Gulaal or any props, if used, must be cleared off by the participants after their performance within the performance time allotted to them.\n\n🎯 JUDGING CRITERIA:\n• Content, theme and message (40 points)\n• Performance, Direction, gimmicks (40 points)\n• Interaction and improvisation (20 points)\n\n🚌 TRAVEL SERVICES:\nWe provide travel services with set routes for participant convenience. Pre-arranged transportation will be available for teams arriving from different locations. Details regarding pick-up points, routes, and schedules will be shared upon registration confirmation.",
    image: "/events/drama_events/drama_2.png",
    category: "Performance",
    venue: "LHC Backyard",
    prizes: "Prize Pool: ₹10,000",
    registrationLink: "/events/registration/nukkad-natak",
    socialLink: "https://www.instagram.com/aarshi_iiserk/",
    maxParticipants: "#",
    duration: "3 hours",
    teamSize: "3-15 members + 2 instrumentalists"
  },
  {
    id: "headshot-bgmi",
    name: "Headshot x Krafton - BGMI",
    day: "Day 1 & 2",
    date: "Feb 06-07, 2026",
    time:  "TBA",
    description: "A premier E-sports gaming event testing players' reflexes, precision, and decision-making under pressure in BGMI.",
    detailedDescription: "Headshot x Krafton BGMI is a premier E-sports gaming event hosted as part of Inquivesta, the annual science and cultural festival organized by IISER Kolkata.\n\nHeadshot is a competitive gaming tournament designed to test players' reflexes, precision, and decision-making under pressure. In this event, participants will engage in fast-paced, skill-based matches where accuracy and quick thinking are the key.\n\nTOURNAMENT FORMAT:\n• The format includes team-based matchups in BGMI with 4-player teams\n• Matches will be held with standardized equipment and pre-installed game clients\n• The primary focus of the competition will be on accuracy and overall tactical performance\n• Each match will be scored objectively, allowing fair comparison across players or teams\n• Live projections of the matches may also be shown to create an engaging spectator experience",
    image: "/events/headshot/headshot.png",
    category: "Competition",
    venue: "Rooms G02, G08, G09",
    prizes:  "Prize Pool: ₹30,000",
    registrationLink: "/events/registration/headshot-bgmi",
    socialLink: "https://www.instagram.com/headshot_inq?igsh=MWIyajM5OHNqdjB5bg==",
    maxParticipants: "#",
    duration: "TBA",
    teamSize: "4 players per team"
  },
  {
    id: "headshot-valorant",
    name: "HEADSHOT x UEC - Valorant",
    day: "Day 2 & 3",
    date: "Feb 07-08, 2026",
    time: "TBA",
    description: "A premier E-sports gaming event testing players' reflexes, precision, and decision-making under pressure in Valorant.",
    detailedDescription: "Headshot x UEC Valorant is a premier E-sports gaming event hosted as part of Inquivesta, the annual science and cultural festival organized by IISER Kolkata.\n\nHeadshot is a competitive gaming tournament designed to test players' reflexes, precision, and decision-making under pressure. In this event, participants will engage in fast-paced, skill-based matches where accuracy and quick thinking are the key.\n\nTOURNAMENT FORMAT:\n• The format includes team-based matchups in Valorant\n• Matches will be held with standardized equipment and pre-installed game clients\n• The primary focus of the competition will be on accuracy and overall tactical performance\n• Each match will be scored objectively, allowing fair comparison across players or teams\n• Live projections of the matches may also be shown to create an engaging spectator experience",
    image: "/events/headshot/headshot.png",
    category: "Competition",
    venue: "Rooms G02, G08, G09",
    prizes: "Prize Pool: ₹20,000",
    registrationLink: "/events/registration/headshot-valorant",
    socialLink: "https://www.instagram.com/headshot_inq?igsh=MWIyajM5OHNqdjB5bg==",
    maxParticipants: "#",
    duration: "8.5 hours",
    teamSize: "Teams"
  },
  {
    id: "headshot-fc",
    name: "HEADSHOT x UEC FC26",
    day: "Day 2 & 3",
    date: "Feb 07-08, 2026",
    time: "TBA",
    description: "EA Sports FC 26 tournament - showcase your football gaming skills and compete for the championship!",
    detailedDescription: "Headshot FC 26 is a premier E-sports gaming event hosted as part of Inquivesta, the annual science and cultural festival organized by IISER Kolkata.\n\nHeadshot FC 26 is a competitive gaming tournament designed to test players' reflexes, precision, and decision-making under pressure. In this event, participants will engage in fast-paced, skill-based matches where strategy and quick thinking are the key.\n\nTOURNAMENT FORMAT:\n• Solo tournament - individual matches\n• Matches will be held with standardized equipment and pre-installed game clients\n• The primary focus of the competition will be on skill and tactical performance\n• Each match will be scored objectively, allowing fair comparison across players\n\nPRIZE POOL: ₹5,000",
    image: "/events/headshot/headshot.png",
    category: "Competition",
    venue: "TBA",
    prizes: "Prize Pool: ₹5,000",
    registrationLink: "/events/registration/headshot-fc",
    socialLink: "https://www.instagram.com/headshot_inq?igsh=MWIyajM5OHNqdjB5bg==",
    maxParticipants: "#",
    duration: "TBA",
    teamSize: "Individual"
  },
  {
    id: "headshot-vr",
    name: "HEADSHOT x UEC VR",
    day: "Day 2 & 3",
    date: "Feb 07-08, 2026",
    time: "TBA",
    description: "Virtual Reality gaming tournament - immerse yourself in VR and compete for victory!",
    detailedDescription: "Headshot VR is a premier Virtual Reality gaming event hosted as part of Inquivesta, the annual science and cultural festival organized by IISER Kolkata.\n\nHeadshot VR is a competitive gaming tournament designed to test players' reflexes, precision, and spatial awareness in immersive VR environments. Experience gaming like never before!\n\nTOURNAMENT FORMAT:\n• Solo tournament - individual participation\n• VR equipment will be provided on-site\n• The primary focus of the competition will be on accuracy and quick reflexes\n• Each round will be scored objectively, allowing fair comparison across players\n\nPRIZE POOL: ₹5,000",
    image: "/events/headshot/headshot.png",
    category: "Competition",
    venue: "TBA",
    prizes: "Prize Pool: ₹5,000",
    registrationLink: "/events/registration/headshot-vr",
    socialLink: "https://www.instagram.com/headshot_inq?igsh=MWIyajM5OHNqdjB5bg==",
    maxParticipants: "#",
    duration: "TBA",
    teamSize: "Individual"
  },
  {
    id: "inquicon",
    name: "Inquicon",
    day: "Day 2",
    date: "Feb 07, 2026",
    time: "09:00 AM - 05:00 PM",
    description: "A high-energy celebration of anime, manga, gaming, and cosplay with performances, competitions, and prizes.",
    detailedDescription: "Inquicon brings IISER-K's fandom community together with four flagship events:\n\nEVENT LINEUP:\n• Karaoke Musical Performance — a lively opening act by the Inquicon team to kick off the celebration\n• Pokémon Showdown Tournament — a competitive 6v6 Pokémon battle, projected live with commentary and audience hype\n• Cosplay Performance — showcase your character on stage, with prizes for best performances and audience-voted Mesmerizers\n• Chitrakatha Prize Distribution — awarding winners of IISER-K's Manga Contest (Best Storyline & Best Plot)\n\nEVENT TIMELINE:\n• Karaoke Musical Performance: 9:30 AM\n• Chitrakatha Prize Distribution: 10:00 – 10:30 AM\n• Pokémon Showdown Tournament: 10:40 AM – 1:30 PM\n• Cosplay Performance: 2:00 – 5:00 PM\n\nPRIZE BREAKDOWN:\n• Pokémon Showdown: Winner ₹2,000 + merch; Runner-up ₹1,000 + merch; MVP ₹1,000 + merch\n• Cosplay: 1st Prize ₹3,000 + merch; 2nd Prize ₹2,000 + merch; Mesmerizer (Male) ₹1,000 + merch; Mesmerizer (Female) ₹1,000 + merch\n• Chitrakatha: Best Plot ₹1,000 + merch; Best Art ₹1,000 + merch",
    image: "/events/inquicon/inquicon_w_t.png",
    category: "Cultural Competition",
    venue: "RNT Auditorium",
    prizes: "Prize Pool: ₹15,000",
    registrationLink: "/events/registration/inquicon",
    socialLink: "https://www.instagram.com/anicon3.o",
    maxParticipants: "#",
    duration: "7.5 hours",
    teamSize: "Individual/Teams (varies by event)"
  },
  {
    id: "junkyard-wars",
    name: "Junkyard Wars",
    day: "Day 3",
    date: "Feb 08, 2026",
    time: "10:00 AM - 06:00 PM",
    description: "Build working machines from random scrap materials to perform specified tasks - imagination rules the world!",
    detailedDescription: "JUNKYARD WARS: IMAGINATION RULES THE WORLD.\n\nThe participants will be given random scrap materials (The only inventory) out of which you have to build a working model (machines) which can perform the specified task. It's a test of your dexterity and intuitive thought process. The competition aims to test how quick and creative one can be at the same time and solve a problem. That's what JUNKYARD WARS is about.\n\nGENERAL POINTS:\n1. TEAM SIZE = 2-4 MEMBERS\n2. MACHINE SHOULD BE BUILT WITHIN THE TIME LIMIT\n3. JUDGE DECISION IS THE FINAL DECISION\n4. USE OF ANY OUTSIDE ITEM IS PROHIBITED EXCEPT MARKER & SCALE\n5. THE COMPLETE RULEBOOK WILL BE PROVIDED LATER",
    image: "/events/junkyard_wars/junkyard_wars.png",
    category: "Engineering Event",
    venue: "Beside Room 107 + Room 108",
    prizes: "Prize Pool: ₹13,000",
    registrationLink: "/events/registration/junkyard-wars",
    socialLink: "#",
    maxParticipants: "#",
    duration: "8 hours",
    teamSize: "2-3 members"
  },
  {
    id: "lost",
    name: "LOST (Launch of Syntax Termination)",
    day: "Day 3",
    date: "Feb 08, 2026",
    time: "10:00 AM - 05:00 PM",
    description: "A high-stakes treasure hunt across campus where you must outsmart an AI system that has seized control.",
    detailedDescription: "L.O.S.T. isn't just a game — it's the story of humanity's last stand.\n\nParticipants enter a dystopian world where an advanced AI has taken over, shutting down systems and rewriting human control. Your mission is to infiltrate its defenses: uncover hidden clues across campus, decrypt corrupted files, and piece together the fragments of malware that can terminate its reign.\n\nEvery clue will challenge you with logic puzzles, code-breaking, cryptic trails, and tech-driven mysteries, all rooted in the theme of survival against machines. Teams must combine speed, reasoning, and collaboration to reconstruct the AI's weakness and upload the kill switch before time runs out.\n\nOnly the sharpest minds will survive the machine uprising. Will you rewrite the end, or become another lost cause?\n\nDecode, decrypt, and survive — before humanity is completely overwritten.",
    image: "/events/lost/lost.png",
    category: "Competition",
    venue: "Campus",
    prizes: "Prize Pool: ₹15,000",
    registrationLink: "/events/registration/lost",
    socialLink: "#",
    maxParticipants: "#",
    duration: "7 hours",
    teamSize: "upto 4 members"
  },
  {
    id: "masquerade",
    name: "Masquerade",
    day: "Day 1",
    date: "Feb 06, 2026",
    time: "06:00 PM - 09:00 PM",
    description: "It is New Year's Eve, 1969. Join us for a masquerade where love, mystery, and the end of everything join together under one starlit roof.",
    detailedDescription: "It is New Year's Eve, 1969.\nThe world stands on the edge of a new age. An age of machines, intelligence, and electric dreams. Whispers of an AI uprising stir in the cold December air, the future buzzing beneath the neon lights — uncertain and alive.\n\nWithin the gold and rose lit floor, a romantic crowd gathers. Disco beats echo in the hall, champagne sparkles, and secrets shimmer behind satin masks. Every glance threatens to reveal. Confessions tremble on the edge of their tongues. Laughter mixes with the fear of what dawn might bring.\n\nWhen the clock strikes twelve, will you hold on or let go?\n\nJoin us for a masquerade where love, mystery, and the end of everything join together under one starlit roof.\nDress bold. Dance reckless. Tonight, the future begins.\n\nEVENT DETAILS:\n• Solo or Couple entries welcome\n• Dress Code: Formal attire with masks encouraged\n• Registration Fees:\n  - Couple Pass: ₹169\n  - Single Male Pass: ₹91\n  - Single Female Pass: ₹52\n• Venue: LHC Backyard\n• Duration: 3 hours\n• An evening of disco vibes, dance, and unforgettable moments\n\nBe Bold. Dance Bolder. Have Fun!",
    image: "/events/masquerade/masquerade.jpg",
    category: "Performance",
    venue: "LHC Backyard",
    prizes: "N/A",
    registrationLink: "/events/registration/masquerade",
    socialLink: "#",
    maxParticipants: "#",
    duration: "3 hours",
    teamSize: "Solo or Couple"
  },
  {
    id: "photon",
    name: "Photon",
    day: "Day 1, 2 & 3",
    date: "Feb 06-08, 2026",
    time: "All Day (Submissions Open)",
    description: "Capture the world through the lens of 'Life in Motion' and win exciting prizes!",
    detailedDescription: "Photon is a themed photography competition celebrating visual storytelling and artistic excellence.\n\nTHEME: \"Life in Motion\"\nCapture movement, action, energy, or the dynamic nature of life. Images should interpret the theme while showcasing creative vision and technical excellence.\n\nEXHIBITION:\n• Venue: Beside LHC Cafeteria, IISER Kolkata\n• Duration: February 6-8, 2026\n• Selected entries will be displayed throughout the festival\n\nSUBMISSION PERIOD:\n• January 12 - February 1, 2026\n• Deadline: February 1, 2026 by 11:59 PM\n• Open to all, free of charge\n• Maximum 3 entries per participant\n\nREQUIREMENTS:\n• Photographs must be taken between January 1 - February 1, 2026\n• Format: JPEG or PNG only\n• Basic adjustments allowed (exposure, contrast, color correction, cropping)\n• NO heavy manipulation, composite images, adding/removing elements, borders, or text overlays (except metadata)\n\nSUBMISSION PROCESS:\n• Include: photograph file, title, brief description (max 50 words)\n• Submit via Google Form\n• Entries judged by professional photographer Santanu Dey\n\nJUDGING CRITERIA (100 points):\n• Theme interpretation and relevance - 30%\n• Technical excellence - 25%\n• Creativity and originality - 25%\n• Composition and visual impact - 20%\n\nCOPYRIGHT & USAGE:\n• Participants retain copyright of their work\n• Organizers receive rights to display, publish, and promote entries\n• Images may be used in promotional materials and social media\n• Proper credits will be given to photographers\n\nWINNERS:\n• Announced on February 6, 2026\n• Prize Pool: ₹7,500\n\nDISQUALIFICATION GROUNDS:\n• Missing submission deadlines\n• Violation of theme or technical requirements\n• Inappropriate content or plagiarism",
    image: "/events/photon/photon.png",
    category: "Exhibition",
    venue: "Beside LHC Cafeteria, IISER Kolkata",
    prizes: "Prize Pool: ₹7,500",
    registrationLink: "https://docs.google.com/forms/d/e/1FAIpQLSfpCDc6zxaIG92HArZsx6os8w-qiN6TzwITCpa_KIcisDNnKA/viewform",
    socialLink: "https://www.instagram.com/pixel.iiser_kolkata",
    maxParticipants: "Open",
    duration: "3 days",
    teamSize: "Individual"
  },
  {
    id: "smash7",
    name: "Smash 7",
    day: "Day 1, 2 & 3",
    date: "Feb 06-08, 2026",
    time: "09:00 AM - 05:00 PM (Day 1 & 2), 09:00 AM - 12:00 PM (Day 3)",
    description: "A fast-paced 10-over tennis ball box cricket league combining thrill, strategy, and inclusivity.",
    detailedDescription: "Smash7 is a high-energy 10-over box cricket tournament where 10-player teams battle it out in fast-paced, action-packed matches. Open to IISER Kolkata, colleges, and schools, the league blends strategy, teamwork, and thrill with short boundaries and quick play.\n\nTOURNAMENT FORMAT:\n• 10-over tennis ball box cricket\n• 10-player teams\n• League stages followed by playoffs\n• Professional umpiring\n• Prizes for champions and top performers\n\nSCHEDULE:\nDay 1:\n9:00 AM – 12:00 Noon → 3 matches\n2:00 PM – 5:00 PM → 3 matches\n\nDay 2:\n9:00 AM – 12:00 Noon → 3 matches\n2:00 PM – 5:00 PM → 3 matches\n\nDay 3:\n2:00 PM – 3:00 PM → Semi Final 1\n3:00 PM – 4:00 PM → Semi Final 2\n4:00 PM – 5:00 PM → Final\n\nSmash7 promises an unforgettable sporting highlight of Inquivesta with fast-paced action, strategic gameplay, and competitive spirit!",
    image: "/events/smash7/smash7_b.png",
    category: "Sports Competition",
    venue: "IISER Kolkata Cricket Ground",
    prizes: "Prize Pool: ₹14,000",
    registrationLink: "/events/registration/smash7",
    socialLink: "https://www.instagram.com/cricket_club_iiserk/",
    maxParticipants: "128 (16 Teams)",
    duration: "3 days (8 hours each)",
    teamSize: "11 + 2 players per team"
  },
  {
    id: "soulbeats",
    name: "Soulbeats",
    day: "Day 2 & 3",
    date: "Feb 07-08, 2026",
    time: "1:00 PM - 5:30 PM (Day 2), 11:00 AM - 2:00 PM (Day 3)",
    description: "An exhilarating dance fest designed to ignite passion, foster creativity, and celebrate the art of dance in all its forms.",
    detailedDescription: "Inquivesta Soulbeats is an exhilarating dance fest designed to ignite passion, foster creativity, and celebrate the art of dance in all its forms.\n\nEVENT COMPONENTS:\n\nX-PRESS (Theme: Innovation):\n• Stage dance competition with pre-rehearsed performances\n• Category is open - solo, duet, or group dance performances\n• Performance duration: 4-7 minutes\n• Audio must be provided 3 days before the event\n• Maximum 10 members per group\n• No spot registrations accepted\n• Proper costume required, green room provided\n• Time slots will be allotted for each performance\n\nSURVIVAL OF THE FITTEST:\n• On-spot dance battle competition\n• Category is open\n• Participants perform to random songs (approximately 1 minute per song)\n• Only 30 participants selected (first come, first serve)\n• Multi-round elimination format\n• Tests ability to think on feet and adapt quickly\n\nWORKSHOP SESSION:\n• Dance mini-workshop instructed by guest judges\n• Opportunity to learn from experienced dancers\n• Direct interaction with professional judges\n• Open to all dance enthusiasts\n\nSCHEDULE:\nDAY 2:\nSession 1: 1:00 PM - 3:00 PM: X-press\nBreak: 3:00 PM - 3:30 PM\nSession 2: 3:30 PM - 5:30 PM: Survival of the Fittest\n\nDAY 3:\nSession 3: 11:00 AM - 2:00 PM: Workshop Session\n\nELIGIBILITY:\n• Anyone above 10 years of age is eligible to participate\n• Registration through Google Form required",
    image: "/events/soulbeats/soulbeats.png",
    category: "Cultural Competition",
    venue: "Room 107",
    prizes: "Prize Pool: ₹22,000",
    registrationLink: "/events/registration/soulbeats",
    socialLink: "#",
    maxParticipants: "#",
    duration: "2 days",
    teamSize: "Individual/Groups (max 10 members)"
  },
  {
    id: "thrust",
    name: "THRUST",
    day: "Day 3",
    date: "Feb 08, 2026",
    time: "11:00 AM - 04:00 PM",
    description: "Pressure builds, water sprays, and rockets soar! The ultimate test of engineering in water bottle rocketry.",
    detailedDescription: "Ready to build, launch, and dominate? Inquivesta's THRUST is your chance to turn a simple 1-liter bottle into a high-flying, liquid-fueled rocket!\n\nUnleash your inner engineer as you design and build a masterpiece from everyday materials like cardboard, tape, and glue. Work with your team of up to three to compete in three thrilling levels:\n\nLEVEL 1: MAXIMUM RANGE AND AIR TIME\nChallenge for the longest distance and flight duration\n\nLEVEL 2: PAYLOAD TEST\nCarry a ping-pong ball and maintain performance\n\nLEVEL 3: TARGET CHALLENGE\nHigh-stakes precision challenge for top teams\n\nIt's a fast-paced battle of science and creativity. The team with the highest score after the first two levels will secure a cash prize of ₹500.\n\nEVENT DETAILS:\n• Team Size: Up to 3 members\n• Eligibility: Students of IISER Kolkata, other colleges, and schools\n• What to Bring: Just a 1-liter water bottle per team\n• What We Provide: Cardboard, thermocol, adhesives (glue-gun, liquid glue, cello-tape), thermocol cutter, pencils, and scales\n\nGet ready for liftoff!",
    image: "/events/thrust/thrust.png",
    category: "Engineering Event",
    venue: "SAC + Football Ground",
    prizes: "Prize Pool: ₹10,000",
    registrationLink: "/events/registration/thrust",
    socialLink: "#",
    maxParticipants: "#",
    duration: "5.5 hours",
    teamSize: "Up to 3 members"
  },
  {
    id: "hoop-hustle",
    name: "Hoop Hustle",
    day: "Day 2 & 3",
    date: "Feb 07-08, 2026",
    time: "10:00 AM - 05:00 PM",
    description: "High-energy 3v3 basketball tournament featuring fast-paced matches with teams of 3 players plus 1 substitute.",
    detailedDescription: "Hoop Hustle is an electrifying 3v3 basketball tournament that brings the intensity of street basketball to Inquivesta XII!\n\nTOURNAMENT FORMAT:\n• 3v3 basketball format\n• Teams of 3 players + 1 substitute\n• Fast-paced half-court matches\n• League stages followed by knockout rounds\n\nELIGIBILITY:\n• Open to students from IISER Kolkata, other colleges, and schools\n• Both men's and mixed teams welcome\n\nRULES:\n• Standard FIBA 3x3 rules apply\n• 10-minute games or first to 21 points\n• Shot clock rules in effect\n\nPRIZE POOL: ₹10,000\n\nRegistration Fee:\n• External participants: ₹500 per team\n• IISER Kolkata students: ₹300 per team\n\nBring your A-game and show us what you've got on the court!",
    image: "/events/3v3_basketball/3v3_basketball.jpg",
    category: "Sports Competition",
    venue: "Basketball Ground",
    prizes: "Prize Pool: ₹10,000",
    registrationLink: "/events/registration/hoop-hustle",
    socialLink: "#",
    maxParticipants: "30 teams",
    duration: "2 days",
    teamSize: "3 + 1 substitute"
  },
  {
    id: "table-tennis",
    name: "Table Tennis",
    day: "Day 2",
    date: "Feb 07, 2026",
    time: "10:00 AM - 05:00 PM",
    description: "Compete in Men's Singles, Women's Singles, Men's Doubles, or Mixed Doubles in this exciting table tennis tournament.",
    detailedDescription: "Table Tennis at Inquivesta XII features multiple categories for all skill levels!\n\nCATEGORIES:\n• Men's Singles\n• Women's Singles\n• Men's Doubles\n• Mixed Doubles\n\nTOURNAMENT FORMAT:\n• Knockout rounds with best-of-3 sets format\n• Finals will be best-of-5 sets\n• Standard ITTF rules apply\n\nELIGIBILITY:\n• Open to students from IISER Kolkata, other colleges, and schools\n• Must register for specific category\n\nREGISTRATION FEE:\n• Singles: ₹100 (External) / ₹30 (IISER Kolkata)\n• Doubles: ₹200 per team (External) / ₹60 per team (IISER Kolkata)\n\nBring your paddles and compete for glory!",
    image: "/events/table-tennis/image.png",
    category: "Sports Competition",
    venue: "Table Tennis Room",
    prizes: "Prize Pool: ₹10,000",
    registrationLink: "/events/registration/table-tennis",
    socialLink: "#",
    maxParticipants: "#",
    duration: "1 day",
    teamSize: "Individual / Doubles"
  },
  {
    id: "spotlight",
    name: "Spotlight - Cultural Night",
    day: "Day 1",
    date: "Feb 06, 2026",
    time: "09:00 PM - 12:00 AM",
    description: "A grand cultural night showcasing performances by IISER Kolkata students. Call for Performances now open!",
    detailedDescription: "Spotlight is the grand cultural night of Inquivesta XII, featuring incredible performances by talented IISER Kolkata students!\n\n🎭 CALL FOR PERFORMANCES\nWe're looking for talented performers to light up the stage at Spotlight. Whether you sing, dance, perform comedy, play instruments, or have any other performance art - we want to see you!\n\n📋 HOW TO PARTICIPATE:\n1. Fill out the Google Form to register your interest\n2. Screening will be conducted one week before the fest\n3. Selected performers will be confirmed for the main event\n\n🔗 REGISTRATION FORM:\nhttps://forms.gle/sa1MDRQcThgD31j3A\n\n⚠️ ELIGIBILITY:\n• Only IISER Kolkata students can participate in performances\n• All fest attendees can enjoy the show\n\nEVENT DETAILS:\n• Venue: RNT Auditorium\n• Time: 9:00 PM - 12:00 AM\n• Capacity: 135 seated\n\nCome witness an unforgettable night of music, dance, and entertainment!",
    image: "/events/spotlight/spotlight.jpg",
    category: "Performance",
    venue: "RNT Auditorium",
    prizes: "N/A",
    registrationLink: "https://forms.gle/sa1MDRQcThgD31j3A",
    socialLink: "#",
    maxParticipants: "#",
    duration: "3 hours",
    teamSize: "Individual/Groups (IISER Kolkata only)"
  }
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

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (hash) {
      const event = events.find(e => e.id === hash)
      if (event) {
        setSelectedEvent(event)
      }
    }
  }, [])

  useEffect(() => {
    if (selectedEvent) {
      window.location.hash = selectedEvent.id
    } else {
      window.location.hash = ''
    }
  }, [selectedEvent])

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory
    const matchesDay = selectedDay === "all" || event.day === selectedDay

    return matchesSearch && matchesCategory && matchesDay
  })

  const shareEvent = async (event: Event) => {
    const url = `${window.location.origin}/events#${event.id}`
    const text = `Check out ${event.name} at Inquivesta XII!`

    if (navigator.share) {
      try {
        await navigator.share({
          title: event.name,
          text: text,
          url: url,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${text} ${url}`)
        alert('Event link copied to clipboard!')
      } catch (err) {
        console.error('Error copying to clipboard:', err)
        alert('Unable to share. Please copy the URL manually.')
      }
    }
  }

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
                    <SelectItem value="Day 1 & 2" className="text-white hover:bg-[#D2B997]/20 font-depixel-small">Day 1 & 2</SelectItem>
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
                    <Dialog open={selectedEvent?.id === event.id} onOpenChange={(open) => {
                      if (open) {
                        setSelectedEvent(event)
                      } else if (selectedEvent?.id === event.id) {
                        setSelectedEvent(null)
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Card
                          className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl border-[#D2B997]/30 bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] backdrop-blur-sm overflow-hidden"
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

                            {event.ruleBook && (
                              <a href={event.ruleBook} target="_blank" rel="noopener noreferrer">
                                <Button className="w-full bg-gradient-to-r from-[#B8A7D9] to-[#D2B997] hover:from-[#D2B997] hover:to-[#B8A7D9] text-[#1A1A1A] font-depixel-body">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  View Rulebook
                                </Button>
                              </a>
                            )}

                            <div className="flex gap-3 pt-4">
                              {event.registrationLink !== "#" ? (
                                <Link href={event.registrationLink} className="flex-1">
                                  <Button className="w-full bg-gradient-to-r from-[#A8D8EA] to-[#85C1E9] hover:from-[#7FB3D3] hover:to-[#6BB6FF] text-[#1A1A1A] font-depixel-body">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Register Now
                                  </Button>
                                </Link>
                              ) : (
                                <Button disabled className="flex-1 bg-gray-500 text-white font-depixel-body">
                                  Registration TBA
                                </Button>
                              )}
                              <Button
                                variant="outline"
                                className="border-[#D2B997] text-[#D2B997] hover:bg-[#D2B997]/10 bg-transparent font-depixel-body"
                                onClick={() => shareEvent(event)}
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
