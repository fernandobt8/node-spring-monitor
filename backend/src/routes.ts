import express, { NextFunction, Request, Response } from 'express'
import InstancesService from './instances'
import { sign, verify } from 'jsonwebtoken'
import passport from 'passport'
import { Strategy } from 'passport-google-oauth20'

const routes = express.Router()
const instances = new InstancesService()

routes.post('/instances', instances.create)

routes.get('/instances', authenticateToken, instances.list)

routes.get('/instances/:id', instances.get)

routes.get('/redirect/instances/:id', instances.redirectGet)

routes.post('/redirect/instances/:id', instances.redirectPost)

const googleId = '538458025132-gphp355kkkbsbj2s90vpj30o0iu39vnb.apps.googleusercontent.com'
const googleSecret = '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'
const jwtSecret = '3c5a1a89c5333a5c477c5f643417131edded6916e663c8aef31994d979909710'

passport.serializeUser(function (user, done) {
  done(null, user)
})

passport.deserializeUser(function (user, done) {
  done(null, user)
})

passport.use(
  new Strategy(
    {
      clientID: googleId,
      clientSecret: googleSecret,
      callbackURL: '/api/google/callback',
      proxy: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      return done(null, profile)
    }
  )
)

routes.get('/user', authenticateToken, async (req: Request, res: Response) => {
  res.status(200).json(req.user)
})

routes.get('/auth', passport.authenticate('google', { scope: ['email', 'profile'] }))

routes.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
  }),
  function (req, res) {
    res.redirect('/')
  }
)

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  if (req.user) {
    next()
  } else {
    res.sendStatus(401)
  }
}

export default routes
