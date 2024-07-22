import { useState } from 'react'
import axios from 'axios'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [image, setImage] = useState(null);
  const [image2, setImage2] = useState(null);
    const [preview, setPreview] = useState(null);
    const [settings, setSettings] = useState({
        position: 'bottom-right',
        opacity: 1,
        watermarkOn: true
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
        const formData = new FormData();
        formData.append('image', image);
        formData.append('position', settings.position);
        formData.append('opacity', settings.opacity);

        const response = await axios.post('http://localhost:5000/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        setPreview(response.data);
    };

    return (
        <div>
            <div>
                <label>Watermark on/off: 
                    <input type="checkbox" name="watermarkOn" checked={settings.watermarkOn} onChange={(e) => handleSettingChange({ target: { name: 'watermarkOn', value: e.target.checked } })} />
                </label>
                <label>Position: 
                    <select name="position" value={settings.position} onChange={handleSettingChange}>
                        <option value="northwest">Top Left</option>
                        <option value="north">Top</option>
                        <option value="northeast">Top Right</option>
                        <option value="west">Center Left</option>
                        <option value="center">Center</option>
                        <option value="east">Center Right</option>
                        <option value="southwest">Bottom Left</option>
                        <option value="south">Bottom</option>
                        <option value="southeast">Bottom Right</option>
                    </select>
                </label>
                <label>Opacity: 
                    <input type="range" name="opacity" min="0" max="1" step="0.1" value={settings.opacity} onChange={handleSettingChange} />
                </label>
                <input type="file" onChange={handleImageUpload} />
                <input type="file" onChange={handleImageUpload2} />
                <button onClick={handleSubmit}>Save</button>
                <button onClick={() => setSettings({ position: 'bottom-right', opacity: 1, watermarkOn: true })}>Reset</button>
            </div>
            {preview && <img src={`http://localhost:5000/${preview}`} alt="Preview" />}
        </div>
    );
}

export default App
