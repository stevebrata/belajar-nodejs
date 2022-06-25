const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const { body, validationResult, check } = require('express-validator')
const methodOverride = require('method-override')

require('./utils/db');
const Contact = require('./model/contact')

const app = express();
const port = 3000;
app.use(methodOverride('_method'))
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

//halaman home
app.get('/', (req, res) => {
  res.render('home', {
    layout: 'layouts/main',
    title: 'Node JS'
  })
})

// halaman about
app.get('/About', (req, res) => {
  res.render('About', {
    layout: 'layouts/main',
    title: 'About'
  })
})

// menampilkan awal page contact dibuka
app.get('/Contact', async (req, res) => {
  const contacts = await Contact.find()
  res.render('Contact', {
    layout: 'layouts/main',
    title: 'Contact',
    contacts,
  })

})
// halaman tambah
app.get('/Contact/add', (req, res) => {
  res.render('add-contact', {
    layout: 'layouts/main',
    title: 'Tambah',
  })
})
// proses tambah contact
app.post('/Contact', [
  body('nama').custom(async (value) => {
    const duplikat = await Contact.findOne({ nama: value })
    if (duplikat) {
      throw new Error('nama sudah ada')
    }
    return true
  }),
  check('email', 'Email tidak valid').isEmail(),
  check('nohp', 'no HP tidak valid').isMobilePhone('id-ID')
]
  , (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      console.log(errors)
      res.render('add-contact', {
        title: 'Tambah',
        layout: 'layouts/main',
        errors: errors.array()
      })
    } else {
      Contact.insertMany(req.body, async (error, result) => {
        const berhasil = 'selamat'
        const contacts = await Contact.find()
        // res.redirect('Contact')
        res.render('Contact', {
          title: 'Tambah',
          layout: 'layouts/main',
          contacts,
          berhasil
        })
      })
    }
  })

// app.get('/contact/delete/:nama', async (req, res) => {
//   const contact = await Contact.findOne({ nama: req.params.nama });
//   if (!contact) {
//     res.status(404);
//     res.send('<h1>404</h1>')
//   } else {
//     // Contact.deleteOne({ nama: req.params.nama })
//     Contact.deleteOne({ _id: contact._id }).then((result) => {

//       res.redirect('/Contact')
//     })
//   }
// })

// hapus contact
app.delete('/contact', (req, res) => {
  Contact.deleteOne({ nama: req.body.nama }, async (error, result) => {
    const hapus = 'hapus'
    const contacts = await Contact.find()
    // res.render('add-contact', {
    //   title: 'Tambah',
    //   layout: 'layouts/main',
    //   berhasil
    // })
    // setTimeout(() => {
    // res.redirect('Contact')
    res.render('Contact', {
      title: 'Tambah',
      layout: 'layouts/main',
      contacts,
      hapus
    })
    // }, 1000);
  })
  // .then((result) => {
  //   res.redirect('/Contact')
  // })
})

// ubah contact
app.get('/Contact/edit/:nama', async (req, res) => {
  const contact = await Contact.findOne({ nama: req.params.nama })
  res.render('edit-contact', {
    layout: 'layouts/main',
    title: 'Ubah',
    contact
  })
})

//  proses ubah contact
app.put('/contact', [
  body('nama').custom(async (value, { req }) => {
    const duplikat = await Contact.findOne({ nama: value });
    if (value !== req.body.oldNama && duplikat) {
      throw new Error('nama sudah ada')
    }
    return true
  }),
  check('nohp', 'no HP tidak valid').isMobilePhone('id-ID')
]
  , (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      // return res.status(400).json({ errors: errors.array() })
      res.render('edit-contact', {
        title: 'Ubah',
        layout: 'layouts/main',
        errors: errors.array(),
        contact: req.body
      })
    } else {
      Contact.updateOne(
        { _id: req.body._id },
        {
          $set: {
            nama: req.body.nama,
            nohp: req.body.nohp,
            email: req.body.email,
          },
        },
        async (error, result) => {
          const ubah = 'ubah'
          const contacts = await Contact.find()
          // res.render('add-contact', {
          //   title: 'Tambah',
          //   layout: 'layouts/main',
          //   berhasil
          // })
          // setTimeout(() => {
          // res.redirect('Contact')
          res.render('Contact', {
            title: 'Tambah',
            layout: 'layouts/main',
            contacts,
            ubah
          })
          // }, 1000);
        })
      // .then((result) => {
      //   res.redirect('/Contact')

      // })
    }
  })

// halaman detail
app.get('/Contact/:nama', async (req, res) => {
  const contact = await Contact.findOne({ nama: req.params.nama });
  res.render('detail', {
    layout: 'layouts/main',
    title: 'detail',
    contact
  })
})
// cek koneksi
app.listen(port, () => {
  console.log(`http://localhost:${port}`)
});


