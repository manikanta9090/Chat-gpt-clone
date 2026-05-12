import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        height: '100%',
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
      flexDirection: 'column',
      minHeight: '100%',
      backgroundColor: '#202123',
      padding: '20px'
    }}>
      <button
        onClick={() => navigate('/')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'transparent',
          border: 'none',
          color: '#ececf1',
          fontSize: '16px',
          cursor: 'pointer',
          marginBottom: '20px',
          padding: '8px 0',
          alignSelf: 'flex-start'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#ececf1'}
      >
        ← Back
      </button>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        flex: 1,
        overflowY: 'auto'
      }}>
        <div style={{
          backgroundColor: '#2f2f2f',
          borderRadius: '12px',
          padding: '40px',
          maxWidth: '600px',
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <strong style={{ color: '#ececf1' }}>Email</strong>
              <span style={{ color: 'white' }}>{user?.email || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <strong style={{ color: '#ececf1' }}>Provider</strong>
              <span style={{ color: 'white' }}>{user?.providerData?.[0]?.providerId || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: '#ececf1' }}>Email Verified</strong>
              <span style={{ color: 'white' }}>{user?.emailVerified ? 'Yes' : 'No'}</span>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <strong style={{ color: '#ececf1' }}>Theme</strong>
              <span style={{ color: 'white' }}>Dark</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: '#ececf1' }}>Language</strong>
              <span style={{ color: 'white' }}>English</span>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ color: '#ececf1' }}>Account Created</strong>
              <span style={{ color: 'white' }}>{formatDate(user?.metadata?.creationTime)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;