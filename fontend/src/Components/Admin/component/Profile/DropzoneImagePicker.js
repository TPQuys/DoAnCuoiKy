import { Button } from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const DropzoneImagePicker = ({ setSelectedFile }) => {
    const [selectedImage, setSelectedImage] = useState(null);

    // Callback for handling the dropped files
    const handleDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setSelectedFile(file)
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleDrop,
        accept: 'image/*',
    });

    return (
        <div {...getRootProps()} style={{ border: '2px dashed gray', padding: '20px', textAlign: 'center', cursor: "pointer" }}>
            <input {...getInputProps()} />
            <p>Kéo thả hình ảnh vào đây, hoặc nhấp để chọn ảnh</p>
            {selectedImage && (
                <img src={selectedImage} alt="Selected" width="200px" height="200px" style={{ borderRadius: "100px", objectFit: "cover" }} />
            )}
        </div>
    );
};

export default DropzoneImagePicker;
