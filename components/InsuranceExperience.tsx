"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  CircleEllipsis,
  Clock3,
  Coins,
  Compass,
  GraduationCap,
  Heart,
  HeartHandshake,
  HeartPulse,
  House,
  Leaf,
  LockKeyhole,
  Mail,
  Menu,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Trees,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from "react";

type NavigatorKey = "vorsorge" | "familie" | "gesundheit" | "vermoegen";
type RoleKey = "angestellt" | "selbststaendig" | "arbeitgeber" | "familie" | "berufseinsteiger" | "sonstiges";

type Product = {
  key: NavigatorKey;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  icon: ReactNode;
};

const products: Product[] = [
  {
    key: "gesundheit",
    eyebrow: "Gesundheit",
    title: "Krankenversicherung",
    description: "Gesundheit verständlich einordnen – passend zu deinem Leben und deinen Prioritäten.",
    image: "/assets/health.svg",
    icon: <HeartPulse size={22} strokeWidth={1.7} />,
  },
  {
    key: "vorsorge",
    eyebrow: "Vorsorge",
    title: "bAV & Zukunft",
    description: "Heute Struktur schaffen, damit Vorsorge morgen nicht kompliziert werden muss.",
    image: "/assets/bav.svg",
    icon: <BarChart3 size={22} strokeWidth={1.7} />,
  },
  {
    key: "familie",
    eyebrow: "Absicherung",
    title: "Versicherungen",
    description: "Schützen, was wirklich wichtig ist – ohne Produktdschungel und ohne unnötige Komplexität.",
    image: "/assets/family.svg",
    icon: <ShieldCheck size={22} strokeWidth={1.7} />,
  },
  {
    key: "vermoegen",
    eyebrow: "Nachlass",
    title: "Erbschaft",
    description: "Werte bewahren, Übergänge frühzeitig sortieren und die nächsten Schritte sichtbar machen.",
    image: "/assets/inheritance.svg",
    icon: <Trees size={22} strokeWidth={1.7} />,
  },
];

const navigator = [
  {
    key: "vorsorge" as NavigatorKey,
    title: "Ich möchte vorsorgen",
    small: "Heute strukturieren. Morgen freier entscheiden.",
    icon: <BarChart3 size={27} strokeWidth={1.55} />,
    resultTitle: "Deine persönliche Vorsorge-Route",
    resultText: "Wir sortieren Ausgangslage, Ziele und bestehende Lösungen – danach siehst du klar, welche Fragen wirklich relevant sind.",
  },
  {
    key: "familie" as NavigatorKey,
    title: "Ich möchte meine Familie schützen",
    small: "Für die Menschen, die dir wichtig sind.",
    icon: <Users size={27} strokeWidth={1.55} />,
    resultTitle: "Deine Schutz-Route für die Familie",
    resultText: "Wir bringen Risiken, Prioritäten und vorhandene Absicherung in eine verständliche Reihenfolge.",
  },
  {
    key: "gesundheit" as NavigatorKey,
    title: "Ich möchte meine Gesundheit absichern",
    small: "Klarheit statt Tarifdschungel.",
    icon: <Heart size={27} strokeWidth={1.55} />,
    resultTitle: "Deine Gesundheits-Orientierung",
    resultText: "Wir strukturieren Bedürfnisse und Fragen, bevor konkrete Lösungen überhaupt verglichen werden.",
  },
  {
    key: "vermoegen" as NavigatorKey,
    title: "Ich möchte Vermögen weitergeben",
    small: "Werte bewahren. Übergänge planen.",
    icon: <Leaf size={27} strokeWidth={1.55} />,
    resultTitle: "Deine Nachlass-Orientierung",
    resultText: "Wir schaffen eine klare Übersicht über Themen, Beteiligte und die nächsten sinnvollen Gespräche.",
  },
];

const roleOptions: Array<{ key: RoleKey; title: string; text: string; image?: string; icon: ReactNode }> = [
  { key: "angestellt", title: "Angestellt", text: "Ich möchte mich und meine Familie gut aufstellen.", image: "/assets/employed.svg", icon: <UserRound /> },
  { key: "selbststaendig", title: "Selbstständig", text: "Ich möchte Business und Privatleben strukturiert absichern.", image: "/assets/self-employed.svg", icon: <BriefcaseBusiness /> },
  { key: "arbeitgeber", title: "Arbeitgeber", text: "Ich möchte Mitarbeitende und Benefits mitdenken.", image: "/assets/employer.svg", icon: <Building2 /> },
  { key: "familie", title: "Familie", text: "Ich möchte unsere gemeinsame Zukunft sortieren.", image: "/assets/family-funnel.svg", icon: <House /> },
  { key: "berufseinsteiger", title: "Berufseinsteiger", text: "Ich möchte von Anfang an sinnvoll vorsorgen.", image: "/assets/career-starter.svg", icon: <GraduationCap /> },
  { key: "sonstiges", title: "Sonstiges", text: "Ich bin noch unsicher und möchte Orientierung.", icon: <CircleEllipsis /> },
];

const scenarios = [
  { number: "01", question: "… dein Einkommen plötzlich wegfällt?", answer: "Welche laufenden Verpflichtungen wären betroffen – und welche Absicherung existiert bereits?", icon: <ShieldCheck /> },
  { number: "02", question: "… sich deine Familie verändert?", answer: "Neue Lebensphasen verändern Prioritäten. Genau dort sollte dein System mitdenken.", icon: <HeartHandshake /> },
  { number: "03", question: "… du morgen mehr Freiheit willst?", answer: "Vorsorge wird greifbar, wenn Ziele, Zeit und bestehende Bausteine gemeinsam betrachtet werden.", icon: <Compass /> },
  { number: "04", question: "… Vermögen ungeplant weitergegeben wird?", answer: "Transparenz über Beteiligte und offene Fragen ist der erste Schritt zu einem guten Übergang.", icon: <Coins /> },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function LifeMap() {
  const nodes = [
    { className: "life-node life-node-health", title: "Gesundheit", text: "Heute gesund. Morgen stark.", icon: <Heart size={19} /> },
    { className: "life-node life-node-future", title: "Vorsorge", text: "Heute planen. Morgen frei.", icon: <BarChart3 size={19} /> },
    { className: "life-node life-node-family", title: "Familie", text: "Für die, die alles bedeuten.", icon: <Users size={19} /> },
    { className: "life-node life-node-wealth", title: "Vermögen", text: "Mehr Klarheit für später.", icon: <Coins size={19} /> },
  ];

  return (
    <div className="life-map" aria-label="Lebensbereiche als vernetztes System">
      <svg className="life-map-lines" viewBox="0 0 600 500" aria-hidden="true">
        <defs>
          <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a9ff72" stopOpacity=".12" />
            <stop offset=".55" stopColor="#a9ff72" stopOpacity=".95" />
            <stop offset="1" stopColor="#dfffc7" stopOpacity=".18" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <motion.path d="M300 250 C215 180 190 145 155 108" fill="none" stroke="url(#lineGlow)" strokeWidth="2" filter="url(#glow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, delay: .4 }} />
        <motion.path d="M300 250 C380 175 400 135 438 106" fill="none" stroke="url(#lineGlow)" strokeWidth="2" filter="url(#glow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, delay: .55 }} />
        <motion.path d="M300 250 C215 325 185 342 155 390" fill="none" stroke="url(#lineGlow)" strokeWidth="2" filter="url(#glow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, delay: .7 }} />
        <motion.path d="M300 250 C390 320 408 348 448 391" fill="none" stroke="url(#lineGlow)" strokeWidth="2" filter="url(#glow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, delay: .85 }} />
      </svg>
      <motion.div className="life-core" initial={{ opacity: 0, scale: .78 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .9, ease: [0.22, 1, 0.36, 1] }}>
        <span className="life-core-logo"><Leaf size={22} /></span>
        <strong>Deine<br />Life Map</strong>
        <small>Alles hängt zusammen.</small>
      </motion.div>
      {nodes.map((node, index) => (
        <motion.div
          key={node.title}
          className={node.className}
          initial={{ opacity: 0, scale: .8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: .65, delay: .7 + index * .13, ease: [0.22, 1, 0.36, 1] }}
        >
          <span>{node.icon}</span>
          <strong>{node.title}</strong>
          <small>{node.text}</small>
        </motion.div>
      ))}
      <div className="life-orbit orbit-one" />
      <div className="life-orbit orbit-two" />
      <span className="life-particle particle-a" />
      <span className="life-particle particle-b" />
      <span className="life-particle particle-c" />
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <motion.article className="product-card" whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 260, damping: 22 }}>
      <div className="product-image">
        <Image src={product.image} alt="" fill sizes="(max-width: 760px) 90vw, 25vw" unoptimized />
        <div className="product-image-overlay" />
      </div>
      <div className="product-card-head">
        <span className="product-icon">{product.icon}</span>
        <span className="product-arrow"><ArrowRight size={17} /></span>
      </div>
      <div className="product-card-copy">
        <small>{product.eyebrow}</small>
        <h3>{product.title}</h3>
        <p>{product.description}</p>
      </div>
    </motion.article>
  );
}

function ScrollStory({ onOpen }: { onOpen: (key: NavigatorKey) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: .4 });
  const x = useTransform(smooth, [0, 1], ["0%", "-73.5%"]);

  const worlds = [
    { ...products[1], big: "Vorsorge muss sich nicht wie Verzicht anfühlen.", note: "bAV & Zukunft" },
    { ...products[0], big: "Gesundheit ist individuell. Orientierung auch.", note: "Gesundheit" },
    { ...products[2], big: "Schütze nicht alles. Schütze das Richtige.", note: "Absicherung" },
    { ...products[3], big: "Was du aufgebaut hast, verdient einen guten Übergang.", note: "Nachlass" },
  ];

  return (
    <section ref={ref} className="story-shell" id="welten">
      <div className="story-sticky">
        <div className="story-topline">
          <span>Vier Lebensbereiche. Ein System.</span>
          <span className="story-progress"><motion.i style={{ scaleX: smooth }} /></span>
        </div>
        <motion.div className="story-track" style={{ x }}>
          {worlds.map((world, index) => (
            <article className="story-panel" key={world.key}>
              <div className="story-photo">
                <Image src={world.image} alt="" fill sizes="80vw" unoptimized />
                <div className="story-photo-wash" />
              </div>
              <div className="story-copy">
                <span className="story-index">0{index + 1}</span>
                <span className="story-note">{world.note}</span>
                <h2>{world.big}</h2>
                <p>{world.description}</p>
                <button className="link-button" onClick={() => onOpen(world.key)}>Meine Situation prüfen <ArrowRight size={17} /></button>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FunnelOverlay({ open, initialTopic, onClose }: { open: boolean; initialTopic: NavigatorKey; onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<RoleKey | null>(null);
  const [goals, setGoals] = useState<string[]>([]);
  const [priority, setPriority] = useState<string | null>(null);
  const [existing, setExisting] = useState<string | null>(null);
  const [result, setResult] = useState(false);
  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [booking, setBooking] = useState<string | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setRole(null);
    setGoals([initialTopic]);
    setPriority(null);
    setExisting(null);
    setResult(false);
    setBooking(null);
  }, [open, initialTopic]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  const topicLabel = navigator.find((item) => item.key === initialTopic)?.title.replace("Ich möchte ", "") ?? "Orientierung";
  const stepTitles = ["Anlass", "Lebenssituation", "Priorität", "Bestehende Lösung", "Kontakt"];
  const canContinue = [Boolean(role), goals.length > 0, Boolean(priority), Boolean(existing), Boolean(contact.name && contact.email)][step];

  const toggleGoal = (value: string) => setGoals((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  const next = () => step < 4 && canContinue && setStep((value) => value + 1);
  const back = () => step > 0 && setStep((value) => value - 1);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (canContinue) setResult(true);
  };

  const renderStep = () => {
    if (step === 0) {
      return (
        <div className="role-grid">
          {roleOptions.map((item) => (
            <button key={item.key} className={cx("role-card", role === item.key && "selected")} onClick={() => setRole(item.key)}>
              {item.image && <span className="role-image"><Image src={item.image} alt="" fill sizes="30vw" unoptimized /></span>}
              <span className="role-body">
                <span className="role-icon">{item.icon}</span>
                <span><strong>{item.title}</strong><small>{item.text}</small></span>
                <i>{role === item.key ? <Check size={16} /> : <ArrowRight size={16} />}</i>
              </span>
            </button>
          ))}
        </div>
      );
    }

    if (step === 1) {
      const options = [
        ["vorsorge", "Vorsorge strukturieren", <BarChart3 key="a" />],
        ["familie", "Familie schützen", <Users key="b" />],
        ["gesundheit", "Gesundheit einordnen", <HeartPulse key="c" />],
        ["vermoegen", "Vermögen & Nachlass sortieren", <Trees key="d" />],
        ["ueberblick", "Erst einmal Überblick bekommen", <Compass key="e" />],
      ] as const;
      return (
        <div className="choice-stack">
          {options.map(([value, label, icon]) => (
            <button key={value} className={cx("choice-row", goals.includes(value) && "selected")} onClick={() => toggleGoal(value)}>
              <span>{icon}</span><strong>{label}</strong><i>{goals.includes(value) ? <Check /> : <ChevronRight />}</i>
            </button>
          ))}
          <p className="step-helper"><Sparkles size={17} /> Mehrfachauswahl möglich – wir sortieren die Themen später gemeinsam.</p>
        </div>
      );
    }

    if (step === 2) {
      const options = ["Maximale Sicherheit", "Einfachheit & Überblick", "Kosten im Blick behalten", "Flexibel bleiben", "Familie entlasten"];
      return (
        <div className="priority-grid">
          {options.map((item, index) => (
            <button key={item} className={cx("priority-card", priority === item && "selected")} onClick={() => setPriority(item)}>
              <span>0{index + 1}</span><strong>{item}</strong><i>{priority === item ? <Check /> : <ArrowRight />}</i>
            </button>
          ))}
        </div>
      );
    }

    if (step === 3) {
      return (
        <div className="existing-grid">
          {["Ja, ich habe bereits Lösungen", "Teilweise – aber ohne echten Überblick", "Nein, ich starte neu", "Weiß ich gerade nicht genau"].map((item) => (
            <button key={item} className={cx("existing-card", existing === item && "selected")} onClick={() => setExisting(item)}>
              <span className="existing-dot" /><strong>{item}</strong>{existing === item && <Check size={18} />}
            </button>
          ))}
          <div className="privacy-note"><LockKeyhole size={20} /><div><strong>Keine Vertragsdaten nötig.</strong><p>Für diese erste Orientierung fragen wir bewusst nur das ab, was für die Struktur wirklich relevant ist.</p></div></div>
        </div>
      );
    }

    return (
      <form id="contact-form" className="contact-form" onSubmit={submit}>
        <label><span>Name</span><div><UserRound size={19} /><input required value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} placeholder="Dein Name" /></div></label>
        <label><span>E-Mail</span><div><Mail size={19} /><input required type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="name@beispiel.de" /></div></label>
        <label><span>Telefon <em>optional</em></span><div><span className="phone-symbol">+</span><input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="49 170 0000000" /></div></label>
        <div className="privacy-note compact"><LockKeyhole size={19} /><div><strong>Deine Daten bleiben bei dir.</strong><p>Konzeptdemo: Es werden keine Daten an einen Server gesendet.</p></div></div>
      </form>
    );
  };

  const resultContent = (
    <div className="result-screen">
      <div className="result-hero">
        <div className="result-hero-copy">
          <span className="eyebrow">Deine Orientierung</span>
          <h2>Deine persönliche Übersicht ist bereit.</h2>
          <p>Wir haben deine Angaben nicht in ein Produkt gepresst, sondern in eine verständliche Reihenfolge gebracht.</p>
          <div className="result-tags">
            <span><Check /> {topicLabel}</span>
            {role && <span><Check /> {roleOptions.find((item) => item.key === role)?.title}</span>}
            {priority && <span><Check /> {priority}</span>}
          </div>
        </div>
        <div className="result-compass">
          <div className="result-ring"><span><Compass /><strong>4</strong><small>Bereiche<br />sortiert</small></span></div>
          <div><strong>Der nächste Schritt ist Klarheit.</strong><p>Konkrete Lösungen gehören erst danach in ein persönliches, dokumentiertes Gespräch.</p></div>
        </div>
      </div>

      <div className="result-grid">
        <article><span><HeartPulse /></span><div><small>Gesundheit</small><strong>{goals.includes("gesundheit") ? "Priorisiert" : "Mitdenken"}</strong><i className={goals.includes("gesundheit") ? "hot" : ""} /></div></article>
        <article><span><BarChart3 /></span><div><small>Vorsorge</small><strong>{goals.includes("vorsorge") ? "Priorisiert" : "Mitdenken"}</strong><i className={goals.includes("vorsorge") ? "hot" : ""} /></div></article>
        <article><span><ShieldCheck /></span><div><small>Absicherung</small><strong>{goals.includes("familie") ? "Priorisiert" : "Mitdenken"}</strong><i className={goals.includes("familie") ? "hot" : ""} /></div></article>
        <article><span><Trees /></span><div><small>Nachlass</small><strong>{goals.includes("vermoegen") ? "Priorisiert" : "Später"}</strong><i className={goals.includes("vermoegen") ? "hot" : ""} /></div></article>
      </div>

      <div className="booking-panel">
        <div className="booking-copy">
          <span className="eyebrow">Persönlich weiterdenken</span>
          <h3>Aus Orientierung wird ein klarer Plan.</h3>
          <p>Wähle einen beispielhaften Termin. In einer echten Umsetzung würde dieser Schritt mit dem Kalender-/CRM-System verbunden.</p>
          <ul><li><BadgeCheck /> Erst verstehen, dann entscheiden</li><li><LockKeyhole /> Keine Produktentscheidung im Funnel</li><li><Clock3 /> Gespräch klar vorbereitet</li></ul>
        </div>
        <div className="calendar-card">
          <div className="calendar-head"><span><CalendarDays /> Termin auswählen</span><small>Demo</small></div>
          <div className="day-row"><button>Mo<small>21.</small></button><button className="active">Di<small>22.</small></button><button>Mi<small>23.</small></button><button>Do<small>24.</small></button></div>
          <div className="time-grid">{["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"].map((time) => <button key={time} className={booking === time ? "active" : ""} onClick={() => setBooking(time)}>{time}</button>)}</div>
          <button className="primary wide" disabled={!booking}>{booking ? `Terminwunsch ${booking} Uhr vormerken` : "Zeit auswählen"}<ArrowRight size={18} /></button>
          {booking && <motion.p className="booking-confirm" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><Check size={16} /> Demo-Termin ausgewählt – keine echte Buchung.</motion.p>}
        </div>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="funnel-overlay" role="dialog" aria-modal="true" aria-label="Persönliche Orientierung" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="funnel-shell" initial={reduce ? false : { y: 35, scale: .985 }} animate={{ y: 0, scale: 1 }} exit={reduce ? undefined : { y: 25, scale: .985 }} transition={{ duration: .45, ease: [0.22, 1, 0.36, 1] }}>
            <header className="funnel-header">
              <a className="brand compact-brand" href="#" onClick={(e) => e.preventDefault()} aria-label="Versicherungsplattform Startseite"><span className="brand-mark"><i /><i /></span><span><strong>Versicherungsplattform</strong><small>Heute sicher. Morgen größer.</small></span></a>
              {!result && <div className="funnel-progress-desktop">{stepTitles.map((title, index) => <div className={cx(index <= step && "active")} key={title}><span>{index + 1}</span><small>{title}</small></div>)}</div>}
              <button className="icon-button" onClick={onClose} aria-label="Funnel schließen"><X /></button>
            </header>

            {!result ? (
              <div className="funnel-body">
                <div className="funnel-main">
                  <div className="mobile-progress"><span style={{ width: `${((step + 1) / 5) * 100}%` }} /></div>
                  <div className="step-copy">
                    <span className="eyebrow">Schritt {step + 1} von 5 · {stepTitles[step]}</span>
                    <h2>{["Lass uns deine Situation verstehen.", "Was möchtest du für morgen klären?", "Was ist dir am wichtigsten?", "Was ist heute schon da?", "Deine Übersicht ist gleich bereit."][step]}</h2>
                    <p>{["Wähle den Anlass, der am besten zu dir passt. Es gibt hier keine falschen Antworten.", "Wähle alle Themen, die dich gerade beschäftigen – wir bringen sie danach in eine klare Reihenfolge.", "Eine Priorität reicht. Sie hilft uns dabei, die Orientierung auf das Wesentliche zu fokussieren.", "Kein Vertragsordner nötig. Eine grobe Einordnung reicht für den ersten Überblick.", "Damit die Demo deine Übersicht personalisieren kann, brauchen wir nur zwei Basisangaben."][step]}</p>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.div key={step} className="step-stage" initial={reduce ? false : { opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} exit={reduce ? undefined : { opacity: 0, x: -18 }} transition={{ duration: .32, ease: [0.22, 1, 0.36, 1] }}>{renderStep()}</motion.div>
                  </AnimatePresence>
                  <div className="step-actions">
                    <button className="back-button" onClick={back} disabled={step === 0}><ArrowLeft /> Zurück</button>
                    {step < 4 ? <button className="primary" onClick={next} disabled={!canContinue}>Weiter <ArrowRight /></button> : <button className="primary" type="submit" form="contact-form" disabled={!canContinue}>Übersicht erstellen <ArrowRight /></button>}
                  </div>
                </div>
                <aside className="funnel-aside">
                  <div className="aside-image"><Image src="/assets/hero-life.svg" alt="Blick über eine Berg- und Seenlandschaft" fill sizes="32vw" unoptimized /><div className="aside-wash" /><span className="hand-note">Ein Leben.<br />Viele Möglichkeiten.<i /></span></div>
                  <div className="aside-card progress-card"><div><strong>Dein Fortschritt</strong><small>{step + 1} von 5 Schritten</small></div><span className="mini-progress"><i style={{ width: `${((step + 1) / 5) * 100}%` }} /></span><b>{(step + 1) * 20}%</b></div>
                  <div className="aside-card summary-card"><span><Leaf /></span><div><small>Dein Fokus</small><strong>{topicLabel}</strong>{role && <em>{roleOptions.find((item) => item.key === role)?.title}</em>}</div></div>
                  <div className="aside-reasons"><strong>Warum dieser Ablauf?</strong><p><LockKeyhole /> Datenschutz im Fokus</p><p><Compass /> Erst Orientierung, dann Details</p><p><HeartHandshake /> Persönliche Beratung bleibt persönlich</p></div>
                </aside>
              </div>
            ) : resultContent}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function InsuranceExperience() {
  const [selected, setSelected] = useState<NavigatorKey>("vorsorge");
  const [funnelOpen, setFunnelOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 32, restDelta: .001 });
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(heroProgress, [0, 1], ["0%", "18%"]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.08]);
  const heroOpacity = useTransform(heroProgress, [0, .85], [1, .15]);
  const selectedData = useMemo(() => navigator.find((item) => item.key === selected) ?? navigator[0], [selected]);

  const openFunnel = (key: NavigatorKey = selected) => {
    setSelected(key);
    setFunnelOpen(true);
  };

  return (
    <main className="site-shell">
      <motion.div className="page-progress" style={{ scaleX: progress }} />
      <header className="site-header">
        <a className="brand" href="#top"><span className="brand-mark"><i /><i /></span><span><strong>Versicherungsplattform</strong><small>Heute sicher. Morgen größer.</small></span></a>
        <nav className="desktop-nav"><a href="#loesungen">Lösungen</a><a href="#navigator">Lebens-Navigator</a><a href="#welten">So funktioniert&apos;s</a><a href="#klarheit">Klarheit</a></nav>
        <div className="header-actions"><button className="search-button" aria-label="Suche"><Search /></button><button className="ghost-button" onClick={() => openFunnel()}>Meine Situation</button><button className="dark-button" onClick={() => openFunnel()}>Orientierung starten <ArrowRight /></button><button className="menu-button" aria-label="Menü öffnen" onClick={() => setMenuOpen(!menuOpen)}><Menu /></button></div>
        <AnimatePresence>{menuOpen && <motion.nav className="mobile-nav" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}><a href="#loesungen" onClick={() => setMenuOpen(false)}>Lösungen</a><a href="#navigator" onClick={() => setMenuOpen(false)}>Lebens-Navigator</a><a href="#welten" onClick={() => setMenuOpen(false)}>So funktioniert&apos;s</a><button className="primary wide" onClick={() => { setMenuOpen(false); openFunnel(); }}>Orientierung starten <ArrowRight /></button></motion.nav>}</AnimatePresence>
      </header>

      <section className="hero" id="top" ref={heroRef}>
        <motion.div className="hero-bg" style={{ y: heroY, scale: heroScale }}><Image src="/assets/hero-life.svg" alt="Paar mit Blick über eine Berg- und Seenlandschaft" fill priority sizes="100vw" unoptimized /></motion.div>
        <div className="hero-wash" />
        <motion.div className="hero-content" style={{ opacity: heroOpacity }}>
          <div className="hero-copy">
            <motion.span className="eyebrow" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 }}>Mehr als Versicherungen</motion.span>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .85, delay: .2, ease: [0.22, 1, 0.36, 1] }}>Dein Leben<br />verändert sich.<em>Deine Absicherung<br />sollte mitdenken.</em></motion.h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .4 }}>Versicherungen, Vorsorge und Vermögen – in einem System, das Komplexität in klare nächste Schritte übersetzt.</motion.p>
            <motion.div className="hero-buttons" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .52 }}><button className="primary" onClick={() => openFunnel()}>Meine Situation prüfen <ArrowRight /></button><a className="secondary" href="#navigator"><Play /> In 90 Sekunden verstehen</a></motion.div>
            <motion.div className="hero-proof" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .75 }}><span><BadgeCheck /> Klar strukturiert</span><span><LockKeyhole /> Datenschutz im Fokus</span><span><HeartHandshake /> Persönlich begleitet</span></motion.div>
          </div>
          <div className="hero-map-wrap"><LifeMap /></div>
        </motion.div>
        <span className="hero-script">Heute verstehen.<br />Morgen freier entscheiden.<i /></span>
        <a className="scroll-cue" href="#loesungen"><span>Scroll für mehr</span><i><ArrowRight /></i></a>
      </section>

      <section className="trust-ribbon">
        <div><BadgeCheck /><span><strong>Ein System</strong><small>statt vier Einzellösungen</small></span></div>
        <div><Compass /><span><strong>Orientierung zuerst</strong><small>bevor Produkte verglichen werden</small></span></div>
        <div><LockKeyhole /><span><strong>Datensparsam gedacht</strong><small>nur relevante Angaben im Funnel</small></span></div>
        <div><Sparkles /><span><strong>Digital & persönlich</strong><small>Technik unterstützt das Gespräch</small></span></div>
      </section>

      <section className="solutions section" id="loesungen">
        <div className="section-heading split-heading"><Reveal><span className="eyebrow">Ganzheitlich. Persönlich. Zukunftsorientiert.</span><h2>Deine Lebensbereiche.<br />Unsere Lösungen.</h2></Reveal><Reveal className="heading-side" delay={.12}><p>Das Leben ist komplex. Deine Orientierung sollte es nicht sein. Entdecke, wie die Bereiche zusammenspielen – und starte dort, wo es für dich heute relevant ist.</p><a href="#navigator">So funktioniert die Plattform <ArrowRight /></a></Reveal></div>
        <div className="product-grid">{products.map((product, index) => <Reveal key={product.key} delay={index * .06}><ProductCard product={product} /></Reveal>)}</div>
      </section>

      <section className="navigator-section" id="navigator">
        <div className="navigator-bg"><Image src="/assets/hero-life.svg" alt="" fill sizes="100vw" unoptimized /></div><div className="navigator-wash" />
        <div className="navigator-inner section">
          <Reveal className="navigator-intro"><span className="eyebrow">Dein Lebens-Navigator</span><h2>Was möchtest du heute<br />für morgen klären?</h2><p>Du musst kein Versicherungswissen mitbringen. Wähle einfach, was dich gerade beschäftigt.</p><div className="navigator-benefits"><span><Leaf /> Individuelle Route</span><span><Clock3 /> In wenigen Minuten</span><span><Compass /> Verständlich geführt</span></div><span className="hand-note navigator-note">Klarheit heute.<br />Ein stärkeres Morgen.<i /></span></Reveal>
          <div className="navigator-workspace">
            <div className="navigator-tabs">{navigator.map((item) => <motion.button key={item.key} className={cx("navigator-tab", selected === item.key && "selected")} onClick={() => setSelected(item.key)} layout><span>{item.icon}</span><strong>{item.title}</strong><small>{item.small}</small><i>{selected === item.key ? <Check /> : <ArrowRight />}</i></motion.button>)}</div>
            <div className="navigator-result"><div className="route-steps"><span className="eyebrow">Dein Weg zur Orientierung</span><div className="route-row">{["Situation verstehen", "Ziele definieren", "Fragen sortieren", "Nächsten Schritt planen"].map((title, index) => <div key={title}><span>{index + 1}</span><strong>{title}</strong><small>{["Wo stehst du heute?", "Was ist dir wichtig?", "Was braucht wirklich Klärung?", "Mit Kontext statt Bauchgefühl."][index]}</small></div>)}</div></div><motion.div key={selected} className="route-result" initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .4 }}><span className="eyebrow">Dein Ergebnis</span><h3>{selectedData.resultTitle}</h3><p>{selectedData.resultText}</p><ul><li><Check /> auf deine Lebenssituation zugeschnitten</li><li><Check /> ohne Fachjargon strukturiert</li><li><Check /> bereit für ein persönliches Gespräch</li></ul><button className="dark-button" onClick={() => openFunnel(selected)}>Jetzt Orientierung starten <ArrowRight /></button></motion.div></div>
          </div>
        </div>
      </section>

      <ScrollStory onOpen={openFunnel} />

      <section className="clarity section" id="klarheit">
        <div className="section-heading centered"><Reveal><span className="eyebrow">Probleme werden nicht kleiner, wenn man sie ignoriert.</span><h2>Was passiert, wenn …?</h2><p>Gute Orientierung beginnt nicht mit einem Produkt. Sie beginnt mit den richtigen Fragen.</p></Reveal></div>
        <div className="scenario-grid">{scenarios.map((scenario, index) => <Reveal key={scenario.number} delay={index * .07}><article className="scenario-card"><span className="scenario-number">{scenario.number}</span><i>{scenario.icon}</i><h3>{scenario.question}</h3><p>{scenario.answer}</p><span className="scenario-line" /></article></Reveal>)}</div>
      </section>

      <section className="explainer-section section">
        <Reveal className="explainer-card">
          <div className="explainer-photo"><Image src="/assets/bav.svg" alt="Moderne Architektur in einer Berglandschaft" fill sizes="50vw" unoptimized /><div className="explainer-wash" /><button aria-label="Erklärvideo abspielen"><Play fill="currentColor" /></button><span>60–90 Sek.<br />Erklärvideo-Konzept</span></div>
          <div className="explainer-copy"><span className="eyebrow">Komplexes einfach machen</span><h2>Versicherung muss sich nicht kompliziert anfühlen.</h2><p>Der Funnel und das Erklärvideo erzählen dieselbe Geschichte: erst Situation verstehen, dann Themen sortieren, danach persönlich entscheiden.</p><div className="mini-storyboard"><span><b>01</b> Alltag & Problem</span><span><b>02</b> Ordnung schaffen</span><span><b>03</b> Möglichkeiten verstehen</span><span><b>04</b> Nächster Schritt</span></div><button className="primary" onClick={() => openFunnel()}>Funnel selbst erleben <ArrowRight /></button></div>
        </Reveal>
      </section>

      <section className="final-cta">
        <div className="final-bg"><Image src="/assets/inheritance.svg" alt="Majestätischer Baum bei Sonnenaufgang" fill sizes="100vw" unoptimized /></div><div className="final-wash" />
        <Reveal className="final-content"><span className="eyebrow light">Dein nächster Schritt</span><h2>Ein besser abgesichertes Leben beginnt mit den richtigen Fragen.</h2><p>In wenigen Minuten entsteht aus vier komplexen Themen eine klare persönliche Übersicht.</p><div><button className="primary" onClick={() => openFunnel()}>Meine Situation prüfen <ArrowRight /></button><span><LockKeyhole /> Konzeptdemo · keine Datenübertragung</span></div></Reveal>
      </section>

      <footer><a className="brand" href="#top"><span className="brand-mark"><i /><i /></span><span><strong>Versicherungsplattform</strong><small>Konzeptdemo</small></span></a><p>Design- und Funnel-Konzept. Keine Versicherungsberatung und keine konkrete Produktempfehlung.</p><a href="#top">Nach oben <ArrowRight /></a></footer>

      <FunnelOverlay open={funnelOpen} initialTopic={selected} onClose={() => setFunnelOpen(false)} />
    </main>
  );
}
