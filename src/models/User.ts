import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";


export interface IUser {
    name: string;
    lastName?: string;
    email: string;
    password: string;
    dob?: Date;
    designation?: string;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    role?:string;
}

const userSchema = new Schema<IUser>(
    {
      name: { type: String, required: true },
      lastName: { type: String },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      dob: { type: Date },
      designation: { type: String },
      role:{type : String}
    },
    {
      timestamps: true
    }
  )
  

userSchema.pre('save', async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next();
})

const User = models?.User || model("User", userSchema)

export default User;