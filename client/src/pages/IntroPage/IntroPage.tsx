// Style import
import "./IntroPage.css";

// Component imports
import ImportVideoForm from "../../shared/components/ImportVideoForm/ImportVideoForm";

const IntroPage = () => {
  return (
    <div className="intro-page">
      <h1>AI Volleyball Video Editor</h1>
      <section>
        <h2>About</h2>
        <p>
          Welcome to the AI Volleyball Video Editor, a tool designed to
          transform raw volleyball footage into polished, YouTube-ready videos.
        </p>
      </section>
      <section>
        <h2>Project Status</h2>
        <p>
          <strong>GitHub Repository:</strong>{" "}
          <a
            href="https://github.com/hobbie71/AI-Volleyball-Video-Editor"
            target="_blank"
            rel="noopener noreferrer">
            https://github.com/hobbie71/AI-Volleyball-Video-Editor
          </a>
        </p>
        <p>
          <strong>Developer:</strong> Javier Tamayo
          <br />
          <strong>Status:</strong> Active development. Features and
          functionality are subject to change.
        </p>
      </section>
      <section>
        <h2>Get Started</h2>
        <p>To begin, please import your video files.</p>
        <ImportVideoForm />
      </section>
    </div>
  );
};

export default IntroPage;
