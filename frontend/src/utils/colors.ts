import type { Node, Edge } from '@xyflow/react';

export const getSourceColor = (nodeId: string, currentNodes: Node[], currentEdges: Edge[], visited = new Set<string>()): string[] => {
  if (visited.has(nodeId)) return [];
  visited.add(nodeId);
  const node = currentNodes.find(n => n.id === nodeId);
  if (!node) return [];
  if (node.type === 'colorNode' && node.data.color) {
    const upstreamColors: string[] = [];
    const incoming = currentEdges.filter(e => e.target === nodeId);
    incoming.forEach(e => upstreamColors.push(...getSourceColor(e.source, currentNodes, currentEdges, new Set(visited))));
    return [node.data.color as string, ...upstreamColors];
  }
  if (node.type === 'logNode' || node.type === 'startNode') {
    const upstreamColors: string[] = [];
    const incoming = currentEdges.filter(e => e.target === nodeId);
    incoming.forEach(e => upstreamColors.push(...getSourceColor(e.source, currentNodes, currentEdges, new Set(visited))));
    return upstreamColors;
  }
  return [];
};

export const mixColors = (hexColors: string[]): string => {
  if (hexColors.length === 0) return '#404040';
  if (hexColors.length === 1) return hexColors[0];
  let r = 0, g = 0, b = 0;
  hexColors.forEach(hex => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (result) {
      r += parseInt(result[1], 16); g += parseInt(result[2], 16); b += parseInt(result[3], 16);
    }
  });
  const count = hexColors.length;
  const toHex = (n: number) => Math.round(n / count).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

/** Converts 0-255 RGB channels to a hex color string. */
export const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};

/** Converts 0-255 RGB channels to HSL (degrees, %, %) rounded values. */
export const rgbToHsl = (
  r: number,
  g: number,
  b: number
): { h: number; s: number; l: number } => {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = (gn - bn) / d + (gn < bn ? 6 : 0); break;
      case gn: h = (bn - rn) / d + 2; break;
      case bn: h = (rn - gn) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
};
