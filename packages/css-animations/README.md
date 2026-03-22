# @veams/css-animations
[![npm version](https://img.shields.io/npm/v/@veams/css-animations)](https://www.npmjs.com/package/@veams/css-animations)

A collection of CSS animations for VEAMS.

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Usage](#usage)
   - [SCSS](#scss)
   - [CSS](#css)
   - [TypeScript/JavaScript](#typescriptjavascript)

## Overview

`@veams/css-animations` provides a set of animations that can be integrated into any project via SCSS, plain CSS, or TypeScript constants.

## Installation

```bash
npm install @veams/css-animations
```

## Usage

### SCSS

Import the main SCSS file:

```scss
@import "@veams/css-animations";
```

Or import specific animations, variables, or mixins:

```scss
@import "@veams/css-animations/animations/feedback-effects/fb-border-simple";
@import "@veams/css-animations/variables";
@import "@veams/css-animations/mixins";
```

### CSS

If you are not using Sass, you can import the pre-compiled CSS files:

```css
/* All animations */
@import "@veams/css-animations/dist/index.css";

/* Specific animation */
@import "@veams/css-animations/animations/feedback-effects/fb-border-simple.css";
```

### TypeScript/JavaScript

Use the provided constants for type-safe animation names:

```typescript
import { ANIMATIONS } from '@veams/css-animations';

const myAnimation = ANIMATIONS.FEEDBACK.BORDER_SIMPLE; // 'fb-border-simple'
```
