import passport from 'passport';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { GraphQLLocalStrategy } from 'graphql-passport';

const prisma = new PrismaClient();

export function configurePassport() {
  passport.serializeUser((user: any, done) => {
    console.log("Serializing user");
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    console.log("Deserializing user");
    try {
      const user = await prisma.user.findUnique({ where: { id: Number(id) } });
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  passport.use(
    new GraphQLLocalStrategy(async (username: any, password: any, done) => {
      try {
        if (typeof username !== 'string' || typeof password !== 'string') {
          return done(null, false, { info: true, message: 'Invalid credentials' });
        }
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
          return done(null, false, { info: true, message: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { info: true, message: 'Invalid credentials' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );
}
