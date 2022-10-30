import { useEffect } from "react";
import { Dropdown } from "react-materialize";

export const NavDropdown = (): JSX.Element => {
    useEffect(() => {
        const dropdowns = document.querySelectorAll('.dropdown-trigger');
    
        const options = {
            inDuration: 300,
            outDuration: 300,
            hover: true, // Activate on hover
            coverTrigger: false, // Displays dropdown below the button
        };
        
        M.Dropdown.init(dropdowns, options);
    }, []);
    return (
        <Dropdown
            id="Dropdown_8"
            options={{
                alignment: 'left',
                autoTrigger: true,
                closeOnClick: true,
                constrainWidth: true,
                container: null,
                coverTrigger: true,
                hover: false,
                inDuration: 150,
                onCloseEnd: undefined,
                onCloseStart: undefined,
                onOpenEnd: undefined,
                onOpenStart: undefined,
                outDuration: 250
            }}
            trigger={<div className="dropdown-trigger">Projects</div>}
            >
            <a href="#">
                Figma
            </a>
            <a href="#">
                Travel App
            </a>
        </Dropdown>
    );
}