interface Props {}

const Fav: React.FC<Props> = () => {
  return (
    <svg
      fill="red"
      stroke-width="0"
      viewBox="0 0 512 512"
      color="blue"
      height="22"
      width="22"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="48"
        d="M160 144h288M160 256h288M160 368h288"
      ></path>
      <circle
        cx="80"
        cy="144"
        r="16"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
      ></circle>
      <circle
        cx="80"
        cy="256"
        r="16"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
      ></circle>
      <circle
        cx="80"
        cy="368"
        r="16"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="32"
      ></circle>
    </svg>
  )
}

export default Fav
