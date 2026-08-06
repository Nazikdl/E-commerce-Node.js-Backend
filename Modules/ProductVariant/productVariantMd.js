import mongoose from "mongoose";
const productVariantSchema=new mongoose.Schema({
    variantId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Variant'
    }
},{timestamps:true})
const ProductVariant=mongoose.model('ProductVariant',productVariantSchema)
export default ProductVariant