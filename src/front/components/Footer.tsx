import React from 'react';

export const Footer: React.FC = (): JSX.Element => (
  <footer className="footer mt-auto py-3 text-center">
    <p>
      Check the{' '}
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://4geeks.com/docs/start/react-flask-template"
      >
        template documentation
      </a>{' '}
      <i className="fa-solid fa-file" /> for help.
    </p>
    <p>
      Made with <i className="fa fa-heart text-danger" /> by{' '}
      <a href="http://www.4geeksacademy.com">4Geeks Academy</a>
    </p>
  </footer>
);
