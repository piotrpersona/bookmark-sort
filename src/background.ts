import { sortChildren } from './sort/Sort'

chrome.bookmarks.onCreated.addListener((id: string, bookmark: chrome.bookmarks.BookmarkTreeNode) => {
    sortChildren(bookmark.parentId!)
})
