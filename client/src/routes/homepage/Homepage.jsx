import { Link } from "react-router-dom";
import "./homepage.scss";
import { TypeAnimation } from 'react-type-animation';

const Homepage = () => {

 
  return (
    <div className="homepage">
      <div className="left">
        <h1>SmartAI</h1>
        <h2>The smartest AI model that has been Implemented since years</h2>
        <h3>Will be coming soon..</h3>
        <Link to="/dashboard">Get Started</Link>
      </div>
      <div className="right">
        <div className="imgContainer">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img src="/bot4.png" alt="" className="bot" />
          <div className="chat">
            <img src="/bot4.png" alt="" />
            <TypeAnimation
              sequence={[
                // Same substring at the start will only be typed out once, initially
                "I'm SmartAI, your AI assistant :)",
                1000, // wait 1s before replacing "Mice" with "Hamsters"
                "I can help you with answering questions, solving problems, and providing guidance on various topics.",
                1000,
                "I can generate images for you.",
                1000,
                
              ]}
              wrapper="span"
              speed={50}
              style={{ fontSize: "1em", display: "inline-block" }}
              repeat={Infinity}
            />
          </div>
        </div>
      </div>
      <div className="terms">
        <img src="/logo2.png" alt="" />
        <div className="links">
          <Link to="/">Terms Of Service</Link>
          <span>|</span>
          <Link to="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
