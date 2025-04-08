import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
        <h1> Nyaai 2024</h1>
      <div style={styles.linkContainer}>
        <a href="/" style={styles.link}>Home</a>
        <a href="/login" style={styles.link}>Login</a>
        <p style={styles.text}>Made in Mumbai</p>
      </div>
     
    </footer>
  );
};

const styles = {
  footer: {
    borderRadius: "20px",
    backgroundColor: 'black',
    color: 'white',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    margin: "1% 1.5%",
    justifyContent: 'space-between',
  },
  linkContainer: {
    display: 'flex',
    gap: '15px', // Spacing between links
    alignItems:'centre',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '20px',
  },
  text: {
    fontSize: '20px',
  },

  p: {
    margin:'0px',
  }
};

export default Footer;
