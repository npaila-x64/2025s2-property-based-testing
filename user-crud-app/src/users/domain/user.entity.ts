export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly age: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
