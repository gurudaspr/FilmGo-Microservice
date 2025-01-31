import cloudinary from 'cloudinary';
import logger from './logger';
import { config } from '../config';

cloudinary.v2.config({
    cloud_name: config.cloud_name,
    api_key: config.api_key,
    api_secret: config.api_secret,
    
});

const uploadMediaToCloudinary = async (file : any) => {
    return  new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream({resource_type: 'auto' ,folder :'filmgo-media'}, (error, result) => {
            if(error){
                logger.error('Error while uploading file to cloudinary', error);
                reject(error);
            }
            resolve(result);
        })
        uploadStream.end(file.buffer);  
    }
    );
};

const deleteMediaFromCloudinary = async (publicId : string) => {
    try {
        const result = await cloudinary.v2.uploader.destroy(publicId);
        logger.info('Deleted file from cloudinary', publicId);
        return result;
        
    } catch (error) {
        logger.error('Error while deleting file from cloudinary', error);
        throw error;
        
    }
}

export {uploadMediaToCloudinary, deleteMediaFromCloudinary};