'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Image from 'next/image';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('User registered successfully');
        router.push("/login");
      } else {
        setMessage(data.error || 'Something went wrong');
      }
    } catch {
      setMessage('Request failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <Image
          src="/image.png"
          alt="Register Illustration"
          width={500}
          height={300}
          style={{ objectFit: 'contain' }}
          priority
        />
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.formCard}>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Register to start managing your passwords</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.loginBtn}>Register</button>
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

export default Register;
