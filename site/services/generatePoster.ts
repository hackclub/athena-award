import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode'
export async function generatePoster(params: string){
    const fetchPoster = (await fetch(process.env.NEXT_PUBLIC_BASE_URL + `/poster.pdf`))
    const loadedPoster = await PDFDocument.load(await fetchPoster.arrayBuffer())
    const page = loadedPoster.getPages()[0]
    const qrDataUrl = await QRCode.toDataURL("https://award.athena.hackclub.com" + params);
    const base64 = qrDataUrl.split(',')[1];
    const qrCodeBytes = await loadedPoster.embedPng(
        Uint8Array.from(atob(base64), (v) => v.charCodeAt(0))
    );
    const pngDims = qrCodeBytes.scale(0.9)
    page.drawImage(qrCodeBytes, {
        x: page.getWidth() / 2 - pngDims.width / 2 + 20,
        y: page.getHeight() / 2 - pngDims.height / 2 - 40,
        rotate: degrees(4),
        width: pngDims.width,
        height: pngDims.height
    }
    )
    const pdfBytes = await loadedPoster.save()
    return pdfBytes
}