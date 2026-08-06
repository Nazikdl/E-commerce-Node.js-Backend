import mongoose from "mongoose";
const variantSchema=new mongoose.Schema({
    type:{
        type:String,
        required:[true,'type is already taken'],
        enum:['size','color']
    },
     value:{
        type:String,
        required:[true,'value is already taken'],
        unique:[true,'value is already exist']
    }
},{timestamps:true})
const Variant=mongoose.model('Variant',variantSchema)
export default Variant