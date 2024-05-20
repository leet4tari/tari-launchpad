import { SVGProps } from 'react';

const SvgNote = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    data-testid="svg-note"
    {...props}
  >
    <path
      d="m3.353 14.812.73-.175-.73.175Zm0-5.979.73.175-.73-.175Zm17.294 0-.73.175.73-.175Zm0 5.979-.73-.175.73.175Zm-5.597 5.487-.168-.731.168.73Zm-6.1 0-.168.73.168-.73Zm0-16.953.168.73-.168-.73Zm6.1 0-.168.73.168-.73ZM4.082 14.637a12.089 12.089 0 0 1 0-5.63l-1.459-.349a13.589 13.589 0 0 0 0 6.328l1.46-.349Zm15.836-5.63a12.087 12.087 0 0 1 0 5.63l1.459.35a13.588 13.588 0 0 0 0-6.329l-1.46.35Zm-5.036 10.56a12.868 12.868 0 0 1-5.764 0l-.336 1.463c2.117.486 4.32.486 6.436 0l-.336-1.462ZM9.117 4.078a12.865 12.865 0 0 1 5.764 0l.336-1.462a14.365 14.365 0 0 0-6.436 0l.336 1.462Zm0 15.49c-2.506-.575-4.452-2.49-5.036-4.93l-1.459.35c.72 3.005 3.11 5.342 6.16 6.043l.335-1.462Zm6.1 1.463c3.048-.701 5.44-3.038 6.159-6.044l-1.46-.349c-.583 2.44-2.53 4.355-5.036 4.93l.337 1.463Zm-.336-16.953c2.506.576 4.452 2.491 5.036 4.93l1.459-.349c-.72-3.005-3.11-5.342-6.16-6.043l-.335 1.462Zm-6.1-1.462c-3.048.701-5.44 3.038-6.159 6.043l1.46.35c.583-2.44 2.53-4.355 5.035-4.931l-.336-1.462ZM14.831 21c0-1.464.001-2.485.107-3.255.102-.747.29-1.146.582-1.432l-1.05-1.071c-.623.61-.892 1.38-1.018 2.3-.123.895-.121 2.037-.121 3.458h1.5Zm5.491-6.868c-1.45 0-2.612-.002-3.522.118-.93.123-1.71.384-2.33.992l1.05 1.071c.293-.288.706-.474 1.476-.576.79-.104 1.834-.105 3.326-.105v-1.5Z"
      fill="currentColor"
    />
    <path
      d="M9 9h3m-3 3h5"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
    />
  </svg>
);

export default SvgNote;
