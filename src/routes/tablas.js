const express = require('express');
const router = express.Router();

const pool = require('../mysql/dataCon');

//main
router.get('/', (req, res) => {
    res.render('init');
});

//producto
router.get('/producto', async (req, res) => {
    const prod = await pool.query('SELECT * FROM producto');
    const fab = await pool.query('SELECT * FROM fabricante');
    res.render('producto', { array: prod, array2: fab });
});

router.post('/producto', async (req, res) => {
    let { nombre, precio, codigo_fabricante } = req.body;
    codigo_fabricante = await pool.query('SELECT codigo FROM fabricante WHERE nombre = ?', [codigo_fabricante])
    codigo_fabricante = codigo_fabricante[0].codigo;
    const newProd = {
        nombre,
        precio,
        codigo_fabricante
    };
    await pool.query('INSERT INTO producto SET ?', [newProd]);
    res.redirect('/producto');
});

router.get('/producto/edit/:id', async (req, res) => {
    const { id } = req.params;
    const prod = await pool.query('SELECT * FROM producto');
    const prodId = await pool.query('SELECT * FROM producto WHERE codigo = ?', [id]);
    const CodFab = await pool.query('SELECT nombre FROM fabricante WHERE codigo = ?', [prodId[0].codigo_fabricante]);
    const fab = await pool.query('SELECT * FROM fabricante');
    res.render('editProd', { array: prod, array2: fab, proSingle: prodId[0], CoFa: CodFab[0] })
});

router.post('/producto/edit/:id', async (req, res) => {
    const { id } = req.params;
    let { nombre, precio, codigo_fabricante } = req.body;
    codigo_fabricante = await pool.query('SELECT codigo FROM fabricante WHERE nombre = ?', [codigo_fabricante])
    codigo_fabricante = codigo_fabricante[0].codigo;
    const newProd = {
        nombre,
        precio,
        codigo_fabricante
    };
    await pool.query('UPDATE producto SET ? WHERE codigo = ?', [newProd, id]);
    res.redirect('/producto');
});

router.get('/producto/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM producto WHERE codigo = ?', [id]);
    res.redirect('/producto');
});

//fabricante
router.get('/fabricante', async (req, res) => {
    const fab = await pool.query('SELECT * FROM fabricante');
    res.render('fabricante', { array: fab })
});

router.post('/fabricante', async (req, res) => {
    const { fabricante } = req.body;
    console.log(fabricante)
    await pool.query('INSERT INTO fabricante values (null, ?)', [fabricante]);
    res.redirect('/fabricante');
});

router.get('/fabricante/edit/:id', async (req, res) => {
    const { id } = req.params;
    const fab = await pool.query('SELECT * FROM fabricante');
    const fabNom = await pool.query('SELECT * FROM fabricante WHERE codigo = ?', [id]);
    res.render('editFab', { array: fab, array2: fabNom[0] })
});

router.post('/fabricante/edit/:id', async (req, res)=>{
    const { id } = req.params;
    const {nombre}= req.body;
    await pool.query('UPDATE fabricante SET nombre = ? WHERE codigo = ?', [nombre, id]);
    res.redirect('/fabricante');
});

router.get('/fabricante/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM fabricante WHERE codigo = ?', [id]);
    res.redirect('/fabricante');
});

//producto-fabricante
router.get('/producto-fabricante', async (req, res)=>{
    const proFab = await pool.query('SELECT p.nombre as produco, f.nombre as fabricante, p.precio FROM producto p inner join fabricante f on p.codigo_fabricante = f.codigo')
    res.render('profab', {array: proFab});
});

module.exports = router;