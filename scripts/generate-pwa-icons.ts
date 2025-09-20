import sharp from "sharp"
import path from "path"

async function generateIcons() {
    const iconPath = path.join(process.cwd(), "app", "icon.png")
    const outputPath = path.join(process.cwd(), "public")

    // Generate 192x192 icon
    await sharp(iconPath)
        .resize(192, 192)
        .toFile(path.join(outputPath, "icon-192x192.png"))

    // Generate 512x512 icon
    await sharp(iconPath)
        .resize(512, 512)
        .toFile(path.join(outputPath, "icon-512x512.png"))

    console.log("PWA icons generated successfully!")
}

generateIcons().catch(console.error)
