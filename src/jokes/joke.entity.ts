import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Joke {
    @PrimaryColumn()
    id!: number;

    @Column()
    text!: string; // TODO Store in separate table? Use Migrations
}
