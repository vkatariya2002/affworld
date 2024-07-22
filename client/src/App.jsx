import React, { useState } from 'react'
import axios from 'axios'
import { saveAs } from 'file-saver'

function App() {
    const [watermarkOn, setWatermarkOn] = useState(true);
    const [image, setImage] = useState(null);
    const [image2, setImage2] = useState(null);
    const [preview, setPreview] = useState(null);
    const [settings, setSettings] = useState({
        position: 'top-left',
        opacity: 1,
    });

    const handleImageUpload = (e) => {
        setImage(e.target.files[0]);
    };

    const handleImageUpload2 = (e) => {
        setImage2(e.target.files[0]);
    };

    const handleSettingChange = (e) => {
        const { name, value } = e.target;
        setSettings({ ...settings, [name]: value });
    };

    const handleSubmit = async () => {
        if (watermarkOn) {
            try {
                const formData = new FormData();
                formData.append('images', image);
                formData.append('images', image2);
                formData.append('position', settings.position);
                formData.append('opacity', settings.opacity);

                const response = await axios.post('http://localhost:5000/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log(response);
                if (response.data.status) setPreview('http://localhost:5000/upload' + 's' + response.data.watermarkedImage);
            } catch (error) {
                console.log(error);
            }
        }
    };

    const downloadImage = () => {
        saveAs(preview, 'watermarked-image.png');
    }

    return (
        <div>
            <div>
                <label>Watermark on/off:
                    <input type="checkbox" name="watermarkOn" checked={watermarkOn} onChange={(e) => setWatermarkOn(!watermarkOn)} />
                </label>
                <label>Position:
                    <select name="position" value={settings.position} onChange={handleSettingChange}>
                        <option value="top-left">Top Left</option>
                        <option value="top">Top</option>
                        <option value="top-right">Top Right</option>
                        <option value="center-left">Center Left</option>
                        <option value="center">Center</option>
                        <option value="center-right">Center Right</option>
                        <option value="bottom-left">Bottom Left</option>
                        <option value="bottom">Bottom</option>
                        <option value="bottom-right">Bottom Right</option>
                    </select>
                </label>
                <label>Opacity:
                    <input type="range" name="opacity" min="0" max="1" step="0.1" value={settings.opacity} onChange={handleSettingChange} />
                </label>
                <input type="file" onChange={handleImageUpload} />
                <input type="file" onChange={handleImageUpload2} />
                <button onClick={handleSubmit}>Save</button>
                <button onClick={() => setSettings({ position: 'top-left', opacity: 1, watermarkOn: true })}>Reset</button>
            </div>
            {preview ? <><button type="button" onClick={downloadImage}>Download!</button>
                <img src={preview} alt="Preview" /></> : <></>}
        </div>
    );
}

export default App
