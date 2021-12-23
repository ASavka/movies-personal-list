import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../../dbConfig/sequelizeConnection';

interface Rating {
  source: string;
  value: number;
}

interface MovieAttributes {
  id: string;
  title: string;
  year?: number;
  rated?: string;
  released?: string;
  runtime?: string;
  genre?: string[];
  director?: string;
  writer?: string;
  actors?: string[];
  plot?: string;
  language?: string[];
  country?: string[];
  awards?: string;
  poster?: string;
  ratings?: Rating[];
  metascore?: string;
  imdbRating?: string;
  imdbVotes?: string;
  imdbID?: string;
  type?: string;
  dvd?: string;
  boxOffice?: string;
  production?: string;
  website?: string;
  response?: boolean;
  comment?: string;
  personalScore?: number;
}

export interface MovieInput
  extends Optional<MovieAttributes, 'comment' | 'personalScore'> {}
export interface MovieOutput extends Required<MovieAttributes> {}

class Movie
  extends Model<MovieAttributes, MovieInput>
  implements MovieAttributes
{
  public id!: string;
  public title!: string;
  public year!: number;
  public rated!: string;
  public released!: string;
  public runtime!: string;
  public genre!: string[];
  public director!: string;
  public writer!: string;
  public actors!: string[];
  public plot!: string;
  public language!: string[];
  public country!: string[];
  public awards!: string;
  public poster!: string;
  public ratings!: Rating[];
  public metascore!: string;
  public imdbRating!: string;
  public imdbVotes!: string;
  public imdbID!: string;
  public type!: string;
  public dvd!: string;
  public boxOffice!: string;
  public production!: string;
  public website!: string;
  public response!: boolean;
  public comment!: string;
  public personalScore!: number;
}

Movie.init(
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.SMALLINT,
    },
    rated: {
      type: DataTypes.STRING,
    },
    released: {
      type: DataTypes.STRING,
    },
    runtime: {
      type: DataTypes.TEXT,
    },
    genre: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      set(value: string) {
        this.setDataValue('genre', value.split(','));
      },
    },
    director: {
      type: DataTypes.TEXT,
    },
    writer: {
      type: DataTypes.TEXT,
    },
    actors: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      set(value: string) {
        this.setDataValue('actors', value.split(','));
      },
    },
    plot: {
      type: DataTypes.STRING,
    },
    language: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      set(value: string) {
        this.setDataValue('language', value.split(','));
      },
    },
    country: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      set(value: string) {
        this.setDataValue('country', value.split(','));
      },
    },
    awards: {
      type: DataTypes.STRING,
    },
    poster: {
      type: DataTypes.STRING,
    },
    ratings: {
      type: DataTypes.ARRAY(DataTypes.JSON),
    },
    metascore: {
      type: DataTypes.STRING,
    },
    imdbRating: {
      type: DataTypes.STRING,
    },
    imdbVotes: {
      type: DataTypes.STRING,
    },
    imdbID: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    dvd: {
      type: DataTypes.STRING,
    },
    boxOffice: {
      type: DataTypes.STRING,
    },
    production: {
      type: DataTypes.STRING,
    },
    website: {
      type: DataTypes.STRING,
    },
    response: {
      type: DataTypes.BOOLEAN,
    },
    comment: {
      type: DataTypes.TEXT,
    },
    personalScore: {
      type: DataTypes.DECIMAL(2),
    },
  },
  {
    sequelize: sequelizeConnection,
  }
);

export default Movie;
