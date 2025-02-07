import { mySchema } from "./Schema";
import Note from "./NoteModel";
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import { Database } from "@nozbe/watermelondb";

const adapter = new SQLiteAdapter({
    schema: mySchema
})

export const database = new Database({
    adapter, 
    modelClasses: [Note], 
    actionEnabled: true
})