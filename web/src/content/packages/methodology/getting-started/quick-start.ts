import type { PackagePage } from '../../../types';
import {
  methodologyClassNamingExample,
  methodologyDepthBadExample,
  methodologyDepthGoodExample,
} from './quick-start.snippets';

export const quickStartPage: PackagePage = {
  blocks: [
    {
      bullets: [
        'Every HTML element gets a class.',
        'Use a prefix to indicate the instrument (r-, c-, u-).',
        'Parent elements use the prefixed class.',
        'Child elements use the full parent class name + `__` + short element name.',
      ],
      id: 'principles',
      paragraphs: [
        'The naming is BEM-inspired and based on Regions, Components, and Utilities. The goal is clarity that lasts.',
      ],
      title: 'General Principles',
    },
    {
      codeExamples: [
        {
          code: methodologyClassNamingExample,
          label: 'Example snippet',
          language: 'html',
        },
      ],
      id: 'example',
      paragraphs: [
        'This example shows how parents and children are named so hierarchy and ownership stay clear.',
      ],
      title: 'Example snippet',
    },
    {
      codeExamples: [
        {
          code: methodologyDepthGoodExample,
          label: 'Do',
          language: 'html',
        },
        {
          code: methodologyDepthBadExample,
          label: 'Do not',
          language: 'html',
        },
      ],
      id: 'depth',
      paragraphs: [
        'Class names should only be one level deep (only one `__` segment). That keeps names readable and is enough to target a parent and its children.',
      ],
      title: 'One level of depth',
    },
  ],
  eyebrow: 'Getting Started',
  id: 'quick-start',
  intro: 'The naming system keeps classes clear, even as the project grows.',
  summary: 'Class patterns that stay calm.',
  title: 'Class Naming',
};
