export default function Switch({title, checked, onClick}) {
  return (
    <div className="accion button-switch-container">
        <button
            className={`btn-switch ${checked && 'active'}`}
            onClick={onClick}
            >
            <span className="btn-switch-bubble"/>
        </button>

        <label>{title}</label>
    </div>
  )
}
