const { json } = require('express');
const fs = require('fs');


// membuat folder data jika belum ada
const dirPath = './data';
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

const dataPath = './data/contacts.json';
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, '[]', 'utf-8');
}


const loadContact = () => {
  const fileBuffer = fs.readFileSync('data/contacts.json', 'utf-8');
  const contacts = JSON.parse(fileBuffer);
  return contacts;
}

// cari contact berdasarkan nama
const findContact = (nama) => {
  const contacts = loadContact();
  const contact = contacts.find((contact) => contact.nama.toLowerCase() === nama.toLowerCase());
  return contact;
}

// menuliskan data baru
const saveContacts = (contacts) => {
  fs.writeFileSync('data/contacts.json', JSON.stringify(contacts))
}


// menambahkan data baru
const addContact = (contact) => {
  const contacts = loadContact();
  contacts.push(contact);
  saveContacts(contacts);
}

// cek nama duplikat
const cekDuplikat = (nama) => {
  const contacts = loadContact()
  return contacts.find((contact) => contact.nama === nama)
}

// hapus contact
const deleteContact = (nama) => {
  const contacts = loadContact();
  const filteredContacts = contacts.filter((contact) => contact.nama != nama)
  saveContacts(filteredContacts)
}

const updateContacts = (contactBaru) => {

  const contacts = loadContact();
  // hilangkan contact lama
  const filteredContacts = contacts.filter((contact) => contact.nama !== contactBaru.oldNama)
  delete contactBaru.oldNama
  filteredContacts.push(contactBaru)
  saveContacts(filteredContacts)
}



module.exports = { loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContacts }