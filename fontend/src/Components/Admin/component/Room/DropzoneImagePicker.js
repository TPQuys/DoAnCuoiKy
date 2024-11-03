import { Button } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const DropzoneImagePicker = ({ setSelectedFile, imageUrl }) => {
    const [selectedImage, setSelectedImage] = useState(imageUrl || null);

    // Callback for handling the dropped files
    const handleDrop = useCallback((acceptedFiles) => {
        // Ensure we only handle accepted files
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setSelectedFile(file);
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    }, [setSelectedFile]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
        },
    });

    return (
        <div {...getRootProps()} style={{ border: '2px dashed gray', padding: '20px', textAlign: 'center', cursor: 'pointer' }}>
            <input {...getInputProps()} />
            <p>Kéo thả hình ảnh vào đây, hoặc nhấp để chọn ảnh</p>
            {selectedImage && (
                <img src={selectedImage} alt="Selected" width="200px" height="auto" />
            )}
        </div>
    );
};

export default DropzoneImagePicker;
