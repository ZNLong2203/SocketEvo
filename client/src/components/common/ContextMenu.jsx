import React, { useRef, useEffect } from "react";

const ContextMenu = ({ options, cordinates, contextMenu, setContextMenu }) => {
    const contextMenuRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
                setContextMenu(false);
            }
        }
        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        }
    }, [])

    const handleClick = (e, callback) => {
        e.stopPropagation();
        setContextMenu(false);
        callback();
    }

    return (
        <div className={`bg-dropdown-background fixed py-2 z-[100] shadow-xl`} 
            ref={contextMenuRef}
            style={{
                top: cordinates.y,
                left: cordinates.x,
                display: contextMenu ? "block" : "none",
            }}
            > 
            <ul>
                {options.map(({name, callback}) => (
                    <li key={name} 
                        className="text-white text-lg px-5 py-2 hover:bg-dropdown-hover-background cursor-pointer"
                        onClick={(e) => handleClick(e, callback)}
                    >
                        <span className="text-white">{name}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ContextMenu;