import argon2 from 'argon2';
import { Request, Response } from 'express';
import * as userService from '../services/user-service';
import { encrypt, decrypt } from '../../crypt';

class UsersController {
  async createUser(req: Request, res: Response) {
    req.body.pass = await argon2.hash(req.body.pass);
    if (!req.body.role) {
      req.body.role = 'user';
    }
    userService
      .create(req.body)
      .then((user) => res.status(201).json(user))
      .catch((err) =>
        res
          .status(409)
          .json({ error: `User with name ${req.body.name} exists` })
      );
  }

  async login(req: Request, res: Response) {
    const { name, pass } = req.body;
    userService
      .getByName(name)
      .then((user) =>
        argon2.verify(user.pass, pass).then((matched) => {
          if (!matched) {
            res.status(404).json({ error: 'User or password not found' });
          } else {
            const token = encrypt({ name: user.name, role: user.role });
            res.status(201).json({ token: token });
          }
        })
      )
      .catch((err) =>
        res.status(404).json({ error: 'User or password not found' })
      );
  }

  async getUserByName(req: Request, res: Response) {
    const name = req.params.name;
    if (req.user.name === name || req.user.role === 'admin') {
      userService
        .getByName(name)
        .then((user) => res.status(200).json(user))
        .catch((error) =>
          res.status(404).json({ error: `User ${name} not found` })
        );
    } else {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
  }

  async patch(req: Request, res: Response) {
    const name = req.user.name;
    if (!name) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    let newList: string[] = req.body.favMovies;
    const user = await userService.getByName(name);
    let favMovies = user.favMovies;
    if (newList.every((i) => favMovies.includes(i))) {
      res.status(200).json({ favMovies });
    } else {
      favMovies = [...new Set([...favMovies, ...newList])];
      const numberOfEdited = await userService.patchByName(name, {
        favMovies: favMovies,
      });
      numberOfEdited === 0
        ? res.status(409).json({ message: 'Not edited' })
        : res.status(200).json({ favMovies });
    }
  }
}

export default new UsersController();
