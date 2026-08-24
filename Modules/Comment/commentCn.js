import ApiFeatures, { catchAsync, HandleERROR } from "vanta-api";
import User from "../User/userMd.js";
import Product from "../Product/ProductMd.js";
import Comment from "./commentMd.js";

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Comment, req.query, req.role)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate()
    .populate([
      { path: "userId", select: "phoneNumber fullName role" },
      { path: "productId", select: "title images" },
      {
        path: "replyIds",
        populate: { path: "userId", select: "phoneNumber fullName role" },
      },
    ]);
  const result = await features.execute();
  return res.status(200).json(result);
});
export const getAllCommentOfProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const condition =
    req.role != "admin" && req.role != "superAdmin"
      ? { isPublished: true, productId }
      : { productId };
  const features = new ApiFeatures(Comment, req.query, req.role)
    .addManualFilters(condition)
    .filter()
    .search()
    .sort()
    .limitFields()
    .paginate()
    .populate([
      { path: "userId", select: "phoneNumber fullName" },
      { path: "productId", select: "title images" },
      {
        path: "replyIds",
        populate: { path: "userId", select: "phoneNumber fullName role" },
      },
    ]);
  const result = await features.execute();
  return res.status(200).json(result);
});
export const create = catchAsync(async (req, res, next) => {
  const { rate = null, content, productId } = req.body;
  const { userId, role } = req;
  const user = await User.findById(userId);
  let permissionToRate = false;
  const isBought = !!user.boughtProductIds?.find(
    (item) => item.toString() == productId.toString(),
  );
  if (
    isBought &&
    !user?.ratedProductIds?.find(
      (item) => item.toString() == productId.toString(),
    )
  ) {
    permissionToRate = true;
  }
  const createData = { productId, role, content, userId, isBought };
  if (permissionToRate && rate && rate >= 0 && rate <= 5) {
    createData.rate = rate;
  }
  const comment = await Comment.create(createData);
  if (permissionToRate && createData.rate) {
    const product = await Product.findById(productId);
    product.avgRating = +(
      (product.avgRating * product.ratingCount + rate) /
      (product.ratingCount + 1).toFixed(2)
    );
    product.ratingCount+=1
    await product.save()
    user.ratedProductIds.push(productId)
    await user.save()
  }

  return res.status(201).json({
    success: true,
    data: comment,
    message: "comment Successfully created",
  });
});
export const remove = catchAsync(async (req, res, next) => {
  const comment = Comment.findOne(req.params.id);

  await Comment.findByIdAndDelete(req.params.id);
  await Comment.deleteMany({_id:{$in:[...comment.replyIds,req.params.id]}});
  return res.status(200).json({
    success: true,
    message: "comment Successfully deleted",
  });
});
export const changePublished = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  
  comment.isPublished = !comment.isPublished;
 const newComment= await comment.save();
 
  return res.status(200).json({
    success: true,
    data: newComment,
    message: "comment Successfully updated",
  });
});
export const reply=catchAsync(async (req,res,next) => {
    const {commentId}=req.params
    const {content}=req.body
    const {userId,role}=req
    const comment=await Comment.findById(commentId)
    const isPublished=req.role=='user' ? false:true
    const reply=await Comment.create({
        productId:comment.productId,
        userId,
        isReply:true,
        role,
        content,
        isPublished
    })
comment.replyIds.push(reply._id)
await comment.save()
    return res.status(200).json({
    success: true,
    data: reply,
    message: "comment replied Successfully",
  });
})
