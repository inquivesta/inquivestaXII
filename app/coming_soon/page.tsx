"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FadeIn } from "@/components/ui/fade-in"
import { HyperText } from "@/components/ui/hyper-text"
import { NumberTicker } from "@/components/ui/number-ticker"
import {
  Home,
  Sparkles,
  Rocket,
  Atom,
  Zap,
  Brain,
  Telescope,
  Dna,
  Beaker,
  Calculator,
  Star,
  Coffee,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"

const luckyLinks = [
  "https://helioindex.org/html/tables/index.html",
  "https://annas-archive.org/",
  "https://ptable.com/",
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "https://mathworld.wolfram.com/",
  "https://www.iiserkol.ac.in/~adg/",
  "https://www.youtube.com/@veritasium",
  "https://www.youtube.com/@3blue1brown",
  "https://www.youtube.com/@kurzgesagt",
  "https://www.youtube.com/@SciShow",
  "https://www.youtube.com/@minutephysics",
  "https://www.youtube.com/@CoderSpaceChannel",
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "https://www.youtube.com/@3blue1brown",
  "https://www.youtube.com/playlist?list=PLUl4u3cNGP61O7HkcF7UImpM0cR_L2gSw",
  "https://linear.axler.net/",
  "https://www.youtube.com/watch?v=cvh0nX08nRw",
  "https://alessandroroussel.com/creations_list",
  "https://acegikmo.com/",
  "https://mitxela.com/projects/fluid-pendant",
  "https://scaleofuniverse.com/",
  "https://www.myretrotvs.com/",
  "https://link.springer.com/rwe/10.1007/978-3-319-57072-3_113#Sec11",
  "https://medium.com/@bit101/flow-fields-part-i-3ebebc688fd8",
  "https://algo.uni-trier.de/demos/",
  "https://www.solareclipsetimer.com/book_screenshots.html",
  "https://www.planet4589.org/space/",
  "https://www.falstad.com/mathphysics.html",
  "https://www.iiserkol.ac.in/~ekpehal/index.html",
  "https://www.instagram.com/slashdotiiserkol/?hl=en",
  "https://www.instagram.com/inquivesta_iiserk/?hl=en",
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "https://identity-iiserkol.blogspot.com/2023/03/why-am-i-frequently-meeting-my-crush.html",
  "https://www.iiserkol.ac.in/~maths.club/assets/documents/articles/2022-03-14/tiki-taka-with-catalan-numbers.pdf",
  "https://www.reddit.com/r/generative/",
  "https://www.americanscientist.org/article/third-base",
  "https://www.spidersge.org/",
  "https://xkcd.com/",
  "https://www.funwithcomputervision.com/"
]

const funnyMessages = [
  // Funny & Witty
  "🧪 We're currently peer-reviewing our fun algorithms... Results pending!",
  "🚀 Warning: Our excitement levels have exceeded theoretical limits",
  "🤖 Teaching our AI to understand the difference between 'cool' and 'absolute zero'",
  "⚛️ Currently splitting our attention between atoms and awesome events",
  "🧬 DNA analysis confirms: 99.9% science, 0.1% pure madness",
  "🔬 Under construction: One laboratory of legendary proportions",
  "⚡ Charging our particle accelerators and our enthusiasm simultaneously",
  "🌌 Houston, we have lift-off... eventually!",

  // Science Fun Facts
  "🐙 Fun fact: Octopuses have three hearts and blue blood. We have one website and infinite passion!",
  "🌡️ Did you know? Absolute zero is -273.15°C, but our excitement temperature is off the charts!",
  "🧠 Your brain uses 20% of your body's energy. Ours is using 100% to plan Inquivesta!",
  "🌟 A single teaspoon of neutron star would weigh 6 billion tons. Our content? Infinitely denser!",
  "🐝 Bees can see ultraviolet patterns on flowers. We see infinite possibilities for science!",
  "🌍 Earth travels 67,000 mph around the sun. We're moving even faster toward launch day!",
  "🦋 The butterfly effect: A small wing flap can cause a tornado. Our small fest? Pure chaos of knowledge!",

  // Math Fun Facts & Jokes
  "∞ There are more possible chess games than atoms in the observable universe. More fun facts coming soon!",
  "π Fun fact: Pi has been calculated to 62.8 trillion digits. We're calculating infinite ways to amaze you!",
  "🎯 The probability of awesome happening at Inquivesta approaches 1 as time approaches launch!",
  "📊 Statistics show 73.6% of statistics are made up. This website? 100% worth the wait!",
  "🔢 In binary, there are 10 types of people: those excited for Inquivesta and those who will be!",
  "📐 Geometry teaches us parallel lines never meet. Except here, where all sciences converge!",

  // Famous Science Quotes (Modified)
  "💡 'Science is not only compatible with spirituality; it's a profound source of spirituality' - Carl Sagan (and Inquivesta!)",
  "🔬 'The important thing is not to stop questioning' - Einstein (We're questioning everything, including our launch date!)",
  "⚗️ 'Science is magic that works' - Kurt Vonnegut (Our magic show starts soon!)",
  "🌟 'Two things are infinite: the universe and human stupidity... and our dedication to this fest' - Einstein (probably)",
  "🧪 'In science there is only physics; all the rest is stamp collecting' - Rutherford (We collect all sciences here!)",

  // Thought-Provoking & Deep
  "🌌 The universe is not only stranger than we imagine, it's stranger than we can imagine. Just like our schedule!",
  "🔬 Every atom in your body came from a star that exploded. You are literally made of star stuff waiting for Inquivesta!",
  "🧬 Evolution took 4 billion years to create you. We're taking a few more days to create the perfect science fest.",
  "⚡ Energy cannot be created or destroyed, only transformed. We're transforming anticipation into pure science joy!",
  "🎭 'The most beautiful thing we can experience is the mysterious' - Einstein. Mystery solved: It's Inquivesta!",

  // India-Specific & Cultural
  "🇮🇳 From Aryabhata to APJ Abdul Kalam, India's scientific legacy continues... at Inquivesta!",
  "🚀 Mangalyaan reached Mars in just 298 days. Our website is taking a bit longer, but worth the orbital wait!",
  "🧮 Zero was invented in India. We're adding infinite excitement to that mathematical legacy!",
  "🌶️ Spicier than your favorite curry, cooler than liquid nitrogen - that's Inquivesta!",

  // Tech & Modern Science
  "💻 404 Error: Boredom not found. Loading: Maximum science engagement...",
  "🤖 Our neural networks are deep-learning the art of the perfect science festival",
  "🛰️ GPS says we've arrived at awesome. Recalculating route to 'absolutely mind-blowing'...",
  "📱 Current status: Coding the future, debugging the present, celebrating science always",

  // Mathematical Humor from the document & more
  "📚 'All positive integers are interesting. Proof: Assume the contrary... but hey, that's pretty interesting! A contradiction!'",
  "🎯 What's an anagram of Banach-Tarski? Banach-Tarski Banach-Tarski! (Math jokes are the best jokes)",
  "🔢 There are infinitely many composite numbers. Proof: Multiply them all and... don't add one. New composite! Math magic!",
  "📐 Erdős had a simple motto: 'Another roof, another proof.' Our motto: 'Another day, another equation!'",
  "📊 A theorem was 'true in the sense of Henri Cartan' if no one could find a counterexample in an hour. Our website is true in all senses!",
  "∑ Why did the mathematician name his dog 'Cauchy'? Because he left a residue at every pole!",
  "∫ Integration by parts is like a dance: you lead with u, follow with dv, and hope you don't step on infinities!",
  "📏 Parallel lines have so much in common. It's a shame they'll never meet... unlike all sciences at Inquivesta!",
  "🎲 The probability that a mathematician makes a joke about probability is approximately 1",
  "🧮 Why do mathematicians like parks? Because of all the natural logs!",

  // Biology Humor & Facts
  "🧬 DNA walks into a bar. Bartender says 'Why the long helix?' DNA replies 'I'm just trying to replicate a good time!'",
  "🦠 Mitochondria: The powerhouse of the cell... and the powerhouse of biology memes since 2010!",
  "🌱 Darwin's finches evolved different beaks. Our website is evolving different features (slowly but surely!)",
  "🐛 Fun fact: Fruit flies were crucial for genetics research. We're crucial for your science education!",
  "🧫 Cells divide to multiply. We're multiplying excitement without division!",
  "🦴 Why don't skeletons fight each other? They don't have the guts! (But we have the guts to host an epic fest!)",
  "🧠 Neurons that fire together, wire together. Scientists that gather together... create Inquivesta together!",
  "🐝 Bees communicate through dance. We communicate through pure scientific enthusiasm!",
  "🌸 Flowers evolved to attract pollinators. Our website evolved to attract science lovers!",
  "🦋 Metamorphosis: When a caterpillar becomes a butterfly. When Inquivesta launches: When anticipation becomes pure joy!",
  "🧪 Enzymes lower activation energy. We lower the activation energy for loving science!",
  "🔬 Under a microscope, everything looks interesting. Under our lens, science becomes fascinating!",

  // Physics Humor & Puns
  "⚛️ Schrödinger's website: It's simultaneously ready and under construction until you observe it!",
  "🌊 Light behaves as both wave and particle. Our excitement behaves as both energy and matter!",
  "⚡ Ohm's Law: V=IR. Our law: Fun = Science × Time (where Time approaches Inquivesta!)",
  "🎯 Heisenberg was pulled over by a cop. 'Do you know how fast you were going?' 'No, but I know exactly where I am... at Inquivesta!'",
  "🌌 Einstein's theory: E=mc². Our theory: Excitement = Festival × (Curiosity)²",
  "🔋 Current events in physics: Everything's electric! Current events at Inquivesta: Everything's electrifying!",
  "🧲 Opposites attract in magnetism. In science, everything attracts at Inquivesta!",
  "🌡️ Absolute zero: The temperature at which all motion stops. Inquivesta temperature: Where all excitement starts!",
  "💫 Newton's First Law: Objects in motion stay in motion. Our festival in motion stays in awesome!",
  "🌠 What did the photon say when it arrived at Inquivesta? 'I traveled at light speed to get here!'",
  "⚖️ Archimedes said 'Give me a lever and I'll move the world.' Give us science and we'll move your mind!",
  "🎢 Potential energy at the top of a roller coaster converts to kinetic energy. Our potential converts to pure fun!",
  "🔊 Sound travels at 343 m/s. News about Inquivesta travels at the speed of excitement!",

  // Time & Anticipation
  "⏰ Time is relative. But our launch date is absolutely approaching!",
  "🕐 They say good things come to those who wait. Great things come to those who attend Inquivesta!",
  "⏳ Patience is a virtue. Excitement for science is a necessity!",
  "🔮 Predicting the future is hard. Predicting you'll love Inquivesta is elementary!"
];

const floatingIcons = [
  { icon: Atom, delay: 0, duration: 20 },
  { icon: Rocket, delay: 2, duration: 25 },
  { icon: Dna, delay: 4, duration: 18 },
  { icon: Telescope, delay: 6, duration: 22 },
  { icon: Beaker, delay: 8, duration: 19 },
  { icon: Brain, delay: 10, duration: 24 },
  { icon: Zap, delay: 12, duration: 21 },
  { icon: Calculator, delay: 14, duration: 23 },
]

export default function ComingSoonPage() {
  const [currentMessage, setCurrentMessage] = useState(0)

  useEffect(() => {
    // Rotate funny messages every 4 seconds
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % funnyMessages.length)
    }, 4000)

    return () => {
      clearInterval(messageInterval)
    }
  }, [])

  const handleLuckyClick = () => {
    const randomLink = luckyLinks[Math.floor(Math.random() * luckyLinks.length)]
    window.open(randomLink, "_blank")
  }

  const FloatingIcon = ({ icon: Icon, delay, duration }: { icon: any; delay: number; duration: number }) => (
    <div
      className={cn("absolute opacity-20 text-[#D2B997] animate-bounce", "hidden md:block")}
      style={{
        left: `${Math.random() * 80 + 10}%`,
        top: `${Math.random() * 60 + 20}%`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      <Icon className="w-8 h-8" />
    </div>
  )

  return (
    <div className="h-screen bg-[#1A1A1A] text-white border-8 border-[#D2B997] relative overflow-hidden flex items-center justify-center">
      {/* Floating Background Icons */}
      {floatingIcons.map((item, index) => (
        <FloatingIcon key={index} icon={item.icon} delay={item.delay} duration={item.duration} />
      ))}

      {/* Main Content - Centered and Full Screen */}
      <main className="relative z-10 flex flex-col items-center justify-center h-full px-4">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          {/* Main Title */}
          <FadeIn>
            <div className="space-y-8">
              <HyperText
                className="text-6xl md:text-8xl lg:text-9xl font-bold bg-gradient-to-r from-[#A8D8EA] via-[#F8BBD9] to-[#F8C471] bg-clip-text text-transparent font-futura"
                text="COMING SOON"
              />
              <div className="text-2xl md:text-3xl lg:text-4xl text-[#D2B997] font-depixel-body">
                <span className="mx-4">Something is <span className="font-bold">Cooking</span></span>
                <span className="inline-block animate-pulse">🚀</span>
              </div>
            </div>
          </FadeIn>

          {/* Funny Rotating Message */}
          <FadeIn delay={0.2}>
            <Card className="bg-gradient-to-br from-[#2A2A2A]/50 to-[#1A1A1A]/50 border-[#D2B997]/30 p-4">
              <CardContent className="p-0">
                <p className="text-lg md:text-xl text-[#F8BBD9] font-depixel-small leading-relaxed">
                  {funnyMessages[currentMessage]}
                </p>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Call to Action */}
          <FadeIn delay={0.4}>
            <div className="space-y-8">
              <p className="text-xl md:text-2xl text-gray-300 font-depixel-small leading-relaxed">
                While we're busy creating the most epic science festival in India,
                <br />
                why don't you explore some more!?
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link href="/">
                  <Button className="bg-gradient-to-r from-[#A8D8EA] to-[#85C1E9] hover:from-[#7FB3D3] hover:to-[#6BB6FF] text-[#1A1A1A] font-depixel-body px-10 py-4 text-xl">
                    <Home className="w-6 h-6 mr-3" />
                    Take Me Home
                  </Button>
                </Link>

                <Button
                  onClick={handleLuckyClick}
                  className="bg-gradient-to-r from-[#F8BBD9] to-[#F8C471] hover:from-[#F5A3C7] hover:to-[#F7DC6F] text-[#1A1A1A] font-depixel-body px-10 py-4 text-xl"
                >
                  <Sparkles className="w-6 h-6 mr-3" />
                  I'm Feeling Lucky
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </main>
    </div>
  )
}
