export const UserRoles = { guest: "guest", member: "member" } as const;
export type UserRoles = typeof UserRoles[keyof typeof UserRoles];

export interface UserStore {
    username: string | undefined;
    role: UserRoles;
}