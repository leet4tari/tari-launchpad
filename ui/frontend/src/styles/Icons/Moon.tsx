import { SVGProps } from 'react';

const SvgMoon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-testid="svg-moon"
    {...props}
  >
    <path
      d="M13.399 7.646a.308.308 0 0 1 .577 0l.264.735c.031.086.1.154.187.184l.744.26a.301.301 0 0 1 0 .571l-.744.26a.305.305 0 0 0-.187.185l-.264.735a.308.308 0 0 1-.577 0l-.264-.735a.305.305 0 0 0-.187-.184l-.744-.26a.301.301 0 0 1 0-.571l.744-.26a.305.305 0 0 0 .187-.185l.264-.735ZM16.307 10.912c.065-.179.321-.179.386 0l.175.49c.021.058.067.103.125.123l.496.174a.2.2 0 0 1 0 .38l-.496.174a.203.203 0 0 0-.125.123l-.175.49a.205.205 0 0 1-.386 0l-.175-.49a.203.203 0 0 0-.125-.123l-.496-.174a.2.2 0 0 1 0-.38l.496-.174a.203.203 0 0 0 .125-.123l.175-.49ZM17.77 3.292c.139-.39.696-.39.836 0l.478 1.334a.44.44 0 0 0 .27.266l1.35.473a.436.436 0 0 1 0 .826l-1.35.472a.44.44 0 0 0-.27.267l-.478 1.334a.446.446 0 0 1-.837 0l-.478-1.334a.44.44 0 0 0-.27-.267l-1.35-.472a.436.436 0 0 1 0-.826l1.35-.473a.44.44 0 0 0 .27-.266l.478-1.334Z"
      fill="currentColor"
    />
    <path
      d="M3 13.46C3 17.624 6.474 21 10.76 21c3.3 0 6.117-2 7.24-4.822a7.04 7.04 0 0 1-2.93.633c-3.809 0-6.897-3-6.897-6.703 0-1.548.54-2.973 1.448-4.108C5.875 6.535 3 9.671 3 13.46Z"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgMoon;
