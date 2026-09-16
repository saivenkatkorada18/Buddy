import * as React from "react";
import * as LucideIcons from "lucide-react";
import { cn } from "../../lib/utils";

export interface IconProps extends LucideIcons.LucideProps {
  name: keyof typeof LucideIcons;
}

export const Icon: React.FC<IconProps> = ({ name, className, ...props }) => {
  const LucideIcon = LucideIcons[name] as React.FC<LucideIcons.LucideProps>;
  
  if (!LucideIcon) {
    console.warn(`Icon '${name}' does not exist in lucide-react.`);
    return null;
  }

  return <LucideIcon className={cn("inline-block", className)} {...props} />;
};
