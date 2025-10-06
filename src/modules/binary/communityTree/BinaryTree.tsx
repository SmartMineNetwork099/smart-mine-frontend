'use client';
import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { Button } from "rizzui/button";
import Model from "@/components/Model";
import SingleUserData from "@/modules/binary/communityTree/SingleUserData";
import { getBinaryTree } from "@/apis/binaryApis";
import { getUserIdFromWallet } from "@/utils/walletHelpers";
import { toast } from "react-toastify";
import Loading from "@/components/Loading";

interface TreeNode {
  id: string;
  children: TreeNode[];
}
// const sampleData: TreeNode = {
//   id: "752058",
//   children: [
//     {
//       id: "752415",
//       children: [
//         { id: "752500", children: [{ id: "111111", children: [] }, { id: "222222", children: [] }] },
//         { id: "752501", children: [{ id: "333333", children: [] }, { id: "444444", children: [] }] },
//       ],
//     },
//     {
//       id: "904658",
//       children: [
//         { id: "904659", children: [{ id: "555555", children: [] }, { id: "666666", children: [] }] },
//         { id: "904660", children: [{ id: "777777", children: [] }, { id: "888888", children: [] }] },
//       ],
//     },
//   ],
// };

// 🔹 Reusable Node

const UserNode = ({ id, onClickModel, onClickTree }: { id: string; onClickModel?: () => void; onClickTree?: () => void }) => {
  const [modelOpen, setModelOpen] = useState(false);
  return (
    <>
      <div className="flex flex-col items-center cursor-pointer" >
        <div className="w-5 sm:w-12 h-5 sm:h-12 rounded-full bg-gray-900 border-4 border-yellow-400 flex items-center justify-center z-10">
          <svg
            onClick={onClickModel ? onClickModel : () => setModelOpen(true)}
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 sm:w-6 h-4 sm:h-6 text-yellow-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26z" />
          </svg>
        </div>
        <p className="text-cyan-400 mt-1 text-xs sm:text-sm font-mono font-semibold"> {id ? id.slice(-4) : "----"}</p>
        <Button className="flex items-center justify-center gap-1 text-black bg-green-500 border-0 !py-1 !px-2 mt-2" onClick={onClickTree}> <IoIosArrowDown /></Button>
      </div>
      {modelOpen && (
        <Model isOpen={modelOpen} onClose={() => setModelOpen(false)} title={`User Detail`} className="" size='lg'>
          <SingleUserData id={id}/>
        </Model>
      )}

    </>
  )
};

// Level 2 Nodes
const LevelTwoNode = ({ data, onNodeClick }: { data?: TreeNode[]; onNodeClick: (node: TreeNode) => void }) => (
  <div className="flex justify-center space-x-8 sm:space-x-16 relative">
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[4.6rem] sm:w-[7.1rem] h-0.5 bg-green-500 z-0" />
    {data?.map((child) => (
      <div key={child.id} className="flex flex-col items-center relative">
        <div className="h-6 w-0.5 bg-green-500 mb-1 z-10"></div>
        <UserNode id={child.id} onClickTree={() => onNodeClick(child)} />
      </div>
    ))}
  </div>
);

// Level 1 Nodes
const LevelOneNode = ({ node, onNodeClick }: { node?: TreeNode | null; onNodeClick: (node: TreeNode) => void }) => {
  // Defensive: if node is null/undefined, render nothing (prevents reading `.id` of null)
  if (!node) return null;

  return (
    <div className="flex flex-col items-center">
      <UserNode id={node.id} onClickTree={() => onNodeClick(node)} />
      {
        node?.children?.length > 0 &&
        <>
          <div className="h-6 w-0.5 bg-red-500 z-10"></div>
          <div className="flex justify-center space-x-4 sm:space-x-20 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[130px] sm:w-[240px] h-0.5 bg-green-500 z-0" />
            {node.children?.map((child) => (
              <div key={child.id} className="flex flex-col items-center relative">
                <div className="h-6 w-0.5 bg-green-500 mb-1 z-10"></div>
                <UserNode id={child.id} onClickTree={() => onNodeClick(child)} />
                {
                  child.children?.length > 0 &&
                  <>
                    <div className="h-6 w-0.5 bg-red-500 z-10"></div>
                    <LevelTwoNode data={child.children} onNodeClick={onNodeClick} />
                  </>
                }
              </div>
            ))}
          </div>
        </>
      }
    </div>
  )
};

// 🔹 Main Tree
const BinaryTree = () => {
  const [rootNode, setRootNode] = useState<TreeNode | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleNodeClick = (node: TreeNode) => {
    setRootNode(node); // Show only clicked node's subtree
  };

  const getBinaryTreeData = async ( ) =>{
    setLoading(true)
    const userId = getUserIdFromWallet()
    const data = await getBinaryTree(userId || '');
    console.log(data?.data?.success, 'tree_successsuccesssuccess')
    console.log(data?.data?.tree, 'tree_dataaaaaaa123321')
    if(data?.data?.success){
      setRootNode(data?.data?.tree || null)
    }
    if(data?.error){
      setRootNode(null)
      toast.error(data?.error)
    }
    setLoading(false)
  }
  useEffect(() => {
    getBinaryTreeData()
  }, [])
  console.log(rootNode, 'rootNoderootNode')

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <h1 className="text-xl sm:text-2xl text-green-500 font-bold mb-4">Community Tree</h1>
      {/* Render tree, loader, or empty message */}
      {loading ? (
        <div>
          <Loading />
        </div>
      ) : rootNode ? (
        <LevelOneNode node={rootNode} onNodeClick={handleNodeClick} />
      ) : (
        <p className="text-gray-400">No data available.</p>
      )}
    </div>
  );
};

export default BinaryTree;
