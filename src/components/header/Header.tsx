import { useNavigate } from "react-router-dom";
import { HOME_ROUTE } from "../../utils/constants";

export const Header = (): JSX.Element => {
    const navigate = useNavigate();
    return (
        <div className="flex-container">
            <img 
                onClick={() => navigate(HOME_ROUTE)} 
                className="logo" 
                src="./images/lotuslogo.png" 
                alt="logo"/>
        </div> 
    );
}
