const Togglable = ({ buttonLabel, visible, onToggle, children }) => {
  if (!visible) {
    return (
      <div>
        <button type="button" onClick={onToggle}>
          {buttonLabel}
        </button>
      </div>
    )
  }

  return (
    <div>
      {children}
      <button type="button" onClick={onToggle}>
        cancel
      </button>
    </div>
  )
}

export default Togglable
