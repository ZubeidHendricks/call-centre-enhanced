import type { FC, SVGAttributes } from "react";

export type CompanyLogoProps = SVGAttributes<SVGSVGElement>;

export default function CompanyLogo(props: CompanyLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 60"
      {...props}
    >
      <g fill="currentColor">
        <path d="M30,10C13.432,10,0,23.432,0,40s13.432,30,30,30s30-13.432,30-30S46.568,10,30,10z M30,60
          c-11.046,0-20-8.954-20-20s8.954-20,20-20s20,8.954,20,20S41.046,60,30,60z"/>
        <path d="M30,25c-2.757,0-5,2.243-5,5v15c0,2.757,2.243,5,5,5s5-2.243,5-5V30C35,27.243,32.757,25,30,25z"/>
        <circle cx="30" cy="20" r="5"/>
        <path d="M80,15h-10v30h10c8.284,0,15-6.716,15-15S88.284,15,80,15z M80,35h-0.001V25H80c5.514,0,10,4.486,10,10
          S85.514,35,80,35z"/>
        <path d="M110,15h-10v30h10c8.284,0,15-6.716,15-15S118.284,15,110,15z M110,35h-0.001V25H110c5.514,0,10,4.486,10,10
          S115.514,35,110,35z"/>
        <path d="M147.5,25c-8.284,0-15,6.716-15,15v5h30v-5C162.5,31.716,155.784,25,147.5,25z M147.5,35c-2.757,0-5,2.243-5,5
          h10C152.5,37.243,150.257,35,147.5,35z"/>
        <rect x="175" y="15" width="10" height="30"/>
        <polygon points="195,15 195,45 225,45 225,35 205,35 205,15"/>
      </g>
    </svg>
  );
}
