import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

const Profile = () => {
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

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#202123',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#2f2f2f',
        borderRadius: '12px',
        padding: '32px',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          margin: '0 auto 24px',
          overflow: 'hidden',
          backgroundColor: '#565869'
        }}>
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt="Profile"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              color: '#ececf1'
            }}>
              {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
        </div>

        <h2 style={{
          color: 'white',
          marginBottom: '16px',
          fontSize: '24px',
          fontWeight: '600'
        }}>
          {user?.displayName || 'No Name'}
        </h2>

        <div style={{ marginBottom: '12px' }}>
          <strong style={{ color: '#ececf1' }}>Email:</strong>
          <p style={{ color: 'white', margin: '4px 0' }}>{user?.email}</p>
        </div>

        <div>
          <strong style={{ color: '#ececf1' }}>User ID:</strong>
          <p style={{
            color: 'white',
            margin: '4px 0',
            fontSize: '14px',
            wordBreak: 'break-all'
          }}>
            {user?.uid}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;