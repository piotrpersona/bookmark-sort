import { sortBookmarks } from './sort/Sort'

chrome.bookmarks.onCreated.addListener((id: string, bookmark: chrome.bookmarks.BookmarkTreeNode) => {
    sortBookmarks(bookmark.parentId!)
})
