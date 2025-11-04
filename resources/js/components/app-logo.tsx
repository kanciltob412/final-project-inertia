
export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-10 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <img src="/LAVANYA_LOGO_WHITE.svg" alt={import.meta.env.VITE_APP_NAME} className="size-6 object-contain stroke-black dark:stroke-white" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">{import.meta.env.VITE_APP_NAME}</span>
            </div>
        </>
    );
}
