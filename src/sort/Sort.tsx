export enum Attribute {
    Title, DateAdded, DateModified
}

export interface SortOptions {
    recursive: boolean;
    attribute: Attribute;
}

function sortChildren(parent: string, attribute: Attribute) {
    let sortFn = (a: chrome.bookmarks.BookmarkTreeNode, b: chrome.bookmarks.BookmarkTreeNode) => a.title.localeCompare(b.title)
    switch (attribute) {
        case Attribute.Title:
            break;
        case Attribute.DateAdded:
            sortFn = (a: chrome.bookmarks.BookmarkTreeNode, b: chrome.bookmarks.BookmarkTreeNode) => a.dateAdded! < b.dateAdded! ? 1: 0
            break;
        case Attribute.DateModified:
            sortFn = (a: chrome.bookmarks.BookmarkTreeNode, b: chrome.bookmarks.BookmarkTreeNode) => a.dateGroupModified! < b.dateGroupModified! ? 1 : 0
            break;
    }

    chrome.bookmarks.getChildren(parent, (children: chrome.bookmarks.BookmarkTreeNode[]) => {
        children.sort(sortFn)
        children.forEach((sibling, index) => sibling.index = index)
        children.forEach(({ id, index }) => {
            chrome.bookmarks.move(id, {
                parentId: parent,
                index: index,
            })
        })
    })
}

export function sortBookmarks(parent: string, opts: SortOptions) {
    sortChildren(parent, opts.attribute)
    if (opts.recursive) {
        chrome.bookmarks.getChildren(parent, (children: chrome.bookmarks.BookmarkTreeNode[]) => {
            if (children.length == 0) return
            children.forEach((child) => sortChildren(child.id, opts.attribute))
        })
    }
}
