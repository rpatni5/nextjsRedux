import { Role, Roles } from "@/lib/role";
import mongoose, { Schema, model, models } from "mongoose";

export interface IPermission {
  screenId: mongoose.Types.ObjectId;
  role: Role;
  permissions: ('read' | 'write' | 'edit' | 'delete')[];
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

const permissionSchema = new Schema<IPermission>(
  {
    screenId: {
      type: Schema.Types.ObjectId,
      ref: 'Screen',
      required: true,
    },
    role: {
      type: String,
      enum : Roles,
      required: true,
    },
    permissions: {
      type: [String],
      enum: ['read', 'write', 'edit', 'delete'],
      required: true,
    },
  },
  { timestamps: true }
);


const Permission = models?.Permission || model<IPermission>('Permission', permissionSchema);
export default Permission;
