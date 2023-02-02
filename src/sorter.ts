const bm = chrome.bookmarks
type BookmarkTreeNode = chrome.bookmarks.BookmarkTreeNode
type BookmarkDestinationArg = chrome.bookmarks.BookmarkDestinationArg

bm.onCreated.addListener((id: string, bookmark: BookmarkTreeNode ) => {
    let parent = bookmark.parentId!;
    bm.getChildren(parent, (siblings: BookmarkTreeNode[]) => {
        siblings.sort((a, b) => a.title.localeCompare(b.title))
        siblings.forEach((sibling, index) => sibling.index = index)
        siblings.forEach(({ id, index}) => {
            bm.move(id, {
                parentId: parent,
                index: index,
            })
        })
    })
})

