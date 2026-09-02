import streamifier from "streamifier";

// Helper function to ensure config is applied right before API calls
const ensureCloudinaryConfig = () => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
};

export const uploadImage = (buffer, folder) => {
    // Force config execution now
    ensureCloudinaryConfig();

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            }
        );

        streamifier.createReadStream(buffer).pipe(stream);
    });
};

export const deleteImage = async (publicId) => {
    if (!publicId) {
        return;
    }

    // Force config execution now
    ensureCloudinaryConfig();

    await cloudinary.uploader.destroy(publicId);
};
