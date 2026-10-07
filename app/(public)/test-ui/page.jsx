import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import SplitText from '@/components/ui/SplitText';
import SectionHeading from '@/components/ui/SectionHeading';
import TiltCard from '@/components/ui/TiltCard';
import Marquee from '@/components/ui/Marquee';
import CountUp from '@/components/ui/CountUp';
import Magnetic from '@/components/ui/Magnetic';

export const metadata = {
  title: 'Motion Lab',
  description: 'Every animation technique used across the portfolio, in one playground.',
};

const TILT_DEMOS = [
  { title: 'Perspective tilt', body: 'Pointer-tracked rotation with a glare that follows the cursor.' },
  { title: 'Spotlight surface', body: 'A radial spotlight is painted from the pointer position.' },
  { title: 'Animated border', body: 'Rotating conic-gradient border that reveals on hover.' },
];

const STACK = [
  { label: 'React', icon: '⚛', color: '#61DAFB' },
  { label: 'Next.js', icon: '▲', color: '#38BDF8' },
  { label: 'Node.js', icon: '🟢', color: '#339933' },
  { label: 'Java', icon: '☕', color: '#ED8B00' },
  { label: 'PostgreSQL', icon: '🐘', color: '#336791' },
  { label: 'Tailwind', icon: '💨', color: '#06B6D4' },
  { label: 'Docker', icon: '🐳', color: '#2496ED' },
];

export default function TestUI() {
  return (
    <main className="section container page-enter" style={{ paddingTop: 120 }}>
      {/* ------------------------------------------------------------------ */}
      <section style={{ marginBottom: 90 }}>
        <span className="hero-kicker">
          <span className="hero-kicker__dot" aria-hidden="true" />
          Motion lab
        </span>
        <h1 className="home__title hero-title" style={{ marginBottom: 18 }}>
          <SplitText as="span" className="hero-title__lead" text="Animations, in" mode="char" />
          <SplitText
            as="span"
            className="hero-title__role"
            text="one playground"
            mode="char"
            gradient
            delay={280}
            stagger={20}
          />
        </h1>
        <p style={{ maxWidth: 620, color: 'var(--text-color)', lineHeight: 1.8 }}>
          Every effect used across the portfolio, grouped the way the SVGator inspiration list
          describes them: ambient motion, kinetic typography, self-drawing lines, microinteractions,
          hover surfaces, scrollytelling, shimmer skeletons and page transitions.
        </p>
        <div className="hero-stats reveal reveal-stagger" style={{ marginTop: 30 }}>
          <div className="hero-stats__item">
            <span className="hero-stats__value"><CountUp value={12} suffix="+" /></span>
            <span className="hero-stats__label">Effects</span>
          </div>
          <div className="hero-stats__item">
            <span className="hero-stats__value"><CountUp value={100} suffix="%" /></span>
            <span className="hero-stats__label">CSS driven</span>
          </div>
          <div className="hero-stats__item">
            <span className="hero-stats__value"><CountUp value={0} /></span>
            <span className="hero-stats__label">New dependencies</span>
          </div>
        </div>
      </section>

      {/* 4 — expressive typography ---------------------------------------- */}
      <section style={{ marginBottom: 90 }}>
        <SectionHeading title="Expressive" highlight="typography" eyebrow="SVGator #4" />
        <p className="text-shine" style={{ fontSize: 'var(--h2-font-size)', fontWeight: 700 }}>
          Gradient shimmer across a whole line of text.
        </p>
      </section>

      {/* 26 — hover surfaces ---------------------------------------------- */}
      <section style={{ marginBottom: 90 }}>
        <SectionHeading title="Hover" highlight="surfaces" eyebrow="SVGator #26 / #28" />
        <div className="grid gap-6 lg:grid-cols-3 sm:grid-cols-2">
          {TILT_DEMOS.map((demo) => (
            <TiltCard key={demo.title} className="border-anim reveal-scale" max={10}>
              <div
                style={{
                  padding: 26,
                  borderRadius: 20,
                  border: '1px solid var(--border-color)',
                  background: 'var(--glass-bg)',
                  backdropFilter: 'blur(var(--glass-blur))',
                  boxShadow: 'var(--glass-shadow)',
                  minHeight: 168,
                }}
              >
                <h3 style={{ marginBottom: 10, fontSize: 'var(--h3-font-size)' }}>{demo.title}</h3>
                <p style={{ color: 'var(--text-color)', lineHeight: 1.7 }}>{demo.body}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </section>

      {/* 12 — microinteractions ------------------------------------------- */}
      <section style={{ marginBottom: 90 }}>
        <SectionHeading title="Micro" highlight="interactions" eyebrow="SVGator #12" />
        <div className="flex flex-wrap items-center justify-center gap-5 mb-8">
          <Magnetic className="hero-magnetic">
            <Button variant="primary">Magnetic button</Button>
          </Magnetic>
          <Magnetic className="hero-magnetic">
            <Button variant="secondary">Magnetic secondary</Button>
          </Magnetic>
          <Magnetic className="hero-magnetic">
            <Button variant="outline">Magnetic outline</Button>
          </Magnetic>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input placeholder="Inputs glow on focus" />
          <Input placeholder="Try tabbing here" variant="success" />
        </div>
      </section>

      {/* 24 — skeletons --------------------------------------------------- */}
      <section style={{ marginBottom: 90 }}>
        <SectionHeading title="Shimmer" highlight="skeletons" eyebrow="SVGator #24" />
        <div className="grid gap-6 lg:grid-cols-3 sm:grid-cols-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="portfolio__item skeleton-project">
              <div className="skeleton-image" />
              <div className="skeleton-content">
                <div className="skeleton-title" />
                <div className="skeleton-text" />
                <div className="skeleton-tags">
                  <span className="skeleton-tag" />
                  <span className="skeleton-tag" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 15 / 20 — tickers ------------------------------------------------ */}
      <section style={{ marginBottom: 90 }}>
        <SectionHeading title="Infinite" highlight="tickers" eyebrow="SVGator #15 / #20" />
        <div style={{ display: 'grid', gap: 16 }}>
          <Marquee items={STACK} speed={30} />
          <Marquee items={STACK} speed={38} reverse />
        </div>
      </section>

      {/* 2 — scrollytelling ------------------------------------------------ */}
      <section style={{ marginBottom: 60 }}>
        <SectionHeading title="Scroll" highlight="reveals" eyebrow="SVGator #2" />
        <div className="grid gap-6 lg:grid-cols-4 sm:grid-cols-2">
          <div className="reveal-blur" style={cardStyle}>Blur rise</div>
          <div className="reveal-mask" style={cardStyle}>Mask wipe</div>
          <div className="reveal-flip" style={cardStyle}>Flip in</div>
          <div className="reveal-zoom" style={cardStyle}>Zoom in</div>
        </div>
      </section>

      {/* component primitives -------------------------------------------- */}
      <section>
        <SectionHeading title="Core" highlight="primitives" eyebrow="Design system" />

        <div className="grid gap-6 mb-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="lg">Large</Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">Default Card</h3>
              <p>This is a sample card content.</p>
            </Card>
            <Card variant="elevated" className="p-6">
              <h3 className="text-xl font-bold mb-4">Elevated Card</h3>
              <p>This card has elevation.</p>
            </Card>
            <Card variant="subtle" className="p-6">
              <h3 className="text-xl font-bold mb-4">Subtle Card</h3>
              <p>This card has subtle styling.</p>
            </Card>
          </div>

          <div className="flex flex-wrap gap-4">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
          </div>
        </div>
      </section>
    </main>
  );
}

const cardStyle = {
  padding: 26,
  minHeight: 120,
  display: 'grid',
  placeItems: 'center',
  borderRadius: 18,
  border: '1px solid var(--border-color)',
  background: 'var(--glass-bg)',
  backdropFilter: 'blur(var(--glass-blur))',
  boxShadow: 'var(--glass-shadow)',
  fontWeight: 600,
  color: 'var(--title-color)',
};
