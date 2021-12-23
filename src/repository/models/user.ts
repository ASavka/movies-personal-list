import { DataTypes, Model, Optional, Sequelize, UUIDV1 } from 'sequelize';
import sequelizeConnection from '../../dbConfig/sequelizeConnection';

enum Role {
  admin = 'admin',
  user = 'user',
}
interface UserAttributes {
  id: string;
  name: string;
  pass: string;
  role: Role;
  favMovies: string[];
}

export interface UserInput extends Optional<UserAttributes, 'favMovies'> {}
export interface UserPatchInput
  extends Optional<UserAttributes, 'id' | 'name' | 'pass' | 'role'> {}
export interface UserOutput extends Required<UserAttributes> {}

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
  public id!: string;
  public name!: string;
  public pass!: string;
  public role!: Role;
  public favMovies!: string[];
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV1,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    pass: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    role: {
      type: DataTypes.TEXT,
    },
    favMovies: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      defaultValue: [],
    },
  },
  {
    sequelize: sequelizeConnection,
  }
);

export default User;
