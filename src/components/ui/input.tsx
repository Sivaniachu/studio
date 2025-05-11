import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    // If the input-gradient-glow-wrapper is desired for specific inputs,
    // it should be added where this Input component is used, or this Input
    // component could accept a prop to conditionally add the wrapper.
    // For now, making it a standard input without the wrapper by default.
    // The HomeSection input explicitly uses the wrapper.
    // Other inputs (like in AddNoteDialog) should be standard.
    
    // Check if a wrapper class is passed, often used for specific styling contexts
    const isWrapped = className?.includes('input-gradient-glow-wrapper');

    if (isWrapped) { // This condition is a bit of a hack, ideally a prop would control this.
        // This path is taken if HomeSection's Input is being rendered
        return (
             <div className="input-gradient-glow-wrapper rounded-full w-full"> {/* Ensure w-full for home input */}
                <input
                type={type}
                className={cn(
                    "flex h-10 w-full rounded-full border-2 border-transparent bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                    className?.replace('input-gradient-glow-wrapper', '') // remove wrapper class from input itself
                )}
                ref={ref}
                {...props}
                />
            </div>
        );
    }

    // Standard input for other uses (e.g., AddNoteDialog title)
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
