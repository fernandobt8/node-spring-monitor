import { Request, Response } from 'express'

import passport from 'passport'
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20'

const googleId = '675874390572-2q2n2bk08uci78ckam33qihslhsgogjt.apps.googleusercontent.com'
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
