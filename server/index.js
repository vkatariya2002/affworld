// const express = require('express');
// const multer = require('multer');
// const sharp = require('sharp');
// const cors = require('cors');
// const path = require('path');
// const watermark = require('jimp-watermark');
// const app = express();
// const upload = multer({ dest: 'uploads/' });

// app.use(cors());
// app.use(express.json());
// app.use(express.static('uploads'));

// app.post('/upload', upload.array('photos', 12), async (req, res) => {
//     console.log('helo1');
//     try {
//         console.log('helo2');
//         watermark.addWatermark('./uploads/'+req.files[0].filename,'./uploads/'+req.files[1].filename).then(data => {
//             console.log(data);
//             res.json({status:'watermark applied successfully'});
//         }).catch(err => {
//             console.log(err);
//             res.json({status:'some error occured'});
//         });
//         // const { position, opacity } = req.body;
//         // const imagePath = req.file.path;
//         // const watermarkText = 'PRIMEVISTA REAL ESTATE';

//         // // Apply watermark logic based on position and opacity
//         // let watermarkedImage = sharp(imagePath)
//         //     .composite([{ input: Buffer.from(`
//         //         <svg>
//         //             <text x="0" y="0" fill="rgba(255, 255, 255, ${opacity})">${watermarkText}</text>
//         //         </svg>
//         //     `), gravity: position }])
//         //     .toBuffer();

//         // const outputImagePath = path.join('uploads', `watermarked-${req.file.filename}.png`);
//         // await sharp(watermarkedImage).toFile(outputImagePath);

//         // res.sendFile(path.resolve(outputImagePath));
//     } catch (error) {
//         console.log('helo3');
//         res.json({status:'some error occured'});
//     }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server started on port ${PORT}`));




const express = require('express');
const multer = require('multer');
const watermark = require('watermark-jimp');
const cors = require('cors');
const path = require('path');
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use(express.static('uploads'));

app.post('/upload', upload.array('photos', 12), async (req, res) => {
    try {
        const watermarkImagePath = './uploads/' + req.files[0].filename; // Assuming the first file is the watermark
        const imagePaths = req.files.slice(1).map(file => './uploads/' + file.filename); // The rest are images to be watermarked

        // Apply watermark to all images
        const watermarkPromises = imagePaths.map(imagePath =>
            watermark.addWatermark(imagePath, watermarkImagePath)
        );

        const results = await Promise.all(watermarkPromises);

        // Return the paths of the watermarked images or any other relevant info
        res.json({ status: 'watermark applied successfully', results });
    } catch (error) {
        console.error(error);
        res.json({ status: 'some error occurred' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
