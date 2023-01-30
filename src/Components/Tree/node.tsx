import React, { memo, useContext, useState } from 'react';

import { NodeType } from '../../types';
import { ContextMenuTriggerEx, ContextMenuItemEx, ContextMenuEx } from '../ContextMenu';

interface Props {
  node: NodeType;
  handleContextMenuClick: (key: string, node?: NodeType) => void;
}

function Node({ node, handleContextMenuClick }: Props) {

  return (
    <div>
      {/* NOTICE: id must be unique between EVERY <ContextMenuTrigger> and <ContextMenu> pair */}
      {/* NOTICE: inside the pair, <ContextMenuTrigger> and <ContextMenu> must have the same id */}
      <ContextMenuTriggerEx
        id={node.key}
        title={node.title}
      />

      <ContextMenuEx id={node.key}>
        <ContextMenuItemEx handleClick={() => handleContextMenuClick('ACTION1', node)} title={'افزودن زیرشاخه'} />
        <ContextMenuItemEx disabled={node.children.length > 0} handleClick={() => handleContextMenuClick('ACTION2', node)} title={'برش'} />
        <ContextMenuItemEx handleClick={() => handleContextMenuClick('ACTION3', node)} title={'چسباندن'} />
        <ContextMenuItemEx handleClick={() => handleContextMenuClick('ACTION4', node)} title={'حذف'} />
      </ContextMenuEx>

    </div>
  );
}
export default Node
