export { cn, generateUuid } from './utils';
export { reduceSaturation } from './colors.utils';
export {
  TEXT_ANIMATION_CONFIG,
  textAppearConfig,
  textDisappearConfig,
  animateTextAppear,
  animateTextDisappear,
} from './animations.utils';
export { AnimatedText } from './animated-text';

// Re-export colors from CommonJS module
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { colors } = require('./colors.config.js');
export { colors };
