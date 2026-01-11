import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const status = {
    ENABLED: "ENABLED",
    DISABLED: "DISABLED",
    DELETED: "DELETED"
} as const;
export type status = (typeof status)[keyof typeof status];
export type Contact = {
    id: Generated<number>;
    created_time: Generated<Timestamp>;
    updated_time: Timestamp;
    status: Generated<status>;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    notes: string | null;
    verified: Generated<boolean>;
};
export type DB = {
    Contact: Contact;
};
