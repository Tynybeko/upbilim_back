import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { AuthService } from "../auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService,
    ) {
        super({
            clientID: process.env.GOOGLE_SECRET_ID,
            clientSecret: process.env.GOOGLE_SECRET_KEY,
            callbackURL: process.env.GOOGLE_REDIRECT_URL,
            scope: ['profile', 'email']

        })
    }

    async validate(accesToken: string, refreshToken: string, profile: Profile) {
        console.log(profile);
        const user = await this.authService.googleValidate({ email: profile.emails[0].value, givenName: profile.name.givenName, familyName: profile.name.familyName, id: profile.id, photos: profile.photos })
        return user
    }
}