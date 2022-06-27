const mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1:27017/wpu', {
mongoose.connect('mongodb+srv://@cluster0.nbv4k.mongodb.net/daftar?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
});



// menambah data
// const contact1 = new Contact({

//   nama: 'Steve',
//   nohp: '081339678880',
//   email: 'stevebrata@gmail.com',
// });


// simpan ke collection
// contact1.save().then((contact) => console.log(contact));