'use client';
import React, { useState } from "react";

interface TreeNode {
  id: string;
  children: TreeNode[];
}

const sampleData: TreeNode = {
  id: "752058",
  children: [
    {
      id: "752415",
      children: [
        { id: "752500", children: [{ id: "111111", children: [] }, { id: "222222", children: [] }] },
        { id: "752501", children: [{ id: "333333", children: [] }, { id: "444444", children: [] }] },
      ],
    },
    {
      id: "904658",
      children: [
        { id: "904659", children: [{ id: "555555", children: [] }, { id: "666666", children: [] }] },
        { id: "904660", children: [{ id: "777777", children: [] }, { id: "888888", children: [] }] },
      ],
    },
  ],
};

// 🔹 Reusable Node
const UserNode = ({ id, onClick }: { id: string; onClick?: () => void }) => (
  <div className="flex flex-col items-center cursor-pointer" onClick={onClick}>
    <div className="w-5 sm:w-10 h-5 sm:h-10 sm:w-12 sm:h-12 rounded-full bg-gray-900 border-4 border-yellow-400 flex items-center justify-center z-10">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 sm:w-6 h-4 sm:h-6 text-yellow-300"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26z" />
      </svg>
    </div>
    <p className="text-cyan-400 mt-1 text-xs sm:text-sm font-mono font-semibold">{id}</p>
  </div>
);

// 🔸 Level 2 Nodes
const LevelTwoNode = ({ data, onNodeClick }: { data: TreeNode[]; onNodeClick: (node: TreeNode) => void }) => (
  <div className="flex justify-center space-x-8 sm:space-x-16 relative">
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[4.6rem] sm:w-[7.1rem] h-0.5 bg-green-500 z-0" />
    {data?.map((child) => (
      <div key={child.id} className="flex flex-col items-center relative">
        <div className="h-6 w-0.5 bg-green-500 mb-1 z-10"></div>
        <UserNode id={child.id} onClick={() => onNodeClick(child)} />
      </div>
    ))}
  </div>
);

// 🔸 Level 1 Nodes
const LevelOneNode = ({ node, onNodeClick }: { node: TreeNode; onNodeClick: (node: TreeNode) => void }) => (
  <div className="flex flex-col items-center">
    <UserNode id={node.id} onClick={() => onNodeClick(node)} />
    <div className="h-6 w-0.5 bg-red-500 z-10"></div>
    <div className="flex justify-center space-x-4 sm:space-x-20 relative">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[8rem] sm:w-[15rem] h-0.5 bg-green-500 z-0" />
      {node.children?.map((child) => (
        <div key={child.id} className="flex flex-col items-center relative">
          <div className="h-6 w-0.5 bg-green-500 mb-1 z-10"></div>
          <UserNode id={child.id} onClick={() => onNodeClick(child)} />
          <div className="h-6 w-0.5 bg-red-500 z-10"></div>
          <LevelTwoNode data={child.children} onNodeClick={onNodeClick} />
        </div>
      ))}
    </div>
  </div>
);

// 🔹 Main Tree
const BinaryTree = () => {
  const [rootNode, setRootNode] = useState<TreeNode>(sampleData);

  const handleNodeClick = (node: TreeNode) => {
    setRootNode(node); // Show only clicked node's subtree
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <h1 className="text-xl sm:text-2xl text-green-500 font-bold mb-4">Community Tree</h1>
      <LevelOneNode node={rootNode} onNodeClick={handleNodeClick} />
    </div>
  );
};

export default BinaryTree;
