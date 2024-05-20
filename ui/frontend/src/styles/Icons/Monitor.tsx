import { SVGProps } from 'react';

const SvgMonitor = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-testid="svg-monitor"
    {...props}
  >
    <path
      d="m3.472 13.554.72-.208-.72.208Zm0-6.647-.72-.209.72.209Zm17.056 0 .72-.209-.72.209Zm0 6.647-.72-.208.72.208Zm-3.713 3.454-.14-.737.14.736Zm-9.63 0 .14-.737-.14.736Zm0-13.555-.14-.736.14.736Zm9.63 0 .14-.736-.14.736ZM3.52 13.721l-.72.209.72-.209Zm16.96 0 .72.209-.72-.209Zm0-6.981-.72.208.72-.208Zm-16.96 0 .72.208-.72-.208Zm9.23 11.183a.75.75 0 0 0-1.5 0h1.5ZM11.25 21a.75.75 0 0 0 1.5 0h-1.5Zm-1.886-.75a.75.75 0 0 0 0 1.5v-1.5Zm5.272 1.5a.75.75 0 1 0 0-1.5v1.5ZM19.76 6.948l.049.167 1.44-.417-.048-.167-1.44.417Zm.049 6.398-.049.167 1.441.417.049-.167-1.441-.417Zm-15.568.167-.048-.167-1.44.417.048.167 1.44-.417Zm-.048-6.398.048-.167-1.44-.417-.049.167 1.441.417Zm0 6.231a11.196 11.196 0 0 1 0-6.231l-1.44-.417a12.695 12.695 0 0 0 0 7.065l1.44-.417Zm15.616-6.231c.59 2.038.59 4.193 0 6.231l1.44.417c.67-2.31.67-4.755 0-7.065l-1.44.417Zm-3.133 9.156a25.039 25.039 0 0 1-9.35 0l-.28 1.473c3.273.622 6.637.622 9.91 0l-.28-1.473ZM7.325 4.19a25.04 25.04 0 0 1 9.35 0l.28-1.474a26.54 26.54 0 0 0-9.91 0l.28 1.473Zm0 12.08c-1.492-.284-2.68-1.358-3.085-2.758l-1.44.417c.567 1.96 2.215 3.428 4.245 3.814l.28-1.473Zm9.63 1.473c2.03-.386 3.678-1.854 4.245-3.814l-1.44-.417c-.406 1.4-1.593 2.474-3.085 2.758l.28 1.473Zm-.28-13.554c1.492.284 2.68 1.358 3.084 2.758l1.441-.417c-.567-1.96-2.215-3.428-4.245-3.814l-.28 1.473Zm-9.63-1.473C5.015 3.103 3.367 4.57 2.8 6.53l1.44.417c.406-1.4 1.593-2.474 3.085-2.758l-.28-1.473Zm4.205 15.206V21h1.5v-3.077h-1.5ZM9.364 21.75h5.272v-1.5H9.364v1.5Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgMonitor;
