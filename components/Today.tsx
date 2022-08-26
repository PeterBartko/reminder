interface Props {}

const Today: React.FC<Props> = () => {
  return (
    <div>
      <h1>Today</h1>
      <h2>0 Completed</h2>
      <hr />
      <ul>
        <li>
          <button></button>
          <p>Call accountat</p>
          <p>Reminders - Today</p>
        </li>
      </ul>
    </div>
  )
}

export default Today
