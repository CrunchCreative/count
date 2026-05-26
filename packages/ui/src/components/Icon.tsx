import type { ReactElement } from 'react';
import Svg, { Circle, Line, Path, Polygon, Polyline, Rect } from 'react-native-svg';
import { colors } from '@count/tokens';

export type IconName =
  | 'chevron-left' | 'chevron-right' | 'chevron-up' | 'chevron-down'
  | 'bookmark' | 'search' | 'bell' | 'home' | 'calendar' | 'profile'
  | 'builders' | 'filter' | 'arrow-right' | 'arrow-left' | 'flag'
  | 'sparkles' | 'target' | 'card' | 'arrows-h' | 'bars' | 'check'
  | 'info' | 'plus' | 'corner' | 'x' | 'x-circle' | 'more' | 'close'
  | 'layers' | 'copy' | 'duplicate' | 'trash' | 'check-circle' | 'share';

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function Icon({
  name,
  size = 16,
  color = colors.text.primary,
  strokeWidth = 1.5,
}: IconProps): ReactElement | null {
  const common = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none' as const,
  };
  const svgProps = { width: size, height: size, viewBox: '0 0 24 24' };

  switch (name) {
    case 'chevron-left':
      return (
        <Svg {...svgProps}>
          <Polyline points="15 18 9 12 15 6" {...common} />
        </Svg>
      );
    case 'chevron-right':
      return (
        <Svg {...svgProps}>
          <Polyline points="9 18 15 12 9 6" {...common} />
        </Svg>
      );
    case 'chevron-down':
      return (
        <Svg {...svgProps}>
          <Polyline points="6 9 12 15 18 9" {...common} />
        </Svg>
      );
    case 'chevron-up':
      return (
        <Svg {...svgProps}>
          <Polyline points="6 15 12 9 18 15" {...common} />
        </Svg>
      );
    case 'bookmark':
      return (
        <Svg {...svgProps}>
          <Path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" {...common} />
        </Svg>
      );
    case 'search':
      return (
        <Svg {...svgProps}>
          <Circle cx="11" cy="11" r="8" {...common} />
          <Line x1="21" y1="21" x2="16.65" y2="16.65" {...common} />
        </Svg>
      );
    case 'bell':
      return (
        <Svg {...svgProps}>
          <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" {...common} />
          <Path d="M13.73 21a2 2 0 0 1-3.46 0" {...common} />
        </Svg>
      );
    case 'home':
      return (
        <Svg {...svgProps}>
          <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...common} />
          <Polyline points="9 22 9 12 15 12 15 22" {...common} />
        </Svg>
      );
    case 'calendar':
      return (
        <Svg {...svgProps}>
          <Rect x="3" y="4" width="18" height="18" rx="2" {...common} />
          <Line x1="16" y1="2" x2="16" y2="6" {...common} />
          <Line x1="8" y1="2" x2="8" y2="6" {...common} />
          <Line x1="3" y1="10" x2="21" y2="10" {...common} />
        </Svg>
      );
    case 'profile':
      return (
        <Svg {...svgProps}>
          <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" {...common} />
          <Circle cx="12" cy="7" r="4" {...common} />
        </Svg>
      );
    case 'builders':
      return (
        <Svg {...svgProps}>
          <Path d="M2 17l10 5 10-5" {...common} />
          <Path d="M2 12l10 5 10-5" {...common} />
          <Path d="M12 2L2 7l10 5 10-5z" {...common} />
        </Svg>
      );
    case 'filter':
      return (
        <Svg {...svgProps}>
          <Polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" {...common} />
        </Svg>
      );
    case 'arrow-right':
      return (
        <Svg {...svgProps}>
          <Line x1="5" y1="12" x2="19" y2="12" {...common} />
          <Polyline points="12 5 19 12 12 19" {...common} />
        </Svg>
      );
    case 'arrow-left':
      return (
        <Svg {...svgProps}>
          <Line x1="19" y1="12" x2="5" y2="12" {...common} />
          {/* Source atoms.jsx had "12 19 5 12 12 19" — duplicate first/last point only rendered the bottom arm. Corrected to mirror arrow-right. */}
          <Polyline points="12 5 5 12 12 19" {...common} />
        </Svg>
      );
    case 'flag':
      return (
        <Svg {...svgProps}>
          <Path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" {...common} />
          <Line x1="4" y1="22" x2="4" y2="15" {...common} />
        </Svg>
      );
    case 'sparkles':
      return (
        <Svg {...svgProps}>
          <Path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" {...common} />
          <Path d="M19 14l.7 2.3L22 17l-2.3.7L19 20l-.7-2.3L16 17l2.3-.7z" {...common} />
        </Svg>
      );
    case 'target':
      return (
        <Svg {...svgProps}>
          <Circle cx="12" cy="12" r="10" {...common} />
          <Circle cx="12" cy="12" r="6" {...common} />
          <Circle cx="12" cy="12" r="2" {...common} />
        </Svg>
      );
    case 'card':
      return (
        <Svg {...svgProps}>
          <Rect x="3" y="5" width="18" height="14" rx="2" {...common} />
        </Svg>
      );
    case 'arrows-h':
      return (
        <Svg {...svgProps}>
          <Polyline points="7 8 3 12 7 16" {...common} />
          <Polyline points="17 8 21 12 17 16" {...common} />
          <Line x1="3" y1="12" x2="21" y2="12" {...common} />
        </Svg>
      );
    case 'bars':
      return (
        <Svg {...svgProps}>
          <Line x1="3" y1="6" x2="21" y2="6" {...common} />
          <Line x1="3" y1="12" x2="21" y2="12" {...common} />
          <Line x1="3" y1="18" x2="21" y2="18" {...common} />
        </Svg>
      );
    case 'check':
      return (
        <Svg {...svgProps}>
          <Polyline points="20 6 9 17 4 12" {...common} />
        </Svg>
      );
    case 'info':
      return (
        <Svg {...svgProps}>
          <Circle cx="12" cy="12" r="10" {...common} />
          <Line x1="12" y1="16" x2="12" y2="12" {...common} />
          <Line x1="12" y1="8" x2="12.01" y2="8" {...common} />
        </Svg>
      );
    case 'plus':
      return (
        <Svg {...svgProps}>
          <Line x1="12" y1="5" x2="12" y2="19" {...common} />
          <Line x1="5" y1="12" x2="19" y2="12" {...common} />
        </Svg>
      );
    case 'corner':
      return (
        <Svg {...svgProps}>
          <Line x1="7" y1="22" x2="7" y2="3" {...common} />
          <Path d="M7 3l11 4-11 4" {...common} />
        </Svg>
      );
    case 'x':
      return (
        <Svg {...svgProps}>
          <Line x1="18" y1="6" x2="6" y2="18" {...common} />
          <Line x1="6" y1="6" x2="18" y2="18" {...common} />
        </Svg>
      );
    case 'x-circle':
      return (
        <Svg {...svgProps}>
          <Circle cx="12" cy="12" r="10" {...common} />
          <Line x1="15" y1="9" x2="9" y2="15" {...common} />
          <Line x1="9" y1="9" x2="15" y2="15" {...common} />
        </Svg>
      );
    case 'more':
      return (
        <Svg {...svgProps}>
          <Circle cx="12" cy="5" r="1" {...common} />
          <Circle cx="12" cy="12" r="1" {...common} />
          <Circle cx="12" cy="19" r="1" {...common} />
        </Svg>
      );
    case 'close':
      return (
        <Svg {...svgProps}>
          <Line x1="18" y1="6" x2="6" y2="18" {...common} />
          <Line x1="6" y1="6" x2="18" y2="18" {...common} />
        </Svg>
      );
    case 'layers':
      return (
        <Svg {...svgProps}>
          <Polygon points="12 2 2 7 12 12 22 7 12 2" {...common} />
          <Polyline points="2 17 12 22 22 17" {...common} />
          <Polyline points="2 12 12 17 22 12" {...common} />
        </Svg>
      );
    case 'copy':
      return (
        <Svg {...svgProps}>
          <Rect x="9" y="9" width="13" height="13" rx="2" {...common} />
          <Path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" {...common} />
        </Svg>
      );
    case 'duplicate':
      return (
        <Svg {...svgProps}>
          <Rect x="2" y="2" width="14" height="14" rx="2" {...common} />
          <Path d="M8 8h14v14H8z" {...common} />
        </Svg>
      );
    case 'trash':
      return (
        <Svg {...svgProps}>
          <Polyline points="3 6 5 6 21 6" {...common} />
          <Path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" {...common} />
          <Path d="M10 11v6" {...common} />
          <Path d="M14 11v6" {...common} />
        </Svg>
      );
    case 'check-circle':
      return (
        <Svg {...svgProps}>
          <Circle cx="12" cy="12" r="10" {...common} />
          <Polyline points="9 12 12 15 16 10" {...common} />
        </Svg>
      );
    case 'share':
      return (
        <Svg {...svgProps}>
          <Path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" {...common} />
          <Polyline points="16 6 12 2 8 6" {...common} />
          <Line x1="12" y1="2" x2="12" y2="15" {...common} />
        </Svg>
      );
    default:
      return null;
  }
}
