export const cssAnimationsScssUsage = `// Use the full bundle (variables, mixins, and all animations)
@use "pkg:@veams/css-animations" as *;

// OR compose specific pieces for a smaller footprint
@use "pkg:@veams/css-animations/scss/variables.scss" as vars;
@use "pkg:@veams/css-animations/scss/animations/feedback-effects/fb-setup.scss" as *;
@use "pkg:@veams/css-animations/scss/animations/feedback-effects/fb-border-simple.scss" as *;

:root {
  @include vars.veams-root-vars;
}

.my-element {
  // Use the setup mixin for feedback animations (creates pseudo-element)
  @include fb-setup;
  
  // Apply the animation mixin
  @include fb-border-simple;
}

// Optional: emit the keyframes from a shared stylesheet
// @include fb-border-simple-keyframes();`;

export const cssAnimationsCssUsage = `/* Import the full compiled bundle */
@import "@veams/css-animations/index.css";

/* OR import specific compiled animations */
@import "@veams/css-animations/animations/feedback-effects/fb-border-simple.css";`;
