import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();



  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
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
        alignItems: 'center',
        flex: 1
      }}>
        <div style={{
          backgroundColor: '#2f2f2f',
          borderRadius: '12px',
          padding: '40px',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            margin: '0 auto 32px',
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
                fontSize: '48px',
                color: '#ececf1'
              }}>
                {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>

          <h2 style={{
            color: 'white',
            marginBottom: '24px',
            fontSize: '28px',
            fontWeight: '700'
          }}>
            {user?.displayName || 'No Name'}
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <strong style={{ color: '#ececf1' }}>Email:</strong>
            <p style={{ color: 'white', margin: '8px 0 0 0' }}>{user?.email}</p>
          </div>

          <div>
            <strong style={{ color: '#ececf1' }}>User ID:</strong>
            <p style={{
              color: 'white',
              margin: '8px 0 0 0',
              fontSize: '14px',
              wordBreak: 'break-all'
            }}>
              {user?.uid}
            </p>
          </div>

          <button
            onClick={logout}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: '#ff6b6b',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '500',
              cursor: 'pointer',
              marginTop: '32px',
              transition: 'background-color 0.2s ease',
              width: '100%'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e55a5a'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff6b6b'}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;