export default function OneTwoCard({icon, color = 'primary', title, children}) {
  return (
    <div className={`one-two-card-container`}>
        <i className={`${icon} color-${color}`}/>
        <div>
            <h4>{title}</h4>
            <p>{children}</p>
        </div>
    </div>
  )
}
