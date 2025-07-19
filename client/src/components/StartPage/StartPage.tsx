import PrettyImportVideoForm from "../PrettyImportVideoForm/PrettyImportVideoForm";

interface Props {
  setIsLoading: (isLoading: boolean) => void;
}

const StartPage = ({ setIsLoading }: Props) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      height: "100vh",
      justifyContent: "center",
      alignContent: "center",
      textAlign: "center",
    }}>
    <h1>Welcome To My Video Editor</h1>

    <p style={{ maxWidth: 400, textAlign: "center", marginBottom: 32 }}>
      Created by: Javier Tamayo
    </p>
    <p style={{ maxWidth: 400, textAlign: "center", marginBottom: 32 }}>
      To get started, import your video(s)!
    </p>
    <PrettyImportVideoForm setIsLoading={setIsLoading} />
  </div>
);

export default StartPage;
