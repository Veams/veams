import type { FeatureCard } from '../content/site';

type ConceptGridProps = {
  items: FeatureCard[];
};

function ConceptIllustration({ visual }: Pick<FeatureCard, 'visual'>) {
  switch (visual) {
    case 'swap-engine':
      return (
        <svg aria-hidden="true" className="concept-illustration" viewBox="0 0 320 180">
          <rect
            fill="rgba(30, 37, 49, 0.96)"
            height="128"
            rx="18"
            stroke="var(--visual-blue)"
            strokeWidth="2"
            width="112"
            x="20"
            y="26"
          />
          <circle cx="76" cy="70" fill="var(--visual-blue-soft)" r="26" />
          <circle cx="76" cy="70" fill="var(--visual-blue)" r="10" />
          <rect fill="var(--visual-blue-dim)" height="12" rx="6" width="74" x="39" y="114" />
          <path
            d="M134 74 H182"
            fill="none"
            stroke="var(--visual-white)"
            strokeLinecap="round"
            strokeWidth="4"
          />
          <path
            d="M166 58 L182 74 L166 90"
            fill="none"
            stroke="var(--visual-white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />
          <path
            d="M186 132 H138"
            fill="none"
            stroke="var(--visual-white)"
            strokeLinecap="round"
            strokeWidth="4"
          />
          <path
            d="M154 116 L138 132 L154 148"
            fill="none"
            stroke="var(--visual-white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />
          <rect
            fill="rgba(30, 37, 49, 0.96)"
            height="128"
            rx="18"
            stroke="var(--visual-orange)"
            strokeWidth="2"
            width="112"
            x="188"
            y="26"
          />
          <rect fill="var(--visual-orange-dim)" height="12" rx="6" width="64" x="212" y="82" />
          <circle cx="244" cy="124" fill="var(--visual-orange-soft)" r="30" />
          <circle cx="244" cy="124" fill="var(--visual-orange)" r="12" />
        </svg>
      );
    case 'view-state':
      return (
        <svg aria-hidden="true" className="concept-illustration" viewBox="0 0 320 180">
          <rect
            fill="rgba(30, 37, 49, 0.96)"
            height="128"
            rx="18"
            stroke="var(--visual-blue)"
            strokeWidth="2"
            width="108"
            x="24"
            y="26"
          />
          <rect fill="var(--visual-blue-dim)" height="14" rx="7" width="74" x="40" y="56" />
          <rect fill="var(--visual-blue-dim)" height="14" rx="7" width="58" x="40" y="88" />
          <rect fill="var(--visual-blue-dim)" height="14" rx="7" width="48" x="40" y="120" />
          <path
            d="M130 98 H184"
            fill="none"
            stroke="var(--visual-white)"
            strokeDasharray="8 7"
            strokeLinecap="round"
            strokeWidth="4"
          />
          <circle cx="156" cy="98" fill="var(--visual-white)" r="7" />
          <rect
            fill="rgba(34, 41, 56, 0.98)"
            height="128"
            rx="18"
            stroke="var(--visual-slate)"
            strokeWidth="2"
            width="110"
            x="190"
            y="26"
          />
          <rect fill="var(--visual-blue)" height="22" rx="11" width="86" x="206" y="48" />
          <rect fill="var(--visual-orange)" height="22" rx="11" width="86" x="206" y="84" />
          <rect fill="var(--visual-slate)" height="22" rx="11" width="86" x="206" y="120" />
        </svg>
      );
    case 'framework-core':
      return (
        <svg aria-hidden="true" className="concept-illustration" viewBox="0 0 320 180">
          <circle
            cx="160"
            cy="90"
            fill="none"
            r="64"
            stroke="var(--visual-blue)"
            strokeWidth="2"
          />
          <circle cx="160" cy="90" fill="var(--visual-blue-soft)" r="34" />
          <circle cx="160" cy="90" fill="var(--visual-blue)" r="14" />
          <path
            d="M160 22 V46 M222 90 H246 M160 134 V158 M74 90 H98 M110 40 L130 54 M210 40 L190 54 M110 140 L130 126 M210 140 L190 126"
            fill="none"
            stroke="var(--visual-white)"
            strokeLinecap="round"
            strokeWidth="4"
          />
          <circle cx="160" cy="22" fill="var(--visual-orange)" r="9" />
          <circle cx="246" cy="90" fill="var(--visual-slate)" r="9" />
          <circle cx="160" cy="158" fill="var(--visual-slate)" r="9" />
          <circle cx="74" cy="90" fill="var(--visual-orange)" r="9" />
        </svg>
      );
    case 'passive-snapshot':
      return (
        <svg aria-hidden="true" className="concept-illustration" viewBox="0 0 320 180">
          <rect
            fill="rgba(30, 37, 49, 0.96)"
            height="128"
            rx="18"
            stroke="var(--accent)"
            strokeWidth="2"
            width="122"
            x="22"
            y="26"
          />
          <rect fill="var(--visual-blue-dim)" height="14" rx="7" width="80" x="42" y="54" />
          <rect fill="var(--visual-slate-dim)" height="14" rx="7" width="72" x="42" y="86" />
          <rect fill="var(--visual-blue-dim)" height="14" rx="7" width="58" x="42" y="118" />
          <path
            d="M144 90 H188"
            fill="none"
            stroke="var(--visual-white)"
            strokeDasharray="8 7"
            strokeLinecap="round"
            strokeWidth="4"
          />
          <circle cx="188" cy="90" fill="var(--visual-white)" r="6" />
          <rect fill="var(--visual-orange)" height="18" rx="9" width="74" x="202" y="56" />
          <rect fill="var(--visual-slate)" height="18" rx="9" width="62" x="202" y="86" />
          <rect fill="var(--accent)" height="18" rx="9" width="86" x="202" y="116" />
        </svg>
      );
    case 'handle-command':
      return (
        <svg aria-hidden="true" className="concept-illustration" viewBox="0 0 320 180">
          <rect
            fill="rgba(34, 41, 56, 0.98)"
            height="124"
            rx="20"
            stroke="var(--accent)"
            strokeWidth="2"
            width="128"
            x="96"
            y="28"
          />
          <rect fill="var(--visual-white-soft)" height="10" rx="5" width="72" x="124" y="52" />
          <rect fill="var(--visual-blue-dim)" height="12" rx="6" width="82" x="118" y="78" />
          <rect fill="var(--visual-orange)" height="22" rx="11" width="72" x="124" y="110" />
          <path
            d="M70 90 H94 M226 90 H250"
            fill="none"
            stroke="var(--visual-white)"
            strokeLinecap="round"
            strokeWidth="4"
          />
          <circle cx="58" cy="90" fill="var(--visual-blue)" r="10" />
          <circle cx="262" cy="90" fill="var(--visual-orange)" r="10" />
        </svg>
      );
    case 'cache-orchestration':
      return (
        <svg aria-hidden="true" className="concept-illustration" viewBox="0 0 320 180">
          <rect
            fill="rgba(30, 37, 49, 0.96)"
            height="64"
            rx="16"
            stroke="var(--visual-slate)"
            strokeWidth="2"
            width="76"
            x="28"
            y="28"
          />
          <rect fill="var(--visual-blue-dim)" height="10" rx="5" width="44" x="44" y="52" />
          <rect fill="var(--visual-slate-dim)" height="10" rx="5" width="34" x="44" y="70" />
          <rect
            fill="rgba(30, 37, 49, 0.96)"
            height="64"
            rx="16"
            stroke="var(--visual-slate)"
            strokeWidth="2"
            width="76"
            x="216"
            y="28"
          />
          <rect fill="var(--visual-orange)" height="10" rx="5" width="42" x="232" y="52" />
          <rect fill="var(--visual-slate-dim)" height="10" rx="5" width="34" x="232" y="70" />
          <rect
            fill="rgba(30, 37, 49, 0.96)"
            height="64"
            rx="16"
            stroke="var(--visual-slate)"
            strokeWidth="2"
            width="76"
            x="122"
            y="96"
          />
          <rect fill="var(--accent)" height="10" rx="5" width="42" x="138" y="120" />
          <rect fill="var(--visual-slate-dim)" height="10" rx="5" width="34" x="138" y="138" />
          <circle cx="160" cy="82" fill="var(--accent-soft)" r="28" />
          <circle cx="160" cy="82" fill="var(--accent)" r="12" />
          <path
            d="M104 60 L136 72 M216 60 L184 72 M160 110 V96"
            fill="none"
            stroke="var(--visual-white)"
            strokeLinecap="round"
            strokeWidth="4"
          />
        </svg>
      );
    case 'methodology-regions':
      return (
        <svg aria-hidden="true" className="concept-illustration" viewBox="0 0 320 180">
          <rect
            fill="rgba(30, 37, 49, 0.96)"
            height="140"
            rx="8"
            stroke="var(--visual-blue)"
            strokeWidth="2"
            width="280"
            x="20"
            y="20"
          />
          <text fill="var(--visual-blue)" fontFamily="var(--font-mono)" fontSize="10" x="30" y="35">
            REGION (r-main)
          </text>
          <rect fill="var(--visual-blue-dim)" height="90" rx="4" width="240" x="40" y="50" />
        </svg>
      );
    case 'methodology-components':
      return (
        <svg aria-hidden="true" className="concept-illustration" viewBox="0 0 320 180">
          <rect
            fill="rgba(30, 37, 49, 0.96)"
            height="140"
            rx="8"
            stroke="var(--visual-blue)"
            strokeWidth="2"
            width="280"
            x="20"
            y="20"
          />
          <rect
            fill="rgba(255, 163, 39, 0.1)"
            height="90"
            rx="6"
            stroke="var(--visual-orange)"
            strokeWidth="2"
            width="240"
            x="40"
            y="50"
          />
          <text
            fill="var(--visual-orange)"
            fontFamily="var(--font-mono)"
            fontSize="10"
            x="50"
            y="65"
          >
            COMPONENT (c-card)
          </text>
          <rect fill="var(--visual-orange-dim)" height="40" rx="4" width="200" x="60" y="80" />
        </svg>
      );
    case 'methodology-utilities':
      return (
        <svg aria-hidden="true" className="concept-illustration" viewBox="0 0 320 180">
          <rect
            fill="rgba(30, 37, 49, 0.96)"
            height="140"
            rx="8"
            stroke="var(--visual-blue)"
            strokeWidth="2"
            width="280"
            x="20"
            y="20"
          />
          <rect
            fill="none"
            height="100"
            rx="4"
            stroke="var(--visual-slate)"
            strokeDasharray="4 4"
            strokeWidth="1"
            width="240"
            x="40"
            y="40"
          />
          <text fill="var(--visual-slate)" fontFamily="var(--font-mono)" fontSize="10" x="50" y="55">
            UTILITY (u-grid)
          </text>
          <rect
            fill="rgba(255, 163, 39, 0.1)"
            height="50"
            rx="4"
            stroke="var(--visual-orange)"
            strokeWidth="2"
            width="100"
            x="50"
            y="75"
          />
          <rect
            fill="rgba(255, 163, 39, 0.1)"
            height="50"
            rx="4"
            stroke="var(--visual-orange)"
            strokeWidth="2"
            width="100"
            x="170"
            y="75"
          />
          <text
            fill="var(--visual-orange)"
            fontFamily="var(--font-mono)"
            fontSize="8"
            x="55"
            y="90"
          >
            c-card
          </text>
        </svg>
      );
    case 'methodology-layout':
      return (
        <svg aria-hidden="true" className="concept-illustration" viewBox="0 0 320 180">
          <rect
            fill="rgba(30, 37, 49, 0.96)"
            height="30"
            rx="4"
            stroke="var(--visual-blue)"
            strokeWidth="2"
            width="280"
            x="20"
            y="10"
          />
          <text fill="var(--visual-blue)" fontFamily="var(--font-mono)" fontSize="8" x="30" y="28">
            r-header
          </text>
          <rect
            fill="rgba(30, 37, 49, 0.96)"
            height="100"
            rx="4"
            stroke="var(--visual-blue)"
            strokeWidth="2"
            width="60"
            x="20"
            y="45"
          />
          <text fill="var(--visual-blue)" fontFamily="var(--font-mono)" fontSize="8" x="30" y="63">
            r-sidebar
          </text>
          <rect
            fill="rgba(30, 37, 49, 0.96)"
            height="100"
            rx="4"
            stroke="var(--visual-blue)"
            strokeWidth="2"
            width="210"
            x="90"
            y="45"
          />
          <text fill="var(--visual-blue)" fontFamily="var(--font-mono)" fontSize="8" x="100" y="63">
            r-main
          </text>
          <rect
            fill="rgba(30, 37, 49, 0.96)"
            height="20"
            rx="4"
            stroke="var(--visual-blue)"
            strokeWidth="2"
            width="280"
            x="20"
            y="150"
          />
          <text fill="var(--visual-blue)" fontFamily="var(--font-mono)" fontSize="8" x="30" y="163">
            r-footer
          </text>
        </svg>
      );
    default:
      return null;
  }
}

export function ConceptGrid({ items }: ConceptGridProps) {
  return (
    <div className="concept-grid">
      {items.map((item) => (
        <article className="concept-card" key={item.title}>
          <div className="concept-card-visual">
            <ConceptIllustration visual={item.visual} />
          </div>
          <div className="concept-card-body">
            <h4>{item.title}</h4>
            <p>{item.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
