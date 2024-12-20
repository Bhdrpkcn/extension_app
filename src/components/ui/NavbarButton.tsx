import { FC } from "react";

type NavbarButtonProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    title: string;
    disabled?: boolean;
    onClick?: () => void;
  };

export const NavbarButton: FC<NavbarButtonProps> = ({ icon: Icon, title, onClick, disabled }) => {
    return (
      <button
        // variant="ghost" // Use the `ghost` variant for minimal styling
        className="flex flex-col items-center w-full text-primary-xSecondary hover:bg-blue-60 hover:text-primary-xTernary h-[55px]"
        onClick={onClick}
        disabled={disabled}
            >
        <Icon size={20} />
        <span className="text-xs mt-1">{title}</span>
      </button>
    );
  };