import React, { FC, ReactNode } from "react"
import "./TitleBar.less"

import api from "@/api";


type WindowButtonProps = {
    id: string,
    children?: ReactNode
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}
const WindowButton: FC<WindowButtonProps> = ({
    id, children, onClick
}) => (
    <button id={id} onClick={onClick}><div>{children}</div></button>
);


const TitleBar: FC = () => {
    return (
        <div id="titleBar">
            <div id="titleBar-main"></div>
            <div id="titleBar-controls">
                <WindowButton
                    id="minimize"
                    onClick={() => api.minimize()}
                ></WindowButton>
                <WindowButton
                    id="maximize"
                    onClick={() => api.maximize()}
                ></WindowButton>
                <WindowButton
                    id="close"
                    onClick={() => api.close()}
                ></WindowButton>
            </div>
        </div>
    );
};

export default TitleBar;