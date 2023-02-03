import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Button, Switch, Select, TreeSelect } from 'antd';
import 'antd/dist/reset.css';
import { DefaultOptionType } from 'rc-tree-select/lib/TreeSelect';
import { sortBookmarks } from './sort/Sort';

class Tree {
  root: DefaultOptionType[];

  constructor(node: chrome.bookmarks.BookmarkTreeNode) {
    let root = {
      value: node.id,
      title: 'bookmarks (root)',
      children: [],
    }
    this.addNode(node, root.children)
    this.root = [root]
  }

  addNode(node: chrome.bookmarks.BookmarkTreeNode, siblings?: DefaultOptionType[]): void {
    if (node.children === undefined || node.children.length == 0) {
      return
    }
    node.children.forEach(child => {
      let leaf = {
        value: child.id,
        title: child.title,
        children: [],
      }
      siblings!.push(leaf)
      this.addNode(child, leaf.children)
    })
  };
}

const App: FC = () => {
  useEffect(() => {
    getBookmarksTree()
  });

  const [selectedBookmarks, setSelectedBookmarks] = useState<string[]>();
  const [loadedBookmarks, setLoadedBookmarks] = useState<Tree>();
  const [optionRecursive, setOptionRecursive] = useState<boolean>(false);

  const handleSelectSortBy = (value: string) => {
    console.log(`selected handle ${value}`);
  };

  const handleSelectBookmarks = (bookmarks: string[]) => {
    setSelectedBookmarks(bookmarks);
  }

  const getBookmarksTree = () => {
    chrome.bookmarks.getTree((nodes: chrome.bookmarks.BookmarkTreeNode[]) => {
      if (nodes.length == 0) {
        return
      }
      let root = nodes[0]
      let bookmarksTree = new Tree(root)
      setLoadedBookmarks(bookmarksTree)
    })
  }

  const sortSelectedBookmarks = () => {
    console.log('selected', selectedBookmarks)
    selectedBookmarks?.forEach(bookmarkId => {
      sortBookmarks(bookmarkId, optionRecursive)
    })
  }

  return (
    <div className="App">
      <Select
        defaultValue="title"
        style={{ width: 200 }}
        onChange={handleSelectSortBy}
        options={[
          { value: 'title', label: 'title' },
          { value: 'dateAdded', label: 'date added' },
          { value: 'dateGroupModified', label: 'date modified' },
        ]}
      />
      <TreeSelect
        showSearch
        style={{ width: 400 }}
        value={selectedBookmarks}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="Please select bookmarks to be sorted"
        allowClear
        multiple
        onChange={handleSelectBookmarks}
        treeData={loadedBookmarks?.root}
      />
      <Switch
        defaultChecked={optionRecursive}
        onChange={(checked) => setOptionRecursive(checked)}
      />
      <Button
        type="primary"
        onClick={() => sortSelectedBookmarks()}
        >sort</Button>
    </div>
  )
}

export default App;