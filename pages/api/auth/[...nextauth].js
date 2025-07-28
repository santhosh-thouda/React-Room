import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../lib/mongodb';

import User from '../../../models/User';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },async authorize(credentials) {
        console.log("👉 Starting authorization");
      
        if (!credentials?.email || !credentials?.password) {
          console.log("❌ Missing email or password");
          throw new Error('Invalid credentials');
        }
      
        console.log("📧 Email received:", credentials.email);
      
        await dbConnect();
        console.log("✅ Connected to MongoDB");
      
        const user = await User.findOne({ email: credentials.email });
      
        if (!user) {
          console.log("❌ No user found with email:", credentials.email);
          throw new Error('Invalid credentials');
        }
      
        if (!user?.hashedPassword) {
          console.log("❌ User found but missing hashedPassword field");
          throw new Error('Invalid credentials');
        }
      
        console.log("🔐 User found. Checking password...");
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
      
        if (!isCorrectPassword) {
          console.log("❌ Incorrect password for user:", credentials.email);
          throw new Error('Invalid credentials');
        }
      
        console.log("✅ Password correct. User authenticated:", user.email);
      
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
      
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  debug: process.env.NODE_ENV === 'development',
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions); 