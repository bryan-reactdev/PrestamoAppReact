export default function ContentTitleWithInfo({title, subtitle, children}){
    return(
    <div className="contentTitle">
        {title && subtitle && (
            <div>
                <h1>{title}</h1>
                <p>{subtitle}</p>
            </div>
        )}
        {children}
    </div>   
    )
}