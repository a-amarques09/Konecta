import service from '../service.mjs';
import type { Contract } from '../src/prisma/contract';
import type { PostgresClient } from '@prisma/orm-postgres/runtime';

/** The typed Prisma ORM 8 client served by the app's database dependency. */
export type Db = PostgresClient<Contract>;

/**
 * The database client, from the service declaration's database dependency.
 * `service.load()` memoizes, so calling this per request is safe. Server-side
 * only: never import this module from client code.
 */
export function getDb(): Db {
    return service.load().db.client as unknown as Db;
}

export function getService() {
    return service;
}
