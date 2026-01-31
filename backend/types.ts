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
export type Restaurant = {
    id: Generated<number>;
    created_time: Generated<Timestamp>;
    updated_time: Timestamp;
    status: Generated<status>;
    name: string;
    address: string | null;
    coordinates: unknown | null;
    phone: string | null;
    website: string | null;
    description: string | null;
    rating: number | null;
};
export type DB = {
    Restaurant: Restaurant;
};
