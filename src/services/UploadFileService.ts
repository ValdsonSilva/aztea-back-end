import cloudinary from "../config/cloudinary.js";


export const uploadFile = async (avatarPath: string, safeName: string, type: string) => {
    if (!avatarPath) {
        throw new Error('Arquivo inválido ou não enviado.');
    }

    const resourceType = type === 'video' ? 'video' : 'auto';

    try {
        const result = await cloudinary.uploader.upload(avatarPath, {
            folder: `aztea/avatares/${safeName}/${type}`,
            resource_type: resourceType,
        });

        return result;
    } catch (error) {
        console.error('Erro ao fazer upload no Cloudinary:', error);
        throw new Error('Falha ao fazer upload do arquivo.');
    }
};

