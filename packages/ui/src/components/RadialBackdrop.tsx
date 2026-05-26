import type { ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { backdrop } from '@count/tokens';

type ColorTuple = readonly [string, string, ...string[]];
type LocationTuple = readonly [number, number, ...number[]];

const amberColors = backdrop.amberHalo.stops.map((s) => s.color) as unknown as ColorTuple;
const amberLocations = backdrop.amberHalo.stops.map((s) => s.offset) as unknown as LocationTuple;
const tealColors = backdrop.tealPool.stops.map((s) => s.color) as unknown as ColorTuple;
const tealLocations = backdrop.tealPool.stops.map((s) => s.offset) as unknown as LocationTuple;

// The CSS source uses two radial gradients. expo-linear-gradient is linear only.
// A top-anchored vertical linear gradient is a close visual approximation for the
// amber halo; an angled corner-to-centre gradient approximates the teal pool.
// If the approximation is unsatisfactory after review, the fallback is to ship two
// precomputed PNGs generated from the CSS gradients — defer that to a later phase.
export function RadialBackdrop(): ReactElement {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={amberColors}
        locations={amberLocations}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.75 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={tealColors}
        locations={tealLocations}
        start={{ x: 1, y: 1 }}
        end={{ x: 0.4, y: 0.4 }}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}
