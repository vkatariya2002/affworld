const express = require('express');
const path=require('path');
const cors = require('cors');
const multer = require('multer');
const watermark = require('watermark-jimp');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/upload', upload.array('images', 2), async (req, res) => {
    try {
        const options={
            dstPath:'./uploads/wmi-'+req.files[0].filename+'.png',
            position:req.body.position,
            opacity:parseFloat(req.body.opacity)
        }
        watermark.addWatermark('./uploads/'+req.files[0].filename,'./uploads/'+req.files[1].filename,options).then(data => {
            res.json({status:true,watermarkedImage:'/wmi-'+req.files[0].filename+'.png'});
        }).catch(error => {
            console.log(error);
            res.json({status:false});
        });
    } catch (error) {
        console.log(error);
        res.json({status:false});
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, (error) => {
    if(error) console.log(error);
    else console.log(`Server started on port ${PORT}`)
});
