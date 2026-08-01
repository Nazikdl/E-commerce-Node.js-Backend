import jwt from "jsonwebtoken"
 const exportValidation=async(req,res,next)=>{
    try {
       const token=req.headers?.authorization?.split(' ')?.at(1)
       if(!token) {
        throw Error('not exist')
       }
       const {_id=null,role=null}=jwt.verify(token,process.env.SECRET_JWT)
        req.role=role
        req.userId=_id
    } catch (error) {
        req.role=null
        req.userId=null
    }
    next()
}
export default exportValidation