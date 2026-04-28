import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#202123',
        color: 'white',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#202123',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#2f2f2f',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{
          color: 'white',
          marginBottom: '24px',
          fontSize: '28px',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          Settings
        </h1>

        {/* Account Info Section */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            color: '#ececf1',
            marginBottom: '16px',
            fontSize: '18px',
            fontWeight: '500'
          }}>
            Account Info
          </h2>
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#ececf1' }}>Email:</strong>
            <p style={{ color: 'white', margin: '4px 0' }}>{user?.email || 'N/A'}</p>
          </div>
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#ececf1' }}>Provider:</strong>
            <p style={{ color: 'white', margin: '4px 0' }}>
              {user?.providerData?.[0]?.providerId || 'N/A'}
            </p>
          </div>
          <div>
            <strong style={{ color: '#ececf1' }}>Email Verified:</strong>
            <p style={{ color: 'white', margin: '4px 0' }}>
              {user?.emailVerified ? 'Yes' : 'No'}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          backgroundColor: '#565869',
          margin: '24px 0'
        }} />

        {/* Preferences Section */}
        <div style={{ marginBottom: '24px' }}>
          <h2 style={{
            color: '#ececf1',
            marginBottom: '16px',
            fontSize: '18px',
            fontWeight: '500'
          }}>
            Preferences
          </h2>
          <div style={{ marginBottom: '12px' }}>
            <strong style={{ color: '#ececf1' }}>Theme:</strong>
            <p style={{ color: 'white', margin: '4px 0' }}>Dark</p>
          </div>
          <div>
            <strong style={{ color: '#ececf1' }}>Language:</strong>
            <p style={{ color: 'white', margin: '4px 0' }}>English</p>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px',
          backgroundColor: '#565869',
          margin: '24px 0'
        }} />

        {/* System Info Section */}
        <div>
          <h2 style={{
            color: '#ececf1',
            marginBottom: '16px',
            fontSize: '18px',
            fontWeight: '500'
          }}>
            System Info
          </h2>
          <div>
            <strong style={{ color: '#ececf1' }}>Account Created:</strong>
            <p style={{ color: 'white', margin: '4px 0' }}>
              {formatDate(user?.metadata?.creationTime)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;