import { Request, Response } from 'express'

import passport from 'passport'
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20'

const googleId = '538458025132-gphp355kkkbsbj2s90vpj30o0iu39vnb.apps.googleusercontent.com'
const googleSecret = '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'

passport.serializeUser((user, done) => done(null, user))

passport.deserializeUser((user, done) => done(null, user))

passport.use(
  new Strategy(
    {
      clientID: googleId,
      clientSecret: googleSecret,
      callbackURL: '/api/google/callback',
      proxy: true,
    },
    (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => done(null, profile)
  )
)

export default class GoogleAuth {
  async user(req: Request, res: Response) {
    res.status(200).json(req.user)
  }

  async logout(req: Request, res: Response) {
    req.session = null
    req.logout()
    res.redirect('/')
  }

  auth = passport.authenticate('google', { scope: ['email', 'profile'] })

  callback = [passport.authenticate('google', { failureRedirect: '/' }), (req: Request, res: Response) => res.redirect('/')]
}
