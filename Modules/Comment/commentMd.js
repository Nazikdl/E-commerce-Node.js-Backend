import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "product is required"],
    },
     userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    replyIds:{
      type:[
         {type:mongoose.Schema.Types.ObjectId,
      ref: "Comment"}
      ],
      default:[]
    },
    isReply:{
      type:Boolean,
      default:false
    },
    content:{
      type:String,
      required:[true,'content is required'],
      trim:true
    },
    isPublished:{
      type:Boolean,
      default:false
    },
    rate:{
      type:Number,
      min:0,
      max:5
    },
    role:{
      type:String,
      enum:['user','admin'],
      default:'user'
    },
    isBought:{
      type:Boolean,
      default:false
    }
  },
  { timestamps: true },
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
