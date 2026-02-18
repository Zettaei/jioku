import { BadRequestError } from "src/errors/httpError.js";
import { OCR_OPTIONS } from "src/config.js";
import type {  Sharp } from "sharp";
import crypto from "crypto";

async function validateImageMetadata(image: Sharp)
{
    const metadata = await image.metadata();
    const maxWidth = OCR_OPTIONS.MAX_IMAGE_WIDTH;
    const maxHeight = OCR_OPTIONS.MAX_IMAGE_HEIGHT;
    if(metadata.width > maxWidth || metadata.height > maxHeight) {
        throw new BadRequestError("File Dimension larger exceeded (" + maxWidth + 'x' + maxHeight + ")");
    }
}

function validateImageFile(file: string | File | undefined)
: asserts file is File
{
    if(!file) {
        throw new BadRequestError("Missing image file");
    }

    if (!(file instanceof File)) {
        throw new BadRequestError("Incorrect file type");
    }

    const allowedExtensions = ["png", "jpg", "jpeg", "web", "bmp"];

    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
        throw new BadRequestError("Unsupported file format");
    }

    return;
}

async function createForwardingFormData(image: Sharp, filename: string)
: Promise<FormData>
{
    const formData = new FormData();
    const file = new File([await image.toBuffer()], filename);
    formData.set("file", file);

    return formData;
}

function resizeImageForOCR(image: Sharp)
: Sharp
{
    return image.clone().resize({
        width: OCR_OPTIONS.MAX_IMAGE_WIDTH,
        height: OCR_OPTIONS.MAX_IMAGE_HEIGHT,
        fit: "inside",
        withoutEnlargement: true
    }).sharpen();
}

function resizeImageForHash(image: Sharp)
: Sharp
{
    return image.clone().resize({
        width: OCR_OPTIONS.HASH_IMAGE_WIDTH,
        height: OCR_OPTIONS.HASH_IMAGE_HEIGHT,
        fit: "inside",
    });
}

function checksumImageBuffer(buffer: Buffer, algorithm = "sha256")
: string
{
    return crypto.createHash(algorithm).update(buffer).digest("hex");
}


export {
    validateImageFile,
    createForwardingFormData,
    resizeImageForOCR,
    resizeImageForHash,
    checksumImageBuffer,
    validateImageMetadata
}