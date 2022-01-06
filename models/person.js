const mongoose=require('mongoose');
const personSchema=new mongoose.Schema({
    name: String,
    post: String,
    date: String,
     img: String,
})

module.exports=mongoose.model('Person',personSchema);
