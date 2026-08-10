import ApiFeatures, { catchAsync } from "vanta-api";
import Address from "./addressMd.js";

export const getAll=catchAsync(async (req,res,next) => {
  const condition=req.role=='user' ? {userId:req.userId}:{}  
  const feature=new ApiFeatures(Address,req.query,req.role)
  .addManualFilters(condition)
  .filter()
  .search(['title'])
  .sort()
  .limitFields()
  .paginate()
  .populate([{path:'userId',select:'fullName phoneNumber'}])
  const results=await feature.execute()
  return res.status(200).json(results)
})
export const getOne=catchAsync(async (req,res,next) => {
  const condition=req.role=='user' ? {userId:req.userId ,_id:req.params.id}:{_id:req.params.id}  
  const feature=new ApiFeatures(Address,req.query,req.role)
  .addManualFilters(condition)
  .filter()
  .search()
  .sort()
  .limitFields()
  .paginate()
  .populate([{path:'userId',select:'fullName phoneNumber'}])
  const results=await feature.execute()
  return res.status(200).json(results)
})
export const create=catchAsync(async (req,res,next) => {
  const address=await Address.create({...req.body,userId:req.userId})
  return res.status(201).json({
    success:true,
    data:address,
    message:'address created successfully'
  })
})
export const update=catchAsync(async (req,res,next) => {
  const address=await Address.find(req.params.id)
  if(address.userId.toString()!==req.userId && req.role=='user'){
    return next(new Error('you do not have permission to update this address',401))
  }
  const {userId,...otherData}=req.body
  const newAddress=await Address.findOneAndUpdate(req.params.id,otherData,{new:true,runValidators:true})
 return res.status(200).json({
    success:true,
    data:newAddress,
    message:'address updated successfully'
  })
  })
  export const remove=catchAsync(async (req,res,next) => {
    const address=await Address.find(req.params.id)
    if(address.userId.toString()!==req.userId.toString() && req.role=='user'){
      return next(new Error('you do not have permission to delete this address',401))
    }
    await Address.findByIdAndDelete(req.params.id)
    return res.status(200).json({
      success:true,
      message:'address deleted successfully'
    })
  })