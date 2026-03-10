"use client";

import { useEffect, useState, useRef } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import Floating, { FloatingElement } from "@/components/parallax-floating";
import { InteractiveHoverButton } from "@/components/interactive-hover-button";
import { Starfield } from "@/components/starfield";
import { WordPullUp } from "@/components/word-pull-up";
import { CardStack, CardStackItem } from "@/components/ui/card-stack";
import { FilesystemItem, type Node } from "@/components/ui/filesystem-item";
import { FaqAccordion } from "@/components/ui/faq-chat-accordion";
import { VideoCompare } from "@/components/ui/video-compare";

const faqData = [
  {
    id: 1,
    question: "What DAWs do the presets work with?",
    answer: "Our presets work with FL Studio, Logic Pro, Ableton, and Pro Tools. Each preset comes in both stock plugin and Waves plugin versions so you can use whichever you prefer.",
    icon: "🎤",
    iconPosition: "right" as const,
  },
  {
    id: 2,
    question: "How do I download my presets?",
    answer: "All presets are instant digital downloads. After purchase, you'll receive a download link immediately via email. No waiting — start mixing right away.",
  },
  {
    id: 3,
    question: "Do you offer refunds?",
    answer: "Due to the nature of digital products, we do not offer returns. If you're having an issue, contact us at support@thevoxbox.shop and we'll help you out.",
  },
  {
    id: 4,
    question: "How does Buy 2 Get 1 Free work?",
    answer: "Simply add 3 presets to your cart and the least expensive one is automatically free. No code needed!",
    icon: "⭐",
    iconPosition: "left" as const,
  },
  {
    id: 5,
    question: "I need help setting up my preset — what do I do?",
    answer: "Check out our YouTube channel for step-by-step tutorials. If you still need help, email us at support@thevoxbox.shop and we'll walk you through it.",
  },
  {
    id: 6,
    question: "What's included in The VoxBox Complete Collection?",
    answer: "Every single preset on the site in one bundle — over 80 presets, templates, and sound kits at a massive 75% discount. It's the best deal we offer.",
    icon: "🔥",
    iconPosition: "right" as const,
  },
];

const S = "https://thevoxbox.shop/products";

const presetNodes: Node[] = [
  {
    name: "View All Presets",
    nodes: [
      {
        name: "Bundles & Collections",
        nodes: [
          { name: "The VoxBox Complete Collection", href: `${S}/the-voxbox-complete-collection` },
          { name: "THE ULTIMATE YEAT PRESET + FULL COURSE", href: `${S}/the-ultimate-yeat-preset-full-course` },
          { name: "CYBËR V2 - Sound Kit [BUNDLE]", href: `${S}/cyber-v2-sound-kit-bundle` },
          { name: "CYBËR - Sound Kit [BUNDLE]", href: `${S}/cyber-sound-kit-bundle` },
          { name: "The YEAT Bundle", href: `${S}/the-yeat-bundle` },
          { name: "The YEAT PACK (Waves)", href: `${S}/the-yeat-pack-waves` },
          { name: "IAN - Pack It Up", href: `${S}/ian-pack-it-up` },
        ],
      },
      {
        name: "Yeat",
        nodes: [
          { name: "THE YEAT PRESET", href: `${S}/the-yeat-preset` },
          { name: "THE 2093 PRESET (YEAT)", href: `${S}/the-2093-preset-yeat` },
          { name: "THE YEAT PLUGIN", href: `${S}/the-yeat-plugin` },
          { name: "THE YEAT TEMPLATE", href: `${S}/the-yeat-template` },
          { name: "YEAT - ON THA LINE", href: `${S}/yeat-on-tha-line-vocal-preset-fl-stock-waves` },
          { name: "YEAT - Up 2 Më", href: `${S}/yeat-up-2-me-vocal-preset-stock-waves` },
          { name: "YEAT - POPPIN", href: `${S}/yeat-poppin-vocal-preset` },
          { name: "YEAT - DOUBLE", href: `${S}/yeat-double-vocal-preset-fl-stock-waves` },
          { name: "YEAT - DUB", href: `${S}/yeat-dub-vocal-preset-fl-stock-waves` },
          { name: "YEAT - Get Busy Template", href: `${S}/yeat-get-busy-template-fl-studio-100-stock` },
          { name: "YEAT - Kant changë Template", href: `${S}/yeat-kant-change-template-fl-studio-100-stock` },
          { name: "YEAT - 2 Alivë", href: `${S}/yeat-2-alive-vocal-preset-fl-stock` },
        ],
      },
      {
        name: "Juice WRLD",
        nodes: [
          { name: "THE JUICE WRLD PRESET", href: `${S}/the-juice-wrld-preset` },
          { name: "JUICE WRLD - KNIGHT CRAWLER", href: `${S}/juice-wrld-knight-crawler-preset` },
        ],
      },
      {
        name: "Travis Scott",
        nodes: [
          { name: "The Travis Scott Preset", href: `${S}/the-travis-scott-preset` },
          { name: "TRAVIS SCOTT - ESCAPE PLAN", href: `${S}/travis-scott-escape-plan-vocal-preset-stock-waves` },
        ],
      },
      {
        name: "Drake",
        nodes: [{ name: "The Drake Preset", href: `${S}/the-drake-preset` }],
      },
      {
        name: "Future",
        nodes: [{ name: "The Future Preset", href: `${S}/the-future-preset` }],
      },
      {
        name: "Playboi Carti",
        nodes: [{ name: "THE PLAYBOI CARTI PRESET", href: `${S}/the-playboi-carti-preset` }],
      },
      {
        name: "Ken Carson",
        nodes: [
          { name: "THE KEN CARSON PRESET", href: `${S}/the-ken-carson-preset` },
          { name: "THE KEN CARSON PRESET v2 (Waves)", href: `${S}/the-ken-carson-preset-v2-waves-only` },
          { name: "KEN CARSON - MORE CHAOS", href: `${S}/ken-carson-more-chaos` },
        ],
      },
      {
        name: "Lil Uzi Vert",
        nodes: [{ name: "THE LIL UZI VERT PRESET", href: `${S}/the-lil-uzi-vert-preset` }],
      },
      {
        name: "SoFaygo",
        nodes: [
          { name: "THE SOFAYGO PRESET", href: `${S}/the-sofaygo-preset` },
          { name: "THE SOFAYGO PRESET v2 (PINK HEARTZ)", href: `${S}/the-sofaygo-preset-v2-pink-heartz` },
          { name: "OFF THE MAP SOFAYGO", href: `${S}/off-the-map-sofaygo-vocal-preset-stock-waves` },
        ],
      },
      {
        name: "Don Toliver",
        nodes: [{ name: "THE DONTOLIVER PRESET", href: `${S}/the-dontoliver-preset` }],
      },
      {
        name: "Trippie Redd",
        nodes: [
          { name: "THE TRIPPIE REDD PRESET", href: `${S}/the-trippie-redd-preset` },
          { name: "Trippie Redd - Supernatural", href: `${S}/trippie-redd-supernatural-vocal-preset-fl-studio-100-stock` },
          { name: "Trippie Redd - Doodle Bob (Waves)", href: `${S}/trippie-redd-doodle-bob-waves-only` },
        ],
      },
      {
        name: "More Artists",
        nodes: [
          { name: "THE IAN PRESET", href: `${S}/the-ian-preset` },
          { name: "THE DESTROY LONELY PRESET", href: `${S}/the-destroy-lonely-preset` },
          { name: "The Weeknd Preset", href: `${S}/the-weeknd-preset` },
          { name: "THE KID LAROI - STAY", href: `${S}/the-kid-laroi-stay-vocal-preset-fl-stock-waves` },
          { name: "THE KID LAROI - BAD NEWS", href: `${S}/the-kid-laroi-bad-news-vocal-preset-lead-adlibs` },
          { name: "LIL TECCA - REPEAT IT", href: `${S}/lil-tecca-repeat-it-vocal-preset-lead-adlibs` },
          { name: "THE SUMMRS PRESET", href: `${S}/the-summrs-preset` },
          { name: "The NETTSPEND Preset", href: `${S}/the-nettspend-preset-stock-waves` },
          { name: "THE JACE! PRESET", href: `${S}/the-jace-preset` },
          { name: "THE DOM CORLEO", href: `${S}/the-dom-corleo` },
          { name: "THE NAV PRESET", href: `${S}/the-nav-preset` },
          { name: "THE BLP KOSHER PRESET", href: `${S}/the-blp-kosher-preset` },
          { name: "THE CASH COBAIN PRESET", href: `${S}/the-cash-cobain-preset` },
          { name: "THE JON BELLION PRESET", href: `${S}/the-jon-bellion-preset` },
          { name: "The SOSOCAMO Preset", href: `${S}/the-sosocamo-preset-fl-studio-waves-only` },
          { name: "The 2HOLLIS Preset", href: `${S}/the-2hollis-preset` },
          { name: "The LYFESTYLE Preset", href: `${S}/the-lyfestyle-preset` },
          { name: "The esdeekid preset", href: `${S}/the-esdeekid-preset-waves-only` },
          { name: "KANKAN - Wokeup", href: `${S}/kankan-wokeup-vocal-preset-fl-studio-stock` },
          { name: "KANKAN - Kickback", href: `${S}/kankan-kickback-vocal-template-fl-studio-100-stock` },
          { name: "BABYSANTANA - Antisocial", href: `${S}/babysantana-antisocial-vocal-preset-stock-waves` },
          { name: "SSG Kobe - thrax", href: `${S}/ssg-kobe-thrax-vocal-preset-fl-studio-100-stock` },
          { name: "SSG KOBE - MIA", href: `${S}/ssg-kobe-mia-vocal-preset-lead-adlibs` },
          { name: "MIDWXST - LA", href: `${S}/midwxst-la-vocal-preset-fl-studio-100-stock` },
          { name: "AUTUMN! - Template", href: `${S}/autumn-vocal-template-fl-studio-100-stock` },
          { name: "AUTUMN - NOT 3 NOT 2!", href: `${S}/autumn-not-3-not-2-vocal-preset-fl-stock` },
          { name: "Dro Kenji - SUPERSTAR", href: `${S}/dro-kenji-superstar-vocal-preset-stock-waves` },
          { name: "HYPERPOP - VOCAL PRESET", href: `${S}/hyperpop-vocal-preset-stock-waves` },
        ],
      },
      {
        name: "Templates",
        nodes: [
          { name: "DEFAULT MIXING TEMPLATE (VERSION #2)", href: `${S}/default-mixing-template-version-2` },
          { name: "THE RECORDING TEMPLATE", href: `${S}/the-recording-template` },
          { name: "DEFAULT VOCAL MIXING TEMPLATE", href: `${S}/default-vocal-mixing-template-fl-studio-stock` },
          { name: "Vocal Mixing Template vol. 1", href: `${S}/vocal-mixing-template-vol-1` },
          { name: "Vocal Mixing Template vol. 2", href: `${S}/vocal-mixing-template-vol-2` },
        ],
      },
      {
        name: "Mastering",
        nodes: [
          { name: "THE FINAL STEP (Master Plugin)", href: `${S}/the-final-step-master-plugin` },
          { name: "RAGE (Master Preset)", href: `${S}/rage-master-preset` },
        ],
      },
      {
        name: "Sound Kits",
        nodes: [
          { name: "CYBËR - Serum Bank", href: `${S}/cyber-sound-kit-serum-bank` },
          { name: "CYBËR - Drum Kit", href: `${S}/cyber-sound-kit-drum-kit` },
          { name: "CYBËR - One Shot Kit", href: `${S}/cyber-sound-kit-one-shot-kit` },
          { name: "Essentials vol.1 (Drum Kit)", href: `${S}/essentials-vol-1-drum-kit` },
          { name: "Euphoria (Drum Kit)", href: `${S}/euphoria-drum-kit` },
          { name: "FULL CIRCLE (Multi Kit)", href: `${S}/full-circle-multi-kit` },
          { name: "Deserted (One Shot Kit)", href: `${S}/deserted-one-shot-kit` },
          { name: "Time Warp (Loop Kit)", href: `${S}/time-warp-loop-kit` },
          { name: "Arcane (Loop Kit)", href: `${S}/arcane-loop-kit` },
        ],
      },
    ],
  },
];

const videoCards: CardStackItem[] = [
  {
    id: 1,
    title: "Esdeekid - We Made It",
    description: "Mixed with our vocal presets",
    videoSrc: "/videos/esdee.mp4",
  },
  {
    id: 2,
    title: "Yeat - We Made It",
    description: "Processed through our chain",
    videoSrc: "/videos/yeat.mp4",
  },
  {
    id: 3,
    title: "Out Da Way",
    description: "Produced with our preset pack",
    videoSrc: "/videos/out-da-way.mp4",
  },
  {
    id: 4,
    title: "Kanye - Heartless",
    description: "Mixed with our vocal presets",
    videoSrc: "/videos/heartless.mp4",
  },
  {
    id: 5,
    title: "Esdeekid - Panic",
    description: "Processed through our chain",
    videoSrc: "/videos/panic.mp4",
  },
  {
    id: 6,
    title: "Yeat - Dog House",
    description: "Mixed with our vocal presets",
    videoSrc: "/videos/dog-house.mp4",
  },
  {
    id: 7,
    title: "Keep Steady",
    description: "Produced with our preset pack",
    videoSrc: "/videos/keep-steady.mp4",
  },
];

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

function TreeContainer({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [paddingLeft, setPaddingLeft] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setPaddingLeft(0);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;
    const parentWidth = parent.offsetWidth;
    const contentWidth = el.scrollWidth;
    setPaddingLeft(Math.max(0, (parentWidth - contentWidth) / 2));
  }, [isMobile]);

  return (
    <div className="w-full">
      <div
        ref={ref}
        className={`text-left ${isMobile ? "px-4" : "w-max"}`}
        style={!isMobile ? { paddingLeft } : undefined}
      >
        {children}
      </div>
    </div>
  );
}

export default function Home() {
  const [scope, animate] = useAnimate();
  const isMobile = useIsMobile();

  useEffect(() => {
    animate(
      ".float-img",
      { opacity: [0, 1] },
      { duration: 0.5, delay: stagger(0.12) }
    );
  }, [animate]);

  return (
    <main className="min-h-screen bg-[#050505] overflow-hidden" ref={scope}>
      <Starfield starCount={150} className="z-0" />
      <div className="relative h-[90vh] md:h-[115vh] overflow-hidden">
      <Floating className="w-full h-full" sensitivity={1} easingFactor={0.04}>
        {/* Center title text */}
        <FloatingElement depth={0.5} className="top-[50%] md:top-[43%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="flex flex-col items-center whitespace-nowrap">
            <div className="relative">
              <WordPullUp
                as="h1"
                delay={0.6}
                startOnView={false}
                className="text-[11vw] md:text-[8vw] font-bold tracking-tighter leading-none text-white flex-nowrap"
                wordClassName="bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent"
              >
                Vocal Presets
              </WordPullUp>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]/70" />
            </div>
            <WordPullUp
              as="p"
              delay={1.0}
              startOnView={false}
              className="text-[4.5vw] md:text-[2.2vw] text-white/60 mt-3 md:mt-5 font-medium tracking-wide"
              wordClassName="[&:nth-child(3)]:text-white [&:nth-child(3)]:uppercase [&:nth-child(3)]:font-black"
            >
              That ACTUALLY work
            </WordPullUp>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="mt-8"
            >
              <a href="https://thevoxbox.shop/collections/all" target="_blank" rel="noopener noreferrer">
                <InteractiveHoverButton className="px-10 py-4 text-lg">
                  Download Now
                </InteractiveHoverButton>
              </a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 2.0 }}
              className="mt-10"
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center gap-0.5"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white/40">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white/25 -mt-1.5">
                  <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </FloatingElement>

        {/* Future - top left */}
        <FloatingElement depth={1} className="top-[6%] left-[3%] z-10">
          <motion.img
            src="/images/future.png"
            alt="The Future Preset"
            className="float-img w-32 md:w-48 lg:w-56 rounded-xl object-cover shadow-2xl"
            style={{ opacity: 0 }}
          />
        </FloatingElement>

        {/* Ian - top right */}
        <FloatingElement depth={2} className="top-[4%] right-[8%] z-20">
          <motion.img
            src="/images/ian.png"
            alt="Ian - No Way"
            className="float-img w-28 md:w-40 lg:w-48 rounded-xl object-cover shadow-2xl"
            style={{ opacity: 0 }}
          />
        </FloatingElement>

        {/* Juice WRLD - left center */}
        <FloatingElement depth={3} className="top-[35%] -left-[8%] md:left-[1%] z-30">
          <motion.img
            src="/images/juicewrld.png"
            alt="Juice WRLD"
            className="float-img w-24 md:w-36 lg:w-40 rounded-xl object-cover shadow-2xl"
            style={{ opacity: 0 }}
          />
        </FloatingElement>

        {/* Travis Scott - right center */}
        <FloatingElement depth={1.5} className="top-[28%] -right-[6%] md:right-[2%] z-20">
          <motion.img
            src="/images/travis.png"
            alt="Travis Scott"
            className="float-img w-28 md:w-44 lg:w-52 rounded-xl object-cover shadow-2xl"
            style={{ opacity: 0 }}
          />
        </FloatingElement>

        {/* Lyfestyle - bottom left */}
        <FloatingElement depth={2.5} className="bottom-[8%] left-[5%] z-20">
          <motion.img
            src="/images/lyfestyle.png"
            alt="Lyfestlye!"
            className="float-img w-32 md:w-48 lg:w-56 rounded-xl object-cover shadow-2xl"
            style={{ opacity: 0 }}
          />
        </FloatingElement>

        {/* 2Hollis - bottom center left */}
        <FloatingElement depth={4} className="bottom-[3%] left-[5%] md:left-[33%] z-10">
          <motion.img
            src="/images/2hollis.png"
            alt="2Hollis"
            className="float-img w-20 md:w-32 lg:w-36 rounded-xl object-cover shadow-2xl"
            style={{ opacity: 0 }}
          />
        </FloatingElement>

        {/* Esdeekid - bottom right */}
        <FloatingElement depth={1.8} className="bottom-[6%] right-[4%] z-30">
          <motion.img
            src="/images/esdeekid.png"
            alt="Esdeekid"
            className="float-img w-28 md:w-44 lg:w-52 rounded-xl object-cover shadow-2xl"
            style={{ opacity: 0 }}
          />
        </FloatingElement>

        {/* Drake - top center left */}
        <FloatingElement depth={3.5} className="top-[10%] left-[8%] md:left-[28%] z-10">
          <motion.img
            src="/images/drake.png"
            alt="The Drake Preset"
            className="float-img w-16 md:w-28 lg:w-32 rounded-xl object-cover shadow-2xl"
            style={{ opacity: 0 }}
          />
        </FloatingElement>

        {/* 2093 - top center right */}
        <FloatingElement depth={2.2} className="top-[8%] right-[8%] md:right-[28%] z-10">
          <motion.img
            src="/images/2093.png"
            alt="2093"
            className="float-img w-20 md:w-32 lg:w-36 rounded-xl object-cover shadow-2xl"
            style={{ opacity: 0 }}
          />
        </FloatingElement>

        {/* Yeat - bottom center right */}
        <FloatingElement depth={3} className="bottom-[12%] right-[5%] md:right-[26%] z-10">
          <motion.img
            src="/images/yeat.png"
            alt="Yeats Real Preset"
            className="float-img w-20 md:w-32 lg:w-40 rounded-xl object-cover shadow-2xl"
            style={{ opacity: 0 }}
          />
        </FloatingElement>

      </Floating>
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[25vh] z-40 bg-gradient-to-b from-transparent to-[#050505]" />
      </div>

      {/* Before / After section */}
      <section className="relative pt-4 md:pt-2 pb-10 md:pb-24 px-4">
        <div className="mx-auto max-w-2xl text-center mb-4 md:mb-12">
          <WordPullUp
            as="h2"
            delay={0.1}
            className="text-[7vw] md:text-[4vw] font-bold tracking-tighter leading-none text-white flex-nowrap"
            wordClassName="bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent"
          >
            Hear the Difference
          </WordPullUp>
          <p className="text-[3.5vw] md:text-[1.2vw] text-white/40 mt-2 md:mt-4 font-medium tracking-wide">
            Drag the slider to compare
          </p>
        </div>
        <VideoCompare
          beforeSrc="/videos/preset-off.mp4"
          afterSrc="/videos/preset-on.mp4"
          beforeLabel="Preset Off"
          afterLabel="Preset On"
        />
        <div className="flex justify-center mt-6 md:mt-10">
          <a href="https://thevoxbox.shop/collections/all" target="_blank" rel="noopener noreferrer">
            <InteractiveHoverButton className="px-10 py-4 text-lg">
              Download Now
            </InteractiveHoverButton>
          </a>
        </div>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-0.5 mt-4 md:mt-6"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white/30">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white/20 -mt-1.5">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </section>

      {/* Video showcase section */}
      <section className="relative pt-4 md:pt-16 pb-10 md:pb-24 px-4">
        <div className="mx-auto max-w-5xl text-center -mb-4 md:-mb-6">
          <div className="relative inline-block">
            <WordPullUp
              as="h2"
              delay={0.1}
              className="text-[7vw] md:text-[4vw] font-bold tracking-tighter leading-none text-white flex-nowrap"
              wordClassName="bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent"
            >
              Hear more Presets
            </WordPullUp>
            <div className="pointer-events-none absolute inset-0 hidden md:block bg-gradient-to-b from-transparent via-transparent to-[#050505]/70" />
          </div>
          <WordPullUp
            as="p"
            delay={0.4}
            className="text-[3.5vw] md:text-[1.2vw] text-white/40 mt-1 md:mt-2 font-medium tracking-wide"
          >
            Click to hear below
          </WordPullUp>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-0.5 mt-1"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white/40">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white/25 -mt-1.5">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
        </div>
        <div className="mx-auto w-full max-w-5xl">
          <CardStack
            items={videoCards}
            initialIndex={0}
            showDots
            cardWidth={isMobile ? 180 : 300}
            cardHeight={isMobile ? 320 : 534}
            overlap={isMobile ? 0.3 : 0.35}
            spreadDeg={isMobile ? 24 : 32}
            depthPx={isMobile ? 60 : 100}
            tiltXDeg={isMobile ? 6 : 8}
          />
        </div>
        <div className="flex justify-center mt-5 md:mt-8">
          <a href="https://thevoxbox.shop/collections/all" target="_blank" rel="noopener noreferrer">
            <InteractiveHoverButton className="px-10 py-4 text-lg">
              Download Now
            </InteractiveHoverButton>
          </a>
        </div>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-0.5 mt-4 md:mt-6"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white/30">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white/20 -mt-1.5">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </section>

      {/* Preset library section */}
      <section className="relative pt-4 md:pt-16 pb-10 md:pb-24 px-4">
        <div className="mx-auto max-w-2xl text-center mb-4 md:mb-12">
          <WordPullUp
            as="h2"
            delay={0.1}
            className="text-[7vw] md:text-[4vw] font-bold tracking-tighter leading-none text-white flex-nowrap"
            wordClassName="bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent"
          >
            Browse the Library
          </WordPullUp>
          <p className="text-[3.5vw] md:text-[1.2vw] text-white/40 mt-2 md:mt-4 font-medium tracking-wide">
            80+ presets and counting
          </p>
        </div>
        <TreeContainer>
          <ul>
            {presetNodes.map((node) => (
              <FilesystemItem
                node={node}
                key={node.name}
                animated
                openOnScroll
              />
            ))}
          </ul>
        </TreeContainer>
        <div className="flex justify-center mt-6 md:mt-10">
          <a href="https://thevoxbox.shop/collections/all" target="_blank" rel="noopener noreferrer">
            <InteractiveHoverButton className="px-10 py-4 text-lg">
              Download Now
            </InteractiveHoverButton>
          </a>
        </div>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-0.5 mt-4 md:mt-6"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white/30">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-white/20 -mt-1.5">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </section>

      {/* FAQ section */}
      <section className="relative pt-4 md:pt-16 pb-10 md:pb-24 px-4">
        <div className="mx-auto max-w-2xl text-center mb-4 md:mb-12">
          <WordPullUp
            as="h2"
            delay={0.1}
            className="text-[7vw] md:text-[4vw] font-bold tracking-tighter leading-none text-white flex-nowrap"
            wordClassName="bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent"
          >
            Frequently Asked Questions
          </WordPullUp>
          <p className="text-[3.5vw] md:text-[1.2vw] text-white/40 mt-2 md:mt-4 font-medium tracking-wide">
            Everything you need to know
          </p>
        </div>
        <FaqAccordion
          data={faqData}
          className="mx-auto max-w-xl"
        />
        <div className="flex justify-center mt-6 md:mt-10">
          <a href="https://thevoxbox.shop/collections/all" target="_blank" rel="noopener noreferrer">
            <InteractiveHoverButton className="px-10 py-4 text-lg">
              Download Now
            </InteractiveHoverButton>
          </a>
        </div>
      </section>
    </main>
  );
}
