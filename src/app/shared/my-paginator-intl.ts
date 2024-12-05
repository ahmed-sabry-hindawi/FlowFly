import { MatPaginatorIntl } from '@angular/material/paginator'

const matRangeLabelIntl = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) {
        return `الممم :  ${length}`
    }
    length = Math.max(length, 0)
    const startIndex = page * pageSize

    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex = startIndex < length ?  Math.min(startIndex + pageSize, length) : startIndex + pageSize
    return `النطاق : ${startIndex + 1} - ${endIndex} من أصل ${length}`
}

export function MyPaginatorIntl() {
    const paginatorIntl = new MatPaginatorIntl()

    paginatorIntl.itemsPerPageLabel ="عدد العناصر في كل صفحة"//`:@@paginator.displayPerPage:Items per page`
    paginatorIntl.nextPageLabel ="الصفحة التالية" //`:@@paginator.nextPage:Next page`
    paginatorIntl.previousPageLabel ="الصفحة السابقة" // `:@@paginator.prevPage:Prev page`
    paginatorIntl.getRangeLabel = matRangeLabelIntl

    return paginatorIntl
}