'use client';

import React, { useState } from 'react';
import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import Image from 'next/image';
import { useAppDispatch } from '@/lib/store/hooks';
import { login as loginAction } from "@/lib/store/features/auth/authSlice"

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      // const session = await getSession();

      // if (session?.user) {
      //   dispatch(loginAction({
      //     user: { name: session.user.name , email: session?.user?.email },
      //     token: session?.accessToken || null

      //   }));
      // }

      setMessage("Logged in successfully");
      router.push("/admin/dashboard");
    } else {
      setMessage(res?.error || "Login failed");
    }
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    signIn(provider, { callbackUrl: '/admin/dashboard' });
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <Image
          src="/image.png"
          alt="Login Illustration"
          width={500}
          height={300}
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Sign in to continue to your dashboard</p>

          <div style={styles.socialButtons}>
            <button onClick={() => handleSocialLogin('google')} style={styles.socialBtn}>
              <FcGoogle size={22} style={{ marginRight: '8px' }} />
              Continue with Google
            </button>
            <button onClick={() => handleSocialLogin('github')} style={styles.socialBtn}>
              <FaGithub size={22} style={{ marginRight: '8px' }} />
              Continue with GitHub
            </button>
          </div>

          <div style={styles.divider}>
            <hr style={styles.hr} />
            <span>or</span>
            <hr style={styles.hr} />
          </div>

          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.loginBtn}>Login</button>
          </form>

          {message && <p style={styles.error}>{message}</p>}
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    height: '100vh',
    fontFamily: 'sans-serif',
    background: 'linear-gradient(135deg, #1e293b, #3b82f6, #f0f9ff)',
  },
  leftPanel: {
    flex: 0.7,
    position: 'relative',
    minHeight: '100%',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },

  rightPanel: {
    flex: 1.3,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    padding: '3rem 2.5rem',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '420px',
  },

  title: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
    fontWeight: 700,
    color: '#1f2937',
  },
  subtitle: {
    marginBottom: '1.8rem',
    color: '#6b7280',
  },
  socialButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  socialBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    backgroundColor: '#f9fafb',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background 0.3s ease',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
    color: '#9ca3af',
  },
  hr: {
    flex: 1,
    border: 'none',
    height: '1px',
    backgroundColor: '#e5e7eb',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    fontSize: '1rem',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    outline: 'none',
  },
  loginBtn: {
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#6366f1',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginTop: '0.5rem',
    transition: 'background 0.3s ease',
  },
  error: {
    marginTop: '1rem',
    color: '#dc2626',
  },
};

export default Login;
