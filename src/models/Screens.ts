import mongoose ,{Schema ,model , models} from "mongoose";

export interface IScreen{
    screenName : string;
    route : string;
    _id? : mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const screenSchema = new Schema<IScreen>(
    {
        screenName :{type :String , required:true},
        route :{type:String , required:true},
    },
    {
        timestamps :true,
    }
);

const Screen = models?.Screen || model<IScreen>("Screen",screenSchema);
export default Screen;