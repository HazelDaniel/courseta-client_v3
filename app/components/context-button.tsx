import { useFetchers, useNavigation } from "@remix-run/react";
import React, { MouseEventHandler, useCallback, useEffect } from "react";

export const ContextButtonHOC = (Child: React.ComponentType<any>) => {
  
  const COMP: React.FC<{
    classes: string[];
    onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
    disabled?: boolean;
    type?: "submit";
  }> = ({ classes, onClick, disabled, type }) => {
    const navigation = useNavigation();
    const fetchers = useFetchers();
    const submittingFetcher = fetchers.find(fetcher => fetcher.state === "submitting");
    const isSubmitting = !!submittingFetcher;
    // console.log("navigation state is ", navigation.state);

    const parseClasses = useCallback(
      () => classes.join(" ") + ` with_loader`,
      [classes]
    );

    return (
      <button
        className={parseClasses()}
        onClick={onClick}
        disabled={disabled || navigation.state === "submitting" || navigation.state === "loading" || isSubmitting}
        type={type}
      >
        <Child />
        <div
          className={`button_loader${
            isSubmitting ? " submitting" : ""
          }`}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
    );
  };

  return COMP;
};

export const ComplexButton: React.FC = () => {
  const MutationButtonContent = ContextButtonHOC(() => <span>hey</span>)({
    classes: ["hello"],
  });
  return MutationButtonContent;
};
