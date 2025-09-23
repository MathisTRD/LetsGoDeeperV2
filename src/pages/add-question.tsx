import { useState } from 'react';
import Head from 'next/head';
import styles from '../styles/Admin.module.css';

export default function AddQuestion() {
  const [category, setCategory] = useState('');
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setMessage('✅ Access granted!');
      } else {
        setMessage('❌ Incorrect password');
      }
    } catch (error) {
      setMessage('❌ Authentication error');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!category || !question) {
      setMessage('Please fill in both fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/admin/add-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category, question, password }),
      });

      if (response.ok) {
        setMessage('✅ Question added successfully!');
        setQuestion(''); // Clear the question field
      } else {
        setMessage('❌ Failed to add question');
      }
    } catch (error) {
      setMessage('❌ Error adding question');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <Head>
          <title>Admin Access - Let&apos;s Go Deeper</title>
        </Head>

        <div className={styles.container}>
          <header className={styles.header}>
            <h1>🔒 Admin Access Required</h1>
            <p>Enter the password to add new questions</p>
          </header>

          <div className={styles.addForm}>
            <form onSubmit={handleAuth}>
              <div className={styles.formGroup}>
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.select}
                  placeholder="Enter admin password"
                  required
                />
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={authLoading}
              >
                {authLoading ? 'Checking...' : 'Access Admin Panel'}
              </button>
            </form>

            {message && (
              <div className={styles.message}>
                {message}
              </div>
            )}
          </div>

          <div className={styles.footer}>
            <a href="/questions">← Back to Question Board</a>
            <span> | </span>
            <a href="/">Back to Game</a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Add Question - Let&apos;s Go Deeper</title>
      </Head>

      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Add New Question</h1>
          <p>Add a new conversation starter to the database</p>
        </header>

        <div className={styles.addForm}>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="category">Category:</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={styles.select}
                required
              >
                <option value="">Select a category</option>
                <option value="Just Met">Just Met</option>
                <option value="Friends">Friends</option>
                <option value="Lovers">Lovers</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="question">Question:</label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className={styles.textarea}
                placeholder="Enter your question here..."
                rows={3}
                required
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Question'}
            </button>
          </form>

          {message && (
            <div className={styles.message}>
              {message}
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <a href="/questions">← Back to Question Board</a>
          <span> | </span>
          <a href="/">Back to Game</a>
        </div>
      </div>
    </>
  );
}