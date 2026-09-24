import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AnimatedCounterProps {
  value: string | number;
  className?: string;
  duration?: number;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, className = "", duration = 2 }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!nodeRef.current) return;
    
    const stringVal = value.toString();
    // Parse the prefix, number, and suffix (e.g. "$1.5M+" -> prefix "$", num 1.5, suffix "M+")
    const match = stringVal.match(/^([^0-9.-]*)([\d.,]+)([^0-9]*)$/);
    
    if (!match) {
      // If it's not a recognizable number format, just render it statically
      nodeRef.current.innerText = stringVal;
      return;
    }

    const prefix = match[1] || "";
    const numStr = match[2].replace(/,/g, ""); // remove commas for parsing
    const suffix = match[3] || "";
    
    const targetNum = parseFloat(numStr);
    
    if (isNaN(targetNum)) {
      nodeRef.current.innerText = stringVal;
      return;
    }

    const isInt = targetNum % 1 === 0;
    // Count decimal places if any
    const decimalPlaces = isInt ? 0 : (numStr.split(".")[1] || "").length;

    const obj = { val: 0 };
    
    const anim = gsap.to(obj, {
      val: targetNum,
      duration: duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: nodeRef.current,
        start: "top 95%",
        toggleActions: "restart none none none",
      },
      onUpdate: () => {
        if (nodeRef.current) {
          const currentVal = isInt 
            ? Math.floor(obj.val).toLocaleString() 
            : obj.val.toFixed(decimalPlaces);
          nodeRef.current.innerText = `${prefix}${currentVal}${suffix}`;
        }
      }
    });

    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, [value, duration]);

  return <span ref={nodeRef} className={className}>0</span>;
};
