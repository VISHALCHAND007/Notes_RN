import { Model } from "@nozbe/watermelondb";
import { field, readonly, date } from '@nozbe/watermelondb/decorators'

export default class Note extends Model {
    static table = 'notes';

    // static fields = {
    //     note: field('note'), 
    //     description: field('description')
    // };
    // static timestamps = {
    //     createdAt: readonly(date('created_at'))
    // }; 
    @field('note') note; 
    @field('description') description; 
    @readonly @date('created_at') createdAt;
}