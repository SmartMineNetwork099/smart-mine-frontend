'use client';
import React, { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { Button } from "rizzui/button";
import Model from "@/components/Model";
import SingleUserData from "@/modules/binary/communityTree/SingleUserData";
import { getBinaryTree } from "@/apis/binaryApis";
import { getUserIdFromWallet } from "@/utils/walletHelpers";
import { toast } from "react-toastify";
import HashLoader from "@/components/HashLoader";
import { FaAngleLeft } from "react-icons/fa6";

interface TreeNode {
  id: string;
  nodeId: string;
  children: TreeNode[];
}

// ensure exactly two slots for binary layout (fills missing with null)
const ensureTwoSlots = (arr?: TreeNode[] | null) => {
  const slots: (TreeNode | null)[] = [];
  if (!arr || arr.length === 0) return [null, null];
  slots.push(arr[0] ?? null);
  slots.push(arr[1] ?? null);
  return slots;
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

const UserNode = ({ child , id, onClickModel, onClickTree, disabled = false }:any) => {
  const [modelOpen, setModelOpen] = useState(false);
  console.log(child, 'childchildchild')
  console.log(id, 'ididididididididididid')
  return (
    <>
      <div className={`flex flex-col items-center ${disabled ? 'cursor-default' : 'cursor-pointer'}`} >
        <div className={`w-5 sm:w-12 h-5 sm:h-12 rounded-full flex items-center justify-center z-10 ${disabled ? 'bg-gray-700 border-2 border-gray-500' : 'bg-gray-900 border-4 border-yellow-400'}`}>
          <svg
            onClick={!disabled ? (onClickModel ? onClickModel : () => setModelOpen(true)) : undefined}
            xmlns="http://www.w3.org/2000/svg"
            className={`w-4 sm:w-6 h-4 sm:h-6 ${disabled ? 'text-gray-400' : 'text-yellow-300'}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26z" />
          </svg>
        </div>
        <p className={`mt-1 text-xs sm:text-sm font-mono font-semibold ${disabled ? 'text-gray-400' : 'text-cyan-400'}`}> {child?.position ||  "----------"}</p>
        <Button
          className={`flex items-center justify-center gap-1 text-black bg-green-500 border-0 !py-1 !px-2 mt-2 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
          onClick={!disabled ? onClickTree : undefined}
          aria-disabled={disabled}
        >
          <IoIosArrowDown />
        </Button>
      </div>
      {modelOpen && (
        <Model isOpen={modelOpen} onClose={() => setModelOpen(false)} title={`User Detail`} className="" size='lg'>
          <SingleUserData id={id} position={child?.position}/>
        </Model>
      )}

    </>
  )
};

// Level 2 Nodes
const LevelTwoNode = ({ data, onNodeClick }: { data?: TreeNode[] | null; onNodeClick: (node: TreeNode) => void }) => {
  // always ensure exactly two slots so layout doesn't break when children are missing
  const slots = ensureTwoSlots(data);
  return (
    <div className="flex justify-center space-x-8 sm:space-x-16 relative">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[4.6rem] sm:w-[7.1rem] h-0.5 bg-green-500 z-0" />
      {slots.map((child, idx) => (
        <div key={idx} className="flex flex-col items-center relative">
          <div className="h-6 w-0.5 bg-green-500 mb-1 z-10"></div>
          {/* render placeholder nodes when child is null; arrow is disabled in that case */}
          <UserNode child={child} id={child?.nodeId} onClickTree={child ? () => onNodeClick(child) : undefined} disabled={!child} />
        </div>
      ))}
    </div>
  )
};

// Level 1 Nodes
const LevelOneNode = ({ node, onNodeClick }: { node?: TreeNode | null; onNodeClick: (node: TreeNode) => void }) => {
  // If node is null, still render placeholders to keep layout consistent
  console.log(node, 'nodenodenodenode')
  if (!node) {
    // render a placeholder center with two empty children
    return (
      <div className="flex flex-col items-center">
        <UserNode child={undefined} id={undefined} disabled={true} />
        <>
          <div className="h-6 w-0.5 bg-red-500 z-10"></div>
          <div className="flex justify-center space-x-4 sm:space-x-20 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[130px] sm:w-[240px] h-0.5 bg-green-500 z-0" />
            {ensureTwoSlots([])?.map((child, idx) => (
              <div key={idx} className="flex flex-col items-center relative">
                <div className="h-6 w-0.5 bg-green-500 mb-1 z-10"></div>
                <UserNode child={child} id={child?.nodeId} disabled={!child} />
              </div>
            ))}
          </div>
        </>
      </div>
    )
  }

  const slots = ensureTwoSlots(node.children);

  return (
    <div className="flex flex-col items-center">
      <UserNode child={node} id={node?.nodeId} onClickTree={() => onNodeClick(node)} />
      <>
        <div className="h-6 w-0.5 bg-red-500 z-10"></div>
        <div className="flex justify-center space-x-4 sm:space-x-20 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[130px] sm:w-[240px] h-0.5 bg-green-500 z-0" />
          {slots.map((child, idx) => {
            console.log(child, 'childchildchildchild1111')
            return(
            <div key={idx} className="flex flex-col items-center relative">
              <div className="h-6 w-0.5 bg-green-500 mb-1 z-10"></div>
              <UserNode child={child} id={child?.nodeId} onClickTree={child ? () => onNodeClick(child) : undefined} disabled={!child} />
              {
                // always render LevelTwoNode even if child exists but has no grandchildren
                // LevelTwoNode will render placeholders when necessary
                <>
                  <div className="h-6 w-0.5 bg-red-500 z-10"></div>
                  <LevelTwoNode data={child?.children || []} onNodeClick={onNodeClick} />
                </>
              }
            </div>
          )}
          )}
        </div>
      </>
    </div>
  )
};

// 🔹 Main Tree
const BinaryTree = () => {
  const [rootNode, setRootNode] = useState<TreeNode | null>(null);
  // stack to keep track of previous roots for "back" navigation
  const [historyStack, setHistoryStack] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
   // New states for search
  const [searchValue, setSearchValue] = useState<string>("");
  const [searchMode, setSearchMode] = useState(false);

  const handleNodeClick = (node: TreeNode) => {
    // push current root onto history stack so user can go back
    setHistoryStack(prev => (rootNode ? [...prev, rootNode] : prev));
    setRootNode(node); // Show only clicked node's subtree
  };

  const getBinaryTreeData = async (userId?: string ) =>{
    setLoading(true)
    const id = getUserIdFromWallet()
    const data = await getBinaryTree(id || '');
    console.log(data?.data?.success, 'tree_successsuccesssuccess')
    console.log(data?.data?.tree, 'tree_dataaaaaaa123321')
    if(data?.data?.success){
      setRootNode(data?.data?.tree || null)
      // reset history when loading fresh tree
      setHistoryStack([])
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
   // Search handler
  const handleSearch = () => {
    if (!searchValue.trim()) {
      setSearchMode(false);
      getBinaryTreeData();
    } else {
      setSearchMode(true);
      getBinaryTreeData(searchValue.trim());
    }
  }
  console.log(rootNode, 'rootNoderootNode')

  return (
    <div className="min-h-screen p-6 flex flex-col items-center">
      <h1 className="text-xl sm:text-2xl text-green-500 font-bold mb-4">Community Tree</h1>
       {/* Search input added */}
      <div className="flex gap-2 mb-4 w-full max-w-sm">
        <input
          type="number"
          placeholder="Enter User ID"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          className="flex-grow px-3 py-2 rounded border border-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-white"
        />
        <button
          onClick={handleSearch}
          className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Search
        </button>
      </div>

      {/* Back button shown when there is history to go back to */}
      {historyStack.length > 0 && (
        <div className="w-full flex justify-start mb-4">
          <button
            onClick={() => {
              // pop the last root from history and set it as current
              setHistoryStack(prev => {
                const copy = [...prev];
                const last = copy.pop();
                if (last) setRootNode(last);
                return copy;
              });
            }}
            className="flex items-center gap-2 text-sm text-black bg-yellow-400 border-0 px-3 py-1 rounded"
          >
            <FaAngleLeft  /> Back
          </button>
        </div>
      )}
      {/* Render tree, loader, or empty message */}
      {loading ? (
        <div>
          <HashLoader />
        </div>
      ) : rootNode ? (
        <LevelOneNode node={rootNode} onNodeClick={handleNodeClick} />
      ) : searchMode ? (
        <p className="text-gray-400 font-semibold">Tree Not Available for entered User ID</p>
      ) : (
        <p className="text-gray-400 font-semibold">No data available.</p>
      )}
    </div>
  );
};

export default BinaryTree;
