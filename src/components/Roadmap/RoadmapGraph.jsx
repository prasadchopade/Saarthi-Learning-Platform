import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
  Handle,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Color palette for topics
const topicColors = [
  { bg: 'bg-purple-500', border: 'border-purple-600', text: 'text-purple-600', handle: '#8B5CF6' },
  { bg: 'bg-blue-500', border: 'border-blue-600', text: 'text-blue-600', handle: '#3B82F6' },
  { bg: 'bg-green-500', border: 'border-green-600', text: 'text-green-600', handle: '#10B981' },
  { bg: 'bg-pink-500', border: 'border-pink-600', text: 'text-pink-600', handle: '#EC4899' },
  { bg: 'bg-amber-500', border: 'border-amber-600', text: 'text-amber-600', handle: '#F59E0B' },
  { bg: 'bg-indigo-500', border: 'border-indigo-600', text: 'text-indigo-600', handle: '#6366F1' },
];

// Custom Node Components
const TopicNode = ({ data }) => {
  const colorIndex = (data.sequence - 1) % topicColors.length;
  const color = topicColors[colorIndex];
  
  return (
    <div className={`px-4 py-2 shadow-lg rounded-lg bg-white dark:bg-gray-800 border-2 ${color.border} transition-all duration-300 hover:shadow-xl`}>
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ background: color.handle }}
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        style={{ background: color.handle }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{ background: color.handle }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{ background: color.handle }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{ background: color.handle }}
      />
      <div className="flex items-center">
        <div className={`flex items-center justify-center w-7 h-7 mr-2 text-sm font-bold text-white ${color.bg} rounded-full transform hover:scale-110 transition-transform`}>
          {data.sequence}
        </div>
        <div className={`font-semibold ${color.text} dark:${color.text}`}>{data.label}</div>
      </div>
    </div>
  );
};

const SubtopicNode = ({ data, isSelected }) => {
  const colorIndex = (data.parentSequence - 1) % topicColors.length;
  const color = topicColors[colorIndex];
  const [isCompleted, setIsCompleted] = useState(data.isCompleted || false);
  
  const handleComplete = (e) => {
    e.stopPropagation(); // Prevent node selection when clicking the tick
    const newStatus = !isCompleted;
    setIsCompleted(newStatus);
    if (data.onComplete) {
      data.onComplete(newStatus);
    }
  };
  
  // Update local state when progress changes externally
  useEffect(() => {
    setIsCompleted(data.isCompleted || false);
  }, [data.isCompleted]);
  
  return (
    <div 
      className={`px-4 py-3 shadow-lg rounded-lg transition-all duration-200
        ${isSelected 
          ? `bg-${color.bg.split('-')[1]}-100 dark:bg-${color.bg.split('-')[1]}-900/30 border-2 ${color.border}` 
          : `bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:${color.border}`
        }`}
    >
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        style={{ background: color.handle }}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{ background: color.handle }}
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        style={{ background: color.handle }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{ background: color.handle }}
      />

      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-5 h-5 mr-2 text-xs font-medium text-white ${color.bg} rounded-full transform hover:scale-110 transition-transform`}>
            {data.sequence}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-gray-100">{data.label}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Duration: {data.duration || '2-3 hours'}
            </div>
          </div>
        </div>
        
        <button
          onClick={handleComplete}
          className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200 ${
            isCompleted 
              ? `${color.bg} text-white` 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-4 w-4" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

const nodeTypes = {
  topic: TopicNode,
  subtopic: SubtopicNode,
};

// Edge types with custom styling
const edgeTypes = {
  'step': { type: 'step', animated: true, style: { strokeWidth: 3 } },
  'smoothstep': { type: 'smoothstep', animated: true, style: { strokeWidth: 3 } },
  'straight': { type: 'straight', animated: false, style: { strokeWidth: 2 } },
};

const RoadmapGraph = ({ roadmap, onNodeSelect, progress = {}, onSubtopicComplete }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Transform roadmap data into nodes and edges
  useEffect(() => {
    if (!roadmap?.topics) return;

    const newNodes = [];
    const newEdges = [];
    let yOffset = 100;  // Start with some padding
    let xOffset = 250;  // Initial x position

    // Create topic nodes first with a zigzag pattern
    roadmap.topics.forEach((topic, topicIndex) => {
      const topicId = `topic-${topic._id}`;
      const isEvenIndex = topicIndex % 2 === 0;
      const topicX = isEvenIndex ? xOffset : xOffset + 150; // Zigzag pattern
      
      // Add topic node
      newNodes.push({
        id: topicId,
        type: 'topic',
        position: { x: topicX, y: yOffset },
        data: { 
          label: topic.name,
          type: 'topic',
          id: topic._id,
          sequence: topicIndex + 1
        },
      });

      // Add edge connecting to previous topic if it exists
      if (topicIndex > 0) {
        const prevTopicId = `topic-${roadmap.topics[topicIndex - 1]._id}`;
        const edgeType = topicIndex % 3 === 0 ? 'step' : (topicIndex % 3 === 1 ? 'smoothstep' : 'straight');
        const colorIndex = (topicIndex - 1) % topicColors.length;
        
        newEdges.push({
          id: `edge-topic-${prevTopicId}-${topicId}`,
          source: prevTopicId,
          target: topicId,
          sourceHandle: 'bottom',
          targetHandle: 'top',
          type: edgeType.type,
          animated: edgeType.animated,
          style: { 
            ...edgeType.style,
            stroke: topicColors[colorIndex].handle
          },
        });
      }
      
      // Calculate yOffset for next topic based on current topic's subtopics
      const subtopicsHeight = Math.ceil(topic.subtopics.length / 2) * 80; // Increased from 60 to 80
      yOffset += Math.max(200, subtopicsHeight + 120); // Increased minimum gap and padding
    });
    
    // Reset yOffset for subtopics
    yOffset = 100;
    
    // Now handle the subtopics with a staggered pattern
    roadmap.topics.forEach((topic, topicIndex) => {
      const topicId = `topic-${topic._id}`;
      const isEvenIndex = topicIndex % 2 === 0;
      const topicX = isEvenIndex ? xOffset : xOffset + 150;
      const leftX = topicX - 300;   // Left of topic node
      const rightX = topicX + 300;  // Right of topic node
      const colorIndex = topicIndex % topicColors.length;
      
      // Add subtopic nodes and connect to their parent topic
      topic.subtopics.forEach((subtopic, subtopicIndex) => {
        const subtopicId = `subtopic-${subtopic._id}`;
        const isEvenSub = subtopicIndex % 2 === 0;
        const x = isEvenSub ? rightX : leftX;
        // Position subtopics closer to main topic, using pairs for y-position
        const y = yOffset + 80 + (Math.floor(subtopicIndex / 2) * 80); // Increased from 60 to 80
        
        newNodes.push({
          id: subtopicId,
          type: 'subtopic',
          position: { x, y },
          data: { 
            label: subtopic.name,
            description: subtopic.description,
            type: 'subtopic',
            id: subtopic._id,
            sequence: subtopicIndex + 1,
            parentSequence: topicIndex + 1,
            topicName: topic.name,
            parentLabel: topic.name,
            duration: subtopic.duration,
            isCompleted: progress[subtopic._id],
            onComplete: (completed) => onSubtopicComplete?.(subtopic._id, completed)
          },
        });
        
        // Add edge from topic to subtopic with varying styles
        const edgeType = subtopicIndex % 3 === 0 ? 'smoothstep' : (subtopicIndex % 3 === 1 ? 'step' : 'straight');
        
        newEdges.push({
          id: `edge-${topicId}-${subtopicId}`,
          source: topicId,
          target: subtopicId,
          sourceHandle: isEvenSub ? 'right' : 'left',
          targetHandle: isEvenSub ? 'left' : 'right',
          type: edgeType.type,
          animated: edgeType.animated,
          style: { 
            ...edgeType.style,
            stroke: topicColors[colorIndex].handle
          },
        });
      });
      
      // Update yOffset for next topic's subtopics
      const subtopicsHeight = Math.ceil(topic.subtopics.length / 2) * 80; // Increased from 60 to 80
      yOffset += Math.max(200, subtopicsHeight + 120); // Increased minimum gap and padding
    });

    setNodes(newNodes);
    setEdges(newEdges);
  }, [roadmap, progress]);

  const onNodeClick = useCallback((event, node) => {
    if (onNodeSelect) {
      onNodeSelect(node);
    }
  }, [onNodeSelect]);

  return (
    <div className="h-full w-full border border-gray-200 dark:border-gray-700 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-right"
        defaultEdgeOptions={{
          type: 'smoothstep',
        }}
      >
        <Background variant="dots" gap={12} size={1} />
        <Controls />
        {/* <MiniMap className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md" /> */}
      </ReactFlow>
    </div>
  );
};

export default RoadmapGraph; 