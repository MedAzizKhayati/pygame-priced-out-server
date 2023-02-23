import { GenericEntity } from '@/generics/entity';
import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity({
  name: 'users',
})
export class User extends GenericEntity {
  @Column({
    unique: true,
  })
  username: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    default: 0,
    nullable: false,
  })
  credit: number;

  @Column({
    default: 3,
    nullable: false,
  })
  storage: number;

  @Column({
    nullable: false,
    type: 'longtext',
    transformer: {
      from: (value: string) => JSON.parse(value == "NULL" ? "{}" : value),
      to: (value: { [key: string]: number }) => JSON.stringify(value || {}),
    },
  })
  items: { [key: string]: number };

  @BeforeInsert()
  @BeforeUpdate()
  async updatePassword() {
    this.password = await this.hashPassword(this.password);
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
}
