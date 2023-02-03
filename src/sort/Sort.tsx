export function sortChildren(parent: string) {
    chrome.bookmarks.getChildren(parent, (children:  chrome.bookmarks.BookmarkTreeNode[]) => {
        children.sort((a, b) => a.title.localeCompare(b.title))
        children.forEach((sibling, index) => sibling.index = index)
        children.forEach(({ id, index }) => {
            chrome.bookmarks.move(id, {
                parentId: parent,
                index: index,
            })
        })
    })
}

export function sortRecursive(parent: string) {
    chrome.bookmarks.getChildren(parent, (children:  chrome.bookmarks.BookmarkTreeNode[]) => {
        if (children.length == 0) return
        children.forEach((child) => sortChildren(child.id))
    })
}
