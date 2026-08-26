import type { PackagePage } from '../../../types';
import { partialHydrationDomExample } from './concepts.snippets';

export const conceptsPage: PackagePage = {
  blocks: [
    {
      callout:
        'The data-internal-ref and data-internal-id attributes are a fallback. They re-connect the data script with the component if the DOM changes before hydration. In standard setups, where the script tag stays right next to the wrapper, they are not needed.',
      codeExamples: [
        {
          code: partialHydrationDomExample,
          label: 'Generated DOM structure',
          language: 'html',
        },
      ],
      id: 'hydration-flow',
      paragraphs: [
        'The hydration process relies on two key HTML elements generated on the server: a hidden script tag containing the serialized props, and a wrapper div with a `data-component` attribute identifying the component.',
        'When the client-side loader encounters this structure and the activation trigger fires, it uses `data-component` to resolve the matching entry in `createHydration({ components })`, parses the JSON props, and hands control over to the defined render function.',
      ],
      title: 'DOM Architecture',
    },
    {
      bullets: [
        'Props Serialization: Metadata stays with the HTML.',
        'Lazy Activation: Download and run JS only when triggered.',
        'Stable Mapping: `data-component` must match the registered client component key.',
        'Stable Identity: useIsomorphicId ensures DOM consistency.',
      ],
      id: 'hydration-principles',
      paragraphs: [
        'Follow these principles and your application stays fast, accessible, and easy to maintain as it grows.',
      ],
      title: 'Core Principles',
    },
  ],
  eyebrow: 'Getting Started',
  id: 'concepts',
  intro:
    'Understand how selective component activation keeps your page fast while providing a rich user experience.',
  summary: 'Hydrate what matters, when it matters.',
  title: 'Concepts',
};
