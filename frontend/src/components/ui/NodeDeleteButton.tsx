import React from 'react';
import { Trash2 } from 'lucide-react';
import { useFlowViewModel } from '../../viewmodels/useFlowViewModel';
import { useAppViewModel } from '../../viewmodels/useAppViewModel';

interface NodeDeleteButtonProps {
  nodeId: string;
}

export const NodeDeleteButton: React.FC<NodeDeleteButtonProps> = ({ nodeId }) => {
  const { deleteNode } = useFlowViewModel();
  const { accentColor } = useAppViewModel();

  return (
    <button
      onClick={(e) => { e.stopPropagation(); deleteNode(nodeId); }}
      style={{
        position: 'absolute',
        top: '-12px',
        right: '-12px',
        width: '24px',
        height: '24px',
        background: accentColor,
        border: 'none',
        borderRadius: '50%',
        color: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: `0 4px 10px ${accentColor}4d`,
        zIndex: 10
      }}
      title="Delete Node"
    >
      <Trash2 size={12} />
    </button>
  );
};
