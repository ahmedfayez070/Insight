import { Navigate, useLocation } from "react-router-dom";

const Protected = ({ loginPage, isAuthed, children }) => {
  
  const requestedPath = useLocation().pathname
  
  if (!isAuthed) {
    return <Navigate to={loginPage} />;
  }
  return children;
  };
export default Protected;