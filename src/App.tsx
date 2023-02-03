import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Button, Select, TreeSelect } from 'antd';
import 'antd/dist/reset.css';
import { DefaultOptionType } from 'rc-tree-select/lib/TreeSelect';

class Tree {
  root: DefaultOptionType[];

  constructor(node: chrome.bookmarks.BookmarkTreeNode) {
    let root = {
      value: node.id,
      title: node.title,
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

  const [value, setValue] = useState<string>();
  const [bookmarks, setBookmarks] = useState<Tree>();

  const handleSelectSortBy = (value: string) => {
    console.log(`selected ${value}`);
  };

  const handleSelectBookmarks = (newValue: string) => {
    console.log(newValue);
    setValue(newValue);
  }

  const getBookmarksTree = () => {
    chrome.bookmarks.getTree((nodes: chrome.bookmarks.BookmarkTreeNode[]) => {
      console.log(nodes)
      if (nodes.length == 0) {
        return
      }
      let root = nodes[0]
      let bookmarksTree = new Tree(root)
      console.log(bookmarksTree)
      setBookmarks(bookmarksTree)
    })
  }

  const treeData = [
    {
      value: 'parent 1',
      title: 'parent 1',
      children: [
        {
          value: 'parent 1-0',
          title: 'parent 1-0',
          children: [
            {
              value: 'leaf1',
              title: 'my leaf',
            },
            {
              value: 'leaf2',
              title: 'your leaf',
            },
          ],
        },
        {
          value: 'parent 1-1',
          title: 'parent 1-1',
          children: [
            {
              value: 'sss',
              title: <b style={{ color: '#08c' }}>sss</b>,
            },
          ],
        },
      ],
    },
  ];

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
        value={value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder="Please select bookmarks to be sorted"
        allowClear
        multiple
        treeDefaultExpandAll
        onChange={handleSelectBookmarks}
        treeData={bookmarks?.root}
      />
      <Button type="primary">sort</Button>
    </div>
  )
}

export default App;