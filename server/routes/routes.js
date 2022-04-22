const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const dikstorage = multer.diskStorage({
    destination: path.join(__dirname, '../images'),
    filename: (req, file, cb) =>{
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const fileUpload = multer({
    storage: dikstorage
}).single('image')

router.get('/',  (req, res ) => {
    res.send('Hola mundo')
});
router.post('/images/post', fileUpload ,(req, res) =>{
    req.getConnection((err, conn) =>{
        if(err){
            return res.status(500).send('error en el servidor')
        }
        const type = req.file.mimetype;
        const name = req.file.originalname;
        const data = fs.readFileSync(path.join(__dirname , '../images' , req.file.filename));
        conn.query('INSERT INTO imagenes SET ?', [{type: type, name: name, data: data}], (err, rows) =>{
            if(err){
                return res.status(500).send('error en el servidor')
            }

            res.send('imagen guardada')
        })
    })
    console.log(req.file)

});
router.get('/images/get' ,(req, res) =>{
   // res.header({"Access-Control-Allow-Origin": "*"});
    req.getConnection((err, conn) =>{
        if(err){
            return res.status(500).send('error en el servidor')
        }
       
        conn.query('SELECT * FROM imagenes',  (err, rows) =>{
            if(err){
                return res.status(500).send('error en el servidor')
            }
            rows.map(img => {  //para cada item de row 
                fs.writeFileSync(path.join(__dirname , '../dbimages/' + img.id + '-obtenerimg.png'), img.data )
                
            })
            const imagedir = fs.readdirSync(path.join(__dirname, '../dbimages/'))
            res.json(imagedir);
            //console.log(imagedir);
            console.log(rows);
        })
    })

});
router.delete('/images/delete/:id' ,(req, res) =>{
   
    req.getConnection((err, conn) =>{
        if(err){
            return res.status(500).send('error en el servidor')
        }
       
        conn.query('DELETE FROM imagenes WHERE id = ?', [req.params.id] , (err, rows) =>{
            if(err){
                return res.status(500).send('error en el servidor')
            }

            fs.unlinkSync(path.join(__dirname, '../dbimages/'+ req.params.id + '-obtenerimg.png'));

            res.send('imagen borrada');
            
            //console.log(rows);
        })
    })

});

module.exports = router;