import { Item } from "rc-menu";
import { useEffect, useContext, useState, useMemo, useCallback, useRef } from "react";
import AppContext from "./appContext";
import Form from "./Components/Form";
import Sidebar from "./Components/Sidebar";
import ExtendedTree from './Components/Tree'
import { getNodes } from "./transportLayer";
import { NodeType } from "./types";

function App() {
  const [selectedItem, setSelectedItem] = useState<NodeType>(null);
  const [showEdit, setShowEdit] = useState(true);
  const [nodeToEdit, setNodeToEdit] = useState<NodeType>()
  const [treeData, setTreeData] = useState([]);
  const expandRef = useRef<React.Dispatch<React.SetStateAction<React.Key[]>>>()
  const nodeClipboard = useRef<NodeType>()

  const fetchTreeData = async () => {
    const result = await getNodes();
    setTreeData(result);
  }

  useEffect(() => {
    if (selectedItem) setNodeToEdit(undefined)
  }, [selectedItem])

  useEffect(() => {
    fetchTreeData()
  }, [])

  const onDeleteLeaf = (node: NodeType) => {
    if (node.children.length === 0) {
      const newTreeData = [...treeData]
      newTreeData.forEach(function iter(item, index, object) {
        if (item.key === node.key) {
          object.splice(index, 1);
          setTreeData(newTreeData)
        } (item.children || []).forEach(iter);
      });
    } else {
      console.log('please choose a leaft')
    }
  }

  const onPasteLeaf = (node: NodeType) => {
    if (nodeClipboard.current) {
      const newTreeData = [...treeData]
      newTreeData.forEach(function iter(item, index, objects) {
        if (item.children.length === 0 && item.key === nodeClipboard.current.key) {
          objects.splice(index, 1);
          nodeClipboard.current.parentKey = node.key
          // @ts-ignore
          nodeClipboard.current.hierarchy = [...node.hierarchy, nodeClipboard.current.key]
          node.children.unshift(nodeClipboard.current)
          nodeClipboard.current = undefined
          setTreeData(newTreeData)
        } (item.children || []).forEach(iter);
      });
    } else {
      console.log('no node to paste')
    }
  }

  const handleContextMenuClick = (actionKey: any, node?: NodeType) => {
    switch (actionKey) {
      case 'ACTION1':
        setSelectedItem(node)
        break;
      case 'ACTION2':
        nodeClipboard.current = node
        break;
      case 'ACTION3':
        onPasteLeaf(node)
        break;
      case 'ACTION4':
        onDeleteLeaf(node)
        break;
    }
  }

  const handleUpdateTree = (nodes: NodeType[]) => {

  }

  const handleUpdateNode = (key: string, data: NodeType, type: 'save' | 'edit'): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const newTreeData = [...treeData]
      if (type === 'edit') {
        newTreeData.forEach(function iter(item: NodeType, index, objects) {
          if (item.key === nodeToEdit.key) {
            item = Object.assign(item, data)
            setTreeData(newTreeData)
            setNodeToEdit(undefined)
          } (item.children || []).forEach(iter);
        })
        resolve(true)
      } else if (selectedItem) {
        newTreeData.forEach(function iter(item: NodeType, index, objects) {
          if (item.key === selectedItem.key) {
            data.parentKey = selectedItem.key
            data.children = []
            data.hierarchy = item.hierarchy.length ? [...item.hierarchy, data.key] : [item.key, key]
            item.children.unshift(data)
            setTreeData(newTreeData)
          } (item.children || []).forEach(iter);
        })
        setSelectedItem(undefined)
        resolve(true)
      } else {
        console.log('please first choose the parent')
        reject()
      }
    })
  }

  const onSelectNodeToEdit = (node: NodeType) => {
    setNodeToEdit(node)
  }

  return (
    <AppContext.Provider
      value={{
        treeData,
        updateTreeData: handleUpdateTree
      }}
    >
      <div className="App">
        <Sidebar>
          <ExtendedTree handleContextMenuClick={handleContextMenuClick} setExpandRef={expandRef} setNodeToEdit={onSelectNodeToEdit} activeNode={nodeToEdit?.key} />
        </Sidebar>
        {showEdit && <Form item={selectedItem} updateNode={handleUpdateNode} nodeToEdit={nodeToEdit} />}
      </div>
    </AppContext.Provider>
  );
}

export default App;
