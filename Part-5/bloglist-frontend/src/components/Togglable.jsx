const Togglable = ({ buttonLabel, visible, onToggle, children }) => {
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button type="button" onClick={onToggle}>
          {buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible}>
        {children}
        <button type="button" onClick={onToggle}>
          cancel
        </button>
      </div>
    </div>
  )
}

export default Togglable
