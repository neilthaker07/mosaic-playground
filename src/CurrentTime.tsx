function CurrentTime() {
  const time = new Date().toLocaleTimeString()

  return <p>Current time is {time}</p>
}

export default CurrentTime
