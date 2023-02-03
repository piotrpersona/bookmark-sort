import { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Divider, Form, Button, Switch, Select, TreeSelect } from 'antd';
import { GithubOutlined, OrderedListOutlined } from '@ant-design/icons';
import 'antd/dist/reset.css';
import { DefaultOptionType } from 'rc-tree-select/lib/TreeSelect';
import { sortBookmarks, Attribute } from './sort/Sort';
import { Typography } from 'antd';

const { Title, Text } = Typography;

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
  const [optionAttribute, setOptionAttribute] = useState<Attribute>(Attribute.Title);

  const handleSelectSortBy = (attribute: Attribute) => {
    setOptionAttribute(attribute)
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
      sortBookmarks(bookmarkId, {
        recursive: optionRecursive,
        attribute: optionAttribute
      })
    })
  }

  return (
    <div className="App">
      <Title level={3}>Bookmark Sort</Title>
      <Divider />
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 300 }}
        onFinish={() => sortSelectedBookmarks()}
        onFinishFailed={(e) => { console.log(e) }}
        autoComplete="off"
      >
        <Form.Item
          label="Bookmarks"
          name="bookmarks"
          rules={[{ required: true, message: 'Please select bookmarks to be sorted' }]}
        >
          <TreeSelect
            showSearch
            style={{ width: 300 }}
            value={selectedBookmarks}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder="Please select bookmarks to be sorted"
            allowClear
            multiple
            onChange={handleSelectBookmarks}
            treeData={loadedBookmarks?.root}
          />
        </Form.Item>
        <Form.Item
          label="Sort by attribute"
          name="attribute"
        >
          <Select
            defaultValue={optionAttribute}
            style={{ width: 300 }}
            onChange={handleSelectSortBy}
            options={[
              { value: Attribute.Title, label: 'title' },
              { value: Attribute.DateAdded, label: 'date added' },
              { value: Attribute.DateModified, label: 'date modified' },
            ]}
          />
        </Form.Item>
        <Form.Item label="Sort recursively" name="remember" valuePropName="checked">
          <Switch
            defaultChecked={optionRecursive}
            onChange={(checked) => setOptionRecursive(checked)}
          />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button
            type="primary"
            htmlType="submit"
            icon={<OrderedListOutlined />}
            onClick={() => sortSelectedBookmarks()}
          >sort</Button>
        </Form.Item>
      </Form>
      <Divider />
      <Text>Github source code & Issues: </Text>
      <Button
        type="link"
        href="https://github.com/piotrpersona/bookmarks-sort"
        target="_blank"
        icon={<GithubOutlined />}
        shape={'circle'}
        onClick={() => sortSelectedBookmarks()}
      ></Button>
    </div>
  )
}

export default App;