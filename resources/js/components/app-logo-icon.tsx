import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(props: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            {...props}
            src="/LAVANYA_LOGO_BLACK.svg"
            alt="Lavanya Logo"
            className={`${props.className || ''}`}
            style={{
                width: '130%',
                height: '130%',
                ...props.style,
            }}
        />
    );
}
