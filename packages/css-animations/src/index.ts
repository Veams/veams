export const ANIMATIONS = {
  IN_OUT: {
    CAROUSEL: {
      ROTATE_BOTTOM_IN: 'carousel-rotate-bottom-in',
      ROTATE_BOTTOM_OUT: 'carousel-rotate-bottom-out',
      ROTATE_LEFT_IN: 'carousel-rotate-left-in',
      ROTATE_LEFT_OUT: 'carousel-rotate-left-out',
      ROTATE_RIGHT_IN: 'carousel-rotate-right-in',
      ROTATE_RIGHT_OUT: 'carousel-rotate-right-out',
      ROTATE_TOP_IN: 'carousel-rotate-top-in',
      ROTATE_TOP_OUT: 'carousel-rotate-top-out',
    },
    CUBE: {
      ROTATE_BOTTOM_IN: 'cube-rotate-bottom-in',
      ROTATE_BOTTOM_OUT: 'cube-rotate-bottom-out',
      ROTATE_LEFT_IN: 'cube-rotate-left-in',
      ROTATE_LEFT_OUT: 'cube-rotate-left-out',
      ROTATE_RIGHT_IN: 'cube-rotate-right-in',
      ROTATE_RIGHT_OUT: 'cube-rotate-right-out',
      ROTATE_TOP_IN: 'cube-rotate-top-in',
      ROTATE_TOP_OUT: 'cube-rotate-top-out',
    },
    FALL: {
      ROTATE_FALL: 'fall-rotate',
    },
    FLIP: {
      OUT_RIGHT: 'flip-right-out',
      IN_LEFT: 'flip-left-in',
      OUT_LEFT: 'flip-left-out',
      IN_RIGHT: 'flip-right-in',
      OUT_TOP: 'flip-top-out',
      IN_BOTTOM: 'flip-bottom-in',
      OUT_BOTTOM: 'flip-bottom-out',
      IN_TOP: 'flip-top-in',
    },
    MOVE: {
      TO_LEFT: 'move-to-left',
      FROM_LEFT: 'move-from-left',
      TO_RIGHT: 'move-to-right',
      FROM_RIGHT: 'move-from-right',
      TO_TOP: 'move-to-top',
      FROM_TOP: 'move-from-top',
      TO_BOTTOM: 'move-to-bottom',
      FROM_BOTTOM: 'move-from-bottom',
      FADE: 'fade',
      TO_LEFT_FADE: 'move-to-left-fade',
      FROM_LEFT_FADE: 'move-from-left-fade',
      TO_RIGHT_FADE: 'move-to-right-fade',
      FROM_RIGHT_FADE: 'move-from-right-fade',
      TO_TOP_FADE: 'move-to-top-fade',
      FROM_TOP_FADE: 'move-from-top-fade',
      TO_BOTTOM_FADE: 'move-to-bottom-fade',
      FROM_BOTTOM_FADE: 'move-from-bottom-fade',
    },
    NEWSPAPER: {
      OUT: 'newspaper-rotate-out',
      IN: 'newspaper-rotate-in',
    },
    PUSH_PULL: {
      PUSH_LEFT: 'push-left-rotate',
      PUSH_RIGHT: 'push-right-rotate',
      PUSH_TOP: 'push-top-rotate',
      PUSH_BOTTOM: 'push-bottom-rotate',
      PULL_LEFT: 'pull-left-rotate',
      PULL_RIGHT: 'pull-right-rotate',
      PULL_TOP: 'pull-top-rotate',
      PULL_BOTTOM: 'pull-bottom-rotate',
    },
    ROOM: {
      ROTATE_LEFT_OUT: 'room-rotate-left-out',
      ROTATE_LEFT_IN: 'room-rotate-left-in',
      ROTATE_RIGHT_OUT: 'room-rotate-right-out',
      ROTATE_RIGHT_IN: 'room-rotate-right-in',
      ROTATE_TOP_OUT: 'room-rotate-top-out',
      ROTATE_TOP_IN: 'room-rotate-top-in',
      ROTATE_BOTTOM_OUT: 'room-rotate-bottom-out',
      ROTATE_BOTTOM_IN: 'room-rotate-bottom-in',
    },
    SIDES: {
      ROTATE_OUT: 'sides-rotate-out',
      ROTATE_IN: 'sides-rotate-in',
    },
    SLIDES: {
      ROTATE_OUT: 'slide-rotate-out',
      ROTATE_IN: 'slide-rotate-in',
    },
    FOLD: {
      BOTTOM: 'fold-bottom',
      LEFT: 'fold-left',
      RIGHT: 'fold-right',
      TOP: 'fold-top',
    },
    UNFOLD: {
      BOTTOM: 'unfold-bottom',
      LEFT: 'unfold-left',
      RIGHT: 'unfold-right',
      TOP: 'unfold-top',
    },
    ROTATE_AND_SCALE: {
      BOTTOM_FIRST: 'side-rotate-bottom-first',
      LEFT_FIRST: 'side-rotate-left-first',
      RIGHT_FIRST: 'side-rotate-right-first',
      TOP_FIRST: 'side-rotate-top-first',
    },
    SCALE: {
      DOWN: 'scale-down',
      UP: 'scale-up',
      DOWN_CENTER: 'scale-down-center',
      UP_CENTER: 'scale-up-center',
    },
  },
  FEEDBACK: {
    BORDER_SIMPLE: 'fb-border-simple',
    BORDER_MULTIPLE: 'fb-border-multiple',
    CIRCLE_SIMPLE: 'fb-circle-simple',
    CIRCLE_BIG: 'fb-circle-big',
    CIRCLE_REVERT: 'fb-circle-revert',
    CIRCLE_SHRINK: 'fb-circle-shrink',
    CIRCLE_DELAY: 'fb-circle-delay',
  },
} as const;

export type AnimationName =
  | (typeof ANIMATIONS.IN_OUT.CAROUSEL)[keyof typeof ANIMATIONS.IN_OUT.CAROUSEL]
  | (typeof ANIMATIONS.IN_OUT.CUBE)[keyof typeof ANIMATIONS.IN_OUT.CUBE]
  | (typeof ANIMATIONS.IN_OUT.FALL)[keyof typeof ANIMATIONS.IN_OUT.FALL]
  | (typeof ANIMATIONS.IN_OUT.FLIP)[keyof typeof ANIMATIONS.IN_OUT.FLIP]
  | (typeof ANIMATIONS.IN_OUT.MOVE)[keyof typeof ANIMATIONS.IN_OUT.MOVE]
  | (typeof ANIMATIONS.IN_OUT.NEWSPAPER)[keyof typeof ANIMATIONS.IN_OUT.NEWSPAPER]
  | (typeof ANIMATIONS.IN_OUT.PUSH_PULL)[keyof typeof ANIMATIONS.IN_OUT.PUSH_PULL]
  | (typeof ANIMATIONS.IN_OUT.ROOM)[keyof typeof ANIMATIONS.IN_OUT.ROOM]
  | (typeof ANIMATIONS.IN_OUT.SIDES)[keyof typeof ANIMATIONS.IN_OUT.SIDES]
  | (typeof ANIMATIONS.IN_OUT.SLIDES)[keyof typeof ANIMATIONS.IN_OUT.SLIDES]
  | (typeof ANIMATIONS.IN_OUT.FOLD)[keyof typeof ANIMATIONS.IN_OUT.FOLD]
  | (typeof ANIMATIONS.IN_OUT.UNFOLD)[keyof typeof ANIMATIONS.IN_OUT.UNFOLD]
  | (typeof ANIMATIONS.IN_OUT.ROTATE_AND_SCALE)[keyof typeof ANIMATIONS.IN_OUT.ROTATE_AND_SCALE]
  | (typeof ANIMATIONS.IN_OUT.SCALE)[keyof typeof ANIMATIONS.IN_OUT.SCALE]
  | (typeof ANIMATIONS.FEEDBACK)[keyof typeof ANIMATIONS.FEEDBACK];
