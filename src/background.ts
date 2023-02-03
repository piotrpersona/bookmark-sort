import { sortBookmarks, Attribute } from './sort/Sort'

chrome.bookmarks.onCreated.addListener((id: string, bookmark: chrome.bookmarks.BookmarkTreeNode) => {
    sortBookmarks(bookmark.parentId!, {recursive: true, attribute: Attribute.Title})
})
