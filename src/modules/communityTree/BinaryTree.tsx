import React, { useState } from "react";
interface TreeNode {
  id: string;
  children: TreeNode[];
}

const sampleData = {
  id: "752058",
  children: [
    {
      id: "752415",
      children: [
        { id: "752500", children: [] },
        { id: "752501", children: [] },
      ],
    },
    {
      id: "904658",
      children: [
        { id: "904659", children: [] },
        { id: "904660", children: [] },
      ],
    },
  ],
};

// 🔹 Reusable node component (with circle and ID)
const UserNode = ({ id }: { id: string }) => (
  <div className="flex flex-col items-center">
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

// 🔸 Level 2 component (for grandchildren)
const LevelTwoNode = ({ data }: { data: TreeNode[] }) => (
  <div className="flex justify-center space-x-8 sm:space-x-16 relative">
    {/* Horizontal line */}
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[4.6rem] sm:w-[7.1rem] h-0.5 bg-green-500 z-0 overflow-hidden" />

    {data?.map((child) => (
      <div key={child?.id} className="flex flex-col items-center relative">
        {/* Green vertical line */}
        <div className="h-6 w-0.5 bg-green-500 mb-1 z-10"></div>
        <UserNode id={child?.id} />
      </div>
    ))}
  </div>
);

// 🔸 Level 1 component (for direct children)
const LevelOneNode = ({ node }: { node: TreeNode }) => (
  <div className="flex flex-col items-center">
    {/* Parent Node */}
    <UserNode id={node?.id} />

    {/* Red vertical line */}
    <div className="h-6 w-0.5 bg-red-500 z-10"></div>

    {/* Children Container */}
    <div className="flex justify-center space-x-4 sm:space-x-20 relative">
      {/* Green horizontal line */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[8rem] sm:w-[15rem] h-0.5 bg-green-500 z-0 overflow-hidden" />

      {node?.children?.map((child: TreeNode) => (
        <div key={child?.id} className="flex flex-col items-center relative">
          {/* Green vertical line */}
          <div className="h-6 w-0.5 bg-green-500 mb-1 z-10"></div>
          <UserNode id={child?.id} />

          {/* Red vertical line to next level */}
          <div className="h-6 w-0.5 bg-red-500 z-10"></div>

          {/* Level 2 children */}
          <LevelTwoNode data={child?.children} />
        </div>
      ))}
    </div>
  </div>
);

// 🔹 Main Tree
const BinaryTree = () => {
  const [rootNode] = useState(sampleData);

  return (
    <div>
      {/* Level 1 + Level 2 */}
      <LevelOneNode node={rootNode} />
    </div>
  );
};

export default BinaryTree;
