export const Roles = {
    ADMIN: "admin",
    WORKER: "worker",
  } as const;
  
  export type Role = (typeof Roles)[keyof typeof Roles];
  