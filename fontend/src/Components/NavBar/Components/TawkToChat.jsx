import React, { useEffect } from 'react';

function MyComponent() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://embed.tawk.to/674b27722480f5b4f5a62a5d/1idup45v4'; // Adjust the path if necessary
    script.async = true;
    document.body.appendChild(script);

    // Optionally, clean up the script on component unmount
    return () => document.body.removeChild(script);
  }, []);

  // ... rest of your component's code
  return null
}

export default MyComponent;