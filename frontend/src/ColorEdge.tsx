import { useState, memo } from 'react';
import { getSmoothStepPath, getBezierPath, getStraightPath, type EdgeProps } from '@xyflow/react';
import { motion } from 'framer-motion';
import { useAppViewModel } from './viewmodels/useAppViewModel';
import { useSettingsViewModel } from './viewmodels/useSettingsViewModel';

const ColorEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
}: EdgeProps) => {
  const [hovered, setHovered] = useState(false);
  const { accentColor } = useAppViewModel();
  const { edgeType, edgePattern } = useSettingsViewModel();

  const pathParams = {
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  };

  const [edgePath] = edgeType === 'step' 
    ? getSmoothStepPath({ ...pathParams, borderRadius: 20 })
    : edgeType === 'straight' 
    ? getStraightPath(pathParams)
    : getBezierPath(pathParams);

  const baseColor = style.stroke || '#404040';
  
  return (
    <>
      <motion.path
        id={id}
        d={edgePath}
        initial={false}
        animate={{ 
          d: edgePath,
          stroke: selected ? accentColor : (hovered ? '#737373' : baseColor),
          strokeWidth: selected ? 6 : (hovered ? 5 : 3),
          opacity: selected || hovered ? 1 : 0.6,
          strokeDasharray: edgePattern === 'dashed' ? '8, 8' : 'none'
        }}
        transition={{ 
          d: { type: 'tween', ease: 'easeOut', duration: 0.1 },
          stroke: { duration: 0.2 },
          strokeWidth: { duration: 0.2 },
          opacity: { duration: 0.2 },
        }}
        style={{
          fill: 'none',
          cursor: 'pointer'
        }}
        markerEnd={markerEnd}
      />

      {/* Invisible interaction path */}
      <motion.path
        d={edgePath}
        animate={{ d: edgePath }}
        transition={{ 
          d: { type: 'tween', ease: 'easeOut', duration: 0.1 }
        }}
        fill="none"
        stroke="transparent"
        strokeWidth={25}
        style={{ cursor: 'pointer' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
    </>
  );
});

export default ColorEdge;
