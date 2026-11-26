// Saving files that backends send as downloads (PDFs, ZIPs) from the browser.

// Saves a successful response's body as a file, under the name in its
// Content-Disposition, or fallbackFilename when it has none.
export async function saveResponseAsFile(
    res: Response,
    fallbackFilename: string,
): Promise<void> {
    const blob = await res.blob()
    const filename =
        filenameFromContentDisposition(res.headers.get("Content-Disposition")) ??
        fallbackFilename

    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    // Revoke later: some browsers start the download asynchronously.
    setTimeout(() => URL.revokeObjectURL(url), 60 * 1000)
}

// Reads the file name of a Content-Disposition header, preferring the UTF-8
// filename* (RFC 5987) over the plain ASCII one.
export function filenameFromContentDisposition(
    header: string | null,
): string | undefined {
    if (!header) return undefined

    const encoded = header.match(/filename\*\s*=\s*UTF-8''([^;]+)/i)
    if (encoded) {
        try {
            return decodeURIComponent(encoded[1].trim())
        } catch {
            // Fall back to the plain filename.
        }
    }

    const plain = header.match(/filename\s*=\s*"([^"]*)"/i)
    return plain?.[1] || undefined
}
