import React, { useEffect } from "react";

const TawkToChat = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = 'https://embed.tawk.to/674b27722480f5b4f5a62a5d/1idup45v4';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Dọn dẹp khi component bị unmount
    };
  }, []);

  return null; // Không cần render bất kỳ nội dung nào
};

export default TawkToChat;
