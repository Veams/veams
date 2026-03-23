import { NavLink } from 'react-router-dom';
import type { FeatureCard } from '../content/site';

type ConceptGridProps = {
  items: FeatureCard[];
};

function ConceptIllustration({ visual }: Pick<FeatureCard, 'visual'>) {
  switch (visual) {
    case 'swap-engine':
      return (
        <svg
          aria-hidden="true"
          className="concept-illustration concept-illustration-vent-card-publish"
          viewBox="0 0 320 180"
        >
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
    case 'form-feature-owner':
      return (
        <svg
          aria-hidden="true"
          className="concept-illustration"
          style={{ width: '70%' }}
          viewBox="0 0 320 180"
        >
          <rect
            fill="rgba(30, 37, 49, 0.96)"
            height="114"
            rx="14"
            stroke="var(--visual-blue)"
            strokeWidth="1.5"
            width="172"
            x="24"
            y="32"
          />
          <text fill="var(--visual-blue)" fontFamily="var(--font-mono)" fontSize="10" x="36" y="50">
            FeatureStateHandler
          </text>
          <rect
            fill="rgba(255, 163, 39, 0.12)"
            height="74"
            rx="10"
            stroke="var(--visual-orange)"
            strokeWidth="1.5"
            width="136"
            x="40"
            y="62"
          />
          <text
            fill="var(--visual-orange)"
            fontFamily="var(--font-mono)"
            fontSize="10"
            x="52"
            y="84"
          >
            FormStateHandler
          </text>
          <rect fill="var(--visual-orange-dim)" height="8" rx="4" width="92" x="56" y="94" />
          <rect fill="var(--visual-orange-dim)" height="8" rx="4" width="78" x="56" y="108" />
          <rect fill="var(--visual-orange-dim)" height="8" rx="4" width="68" x="56" y="122" />

          <rect
            fill="rgba(34, 41, 56, 0.98)"
            height="88"
            rx="12"
            stroke="var(--visual-slate)"
            strokeWidth="1.5"
            width="80"
            x="218"
            y="46"
          />
          <text fill="var(--visual-slate)" fontFamily="var(--font-mono)" fontSize="10" x="228" y="62">
            React
          </text>
          <rect fill="var(--visual-blue-dim)" height="10" rx="5" width="56" x="230" y="74" />
          <rect fill="var(--visual-slate-dim)" height="10" rx="5" width="56" x="230" y="90" />
          <rect fill="var(--visual-blue)" height="12" rx="6" width="56" x="230" y="108" />

          <path
            d="M184 94 H218"
            fill="none"
            stroke="var(--visual-white)"
            strokeLinecap="round"
            strokeWidth="3"
          />
          <path
            d="M206 84 L218 94 L206 104"
            fill="none"
            stroke="var(--visual-white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
          />
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
    case 'query-management':
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
    case 'vent-card-publish':
      return (
        <svg
          aria-hidden="true"
          className="concept-illustration concept-illustration-vent-card-publish"
          viewBox="0 0 320 180"
        >
          <rect
            fill="rgba(30, 37, 49, 0.96)"
            height="112"
            rx="18"
            stroke="var(--accent)"
            strokeWidth="2"
            width="108"
            x="28"
            y="34"
          />
          <text fill="var(--accent)" fontFamily="var(--font-mono)" fontSize="11" x="48" y="58">
            Publisher
          </text>
          <rect fill="var(--accent-ghost)" height="14" rx="7" width="64" x="50" y="72" />
          <rect fill="var(--visual-white-soft)" height="18" rx="9" width="72" x="46" y="102" />
          <text fill="var(--visual-panel)" fontFamily="var(--font-mono)" fontSize="9" x="58" y="115">
            publish()
          </text>

          <rect
            fill="rgba(34, 41, 56, 0.98)"
            height="112"
            rx="18"
            stroke="var(--visual-slate)"
            strokeWidth="2"
            width="108"
            x="196"
            y="34"
          />
          <text fill="var(--visual-slate)" fontFamily="var(--font-mono)" fontSize="11" x="214" y="58">
            Subscriber
          </text>
          <rect fill="var(--visual-blue-dim)" height="14" rx="7" width="64" x="218" y="72" />
          <rect fill="var(--visual-orange)" height="18" rx="9" width="72" x="214" y="102" />
          <text fill="var(--visual-panel)" fontFamily="var(--font-mono)" fontSize="9" x="226" y="115">
            on event
          </text>
          <path
            d="M136 90 H196"
            fill="none"
            stroke="var(--visual-white)"
            strokeLinecap="round"
            strokeWidth="4"
          />
          <path
            d="M180 74 L196 90 L180 106"
            fill="none"
            stroke="var(--visual-white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
          />
          <rect fill="var(--accent)" height="8" rx="4" width="28" x="152" y="72" />
          <rect fill="var(--accent)" height="8" rx="4" width="20" x="164" y="102" />
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
    case 'status-quo-architecture':
      return (
        <svg aria-hidden="true" className="concept-illustration" viewBox="0 0 320 125">
          <rect
            fill="rgba(30, 37, 49, 0.96)"
            height="50"
            rx="8"
            stroke="var(--visual-blue)"
            strokeWidth="2"
            width="80"
            x="20"
            y="45"
          />
          <text fill="var(--visual-blue)" fontFamily="var(--font-mono)" fontSize="10" x="30" y="75">
            HANDLER
          </text>
          <path
            d="M100 70 H130"
            fill="none"
            stroke="var(--visual-white)"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <path d="M130 70 L122 66 M130 70 L122 74" fill="none" stroke="var(--visual-white)" strokeWidth="2" />
          <circle
            cx="160"
            cy="70"
            fill="rgba(255, 163, 39, 0.15)"
            r="30"
            stroke="var(--visual-orange)"
            strokeWidth="2"
          />
          <text
            fill="var(--visual-orange)"
            fontFamily="var(--font-mono)"
            fontSize="8"
            textAnchor="middle"
            x="160"
            y="74"
          >
            ENGINE
          </text>
          <path
            d="M190 70 H220"
            fill="none"
            stroke="var(--visual-white)"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <path d="M220 70 L212 66 M220 70 L212 74" fill="none" stroke="var(--visual-white)" strokeWidth="2" />
          <rect
            fill="rgba(139, 151, 172, 0.15)"
            height="50"
            rx="8"
            stroke="var(--visual-slate)"
            strokeWidth="2"
            width="80"
            x="220"
            y="45"
          />
          <text
            fill="var(--visual-slate)"
            fontFamily="var(--font-mono)"
            fontSize="10"
            x="230"
            y="75"
          >
            SNAPSHOT
          </text>
          <path
            d="M260 45 V20 H60 V45"
            fill="none"
            stroke="var(--visual-white)"
            strokeDasharray="4 4"
            strokeLinecap="round"
            strokeWidth="1.5"
          />
          <path d="M60 45 L56 37 M60 45 L64 37" fill="none" stroke="var(--visual-white)" strokeWidth="1.5" />
          <text
            fill="var(--visual-white)"
            fontFamily="var(--font-body)"
            fontSize="8"
            textAnchor="middle"
            x="160"
            y="15"
          >
            VIEW (ACTIONS)
          </text>
        </svg>
      );
    case 'query-architecture':
      return (
        <svg aria-hidden="true" className="concept-illustration" viewBox="0 0 320 125">
          {/* Service Layer */}
          <rect
            fill="rgba(31, 139, 143, 0.15)"
            height="40"
            rx="4"
            stroke="var(--accent-teal)"
            strokeDasharray="4 2"
            strokeWidth="2"
            width="70"
            x="10"
            y="45"
          />
          <text fill="var(--accent-teal)" fontFamily="var(--font-mono)" fontSize="8" x="15" y="68">
            SERVICE
          </text>

          {/* Sync arrow from Service to Handler */}
          <path
            d="M80 65 H100"
            fill="none"
            stroke="var(--visual-white)"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <path d="M100 65 L92 61 M100 65 L92 69" fill="none" stroke="var(--visual-white)" strokeWidth="2" />

          {/* Handler */}
          <rect
            fill="rgba(30, 37, 49, 0.96)"
            height="40"
            rx="6"
            stroke="var(--visual-blue)"
            strokeWidth="2"
            width="70"
            x="100"
            y="45"
          />
          <text fill="var(--visual-blue)" fontFamily="var(--font-mono)" fontSize="8" x="105" y="68">
            HANDLER
          </text>

          {/* Command arrow from Handler to Service */}
          <path
            d="M100 55 H80"
            fill="none"
            stroke="var(--visual-orange)"
            strokeLinecap="round"
            strokeWidth="1.5"
          />
          <path d="M80 55 L88 51 M80 55 L88 59" fill="none" stroke="var(--visual-orange)" strokeWidth="1.5" />
          <text fill="var(--visual-orange)" fontFamily="var(--font-mono)" fontSize="6" x="78" y="50" textAnchor="end">
            refetch()
          </text>

          {/* Snapshot flow */}
          <path
            d="M170 65 H190"
            fill="none"
            stroke="var(--visual-white)"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <path d="M190 65 L182 61 M190 65 L182 69" fill="none" stroke="var(--visual-white)" strokeWidth="2" />

          {/* Snapshot */}
          <rect
            fill="rgba(139, 151, 172, 0.15)"
            height="40"
            rx="6"
            stroke="var(--visual-slate)"
            strokeWidth="2"
            width="70"
            x="190"
            y="45"
          />
          <text fill="var(--visual-slate)" fontFamily="var(--font-mono)" fontSize="8" x="195" y="68">
            SNAPSHOT
          </text>

          {/* View Layer */}
          <path
            d="M225 45 V20 H135 V45"
            fill="none"
            stroke="var(--visual-white)"
            strokeDasharray="3 3"
            strokeLinecap="round"
            strokeWidth="1"
          />
          <path d="M135 45 L132 38 M135 45 L138 38" fill="none" stroke="var(--visual-white)" strokeWidth="1" />
          <text
            fill="var(--visual-white)"
            fontFamily="var(--font-body)"
            fontSize="7"
            textAnchor="middle"
            x="180"
            y="12"
          >
            VIEW (triggers Handler actions)
          </text>
        </svg>
      );
    case 'query-facade':
      return (
        <svg aria-hidden="true" className="concept-illustration" viewBox="0 0 320 125">
          <rect
            fill="rgba(30, 37, 49, 0.96)"
            height="40"
            rx="20"
            stroke="var(--accent)"
            strokeWidth="2"
            width="120"
            x="100"
            y="10"
          />
          <text
            fill="var(--accent)"
            fontFamily="var(--font-mono)"
            fontSize="10"
            textAnchor="middle"
            x="160"
            y="35"
          >
            QUERY MANAGER
          </text>
          <path
            d="M160 50 V70 M160 70 L100 90 M160 70 L220 90"
            fill="none"
            stroke="var(--visual-white)"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <rect
            fill="rgba(30, 37, 49, 0.96)"
            height="30"
            rx="4"
            stroke="var(--visual-blue)"
            strokeWidth="1.5"
            width="60"
            x="70"
            y="90"
          />
          <rect
            fill="rgba(30, 37, 49, 0.96)"
            height="30"
            rx="4"
            stroke="var(--visual-blue)"
            strokeWidth="1.5"
            width="60"
            x="190"
            y="90"
          />
          <text fill="var(--visual-blue)" fontFamily="var(--font-mono)" fontSize="7" x="75" y="108">
            Query A
          </text>
          <text fill="var(--visual-blue)" fontFamily="var(--font-mono)" fontSize="7" x="195" y="108">
            Query B
          </text>
          <circle cx="160" cy="70" fill="var(--visual-orange)" r="4" />
          <text
            fill="var(--visual-orange)"
            fontFamily="var(--font-mono)"
            fontSize="8"
            x="170"
            y="73"
          >
            Invalidate
          </text>
        </svg>
      );
    case 'form-architecture':
      return (
        <svg aria-hidden="true" className="concept-illustration" viewBox="0 0 320 125">
          {/* Inputs */}
          <rect
            fill="rgba(255, 255, 255, 0.05)"
            height="30"
            rx="4"
            stroke="var(--visual-slate)"
            strokeWidth="1"
            width="60"
            x="10"
            y="45"
          />
          <text fill="var(--visual-slate)" fontFamily="var(--font-mono)" fontSize="7" x="15" y="63">
            DOM INPUTS
          </text>

          {/* Registration arrow */}
          <path
            d="M70 60 H90"
            fill="none"
            stroke="var(--visual-white)"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <path d="M90 60 L82 56 M90 60 L82 64" fill="none" stroke="var(--visual-white)" strokeWidth="2" />

          {/* Form Handler */}
          <rect
            fill="rgba(30, 37, 49, 0.96)"
            height="60"
            rx="6"
            stroke="var(--accent-violet)"
            strokeWidth="2"
            width="100"
            x="90"
            y="35"
          />
          <text fill="var(--accent-violet)" fontFamily="var(--font-mono)" fontSize="8" x="95" y="50">
            FORM HANDLER
          </text>
          <rect fill="rgba(122, 82, 224, 0.2)" height="10" rx="2" width="80" x="100" y="60" />
          <text fill="var(--accent-violet)" fontFamily="var(--font-mono)" fontSize="6" x="105" y="67">
            Validation
          </text>
          <rect fill="rgba(122, 82, 224, 0.2)" height="10" rx="2" width="80" x="100" y="75" />
          <text fill="var(--accent-violet)" fontFamily="var(--font-mono)" fontSize="6" x="105" y="82">
            State (T)
          </text>

          {/* Snapshot arrow */}
          <path
            d="M190 65 H210"
            fill="none"
            stroke="var(--visual-white)"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <path d="M210 65 L202 61 M210 65 L202 69" fill="none" stroke="var(--visual-white)" strokeWidth="2" />

          {/* Snapshot */}
          <rect
            fill="rgba(139, 151, 172, 0.15)"
            height="40"
            rx="6"
            stroke="var(--visual-slate)"
            strokeWidth="2"
            width="80"
            x="210"
            y="45"
          />
          <text fill="var(--visual-slate)" fontFamily="var(--font-mono)" fontSize="8" x="215" y="68">
            SNAPSHOT
          </text>

          {/* View Layer */}
          <path
            d="M250 45 V20 H140 V35"
            fill="none"
            stroke="var(--visual-white)"
            strokeDasharray="3 3"
            strokeLinecap="round"
            strokeWidth="1"
          />
          <path d="M140 35 L137 28 M140 35 L143 28" fill="none" stroke="var(--visual-white)" strokeWidth="1" />
          <text
            fill="var(--visual-white)"
            fontFamily="var(--font-body)"
            fontSize="7"
            textAnchor="middle"
            x="190"
            y="12"
          >
            VIEW (hooks bridge inputs)
          </text>
        </svg>
      );
    case 'form-ref-bridge':
      return (
        <svg aria-hidden="true" className="concept-illustration" viewBox="0 0 320 125">
          {/* Form Handler */}
          <rect
            fill="rgba(30, 37, 49, 0.96)"
            height="40"
            rx="6"
            stroke="var(--accent-violet)"
            strokeWidth="2"
            width="80"
            x="20"
            y="45"
          />
          <text fill="var(--accent-violet)" fontFamily="var(--font-mono)" fontSize="8" x="25" y="68">
            HANDLER
          </text>

          {/* Update trigger */}
          <path
            d="M100 65 H130"
            fill="none"
            stroke="var(--visual-orange)"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <path d="M130 65 L122 61 M130 65 L122 69" fill="none" stroke="var(--visual-orange)" strokeWidth="2" />
          <text fill="var(--visual-orange)" fontFamily="var(--font-mono)" fontSize="6" x="115" y="60" textAnchor="middle">
            update
          </text>

          {/* Hook with ref */}
          <rect
            fill="rgba(255, 255, 255, 0.1)"
            height="50"
            rx="25"
            stroke="var(--visual-white)"
            strokeWidth="1"
            width="80"
            x="130"
            y="40"
          />
          <text fill="var(--visual-white)" fontFamily="var(--font-mono)" fontSize="8" x="145" y="68">
            HOOK
          </text>
          <circle cx="170" cy="40" fill="var(--visual-blue)" r="6" />
          <text fill="var(--visual-white)" fontFamily="var(--font-body)" fontSize="6" x="180" y="42">
            ref
          </text>

          {/* Imperative bridge */}
          <path
            d="M170 40 V20 H250 V45"
            fill="none"
            stroke="var(--visual-blue)"
            strokeDasharray="3 3"
            strokeLinecap="round"
            strokeWidth="1.5"
          />
          <path d="M250 45 L247 38 M250 45 L253 38" fill="none" stroke="var(--visual-blue)" strokeWidth="1.5" />

          {/* DOM Input */}
          <rect
            fill="rgba(255, 255, 255, 0.05)"
            height="30"
            rx="4"
            stroke="var(--visual-slate)"
            strokeWidth="1"
            width="70"
            x="220"
            y="45"
          />
          <text fill="var(--visual-slate)" fontFamily="var(--font-mono)" fontSize="7" x="225" y="63">
            DOM INPUT
          </text>
        </svg>
      );
    case 'partial-hydration-architecture':
      return (
        <svg aria-hidden="true" className="concept-illustration" viewBox="0 0 320 180">
          {/* Static HTML frame (Browser Window) */}
          <rect
            fill="none"
            height="140"
            rx="6"
            stroke="var(--visual-slate)"
            strokeWidth="1.5"
            width="260"
            x="30"
            y="20"
          />
          {/* Browser Top Bar */}
          <rect fill="rgba(139, 151, 172, 0.15)" height="14" rx="4" width="260" x="30" y="20" />
          <circle cx="42" cy="27" fill="var(--visual-slate)" r="2" />
          <circle cx="50" cy="27" fill="var(--visual-slate)" r="2" />
          <circle cx="58" cy="27" fill="var(--visual-slate)" r="2" />

          {/* Static Header */}
          <rect
            fill="rgba(30, 37, 49, 0.96)"
            height="16"
            rx="2"
            stroke="var(--visual-slate)"
            strokeDasharray="2 2"
            strokeWidth="1"
            width="240"
            x="40"
            y="42"
          />
          <text fill="var(--visual-slate)" fontFamily="var(--font-mono)" fontSize="6" x="45" y="52">
            Static Header
          </text>

          {/* Static Sidebar */}
          <rect
            fill="rgba(30, 37, 49, 0.96)"
            height="85"
            rx="2"
            stroke="var(--visual-slate)"
            strokeDasharray="2 2"
            strokeWidth="1"
            width="50"
            x="40"
            y="65"
          />
          <text fill="var(--visual-slate)" fontFamily="var(--font-mono)" fontSize="5" x="45" y="75">
            Static Nav
          </text>

          {/* Main Content Area */}
          <rect
            fill="rgba(30, 37, 49, 0.4)"
            height="85"
            rx="2"
            stroke="none"
            width="182"
            x="98"
            y="65"
          />

          {/* Island 1: Navigation/Filter */}
          <rect
            fill="rgba(45, 138, 68, 0.15)"
            height="20"
            rx="4"
            stroke="var(--accent-forest)"
            strokeWidth="1.5"
            width="170"
            x="104"
            y="70"
          />
          <text fill="var(--accent-forest)" fontFamily="var(--font-mono)" fontSize="6" x="110" y="82">
            ISLAND (Interactive Filter)
          </text>

          {/* Static Paragraphs */}
          <rect fill="var(--visual-slate)" height="3" rx="1.5" width="150" x="104" y="98" />
          <rect fill="var(--visual-slate)" height="3" rx="1.5" width="130" x="104" y="105" />
          <rect fill="var(--visual-slate)" height="3" rx="1.5" width="160" x="104" y="112" />

          {/* Island 2: Heavy Chart */}
          <rect
            fill="rgba(45, 138, 68, 0.15)"
            height="22"
            rx="4"
            stroke="var(--accent-forest)"
            strokeWidth="1.5"
            width="170"
            x="104"
            y="122"
          />
          <text fill="var(--accent-forest)" fontFamily="var(--font-mono)" fontSize="6" x="110" y="135">
            ISLAND (Lazy Chart)
          </text>
        </svg>
      );
    case 'css-animations-architecture':
      return (
        <svg aria-hidden="true" className="concept-illustration" viewBox="0 0 320 180">
          {/* Animated path representing a wave/flow */}
          <path
            d="M40 90 Q80 40 120 90 T200 90 T280 90"
            fill="none"
            stroke="var(--accent-pink)"
            strokeDasharray="8 4"
            strokeWidth="3"
          />
          {/* Moving particles/dots along the path */}
          <circle cx="80" cy="65" fill="var(--accent-pink)" r="6" />
          <circle cx="160" cy="90" fill="var(--accent-pink-soft)" r="8" stroke="var(--accent-pink)" strokeWidth="1" />
          <circle cx="240" cy="115" fill="var(--accent-pink)" r="6" />

          {/* Core frame */}
          <rect
            fill="rgba(30, 37, 49, 0.96)"
            height="100"
            rx="12"
            stroke="var(--visual-blue)"
            strokeWidth="2"
            width="140"
            x="90"
            y="40"
          />
          <text
            fill="var(--accent-pink)"
            fontFamily="var(--font-mono)"
            fontSize="10"
            textAnchor="middle"
            x="160"
            y="95"
          >
            ANIMATIONS
          </text>

          {/* Decorative floating elements */}
          <rect
            fill="var(--visual-orange)"
            height="20"
            rx="4"
            transform="rotate(15 250 50)"
            width="20"
            x="240"
            y="40"
          />
          <rect
            fill="var(--visual-blue-soft)"
            height="15"
            rx="2"
            transform="rotate(-20 50 130)"
            width="15"
            x="40"
            y="120"
          />
        </svg>
      );
    case 'partial-hydration-triggers':
      return (
        <svg aria-hidden="true" className="concept-illustration" viewBox="0 0 320 125">
          <rect
            fill="rgba(30, 37, 49, 0.96)"
            height="90"
            rx="6"
            stroke="var(--visual-slate)"
            strokeDasharray="2 2"
            strokeWidth="1"
            width="110"
            x="18"
            y="18"
          />
          <text fill="var(--visual-white)" fontFamily="var(--font-mono)" fontSize="8" x="28" y="34">
            components
          </text>
          <rect
            fill="rgba(31, 139, 143, 0.18)"
            height="22"
            rx="4"
            stroke="var(--accent-teal)"
            strokeWidth="1.5"
            width="90"
            x="28"
            y="42"
          />
          <text fill="var(--accent-teal)" fontFamily="var(--font-mono)" fontSize="7" x="36" y="56">
            Navigation
          </text>
          <text fill="var(--visual-white)" fontFamily="var(--font-body)" fontSize="6" x="36" y="63">
            on: init
          </text>
          <rect
            fill="rgba(242, 145, 61, 0.18)"
            height="22"
            rx="4"
            stroke="var(--visual-orange)"
            strokeWidth="1.5"
            width="90"
            x="28"
            y="72"
          />
          <text fill="var(--visual-orange)" fontFamily="var(--font-mono)" fontSize="7" x="36" y="86">
            SearchFilter
          </text>
          <text fill="var(--visual-white)" fontFamily="var(--font-body)" fontSize="6" x="36" y="93">
            on: in-viewport
          </text>

          <path
            d="M128 53 H168"
            fill="none"
            stroke="var(--accent-teal)"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <path d="M168 53 L160 49 M168 53 L160 57" fill="none" stroke="var(--accent-teal)" strokeWidth="2" />
          <path
            d="M128 83 H168"
            fill="none"
            stroke="var(--visual-orange)"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <path d="M168 83 L160 79 M168 83 L160 87" fill="none" stroke="var(--visual-orange)" strokeWidth="2" />

          <rect
            fill="rgba(255, 255, 255, 0.04)"
            height="90"
            rx="6"
            stroke="var(--visual-slate)"
            strokeWidth="1"
            width="126"
            x="176"
            y="18"
          />
          <text fill="var(--visual-white)" fontFamily="var(--font-mono)" fontSize="8" x="186" y="34">
            DOM wrappers
          </text>
          <rect
            fill="rgba(255, 255, 255, 0.05)"
            height="24"
            rx="4"
            stroke="var(--visual-slate)"
            strokeWidth="1"
            width="106"
            x="186"
            y="42"
          />
          <text fill="var(--visual-white)" fontFamily="var(--font-body)" fontSize="6.5" x="194" y="52">
            data-component=
          </text>
          <text fill="var(--accent-teal)" fontFamily="var(--font-mono)" fontSize="6.5" x="194" y="61">
            "Navigation"
          </text>
          <rect
            fill="rgba(255, 255, 255, 0.05)"
            height="24"
            rx="4"
            stroke="var(--visual-slate)"
            strokeWidth="1"
            width="106"
            x="186"
            y="72"
          />
          <text fill="var(--visual-white)" fontFamily="var(--font-body)" fontSize="6.5" x="194" y="82">
            data-component=
          </text>
          <text fill="var(--visual-orange)" fontFamily="var(--font-mono)" fontSize="6.5" x="194" y="91">
            "SearchFilter"
          </text>

          <rect
            fill="var(--accent-teal)"
            height="12"
            rx="6"
            width="34"
            x="214"
            y="8"
          />
          <text fill="var(--visual-white)" fontFamily="var(--font-mono)" fontSize="6" textAnchor="middle" x="231" y="16">
            init
          </text>
          <rect
            fill="var(--visual-orange)"
            height="12"
            rx="6"
            width="58"
            x="248"
            y="8"
          />
          <text fill="rgba(30, 37, 49, 0.96)" fontFamily="var(--font-mono)" fontSize="6" textAnchor="middle" x="277" y="16">
            in-viewport
          </text>
        </svg>
      );
    case 'status-quo-leaf':
      return (
        <svg aria-hidden="true" className="concept-illustration" viewBox="0 0 320 125">
          <rect
            fill="rgba(30, 37, 49, 0.96)"
            height="100"
            rx="4"
            stroke="var(--visual-slate)"
            strokeDasharray="2 2"
            strokeWidth="1"
            width="280"
            x="20"
            y="15"
          />
          <rect
            fill="rgba(31, 139, 143, 0.15)"
            height="60"
            rx="30"
            stroke="var(--accent-teal)"
            strokeWidth="2"
            width="60"
            x="130"
            y="35"
          />
          <text fill="var(--accent-teal)" fontFamily="var(--font-mono)" fontSize="10" x="135" y="70" textAnchor="middle" transform="rotate(-90 135,70) translate(-30, 0)">
            ISLAND
          </text>
          <circle cx="160" cy="65" fill="var(--visual-orange)" r="10" />
          <path
            d="M160 65 L180 45 M160 65 L180 85 M160 65 L140 45 M160 65 L140 85"
            fill="none"
            stroke="var(--visual-white)"
            strokeWidth="1.5"
          />
        </svg>
      );
    default:
      return null;
  }
}

export function ConceptGrid({ items }: ConceptGridProps) {
  return (
    <div className={`concept-grid${items.length === 1 ? ' is-single-item' : ''}`}>
      {items.map((item) => {
        const content = (
          <>
            <div className="concept-card-visual">
              <ConceptIllustration visual={item.visual} />
            </div>
            <div className="concept-card-body">
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          </>
        );

        if (item.link) {
          return (
            <NavLink className="concept-card is-link" key={item.title} to={item.link}>
              {content}
            </NavLink>
          );
        }

        return (
          <article className="concept-card" key={item.title}>
            {content}
          </article>
        );
      })}
    </div>
  );
}
