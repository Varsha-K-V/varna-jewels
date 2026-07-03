import mongoose from "mongoose";

import "@/models/user/User";
import "@/models/category/Category";
import "@/models/product/Product";
import "@/models/cart/Cart";
import "@/models/order/Order";

const connectDB = async ()=>{
    try{

        if(mongoose.connection.readyState >= 1){
            return;
        }
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("MongoDb Conneced");
    }catch(error){
        console.log(error);
    }
}

export default connectDB;
