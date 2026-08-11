import mongoose from "mongoose";
const commentSchema=new mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    }
},{timestamps:true})
const Comment=mongoose.model('Comment',commentSchema)
export default Comment