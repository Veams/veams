export type CodeExample = {
  code: string;
  description?: string;
  label: string;
  language: string;
};

export type FeatureCard = {
  description: string;
  link?: string;
  title: string;
  visual:
    | 'query-management'
    | 'form-feature-owner'
    | 'framework-core'
    | 'handle-command'
    | 'passive-snapshot'
    | 'swap-engine'
    | 'view-state'
    | 'methodology-regions'
    | 'methodology-components'
    | 'methodology-utilities'
    | 'methodology-layout'
    | 'status-quo-architecture'
    | 'query-architecture'
    | 'query-facade'
    | 'form-architecture'
    | 'form-ref-bridge'
    | 'vent-card-publish'
    | 'partial-hydration-architecture'
    | 'partial-hydration-triggers'
    | 'css-animations-architecture'
    | 'status-quo-leaf';
};

export type LiveExampleId =
  | 'status-quo-local-draft'
  | 'status-quo-singleton-workspace'
  | 'status-quo-composition-checklist'
  | 'status-quo-provider-wizard'
  | 'status-quo-selector-profile'
  | 'form-controlled-input'
  | 'form-simple-form'
  | 'form-nested-feature-form'
  | 'form-async-init'
  | 'form-feature-validation'
  | 'form-validation-mode'
  | 'vent-release-bus'
  | 'css-animations-showcase';

export type ContentBlock = {
  bullets?: string[];
  callout?: string;
  codeExamples?: CodeExample[];
  featureCards?: FeatureCard[];
  id: string;
  liveExample?: LiveExampleId;
  paragraphs: string[];
  title: string;
};

export type PackagePage = {
  blocks: ContentBlock[];
  eyebrow: string;
  featureCards?: FeatureCard[];
  heroBullets?: string[];
  heroImage?: string;
  heroParagraphs?: string[];
  id: string;
  intro: string;
  summary: string;
  title: string;
};

export type DocsNavSection = {
  id: string;
  pages: PackagePage[];
  title: string;
};

export type DocsPackage = {
  accent: string;
  description: string;
  githubPath?: string;
  id: string;
  npm?: string;
  sections: DocsNavSection[];
  title: string;
};
