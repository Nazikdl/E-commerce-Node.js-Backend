import express from "express";
import morgan from "morgan";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import { catchError } from "vanta-api";
import userRouter from "./Modules/User/user.js";
import authRouter from "./Modules/Auth/auth.js";
import exportValidation from "./Middlewares/exportValidation.js";
import isLogin from "./Middlewares/isLogin.js";
import isAdmin from "./Middlewares/isAdmin.js";
import uploadRouter from "./Modules/Upload/upload.js";
import brandRouter from "./Modules/Brand/brand.js";
import categoryRouter from "./Modules/Category/category.js";
import sliderRouter from "./Modules/Slider/slider.js";
import variantRouter from "./Modules/Variant/variant.js";
import addressRouter from "./Modules/Address/address.js";
import productRouter from "./Modules/Product/product.js";
import productVariantRouter from "./Modules/ProductVariant/productVariant.js";
import commentRouter from "./Modules/Comment/comment.js";
import searchRouter from "./Modules/Search/search.js";

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/uploads", express.static(`${__dirname}/Public`));

app.use(exportValidation);
app.use("/api/users", isLogin, userRouter);
app.use("/api/auth", authRouter);
app.use("/api/uploads", isAdmin, uploadRouter);
app.use("/api/brands", brandRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/sliders", sliderRouter);
app.use("/api/variants", variantRouter);
app.use("/api/addresses", isLogin, addressRouter);
app.use('/api/products',productRouter)
app.use('/api/product-variants',productVariantRouter)
app.use('/api/comments',commentRouter)
app.use('/api/search',searchRouter)

app.use(catchError);
export default app;
