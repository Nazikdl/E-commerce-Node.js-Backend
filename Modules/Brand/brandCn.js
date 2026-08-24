import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import Brand from "./brandMd.js";
import Product from "../Product/ProductMd.js";
import fs from 'fs'
import { __dirname } from "../../app.js";
export const getAll=catchAsync(async(req,res,next)=>{
const condition=req.role!='admin' && req.role!='superAdmin' ? {isPublished:true}:{}
const features=new ApiFeatures(Brand,req.query,req.role)
.addManualFilters(condition)
.filter()
.search(['title'])
.sort()
.limitFields()
.paginate()
const result=await features.execute()
return res.status(200).json(result)
})
export const getOne=catchAsync(async(req,res,next)=>{
const condition=req.role!='admin' && req.role!='superAdmin' ? {isPublished:true, _id:req.params.id}:{ _id:req.params.id}
const features=new ApiFeatures(Brand,req.query,req.role)
.addManualFilters(condition)
const result=await features.execute()
return res.status(200).json(result)
})
export const create=catchAsync(async (req,res,next) => {
    const brand=await Brand.create(req.body)
    return res.status(201).json({
        success:true,
        data:brand,
        message:'brand Successfully created'
    })
    
})
export const remove=catchAsync(async (req,res,next) => {
    const pr=await Product.findOne({brandId:req.params.id})
    if(pr){
        return next(new HandleERROR('this brand used in some product',400))
    }
    const brand=await Brand.findByIdAndDelete(req.params.id)
    if(brand.image && fs.existsSync(`${__dirname}/Public/${brand.image}`)){
        fs.unlinkSync(`${__dirname}/Public/${brand.image}`)
    }
     return res.status(200).json({
        success:true,
        message:'brand Successfully deleted'
    })
    
})
export const update=catchAsync(async (req,res,next) => {
        const brand=await Brand.findById(req.params.id)

if(brand.image && brand?.image!=req?.body?.image){
            fs.unlinkSync(`${__dirname}/Public/${brand.image}`)

}  
const newBrand=await Brand.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
   return res.status(200).json({
        success:true,
        data:newBrand,
        message:'brand Successfully updated'
    })
})