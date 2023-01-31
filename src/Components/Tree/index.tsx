import { Input, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import React, { Dispatch, Key, memo, MutableRefObject, SetStateAction, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AppContext from '../../appContext';
import { NodeType } from '../../types';
import Node from './node';
import SearchResult from './searchResult';

const { Search } = Input;

interface Props {
  handleContextMenuClick: (key: string) => void;
  setExpandRef?: MutableRefObject<Dispatch<SetStateAction<React.Key[]>>>;
  setNodeToEdit(node: NodeType): void;
  activeNode: Key
}

const TreeExtended: React.FC<Props> = ({ handleContextMenuClick, setExpandRef, setNodeToEdit, activeNode }) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const searchedKeyword = useRef();
  const [searchResultVisible, setSearchResultVisible] = useState(true);
  const { treeData } = useContext(AppContext);

  useEffect(() => {
    setExpandRef.current = setExpandedKeys
  }, [])

  const onExpand = (newExpandedKeys: React.Key[]) => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

  };

  const handlePressEnter = () => {
    setSearchResultVisible(true)
  }

  const onSelectNodeToEdit = (node: NodeType) => {
    setNodeToEdit(node)
  }

  const titleRenderer = (node: NodeType) => {
    return <Node node={node} handleContextMenuClick={handleContextMenuClick} />
  }

  return (
    <div className='tree-wrap'>
      <Search style={{ marginBottom: 8 }} placeholder="جستجو" onChange={handleSearchInputChange} onPressEnter={handlePressEnter} />
      <Tree
        onSelect={(selectedKeys, info) => {
          selectedKeys.length ? onSelectNodeToEdit(info.node as NodeType) : onSelectNodeToEdit(undefined)
        }}
        selectedKeys={[activeNode]}
        multiple={false}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        treeData={treeData}
        titleRender={titleRenderer}
      />
      {searchResultVisible && <SearchResult items={[]} />}
    </div>
  );
};

export default memo(TreeExtended);