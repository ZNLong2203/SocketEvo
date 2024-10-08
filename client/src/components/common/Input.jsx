import React from "react";

const Input = ({ name, state, setState, label = false }) => {
    return (
        <div className="flex flex-col gap-2">
            {label && <label htmlFor={name} className="text-teal-light text-lg px-1">{label}</label>}
            <input
                type="text"
                name={name}
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="bg-input-background text-start focus:outline-none text-white h-10 rounded-lg px-5 py-4 w-full"
            />
        </div>
    );
}

export default Input;